import { useState } from "react";
import style from "../styles/login.module.css";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { useAuth } from '@/contexts/AuthContext'; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();  

  const validate = () => {
    let errors = {};

    if (!username) {
      errors.username = "Username is required";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the login function from AuthContext
      await login(username, password);  
      
      // Show success message if login is successful
    } catch (error) {
      // Handle error and display message
      toast.error(error.response?.data?.message || "Login failed");
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.body}>
      <div className={style.form}>
        <div className={style.imgBx}>
          <img src={Logo} alt="Logo" />
        </div>
        <h2>EL-AMIN INTERNATIONAL SCHOOL</h2>
        <form onSubmit={handleSubmit} className={style.input}>
          <div className={style.inputBox}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className={style.error}>{errors.username}</p>
            )}
          </div>
          <div className={style.inputBox}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*******"
            />
            {errors.password && (
              <p className={style.error}>{errors.password}</p>
            )}
          </div>
          <div className={style.inputBox}>
            <input
              type="submit"
              value={isSubmitting ? "Signing In..." : "Sign In"}
              disabled={isSubmitting}
            />
          </div>
        </form>
        <p className={style.forget}>
          Forget Password? <a href="#">Click Here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
