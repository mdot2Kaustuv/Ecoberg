import axios from "axios"
import { jwtDecode } from "jwt-decode"
import dayjs from "dayjs"
import { useContext } from "react"
import AuthContext from "./AuthContext"

const baseURL = "http://127.0.0.1:8000"

const useAxios = () => {
    const { authTokens, setAuthTokens, setUser } = useContext(AuthContext)

    const axiosInstance = axios.create({ baseURL })

    axiosInstance.interceptors.request.use(async (req) => {
        if (!authTokens?.access) {
            return req;
        }

        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).isBefore(dayjs());

        if (!isExpired) {
            req.headers.Authorization = `Bearer ${authTokens.access}`;
            return req;
        }

        try {
            const response = await axios.post(`${baseURL}/account/token/refresh/`, {
                refresh: authTokens.refresh,
            });
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
        } catch (err) {
            // Refresh token is dead — clear it instead of looping on it forever.
            localStorage.removeItem("authTokens");
            setAuthTokens(null);
            setUser(null);
            return Promise.reject(err);
        }
    });

    return axiosInstance
}

export default useAxios