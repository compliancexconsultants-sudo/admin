import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";

// CA pages
import CAList from "./pages/CA/CAList";
import AddCA from "./pages/CA/AddCA";
import EditCA from "./pages/CA/EditCA";

import CaseList from "./pages/Cases/CaseList";
import CaseView from "./pages/Cases/CaseView";
import AssignCA from "./pages/Cases/AssignCA";

import UserList from "./pages/Users/UserList";
import UserView from "./pages/Users/UserView";

import Settings from "./pages/Settings/Settings";
import ServiceManager from "./pages/Settings/ServiceManager";
import AdminThemeSettings from "./pages/theme";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Panel Screens */}
        <Route path="/Dashboard" element={<Dashboard />} />

        {/* CA Module */}
        <Route path="/ca" element={<CAList />} />
        <Route path="/add-ca" element={<AddCA />} />
        <Route path="/edit-ca/:id" element={<EditCA />} />

        <Route path="/cases" element={<CaseList />} />
        <Route path="/case/:caseId" element={<CaseView />} />
        <Route path="/assign-ca/:caseId" element={<AssignCA />} />

        <Route path="/users" element={<UserList />} />
        <Route path="/user/:uid" element={<UserView />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/service" element={<ServiceManager />} />
        <Route path="/theme-settings" element={<AdminThemeSettings />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
