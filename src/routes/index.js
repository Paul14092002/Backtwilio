import { Router } from 'express';
import crmRoutes from './crmRoutes.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to CRM APIs' });
});

// Mount CRM routes
router.use('/crm', crmRoutes);

export default router;
