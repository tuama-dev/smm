# 🏗️ SMM Visual Planner SaaS - Master Specification

## 1. Project Context

We are building a scalable, multi-tenant Social Media Management (SMM) SaaS.
**Core Value:** A "Visual Planner" that allows teams to manage a centralized Asset Library and visually arrange Instagram/TikTok feeds.
**Architecture:** Team-First Multi-Tenancy. All resources belong to a **Team**, not a User.

## 2. Tech Stack (Strict Constraints)

-   **Backend:** Laravel 12 (PHP 8.2+).
-   **Frontend:** Vue 3 (Composition API, `<script setup>`, TypeScript).
-   **Glue:** Inertia.js.
-   **Authentication:** Laravel Breeze + **Laravel Socialite** (Google, Facebook, TikTok).
-   **Styling:** Tailwind CSS (v3.4+).
-   **UI Components:** **Shadcn-Vue** (Radix + Tailwind).
-   **Database:** MySQL 8.0.
-   **Billing:** Laravel Cashier (Stripe).

---

## 3. Database Schema (Scalable & Team-Based)

**Global Rule:** All Primary Keys must use **ULID** (`$table->ulid('id')`).

### A. `users` (Global Identity)

-   `id` (ULID, PK).
-   `name`, `email`.
-   `password` (string, **nullable**). _Nullable because Social Login users won't have one initially._
-   `avatar_url` (string, nullable). _Synced from Google/Social provider._
-   `current_team_id` (ULID, nullable).
-   `timezone` (string, default 'UTC').
-   `dark_mode` (boolean, default false).

### B. `linked_social_accounts` (Login Methods)

-   **Purpose:** Handles "Sign up with Google/Facebook". Separate from the profiles we publish to.
-   `id` (ULID, PK).
-   `user_id` (FK -> users).
-   `provider` (string). _'google', 'facebook', 'tiktok'._
-   `provider_id` (string, index). _The Google User ID._
-   `name`, `email`, `avatar_url`. _Cached details._
-   `token` (text, encrypted). _OAuth token (if needed for profile data refresh)._
-   _Unique constraint on [provider, provider_id]._

### C. `teams` (The Tenant & Payer)

-   `id` (ULID, PK).
-   `owner_id` (FK -> users).
-   `name`, `slug` (unique, index).
-   `personal_team` (boolean).
-   `storage_used_kb` (bigInteger, default 0).
-   **Billing Fields (Cashier):**
    -   `stripe_id`, `pm_type`, `pm_last_four`.
    -   `trial_ends_at` (timestamp, nullable).

### D. `subscriptions` (Billing State)

-   `id` (ULID, PK).
-   `team_id` (FK -> teams).
-   `name`, `stripe_id`, `stripe_status`.
-   `stripe_price`, `quantity`.
-   `ends_at` (timestamp, nullable).

### E. `invoices` (Local Billing Cache)

-   `id` (ULID, PK).
-   `team_id` (FK -> teams).
-   `stripe_id`, `amount_paid`, `currency`, `status`.
-   `hosted_invoice_url`, `period_start`, `period_end`.

### F. `team_user` (Membership)

-   `id` (ULID, PK).
-   `team_id` (FK), `user_id` (FK).
-   `role` (enum: 'admin', 'editor', 'viewer').

### G. `social_profiles` (Publishing Targets)

-   **Purpose:** The accounts we _post to_. (e.g., A Business Page).
-   `id` (ULID, PK), `team_id` (FK).
-   `platform` (enum: 'instagram', 'facebook', 'tiktok', 'linkedin').
-   `provider_id` (string, indexed).
-   `name`, `handle`, `avatar_url`.
-   `access_token` (text, encrypted).
-   `refresh_token` (text, nullable, encrypted).
-   `token_expires_at` (timestamp, nullable).
-   `is_connected` (boolean, default true).

### H. `media` (Asset Library)

-   `id` (ULID, PK), `team_id` (FK).
-   `file_path`, `file_type`, `mime_type`.
-   `width`, `height`, `size_kb`.

### I. `posts` (Content Container)

-   `id` (ULID, PK), `team_id` (FK).
-   `created_by` (FK -> users).
-   `caption`, `post_type`.
-   `scheduled_at` (index), `status`.
-   `deleted_at`.

### J. `post_media` (Pivot)

-   `post_id`, `media_id`, `order`.

### K. `post_targets` (Publishing Jobs)

-   `id` (ULID, PK).
-   `post_id`, `social_profile_id`.
-   `status`, `attempt_count`, `next_attempt_at`.
-   `response_log`, `published_at`, `platform_post_id`.

### L. `activity_logs` (Audit Trail)

-   `id`, `team_id`, `user_id`, `event`.
-   `subject_type`, `subject_id`, `properties`.

---

## 4. Key Views & Logic

### A. Authentication Pages

-   **Login/Register:** Must include "Continue with Google", "Continue with Facebook", etc.
-   **Logic:**
    1.  If email exists -> Ask to link account & Login.
    2.  If email new -> Create User, Create Personal Team, Login.

### B. Global Layout (`AuthenticatedLayout.vue`)

-   **Design:** "Linear-style" (Clean, high whitespace).
-   **Sidebar:** Collapsible + Team Switcher.
-   **Navigation:** Dashboard, Media, Calendar, Create, Accounts, Settings, Billing.

### C. The Composer Page (`/posts/create`)

-   **3-Column Grid:** Input (Left), Preview (Center), Visual Planner (Right).
-   **Visual Planner:** Fetches `post_targets` + draft to visualize grid.

---

## 5. Execution Plan for AI Agent

**Phase 1: Foundations & Auth**

1.  Generate Migrations for all 12 tables.
2.  Install **Laravel Socialite**.
3.  Update `AuthController` to handle OAuth callbacks (Google/FB/TikTok).
4.  Implement `SocialAccountService` to handle "Find or Create User" logic.

**Phase 2: Billing & Multi-Tenancy**

1.  Install Cashier & setup Webhooks.
2.  Implement Team Scopes.

**Phase 3: Core Features**

1.  Build Media Library.
2.  Build Composer.
