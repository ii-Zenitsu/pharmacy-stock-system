<?php

namespace App\Http\Controllers;

use App\Models\Location;
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

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:locations,name,' . $location->id,
            'description' => 'nullable|string',
        ]);

        $location->update($validated);
        return response()->json($location);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return response()->json(['message' => 'Location deleted successfully.']);
    }
}