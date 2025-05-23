const path = require('path');
const fs = require('fs');

let db, dbAsync;

if (process.env.NODE_ENV === 'production') {
    // Use in-memory SQLite for serverless (temporary solution)
    const sqlite3 = require('sqlite3').verbose();
    
    // Create in-memory database for serverless
    db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.error('Error opening in-memory database:', err.message);
        } else {
            console.log('Connected to in-memory SQLite database');
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON');
            
            // Initialize database schema immediately
            initializeSchema();
        }
    });
} else {
    // Local development with file-based SQLite
    const sqlite3 = require('sqlite3').verbose();
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('Created data directory:', dataDir);
    }

    // Database file path
    const dbPath = path.join(dataDir, 'flora_shop.db');

    // Create database connection
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            console.error('Database path:', dbPath);
        } else {
            console.log('Connected to SQLite database at:', dbPath);
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON');
        }
    });
}

// Promisify database methods
dbAsync = {
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    },
    
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Initialize schema for production (in-memory database)
async function initializeSchema() {
    try {
        console.log('Initializing in-memory database schema...');

        // Create plants table
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS plants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                size_category TEXT CHECK(size_category IN ('meja', 'sedang', 'besar')) NOT NULL,
                size_dimensions VARCHAR(50),
                light_intensity TEXT CHECK(light_intensity IN ('rendah', 'sedang', 'tinggi')) NOT NULL,
                price_category TEXT CHECK(price_category IN ('ekonomis', 'standard', 'premium')) NOT NULL,
                has_flowers BOOLEAN DEFAULT FALSE,
                indoor_durability TEXT CHECK(indoor_durability IN ('rendah', 'sedang', 'tinggi')) NOT NULL,
                stock_quantity INTEGER DEFAULT 0,
                image_url VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create plant_placements table
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS plant_placements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plant_id INTEGER,
                placement_type TEXT CHECK(placement_type IN (
                    'meja_kerja', 'meja_resepsionis', 'pagar', 'toilet', 
                    'ruang_tamu', 'kamar_tidur', 'dapur', 'balkon'
                )) NOT NULL,
                FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
                UNIQUE(plant_id, placement_type)
            )
        `);

        // Create indexes
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_price ON plants(price)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_size_category ON plants(size_category)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_light_intensity ON plants(light_intensity)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_active ON plants(is_active)');

        // Seed with sample data for production
        await seedSampleData();

        console.log('In-memory database initialized and seeded successfully');
    } catch (error) {
        console.error('Error initializing schema:', error);
    }
}

// Seed sample data for production
async function seedSampleData() {
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

    for (const plant of samplePlants) {
        const { placements, ...plantData } = plant;
        
        try {
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
        } catch (error) {
            console.error('Error seeding plant:', plantData.name, error);
        }
    }
}

module.exports = { db, dbAsync };
