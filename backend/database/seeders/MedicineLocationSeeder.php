<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Medicine;
use App\Models\Location;
use Illuminate\Support\Facades\DB;

class MedicineLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicines = Medicine::all();
        $locations = Location::all();

        if ($medicines->isEmpty() || $locations->isEmpty()) {
            $this->command->info('No medicines or locations to seed for medicine_location table.');
            return;
        }

        foreach ($medicines as $medicine) {
            $locationsToAssign = $locations->random(rand(1, min(3, $locations->count())));
            foreach ($locationsToAssign as $location) {
                DB::table('medicine_location')->insert([
                    'medicine_id' => $medicine->id,
                    'location_id' => $location->id,
                    'quantity' => fake()->numberBetween(10, 100),
                    'expiration_date' => fake()->dateTimeBetween('+1 month', '+2 years')->format('Y-m-d'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
