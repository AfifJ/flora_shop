const express = require('express');
const PlantController = require('../controllers/plantController');
const { validate, validateQuery, plantSchema, updatePlantSchema, querySchema } = require('../middleware/validation');

const router = express.Router();

// Plant CRUD routes
router.get('/', validateQuery(querySchema), PlantController.getAllPlants);
router.get('/filters', PlantController.getFilters);
router.get('/search', PlantController.searchPlants);
router.get('/recommendations', PlantController.getRecommendations);
router.get('/:id', PlantController.getPlantById);
router.post('/', validate(plantSchema), PlantController.createPlant);
router.put('/:id', validate(updatePlantSchema), PlantController.updatePlant);
router.delete('/:id', PlantController.deletePlant);

module.exports = router;
