// Obey openapi.yaml

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries from the products table
  await knex('products').del();

  // Inserts seed entries for featured products
  await knex('products').insert([
    {
      id: 1,
      name: 'Raspberry Pi 4 Model B 4GB',
      description: 'Small single-board computer',
      price: 49.99,
      image_url: '/images/pi4.jpg',
      stock: 50,
      is_featured: true,
    },
    {
      id: 2,
      name: 'ESP32 Dev Module',
      description: 'Wi-Fi + BLE microcontroller',
      price: 6.5,
      image_url: '/images/esp32.jpg',
      stock: 150,
      is_featured: true,
    },
    {
      id: 3,
      name: '18650 Li-ion Battery',
      description: 'High capacity rechargeable cell',
      price: 8.25,
      image_url: '/images/battery.jpg',
      stock: 300,
      is_featured: true,
    },
    {
      id: 4,
      name: 'USB-C PD 65W Charger',
      description: 'Fast charging for laptops & phones',
      price: 24.0,
      image_url: '/images/charger.jpg',
      stock: 75,
      is_featured: true,
    },
  ]);
}
