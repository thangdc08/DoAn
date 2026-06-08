import { useEffect } from 'react';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook tự động xin quyền truy cập vị trí và đồng bộ lên backend.
 * Chỉ gọi khi user đã đăng nhập.
 * - Thành công: gửi PATCH /me/location và cập nhật authStore
 * - Thất bại / từ chối: không gây lỗi, chỉ bỏ qua
 */
export function useGeoLocation() {
  const { user, isAuthenticated, updateUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Tránh gửi lại nếu tọa độ chưa thay đổi đáng kể (< 10m)
        if (
          user.latitude != null &&
          user.longitude != null &&
          Math.abs(user.latitude - latitude) < 0.0001 &&
          Math.abs(user.longitude - longitude) < 0.0001
        ) {
          return;
        }

        try {
          const updated = await authApi.updateLocation(latitude, longitude);
          updateUser({ ...user, ...updated });
        } catch {
          // Silently ignore — location is best-effort
        }
      },
      () => {
        // Người dùng từ chối hoặc thiết bị không hỗ trợ — không sao
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 }
    );
  }, [isAuthenticated, user?.id]); // Chỉ chạy lại khi user thay đổi
}
