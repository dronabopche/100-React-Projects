---
name: database-schema-structure
description: This skill defines the database architecture, schema conventions, and implementation patterns for the PromptVista ML platformm.

---
## Core Database Principles

1. **UUID-First Architecture**

   * Use `uuid` primary keys for all major entities.
   * Generate identifiers using `gen_random_uuid()`.
   * Avoid exposing internal database identifiers to clients.

2. **JSON-Native Storage**

   * Use `jsonb` for flexible metadata and extensible configurations.
   * Store API contracts, feature definitions, and dynamic content in JSON fields.
   * Prefer schema evolution through metadata before introducing new tables.

3. **Model Registry Design**

   * All deployed AI models must be registered in the `models` table.
   * Every model requires a unique six-character hexadecimal identifier.
   * Deployment configuration, rate limiting, authentication requirements, and API schemas belong to the model definition.

4. **Documentation-Driven Data**

   * Store architecture diagrams, notebooks, repositories, and deployment links directly within records.
   * Every model should contain sufficient metadata to generate documentation automatically.

5. **Independent Domain Tables**

   * Tables should remain loosely coupled.
   * Avoid unnecessary foreign keys.
   * Favor service-oriented data ownership.

## Database Schema

### `models`

Central registry for all AI and Machine Learning models deployed on the platform.

#### Core Identity

* `id` — UUID primary key
* `model_name` — Display name
* `model_number` — Unique six-character hexadecimal identifier
* `model_description` — Full model description

#### Deployment Configuration

* `backend_url`
* `deployment_status`
* `deployment_platform`
* `deployment_region`
* `model_version`

#### Documentation Resources

* `notebook`
* `architecture_url`
* `github_repo`

#### Runtime Controls

* `rate_limit_per_hour`
* `rate_limit_burst`
* `requires_auth`

#### API Contracts

* `input_format`
* `output_format`

#### Flexible Metadata

* `features`
* `example_prompts`
* `extra`

#### Input Categories

Supported values:

* `text`
* `image`
* `audio`

#### Constraints

* `model_number` must match:

```regex
^[A-F0-9]{6}$
```

---

### `portfolio_projects`

Repository of portfolio, research, and analytics projects.

#### Core Fields

* `id`
* `title`
* `problem_statement`
* `analysis_summary`
* `accuracy_notes`
* `business_decisions`

#### Project Resources

* `github_url`
* `ipynb_url`
* `tabula_url`
* `flowchat_url`

#### Integrations

* `api_endpoint`

#### Additional Metadata

* `extra_links`

---

### `products`

Product showcase and recommendation catalog.

#### Core Fields

* `priority`
* `Name`
* `description`
* `website_link`

#### Ordering

Products use an auto-generated identity column:

```sql
priority bigint GENERATED ALWAYS AS IDENTITY
```

Lower values appear first.

## Schema Constraints & Rules

* **ALWAYS** use UUIDs for business entities.
* **ALWAYS** use JSONB for flexible metadata.
* **ALWAYS** store timestamps in UTC.
* **ALWAYS** define sensible defaults for deployment configuration.
* **NEVER** use hardcoded API contracts in application code when a database definition exists.
* **NEVER** duplicate model configuration across services.
* **NEVER** create tight coupling between `models`, `portfolio_projects`, and `products`.

