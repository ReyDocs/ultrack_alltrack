import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import burnoutGood from '../../assets/dashboard/burnout-good.png';
import burnoutMedjo from '../../assets/dashboard/burnout-medjo.png';
import burnoutEhh from '../../assets/dashboard/burnout-ehh.png';
import { useAuth } from '../../context/AuthContext';
import * as financesApi from '../../api/finances';
import './FinancesPage.css';

const financeStatuses = [
  { key: 'good',  img: burnoutGood,  label: 'GOODS PA' },
  { key: 'mmhm',  img: burnoutMedjo, label: 'MMHM' },
  { key: 'petsa', img: burnoutEhh,   label: 'PETSA DE PELIGRO' },
];

const types = ['Fare', 'Food', 'Others', 'Housing', 'Transport'];
const MAX_BALANCE_DIGITS = 10;
const MAX_COST_VALUE = 99999;

// Module-level cache to provide instant population on re-navigation
let cachedTransactions = null;
let cachedBalance = null;

export default function FinancesPage() {
  const { user, loading: authLoading } = useAuth();
  const [financeStatus, setFinanceStatus] = useState('mmhm');
  const [expenses, setExpenses] = useState(cachedTransactions || []);
  const [totalBalance, setTotalBalance] = useState(cachedBalance !== null ? cachedBalance : 0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(cachedBalance === null);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(cachedBalance !== null ? cachedBalance.toFixed(2) : '0.00');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addExpense, setAddExpense] = useState({ expense: '', type: types[0], cost: '' });
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editExpense, setEditExpense] = useState({ expense: '', type: types[0], cost: '' });
  const [expenseError, setExpenseError] = useState('');
  const [isSubmittingBalance, setIsSubmittingBalance] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const latestBalanceFetchRef = useRef(null);

  useEffect(() => {
    let active = true;
    let fetchId = {};
    latestBalanceFetchRef.current = fetchId;

    async function loadData() {
      // Wait for auth to be fully ready before fetching
      if (!user || authLoading) {
        return;
      }

      try {
        const [txns, balance] = await Promise.all([
          financesApi.fetchTransactions(),
          financesApi.fetchBalance(),
        ]);

        // Only update if this is the latest fetch and component is still mounted
        if (!active || latestBalanceFetchRef.current !== fetchId) return;

        const formattedExpenses = (txns || []).map((txn) => ({
          id: txn.transaction_id,
          expense: txn.expense_desc || '',
          type: txn.type,
          cost: parseFloat(txn.amount),
        }));

        const bal = parseFloat(balance.total_balance);
        const finalBalance = Number.isFinite(bal) ? bal : 0;

        setExpenses(formattedExpenses);
        setTotalBalance(finalBalance);
        setBalanceInput(finalBalance.toFixed(2));
        setIsLoadingBalance(false);

        // Update caches
        cachedTransactions = formattedExpenses;
        cachedBalance = finalBalance;
      } catch (error) {
        console.error('Failed to load finances:', error);
        if (active && latestBalanceFetchRef.current === fetchId) {
          setIsLoadingBalance(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const sanitizeNumericValue = (value, maxIntegerDigits, maxFractionDigits = 2) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const [integer = '', fraction = ''] = cleaned.split('.');
    const limitedInteger = integer.slice(0, maxIntegerDigits);
    const limitedFraction = fraction.slice(0, maxFractionDigits);
    if (cleaned.startsWith('.')) {
      return `0.${limitedFraction}`;
    }
    return limitedFraction ? `${limitedInteger}.${limitedFraction}` : limitedInteger;
  };

  const handleBalanceSave = async () => {
    const parsed = parseFloat(balanceInput.replace(/,/g, ''));
    if (!Number.isFinite(parsed) || parsed < 0) {
      setBalanceInput(totalBalance?.toFixed(2) || '0.00');
      setIsEditingBalance(false);
      return;
    }
    // Calculate required base_balance (Total + Expenses)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
    const targetBaseBalance = parsed + totalExpenses;

    // Store previous balance for rollback
    const previousBalance = totalBalance;

    // Optimistic update: update local state immediately
    setTotalBalance(parsed);
    setBalanceInput(parsed.toFixed(2));
    setIsEditingBalance(false);
    
    // Sync cache
    cachedBalance = parsed;

    setIsSubmittingBalance(true);
    try {
      // Persist to backend - we update the base_balance
      await financesApi.updateBalance(targetBaseBalance);
      // Backend update succeeded, local state remains as updated
    } catch (error) {
      console.error('Failed to save balance:', error);
      // On error, rollback to previous value
      setTotalBalance(previousBalance);
      setBalanceInput(previousBalance?.toFixed(2) || '0.00');
    } finally {
      setIsSubmittingBalance(false);
    }
  };

  const handleBalanceCancel = () => {
    setBalanceInput(totalBalance.toFixed(2));
    setIsEditingBalance(false);
  };

  const openAddExpense = () => {
    setIsAddOpen(true);
    setEditingExpenseId(null);
    setExpenseError('');
  };

  const cancelAddExpense = () => {
    setIsAddOpen(false);
    setAddExpense({ expense: '', type: types[0], cost: '' });
    setExpenseError('');
  };

  const handleExpenseChange = (key, value, mode = 'add') => {
    setExpenseError('');
    if (key === 'cost') {
      value = sanitizeNumericValue(value, 5, 2);
    }
    if (mode === 'edit') {
      setEditExpense((prev) => ({ ...prev, [key]: value }));
      return;
    }
    setAddExpense((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const cost = parseFloat(addExpense.cost);
    if (!addExpense.expense.trim() || !addExpense.type.trim() || !Number.isFinite(cost) || cost <= 0 || cost > MAX_COST_VALUE) {
      setExpenseError('Please enter a valid expense name, type, and cost.');
      return;
    }

    if (isSubmittingExpense) {
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const createdTxn = await financesApi.createTransaction({
        expense_desc: addExpense.expense.trim(),
        type: addExpense.type,
        amount: cost,
      });

      const nextExpense = {
        id: createdTxn.transaction_id,
        expense: createdTxn.expense_desc || '',
        type: createdTxn.type,
        cost: parseFloat(createdTxn.amount),
      };

      setExpenses((prev) => {
        const updated = [nextExpense, ...prev];
        cachedTransactions = updated; // Sync cache
        return updated;
      });
      setTotalBalance((prev) => {
        const next = (prev ?? 0) - nextExpense.cost;
        cachedBalance = next; // Sync cache
        return next;
      });
      setAddExpense({ expense: '', type: types[0], cost: '' });
      setIsAddOpen(false);
      setExpenseError('');
    } catch (error) {
      console.error('Failed to create expense:', error);
      setExpenseError('Unable to save expense right now. Please try again.');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const startEditExpense = (row) => {
    setIsAddOpen(false);
    setEditingExpenseId(row.id);
    setEditExpense({ expense: row.expense, type: row.type, cost: row.cost.toString() });
    setExpenseError('');
  };

  const cancelEditExpense = () => {
    setEditingExpenseId(null);
    setExpenseError('');
  };

  const saveEditExpense = async (e) => {
    e.preventDefault();
    const cost = parseFloat(editExpense.cost);
    if (!editExpense.expense.trim() || !editExpense.type.trim() || !Number.isFinite(cost) || cost <= 0 || cost > MAX_COST_VALUE) {
      setExpenseError('Please enter a valid expense name, type, and cost.');
      return;
    }

    if (isSubmittingExpense) {
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const updatedTxn = await financesApi.updateTransaction(editingExpenseId, {
        expense_desc: editExpense.expense.trim(),
        type: editExpense.type,
        amount: cost,
      });

      setExpenses((prev) => {
        const oldExpense = prev.find((e) => e.id === editingExpenseId);
        const diff = (oldExpense ? oldExpense.cost : 0) - parseFloat(updatedTxn.amount);
        
        setTotalBalance((curr) => {
          const next = (curr ?? 0) + diff;
          cachedBalance = next; // Sync cache
          return next;
        });
        
        const updated = prev.map((expense) =>
          expense.id === editingExpenseId
            ? {
                id: updatedTxn.transaction_id,
                expense: updatedTxn.expense_desc || '',
                type: updatedTxn.type,
                cost: parseFloat(updatedTxn.amount),
              }
            : expense
        );
        cachedTransactions = updated; // Sync cache
        return updated;
      });
      setEditingExpenseId(null);
      setExpenseError('');
    } catch (error) {
      console.error('Failed to update expense:', error);
      setExpenseError('Unable to save expense right now. Please try again.');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const target = expenses.find((e) => e.id === id);
      const amount = target ? target.cost : 0;
      await financesApi.deleteTransaction(id);
      setExpenses((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        cachedTransactions = updated; // Sync cache
        return updated;
      });
      setTotalBalance((prev) => {
        const next = (prev ?? 0) + amount;
        cachedBalance = next; // Sync cache
        return next;
      });
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const formattedBalanceStr = (totalBalance ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 });
  const balanceLength = formattedBalanceStr.length;
  const lengthOffset = Math.max(0, balanceLength - 8);
  const minFontSize = Math.max(28, 52 - (lengthOffset * 3));
  const vwSize = Math.max(4, 6.5 - (lengthOffset * 0.3));
  const maxFontSize = Math.max(40, 80 - (lengthOffset * 5));

  return (
    <DashboardLayout>
      <PageShell>
        <div className="finances-page">

          {/* ── Top row: Balance card + Finance Status ── */}
          <div className="finances-top">
            {/* Balance card */}
            <div className="finances-balance">
              <div className="finances-balance__label-row">
                <span className="finances-balance__label">Total Balance</span>
                <button
                  type="button"
                  className="finances-balance__edit"
                  aria-label="Edit balance"
                  onClick={() => setIsEditingBalance(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
              <div className="finances-balance__amount-row">
                <span className="finances-balance__peso-sign">₱</span>
                {isEditingBalance ? (
                  <div className="finances-balance__edit-row">
                    <Input
                      value={balanceInput}
                      onChange={(e) => setBalanceInput(sanitizeNumericValue(e.target.value, MAX_BALANCE_DIGITS, 2))}
                      className="finances-balance__input"
                      aria-label="Edit total balance"
                      inputMode="decimal"
                      maxLength={MAX_BALANCE_DIGITS + 3}
                    />
                    <div className="finances-balance__edit-actions">
                      <Button type="button" variant="ghost" onClick={handleBalanceCancel}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleBalanceSave}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <span 
                    className={`finances-balance__amount${isLoadingBalance ? ' finances-balance__amount--loading' : ''}`}
                    style={{ 
                      fontSize: `clamp(${minFontSize}px, ${vwSize}vw, ${maxFontSize}px)`,
                      transition: 'font-size 0.3s ease-out',
                      willChange: 'font-size'
                    }}
                  >
                    {isLoadingBalance ? '' : formattedBalanceStr}
                  </span>
                )}
              </div>
            </div>

            {/* Finance Status mood selector */}
            <div className="finances-status">
              <h3 className="finances-status__title">Finance Status</h3>
              <hr className="finances-status__divider" />
              <div className="finances-status__tiles" role="group" aria-label="Finance status">
                {financeStatuses.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`finances-status__tile${financeStatus === s.key ? ' finances-status__tile--active' : ''}`}
                    onClick={() => setFinanceStatus(s.key)}
                    aria-pressed={financeStatus === s.key}
                  >
                    <img src={s.img} alt={s.label} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Finance Tracker table ── */}
          <div className="finances-tracker">
            <div className="finances-tracker__toolbar">
              <div>
                <h3 className="finances-tracker__title">Finance Tracker</h3>
                <hr className="finances-tracker__divider" />
              </div>
              <button
                type="button"
                className="finances-tracker__add-btn"
                onClick={openAddExpense}
                aria-label="Add expense"
              >
                + Add expense
              </button>
            </div>

            {isAddOpen && (
              <form className="finances-tracker__add-panel" onSubmit={handleAddExpense}>
                <div className="finances-tracker__add-grid">
                  <Input
                    value={addExpense.expense}
                    onChange={(e) => handleExpenseChange('expense', e.target.value)}
                    placeholder="Expense name"
                    aria-label="Expense name"
                  />
                  <div className="finances-tracker__select-wrapper">
                    <select
                      className="finances-tracker__select"
                      value={addExpense.type}
                      onChange={(e) => handleExpenseChange('type', e.target.value)}
                      aria-label="Expense type"
                    >
                      {types.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="finances-tracker__select-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={addExpense.cost}
                    onChange={(e) => handleExpenseChange('cost', e.target.value)}
                    placeholder="Cost"
                    aria-label="Expense cost"
                    maxLength={8}
                  />
                  <div className="finances-tracker__add-actions">
                    <button
                      type="button"
                      className="finances-tracker__ghost-btn"
                      onClick={cancelAddExpense}
                    >
                      Cancel
                    </button>
                    <Button type="submit">Add</Button>
                  </div>
                </div>
                {expenseError && <p className="finances-tracker__error">{expenseError}</p>}
              </form>
            )}

            <div className="finances-tracker__header" aria-hidden="true">
              <span>Expense</span>
              <span>Type</span>
              <span className="finances-tracker__header--right">Cost</span>
            </div>

            <ul className="finances-tracker__list" role="list">
              {expenses.map((row) => {
                const isEditing = editingExpenseId === row.id;

                return (
                  <li key={row.id} className="finances-tracker__row">
                    {isEditing ? (
                      <Input
                        value={editExpense.expense}
                        onChange={(e) => handleExpenseChange('expense', e.target.value, 'edit')}
                        className="finances-tracker__inline-input"
                        aria-label="Edit expense name"
                      />
                    ) : (
                      <span className="finances-tracker__expense">{row.expense}</span>
                    )}

                    <div className="finances-tracker__type-cell">
                      {isEditing ? (
                        <div className="finances-tracker__select-wrapper">
                          <select
                            className="finances-tracker__select"
                            value={editExpense.type}
                            onChange={(e) => handleExpenseChange('type', e.target.value, 'edit')}
                            aria-label="Edit expense type"
                          >
                            {types.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <span className="finances-tracker__select-icon" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="finances-tracker__type">{row.type}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </>
                      )}
                    </div>

                    <div className="finances-tracker__cost-cell">
                      {isEditing ? (
                        <div className="finances-tracker__edit-row">
                          <Input
                            type="text"
                            inputMode="decimal"
                            value={editExpense.cost}
                            onChange={(e) => handleExpenseChange('cost', e.target.value, 'edit')}
                            className="finances-tracker__inline-input"
                            aria-label="Edit expense cost"
                            maxLength={8}
                          />
                          <div className="finances-tracker__row-edit-actions">
                            <button
                              type="button"
                              className="finances-tracker__ghost-btn"
                              onClick={cancelEditExpense}
                            >
                              Cancel
                            </button>
                            <Button type="button" onClick={saveEditExpense}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="finances-tracker__cost">P{row.cost}</span>
                          <div className="finances-tracker__row-actions">
                            <button
                              type="button"
                              className="finances-tracker__icon-btn"
                              onClick={() => startEditExpense(row)}
                              aria-label={`Edit ${row.expense}`}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="finances-tracker__icon-btn finances-tracker__icon-btn--danger"
                              onClick={() => deleteExpense(row.id)}
                              aria-label={`Delete ${row.expense}`}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                      {expenseError && isEditing && (
                        <p className="finances-tracker__error finances-tracker__error--row">
                          {expenseError}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
