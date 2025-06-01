<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
<<<<<<< HEAD
use App\Http\Resources\LocationResource;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return LocationResource::collection($locations);
    }

=======
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
>>>>>>> 87df2349673e19937f41dafe1a3341f6554cea07
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations',
            'description' => 'nullable|string',
        ]);

        $location = Location::create($validated);
<<<<<<< HEAD
        return new LocationResource($location);
    }

    public function show($id)
    {
        $location = Location::findOrFail($id);
        return new LocationResource($location);
    }

=======
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
>>>>>>> 87df2349673e19937f41dafe1a3341f6554cea07
    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
<<<<<<< HEAD
            'name' => 'required|string|max:255|unique:locations,name,' . $location->id,
=======
            'name' => 'sometimes|required|string|max:255|unique:locations,name,' . $location->id,
>>>>>>> 87df2349673e19937f41dafe1a3341f6554cea07
            'description' => 'nullable|string',
        ]);

        $location->update($validated);
<<<<<<< HEAD
        return new LocationResource($location);
    }

=======
        return response()->json($location);
    }

    /**
     * Remove the specified resource from storage.
     */
>>>>>>> 87df2349673e19937f41dafe1a3341f6554cea07
    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return response()->json(['message' => 'Location deleted successfully.']);
    }
<<<<<<< HEAD
} 
=======
}
>>>>>>> 87df2349673e19937f41dafe1a3341f6554cea07
