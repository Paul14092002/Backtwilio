import espoCrmAxios from '../config/axios.js';

/**
 * Get a list of entities from EspoCRM
 * @param {string} entityType - The entity type (e.g., 'Account', 'Contact', 'Lead')
 * @param {object} params - Query parameters (offset, maxSize, where, orderBy, etc.)
 * @returns {Promise} - Response from EspoCRM
 */
export const getEntities = async (entityType, params = {}) => {
    try {
        const response = await espoCrmAxios.get(`/${entityType}`, { params });
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};

/**
 * Get a single entity by ID
 * @param {string} entityType - The entity type
 * @param {string} id - The entity ID
 * @returns {Promise} - Response from EspoCRM
 */
export const getEntityById = async (entityType, id) => {
    try {
        const response = await espoCrmAxios.get(`/${entityType}/${id}`);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};

/**
 * Create a new entity
 * @param {string} entityType - The entity type
 * @param {object} data - The entity data
 * @returns {Promise} - Response from EspoCRM
 */
export const createEntity = async (entityType, data) => {
    try {
        const response = await espoCrmAxios.post(`/${entityType}`, data);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};

/**
 * Update an entity
 * @param {string} entityType - The entity type
 * @param {string} id - The entity ID
 * @param {object} data - The updated data
 * @returns {Promise} - Response from EspoCRM
 */
export const updateEntity = async (entityType, id, data) => {
    try {
        const response = await espoCrmAxios.put(`/${entityType}/${id}`, data);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};

/**
 * Delete an entity
 * @param {string} entityType - The entity type
 * @param {string} id - The entity ID
 * @returns {Promise} - Response from EspoCRM
 */
export const deleteEntity = async (entityType, id) => {
    try {
        const response = await espoCrmAxios.delete(`/${entityType}/${id}`);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};
