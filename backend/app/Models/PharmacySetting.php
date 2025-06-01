<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PharmacySetting extends Model
{
    protected $fillable = [
        'day_of_week',
        'opening_time',
        'closing_time',
        'is_closed',
        'special_notes'
    ];

    protected $casts = [
        'opening_time' => 'datetime',
        'closing_time' => 'datetime',
        'is_closed' => 'boolean'
    ];
} 