import twilio from 'twilio';

class TwilioService {
    constructor() {
        this._client = null;
    }

    // Getter que inicializa el cliente solo cuando se necesita
    get client() {
        if (!this._client) {
            // Validar credenciales
            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
                console.warn('⚠️  Credenciales de Twilio no configuradas');
                return null;
            }
            
            this._client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
        }
        return this._client;
    }

    /**
     * 1. BUSCAR NÚMEROS DISPONIBLES
     * Busca números disponibles en un código de área específico
     */
    async searchAvailableNumbers(areaCode, countryCode = 'US', limit = 5) {
        try {
            if (!this.client) {
                throw new Error('Cliente Twilio no inicializado. Verifica las credenciales.');
            }

            const numbers = await this.client
                .availablePhoneNumbers(countryCode)
                .local
                .list({
                    areaCode: areaCode,
                    limit: limit,
                    voiceEnabled: true,
                    smsEnabled: true
                });

            // Formatear respuesta
            return numbers.map(num => ({
                phoneNumber: num.phoneNumber,
                friendlyName: num.friendlyName,
                locality: num.locality,
                region: num.region,
                postalCode: num.postalCode,
                capabilities: num.capabilities
            }));
        } catch (error) {
            console.error('❌ Error buscando números en Twilio:', error);
            throw {
                message: `Error buscando números: ${error.message}`,
                status: error.status || 500
            };
        }
    }

    /**
     * 2. COMPRAR Y CONFIGURAR NÚMERO
     * Compra un número y lo configura con el webhook en un solo paso
     */
    async purchaseAndConfigureNumber(phoneNumber, webhookUrl, friendlyName = '') {
        try {
            if (!this.client) {
                throw new Error('Cliente Twilio no inicializado. Verifica las credenciales.');
            }

            // Comprar y configurar en un solo paso
            const purchasedNumber = await this.client.incomingPhoneNumbers.create({
                phoneNumber: phoneNumber,
                friendlyName: friendlyName,
                // Configuración de VOZ
                voiceUrl: webhookUrl,
                voiceMethod: 'POST',
                // Configuración de SMS (opcional)
                smsUrl: webhookUrl,
                smsMethod: 'POST',
                // Status callback (para logs)
                statusCallback: `${webhookUrl}/status`,
                statusCallbackMethod: 'POST'
            });

            return {
                sid: purchasedNumber.sid,
                phoneNumber: purchasedNumber.phoneNumber,
                friendlyName: purchasedNumber.friendlyName,
                voiceUrl: purchasedNumber.voiceUrl,
                smsUrl: purchasedNumber.smsUrl,
                dateCreated: purchasedNumber.dateCreated,
                status: 'active'
            };
        } catch (error) {
            console.error('❌ Error comprando número en Twilio:', error);
            throw {
                message: `Error comprando número: ${error.message}`,
                status: error.status || 500,
                code: error.code
            };
        }
    }

    /**
     * Actualizar configuración de un número existente
     */
    async updateNumberConfiguration(twilioSid, webhookUrl) {
        try {
            if (!this.client) {
                throw new Error('Cliente Twilio no inicializado.');
            }

            const updatedNumber = await this.client
                .incomingPhoneNumbers(twilioSid)
                .update({
                    voiceUrl: webhookUrl,
                    voiceMethod: 'POST',
                    smsUrl: webhookUrl,
                    smsMethod: 'POST'
                });

            return {
                sid: updatedNumber.sid,
                phoneNumber: updatedNumber.phoneNumber,
                voiceUrl: updatedNumber.voiceUrl
            };
        } catch (error) {
            console.error('❌ Error actualizando número:', error);
            throw {
                message: `Error actualizando número: ${error.message}`,
                status: error.status || 500
            };
        }
    }

    /**
     * Liberar/eliminar un número
     */
    async releaseNumber(twilioSid) {
        try {
            if (!this.client) {
                throw new Error('Cliente Twilio no inicializado.');
            }

            await this.client.incomingPhoneNumbers(twilioSid).remove();

            return {
                success: true,
                message: 'Número liberado exitosamente'
            };
        } catch (error) {
            console.error('❌ Error liberando número:', error);
            throw {
                message: `Error liberando número: ${error.message}`,
                status: error.status || 500
            };
        }
    }
}

export default new TwilioService();