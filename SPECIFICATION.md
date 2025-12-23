# 🏗️ SMM Visual Planner SaaS - Master Specification

## 1. Project Context
We are building a scalable, multi-tenant Social Media Management (SMM) SaaS.
**Core Value:** A "Visual Planner" that allows teams to manage a centralized Asset Library and visually arrange Instagram/TikTok feeds.
**Architecture:** Team-First Multi-Tenancy. All resources belong to a **Team**, not a User.
**Security Priority:** Prevention of IDOR, Toxic Logs, and Race Conditions.

## 2. Tech Stack (Strict Constraints)
* **Backend:** Laravel 12 (PHP 8.3+).
* **Frontend:** Vue 3 (Composition API, `<script setup>`, TypeScript).
* **Glue:** Inertia.js + Ziggy for routing.
* **Authentication:** Laravel Fortify + Socialite (Google, FB, TikTok, Apple).
* **Styling:** Tailwind CSS (v3.4+).
* **UI Components:** **Shadcn-Vue** (Shadcn + Tailwind).
* **Database:** MySQL 8.0.
* **Billing:** Laravel Cashier (Stripe).

---

## 3. Database Schema (Scalable & Secure)
**Global Rule:** All Primary Keys must use **ULID** (`$table->ulid('id')`).

### A. `users` (Global Identity)
* `id` (ULID, PK).
* `name`, `email`.
* `password` (string, nullable).
* `avatar_url` (string, nullable).
* `current_team_id` (ULID, nullable).
* `timezone` (string, default 'UTC').
* `dark_mode` (boolean, default false).

### B. `linked_social_accounts` (Login Methods)
* `id` (ULID, PK).
* `user_id` (FK -> users).
* `provider`, `provider_id`.
* `name`, `email`, `avatar_url`.
* `token` (text, encrypted).

### C. `plans` (Feature Definitions)
* **Purpose:** Maps Stripe Prices to internal Feature Limits.
* `id` (ULID, PK).
* `name` (string). *e.g., "Pro Monthly".*
* `slug` (string, unique). *e.g., "pro-monthly".*
* `stripe_product_id` (string). *Generated via API.*
* `stripe_price_id` (string, unique). *Generated via API.*
* `price` (integer). *Display price in cents.*
* `features` (json). *e.g., `{"seats": 5, "storage_mb": 10240}`.*
* `is_active` (boolean, default true).

### D. `teams` (The Tenant & Payer)
* `id` (ULID, PK).
* `owner_id` (FK -> users).
* `name`, `slug` (unique, index).
* `personal_team` (boolean). 
    * *TRUE = "Solo Workspace" created on signup. Cannot be deleted. Cannot invite members (unless upgraded).*
    * *FALSE = "Organization". Created manually. Can invite members. Can be deleted.*
* `storage_used_kb` (bigInteger, default 0).
* **Billing Fields:** `stripe_id`, `pm_type`, `pm_last_four`, `trial_ends_at`.

### E. `subscriptions` (Billing State)
* `id` (ULID, PK).
* `team_id` (FK -> teams).
* `plan_id` (FK -> plans). *The link to limits.*
* `name`, `stripe_id`, `stripe_status`.
* `stripe_price`, `quantity`, `ends_at`.

### F. `invoices` (Local Billing Cache)
* `id` (ULID, PK).
* `team_id` (FK -> teams).
* `plan_id` (FK -> plans, nullable).
* `stripe_id`, `amount_paid`, `currency`, `status`.
* `hosted_invoice_url`, `period_start`, `period_end`.

### G. `team_user` (Membership)
* `id` (ULID, PK).
* `team_id` (FK), `user_id` (FK).
* `role` (enum: 'admin', 'editor', 'viewer').

### H. `social_profiles` (Publishing Targets)
* `id` (ULID, PK), `team_id` (FK).
* `platform` (enum: 'instagram', 'facebook', 'tiktok', 'linkedin').
* `provider_id` (string, indexed).
* `name`, `handle`, `avatar_url`.
* `access_token` (text, encrypted).
* `refresh_token` (text, nullable, encrypted).
* `token_expires_at` (timestamp, nullable).
* `is_connected` (boolean).

### I. `media` (Asset Library)
* `id` (ULID, PK), `team_id` (FK).
* `file_path`, `file_type`, `mime_type`.
* `width`, `height`, `size_kb`.

### J. `posts` (Content Container)
* `id` (ULID, PK), `team_id` (FK).
* `created_by` (FK -> users).
* `caption`, `post_type`.
* `scheduled_at` (index), `status`.
* `deleted_at`.

### K. `post_media` (Pivot)
* `post_id`, `media_id`, `order`.

### L. `post_targets` (Publishing Jobs)
* **Security Critical:** Includes `team_id` to prevent IDOR via Global Scope.
* `id` (ULID, PK).
* `team_id` (FK -> teams).
* `post_id` (FK -> posts).
* `social_profile_id` (FK -> social_profiles).
* `status` (enum: 'pending', 'processing', 'published', 'failed', 'retrying').
* `attempt_count` (integer, default 0).
* `next_attempt_at` (timestamp, nullable).
* `response_log` (text, nullable). *MUST be sanitized.*
* `published_at` (timestamp, nullable).
* `platform_post_id` (string, nullable).

### M. `activity_logs` (Audit Trail)
* `id`, `team_id`, `user_id`, `event`.
* `subject_type`, `subject_id`, `properties`.

---

## 4. Key Views & Logic

### A. Authentication
* Login via Password or Socialite.
* **On Signup:** Create User + Create `personal_team` (Name: "John's Team", Personal: True).

### B. Global Layout (`AuthenticatedLayout.vue`)
* **Team Switcher UI:** Must visually separate the "Personal Team" from "Organizations".
* **Logic:** When switching to a Personal Team, hide "Members" settings if the plan restricts it.

### C. Billing & Plans (Automated Sync)
* **Strategy:** "Programmatic Sync." The App is the Master.
* **Logic:** `PlanSeeder` and `PlanController` call Stripe API (`$stripe->prices->create`) and save IDs to DB.
* **Constraint:** Do NOT manually create products in the Stripe Dashboard.

### D. The Composer Page
* 3-Column Grid: Input | Preview | Visual Planner.
* Visual Planner fetches `post_targets` + draft.

---

## 5. Execution Plan for AI Agent

**Phase 1: Foundations (Backend)**
1.  Generate Migrations for all 13 tables.
2.  **Constraint:** Ensure `Subscription` and `Invoice` models belong to a `Plan`.
3.  **Security Constraint:** Implement IDOR protection (GlobalScope) in `PostTarget`.
4.  **Seeder:** Create `PlanSeeder` that uses `StripeClient` to create the default Plans on Stripe dynamically during seeding.

**Phase 2: Billing & Auth**
1.  Install Socialite & Cashier.
2.  Implement `SocialAccountService`.
3.  Implement `PlanController` (Admin) logic for creating future plans via API.

**Phase 3: Core Features**
1.  Build Media Library.
2.  Build Composer Page.