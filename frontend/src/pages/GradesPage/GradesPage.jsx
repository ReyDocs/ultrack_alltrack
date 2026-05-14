import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import { useAuth } from '../../context/AuthContext';
import * as gradesApi from '../../api/grades';
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

export default function GradesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [gwaResult, setGwaResult] = useState(null);
  const hasLoadedRef = useRef(false);
  const fetchCountRef = useRef(0);
  const isInsertingRef = useRef(false); // New lock to prevent hydration overwrites during inserts

  useEffect(() => {
    let active = true;
    async function loadGrades() {
      // Only run if we have a user, are not loading auth, and haven't loaded yet.
      // We use user?.id to ensure stable dependency checking.
      if (!user?.id || authLoading || hasLoadedRef.current) return;
      
      const currentFetchId = ++fetchCountRef.current;
      hasLoadedRef.current = true; // Lock immediately
      
      try {
        const data = await gradesApi.fetchCourses();
        if (!active || currentFetchId !== fetchCountRef.current) return;
        
        // CRITICAL: If we are currently in the middle of an insert, 
        // we defer or merge carefully to avoid overwriting the optimistic state.
        setCourses(prev => {
          if (isInsertingRef.current) return prev;

          const serverRows = data.map(c => ({
            id: c.id,
            code: c.course_code,
            units: c.units.toString(),
            grade: c.course_grade.toString()
          }));
          
          // If the server returns empty but we have local courses, DO NOT wipe them.
          // This protects against eventual consistency issues or empty fallbacks.
          if (serverRows.length === 0 && prev.length > 0) return prev;

          // Merge: Keep all server rows, plus any local rows not yet synced.
          const serverIds = new Set(serverRows.map(r => r.id));
          const localOnlyRows = prev.filter(c => !serverIds.has(c.id));
          
          return [...serverRows, ...localOnlyRows];
        });
      } catch (error) {
        console.error('Failed to load grades:', error);
        hasLoadedRef.current = false; // Allow retry
      } finally {
        if (active && currentFetchId === fetchCountRef.current) {
          setIsLoading(false);
        }
      }
    }
    loadGrades();
    return () => { active = false; };
  }, [user?.id, authLoading]);

  const updateCourseBackend = useCallback(async (id, field, value) => {
    // DO NOT attempt to update a row that hasn't been created on the backend yet
    if (!id || id.toString().startsWith('temp')) return;

    try {
      const course = courses.find(c => c.id === id);
      if (!course) return;

      const updates = {
        course_code: field === 'code' ? value : course.code,
        units: field === 'units' ? parseFloat(value) : parseFloat(course.units),
        course_grade: field === 'grade' ? parseFloat(value) : parseFloat(course.grade)
      };

      await gradesApi.updateCourse(id, updates);
      setGwaResult(null);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  }, [courses]);

  const updateCourse = (id, field, value) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    // For selects (grade) and units, update backend immediately
    // Only if it's NOT a temporary ID
    if (!id.toString().startsWith('temp') && (field === 'grade' || field === 'units')) {
      updateCourseBackend(id, field, value);
    }
  };

  const handleBlur = (id, field, value) => {
    if (field === 'code' && !id.toString().startsWith('temp')) {
      updateCourseBackend(id, field, value);
    }
  };

  const calculateGWA = async () => {
    setIsCalculating(true);
    try {
      // Map frontend state to backend expected schema
      const payload = courses.map(c => ({
        course_code: c.code,
        units: parseFloat(c.units),
        course_grade: parseFloat(c.grade)
      })).filter(c => !isNaN(c.units) && !isNaN(c.course_grade));

      // Explicitly calling the authoritative backend endpoint with latest state
      const result = await gradesApi.computeGWA(payload);
      setGwaResult(result);
    } catch (error) {
      console.error('Failed to calculate GWA:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const addCourse = async () => {
    const tempId = `temp-${Math.random().toString(36).substring(2, 11)}`;
    const newCourse = {
      id: tempId,
      code: '',
      units: '3',
      grade: '1.00',
      isOptimistic: true
    };

    setCourses((prev) => [...prev, newCourse]);
    setGwaResult(null);

    isInsertingRef.current = true; // Lock hydration during the insert process
    try {
      const created = await gradesApi.createCourse({
        course_code: '',
        units: 3,
        course_grade: 1.0
      });
      
      if (created && created.id) {
        setCourses((prev) => 
          prev.map(c => c.id === tempId ? {
            id: created.id,
            code: created.course_code,
            units: created.units.toString(),
            grade: created.course_grade.toString(),
            isOptimistic: false // No longer optimistic
          } : c)
        );
      }
    } catch (error) {
      console.error('Failed to add course to backend:', error);
      // TEST: Disable removal to see if it stays
      // setCourses((prev) => prev.filter(c => c.id !== tempId));
    } finally {
      isInsertingRef.current = false; // Release lock
    }
  };

  const removeCourse = async (id) => {
    try {
      if (!id.toString().startsWith('temp')) {
        await gradesApi.deleteCourse(id);
      }
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setGwaResult(null);
    } catch (error) {
      console.error('Failed to remove course:', error);
    }
  };

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
                       onBlur={(e) => handleBlur(course.id, 'code', e.target.value)}
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
              <button type="button" className="grades-btn grades-btn--calculate" onClick={calculateGWA} disabled={isCalculating}>
                {isCalculating ? 'Calculating...' : 'Calculate GWA'}
              </button>
            </div>
          </div>

          {/* GWA Result Card */}
          {gwaResult && (
            <div className="grades-result">
              <span className="grades-result__label">Your GWA</span>
              <div className="grades-result__value">
                {gwaResult.gwa !== null ? parseFloat(gwaResult.gwa).toFixed(4) : '0.0000'}
              </div>
              <p className="grades-result__desc">
                Based on {gwaResult.course_count} course{gwaResult.course_count !== 1 ? 's' : ''} in your academic records.
                Keep up the great work!
              </p>
            </div>
          )}
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
