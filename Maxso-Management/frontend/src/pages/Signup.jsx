import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../features/authSlice'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referredByCode, setReferredByCode] = useState('')
  
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Pass the new fields to the Redux thunk
    await dispatch(signupUser({ 
      name, 
      email, 
      password, 
      referred_by_code: referredByCode 
    }))
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      
      <label>Name:</label>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
        value={name} 
        required
      />

      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
        required
      />

      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
        required
      />

      <label>Referral Code (Optional):</label>
      <input 
        type="text" 
        onChange={(e) => setReferredByCode(e.target.value)} 
        value={referredByCode} 
        placeholder="Enter code if you have one"
      />

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup