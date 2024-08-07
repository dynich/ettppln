import express from "express";
import {
  getLemburs,
  getApprovalLembur,
  getApprovalLemburById,
  approveAllPending,
  getLemburById,
  createLembur,
  updateLembur,
  updateStatus,
  deleteLembur,
} from "../controllers/Lemburs.js";
import upload from "../middleware/upload.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/lemburs", verifyUser, getLemburs);
router.get("/lemburs/approval", verifyUser, adminOnly, getApprovalLembur);
router.get("/lemburs/approval/:id", verifyUser, adminOnly, getApprovalLemburById);
router.get("/lemburs/:id", verifyUser, getLemburById);
router.post("/lemburs", verifyUser, upload.single('buktiLembur'), createLembur);
router.post('/upload', upload.single('buktiLembur'), (req, res) => {
  // Proses unggahan berkas di sini
  res.send('File uploaded successfully');
})
router.patch("/lemburs/approval/:id", verifyUser, adminOnly, updateLembur);
router.patch('/lemburs/approve-all', verifyUser, adminOnly, approveAllPending);
router.patch("/lemburs/:id", verifyUser, updateLembur);
router.patch("/lemburs/:id/status", verifyUser, adminOnly, updateStatus);
router.delete("/lemburs/:id", verifyUser, deleteLembur);

export default router;
