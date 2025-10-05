/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries from the 'products' table
  await knex('products').del();

  // Inserts seed entries
  await knex('products').insert([
    {
      name: 'Wireless Mouse',
      description: 'A comfortable, high-precision wireless mouse.',
      price: 25.99,
      stock_quantity: 150,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches.',
      price: 79.99,
      stock_quantity: 75,
    },
    {
      name: '4K Monitor',
      description: '27-inch 4K UHD monitor with HDR support.',
      price: 349.5,
      stock_quantity: 40,
    },
  ]);
}
