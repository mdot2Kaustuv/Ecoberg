import { useState } from 'react'
import Home from './components/Home'
import Footer from './components/Footer'
import Login from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import { Routes ,Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './assets/css/app.css'
function App() {
  const [count, setCount] = useState(0)
 return (
  <AuthProvider>
    
    <div>
      <Header />

      <main >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div> 
  </AuthProvider>
);
}

export default App
