import express from "express";
import {
    getPikets,
    getApprovalPiket,
    getApprovalPiketById,
    approveAllPending,
    getPiketById,
    createPiket,
    updatePiket,
    updateStatus,
    deletePiket
} from "../controllers/Pikets.js";
import upload from "../middleware/upload.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pikets', verifyUser, getPikets);
router.get('/pikets/approval', verifyUser, adminOnly, getApprovalPiket);
router.get('/pikets/approval/:id', verifyUser, adminOnly, getApprovalPiketById);
router.get('/pikets/:id', verifyUser, getPiketById);
router.post('/pikets', verifyUser, upload.single('buktiPiket'), createPiket);
router.post('/upload', upload.single('buktiPiket'), (req, res) => {
    // Proses unggahan berkas di sini
    res.send('File uploaded successfully');
  })
router.patch('/pikets/approval/:id', verifyUser, adminOnly, updatePiket);
router.patch('/pikets/approve-all', verifyUser, adminOnly, approveAllPending);
router.patch('/pikets/:id', verifyUser, updatePiket);
router.patch('/pikets/:id/status', verifyUser, adminOnly, updateStatus);
router.delete('/pikets/:id', verifyUser, deletePiket);

export default router;
