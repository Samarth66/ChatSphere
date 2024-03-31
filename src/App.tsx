
import React, { useEffect } from 'react';

import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import {socket} from './components/socket';

const uri = process.env.REACT_APP_BACKEND_URL;


function App() {
  console.log("url", uri);  
  return (
    <div className="App">
     <Router>
      <Routes>
     <Route path="/" element={<Login/>} />
     <Route path="/home" element={<Home />} />
     </Routes>
     </Router>
    </div>
  );
}

export default App;
