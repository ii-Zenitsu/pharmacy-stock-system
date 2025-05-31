<?php

namespace Database\Seeders;

use App\Models\Stock;
use App\Models\Medicine;
use App\Models\Location;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicines = Medicine::all();
        $locations = Location::all();

        $stockData = [];

        foreach ($medicines as $medicine) {
            $assignedLocations = $locations->random(rand(1, min(3, $locations->count())));
            
            foreach ($assignedLocations as $location) {
                $batchCount = rand(1, 2);
                
                for ($i = 0; $i < $batchCount; $i++) {
                    $stockData[] = [
                        'medicine_id' => $medicine->id,
                        'location_id' => $location->id,
                        'quantity' => rand(10, 50),
                        'expiration_date' => Carbon::now()->addDays(rand(30, 1095))->format('Y-m-d'), // Random expiry 30 days to 3 years from now
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        $chunks = array_chunk($stockData, 100);
        foreach ($chunks as $chunk) {
            Stock::insert($chunk);
        }
    }
}