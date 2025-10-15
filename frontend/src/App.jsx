//* import components here :
import Navbar from "./components/Navbar";

//* import pages here :
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

//* Route for specific entry
import { Routes, Route } from "react-router-dom";

const Hello = () => {
  //* need navbar at top everytime in ui so it's outside of route
  //* routes will fetch components dynamically
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default Hello;
