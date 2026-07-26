import "./index.css"
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './components/Register';
import {AuthProvider} from './utils/AuthContext.jsx'
import Login from './components/Login'; 
import Quiz from './components/Quiz';
import News from './components/News';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import CarbonHistory from './components/CarbonHistory';
import WorldMap from './components/WorldMap';
import Dashboard from './components/Dashboard';
import EmissionsTable from './components/Localghg';
import Contact from './components/Contact';
import Help from './components/Help';
import Rate from './components/Rate';
import Chatbot from './components/Chatbot.jsx'
import Electricity from './components/Electricitysection.jsx';
import Fuel from './components/Fuelsection.jsx';
import Travel from './components/Travelsection.jsx';
import Hotelsection from './components/Hotelsection';
import Registercompany from './components/Registercompany.jsx';
import CompanyOnboarding from './components/CompanyOnboarding.jsx';
import CompanyDetailsForm from './components/CompanyDetailsForm.jsx';

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen justify-between">
        <Header/>
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registercompany" element={<Registercompany />} />
            <Route path="/register" element={<Register />} />
            <Route path="/electricity" element={<Electricity />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/hotels" element={<Hotelsection />} />
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/rate" element={<Rate />} />
            <Route path="/company-register" element={<CompanyOnboarding />} />
            <Route path="/company-details" element={<CompanyDetailsForm />} />
          </Routes>
        </main>
        <Footer/>
        <Chatbot/>
      </div>
    </AuthProvider>
  )
}
export default App