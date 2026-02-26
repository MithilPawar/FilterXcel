import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./AuthContext";

const Signup = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Home = lazy(() => import("./pages/HomePage"));
const Layout = lazy(() => import("./components/Layout/Layout"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Landing = lazy(() => import("./pages/Landing"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const FilteringPage = lazy(() => import("./pages/FilteringPage"));
const BasicOperationsPage = lazy(() => import("./pages/BasicOperationsPage"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const ChartsPage = lazy(() => import("./pages/ChartsPage"));
const DataCleaningPage = lazy(() => import("./pages/DataCleaningPage"));

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
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
      </Suspense>
    </Router>
  );
}

export default App;
