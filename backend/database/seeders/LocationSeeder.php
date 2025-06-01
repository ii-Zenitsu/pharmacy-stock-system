<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            // Shelves
            ['name' => 'Shelf A1 - Fast Movers', 'description' => 'Top shelf, Section A, for frequently dispensed items.'],
            ['name' => 'Shelf A2 - Pain Relief', 'description' => 'Second shelf, Section A, for analgesics.'],
            ['name' => 'Shelf A3 - Vitamins & Supplements', 'description' => 'Third shelf, Section A, for vitamins.'],
            ['name' => 'Shelf A4 - Digestive Health', 'description' => 'Bottom shelf, Section A, for digestive health products.'],
            ['name' => 'Shelf B1 - Prescription Only', 'description' => 'Top shelf, Section B, for prescription medications.'],
            ['name' => 'Shelf B2 - Antibiotics', 'description' => 'Second shelf, Section B, for antibiotics.'],
            ['name' => 'Shelf B3 - Children\'s Medicine', 'description' => 'Third shelf, Section B, for pediatric medications.'],
            ['name' => 'Shelf B4 - Adult Pain Relief', 'description' => 'Bottom shelf, Section B, for adult pain relief medications.'],
            ['name' => 'Shelf C1 - OTC Cold & Flu', 'description' => 'Top shelf, Section C, for over-the-counter cold and flu remedies.'],
            ['name' => 'Shelf C2 - First Aid', 'description' => 'Second shelf, Section C, for first aid supplies.'],
            ['name' => 'Shelf C3 - Skin Care', 'description' => 'Third shelf, Section C, for dermatological products.'],
            ['name' => 'Shelf C4 - Eye Care', 'description' => 'Bottom shelf, Section C, for eye care products.'],
            ['name' => 'Shelf D1 - Miscellaneous', 'description' => 'Top shelf, Section D, for miscellaneous items.'],
            ['name' => 'Shelf D2 - Seasonal Products', 'description' => 'Second shelf, Section D, for seasonal items.'],
            ['name' => 'Shelf D3 - Clearance Items', 'description' => 'Third shelf, Section D, for clearance items.'],
            ['name' => 'Shelf D4 - Returns', 'description' => 'Bottom shelf, Section D, for items to be returned.'],
            ['name' => 'Shelf E1 - Baby Care', 'description' => 'Top shelf, Section E, for baby care products.'],
            ['name' => 'Shelf E2 - Feminine Hygiene', 'description' => 'Second shelf, Section E, for feminine hygiene products.'],
            ['name' => 'Shelf E3 - Dental Care', 'description' => 'Third shelf, Section E, for dental care products.'],
            ['name' => 'Shelf E4 - Foot Care', 'description' => 'Bottom shelf, Section E, for foot care products.'],
            // Fridges
            ['name' => 'Fridge 1 - Vaccines', 'description' => 'Main refrigerator for vaccine storage (2-8°C).'],
            ['name' => 'Fridge 1 - Shelf 1 (Vaccines)', 'description' => 'Top shelf in Fridge 1, dedicated to vaccines.'],
            ['name' => 'Fridge 1 - Shelf 2 (Insulin)', 'description' => 'Middle shelf in Fridge 1, for insulin products.'],
            ['name' => 'Fridge 2 - General Cold Storage', 'description' => 'Secondary refrigerator for other refrigerated items.'],
            ['name' => 'Fridge 2 - Shelf 1 (Probiotics)', 'description' => 'Top shelf in Fridge 2, for probiotics.'],

            // Other
            ['name' => 'Controlled Drugs Cabinet', 'description' => 'Secure cabinet for controlled substances.'],
            ['name' => 'Receiving Area - Temporary', 'description' => 'Temporary holding for new stock deliveries.'],
            ['name' => 'Returns Bin', 'description' => 'Bin for medications to be returned or disposed of.'],
        ];

        foreach ($locations as $locationData) {
            Location::create([
                'name' => $locationData['name'],
                'description' => $locationData['description'],
            ]);
        }
    }
}