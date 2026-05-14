import './DashboardLayout.css';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';

export default function DashboardLayout({ children, activeSection, onSectionChange }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar activeItem={activeSection} onSelect={onSectionChange} />
      <main className="dashboard-layout__main">{children}</main>
    </div>
  );
}
