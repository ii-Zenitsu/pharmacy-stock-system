<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Stock;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Mockery\Matcher\Not;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stocks = Stock::with(['medicine', 'location'])->get();
        return response()->json($stocks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'location_id' => 'required|exists:locations,id',
            'quantity' => 'required|integer|min:0',
            'expiration_date' => 'required|date',
        ]);

        $stock = Stock::firstOrNew(
            [
                'medicine_id' => $validated['medicine_id'],
                'location_id' => $validated['location_id'],
                'expiration_date' => $validated['expiration_date'],
            ]
        );
        $wasRecentlyCreated = !$stock->exists;
        
        $stock->quantity = ($stock->exists ? $stock->quantity : 0) + $validated['quantity'];
        $stock->quantity = max($stock->quantity, 0);
        $stock->save();

        $actionType = $wasRecentlyCreated ? 'stock_created' : 'stock_updated';
        $description = $wasRecentlyCreated 
            ? "Created new stock entry: {$validated['quantity']} units of {$stock->medicine->name} at {$stock->location->name} (expires: {$stock->expiration_date})"
            : "Added {$validated['quantity']} units to existing stock of {$stock->medicine->name} at {$stock->location->name} (total: {$stock->quantity})";
        
        ActivityLog::log($actionType, $description);

        return response()->json($stock->load(['medicine', 'location']), $wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $stock = Stock::with(['medicine', 'location'])->findOrFail($id);
        return response()->json($stock);
    }

    /**
     * Update the specified resource in storage.
     * This is typically used to adjust quantity or change expiration date of a specific batch.
     */
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $oldQuantity = $stock->quantity;

        $validated = $request->validate([
            'medicine_id' => 'sometimes|required|exists:medicines,id',
            'location_id' => 'sometimes|required|exists:locations,id',
            'quantity' => 'sometimes|required|integer|min:0',
            'expiration_date' => 'sometimes|required|date',
        ]);

        $stock->update($validated);
        
        $changes = [];
        if (isset($validated['quantity']) && $oldQuantity !== $validated['quantity']) {
            $changes[] = "quantity changed from {$oldQuantity} to {$validated['quantity']}";
        }
        if (isset($validated['expiration_date']) && $stock->expiration_date !== $validated['expiration_date']) {
            $changes[] = "expiration date updated";
        }
        
        $changeDescription = !empty($changes) ? " (" . implode(", ", $changes) . ")" : "";
        ActivityLog::log('stock_updated', "Updated stock entry for {$stock->medicine->name} at {$stock->location->name}{$changeDescription} (ID: {$stock->id})");
        
        return response()->json($stock->load(['medicine', 'location']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) 
    {
        $stock = Stock::findOrFail($id);
        $medicineName = $stock->medicine->name;
        $locationName = $stock->location->name;
        $quantity = $stock->quantity;
        
        $stock->delete();
        
        ActivityLog::log('stock_deleted', "Deleted stock entry: {$quantity} units of {$medicineName} at {$locationName} (ID: {$id})");
        
        return response()->json(['message' => 'Stock entry deleted successfully.']);
    }

    /**
     * Adjust the quantity of multiple stock entries in a batch.
     */
    public function adjustBatchesQuantity(Request $request)
    {
        $validated = $request->validate([
            '*.id' => 'required|exists:medicine_location,id',
            '*.quantity' => 'required|integer|min:1',
        ]);
        $updatedItems = [];
        $logDescriptions = [];
        $totalPrice = 0;
        
        foreach ($validated as $item) {
            $stock = Stock::findOrFail($item['id']);
            if ($item['quantity'] > $stock->quantity) {
                return response()->json(['error' => 'Insufficient stock quantity for item ID ' . $item['id']], 400);
            }
            
            $itemPrice = $stock->medicine->price * $item['quantity'];
            $totalPrice += $itemPrice;
            
            $stock->quantity -= $item['quantity'];
            $stock->save();
            $stock->load(['medicine', 'location']);

            $this->handleLowStockActions($stock);

            $updatedItems[] = $stock;
            $logDescriptions[] = $item['quantity'] . " units of " . $stock->medicine->name . " from " . $stock->location->name . " (MAD " . $stock->medicine->price . " each, subtotal: MAD " . $itemPrice . ", remaining: " . $stock->quantity . ")";
        }
        
        // Log the checkout activity with total price
        $description = "Checkout processed: " . implode(", ", $logDescriptions) . " | Total Sale: MAD " . number_format($totalPrice, 2);
        ActivityLog::log('sale', $description); 
        
        return response()->json([
            'message' => count($updatedItems) . ' stock items updated successfully.',
            'data' => $updatedItems,
            'total_price' => $totalPrice
        ]);
    }

    private function handleLowStockActions($stock): void
    {
        if (!$stock->medicine->is_low_stock) { return;}

        $reordered = $stock->medicine->needs_reorder && $stock->medicine->reorder();
        $title = $reordered ? 'Auto Order' : 'Low Stock';
        $this->notify($title, $stock->medicine->name, $stock->location->name, $stock->medicine->id);
    }

    private function notify(string $title, string $medicine, string $location, int $actionId): void
    {
        $exist = Notification::where('action', $actionId)
            ->where('title', $title)
            ->first();
        
        if (!$exist) {
            Notification::create([
                'title' => $title,
                'medicine' => $medicine,
                'location' => $location,
                'action' => $actionId,
            ]);
        }
    }
}
