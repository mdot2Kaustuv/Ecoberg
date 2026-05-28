  import React from 'react'
  import "./index.css"
  import Header from './components/Header';
  import Footer from './components/Footer';
  import Register from './components/Register';
  import {AuthProvider} from './utils/AuthContext.jsx'
  import Login from './components/Login'; 
  import { Route,Routes } from 'react-router-dom';
  const App = () => {
    return (
 
      <AuthProvider>
        <div className="flex flex-col min-h-screen justify-between">
        <Header/>
        <main className = "grow">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer/>
        </div>
      </AuthProvider>
    )
  }

  export default App