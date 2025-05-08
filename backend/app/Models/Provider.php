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
    protected $with = [
        'medicines'
    ];

    public function medicines()
    {
        return $this->hasMany(Medicine::class);
    }
}
