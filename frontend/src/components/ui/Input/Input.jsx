import './Input.css';
import { cn } from '../../../utils/cn';

export default function Input({
  id,
  label,
  hint,
  hintElement,
  error,
  className,
  ...props
}) {
  return (
    <div className="input-group">
      {(label || hint || hintElement) && (
        <div className="input-label-row">
          {label && (
            <label htmlFor={id} className="input-label">
              {label}
            </label>
          )}
          {hint && <span className="input-hint">{hint}</span>}
          {hintElement && hintElement}
        </div>
      )}
      <input
        id={id}
        className={cn('input-field', error && 'input-field--error', className)}
        {...props}
      />
      {error && <span className="input-error-msg" role="alert">{error}</span>}
    </div>
  );
}
