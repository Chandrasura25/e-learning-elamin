import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Dash } from "./pages/superadmin/Dash";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./pages/Layout";
import CreateNote from "./pages/CreateNote";  
import Note from "./pages/Note";
import EditNote from "./pages/EditNote";

function App() {
  const { role } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/" element={<Layout />}>
          {role === "superadmin" ? (
            <Route path="/supervisor-dashboard" element={<Dash />} />
          ) : (
            <>
              <Route path="/teacher-dashboard" element={<Dashboard />} />
              <Route path="/create-note" element={<CreateNote />} />
              <Route path="/note/:id" element={<Note />} />
              <Route path="/edit-note/:id" element={<EditNote />} />
            </>
          )}
        </Route>
      </Routes>
    </>
  );
}

export default App;
