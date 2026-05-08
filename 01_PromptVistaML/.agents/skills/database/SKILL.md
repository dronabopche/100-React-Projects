---
name: database-supabase
description: Helps with database integration and operations. Use when you need to read or write data to Supabase.
---

# Database (Supabase) Skill

Detailed instructions for the agent regarding Supabase database operations in PromptVista ML.

## When to use this skill

- Use this when writing queries, mutations, or handling database schemas in `src/services/supabase.js`.
- This is helpful for managing the `models` and `products` tables.

## How to use it

### Design Patterns
- **Fluent Query Builder**: Use the Supabase JS client's fluent API (`supabase.from('table').select('*')...`).
- **Search Logic**: Use `.or()` with `.ilike()` for fuzzy searching across multiple columns (e.g., searching by name, description, and category).
- **Ordering**: Always apply an `.order()` clause (e.g., by `created_at` or `priority`) to ensure consistent data presentation.

### Conventions
- **Schema Reference**:
  - `models` table: `id`, `model_name`, `model_description`, `category`, `tags`, `model_number`.
  - `products` table: `id`, `Name`, `description`, `priority`, `URL`.
- **Single Record Fetching**: Use `.eq('id', id).single()` when fetching a specific item by its unique identifier.
- **Error Resilience**: Return empty arrays `[]` instead of `null` for list fetches to prevent frontend mapping errors.
- **Real-time Awareness**: The platform assumes a "Live from Database" model where UI updates are driven by data changes in Supabase.
