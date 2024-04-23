import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from './components/Dashboard';
import {Profile} from './components/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from "./hooks/useAuth";
import MyBookShelf from './components/MyBookShelf';

function App() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mybookshelf" element={<MyBookShelf />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
