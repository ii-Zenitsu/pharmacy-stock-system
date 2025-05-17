<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;

class ProviderController extends Controller
{
    public function index()
    {
        $providers = Provider::all();
        return ProviderResource::collection($providers);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:providers,email',
            'phone' => 'required|string|max:15',
        ]);

        $provider = Provider::create($validatedData);
        return new ProviderResource($provider);
    }

    public function show($id)
    {
       
        $provider = Provider::findOrFail($id);
        return new ProviderResource($provider);
    }

    public function update(Request $request, $id)
    {
       
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:providers,email,' . $id,
            'phone' => 'required|string|max:15',
        ]);
        $provider = Provider::findOrFail($id);

        $provider->update($validatedData);

        return new ProviderResource($provider);
    }

    public function destroy($id)
    {
        
        $provider = Provider::findOrFail($id);
        $provider->delete();
        return response()->json(['message' => 'Provider deleted successfully.']);
    }

}
