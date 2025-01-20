import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodayPage from './pages/TodayPage';
import Upcoming from './pages/Upcoming';

const App = () => {
  const isAuthenticated = localStorage.getItem('currentUser');
  const currentDateTime = new Date(2025, 0, 19, 16, 0, 0); // January 19, 2025, 4 PM MST

  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
