import React, { use, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({ onSwitch }) => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3000/auth/register",
                values
            );

            if (response.status === 201) {
                alert("User registered successfully");
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
                Register
            </h2>
            <form className="space-y-6">
                <div>
                    <label
                        htmlFor="register-name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="register-username"
                        placeholder="Your Username"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleChanges}
                    />
                </div>
                <div>
                    <label
                        htmlFor="register-email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="register-email"
                        placeholder="youremail@example.com"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleChanges}
                    />
                </div>
                <div>
                    <label
                        htmlFor="register-password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="register-password"
                        placeholder="********"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleChanges}
                    />
                </div>
                <div>
                    <label
                        htmlFor="register-confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="register-confirmPassword"
                        placeholder="********"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <p className="text-gray-500">
                    Already have an account?{" "}
                    <span
                        onClick={onSwitch}
                        className="text-blue-500 cursor-pointer"
                    >
                        Back to Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegistrationForm;
