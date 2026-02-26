import { createContext, useContext, useState, useEffect } from "react";
import { checkAuth, loginUser, logoutUser, getUser } from "../src/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const verifyAuthAndProfile = async () => {
    setIsLoading(true);
    setIsProfileLoading(true);
    try {
      const res = await checkAuth();
      if (res.isAuthenticated) {
        setUser(res.user);
        setIsAuthenticated(true);
        setIsError(false);

        const profileRes = await getUser();
        setProfile(profileRes.user);
      } else {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth/Profile fetch failed:", err);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    verifyAuthAndProfile();
  }, []);

  const login = async (credentials) => {
    try {
      await loginUser(credentials);
      await verifyAuthAndProfile();
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    }
  };

  const refreshAuth = async () => {
    await verifyAuthAndProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isLoading,
        isProfileLoading,
        isError,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
