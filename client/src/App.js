import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactPage from './pages/ContactPage';
import ContactsTablePage from './components/ContactTablePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add" element={<ContactPage />} />
        <Route path="/" element={<ContactsTablePage />} />
      </Routes>
    </Router>
  );
}

export default App;
