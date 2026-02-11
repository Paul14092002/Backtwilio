import * as espoCrmService from '../services/espoCrmService.js';

/**
 * Get list of entities
 */
export const getEntities = async (req, res) => {
    try {
        const { entityType } = req.params;
        const data = await espoCrmService.getEntities(entityType, req.query);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

/**
 * Get single entity by ID
 */
export const getEntityById = async (req, res) => {
    try {
        const { entityType, id } = req.params;
        const data = await espoCrmService.getEntityById(entityType, id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

/**
 * Create new entity
 */
export const createEntity = async (req, res) => {
    try {
        const { entityType } = req.params;
        const data = await espoCrmService.createEntity(entityType, req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

/**
 * Update entity
 */
export const updateEntity = async (req, res) => {
    try {
        const { entityType, id } = req.params;
        const data = await espoCrmService.updateEntity(entityType, id, req.body);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

/**
 * Delete entity
 */
export const deleteEntity = async (req, res) => {
    try {
        const { entityType, id } = req.params;
        await espoCrmService.deleteEntity(entityType, id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
