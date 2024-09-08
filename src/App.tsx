import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Dash } from "./pages/superadmin/Dash";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { role } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        {role === "superadmin" ? (
          <Route path="/superadmin-dashboard" element={<Dash />} />
        ) : (
          <Route path="/teacher-dashboard" element={<Dashboard />} />
        )}
      </Routes>
    </>
  );
}

export default App;
