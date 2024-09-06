import { useState } from 'react';
import style from '../styles/login.module.css';
import Logo from '../assets/logo.png';
import { toast } from 'react-toastify';
import axios from '@/api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let errors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      const response = await axios.post('/login-teacher', { email, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);

      // Handle successful login (e.g., redirect or update UI)
    } catch (error) {
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
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@xyz.com"
            />
            {errors.email && <p className={style.error}>{errors.email}</p>}
          </div>
          <div className={style.inputBox}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*******"
            />
            {errors.password && <p className={style.error}>{errors.password}</p>}
          </div>
          {errors.form && <p className={style.error}>{errors.form}</p>}
          <div className={style.inputBox}>
            <input
              type="submit"
              value={isSubmitting ? 'Signing In...' : 'Sign In'}
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
