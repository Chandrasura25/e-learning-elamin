import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Watch } from "react-loader-spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the user object
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // Holds the role directly from the server
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
  
    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
  
      // Automatically redirect based on role
      if (storedRole === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (storedRole === "superadmin") {
        navigate("/supervisor-dashboard");
      }
    }
  
    setLoading(false);
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

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {!loading ? (
        children
      ) : (
        <div className="h-screen w-full flex justify-center items-center">
          <Watch
            visible={true}
            height="200"
            width="200"
            radius="48"
            color="#B43330"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
