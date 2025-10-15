//* import components here :
import Navbar from "./components/Navbar";

//* import pages here :
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

//* Route for specific entry
import { Routes, Route, Navigate } from "react-router-dom";
//* state managemnt
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

//* others
import { Loader } from "lucide-react";

const App = () => {
  //* when we call useAuthStore() -> zustand connects component to store
  //* useAuthStore() → calls that function useAuthStore, returning your defined states
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  //* making the spinning animation when we try to fetch auth status
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  //* need navbar at top everytime in ui so it's outside of route
  //* routes will fetch components dynamically
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
