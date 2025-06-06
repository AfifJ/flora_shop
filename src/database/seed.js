const { dbAsync } = require("./database");

const samplePlants = [
  {
    name: "Monstera Deliciosa",
    description:
      "Tanaman hias populer dengan daun berlubang unik yang mudah dirawat",
    price: 150000,
    size_category: "meja",
    size_dimensions: "10 x 15 cm",
    light_intensity: "sedang",
    price_category: "standard",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 25,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFHMB_XIR2ay4SXK5saozi5Tbr8W4_GY_NCQ&s",
    placements: ["meja_kerja", "meja_resepsionis", "ruang_tamu"],
  },
  {
    name: "Snake Plant (Sansevieria)",
    description: "Tanaman yang sangat tahan banting dan cocok untuk pemula",
    price: 75000,
    size_category: "meja",
    size_dimensions: "8 x 12 cm",
    light_intensity: "rendah",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 50,
    image_url:
      "https://www.michlers.com/cdn/shop/products/SnakePlant.jpg?v=1675204628",
    placements: ["meja_kerja", "toilet", "kamar_tidur"],
  },
  {
    name: "Peace Lily",
    description:
      "Tanaman berbunga putih yang indah dan dapat membersihkan udara",
    price: 95000,
    size_category: "meja",
    size_dimensions: "12 x 18 cm",
    light_intensity: "sedang",
    price_category: "standard",
    has_flowers: true,
    indoor_durability: "sedang",
    stock_quantity: 30,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWqlWngUkLI3UvSNPmjRaelzLaCrSBWveuow&s",
    placements: ["ruang_tamu", "meja_resepsionis"],
  },
  {
    name: "Rubber Plant (Ficus Elastica)",
    description:
      "Tanaman dengan daun mengkilap yang dapat tumbuh besar dan mudah dirawat",
    price: 120000,
    size_category: "sedang",
    size_dimensions: "20 x 30 cm",
    light_intensity: "sedang",
    price_category: "standard",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 20,
    image_url:
      "https://abeautifulmess.com/wp-content/uploads/2023/06/rubbertree-1.jpg",
    placements: ["ruang_tamu", "balkon", "dapur"],
  },
  {
    name: "ZZ Plant (Zamioculcas)",
    description:
      "Tanaman super tahan lama yang dapat bertahan dalam kondisi cahaya minim",
    price: 85000,
    size_category: "meja",
    size_dimensions: "15 x 20 cm",
    light_intensity: "rendah",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 40,
    image_url:
      "https://cdn.idntimes.com/content-images/post/20201219/8-2e41e767acb7250e42c0d3ca3a88b902.jpg",
    placements: ["meja_kerja", "meja_resepsionis", "toilet", "kamar_tidur"],
  },
  {
    name: "Pothos Golden",
    description:
      "Tanaman merambat dengan daun hijau keemasan yang mudah diperbanyak",
    price: 45000,
    size_category: "meja",
    size_dimensions: "8 x 10 cm",
    light_intensity: "rendah",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 60,
    image_url:
      "https://aroidwiki.com/wp-content/uploads/2021/11/golden-pothos-care-image1-768x1024.jpg",
    placements: ["meja_kerja", "kamar_tidur", "dapur", "balkon"],
  },
  {
    name: "Fiddle Leaf Fig",
    description:
      "Tanaman dengan daun besar berbentuk biola yang sangat instagramable",
    price: 250000,
    size_category: "besar",
    size_dimensions: "30 x 50 cm",
    light_intensity: "tinggi",
    price_category: "premium",
    has_flowers: false,
    indoor_durability: "sedang",
    stock_quantity: 15,
    image_url:
      "https://bloomscape.com/wp-content/uploads/2020/08/bloomscape_fiddle-leaf-fig_charcoal-e1652800894846.jpg?ver=279577",
    placements: ["ruang_tamu", "balkon"],
  },
  {
    name: "Spider Plant (Chlorophytum)",
    description:
      "Tanaman dengan daun bergaris putih yang menghasilkan plantlet atau anak tanaman",
    price: 55000,
    size_category: "meja",
    size_dimensions: "12 x 15 cm",
    light_intensity: "sedang",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 45,
    image_url:
      "https://seedlingsindia.com/wp-content/uploads/2024/09/Chlorophytum-comosum-aka-Spider-Plant.jpg",
    placements: ["meja_kerja", "meja_resepsionis", "kamar_tidur", "dapur"],
  },
  {
    name: "Anthurium Red",
    description: "Tanaman berbunga merah cerah yang tahan lama dan eksotis",
    price: 180000,
    size_category: "meja",
    size_dimensions: "15 x 20 cm",
    light_intensity: "sedang",
    price_category: "premium",
    has_flowers: true,
    indoor_durability: "sedang",
    stock_quantity: 18,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEecrVLdks9tjy7kp7gFT6xXo3JH74voWQNQ&s",
    placements: ["ruang_tamu", "meja_resepsionis", "balkon"],
  },
  {
    name: "Boston Fern",
    description:
      "Pakis dengan daun yang rimbun dan elegan, cocok untuk ruangan lembab",
    price: 65000,
    size_category: "meja",
    size_dimensions: "18 x 25 cm",
    light_intensity: "rendah",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "sedang",
    stock_quantity: 35,
    image_url:
      "https://www.houseplant.co.uk/cdn/shop/files/Boston_Fern_Green_Moment_Indoor_Tropical_Houseplant.jpg?v=1737121676",
    placements: ["toilet", "kamar_tidur", "dapur"],
  },
  {
    name: "Philodendron Brasil",
    description:
      "Tanaman merambat dengan daun hijau dan kuning yang mudah tumbuh",
    price: 70000,
    size_category: "meja",
    size_dimensions: "10 x 15 cm",
    light_intensity: "sedang",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 38,
    image_url:
      "https://plantify.co.za/cdn/shop/products/PhilodendronBrasilTealPlanterBluePot.jpg?v=1669372045&width=1080",
    placements: ["meja_kerja", "ruang_tamu", "balkon", "dapur"],
  },
  {
    name: "Dracaena Marginata",
    description:
      "Tanaman dengan batang ramping dan daun meruncing berwarna hijau dengan tepi merah",
    price: 135000,
    size_category: "sedang",
    size_dimensions: "25 x 40 cm",
    light_intensity: "sedang",
    price_category: "standard",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 22,
    image_url:
      "https://www.tropicalplantsuk.com/wp-content/uploads/2023/01/Marginata-15cm-Cane-SINGLE-13cm-Pot.jpg",
    placements: ["ruang_tamu", "meja_resepsionis", "balkon"],
  },
  {
    name: "Aloe Vera",
    description: "Tanaman sukulen dengan khasiat obat yang mudah dirawat",
    price: 40000,
    size_category: "meja",
    size_dimensions: "8 x 12 cm",
    light_intensity: "tinggi",
    price_category: "ekonomis",
    has_flowers: false,
    indoor_durability: "tinggi",
    stock_quantity: 55,
    image_url:
      "https://cdn.shopify.com/s/files/1/0597/1460/1169/products/000114-01_1.jpg?v=1643724100",
    placements: ["meja_kerja", "dapur", "balkon", "kamar_tidur"],
  },
  {
    name: "Calathea Ornata",
    description: "Tanaman dengan motif daun yang indah berwarna pink dan hijau",
    price: 110000,
    size_category: "meja",
    size_dimensions: "12 x 18 cm",
    light_intensity: "rendah",
    price_category: "standard",
    has_flowers: false,
    indoor_durability: "sedang",
    stock_quantity: 28,
    image_url:
      "https://www.thespruce.com/thmb/BeX3Y8rTSOZN2w3jxyT6C3Y1Ofk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPS-calathea-ornata-04-f03b60a264fd49e1b8abf15282fcf607.jpg",
    placements: ["kamar_tidur", "ruang_tamu", "toilet"],
  },
];

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    for (const plant of samplePlants) {
      const { placements, ...plantData } = plant;

      // Insert plant
      const result = await dbAsync.run(
        `
                INSERT INTO plants (
                    name, description, price, size_category, size_dimensions,
                    light_intensity, price_category, has_flowers, indoor_durability,
                    stock_quantity, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
        [
          plantData.name,
          plantData.description,
          plantData.price,
          plantData.size_category,
          plantData.size_dimensions,
          plantData.light_intensity,
          plantData.price_category,
          plantData.has_flowers,
          plantData.indoor_durability,
          plantData.stock_quantity,
          plantData.image_url,
        ]
      );

      // Insert placements
      for (const placement of placements) {
        await dbAsync.run(
          `
                    INSERT INTO plant_placements (plant_id, placement_type)
                    VALUES (?, ?)
                `,
          [result.id, placement]
        );
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
