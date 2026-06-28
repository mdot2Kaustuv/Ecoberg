import "./index.css"
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './components/Register';
import {AuthProvider} from './utils/AuthContext.jsx'
import Login from './components/Login'; 
import Quiz from './components/Quiz';
import News from './components/News';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import CarbonHistory from './components/CarbonHistory';
import WorldMap from './components/WorldMap';
import Dashboard from './components/Dashboard';
import EmissionsTable from './components/Localghg';
import Chatbot from './components/Chatbot.jsx'



const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen justify-between">
        <Header/>
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path ="/chatbot" element={<Chatbot/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/carbonhistory" element={<CarbonHistory />} />
            <Route path ="/News" element = {<News/>}/>
            <Route path="/worldmap" element={<WorldMap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/emissions" element={<EmissionsTable />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </AuthProvider>
  )
}
export default App