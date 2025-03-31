import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/auth/home", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 200) {
                navigate("/login");
            }
        } catch (error) {
            navigate("/login");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-200 to-gray-600">
                <h1 className="m-4 text-4xl font-semibold">Home Page</h1>
                <button
                    onClick={handleLogout}
                    className="m-2 py-2 px-8 border-2 rounded-4xl border-red-500 transition duration-200 ease-in hover:bg-red-500 hover:text-white"
                >
                    Log Out
                </button>
            </div>
        </>
    );
};

export default Home;
