import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "@/api/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the user object
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // Holds the role directly from the server
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log(decodedToken);

        // Check if the token is expired
        if (decodedToken?.exp * 1000 < Date.now()) {
          logout(); // Logout if token is expired
        } else {
          // Token is still valid, so keep the user logged in
          setToken(storedToken);
          setUser(decodedToken);
          setRole(localStorage.getItem("role")); // Retrieve role from localStorage
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout(); // Logout if token is invalid
      }
    }

    setLoading(false); // Stop loading once token check is done
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/login-teacher", {
        username,
        password,
      });
      const { token, user, role } = response.data; // Ensure the backend sends the role directly
      console.log(response.data);

      // Save the token, user, and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role); // Store role in localStorage
      toast.success("Login successful!");

      // Set token, user, and role in state
      setToken(token);
      setUser(user);
      setRole(role);

      // Redirect based on role
      if (role === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "superadmin") {
        navigate("/supervisor-dashboard");
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error("Invalid credentials");
    }
  };

  const logout = () => {
    // Clear token, user, and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Clear user, token, and role state
    setToken(null);
    setUser(null);
    setRole(null);

    // Redirect to login page
    navigate("/");
  };

  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Consider token expired if decoding fails
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, login, logout, isTokenExpired }}
    >
      {!loading ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
