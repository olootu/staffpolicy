import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PolicyViewer from "./pages/PolicyViewer";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar/NavBar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { userContext, UserProvider } from "./Context/Context";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { useContext } from "react";

const queryClient = new QueryClient();

function AppContent() {
  // Use userContext to get authentication status from context
  const { user } = useContext(userContext);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={!user ?<Login />: <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/policy" element={user ? <PolicyViewer /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'Admin' ? <Admin /> : <Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </UserProvider>
  );
}











// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import PolicyViewer from "./pages/PolicyViewer";
// import Dashboard from "./pages/Dashboard";
// import NavBar from "./components/NavBar/NavBar";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { UserProvider } from "./Context/Context";
// import Admin from "./pages/Admin";
// import Login from "./pages/Login";


// const queryClient = new QueryClient();

// export default function App() {
//   const isAuthenticated = !!localStorage.getItem("token");
//   console.log(isAuthenticated)
//   return (

//     <UserProvider>
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <NavBar />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/policy" element={<PolicyViewer /> } />
//           <Route path="/admin" element={<Admin /> } />
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </Router>
//     </QueryClientProvider>
//   </UserProvider> 
//   //   <UserProvider>
//   //   <QueryClientProvider client={queryClient}>
//   //     <Router>
//   //       <NavBar />
//   //       <Routes>
//   //         <Route path="/login" element={<Login />} />
//   //         <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
//   //         <Route path="/policy" element={isAuthenticated ? <PolicyViewer /> : <Navigate to="/login" />} />
//   //         <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
//   //         <Route path="*" element={<Navigate to="/dashboard" />} />
//   //       </Routes>
//   //     </Router>
//   //   </QueryClientProvider>
//   // </UserProvider> 
//   );
// }