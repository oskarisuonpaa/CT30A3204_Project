import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserContext } from "./components/UserContext";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Post from "./components/Post";
import QuestionFormat from "./components/QuestionFormat";

const App = () => {
  const [user, setUser] = useState(null);

  // Used to check if there is a user stored in the session storage
  useEffect(() => {
    if (sessionStorage.getItem("user") && !user) {
      setUser(JSON.parse(sessionStorage.getItem("user")));
    }
  });

  return (
    <div id="app">
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Header />
          <div className="d-flex justify-content-center align-items-center background-primary page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/newquestion" element={<QuestionFormat />} />
              <Route path="/question/:id" element={<Post />} />
              <Route
                path="*"
                element={
                  <h1>404: This is not the webpage you are looking for.</h1>
                }
              />
            </Routes>
          </div>
          <footer className="text-center bg-dark" style={{ color: "white" }}>
            Made with blood, sweat and tears by Oskari Suonpää © 2023
          </footer>
        </Router>
      </UserContext.Provider>
    </div>
  );
};

export default App;
