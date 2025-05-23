const Plant = require('../models/Plant');

class PlantController {
    static async getAllPlants(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const offset = (page - 1) * limit;

            const plants = await Plant.findAll({ ...filters, limit, offset });
            const totalItems = await Plant.getCount(filters);
            const totalPages = Math.ceil(totalItems / limit);

            res.json({
                success: true,
                data: {
                    plants,
                    pagination: {
                        current_page: page,
                        total_pages: totalPages,
                        total_items: totalItems,
                        items_per_page: limit
                    }
                }
            });
        } catch (error) {
            console.error('Error getting plants:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async getPlantById(req, res) {
        try {
            const { id } = req.params;
            const plant = await Plant.findById(id);

            if (!plant) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PLANT_NOT_FOUND',
                        message: `Plant with ID ${id} not found`
                    }
                });
            }

            res.json({
                success: true,
                data: plant
            });
        } catch (error) {
            console.error('Error getting plant:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async createPlant(req, res) {
        try {
            const plant = await Plant.create(req.body);
            
            res.status(201).json({
                success: true,
                data: plant
            });
        } catch (error) {
            console.error('Error creating plant:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async updatePlant(req, res) {
        try {
            const { id } = req.params;
            
            // Check if plant exists
            const existingPlant = await Plant.findById(id);
            if (!existingPlant) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PLANT_NOT_FOUND',
                        message: `Plant with ID ${id} not found`
                    }
                });
            }

            const plant = await Plant.update(id, req.body);
            
            res.json({
                success: true,
                data: plant
            });
        } catch (error) {
            console.error('Error updating plant:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async deletePlant(req, res) {
        try {
            const { id } = req.params;
            
            // Check if plant exists
            const existingPlant = await Plant.findById(id);
            if (!existingPlant) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PLANT_NOT_FOUND',
                        message: `Plant with ID ${id} not found`
                    }
                });
            }

            await Plant.delete(id);
            
            res.json({
                success: true,
                message: 'Plant deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting plant:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async getFilters(req, res) {
        try {
            const priceRange = await Plant.getPriceRange();
            
            res.json({
                success: true,
                data: {
                    size_categories: ['meja', 'sedang', 'besar'],
                    light_intensities: ['rendah', 'sedang', 'tinggi'],
                    price_categories: ['ekonomis', 'standard', 'premium'],
                    placement_types: [
                        'meja_kerja',
                        'meja_resepsionis',
                        'pagar',
                        'toilet',
                        'ruang_tamu',
                        'kamar_tidur',
                        'dapur',
                        'balkon'
                    ],
                    indoor_durabilities: ['rendah', 'sedang', 'tinggi'],
                    price_range: {
                        min: priceRange.min || 0,
                        max: priceRange.max || 0
                    }
                }
            });
        } catch (error) {
            console.error('Error getting filters:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async searchPlants(req, res) {
        try {
            const { q } = req.query;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const plants = await Plant.findAll({ search: q, limit, offset });
            const totalItems = await Plant.getCount({ search: q });
            const totalPages = Math.ceil(totalItems / limit);

            res.json({
                success: true,
                data: {
                    plants,
                    pagination: {
                        current_page: parseInt(page),
                        total_pages: totalPages,
                        total_items: totalItems,
                        items_per_page: parseInt(limit)
                    }
                }
            });
        } catch (error) {
            console.error('Error searching plants:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }

    static async getRecommendations(req, res) {
        try {
            const { placement, light } = req.query;
            const filters = {};
            
            if (placement) filters.placement = placement;
            if (light) filters.light_intensity = light;

            const plants = await Plant.findAll({ ...filters, limit: 10 });

            res.json({
                success: true,
                data: {
                    plants,
                    criteria: {
                        placement,
                        light_intensity: light
                    }
                }
            });
        } catch (error) {
            console.error('Error getting recommendations:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            });
        }
    }
}

module.exports = PlantController;
