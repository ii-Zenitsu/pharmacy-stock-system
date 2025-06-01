<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use App\Http\Resources\LocationResource;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return LocationResource::collection($locations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations',
            'description' => 'nullable|string',
        ]);

        $location = Location::create($validated);
        return new LocationResource($location);
    }

    public function show($id)
    {
        $location = Location::findOrFail($id);
        return new LocationResource($location);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name,' . $location->id,
            'description' => 'nullable|string',
        ]);

        $location->update($validated);
        return new LocationResource($location);
    }

    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return response()->json(['message' => 'Location deleted successfully.']);
    }
} 