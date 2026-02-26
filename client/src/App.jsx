import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/HomePage";
import Layout from "./components/Layout/Layout";
import AboutUs from "./pages/AboutUs";
import Landing from "./pages/Landing";
import ProfilePage from "./pages/ProfilePage";
import FilteringPage from "./pages/FilteringPage";
import BasicOperationsPage from "./pages/BasicOperationsPage";
import SummaryPage from "./pages/SummaryPage";
import ChartsPage from "./pages/ChartsPage";
import { useAuth } from "./AuthContext";
import DataCleaningPage from "./pages/DataCleaningPage";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/filter" element={<FilteringPage />} />
            <Route path="/basic-operations" element={<BasicOperationsPage />} />
            <Route path="/chart" element={<ChartsPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/data-cleaning" element={<DataCleaningPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
