// Central service abstraction layer
// To switch from mock services to Django REST API, update these exports to point to real API client modules.

export * from './mockDataService';
export * from './mockAuthService';
export * from './mockMarketPriceService';
export * from './mockOrderService';
export * from './mockIndustryService';
export * from './mockMerchantService';
export * from './mockNotificationService';
export * from './mockMessageService';
export * from './mockAggregatorService';
