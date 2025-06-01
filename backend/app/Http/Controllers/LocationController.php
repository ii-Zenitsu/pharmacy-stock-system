<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
// Removed: use App\Http\Resources\LocationResource;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations',
            'description' => 'nullable|string',
        ]);

        $location = Location::create($validated);
        
        ActivityLog::log('location_created', "Created new location: {$location->name}" . ($location->description ? " ({$location->description})" : ""));
        
        return response()->json($location, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $location = Location::findOrFail($id);
        return response()->json($location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);
        $oldName = $location->name;
        $oldDescription = $location->description;

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:locations,name,' . $location->id,
            'description' => 'nullable|string',
        ]);

        $location->update($validated);
        
        $changes = [];
        if (isset($validated['name']) && $oldName !== $validated['name']) {
            $changes[] = "name changed from '{$oldName}' to '{$validated['name']}'";
        }
        if (array_key_exists('description', $validated) && $oldDescription !== $validated['description']) {
            $changes[] = "description updated";
        }
        
        $changeDescription = !empty($changes) ? " (" . implode(", ", $changes) . ")" : "";
        ActivityLog::log('location_updated', "Updated location: {$location->name}{$changeDescription} (ID: {$location->id})");
        
        return response()->json($location);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $locationName = $location->name;
        
        $location->delete();
        
        ActivityLog::log('location_deleted', "Deleted location: {$locationName} (ID: {$id})");
        
        return response()->json(['message' => 'Location deleted successfully.']);
    }
}