import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from '@/api/axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the user object
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // Holds the dynamically determined role
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log(decodedToken);
        // Check if the token is expired
        if (decodedToken?.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Token is valid, set user, token, and dynamically determine the role
          setToken(storedToken);
          setUser(decodedToken);
          setRole(getRoleFromUser(decodedToken));
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout(); // Logout if token is invalid
      }
    }

    setLoading(false);
  }, []);

  // Dynamically determine the role based on the presence of certain objects
  const getRoleFromUser = (user) => {
    if (user?.teacher) {
      return 'teacher';
    } else if (user?.superadmin) {
      return 'supervisor';
    }
    return null;
  };

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/login-teacher', { username, password });
      const { token, user } = response.data;

      // Save the token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success("Login successful!");

      // Set token, user, and dynamically determine the role
      setToken(token);
      setUser(user);
      setRole(getRoleFromUser(user));

      // Redirect based on role
      if (getRoleFromUser(user) === 'teacher') {
        router('/teacher-dashboard');
      } else if (getRoleFromUser(user) === 'supervisor') {
        router('/supervisor-dashboard');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear user, token, and role state
    setToken(null);
    setUser(null);
    setRole(null);

    // Redirect to login page
    router('/');
  };

  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Consider token expired if decoding fails
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, isTokenExpired }}>
      {!loading ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
