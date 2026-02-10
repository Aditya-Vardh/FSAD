import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { DollarSign, TrendingUp, TrendingDown, Users, ArrowRight } from 'lucide-react';

interface DashboardSummary {
  totalOwed: number;
  totalToReceive: number;
  groups: Array<{
    group: {
      id: string;
      name: string;
      description: string;
    };
    balance: number;
    owed: number;
    toReceive: number;
  }>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      setSummary(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Summary Cards with Claymorphism */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Owed</h3>
              <TrendingDown className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-red-600">${summary?.totalOwed.toFixed(2) || '0.00'}</p>
          </div>

          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">To Receive</h3>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-600">${summary?.totalToReceive.toFixed(2) || '0.00'}</p>
          </div>

          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Net Balance</h3>
              <DollarSign className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              ${((summary?.totalToReceive || 0) - (summary?.totalOwed || 0)).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Groups Summary */}
        <div className="material-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
            <Link
              to="/groups"
              className="clay-button clay-button-primary px-4 py-2 flex items-center gap-2"
            >
              <Users size={18} />
              Manage Groups
            </Link>
          </div>

          {summary?.groups && summary.groups.length > 0 ? (
            <div className="space-y-4">
              {summary.groups.map((item) => (
                <div
                  key={item.group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{item.group.name}</h3>
                      {item.group.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.group.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.balance > 0 ? (
                        <p className="text-green-600 font-semibold">
                          You are owed ${item.toReceive.toFixed(2)}
                        </p>
                      ) : item.balance < 0 ? (
                        <p className="text-red-600 font-semibold">
                          You owe ${item.owed.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-gray-600 font-semibold">Settled up</p>
                      )}
                    </div>
                    <Link
                      to={`/groups/${item.group.id}`}
                      className="ml-4 text-purple-600 hover:text-purple-700"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No groups yet. Create your first group to get started!</p>
              <Link
                to="/groups"
                className="clay-button clay-button-primary px-6 py-3 inline-flex items-center gap-2"
              >
                <Users size={18} />
                Create Group
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
