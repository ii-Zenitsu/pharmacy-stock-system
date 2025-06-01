<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json([
            'success' => true,
            'data' => $users,
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|max:255',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'birth_date' => $request->birth_date,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        ActivityLog::log('user_created', "Created new user: {$user->first_name} {$user->last_name} ({$user->email}) with role: {$user->role}");

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);    
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'birth_date' => $user->birth_date,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'birth_date' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'role' => 'sometimes|required|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $oldEmail = $user->email;
        $oldRole = $user->role;
        
        $user->update($request->only(
            'first_name',
            'last_name',
            'birth_date',
            'email',
            'role'
        ));

        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
            $user->save();
        }

        $changes = [];
        if ($oldEmail !== $user->email) {
            $changes[] = "email changed from {$oldEmail} to {$user->email}";
        }
        if ($oldRole !== $user->role) {
            $changes[] = "role changed from {$oldRole} to {$user->role}";
        }
        if ($request->filled('password')) {
            $changes[] = "password updated";
        }
        
        $changeDescription = !empty($changes) ? " (" . implode(", ", $changes) . ")" : "";
        ActivityLog::log('user_updated', "Updated user: {$user->first_name} {$user->last_name}{$changeDescription} (ID: {$user->id})");

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $userName = "{$user->first_name} {$user->last_name}";
        $userEmail = $user->email;
        
        $user->delete();

        ActivityLog::log('user_deleted', "Deleted user: {$userName} ({$userEmail}, ID: {$id})");

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }
}