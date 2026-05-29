import "./index.css"
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './components/Register';
import {AuthProvider} from './utils/AuthContext.jsx'
import Login from './components/Login'; 
import Quiz from './components/Quiz';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen justify-between">
        <Header/>
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </AuthProvider>
  )
}
export default App