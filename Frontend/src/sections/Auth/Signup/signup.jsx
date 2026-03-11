import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import "./signup.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSuccess, handleError } from '../../../Toast'; // Check this path

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    const navigate = useNavigate(); // Initialize navigate

    const handlesubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = formData;
        
        if (!name || !email || !password) {
            return handleError("Name, Email and Password are required");
        }
        
        try {
            const URL = `${import.meta.env.VITE_API_URL}/auth/signup`;
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            
            // Handle the response from your backend
            if (result.success) {
                handleSuccess(result.message);
                // Wait 1 second so they can see the success toast, then redirect
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (result.error) {
                // Handle Joi validation errors from backend
                const details = result.error.details[0].message;
                handleError(details);
            } else if (!result.success) {
                // Handle user already exists, etc.
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
                <h1>Signup</h1>
                <form onSubmit={handlesubmit}>
                    <div>
                        <label htmlFor="Name">Name</label>
                        <input onChange={handleChange} type="text" name="name" id='Name' value={formData.name} autoFocus placeholder='Enter display name' />
                    </div>
                    <div>
                        <label htmlFor="Email">Email</label>
                        <input onChange={handleChange} type="email" name="email" id="Email" value={formData.email} placeholder='Enter Your Email' />
                    </div>
                    <div>
                        <label htmlFor="Password">Password</label>
                        <input onChange={handleChange} type="password" name="password" id="Password" value={formData.password} placeholder='Enter password' />
                    </div>
                    <button type='submit'>Submit</button>
                    <span>Already Have an Account? <Link to="/login">Login</Link></span>
                    <ToastContainer />
                </form>
            </div>
        </div>
    )
}

export default Signup;