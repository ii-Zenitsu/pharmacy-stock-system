<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PharmacySetting;
use Carbon\Carbon;

class PharmacySettingsSeeder extends Seeder
{
    public function run()
    {
        $days = [
            'Monday' => ['08:00', '13:00'],
            'Tuesday' => ['08:00', '13:00'],
            'Wednesday' => ['08:00', '13:00'],
            'Thursday' => ['08:00', '13:00'],
            'Friday' => ['08:00', '13:00'],
            'Saturday' => ['08:00', '13:00'],
            'Sunday' => ['00:00', '00:00', true, 'Closed on Sundays']
        ];

        foreach ($days as $day => $times) {
            PharmacySetting::create([
                'day_of_week' => $day,
                'opening_time' => $times[0],
                'closing_time' => $times[1],
                'is_closed' => $times[2] ?? false,
                'special_notes' => $times[3] ?? null
            ]);
        }
    }
} 