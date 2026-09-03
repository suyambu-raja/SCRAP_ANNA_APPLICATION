import { getDb, simulateNetwork } from './mockDataService';
import type { User, DemoAccount, UserRole } from '@/types';

export interface VerifyOTPResponse {
  user: User | null;
  isNewUser: boolean;
  token: string;
}

export interface RoleRegistrationData {
  phone: string;
  role: UserRole;
  name: string;
  email?: string;
  address?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  language?: 'en' | 'ta';
  // Role specific
  businessName?: string;
  companyName?: string;
  contactPerson?: string;
  organizationName?: string;
  yearsInBusiness?: string;
  locationPin?: string;
  panUploaded?: boolean;
  aadhaarUploaded?: boolean;
  shopProofUploaded?: boolean;
  ownerPhotoUploaded?: boolean;
  gstinUploaded?: boolean;
  tradeLicenseUploaded?: boolean;
  directIndustryConnection?: boolean;
  hasVehicle?: boolean;
  vehicleCount?: number;
  vehicleType?: string;
  vehicleCapacity?: string;
  preferredAreas?: string[];
  categoriesHandled?: string[];
  upiId?: string;
  bankAccount?: string;
  ifsc?: string;
  dailyCapacityTons?: string;
}

export async function getDemoAccounts(): Promise<DemoAccount[]> {
  return simulateNetwork(() => {
    return getDb().demo_accounts.accounts;
  });
}

/**
 * Normalizes phone numbers for consistent matching (e.g. "9876543210" -> "+919876543210")
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return phone;
}

/**
 * Step 1: Request Mobile OTP
 */
export async function sendMobileOTP(phone: string): Promise<{ success: boolean; message: string }> {
  return simulateNetwork(() => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }
    return {
      success: true,
      message: 'OTP sent successfully to ' + phone,
    };
  });
}

/**
 * Step 2: Verify Mobile OTP & automatically detect existing user vs new user
 */
export async function verifyMobileOTP(
  phone: string,
  otp: string
): Promise<VerifyOTPResponse> {
  return simulateNetwork(() => {
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      throw new Error('Invalid OTP. Please enter a valid 6-digit code.');
    }

    const normPhone = normalizePhone(phone);
    const db = getDb();

    // Check if phone belongs to an existing user
    const existingUser = db.users.find((u) => {
      return normalizePhone(u.phone) === normPhone;
    });

    if (existingUser) {
      return {
        user: existingUser,
        isNewUser: false,
        token: `mock-jwt-${existingUser.id}-${Date.now()}`,
      };
    }

    // New user — verified phone, proceeds to user-type and registration
    return {
      user: null,
      isNewUser: true,
      token: `temp-token-${Date.now()}`,
    };
  });
}

/**
 * Step 4: Complete role-based registration for new users
 */
export async function registerRoleUser(data: RoleRegistrationData): Promise<{ user: User; token: string }> {
  return simulateNetwork(() => {
    const db = getDb();
    const normPhone = normalizePhone(data.phone);

    const displayName =
      data.role === 'merchant' && data.businessName
        ? data.businessName
        : data.role === 'industry' && data.companyName
        ? data.companyName
        : data.name;

    const newUser: User = {
      id: `USR${String(db.users.length + 1).padStart(3, '0')}`,
      role: data.role,
      name: displayName,
      email: data.email || `${data.role}_${Date.now()}@billscrap.in`,
      phone: normPhone,
      language: data.language || 'en',
      location: {
        address: data.address,
        area: data.area || 'Guindy',
        city: data.city || 'Chennai',
        state: data.state || 'Tamil Nadu',
        pincode: data.pincode || '600032',
      },
      avatar: null,
      verified: true,
      status: 'active',
    };

    db.users.push(newUser);

    return {
      user: newUser,
      token: `mock-jwt-${newUser.id}-${Date.now()}`,
    };
  });
}

export async function loginWithCredentials(
  emailOrLogin: string,
  password: string
): Promise<{ user: User; token: string }> {
  return simulateNetwork(() => {
    const db = getDb();
    const demo = db.demo_accounts.accounts.find(
      (a) => a.login.toLowerCase() === emailOrLogin.toLowerCase() && a.password === password
    );

    let user: User | undefined;
    if (demo) {
      user = db.users.find((u) => u.id === demo.userId);
    } else {
      user = db.users.find((u) => u.email.toLowerCase() === emailOrLogin.toLowerCase());
      if (user && (password === 'demo123' || password === 'password123')) {
        // match
      } else {
        user = undefined;
      }
    }

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return {
      user,
      token: `mock-jwt-${user.id}-${Date.now()}`,
    };
  });
}

export async function verifyUserOTP(
  phone: string,
  otp: string
): Promise<{ verified: boolean; user: User | null; isNewUser: boolean }> {
  const res = await verifyMobileOTP(phone, otp);
  return { verified: true, user: res.user, isNewUser: res.isNewUser };
}

export async function resendUserOTP(phone: string): Promise<{ sent: boolean }> {
  await sendMobileOTP(phone);
  return { sent: true };
}

export async function getUserById(userId: string): Promise<User | null> {
  return simulateNetwork(() => {
    return getDb().users.find((u) => u.id === userId) || null;
  });
}
