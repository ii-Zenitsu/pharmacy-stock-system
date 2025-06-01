<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use App\Models\ActivityLog;

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
        
        ActivityLog::log('provider_created', "Created new provider: {$provider->name} ({$provider->email}, Phone: {$provider->phone})");
        
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
        $oldName = $provider->name;
        $oldEmail = $provider->email;

        $provider->update($validatedData);

        $changes = [];
        if ($oldName !== $provider->name) {
            $changes[] = "name changed from '{$oldName}' to '{$provider->name}'";
        }
        if ($oldEmail !== $provider->email) {
            $changes[] = "email changed from '{$oldEmail}' to '{$provider->email}'";
        }
        
        $changeDescription = !empty($changes) ? " (" . implode(", ", $changes) . ")" : "";
        ActivityLog::log('provider_updated', "Updated provider: {$provider->name}{$changeDescription} (ID: {$provider->id})");

        return new ProviderResource($provider);
    }

    public function destroy($id)
    {
        $provider = Provider::findOrFail($id);
        $providerName = $provider->name;
        $providerEmail = $provider->email;
        
        $provider->delete();
        
        ActivityLog::log('provider_deleted', "Deleted provider: {$providerName} ({$providerEmail}, ID: {$id})");
        
        return response()->json(['message' => 'Provider deleted successfully.']);
    }

}
