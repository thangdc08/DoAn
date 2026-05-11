/**
 * UI Components barrel export
 * Import từ đây để dùng bất kỳ component nào:
 *
 * @example
 * import { AppButton, AppCard, StatusBadge } from '@/components/ui';
 */
export { AppButton }      from './AppButton';
export { AppCard }        from './AppCard';
export { AppInput }       from './AppInput';
export { AppBadge }       from './AppBadge';
export { StatusBadge }    from './StatusBadge';
export { AppPageHeader }  from './AppPageHeader';

// Re-export types
export type { AppButtonProps, ButtonVariant, ButtonSize } from './AppButton';
export type { AppCardProps }                              from './AppCard';
export type { AppInputProps }                            from './AppInput';
export type { AppBadgeProps, BadgeVariant }              from './AppBadge';
export type { StatusBadgeProps }                         from './StatusBadge';
export type { AppPageHeaderProps }                       from './AppPageHeader';
