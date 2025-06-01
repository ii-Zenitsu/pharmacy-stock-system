<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
    ];

    public function medicines()
    {
        return $this->hasMany(Medicine::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
