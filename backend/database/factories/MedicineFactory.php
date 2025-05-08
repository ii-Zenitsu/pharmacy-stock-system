<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medicine>
 */
class MedicineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'bar_code' => $this->faker->unique()->ean13(), // Generates a unique 13-digit barcode
            'dosage' => $this->faker->randomElement(['500mg', '250mg', '100mg', '5ml']),
            'formulation' => $this->faker->randomElement(['tablet', 'syrup', 'injection', 'ointment']),
            'expiration_date' => $this->faker->dateTimeBetween('+1 month', '+2 years')->format('Y-m-d'),
            'quantity' => $this->faker->numberBetween(10, 100),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'location' => $this->faker->randomElement(['A1', 'B2', 'C3', 'D4']),
            'alert_threshold' => $this->faker->numberBetween(5, 20),
            'provider_id' => Provider::inRandomOrder()->first()->id,
            'automatic_reorder' => $this->faker->boolean(),
            'reorder_quantity' => $this->faker->optional()->numberBetween(10, 100),
        ];
    }
}
