import apiClient from './apiClient';

export interface OwnerWallet {
  id: string;
  ownerId: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutRequest {
  id: string;
  ownerId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreatePayoutRequest {
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  notes?: string;
}

export const payoutApi = {
  // Get owner wallet
  getWallet: async (): Promise<OwnerWallet> => {
    const response = await apiClient.get('/payments/api/payouts/wallet');
    return response.data;
  },

  // Submit payout request
  createPayoutRequest: async (data: CreatePayoutRequest): Promise<PayoutRequest> => {
    const response = await apiClient.post('/payments/api/payouts/request', data);
    return response.data;
  },

  // Get owner payout history
  getOwnerHistory: async (): Promise<PayoutRequest[]> => {
    const response = await apiClient.get('/payments/api/payouts/owner/history');
    return response.data;
  },

  // Get all payout requests (Admin)
  getAllRequestsForAdmin: async (): Promise<PayoutRequest[]> => {
    const response = await apiClient.get('/payments/api/payouts/admin/requests');
    return response.data;
  },

  // Approve payout (Admin)
  approvePayout: async (requestId: string, adminNotes: string): Promise<PayoutRequest> => {
    const response = await apiClient.post(`/payments/api/payouts/admin/approve/${requestId}`, { adminNotes });
    return response.data;
  },

  // Reject payout (Admin)
  rejectPayout: async (requestId: string, adminNotes: string): Promise<PayoutRequest> => {
    const response = await apiClient.post(`/payments/api/payouts/admin/reject/${requestId}`, { adminNotes });
    return response.data;
  },

  // Add test funds (Owner testing)
  addTestFunds: async (amount: number = 5000000): Promise<OwnerWallet> => {
    const response = await apiClient.post(`/payments/api/payouts/wallet/add-test-funds?amount=${amount}`);
    return response.data;
  },
};
