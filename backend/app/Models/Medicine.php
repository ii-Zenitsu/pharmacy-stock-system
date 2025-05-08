<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    /** @use HasFactory<\Database\Factories\MedicineFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'bar_code',
        'dosage',
        'formulation',
        'expiration_date',
        'quantity',
        'price',
        'location',
        'alert_threshold',
        'provider_id',
        'automatic_reorder',
        'reorder_quantity'
    ];

    protected $with = [
        'provider',
        'orders'
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
