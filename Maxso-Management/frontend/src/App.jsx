import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { verifyUser } from './features/authSlice'

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import UserManagement from './pages/UserManagement'
import styles from './styles'

function App() {
  const dispatch = useDispatch();
  const { user, isAuthReady } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check the user's session cookie on initial app load
  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  // Don't render routes until we know for sure if they are logged in or out
  if (!isAuthReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <h2 className="text-white">Loading session...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user ? (
        // Authenticated Dashboard Layout
        <div className={styles.appWrapper}>
          <Sidebar isOpen={isSidebarOpen} />
          <div className={styles.mainContent}>
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={styles.pageContainer}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/users" element={user.role === 'admin' ? <UserManagement /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        // Unauthenticated Layout (Login/Signup)
        <div className={styles.authContainer}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;