import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import AuthorizePage from "./pages/Authorize";
import ConsentPage from "./pages/Consent";
import NavHeader from "./components/NavHeader";
import SignInOptionsPage from "./pages/SignInOptions";

function App() {
  return (
    <>
      <NavHeader />
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignInOptionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/authorize" element={<AuthorizePage />} />
              <Route path="/consent" element={<ConsentPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
