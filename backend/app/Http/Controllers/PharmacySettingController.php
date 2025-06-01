<?php

namespace App\Http\Controllers;

use App\Models\PharmacySetting;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PharmacySettingController extends Controller
{
    public function getCurrentStatus()
    {
        $now = Carbon::now();
        $dayOfWeek = $now->format('l'); // Returns full day name (Monday, Tuesday, etc.)
        $currentTime = $now->format('H:i:s');

        $setting = PharmacySetting::where('day_of_week', $dayOfWeek)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'No settings found for today',
                'data' => [
                    'is_open' => false,
                    'opening_hours' => 'Not configured',
                    'special_notes' => null,
                    'current_day' => $dayOfWeek
                ]
            ]);
        }

        if ($setting->is_closed) {
            return response()->json([
                'success' => true,
                'data' => [
                    'is_open' => false,
                    'opening_hours' => 'Closed today',
                    'special_notes' => $setting->special_notes,
                    'current_day' => $dayOfWeek
                ]
            ]);
        }

        $isOpen = $currentTime >= $setting->opening_time->format('H:i:s') && 
                 $currentTime <= $setting->closing_time->format('H:i:s');

        return response()->json([
            'success' => true,
            'data' => [
                'is_open' => $isOpen,
                'opening_hours' => $setting->opening_time->format('H:i') . ' - ' . $setting->closing_time->format('H:i'),
                'special_notes' => $setting->special_notes,
                'current_day' => $dayOfWeek
            ]
        ]);
    }

    public function getAllSettings()
    {
        $settings = PharmacySetting::all();
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => 'required|string',
            'opening_time' => 'required|date_format:H:i',
            'closing_time' => 'required|date_format:H:i',
            'is_closed' => 'boolean',
            'special_notes' => 'nullable|string'
        ]);

        $setting = PharmacySetting::updateOrCreate(
            ['day_of_week' => $validated['day_of_week']],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $setting
        ]);
    }
} 