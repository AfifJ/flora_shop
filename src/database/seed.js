const { dbAsync } = require('./database');

const samplePlants = [
    {
        name: 'Monstera Deliciosa',
        description: 'Tanaman hias populer dengan daun berlubang unik yang mudah dirawat',
        price: 150000,
        size_category: 'meja',
        size_dimensions: '10 x 15 cm',
        light_intensity: 'sedang',
        price_category: 'standard',
        has_flowers: false,
        indoor_durability: 'tinggi',
        stock_quantity: 25,
        image_url: 'https://example.com/images/monstera.jpg',
        placements: ['meja_kerja', 'meja_resepsionis', 'ruang_tamu']
    },
    {
        name: 'Snake Plant (Sansevieria)',
        description: 'Tanaman yang sangat tahan banting dan cocok untuk pemula',
        price: 75000,
        size_category: 'meja',
        size_dimensions: '8 x 12 cm',
        light_intensity: 'rendah',
        price_category: 'ekonomis',
        has_flowers: false,
        indoor_durability: 'tinggi',
        stock_quantity: 50,
        image_url: 'https://example.com/images/snake-plant.jpg',
        placements: ['meja_kerja', 'toilet', 'kamar_tidur']
    },
    {
        name: 'Peace Lily',
        description: 'Tanaman berbunga putih yang indah dan dapat membersihkan udara',
        price: 95000,
        size_category: 'meja',
        size_dimensions: '12 x 18 cm',
        light_intensity: 'sedang',
        price_category: 'standard',
        has_flowers: true,
        indoor_durability: 'sedang',
        stock_quantity: 30,
        image_url: 'https://example.com/images/peace-lily.jpg',
        placements: ['ruang_tamu', 'meja_resepsionis']
    }
];

async function seedDatabase() {
    try {
        console.log('Seeding database...');
        
        for (const plant of samplePlants) {
            const { placements, ...plantData } = plant;
            
            // Insert plant
            const result = await dbAsync.run(`
                INSERT INTO plants (
                    name, description, price, size_category, size_dimensions,
                    light_intensity, price_category, has_flowers, indoor_durability,
                    stock_quantity, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                plantData.name, plantData.description, plantData.price,
                plantData.size_category, plantData.size_dimensions,
                plantData.light_intensity, plantData.price_category,
                plantData.has_flowers, plantData.indoor_durability,
                plantData.stock_quantity, plantData.image_url
            ]);

            // Insert placements
            for (const placement of placements) {
                await dbAsync.run(`
                    INSERT INTO plant_placements (plant_id, placement_type)
                    VALUES (?, ?)
                `, [result.id, placement]);
            }
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

if (require.main === module) {
    seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
