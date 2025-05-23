# Flora Shop REST API Design

## Database Schema

### Plants Table
```sql
CREATE TABLE plants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    size_category ENUM('meja', 'sedang', 'besar') NOT NULL,
    size_dimensions VARCHAR(50), -- e.g., "10 x 15 cm"
    light_intensity ENUM('rendah', 'sedang', 'tinggi') NOT NULL,
    price_category ENUM('ekonomis', 'standard', 'premium') NOT NULL,
    has_flowers BOOLEAN DEFAULT FALSE,
    indoor_durability ENUM('rendah', 'sedang', 'tinggi') NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Plant Placements Table (Many-to-Many)
```sql
CREATE TABLE plant_placements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plant_id BIGINT,
    placement_type ENUM('meja_kerja', 'meja_resepsionis', 'pagar', 'toilet', 'ruang_tamu', 'kamar_tidur', 'dapur', 'balkon') NOT NULL,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_plant_placement (plant_id, placement_type)
);
```

### Categories Table (Optional for future expansion)
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plant_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plant_id BIGINT,
    category_id BIGINT,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_plant_category (plant_id, category_id)
);
```

## REST API Endpoints

### Base URL
```
https://api.florashop.com/v1
```

### Authentication
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Plants Endpoints

### 1. Get All Plants
```
GET /plants
```

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)
- `size_category` (string): Filter by size (meja, sedang, besar)
- `light_intensity` (string): Filter by light intensity
- `price_category` (string): Filter by price category
- `has_flowers` (boolean): Filter by flowering plants
- `placement` (string): Filter by placement type
- `min_price` (decimal): Minimum price filter
- `max_price` (decimal): Maximum price filter
- `search` (string): Search in name and description

**Response Example:**
```json
{
    "success": true,
    "data": {
        "plants": [
            {
                "id": 1,
                "name": "Monstera Deliciosa",
                "description": "Tanaman hias populer dengan daun berlubang unik",
                "price": 150000,
                "size_category": "meja",
                "size_dimensions": "10 x 15 cm",
                "light_intensity": "sedang",
                "price_category": "standard",
                "has_flowers": false,
                "indoor_durability": "tinggi",
                "stock_quantity": 25,
                "image_url": "https://example.com/images/monstera.jpg",
                "placements": ["meja_kerja", "meja_resepsionis", "ruang_tamu"],
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T10:30:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 100,
            "items_per_page": 20
        }
    }
}
```

### 2. Get Plant by ID
```
GET /plants/{id}
```

**Response Example:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Monstera Deliciosa",
        "description": "Tanaman hias populer dengan daun berlubang unik yang mudah dirawat",
        "price": 150000,
        "size_category": "meja",
        "size_dimensions": "10 x 15 cm",
        "light_intensity": "sedang",
        "price_category": "standard",
        "has_flowers": false,
        "indoor_durability": "tinggi",
        "stock_quantity": 25,
        "image_url": "https://example.com/images/monstera.jpg",
        "placements": ["meja_kerja", "meja_resepsionis", "ruang_tamu"],
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    }
}
```

### 3. Create New Plant
```
POST /plants
```

**Request Body:**
```json
{
    "name": "Snake Plant",
    "description": "Tanaman yang sangat tahan banting dan cocok untuk pemula",
    "price": 75000,
    "size_category": "meja",
    "size_dimensions": "8 x 12 cm",
    "light_intensity": "rendah",
    "price_category": "ekonomis",
    "has_flowers": false,
    "indoor_durability": "tinggi",
    "stock_quantity": 50,
    "image_url": "https://example.com/images/snake-plant.jpg",
    "placements": ["meja_kerja", "toilet", "kamar_tidur"]
}
```

### 4. Update Plant
```
PUT /plants/{id}
```

**Request Body:** (Same as create, all fields optional)

### 5. Delete Plant
```
DELETE /plants/{id}
```

---

## Filter Options Endpoints

### 1. Get All Available Filters
```
GET /plants/filters
```

**Response:**
```json
{
    "success": true,
    "data": {
        "size_categories": ["meja", "sedang", "besar"],
        "light_intensities": ["rendah", "sedang", "tinggi"],
        "price_categories": ["ekonomis", "standard", "premium"],
        "placement_types": [
            "meja_kerja",
            "meja_resepsionis", 
            "pagar",
            "toilet",
            "ruang_tamu",
            "kamar_tidur",
            "dapur",
            "balkon"
        ],
        "indoor_durabilities": ["rendah", "sedang", "tinggi"],
        "price_range": {
            "min": 25000,
            "max": 500000
        }
    }
}
```

---

## Search and Recommendations

### 1. Search Plants
```
GET /plants/search?q={query}
```

### 2. Get Recommended Plants
```
GET /plants/recommendations?placement={placement}&light={light_intensity}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "price": ["Price must be a positive number"],
            "name": ["Name is required"]
        }
    }
}
```

### 404 Not Found
```json
{
    "success": false,
    "error": {
        "code": "PLANT_NOT_FOUND",
        "message": "Plant with ID 123 not found"
    }
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred"
    }
}
```

---

## Additional Considerations

### 1. Image Upload
```
POST /plants/{id}/images
Content-Type: multipart/form-data
```

### 2. Bulk Operations
```
POST /plants/bulk
PUT /plants/bulk
DELETE /plants/bulk
```

### 3. Plant Care Instructions (Future Enhancement)
```
GET /plants/{id}/care-instructions
POST /plants/{id}/care-instructions
```

### 4. Plant Reviews (Future Enhancement)
```
GET /plants/{id}/reviews
POST /plants/{id}/reviews
```

---

## Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_plants_price ON plants(price);
CREATE INDEX idx_plants_size_category ON plants(size_category);
CREATE INDEX idx_plants_light_intensity ON plants(light_intensity);
CREATE INDEX idx_plants_price_category ON plants(price_category);
CREATE INDEX idx_plants_has_flowers ON plants(has_flowers);
CREATE INDEX idx_plants_active ON plants(is_active);
CREATE INDEX idx_plants_name ON plants(name);

-- Composite indexes for common queries
CREATE INDEX idx_plants_filters ON plants(size_category, light_intensity, price_category, is_active);
CREATE INDEX idx_plants_search ON plants(name, description, is_active);
```

---

## Rate Limiting

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 500 requests per minute
- **Admin endpoints**: 1000 requests per minute
