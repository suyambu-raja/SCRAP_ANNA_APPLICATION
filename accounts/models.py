from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from common.models import BaseModel
from phonenumber_field.modelfields import PhoneNumberField

class AccountManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('The Phone Number field must be set')
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', Account.Role.ADMIN)
        return self.create_user(phone_number, password, **extra_fields)

class Account(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Role(models.TextChoices):
        USER = 'USER', 'User'
        COMPANY = 'COMPANY', 'Company'
        MERCHANT = 'MERCHANT', 'Merchant'
        ADMIN = 'ADMIN', 'Admin'

    phone_number = PhoneNumberField(unique=True, db_index=True)
    email = models.EmailField(null=True, blank=True, unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, db_index=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)

    objects = AccountManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []

    def __str__(self):
        return str(self.phone_number)

class UserProfile(BaseModel):
    class LocationType(models.TextChoices):
        CITY = 'CITY', 'City'
        TOWN = 'TOWN', 'Town'
        VILLAGE = 'VILLAGE', 'Village'

    account = models.OneToOneField(Account, on_delete=models.CASCADE, related_name="user_profile")
    name = models.CharField(max_length=150)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    location_type = models.CharField(max_length=20, choices=LocationType.choices, db_index=True)

    def __str__(self):
        return self.name

class CompanyProfile(BaseModel):
    account = models.OneToOneField(Account, on_delete=models.CASCADE, related_name="company_profile")
    company_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)

    def __str__(self):
        return self.company_name

class MerchantProfile(BaseModel):
    class Tier(models.TextChoices):
        SMALL = 'SMALL', 'Small'
        MEDIUM = 'MEDIUM', 'Medium'
        BIG = 'BIG', 'Big'

    class KYCStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        VERIFIED = 'VERIFIED', 'Verified'
        REJECTED = 'REJECTED', 'Rejected'

    account = models.OneToOneField(Account, on_delete=models.CASCADE, related_name="merchant_profile")
    name = models.CharField(max_length=150)
    tier = models.CharField(max_length=20, choices=Tier.choices, db_index=True)
    has_storage = models.BooleanField(default=False)
    recycle_company_verified = models.BooleanField(default=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    onboarding_date = models.DateTimeField(auto_now_add=True)
    free_trial_active = models.BooleanField(default=False)
    free_trial_end_date = models.DateTimeField(null=True, blank=True)
    trust_score = models.DecimalField(max_digits=4, decimal_places=2, default=5.00)
    kyc_status = models.CharField(max_length=20, choices=KYCStatus.choices, default=KYCStatus.PENDING, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['tier', 'has_storage']),
        ]

    def __str__(self):
        return self.name

class AdminProfile(BaseModel):
    account = models.OneToOneField(Account, on_delete=models.CASCADE, related_name="admin_profile")
    sub_role = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Admin Profile for {self.account}"
