const Joi = require('joi');

const plantSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow(''),
    price: Joi.number().positive().required(),
    size_category: Joi.string().valid('meja', 'sedang', 'besar').required(),
    size_dimensions: Joi.string().max(50),
    light_intensity: Joi.string().valid('rendah', 'sedang', 'tinggi').required(),
    price_category: Joi.string().valid('ekonomis', 'standard', 'premium').required(),
    has_flowers: Joi.boolean().default(false),
    indoor_durability: Joi.string().valid('rendah', 'sedang', 'tinggi').required(),
    stock_quantity: Joi.number().integer().min(0).default(0),
    image_url: Joi.string().uri().allow(''),
    placements: Joi.array().items(
        Joi.string().valid(
            'meja_kerja', 'meja_resepsionis', 'pagar', 'toilet',
            'ruang_tamu', 'kamar_tidur', 'dapur', 'balkon'
        )
    ).min(1)
});

const updatePlantSchema = plantSchema.fork(
    ['name', 'price', 'size_category', 'light_intensity', 'price_category', 'indoor_durability', 'placements'],
    (schema) => schema.optional()
);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    size_category: Joi.string().valid('meja', 'sedang', 'besar'),
    light_intensity: Joi.string().valid('rendah', 'sedang', 'tinggi'),
    price_category: Joi.string().valid('ekonomis', 'standard', 'premium'),
    has_flowers: Joi.boolean(),
    placement: Joi.string().valid(
        'meja_kerja', 'meja_resepsionis', 'pagar', 'toilet',
        'ruang_tamu', 'kamar_tidur', 'dapur', 'balkon'
    ),
    min_price: Joi.number().positive(),
    max_price: Joi.number().positive(),
    search: Joi.string().max(255)
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input data',
                    details: error.details.reduce((acc, detail) => {
                        acc[detail.path[0]] = [detail.message];
                        return acc;
                    }, {})
                }
            });
        }
        req.body = value;
        next();
    };
};

const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid query parameters',
                    details: error.details.reduce((acc, detail) => {
                        acc[detail.path[0]] = [detail.message];
                        return acc;
                    }, {})
                }
            });
        }
        req.query = value;
        next();
    };
};

module.exports = {
    plantSchema,
    updatePlantSchema,
    querySchema,
    validate,
    validateQuery
};
