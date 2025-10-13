/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  const hasMessageColumn = await knex.schema.hasColumn('support_tickets', 'message');
  if (hasMessageColumn) {
    // Column already exists, do nothing.
    return;
  }

  // Check for common incorrect names and rename if found.
  const hasDescriptionColumn = await knex.schema.hasColumn('support_tickets', 'description');
  if (hasDescriptionColumn) {
    return knex.schema.alterTable('support_tickets', (table) => {
      table.renameColumn('description', 'message');
    });
  }

  const hasContentColumn = await knex.schema.hasColumn('support_tickets', 'content');
  if (hasContentColumn) {
    return knex.schema.alterTable('support_tickets', (table) => {
      table.renameColumn('content', 'message');
    });
  }
  
  const hasBodyColumn = await knex.schema.hasColumn('support_tickets', 'body');
  if (hasBodyColumn) {
    return knex.schema.alterTable('support_tickets', (table) => {
      table.renameColumn('body', 'message');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  // This will revert the column name back to 'description' if needed.
  // Adjust if your original column name was different.
  return knex.schema.alterTable('support_tickets', (table) => {
    table.renameColumn('message', 'description');
  });
};
