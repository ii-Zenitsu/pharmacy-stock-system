<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class ActivityLog extends Model
{
    protected $fillable = [
        'action',
        'model_type',
        'model_id',
        'user_id',
        'user_name',
        'description',
        'ip_address',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(string $action, ?string $description = null)
    {
        $user = Auth::user();
        
        return self::create([
            'action' => $action,
            'user_id' => $user?->id,
            'user_name' => $user ? "{$user->first_name} {$user->last_name}" : 'System',
            'description' => $description,
            'ip_address' => request()->ip(),
        ]);
    }
}