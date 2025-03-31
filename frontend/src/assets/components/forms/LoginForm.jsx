import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onSwitch }) => {
    const [values, setValues] = useState({
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
                "http://localhost:3000/auth/login",
                values
            );

            if (response.status === 201) {
                localStorage.setItem("token", response.data.token);
                alert("User logged in successfully");
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {/* Login Form */}
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
                    Login
                </h2>
                <form className="space-y-6">
                    <div>
                        <label
                            htmlFor="login-email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            onChange={handleChanges}
                            type="email"
                            name="email"
                            id="login-email"
                            placeholder="youremail@example.com"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="login-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            onChange={handleChanges}
                            type="password"
                            name="password"
                            id="login-password"
                            placeholder="********"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-gray-500">
                        No Account Yet? &nbsp;
                        <span
                            onClick={onSwitch}
                            className="text-blue-500 cursor-pointer"
                        >
                            Create Here
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
