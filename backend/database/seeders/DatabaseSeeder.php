<?php

namespace Database\Seeders;

use App\Models\Provider;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\LocationSeeder; // Added
use Database\Seeders\MedicineLocationSeeder; // Added
use Database\Seeders\PharmacySettingsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProviderSeeder::class,
            UserSeeder::class,
            MedicineSeeder::class,
<<<<<<< HEAD
            LocationSeeder::class, // Added
            MedicineLocationSeeder::class, // Added
            PharmacySettingsSeeder::class,
=======
            LocationSeeder::class,
            StockSeeder::class,
            NotificationSeeder::class,
>>>>>>> 87df2349673e19937f41dafe1a3341f6554cea07
        ]);
    }
}
