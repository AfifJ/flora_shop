const { dbAsync } = require('./database');

async function initializeDatabase() {
    try {
        console.log('Initializing database schema...');

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

        // Create categories table
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create plant_categories table
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS plant_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plant_id INTEGER,
                category_id INTEGER,
                FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
                UNIQUE(plant_id, category_id)
            )
        `);

        // Create indexes
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_price ON plants(price)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_size_category ON plants(size_category)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_light_intensity ON plants(light_intensity)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_price_category ON plants(price_category)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_has_flowers ON plants(has_flowers)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_plants_active ON plants(is_active)');

        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase().then(() => process.exit(0));
}

module.exports = initializeDatabase;
