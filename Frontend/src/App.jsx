import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <div className="w-full overflow-hidden">
        <ToastContainer />
        <Routes>
          {/* Home page with About, Contact, Footer */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <About />
                <Contact />
                <Footer />
              </>
            }
          />

          {/* Main page */}
          <Route path="/main" element={<MainPage />} />

          {/* Authentication routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
