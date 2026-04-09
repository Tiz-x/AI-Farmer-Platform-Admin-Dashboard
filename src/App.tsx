import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import BottomNav from "./components/layout/BottomNav";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import Fields from "./pages/Fields";
import Alerts from "./pages/Alerts";
import Users from "./pages/Users";
import Content from "./pages/Content";
import Settings from "./pages/Settings";
import "./styles/global.css";

const pageTitles: Record<string, string> = {
  "/dashboard": "Admin Overview",
  "/farmers":   "All Farmers",
  "/fields":    "All Fields",
  "/alerts":    "Alerts",
  "/users":     "Users",
  "/content":   "Content Manager",
  "/settings":  "Settings",
};

function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
          width: 0, // prevents flex child from overflowing on mobile
        }}
      >
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "24px",
            position: "relative",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farmers"   element={<Farmers />}   />
            <Route path="/fields"    element={<Fields />}    />
            <Route path="/alerts"    element={<Alerts />}    />
            <Route path="/content"   element={<Content />}   />
            <Route path="/users"     element={<Users />}     />
            <Route path="/settings"  element={<Settings />}  />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}