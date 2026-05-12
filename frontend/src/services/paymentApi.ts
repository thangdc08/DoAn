import apiClient from './apiClient';
import type {
  PaymentTransaction,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from '../types/payment.types';

export const paymentApi = {
  // Create payment transaction
  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    const response = await apiClient.post('/payments/create', data);
    return response.data;
  },

  // Get payment transaction detail
  getPaymentById: async (transactionId: string): Promise<PaymentTransaction> => {
    const response = await apiClient.get(`/payments/${transactionId}`);
    return response.data;
  },

  // Mock payment callback (for testing)
  mockPaymentCallback: async (transactionId: string, success: boolean): Promise<void> => {
    await apiClient.post('/payments/mock/callback', {
      transactionId,
      success,
    });
  },
};
