import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ApplyJob from "./pages/ApplyJob";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-job" element={
          <ProtectedRoute>
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="/apply/:jobId" element={
          <ProtectedRoute>
            <ApplyJob />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
