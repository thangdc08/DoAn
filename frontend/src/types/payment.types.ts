export interface PaymentTransaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  provider: 'MOCK' | 'VNPAY';
  providerTransactionId?: string;
  orderInfo?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'INVALID_CALLBACK';
  paymentUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
  userId: string;
  amount: number;
  provider: 'MOCK' | 'VNPAY';
  venueId?: string;
  ownerId?: string;
}

export interface CreatePaymentResponse {
  transactionId: string;
  bookingId: string;
  amount: number;
  provider: string;
  status: string;
  paymentUrl: string;
}
