import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./components/Register";
import { AuthProvider } from "./utils/AuthContext.jsx";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import News from "./components/News";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";

// Fixed Linux case-sensitive imports
import ForgotPassword from "./components/forgotpassword";
import ResetPassword from "./components/resetpassword";
import ChangePassword from "./components/changepassword";
import CarbonHistory from "./components/carbonhistory";

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen justify-between">
        <Header />

        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:uid/:token/"
              element={<ResetPassword />}
            />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/carbonhistory" element={<CarbonHistory />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;