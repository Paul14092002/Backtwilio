import express from 'express';
import * as twilioController from '../controllers/twilioController.js';

const router = express.Router();

/**
 * 1. Buscar números disponibles
 * GET /api/twilio/search-numbers?areaCode=305&limit=5
 */
router.get('/search-numbers', twilioController.searchNumbers);

/**
 * 2. Comprar y configurar número
 * POST /api/twilio/purchase-number
 * Body: { phoneNumber, accountId, webhookUrl, friendlyName }
 */
router.post('/purchase-number', twilioController.purchaseNumber);

/**
 * 3. Actualizar webhook de un número
 * PUT /api/twilio/update-webhook/:phoneNumberId
 */
router.put('/update-webhook/:phoneNumberId', twilioController.updateWebhook);

/**
 * 4. Liberar un número
 * DELETE /api/twilio/release-number/:phoneNumberId
 */
router.delete('/release-number/:phoneNumberId', twilioController.releaseNumber);

export default router;