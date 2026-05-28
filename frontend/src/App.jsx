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
            <Route path="/" element={
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-slate-700">Welcome to EcoBerg!</h2>
                  <p className="text-slate-500 mt-2">Click Sign Up in the top right to create an account.</p>
                </div>
              } />
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