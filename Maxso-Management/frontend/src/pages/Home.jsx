import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';
import styles from '../styles';

// Icons
const ChartUpIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.dashWalletIcon}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
  </svg>
);

const PiggyBankIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.dashWalletIcon}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users if admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch simply page 1 with limit 1 just to get the total count for the dashboard stats
        const response = await fetch(`${API_URL}/api/user/admin/users?limit=1`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch users stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Assuming active means role user/admin exist. If you add a status field, update logic below
  const activeUsers = totalUsers;
  const inactiveUsers = 0;

  return (
    <div className="space-y-10 mb-10 w-full max-w-6xl">

      {/* Users Overview Section */}
      <div>
        <h3 className={styles.dashSectionTitle}>Users Overview</h3>
        <div className={styles.dashUsersBlock}>
          <div className={styles.dashUserCard}>
            <div className={styles.dashUserCardContent}>
              <span className={styles.dashUserLabel}>Total Users</span>
              <span className={styles.dashUserValue}>{isLoading ? '...' : totalUsers}</span>
            </div>
          </div>
          <div className={styles.dashUserCard}>
            <div className={styles.dashUserCardContent}>
              <span className={styles.dashUserLabel}>Active Users</span>
              <span className={styles.dashUserValue}>{isLoading ? '...' : activeUsers}</span>
            </div>
          </div>
          <div className={styles.dashUserCard}>
            <div className={styles.dashUserCardContent}>
              <span className={styles.dashUserLabel}>Inactive Users</span>
              <span className={styles.dashUserValue}>{isLoading ? '...' : inactiveUsers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Balance Section */}
      <div>
        <h3 className={styles.dashSectionTitle}>Wallet Balance</h3>
        <div className={styles.dashWalletContainer}>
          <div className={styles.dashWalletCard}>
            <div className={styles.dashWalletHeader}>
              <span className={styles.dashWalletLabel}>Level Income</span>
              <ChartUpIcon />
            </div>
            <span className={styles.dashWalletValue}>$30910.12</span>
          </div>

          <div className={styles.dashWalletCard}>
            <div className={styles.dashWalletHeader}>
              <span className={styles.dashWalletLabel}>ROI Income</span>
              <PiggyBankIcon />
            </div>
            <span className={styles.dashWalletValue}>$61481.33</span>
          </div>

          <div className={styles.dashWalletCard}>
            <div className={styles.dashWalletHeader}>
              <span className={styles.dashWalletLabel}>Direct Referral Income</span>
              <ChartUpIcon />
            </div>
            <span className={styles.dashWalletValue}>$0.00</span>
          </div>
        </div>
      </div>

      {/* Deposit / Withdraw Overview Sections */}
      <div className={styles.dashOverviewContainer}>
        {/* Deposit */}
        <div>
          <h3 className={styles.dashSectionTitle}>Deposit Overview</h3>
          <div className={styles.dashListCard}>
            <div className={styles.dashListItem}>
              <div className={styles.dashListLeft}>
                <div className={styles.dashListIconBox}>
                  <svg className={styles.dashListIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>
                <div className={styles.dashListText}>
                  <span className={styles.dashListLabel}>Deposit Amount</span>
                  <span className={styles.dashListValue}>$300520.00</span>
                </div>
              </div>
            </div>
            <div className={styles.dashListItem}>
              <div className={styles.dashListLeft}>
                <div className={styles.dashListIconBox}>
                  <svg className={styles.dashListIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <div className={styles.dashListText}>
                  <span className={styles.dashListLabel}>Deposit Count</span>
                  <span className={styles.dashListValue}>$88</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw */}
        <div>
          <h3 className={styles.dashSectionTitle}>Withdraw Overview</h3>
          <div className={styles.dashListCard}>
            <div className={styles.dashListItem}>
              <div className={styles.dashListLeft}>
                <div className={styles.dashListIconBox}>
                  <svg className={styles.dashListIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                </div>
                <div className={styles.dashListText}>
                  <span className={styles.dashListLabel}>Total Withdraw</span>
                  <span className={styles.dashListValue}>$56330.65</span>
                </div>
              </div>
            </div>
            <div className={styles.dashListItem}>
              <div className={styles.dashListLeft}>
                <div className={styles.dashListIconBox}>
                  <svg className={styles.dashListIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                </div>
                <div className={styles.dashListText}>
                  <span className={styles.dashListLabel}>Pending Withdraw</span>
                  <span className={styles.dashListValue}>$0</span>
                </div>
              </div>
            </div>
            <div className={styles.dashListItem}>
              <div className={styles.dashListLeft}>
                <div className={styles.dashListIconBox}>
                  <svg className={styles.dashListIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                </div>
                <div className={styles.dashListText}>
                  <span className={styles.dashListLabel}>Success Withdraw</span>
                  <span className={styles.dashListValue}>153</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If not admin, you could optionally render a fallback view or just hide the users overview portion */}
      {user?.role !== 'admin' && (
        <div className="mt-12 text-center text-gray-500 text-sm">
          Only viewing basic dashboard layout. Some stats may be restricted.
        </div>
      )}
    </div>
  );
};

export default Home;