import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API_URL from '../config/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/admin/users`, {
          // This ensures your httpOnly cookie (token) is sent to verify admin status
          credentials: 'include', 
        });
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch users');
        }

        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Only fetch if the user is an admin
    if (user && user.role === 'admin') {
      fetchUsers();
    } else {
      setError('Access denied. Admins only.');
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Total Users: {users.length}
        </span>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">S.No (ID)</th>
              <th scope="col" className="px-6 py-4">Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Role</th>
              <th scope="col" className="px-6 py-4">Referral Code</th>
              <th scope="col" className="px-6 py-4 text-center">Referrals</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr 
                key={u.id} 
                className="bg-white border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{u.id}</td>
                <td className="px-6 py-4">{u.name || 'N/A'}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-gray-600">{u.referral_code}</td>
                <td className="px-6 py-4 text-center font-semibold text-gray-700">{u.referral_count}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;