<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;
use Stripe\Price;
use Stripe\Product;
use Stripe\StripeClient;

class PlanSeeder extends Seeder
{
    /**
     * Plan definitions to seed.
     *
     * @var array<string, array{name: string, price: int, features: array<string, mixed>}>
     */
    protected array $plans = [
        'free' => [
            'name' => 'Free',
            'price' => 0,
            'features' => [
                'seats' => 1,
                'storage_mb' => 100,
                'social_profiles' => 1,
                'scheduled_posts' => 10,
            ],
        ],
        'pro-monthly' => [
            'name' => 'Pro Monthly',
            'price' => 1900, // $19.00 in cents
            'features' => [
                'seats' => 5,
                'storage_mb' => 10240, // 10 GB
                'social_profiles' => 10,
                'scheduled_posts' => -1, // unlimited
            ],
        ],
        'agency-monthly' => [
            'name' => 'Agency Monthly',
            'price' => 4900, // $49.00 in cents
            'features' => [
                'seats' => 25,
                'storage_mb' => 51200, // 50 GB
                'social_profiles' => -1, // unlimited
                'scheduled_posts' => -1, // unlimited
            ],
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stripeSecret = config('services.stripe.secret');

        if (! $stripeSecret) {
            $this->command->warn('STRIPE_SECRET not set. Creating plans without Stripe IDs.');
            $this->createPlansWithoutStripe();

            return;
        }

        $stripe = new StripeClient($stripeSecret);

        foreach ($this->plans as $slug => $planData) {
            $this->createOrUpdatePlan($stripe, $slug, $planData);
        }

        $this->command->info('Plans synced with Stripe successfully!');
    }

    /**
     * Create or update a plan with Stripe integration.
     *
     * @param  array{name: string, price: int, features: array<string, mixed>}  $planData
     */
    protected function createOrUpdatePlan(StripeClient $stripe, string $slug, array $planData): void
    {
        $existingPlan = Plan::where('slug', $slug)->first();

        // If plan exists with valid Stripe IDs, skip
        if ($existingPlan && $existingPlan->stripe_product_id && $existingPlan->stripe_price_id) {
            $this->command->info("Plan '{$slug}' already exists with Stripe IDs. Skipping.");

            return;
        }

        // Create or retrieve Stripe product
        $product = $this->findOrCreateProduct($stripe, $slug, $planData['name']);

        // Create Stripe price (prices are immutable, so we always create new)
        $price = null;
        if ($planData['price'] > 0) {
            $price = $stripe->prices->create([
                'product' => $product->id,
                'unit_amount' => $planData['price'],
                'currency' => 'usd',
                'recurring' => ['interval' => 'month'],
                'metadata' => ['slug' => $slug],
            ]);
        }

        // Create or update local plan record
        Plan::updateOrCreate(
            ['slug' => $slug],
            [
                'name' => $planData['name'],
                'stripe_product_id' => $product->id,
                'stripe_price_id' => $price?->id,
                'price' => $planData['price'],
                'features' => $planData['features'],
                'is_active' => true,
            ]
        );

        $this->command->info("Created/updated plan: {$planData['name']}");
    }

    /**
     * Find or create a Stripe product.
     */
    protected function findOrCreateProduct(StripeClient $stripe, string $slug, string $name): Product
    {
        // Search for existing product by metadata
        $products = $stripe->products->search([
            'query' => "metadata['slug']:'{$slug}'",
        ]);

        if ($products->data && count($products->data) > 0) {
            return $products->data[0];
        }

        // Create new product
        return $stripe->products->create([
            'name' => $name,
            'metadata' => ['slug' => $slug],
        ]);
    }

    /**
     * Create plans without Stripe integration (for development/testing).
     */
    protected function createPlansWithoutStripe(): void
    {
        foreach ($this->plans as $slug => $planData) {
            Plan::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $planData['name'],
                    'stripe_product_id' => null,
                    'stripe_price_id' => null,
                    'price' => $planData['price'],
                    'features' => $planData['features'],
                    'is_active' => true,
                ]
            );

            $this->command->info("Created plan (without Stripe): {$planData['name']}");
        }
    }
}
