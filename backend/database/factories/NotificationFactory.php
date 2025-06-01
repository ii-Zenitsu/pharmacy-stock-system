<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [ 'Expired', 'Low Stock', 'Order'];

        return [
            'title' => $this->faker->randomElement($titles),
            'medicine' => $this->faker->word(),
            'location' => $this->faker->word(),
            'action' => $this->faker->unique()->numberBetween(1, 30),
        ];
    }
}
