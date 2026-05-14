import dashboardImg from '../../assets/dashboard-preview.png';
import './DashboardPreview.css';

export default function DashboardPreview() {
  return (
    <section className="dashboard-preview" aria-label="App dashboard preview">
      <div className="dashboard-preview__frame">
        <img
          src={dashboardImg}
          alt="ULTRACK dashboard showing the Internship Resume Generator and Pomodoro timer features"
          className="dashboard-preview__img"
          loading="eager"
          draggable="false"
        />
      </div>
    </section>
  );
}
