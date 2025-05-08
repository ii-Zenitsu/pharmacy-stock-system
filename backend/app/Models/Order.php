<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'medicine_id',
        'quantity',
    ];
    protected $with = [
        'medicine'
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
