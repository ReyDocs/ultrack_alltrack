import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import './GradesPage.css';

const gradeOptions = [
  { value: '1.00', label: '1.00 (Excellent)' },
  { value: '1.25', label: '1.25 (Excellent)' },
  { value: '1.50', label: '1.50 (Very Good)' },
  { value: '1.75', label: '1.75 (Very Good)' },
  { value: '2.00', label: '2.00 (Good)' },
  { value: '2.25', label: '2.25 (Good)' },
  { value: '2.50', label: '2.50 (Satisfactory)' },
  { value: '2.75', label: '2.75 (Satisfactory)' },
  { value: '3.00', label: '3.00 (Passing)' },
  { value: '4.00', label: '4.00 (Conditional Failure)' },
  { value: '5.00', label: '5.00 (Failed)' },
  { value: 'INC',  label: 'INC (Incomplete)' },
];

let nextId = 4;

const initialCourses = [
  { id: 1, code: '', units: '3', grade: '1.00' },
  { id: 2, code: '', units: '3', grade: '1.00' },
  { id: 3, code: '', units: '3', grade: '1.00' },
];

export default function GradesPage() {
  const [courses, setCourses] = useState(initialCourses);

  const updateCourse = (id, field, value) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const addCourse = () =>
    setCourses((prev) => [...prev, { id: nextId++, code: '', units: '3', grade: '1.00' }]);

  const removeCourse = (id) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));

  return (
    <DashboardLayout>
      <PageShell>
        <div className="grades-page">
          <div className="grades-card">
            {/* Header */}
            <h2 className="grades-card__title">Course Information</h2>
            <p className="grades-card__desc">
              Input your courses, corresponding units, and final grades to instantly calculate your UP GWA through
              ULTRACK. Course codes are limited to 12 characters, while units may range from 0.25 to 10.
            </p>

            {/* Column headers */}
            <div className="grades-table__header" aria-hidden="true">
              <span className="grades-table__col-course">Course Code</span>
              <span className="grades-table__col-units">Units</span>
              <span className="grades-table__col-grade">Grade</span>
              <span className="grades-table__col-action">Action</span>
            </div>

            {/* Course rows */}
            <div className="grades-table__body" role="list">
              {courses.map((course, index) => (
                <div key={course.id} className="grades-table__row" role="listitem">
                  <div className="grades-table__col-course">
                    <input
                      type="text"
                      className="grades-input grades-input--course"
                      value={course.code}
                      placeholder={`Course ${index + 1}`}
                      maxLength={12}
                      onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                      aria-label={`Course ${index + 1} code`}
                    />
                  </div>
                  <div className="grades-table__col-units">
                    <input
                      type="number"
                      className="grades-input grades-input--units"
                      value={course.units}
                      min="0.25"
                      max="10"
                      step="0.25"
                      onChange={(e) => updateCourse(course.id, 'units', e.target.value)}
                      aria-label={`Course ${index + 1} units`}
                    />
                  </div>
                  <div className="grades-table__col-grade">
                    <div className="grades-select-wrapper">
                      <select
                        className="grades-input grades-select"
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        aria-label={`Course ${index + 1} grade`}
                      >
                        {gradeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="grades-select-arrow" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="grades-table__col-action">
                    <button
                      type="button"
                      className="grades-delete-btn"
                      onClick={() => removeCourse(course.id)}
                      aria-label={`Remove course ${index + 1}`}
                      disabled={courses.length <= 1}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="grades-card__footer">
              <button type="button" className="grades-btn grades-btn--add" onClick={addCourse}>
                <span aria-hidden="true">+</span> Add Course
              </button>
              <button type="button" className="grades-btn grades-btn--calculate">
                Calculate GWA
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
