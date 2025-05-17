<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicine extends Model
{
    /** @use HasFactory<\Database\Factories\MedicineFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'bar_code',
        'dosage',
        'formulation',
        'price',
        'alert_threshold',
        'provider_id',
        'automatic_reorder',
        'reorder_quantity'
    ];
    protected $casts = [
        'automatic_reorder' => 'boolean',
        'alert_threshold' => 'integer',
        'reorder_quantity' => 'integer',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function locations()
    {
        return $this->belongsToMany(Location::class, 'medicine_location')
                    ->withPivot('quantity', 'expiration_date')
                    ->withTimestamps();
    }


    // You might want a method to get total expiration dates across all locations
    public function getTotalExpirationDatesAttribute()
    {
        return $this->locations->pluck('pivot.expiration_date');
    }

    public function inventoryEntries()
    {
        return $this->belongsToMany(Location::class, 'medicine_location')
                    ->withPivot('id', 'quantity', 'expiration_date') // Include pivot 'id' if you need to update/delete specific pivot rows
                    ->withTimestamps()
                    ->as('batch_details'); // Alias for pivot data access: $location->batch_details->quantity
    }

    /**
     * Accessor for the total quantity of this medicine across all locations and batches.
     * Usage: $medicine->total_quantity
     */
    public function getTotalQuantityAttribute()
    {
        // Ensure locations relationship is loaded to avoid N+1 if called in a loop
        // If not already loaded, this will trigger a query.
        if (!$this->relationLoaded('inventoryEntries')) {
            $this->load('inventoryEntries');
        }
        return $this->inventoryEntries->sum('batch_details.quantity');
    }

    /**
     * Accessor for the earliest expiration date of this medicine across all batches.
     * Usage: $medicine->earliest_expiration_date
     */
    public function getEarliestExpirationDateAttribute()
    {
        if (!$this->relationLoaded('inventoryEntries')) {
            $this->load('inventoryEntries');
        }
        return $this->inventoryEntries
            ->where('batch_details.quantity', '>', 0) // Only consider batches with stock
            ->min('batch_details.expiration_date');
    }

    /**
     * Get all distinct expiration dates for this medicine's batches.
     * Usage: $medicine->distinct_expiration_dates
     */
    public function getDistinctExpirationDatesAttribute()
    {
        if (!$this->relationLoaded('inventoryEntries')) {
            $this->load('inventoryEntries');
        }
        return $this->inventoryEntries
            ->where('batch_details.quantity', '>', 0)
            ->pluck('batch_details.expiration_date')
            ->unique()
            ->sort()
            ->values();
    }

    /**
     * Check if the medicine's total stock is below its alert threshold.
     * Usage: $medicine->is_low_stock
     */
    public function getIsLowStockAttribute()
    {
        return $this->total_quantity < $this->alert_threshold;
    }

    /**
     * Check if the medicine needs reordering based on stock levels and automatic reorder flag.
     * Usage: $medicine->needs_reorder
     */
    public function getNeedsReorderAttribute()
    {
        return $this->is_low_stock && $this->automatic_reorder;
    }

    /**
     * Scope a query to only include medicines that have at least one expired batch.
     * Usage: Medicine::expired()->get();
     */
    public function scopeExpired($query)
    {
        return $query->whereHas('inventoryEntries', function ($q) {
            $q->where('medicine_location.expiration_date', '<', Carbon::today())
              ->where('medicine_location.quantity', '>', 0);
        });
    }

    /**
     * Scope a query to only include medicines with batches expiring soon.
     * Usage: Medicine::expiringSoon(30)->get(); // Expiring in next 30 days
     */
    public function scopeExpiringSoon($query, $days = 30)
    {
        $targetDate = Carbon::today()->addDays($days);
        return $query->whereHas('inventoryEntries', function ($q) use ($targetDate) {
            $q->where('medicine_location.expiration_date', '>=', Carbon::today())
              ->where('medicine_location.expiration_date', '<=', $targetDate)
              ->where('medicine_location.quantity', '>', 0);
        });
    }

    /**
     * Scope a query to only include medicines whose total stock is below their alert threshold.
     * Usage: Medicine::belowAlertThreshold()->get();
     */
    public function scopeBelowAlertThreshold($query)
    {
        // This is more complex with aggregation, might be better done with raw DB expressions
        // or by iterating after fetching if performance allows.
        // For a simpler check, you can filter after fetching using the accessor.
        // A direct DB query would be more performant for large datasets.
        return $query->whereRaw(
            '(SELECT SUM(ml.quantity) FROM medicine_location ml WHERE ml.medicine_id = medicines.id) < medicines.alert_threshold'
        );
    }

    /**
     * Add a new batch or update quantity of an existing batch for this medicine at a specific location.
     *
     * @param Location $location
     * @param int $quantity
     * @param string $expirationDate (YYYY-MM-DD)
     * @return \Illuminate\Database\Eloquent\Model|null The pivot model instance.
     */
    public function addOrUpdateBatch(Location $location, int $quantity, string $expirationDate)
    {
        $pivot = $this->inventoryEntries()
                      ->wherePivot('location_id', $location->id)
                      ->wherePivot('expiration_date', $expirationDate)
                      ->first();

        if ($pivot) {
            // Existing batch found, update quantity
            $newQuantity = $pivot->batch_details->quantity + $quantity;
            $this->inventoryEntries()->updateExistingPivot($location->id, [
                'quantity' => $newQuantity,
                'expiration_date' => $expirationDate // Ensure expiration date is also passed for update
            ]);
            // Re-fetch to get the updated pivot attributes correctly
            return $this->inventoryEntries()
                        ->wherePivot('location_id', $location->id)
                        ->wherePivot('expiration_date', $expirationDate)
                        ->first()->batch_details; // Access the pivot model
        } else {
            // New batch, attach it
            $this->inventoryEntries()->attach($location->id, [
                'quantity' => $quantity,
                'expiration_date' => $expirationDate
            ]);
            return $this->inventoryEntries()
                        ->wherePivot('location_id', $location->id)
                        ->wherePivot('expiration_date', $expirationDate)
                        ->first()->batch_details; // Access the pivot model
        }
    }

     /**
     * Reduce stock from a specific batch of this medicine at a given location.
     * Implements FEFO (First-Expired, First-Out) if no specific expiration date is given for removal.
     *
     * @param Location $location
     * @param int $quantityToRemove
     * @param string|null $specificExpirationDate (YYYY-MM-DD) to target a specific batch
     * @return bool True on success, false on failure (e.g., insufficient stock)
     */
    public function reduceStock(Location $location, int $quantityToRemove, ?string $specificExpirationDate = null): bool
    {
        if ($quantityToRemove <= 0) return true; // Nothing to remove

        $query = $this->inventoryEntries()
            ->where('location_id', $location->id) // Eloquent automatically filters by medicine_id
            ->wherePivot('quantity', '>', 0);

        if ($specificExpirationDate) {
            $query->wherePivot('expiration_date', $specificExpirationDate);
        } else {
            // FEFO: Order by earliest expiration date first
            $query->orderBy('medicine_location.expiration_date', 'asc');
        }

        $batches = $query->get();

        if ($specificExpirationDate && $batches->isEmpty()) {
            // Specific batch not found or has no stock
            return false;
        }

        $totalRemoved = 0;
        foreach ($batches as $batchLocation) { // $batchLocation is a Location model with pivot data
            $batchPivot = $batchLocation->batch_details; // Access the pivot model
            $canRemoveFromThisBatch = min($quantityToRemove - $totalRemoved, $batchPivot->quantity);

            if ($canRemoveFromThisBatch > 0) {
                $newQuantity = $batchPivot->quantity - $canRemoveFromThisBatch;
                $this->inventoryEntries()->updateExistingPivot($location->id, [
                    'quantity' => $newQuantity,
                    'expiration_date' => $batchPivot->expiration_date // Important: specify which pivot record to update
                ], false); // false for not touching timestamps if you manage them manually or they are auto

                $totalRemoved += $canRemoveFromThisBatch;
            }

            if ($totalRemoved >= $quantityToRemove) {
                break;
            }
        }
        return $totalRemoved >= $quantityToRemove;
    }
}
