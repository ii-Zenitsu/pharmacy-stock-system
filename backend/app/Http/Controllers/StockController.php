<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

        $validated = $request->validate([
            'quantity' => 'sometimes|required|integer|min:0',
            'expiration_date' => 'sometimes|required|date',
            // 'reason' => 'nullable|string|max:255' 
        ]);

        $stock->update($validated);
        return response()->json($stock->load(['medicine', 'location']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) 
    {
        $stock = Stock::findOrFail($id);
        $stock->delete();
        return response()->json(['message' => 'Stock entry deleted successfully.']);
    }

    /**
     * Adjust the quantity of a specific stock batch.
     * This is a custom action, more specific than a generic update.
     */
    public function adjustBatchQuantity(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
            // 'reason' => 'nullable|string|max:255',
        ]);
        // Log::info("Stock adjustment for batch {$id}: Old quantity {$stock->quantity}, New quantity {$validated['quantity']}, Reason: {$validated['reason']}");

        $stock->quantity = $validated['quantity'];
        $stock->save();

        return response()->json($stock->load(['medicine', 'location']));
    }
}
