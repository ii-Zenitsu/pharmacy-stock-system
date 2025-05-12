<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\MedicineResource;
use App\Models\Medicine;

class MedicineController extends Controller
{
    public function index()
    {
        $medicines = Medicine::all();
        return MedicineResource::collection($medicines);
        
    }


    public function show($id)
    {
        $medicine = Medicine::findOrFail($id);
        return new MedicineResource($medicine);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'bar_code' => 'required|string|max:255|unique:medicines',
            'dosage' => 'nullable|string',
            'formulation' => 'nullable|string',
            'expiration_date' => 'required|date',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'location' => 'nullable|string',
            'alert_threshold' => 'nullable|integer',
            'provider_id' => 'nullable|exists:providers,id',
            'automatic_reorder' => 'boolean',
            'reorder_quantity' => 'nullable|integer',
        ]);
        $medicine = Medicine::create($validated);
        return new MedicineResource($medicine);
    }

    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'bar_code' => 'nullable|string',
            'dosage' => 'nullable|string',
            'formulation' => 'nullable|string',
            'expiration_date' => 'required|date',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'location' => 'nullable|string',
            'alert_threshold' => 'nullable|integer',
            'provider_id' => 'nullable|exists:providers,id',
            'automatic_reorder' => 'boolean',
            'reorder_quantity' => 'nullable|integer',
        ]);

        $medicine->update($validated);
        return new MedicineResource($medicine);
    }

    public function destroy($id)
    {
        $medicine = Medicine::findOrFail($id);
        $medicine->delete();
        return response()->json(['message' => 'Medicine deleted successfully.']);
    }
}
