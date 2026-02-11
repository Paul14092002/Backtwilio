import { Router } from 'express';
import * as crmController from '../controllers/crmController.js';

const router = Router();

// Get list of entities
router.get('/:entityType', crmController.getEntities);

// Get single entity by ID
router.get('/:entityType/:id', crmController.getEntityById);

// Create new entity
router.post('/:entityType', crmController.createEntity);

// Update entity
router.put('/:entityType/:id', crmController.updateEntity);

// Delete entity
router.delete('/:entityType/:id', crmController.deleteEntity);

export default router;
