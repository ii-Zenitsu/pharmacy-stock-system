<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

class Location extends Model
{
    use HasFactory; // Add HasFactory

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * The medicines stored at this location, including batch details.
     */
    public function medicineBatches()
    {
        return $this->belongsToMany(Medicine::class, 'medicine_location')
            ->withPivot('id', 'quantity', 'expiration_date') // Include pivot 'id'
            ->withTimestamps()
            ->as('batch_details'); // Alias for pivot data access: $medicine->batch_details->quantity
    }

    /**
     * Get stock details (quantity, expiration) for a specific medicine at this location.
     * Returns a collection of pivot models.
     * Usage: $location->getStockDetailsForMedicine($medicineInstance)
     */
    public function getStockDetailsForMedicine(Medicine $medicine)
    {
        return $this->medicineBatches()
                    ->where('medicines.id', $medicine->id) // Filter by the specific medicine
                    ->orderBy('medicine_location.expiration_date', 'asc') // Order by expiration date
                    ->get() // Get all batches of this medicine at this location
                    ->map(function ($medicineWithPivot) { // Extract just the pivot data
                        return $medicineWithPivot->batch_details;
                    });
    }

    /**
     * Accessor for the total quantity of all medicine items stored at this location.
     * Usage: $location->total_stock_items
     */
    public function getTotalStockItemsAttribute()
    {
        if (!$this->relationLoaded('medicineBatches')) {
            $this->load('medicineBatches');
        }
        return $this->medicineBatches->sum('batch_details.quantity');
    }

    /**
     * Get all expired batches of any medicine at this location.
     * Returns a collection of Medicine models, each with its 'batch_details' pivot data for the expired batch.
     * Usage: $location->expired_stock
     */
    public function getExpiredStockAttribute()
    {
        return $this->medicineBatches()
                    ->wherePivot('expiration_date', '<', Carbon::today())
                    ->wherePivot('quantity', '>', 0)
                    ->get();
    }

    /**
     * Scope a query to only include locations that have a specific medicine in stock.
     * Usage: Location::hasMedicine($medicineId)->get();
     */
    public function scopeHasMedicine($query, $medicineId)
    {
        return $query->whereHas('medicineBatches', function ($q) use ($medicineId) {
            $q->where('medicines.id', $medicineId) // medicines.id because we are on the Medicine model in the closure
              ->where('medicine_location.quantity', '>', 0);
        });
    }

    /**
     * Scope a query to only include locations that have any expired stock.
     * Usage: Location::hasExpiredStock()->get();
     */
    public function scopeHasExpiredStock($query)
    {
        return $query->whereHas('medicineBatches', function ($q) {
            $q->where('medicine_location.expiration_date', '<', Carbon::today())
              ->where('medicine_location.quantity', '>', 0);
        });
    }
}