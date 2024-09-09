import express from 'express';
import {
    getPremis,
    getApprovalPremi,
    getApprovalPremiById,
    approveAllPending,
    getPremiById,
    createPremi,
    updatePremi,
    updateStatus,
    deletePremi
} from '../controllers/Premis.js';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/premis', verifyUser, getPremis);
router.get('/premis/approval', verifyUser, adminOnly, getApprovalPremi);
router.get('/premis/approval/:id', verifyUser, adminOnly, getApprovalPremiById);
router.get('/premis/:id', verifyUser,getPremiById);
router.post('/premis', verifyUser, createPremi);
router.patch('/premis/approve-all', verifyUser, adminOnly, approveAllPending);
router.patch('/premis/:id', verifyUser, updatePremi);
router.patch('/premis/approval/:id', verifyUser, adminOnly, updatePremi);
router.patch('/premis/:id/status', verifyUser, adminOnly, updateStatus);
router.delete('/premis/:id', verifyUser, deletePremi);

export default router;
