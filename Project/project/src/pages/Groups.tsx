import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Users, ArrowRight, Trash2, Edit } from 'lucide-react';

interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [] as string[]
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/groups', formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', members: [] });
      fetchGroups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      members: group.members.map(m => m._id)
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;
    try {
      await api.put(`/groups/${editingGroup._id}`, formData);
      setShowEditModal(false);
      setEditingGroup(null);
      setFormData({ name: '', description: '', members: [] });
      fetchGroups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update group');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      await api.delete(`/groups/${id}`);
      fetchGroups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="clay-button clay-button-primary px-6 py-3 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group._id} className="material-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                  {group.description && (
                    <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:text-blue-700 p-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(group._id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Users size={18} />
                  <span className="text-sm font-medium">{group.members.length} members</span>
                </div>
                <p className="text-xs text-gray-500">Created by {group.createdBy.name}</p>
              </div>

              <Link
                to={`/groups/${group._id}`}
                className="w-full clay-button clay-button-primary py-2 px-4 flex items-center justify-center gap-2"
              >
                View Details
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No groups yet. Create your first group!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="clay-button clay-button-primary px-6 py-3 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Group
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="material-card p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Group</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="material-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="material-input w-full"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ name: '', description: '', members: [] });
                    }}
                    className="flex-1 material-input bg-gray-100 hover:bg-gray-200 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 clay-button clay-button-primary py-2"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="material-card p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Edit Group</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="material-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="material-input w-full"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingGroup(null);
                      setFormData({ name: '', description: '', members: [] });
                    }}
                    className="flex-1 material-input bg-gray-100 hover:bg-gray-200 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 clay-button clay-button-primary py-2"
                  >
                    Update
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
