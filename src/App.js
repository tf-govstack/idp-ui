import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/Login';
import Authorize from './pages/Authorize';

function App() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/authorize" element={<Authorize />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;