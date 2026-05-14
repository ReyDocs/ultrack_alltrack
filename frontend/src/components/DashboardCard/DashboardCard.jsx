import './DashboardCard.css';
import { cn } from '../../utils/cn';

export default function DashboardCard({ className, highlighted, children, ...props }) {
  return (
    <section
      className={cn('dashboard-card', highlighted && 'dashboard-card--highlighted', className)}
      {...props}
    >
      {children}
    </section>
  );
}
