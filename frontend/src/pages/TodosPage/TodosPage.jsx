import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import { useAuth } from '../../context/AuthContext';
import * as tasksApi from '../../api/tasks';
import './TodosPage.css';

const TASK_NAME_MAX_LENGTH = 80;
const PRIORITY_OPTIONS = ['Chill', 'Moderate', 'Critical'];

// Module-level cache to provide instant population on re-navigation
let cachedTasks = null;

export default function TodosPage() {
  // Initialize with cache if available to prevent pop-in
  const [tasks, setTasks] = useState(cachedTasks || []);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [taskPriority, setTaskPriority] = useState('Moderate');
  const [taskError, setTaskError] = useState('');
  const [removingTasks, setRemovingTasks] = useState([]);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const priorityRef = useRef(null);
  const { user, loading: authLoading } = useAuth();

  const openAddTask = () => {
    setIsAddOpen(true);
    setTaskPriority('Moderate');
    setTaskError('');
    setIsPriorityOpen(false);
  };

  const cancelAddTask = () => {
    setIsAddOpen(false);
    setTaskInput('');
    setTaskPriority('Moderate');
    setTaskError('');
    setIsPriorityOpen(false);
  };

  const selectPriority = (priority) => {
    setTaskPriority(priority);
    setIsPriorityOpen(false);
  };

  const handlePriorityKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsPriorityOpen((open) => !open);
    }

    if (event.key === 'Escape') {
      setIsPriorityOpen(false);
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const currentIndex = PRIORITY_OPTIONS.indexOf(taskPriority);
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (currentIndex + delta + PRIORITY_OPTIONS.length) % PRIORITY_OPTIONS.length;
      setTaskPriority(PRIORITY_OPTIONS[nextIndex]);
      setIsPriorityOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPriorityOpen && priorityRef.current && !priorityRef.current.contains(event.target)) {
        setIsPriorityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPriorityOpen]);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      if (!user || authLoading) return;

      try {
        const fetched = await tasksApi.fetchTasks();
        if (!active) return;
        
        const formatted = fetched.map((task) => ({
          id: task.task_id,
          label: task.title,
          priority: task.priority,
        }));

        setTasks(formatted);
        cachedTasks = formatted; // Update cache for next navigation
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const handleAddTask = async (event) => {
    event.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) {
      setTaskError('Task name cannot be empty.');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const createdTask = await tasksApi.createTask({
        title: trimmed.slice(0, TASK_NAME_MAX_LENGTH),
        priority: taskPriority,
      });

      const nextTask = {
        id: createdTask.task_id,
        label: createdTask.title,
        priority: createdTask.priority,
      };

      setTasks((prev) => {
        const updated = [nextTask, ...prev];
        cachedTasks = updated; // Sync cache
        return updated;
      });
      setTaskInput('');
      setTaskPriority('Moderate');
      setTaskError('');
      setIsAddOpen(false);
      setIsPriorityOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      setTaskError('Unable to save task right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeTask = async (id) => {
    if (removingTasks.includes(id)) {
      return;
    }

    setRemovingTasks((prev) => [...prev, id]);

    try {
      await tasksApi.deleteTask(id);
      window.setTimeout(() => {
        setTasks((prev) => {
          const updated = prev.filter((task) => task.id !== id);
          cachedTasks = updated; // Sync cache
          return updated;
        });
        setRemovingTasks((prev) => prev.filter((item) => item !== id));
      }, 220);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setRemovingTasks((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <DashboardLayout>
      <PageShell>
        <div className="todos-page">
          <div className="todos-card">
            <div className="todos-card__header">
              <h2 className="todos-card__title">My tasks</h2>
              <button type="button" className="todos-card__add-btn" aria-label="Add a task" onClick={openAddTask}>
                + Add a task
              </button>
            </div>

            {isAddOpen && (
              <form className="todos-card__add-panel" onSubmit={handleAddTask}>
                <div className="todos-card__field-row">
                  <Input
                    value={taskInput}
                    onChange={(e) => {
                      setTaskInput(e.target.value.slice(0, TASK_NAME_MAX_LENGTH));
                      if (taskError) setTaskError('');
                    }}
                    placeholder="Write a new task"
                    aria-label="New task name"
                    maxLength={TASK_NAME_MAX_LENGTH}
                  />
                  <div className="todos-card__select-wrapper" ref={priorityRef}>
                    <span id="task-priority-label" className="visually-hidden">
                      Task priority
                    </span>
                    <button
                      type="button"
                      className="todos-card__select-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={isPriorityOpen}
                      aria-labelledby="task-priority-label task-priority-value"
                      onClick={() => setIsPriorityOpen((open) => !open)}
                      onKeyDown={handlePriorityKeyDown}
                    >
                      <span id="task-priority-value">{taskPriority}</span>
                    </button>
                    {isPriorityOpen && (
                      <ul className="todos-card__select-options" role="listbox" aria-labelledby="task-priority-label">
                        {PRIORITY_OPTIONS.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              className={`todos-card__select-option${option === taskPriority ? ' todos-card__select-option--active' : ''}`}
                              role="option"
                              aria-selected={option === taskPriority}
                              onClick={() => selectPriority(option)}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="todos-card__actions">
                    <Button type="button" variant="ghost" onClick={cancelAddTask}>
                      Cancel
                    </Button>
                    <Button type="submit">Add</Button>
                  </div>
                </div>
                {taskError && <p className="todos-card__error">{taskError}</p>}
              </form>
            )}

            <ul className="todos-list" role="list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`todos-list__item${removingTasks.includes(task.id) ? ' todos-list__item--removing' : ''}`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={false}
                    className="todos-list__radio"
                    onClick={() => completeTask(task.id)}
                    aria-label={`Complete ${task.label}`}
                  />
                  <span className="todos-list__label-wrapper">
                    <span className="todos-list__label" title={task.label}>
                      {task.label}
                    </span>
                    <span className={`todos-list__priority todos-list__priority--${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
