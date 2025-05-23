# Flora Shop REST API

A complete REST API for plant store management built with Express.js and SQLite.

## Features

- Complete CRUD operations for plants
- Advanced filtering and search
- Pagination support
- Plant recommendations
- Rate limiting
- Input validation
- SQLite database with proper schema
- Database seeding for testing

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize database:**
   ```bash
   npm run init-db
   ```

3. **Seed database with sample data:**
   ```bash
   npm run seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000/api/v1`

## API Endpoints

### Plants
- `GET /api/v1/plants` - Get all plants with filtering and pagination
- `GET /api/v1/plants/:id` - Get plant by ID
- `POST /api/v1/plants` - Create new plant
- `PUT /api/v1/plants/:id` - Update plant
- `DELETE /api/v1/plants/:id` - Delete plant (soft delete)

### Filters & Search
- `GET /api/v1/plants/filters` - Get available filter options
- `GET /api/v1/plants/search?q={query}` - Search plants
- `GET /api/v1/plants/recommendations?placement={placement}&light={light}` - Get recommendations

### Health Check
- `GET /api/v1/health` - API health status

## Query Parameters

### GET /api/v1/plants
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)
- `size_category` (string): meja, sedang, besar
- `light_intensity` (string): rendah, sedang, tinggi
- `price_category` (string): ekonomis, standard, premium
- `has_flowers` (boolean): true/false
- `placement` (string): meja_kerja, meja_resepsionis, pagar, toilet, etc.
- `min_price` (number): Minimum price
- `max_price` (number): Maximum price
- `search` (string): Search in name and description

## Example Usage

### Get all plants with filters
```bash
curl "http://localhost:3000/api/v1/plants?size_category=meja&light_intensity=sedang&page=1&limit=10"
```

### Create a new plant
```bash
curl -X POST http://localhost:3000/api/v1/plants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fiddle Leaf Fig",
    "description": "Tanaman hias dengan daun besar dan indah",
    "price": 200000,
    "size_category": "sedang",
    "size_dimensions": "20 x 30 cm",
    "light_intensity": "tinggi",
    "price_category": "premium",
    "has_flowers": false,
    "indoor_durability": "sedang",
    "stock_quantity": 15,
    "placements": ["ruang_tamu", "balkon"]
  }'
```

### Search plants
```bash
curl "http://localhost:3000/api/v1/plants/search?q=monstera"
```

### Get recommendations
```bash
curl "http://localhost:3000/api/v1/plants/recommendations?placement=meja_kerja&light=rendah"
```

## Database Schema

The API uses SQLite with the following main tables:
- `plants` - Main plant information
- `plant_placements` - Plant placement options (many-to-many)
- `categories` - Plant categories (for future use)
- `plant_categories` - Plant-category relationships

## Rate Limiting

- Public endpoints: 100 requests per minute per IP
- Rate limit headers are included in responses

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional validation details
  }
}
```

## Project Structure

```
flora_shop/
├── src/
│   ├── controllers/     # Request handlers
│   ├── database/        # Database config and initialization
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # Route definitions
│   └── server.js        # Main server file
├── data/                # SQLite database files (auto-created)
├── package.json
└── README.md
```
