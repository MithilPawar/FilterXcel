import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Password reset flow is not implemented yet. Please contact support or create a new account for now.
        </p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
