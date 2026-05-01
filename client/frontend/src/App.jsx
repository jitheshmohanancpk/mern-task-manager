import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // ടോക്കൺ ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    /* flex, items-center, justify-center എന്നിവ കണ്ടന്റിനെ നടുവിലേക്ക് എത്തിക്കുന്നു */
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
      <Router>
        <Routes>
          {/* ലോഗിൻ പേജ് */}
          <Route path="/login" element={<Login />} />

          {/* ഡാഷ്‌ബോർഡ് - ലോഗിൻ ചെയ്തവർക്ക് മാത്രം */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />

          {/* ഹോം പേജിൽ വന്നാൽ ലോഗിനിലേക്ക് വിടുക */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;