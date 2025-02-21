import React from 'react';
import { HashRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { Redirect } from './pages/Redirect';
import { AuthProvider } from './contexts/AuthContext';

function RedirectPage() {
  const { shortCode } = useParams();

  // Fetch the original URL from your database/API
  // Example:
  const originalUrl = fetchOriginalUrl(shortId); // Implement this function

  if (!originalUrl) {
    return <h1>404 - Short URL Not Found</h1>;
  }

  // Redirect to the actual URL
  window.location.href = originalUrl;
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/:shortCode" element={<Redirect />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;