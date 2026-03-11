import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import "../Signup/signup.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSuccess, handleError } from '../../../Toast'; // Check this path

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate(); // Initialize navigate

    const handlesubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        
        if (!email || !password) {
            return handleError("Email and Password are required");
        }
        
        try {
            const URL = `${import.meta.env.VITE_API_URL}/auth/login`;
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            
            if (result.success) {
                // 1. Save the token and user details to localStorage
                localStorage.setItem('token', result.jwtToken);
                localStorage.setItem('loggedInUser', result.name);
                localStorage.setItem('userEmail', result.email);

                // 2. Show success toast
                handleSuccess(result.message);
                
                // 3. Redirect to homepage after a short delay
                setTimeout(() => {
                    navigate('/'); // Send them to the homepage
                }, 1000);
            } else if (result.error) {
                const details = result.error.details[0].message;
                handleError(details);
            } else if (!result.success) {
                handleError(result.message);
            }
        }
        catch (err) {
            handleError("Something went wrong. Please try again.");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const changeinput = { ...formData };
        changeinput[name] = value;
        setFormData(changeinput);
    }

    return (
        <div className='Container_wrapper'>
            <div className='Container'>
                <h1>Login</h1>
                <form onSubmit={handlesubmit}>
                    <div>
                        <label htmlFor="Email">Email</label>
                        <input onChange={handleChange} type="email" name="email" id="Email" value={formData.email} autoFocus placeholder='Enter Your Email' />
                    </div>
                    <div>
                        <label htmlFor="Password">Password</label>
                        <input onChange={handleChange} type="password" name="password" id="Password" value={formData.password} placeholder='Enter password' />
                    </div>
                    <button type='submit'>Login</button>
                    <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
                    <ToastContainer />
                </form>
            </div>
        </div>
    )
}

export default Login;