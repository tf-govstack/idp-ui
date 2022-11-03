import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import AuthorizePage from "./pages/Authorize";
import ConsentPage from "./pages/Consent";
import NavHeader from "./components/NavHeader";
import { localStorageService } from "./services/local-storageService";
import IdpDetailsPage from "./pages/IdpDetails";

function App() {
  return (
    <>
      <NavHeader localStorageService={localStorageService} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IdpDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/authorize" element={<AuthorizePage />} />
          <Route path="/consent" element={<ConsentPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
