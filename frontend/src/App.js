import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import SignIn from "./components/SignIn";
// import MyBooks from './components/MyBooks';
import Dashboard from './components/Dashboard';
// import FavoriteGenres from './components/FavoriteGenres';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {  
  return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
  );
}

export default App;
