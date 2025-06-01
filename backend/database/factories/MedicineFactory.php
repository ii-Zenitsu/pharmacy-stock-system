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
        $dosages = [ '500-mg', '250-mg', '100-mg', '5-ml', '10-mg', '20-mg', '50-mg', '1-g'];
        return [
            'name' => $this->faker->word(),
            'bar_code' => $this->faker->unique()->ean13(), // Generates a unique 13-digit barcode
            'dosage' => $this->faker->randomElement($dosages),
            'formulation' => $this->faker->randomElement(['tablet', 'syrup', 'injection', 'ointment']),
            'price' => $this->faker->randomFloat(2, 10, 150),
            'alert_threshold' => $this->faker->numberBetween(5, 20),
            'provider_id' => Provider::inRandomOrder()->first()->id,
            'automatic_reorder' => $this->faker->boolean(),
            'reorder_quantity' => $this->faker->numberBetween(10, 100),
        ];
    }
}
