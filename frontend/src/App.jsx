import React from "react";
import Index from "./assets/pages/Index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Index />} />
                <Route path="/register" element={<Index />} />
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;
