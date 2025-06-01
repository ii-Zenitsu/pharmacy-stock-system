<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $request->validated();
        $user = User::create($request->all());
    
        $user->sendEmailVerificationNotification();
        $token = $user->createToken('auth_token');
        $expires = now()->addDays(30)->diffInDays(now(), true);
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->role,
                'birth_date' => $user->birth_date,
                'email' => $user->email,
            ],
            'token' => $token->plainTextToken,
            'expires' => $expires,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $request->validated();
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('auth_token');
            $expires = now()->addDays(30)->diffInDays(now(), true);
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'role' => $user->role,
                    'birth_date' => $user->birth_date,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at
                ],
                'token' => $token->plainTextToken,
                'expires' => $expires,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Invalid credentials',
                "errors" => ["password" => ["Email or Password is incorrect"]]
            ], 401);
        }
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ], 200);
    }
    public function getUser()
    {
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->role,
                'birth_date' => $user->birth_date,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at
            ],
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->role,
                'birth_date' => $user->birth_date,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at
            ],
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'current_password' => 'required|string|current_password',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user->password = bcrypt($validated['password']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    }
}