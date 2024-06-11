import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Lemburs from "./pages/Lemburs";
import Pikets from "./pages/Pikets";
import Premis from "./pages/Premis";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import "./index.css";
import Welcome from "./components/Welcome";
import DataPegawai from "./pages/DataPegawai";
import ApprovalLembur from "./pages/ApprovalLembur";
import ApprovalPiket from "./pages/ApprovalPiket";
import ApprovalPremi from "./pages/ApprovalPremi";
import EditLembur from "./pages/EditLembur";
import EditPiket from "./pages/EditPiket";
import EditPremi from "./pages/EditPremi";
import AllLemburs from "./pages/AllLemburs";
import AllPikets from "./pages/AllPikets";
import AllPremis from "./pages/AllPremis";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<Welcome />} />
        </Route>
        <Route path="/users" element={<Users />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/datapegawai/edit/:id" element={<EditUser />} />
        <Route path="/dashboard/lemburs" element={<Lemburs />} />
        <Route path="/dashboard/pikets" element={<Pikets />} />
        <Route path="/dashboard/premis" element={<Premis />} />
        <Route path="/datapegawai" element={<DataPegawai />} />
        <Route path="/approval/approvallembur" element={<ApprovalLembur />} />
        <Route path="/approval/approvallembur/edit/:id" element={<EditLembur />} />
        <Route path="/approval/approvalpiket" element={<ApprovalPiket />} />
        <Route path="/approval/approvalpiket/edit/:id" element={<EditPiket />} />
        <Route path="/approval/approvalpremi" element={<ApprovalPremi />} />
        <Route path="/approval/approvalpremi/edit/:id" element={<EditPremi />} />
        <Route path="/laporan/semualembur" element={<AllLemburs />} />
        <Route path="/laporan/semuapiket" element={<AllPikets />} />
        <Route path="/laporan/semuapremi" element={<AllPremis />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
