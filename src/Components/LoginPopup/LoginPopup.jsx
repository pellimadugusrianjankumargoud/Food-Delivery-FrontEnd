import React, { useState, useContext } from 'react';
import { StoreContext } from "../../Context/StoreContext";
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPopup = ({ setShowLogin }) => {
  const capital = /[A-Z]/;
  const number = /[0-9]/;
  const special = /[!@#$%^&*(),.?":{}|<>]/;
  const { loginUser } = useContext(StoreContext);


  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validatePassword = (password) => {
    if (!capital.test(password) || !number.test(password) || !special.test(password)) {
      return 'Password should contain at least one uppercase letter, one number, and one special character';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live validation (optional)
    if (name === 'password' && currentState === 'Sign Up') {
      const error = validatePassword(value);
      setErrorMessage(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMessage(passwordError);
      toast.error(passwordError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/createFood', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Registration successful:', response.data);
      // localStorage.setItem("user", JSON.stringify(response.data));
      toast.success('Registration successful!');
      loginUser({
      name: response.data.name,
      email: response.data.email
    });

    setShowLogin(false);
      setCurrentState('Login');
    } catch (error) {
      console.log('Error during registration:', error.response?.data || error.message);
      toast.error('Registration unsuccessful. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Login successfully:", response.data);
      toast.success("Login successful!");
      // localStorage.setItem("user", JSON.stringify(response.data));
       loginUser({
      name: response.data.name,
      email: response.data.email
    });

    setShowLogin(false);

      // navigate("/success");
    } catch (error) {
      console.log("Error while login form:", error);
      toast.error("Login unsuccessful. Please check your credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={currentState === 'Sign Up' ? handleSubmit : handleLogin}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currentState === 'Login' ? null : (
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="Enter your name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Enter your email"
            required
          />
          <div className="password-field">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-button"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <button type="submit">{currentState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            I agree to the <span>Terms & Conditions</span>
          </p>
        </div>
        {currentState === 'Login' ? (
          <p>
            Create a new account?{' '}
            <span onClick={() => {
              setCurrentState('Sign Up');
              setErrorMessage('');
            }}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span onClick={() => {
              setCurrentState('Login');
              setErrorMessage('');
            }}>
              Login here
            </span>
          </p>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPopup;
