import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PolicyViewer from "./pages/PolicyViewer";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar/NavBar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from "./Context/Context";
import Admin from "./pages/Admin";
import Login from "./pages/Login";


const queryClient = new QueryClient();

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <UserProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/policy" element={isAuthenticated ? <PolicyViewer /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </UserProvider> 
  );
}