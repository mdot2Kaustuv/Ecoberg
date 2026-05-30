import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );

    const [loading] = useState(false);
    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/account/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/");
            Swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 4000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            Swal.fire({
                title: "Incorrect email or password",
                icon: "error",
                toast: true,
                timer: 4000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/account/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password, password2 }),
        });

        const data = await response.json();

        if (response.status === 201) {
            navigate("/login");
            Swal.fire({
                title: "Registration Successful! Please log in.",
                icon: "success",
                toast: true,
                timer: 4000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            // Extract actual error messages from Django
            let errorMsg = "Registration failed. Please try again.";
            if (data) {
                const messages = Object.values(data).flat();
                if (messages.length > 0) errorMsg = messages.join(" ");
            }
            Swal.fire({
                title: errorMsg,
                icon: "error",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
        Swal.fire({
            title: "You have been logged out.",
            icon: "success",
            toast: true,
            timer: 4000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    
    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};