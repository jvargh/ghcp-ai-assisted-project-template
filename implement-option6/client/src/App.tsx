import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateSurveyPage from "./pages/CreateSurveyPage";
import SurveyListPage from "./pages/SurveyListPage";
import TakeSurveyPage from "./pages/TakeSurveyPage";
import SurveyResultsPage from "./pages/SurveyResultsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/surveys"
              element={
                <ProtectedRoute>
                  <SurveyListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/create"
              element={
                <ProtectedRoute requiredRole="coordinator">
                  <CreateSurveyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:id/take"
              element={
                <ProtectedRoute>
                  <TakeSurveyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:id/results"
              element={
                <ProtectedRoute>
                  <SurveyResultsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
