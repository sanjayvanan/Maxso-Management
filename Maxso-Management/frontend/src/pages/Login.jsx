import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/authSlice'
import styles from '../styles'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  const handleSubmit = async (e) => {
    e.preventDefault()

    await dispatch(loginUser({ email, password }))
  }

  return (
    <div className={styles.authContainer}>
      <form
        className={styles.authCard}
        onSubmit={handleSubmit}
      >
        <h3 className={styles.formHeading}>Log In</h3>

        <div className="space-y-4">
          <div>
            <label className={styles.label}>Email address</label>
            <input
              className={`${styles.inputBase} ${error ? styles.inputError : styles.inputNormal}`}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <input
              className={`${styles.inputBase} ${error ? styles.inputError : styles.inputNormal}`}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
        </div>

        <button
          className={styles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        {error && (
          <div className={styles.errorContainer}>
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default Login