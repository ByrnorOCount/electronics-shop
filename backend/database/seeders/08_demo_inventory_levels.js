/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("products")
    .whereNotIn("id", [9, 30])
    .where("stock", "<", 12)
    .update({ stock: 12 });

  await knex("products").where({ id: 9 }).update({ stock: 3 });
  await knex("products").where({ id: 30 }).update({ stock: 4 });
}