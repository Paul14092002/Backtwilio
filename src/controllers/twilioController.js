import twilioService from '../services/twilioService.js';
import * as espoCRMService from '../services/espoCrmService.js';

/**
 * 1. BUSCAR NÚMEROS DISPONIBLES
 * GET /api/twilio/search-numbers?areaCode=305&limit=5
 */
export const searchNumbers = async (req, res) => {
    try {
        const { areaCode, limit = 5, countryCode = 'US' } = req.query;

        // Validar que se envió el código de área
        if (!areaCode) {
            return res.status(400).json({
                success: false,
                error: 'El parámetro areaCode es requerido'
            });
        }

        // Buscar números disponibles en Twilio
        const availableNumbers = await twilioService.searchAvailableNumbers(
            areaCode,
            countryCode,
            parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                areaCode: areaCode,
                countryCode: countryCode,
                total: availableNumbers.length,
                numbers: availableNumbers
            }
        });
    } catch (error) {
        console.error('Error en searchNumbers:', error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 2. COMPRAR Y CONFIGURAR NÚMERO (TODO EN UNO)
 * POST /api/twilio/purchase-number
 * Body: {
 *   phoneNumber: "+13055550199",
 *   accountId: "account_id_crm",
 *   webhookUrl: "https://n8n.tudominio.com/webhook/talkbot",
 *   friendlyName: "Cliente: Juan AC"
 * }
 */
export const purchaseNumber = async (req, res) => {
    try {
        const { phoneNumber, accountId, webhookUrl, friendlyName } = req.body;

        // Validaciones
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'phoneNumber es requerido'
            });
        }

        if (!accountId) {
            return res.status(400).json({
                success: false,
                error: 'accountId es requerido'
            });
        }

        if (!webhookUrl) {
            return res.status(400).json({
                success: false,
                error: 'webhookUrl es requerido'
            });
        }

        // Verificar que el Account existe en EspoCRM
        const account = await espoCRMService.getEntityById('Account', accountId);
        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'Account no encontrado en CRM'
            });
        }

        // 1. COMPRAR EL NÚMERO EN TWILIO
        const purchasedNumber = await twilioService.purchaseAndConfigureNumber(
            phoneNumber,
            webhookUrl,
            friendlyName || `${account.name} - Talkbot`
        );

        // 2. GUARDAR EN EL CRM (cPhoneNumber)
        const phoneNumberData = {
            phoneNumber: purchasedNumber.phoneNumber,
            twilioSid: purchasedNumber.sid,
            accountId: accountId,
            monthlyCost: 1.15,
            status: 'Active',
            n8nWebhookUrl: webhookUrl,
            purchaseDate: new Date().toISOString().split('T')[0]
        };

        const savedPhoneNumber = await espoCRMService.createEntity('cPhoneNumber', phoneNumberData);

        // 3. RESPUESTA EXITOSA
        res.status(201).json({
            success: true,
            message: 'Número comprado y configurado exitosamente',
            data: {
                twilio: purchasedNumber,
                crm: savedPhoneNumber
            }
        });

    } catch (error) {
        console.error('Error en purchaseNumber:', error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message,
            code: error.code
        });
    }
};

/**
 * 3. ACTUALIZAR WEBHOOK DE UN NÚMERO EXISTENTE
 * PUT /api/twilio/update-webhook/:phoneNumberId
 */
export const updateWebhook = async (req, res) => {
    try {
        const { phoneNumberId } = req.params;
        const { webhookUrl } = req.body;

        if (!webhookUrl) {
            return res.status(400).json({
                success: false,
                error: 'webhookUrl es requerido'
            });
        }

        // Obtener el número del CRM
        const phoneNumber = await espoCRMService.getEntityById('cPhoneNumber', phoneNumberId);
        
        if (!phoneNumber) {
            return res.status(404).json({
                success: false,
                error: 'Phone Number no encontrado'
            });
        }

        // Actualizar en Twilio
        const updated = await twilioService.updateNumberConfiguration(
            phoneNumber.twilioSid,
            webhookUrl
        );

        // Actualizar en CRM
        await espoCRMService.updateEntity('cPhoneNumber', phoneNumberId, {
            n8nWebhookUrl: webhookUrl
        });

        res.json({
            success: true,
            message: 'Webhook actualizado exitosamente',
            data: updated
        });

    } catch (error) {
        console.error('Error en updateWebhook:', error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 4. LIBERAR UN NÚMERO
 * DELETE /api/twilio/release-number/:phoneNumberId
 */
export const releaseNumber = async (req, res) => {
    try {
        const { phoneNumberId } = req.params;

        // Obtener el número del CRM
        const phoneNumber = await espoCRMService.getEntityById('cPhoneNumber', phoneNumberId);
        
        if (!phoneNumber) {
            return res.status(404).json({
                success: false,
                error: 'Phone Number no encontrado'
            });
        }

        // Liberar en Twilio
        await twilioService.releaseNumber(phoneNumber.twilioSid);

        // Actualizar status en CRM (no eliminar, solo marcar como Released)
        await espoCRMService.updateEntity('cPhoneNumber', phoneNumberId, {
            status: 'Released'
        });

        res.json({
            success: true,
            message: 'Número liberado exitosamente'
        });

    } catch (error) {
        console.error('Error en releaseNumber:', error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};