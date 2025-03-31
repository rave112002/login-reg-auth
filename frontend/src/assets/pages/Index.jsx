import React, { useState } from "react";
import LoginForm from "../components/forms/LoginForm";
import RegistrationForm from "../components/forms/RegistrationForm";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isRegister = location.pathname === "/register";

    const handleSwitch = () => {
        if (isRegister) {
            navigate("/login");
        } else {
            navigate("/register");
        }
    };

    return (
        <>
            <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-200 to-gray-600 ">
                <h1 className="text-4xl font-semibold mb-12">Welcome</h1>
                {isRegister ? (
                    <RegistrationForm onSwitch={handleSwitch} />
                ) : (
                    <LoginForm onSwitch={handleSwitch} />
                )}
            </div>
        </>
    );
};

export default Index;
