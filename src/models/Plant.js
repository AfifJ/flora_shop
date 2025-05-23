const { dbAsync } = require('../database/database');

class Plant {
    static async findAll(filters = {}) {
        let query = `
            SELECT p.*, GROUP_CONCAT(pp.placement_type) as placements
            FROM plants p
            LEFT JOIN plant_placements pp ON p.id = pp.plant_id
            WHERE p.is_active = 1
        `;
        const params = [];

        // Apply filters
        if (filters.size_category) {
            query += ' AND p.size_category = ?';
            params.push(filters.size_category);
        }

        if (filters.light_intensity) {
            query += ' AND p.light_intensity = ?';
            params.push(filters.light_intensity);
        }

        if (filters.price_category) {
            query += ' AND p.price_category = ?';
            params.push(filters.price_category);
        }

        if (filters.has_flowers !== undefined) {
            query += ' AND p.has_flowers = ?';
            params.push(filters.has_flowers);
        }

        if (filters.min_price) {
            query += ' AND p.price >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND p.price <= ?';
            params.push(filters.max_price);
        }

        if (filters.search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.placement) {
            query += ' AND EXISTS (SELECT 1 FROM plant_placements pp2 WHERE pp2.plant_id = p.id AND pp2.placement_type = ?)';
            params.push(filters.placement);
        }

        query += ' GROUP BY p.id ORDER BY p.created_at DESC';

        // Add pagination
        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        if (filters.offset) {
            query += ' OFFSET ?';
            params.push(filters.offset);
        }

        const plants = await dbAsync.all(query, params);
        
        return plants.map(plant => ({
            ...plant,
            has_flowers: Boolean(plant.has_flowers),
            is_active: Boolean(plant.is_active),
            placements: plant.placements ? plant.placements.split(',') : []
        }));
    }

    static async findById(id) {
        const plant = await dbAsync.get(`
            SELECT p.*, GROUP_CONCAT(pp.placement_type) as placements
            FROM plants p
            LEFT JOIN plant_placements pp ON p.id = pp.plant_id
            WHERE p.id = ? AND p.is_active = 1
            GROUP BY p.id
        `, [id]);

        if (!plant) return null;

        return {
            ...plant,
            has_flowers: Boolean(plant.has_flowers),
            is_active: Boolean(plant.is_active),
            placements: plant.placements ? plant.placements.split(',') : []
        };
    }

    static async create(plantData) {
        const { placements, ...data } = plantData;
        
        const result = await dbAsync.run(`
            INSERT INTO plants (
                name, description, price, size_category, size_dimensions,
                light_intensity, price_category, has_flowers, indoor_durability,
                stock_quantity, image_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.name, data.description, data.price, data.size_category,
            data.size_dimensions, data.light_intensity, data.price_category,
            data.has_flowers, data.indoor_durability, data.stock_quantity,
            data.image_url
        ]);

        // Insert placements
        if (placements && placements.length > 0) {
            for (const placement of placements) {
                await dbAsync.run(`
                    INSERT INTO plant_placements (plant_id, placement_type)
                    VALUES (?, ?)
                `, [result.id, placement]);
            }
        }

        return this.findById(result.id);
    }

    static async update(id, plantData) {
        const { placements, ...data } = plantData;
        
        // Update plant data
        const updateFields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const updateValues = Object.values(data);
        
        if (updateFields) {
            await dbAsync.run(`
                UPDATE plants SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [...updateValues, id]);
        }

        // Update placements if provided
        if (placements) {
            await dbAsync.run('DELETE FROM plant_placements WHERE plant_id = ?', [id]);
            for (const placement of placements) {
                await dbAsync.run(`
                    INSERT INTO plant_placements (plant_id, placement_type)
                    VALUES (?, ?)
                `, [id, placement]);
            }
        }

        return this.findById(id);
    }

    static async delete(id) {
        return await dbAsync.run('UPDATE plants SET is_active = 0 WHERE id = ?', [id]);
    }

    static async getCount(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM plants WHERE is_active = 1';
        const params = [];

        // Apply same filters as findAll
        if (filters.size_category) {
            query += ' AND size_category = ?';
            params.push(filters.size_category);
        }

        if (filters.light_intensity) {
            query += ' AND light_intensity = ?';
            params.push(filters.light_intensity);
        }

        if (filters.price_category) {
            query += ' AND price_category = ?';
            params.push(filters.price_category);
        }

        if (filters.has_flowers !== undefined) {
            query += ' AND has_flowers = ?';
            params.push(filters.has_flowers);
        }

        if (filters.min_price) {
            query += ' AND price >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND price <= ?';
            params.push(filters.max_price);
        }

        if (filters.search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.placement) {
            query += ' AND EXISTS (SELECT 1 FROM plant_placements pp WHERE pp.plant_id = plants.id AND pp.placement_type = ?)';
            params.push(filters.placement);
        }

        const result = await dbAsync.get(query, params);
        return result.count;
    }

    static async getPriceRange() {
        const result = await dbAsync.get(`
            SELECT MIN(price) as min, MAX(price) as max
            FROM plants WHERE is_active = 1
        `);
        return result;
    }
}

module.exports = Plant;
