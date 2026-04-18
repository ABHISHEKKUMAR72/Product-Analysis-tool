// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Compare from './pages/Compare';
import Visuals from './pages/Visuals';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page uses Layout (with footer) */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        {/* Other pages use only Navbar, no Layout footer */}
        <Route path="/products" element={
          <>
            <Navbar />
            <Products />
          </>
        } />
        <Route path="/compare" element={
          <>
            <Navbar />
            <Compare />
          </>
        } />
        <Route path="/visuals" element={
          <>
            <Navbar />
            <Visuals />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;