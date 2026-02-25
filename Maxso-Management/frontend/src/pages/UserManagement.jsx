import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import API_URL from '../config/api';
import styles from '../styles';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const [openActionId, setOpenActionId] = useState(null);
    const [editModalData, setEditModalData] = useState(null);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/admin/users`, {
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

        if (user && user.role === 'admin') {
            fetchUsers();
        } else {
            setError('Access denied. Admins only.');
            setLoading(false);
        }
    }, [user]);

    // Derived State for Filtering & Pagination
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (u.name && u.name.toLowerCase().includes(searchLower)) ||
                (u.email && u.email.toLowerCase().includes(searchLower)) ||
                (u.phone_number && u.phone_number.toLowerCase().includes(searchLower)) ||
                (u.referral_code && u.referral_code.toLowerCase().includes(searchLower))
            );
        });
    }, [users, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

    // Ensure current page is valid when filtering changes total pages
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [filteredUsers.length, totalPages, currentPage]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, currentPage, rowsPerPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const toggleActionMenu = (id) => {
        setOpenActionId(openActionId === id ? null : id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await fetch(`${API_URL}/api/user/admin/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete');
            }
        } catch (err) {
            console.error(err);
        }
        setOpenActionId(null);
    };

    const handleLoginAs = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/user/admin/login-as/${id}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                // Force a full page reload to let the App re-verify the new session cookie
                window.location.href = '/';
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to login as user');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (u) => {
        setEditModalData({ ...u });
        setOpenActionId(null);
    };

    const handleEditChange = (field, value) => {
        setEditModalData({ ...editModalData, [field]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/user/admin/users/${editModalData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editModalData),
                credentials: 'include'
            });
            if (response.ok) {
                const { user: updatedUser } = await response.json();
                setUsers(users.map(u => u.id === editModalData.id ? { ...u, ...updatedUser } : u));
                setEditModalData(null);
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update user');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className={styles.umLoading}>Loading users...</div>;
    if (error) return <div className={styles.umError}>{error}</div>;

    return (
        <div className={styles.umContainer}>
            {/* Header section with Title and Action/Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className={styles.umTitle}>User Management</h2>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto text-white">
                    <div className="bg-[#8b0000] px-4 py-2 rounded-md font-medium text-sm border border-red-900 shadow-lg cursor-pointer flex items-center gap-2 hover:bg-red-700 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Date
                    </div>
                </div>
            </div>

            <div className={styles.umTableWrapper}>
                {/* Search Bar Row inside Table wrapper (optional, or kept outside) */}
                <div className="p-4 border-b border-[#222222] flex items-center justify-between">
                    <div className={styles.searchWrapper}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <table className={styles.umTable}>
                    <thead className={styles.umThead}>
                        <tr>
                            <th scope="col" className={styles.umTh}>S.No</th>
                            <th scope="col" className={styles.umTh}>Name</th>
                            <th scope="col" className={styles.umTh}>Email</th>
                            <th scope="col" className={styles.umTh}>Phone No</th>
                            <th scope="col" className={styles.umTh}>Wallet Address</th>
                            <th scope="col" className={styles.umTh}>Role</th>
                            <th scope="col" className={styles.umTh}>UserCode</th>
                            <th scope="col" className={styles.umTh}>Status</th>
                            <th scope="col" className={styles.umTh}>Created At</th>
                            <th scope="col" className="px-6 py-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((u, index) => (
                            <tr key={u.id} className={styles.umTr}>
                                <td className={styles.umTdBold}>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                <td className={styles.umTd}>{u.name || (u.email.split('@')[0])}</td>
                                <td className={styles.umTd}>{u.email}</td>
                                <td className={styles.umTd}>{u.phone_number || '+919611443729'}</td>
                                <td className={styles.umTd}>{u.wallet_address || '-'}</td>
                                <td className={styles.umTd}>
                                    <span className={`${styles.umRoleBadgeBase} ${u.role === 'admin' ? styles.umRoleAdmin : styles.umRoleUser}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className={`${styles.umTd} font-semibold text-gray-400`}>{u.referral_code}</td>
                                <td className={styles.umTd}>
                                    <label className={styles.switchWrapper}>
                                        <input type="checkbox" className={styles.switchInput} defaultChecked={true} />
                                        <div className={styles.switchBg}></div>
                                    </label>
                                </td>
                                <td className={styles.umTd}>{u.created_at ? new Date(u.created_at).toLocaleString() : '18/2/2026, 9:54:29 pm'}</td>
                                <td className="px-6 py-4 text-center text-gray-500 relative">
                                    <svg
                                        className="w-5 h-5 inline-block cursor-pointer hover:text-white transition-colors"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        onClick={() => toggleActionMenu(u.id)}
                                    >
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>

                                    {openActionId === u.id && (
                                        <div className="absolute right-8 top-8 w-40 bg-[#1a1a1a] border border-[#333] rounded-md shadow-xl z-50 overflow-hidden text-left shadow-2xl">
                                            <div
                                                className="px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white cursor-pointer transition-colors"
                                                onClick={() => handleEditClick(u)}
                                            >
                                                Edit
                                            </div>
                                            <div
                                                className="px-4 py-2 text-sm text-red-500 hover:bg-[#333] hover:text-red-400 cursor-pointer transition-colors border-t border-[#333]"
                                                onClick={() => handleDelete(u.id)}
                                            >
                                                Delete
                                            </div>
                                            <div
                                                className="px-4 py-2 text-sm text-blue-400 hover:bg-[#333] hover:text-blue-300 cursor-pointer border-t border-[#333] transition-colors"
                                                onClick={() => handleLoginAs(u.id)}
                                            >
                                                Login as them
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className={styles.paginationContainer}>
                    <div className="flex items-center gap-2">
                        <span>Rows:</span>
                        <select
                            className={styles.rowsSelect}
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={styles.paginationButton}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            Previous
                        </button>

                        <div className="flex items-center mx-2">
                            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                                // Simple logic to show a few page numbers
                                let pageNum = i + 1;
                                if (currentPage > 2 && totalPages > 4) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i - 1);
                                }

                                return (
                                    <span
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={currentPage === pageNum ? styles.paginationActive : styles.paginationInactive}
                                    >
                                        {pageNum}
                                    </span>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={styles.paginationButton}
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {editModalData && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#333] flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Edit User</h3>
                            <button onClick={() => setEditModalData(null)} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500 transition-colors"
                                    value={editModalData.name || ''}
                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500 transition-colors"
                                    value={editModalData.email || ''}
                                    onChange={(e) => handleEditChange('email', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500 transition-colors"
                                    value={editModalData.phone_number || ''}
                                    onChange={(e) => handleEditChange('phone_number', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Wallet Address</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500 transition-colors"
                                    value={editModalData.wallet_address || ''}
                                    onChange={(e) => handleEditChange('wallet_address', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                <select
                                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500 transition-colors"
                                    value={editModalData.role || 'user'}
                                    onChange={(e) => handleEditChange('role', e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditModalData(null)}
                                    className="px-4 py-2 rounded-md bg-transparent border border-[#444] text-gray-300 hover:bg-[#222] transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-600 transition-colors font-medium text-sm shadow-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;