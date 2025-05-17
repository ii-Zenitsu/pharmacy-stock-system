<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\MedicineResource;
use App\Models\Medicine;

class MedicineController extends Controller
{
    public function index()
    {
        $medicines = Medicine::with('provider')->get();
        return MedicineResource::collection($medicines);
        
    }


    public function show($id)
    {
        $medicine = Medicine::with('provider')->findOrFail($id);
        return new MedicineResource($medicine);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bar_code' => 'required|string|max:255|unique:medicines',
            'dosage' => 'required|string',
            'formulation' => 'required|string',
            'price' => 'required|numeric|min:0',
            'alert_threshold' => 'required|integer|min:0',
            'provider_id' => 'nullable|exists:providers,id',
            'automatic_reorder' => 'boolean',
            'reorder_quantity' => 'nullable|integer|min:1|required_if:automatic_reorder,true',
        ]);
        $medicine = Medicine::create($validated);
        return new MedicineResource($medicine);
    }

    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'bar_code' => 'sometimes|required|string|max:255|unique:medicines,bar_code,' . $medicine->id,
            'dosage' => 'sometimes|required|string',
            'formulation' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'alert_threshold' => 'nullable|integer|min:0',
            'provider_id' => 'nullable|exists:providers,id',
            'automatic_reorder' => 'boolean',
            'reorder_quantity' => 'nullable|integer|min:1|required_if:automatic_reorder,true',
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
