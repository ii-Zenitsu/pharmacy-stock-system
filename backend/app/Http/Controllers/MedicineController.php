<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\MedicineResource;
use App\Models\Medicine;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MedicineController extends Controller
{
    public function index()
    {
        $medicines = Medicine::with('provider')->get();
        return MedicineResource::collection($medicines);
    }

    public function publicIndex()
    {
        $medicines = Medicine::available()->get();
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'alert_threshold' => 'required|integer|min:0',
            'provider_id' => 'nullable|exists:providers,id',
            'automatic_reorder' => 'boolean',
            'reorder_quantity' => 'nullable|integer|min:1|required_if:automatic_reorder,true',
        ]);
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images/medicines', 'public');
            $validated['image'] = $imagePath;
        }
        $medicine = Medicine::create($validated);
        
        ActivityLog::log('medicine_created', "Created new medicine: {$medicine->name} (Bar code: {$medicine->bar_code})");
        return new MedicineResource($medicine);
    }

    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);
        $oldName = $medicine->name;

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'bar_code' => 'sometimes|required|string|max:255|unique:medicines,bar_code,' . $medicine->id,
            'dosage' => 'sometimes|required|string',
            'formulation' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'alert_threshold' => 'required|integer|min:0',
            'provider_id' => 'nullable|exists:providers,id',
            'automatic_reorder' => 'boolean',
            'reorder_quantity' => 'nullable|integer|min:1|required_if:automatic_reorder,true',
        ]);

        if ($request->hasFile('image')) {
            if ($medicine->image && Storage::disk('public')->exists($medicine->image)) {
                Storage::disk('public')->delete($medicine->image);
            }
            $file = $request->file('image');
            $filename = str()->uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('images/medicines', $filename, 'public');

            $validated['image'] = $imagePath;
        } elseif ($request->filled('image') && $request->input('image') === '') {
            if ($medicine->image && Storage::disk('public')->exists($medicine->image)) {
                Storage::disk('public')->delete($medicine->image);
            }
            $validated['image'] = null;
        }

        $medicine->update($validated);
        
        ActivityLog::log('medicine_updated', "Updated medicine: {$oldName}" . ($oldName !== $medicine->name ? " (renamed to {$medicine->name})" : "") . " (ID: {$medicine->id})");
        return new MedicineResource($medicine);
    }

    public function destroy($id)
    {
        $medicine = Medicine::findOrFail($id);
        $medicineName = $medicine->name;
        $medicineBarCode = $medicine->bar_code;
        
        $medicine->delete();
        
        ActivityLog::log('medicine_deleted', "Deleted medicine: {$medicineName} (Bar code: {$medicineBarCode}, ID: {$id})");
        return response()->json(['message' => 'Medicine deleted successfully.']);
    }
}
