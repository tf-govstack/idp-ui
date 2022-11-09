import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import AuthorizePage from "./pages/Authorize";
import ConsentPage from "./pages/Consent";
import NavHeader from "./components/NavHeader";
import IdpDetailsPage from "./pages/IdpDetails";
import { langConfigService } from "./services/langConfigService";

function App() {
  return (
    <>
      <NavHeader langConfigService={langConfigService} />
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
