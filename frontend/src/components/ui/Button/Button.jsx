import './Button.css';
import { cn } from '../../../utils/cn';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      disabled={disabled}
      className={cn(
        'btn',
        `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
