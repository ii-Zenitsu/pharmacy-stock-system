<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $table = 'medicine_location';

    protected $fillable = [
        'medicine_id',
        'location_id',
        'quantity',
        'expiration_date',
    ];

    protected $casts = [
        'expiration_date' => 'date:Y-m-d',
    ];

    protected $with = ['location'];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function scopeExpired($query)
    {
        return $query->where('expiration_date', '<', now())->where('quantity', '>', 0);
    }
}
