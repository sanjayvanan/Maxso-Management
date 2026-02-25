import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { verifyUser } from './features/authSlice'

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import UserManagement from './pages/UserManagement'

function App() {
  const dispatch = useDispatch();
  const { user, isAuthReady } = useSelector((state) => state.auth);

  // Check the user's session cookie on initial app load
  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  // Don't render routes until we know for sure if they are logged in or out
  if (!isAuthReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <h2>Loading session...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
  path="/admin/users" 
  element={user && user.role === 'admin' ? <UserManagement /> : <Navigate to="/" />} 
/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;