import { App } from 'antd';
import type { ModalFuncProps } from 'antd';

/**
 * useNotify — wrapper tiện lợi cho Ant Design message/modal/notification.
 * Phải dùng bên trong component con của <App> (đã đặt trong App.tsx).
 *
 * Cách dùng:
 *   const { success, error, confirm } = useNotify();
 *   success('Đặt sân thành công!');
 *   confirm({ title: '...', onOk: () => {} });
 */
export function useNotify() {
  const { message, modal, notification } = App.useApp();

  const success = (content: string, duration = 3) =>
    message.success({ content, duration });

  const error = (content: string, duration = 4) =>
    message.error({ content, duration });

  const warning = (content: string, duration = 3) =>
    message.warning({ content, duration });

  const loading = (content: string) => message.loading({ content, duration: 0 });

  const confirm = (props: ModalFuncProps) =>
    modal.confirm({
      centered: true,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      ...props,
    });

  const notify = (type: 'success' | 'info' | 'warning' | 'error', messageText: string, description?: string) =>
    notification[type]({
      message: messageText,
      description,
      placement: 'topRight',
    });

  return { success, error, warning, loading, confirm, notify, message, modal, notification };
}
