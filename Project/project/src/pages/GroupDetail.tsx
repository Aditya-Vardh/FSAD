import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Plus, DollarSign, Users, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';

interface Group {
  _id: string;
  name: string;
  description: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: {
    _id: string;
    name: string;
  };
  splitType: 'equal' | 'custom';
  splits: Array<{
    user: {
      _id: string;
      name: string;
    };
    amount: number;
  }>;
  createdAt: string;
}

interface Balance {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  paid: number;
  owes: number;
  net: number;
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Record<string, Balance>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitType: 'equal' as 'equal' | 'custom',
    splits: [] as Array<{ user: string; amount: string }>
  });
  const [settleForm, setSettleForm] = useState({
    toUser: '',
    amount: ''
  });

  useEffect(() => {
    if (id) {
      fetchGroup();
      fetchExpenses();
      fetchBalances();
    }
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await api.get(`/groups/${id}`);
      setGroup(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load group');
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expenses/group/${id}`);
      setExpenses(response.data);
    } catch (err: any) {
      console.error('Failed to load expenses:', err);
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await api.get(`/settlements/balances/${id}`);
      setBalances(response.data);
    } catch (err: any) {
      console.error('Failed to load balances:', err);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expenseData: any = {
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        paidBy: expenseForm.paidBy,
        group: id,
        splitType: expenseForm.splitType
      };

      if (expenseForm.splitType === 'custom') {
        expenseData.splits = expenseForm.splits.map(s => ({
          user: s.user,
          amount: parseFloat(s.amount)
        }));
      }

      await api.post('/expenses', expenseData);
      setShowExpenseModal(false);
      setExpenseForm({
        description: '',
        amount: '',
        paidBy: '',
        splitType: 'equal',
        splits: []
      });
      fetchExpenses();
      fetchBalances();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await api.post('/settlements', {
        fromUser: user.id,
        toUser: settleForm.toUser,
        group: id,
        amount: parseFloat(settleForm.amount)
      });
      setShowSettleModal(false);
      setSettleForm({ toUser: '', amount: '' });
      fetchBalances();
      fetchExpenses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to settle payment');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${expenseId}`);
      fetchExpenses();
      fetchBalances();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  useEffect(() => {
    if (!loading && group) {
      setLoading(false);
    }
  }, [group, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Group not found'}</div>
      </div>
    );
  }

  const userBalances = user ? Object.values(balances).filter(b => b.user._id === user.id) : [];
  const userBalance = userBalances[0];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Groups
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 mt-2">{group.description}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExpenseModal(true)}
              className="clay-button clay-button-primary px-6 py-3 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Expense
            </button>
            <button
              onClick={() => setShowSettleModal(true)}
              className="clay-button clay-button-primary px-6 py-3 flex items-center gap-2"
            >
              <CheckCircle size={20} />
              Settle Up
            </button>
          </div>
        </div>

        {/* Balance Summary Cards */}
        {userBalance && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="clay-card p-6">
              <h3 className="text-gray-600 font-medium mb-2">You Paid</h3>
              <p className="text-2xl font-bold text-blue-600">${userBalance.paid.toFixed(2)}</p>
            </div>
            <div className="clay-card p-6">
              <h3 className="text-gray-600 font-medium mb-2">You Owe</h3>
              <p className="text-2xl font-bold text-red-600">${userBalance.owes.toFixed(2)}</p>
            </div>
            <div className="clay-card p-6">
              <h3 className="text-gray-600 font-medium mb-2">Net Balance</h3>
              <p className={`text-2xl font-bold ${userBalance.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${userBalance.net.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Balances Table */}
        <div className="material-card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Balances</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Member</th>
                  <th className="text-right py-3 px-4">Paid</th>
                  <th className="text-right py-3 px-4">Owes</th>
                  <th className="text-right py-3 px-4">Net</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(balances).map((balance) => (
                  <tr key={balance.user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{balance.user.name}</td>
                    <td className="text-right py-3 px-4 text-blue-600">${balance.paid.toFixed(2)}</td>
                    <td className="text-right py-3 px-4 text-red-600">${balance.owes.toFixed(2)}</td>
                    <td className={`text-right py-3 px-4 font-semibold ${
                      balance.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${balance.net.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses List */}
        <div className="material-card p-6">
          <h2 className="text-xl font-bold mb-4">Expenses</h2>
          {expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{expense.description}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Paid by {expense.paidBy.name} • ${expense.amount.toFixed(2)}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        Split {expense.splitType === 'equal' ? 'equally' : 'custom'}:
                        {expense.splits.map((split, idx) => (
                          <span key={idx} className="ml-2">
                            {split.user.name} (${split.amount.toFixed(2)})
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No expenses yet. Add your first expense!</p>
            </div>
          )}
        </div>

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="material-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="material-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="material-input w-full"
                    required
                    min="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid By</label>
                  <select
                    value={expenseForm.paidBy}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                    className="material-input w-full"
                    required
                  >
                    <option value="">Select member</option>
                    {group.members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
                  <select
                    value={expenseForm.splitType}
                    onChange={(e) => setExpenseForm({
                      ...expenseForm,
                      splitType: e.target.value as 'equal' | 'custom'
                    })}
                    className="material-input w-full"
                  >
                    <option value="equal">Equal Split</option>
                    <option value="custom">Custom Split</option>
                  </select>
                </div>
                {expenseForm.splitType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Splits</label>
                    <div className="space-y-2">
                      {group.members.map((member) => {
                        const split = expenseForm.splits.find(s => s.user === member._id);
                        return (
                          <div key={member._id} className="flex items-center gap-2">
                            <span className="w-32 text-sm">{member.name}</span>
                            <input
                              type="number"
                              step="0.01"
                              value={split?.amount || ''}
                              onChange={(e) => {
                                const newSplits = [...expenseForm.splits];
                                const existing = newSplits.findIndex(s => s.user === member._id);
                                if (existing >= 0) {
                                  newSplits[existing].amount = e.target.value;
                                } else {
                                  newSplits.push({ user: member._id, amount: e.target.value });
                                }
                                setExpenseForm({ ...expenseForm, splits: newSplits });
                              }}
                              className="material-input flex-1"
                              placeholder="0.00"
                              min="0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpenseModal(false);
                      setExpenseForm({
                        description: '',
                        amount: '',
                        paidBy: '',
                        splitType: 'equal',
                        splits: []
                      });
                    }}
                    className="flex-1 material-input bg-gray-100 hover:bg-gray-200 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 clay-button clay-button-primary py-2"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settle Payment Modal */}
        {showSettleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="material-card p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Settle Payment</h2>
              <form onSubmit={handleSettle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pay To</label>
                  <select
                    value={settleForm.toUser}
                    onChange={(e) => setSettleForm({ ...settleForm, toUser: e.target.value })}
                    className="material-input w-full"
                    required
                  >
                    <option value="">Select member</option>
                    {user && Object.values(balances)
                      .filter(b => b.net > 0 && b.user._id !== user.id)
                      .map((balance) => (
                        <option key={balance.user._id} value={balance.user._id}>
                          {balance.user.name} (You owe ${balance.net.toFixed(2)})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settleForm.amount}
                    onChange={(e) => setSettleForm({ ...settleForm, amount: e.target.value })}
                    className="material-input w-full"
                    required
                    min="0.01"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettleModal(false);
                      setSettleForm({ toUser: '', amount: '' });
                    }}
                    className="flex-1 material-input bg-gray-100 hover:bg-gray-200 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 clay-button clay-button-primary py-2"
                  >
                    Settle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
