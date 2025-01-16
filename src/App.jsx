import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodayPage from './pages/TodayPage';
import Upcoming from './pages/Upcoming';

const App = () => {
  const isAuthenticated = localStorage.getItem('currentUser');

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/today" 
            element={isAuthenticated ? <TodayPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upcoming" 
            element={isAuthenticated ? <Upcoming /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
