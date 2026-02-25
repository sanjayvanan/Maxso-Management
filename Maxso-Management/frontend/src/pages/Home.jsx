import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from '../styles'

const Home = () => {
  const user = useSelector((state) => state.auth.user)

  return (
    <div className={styles.homeCard}>
      <h2 className={styles.homeGreeting}>
        Welcome<span className={styles.homeEmail}>{user ? `, ${user.email}` : ''}</span>
      </h2>
      <p className={styles.homeText}>
        You're successfully logged in to Maxso Management.
      </p>

      {user?.role === 'admin' && (
        <div className={styles.homeAdminSection}>
          <h3 className={styles.homeAdminHeading}>Admin Actions</h3>
          <Link
            to="/admin/users"
            className={styles.actionButton}
          >
            Manage Users
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home