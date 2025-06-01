<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications
     */
    public function index()
    {
        $notifications = Notification::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Store a newly created notification
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'medicine' => 'required|string',
            'location' => 'required|string',
            'action' => 'required|integer',
        ]);

        $notification = Notification::create($validated);

        return response()->json([
            'success' => true,
            'data' => $notification,
            'message' => 'Notification created successfully',
        ], 201);
    }

    /**
     * Display the specified notification
     */
    public function show($id)
    {
        $notification = Notification::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $notification,
        ]);
    }

    /**
     * Update the specified notification
     */
    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'medicine' => 'sometimes|required|string',
            'location' => 'sometimes|required|string',
            'action' => 'required|integer',
        ]);

        $notification->update($validated);

        return response()->json([
            'success' => true,
            'data' => $notification,
            'message' => 'Notification updated successfully',
        ]);
    }

    /**
     * Remove the specified notification
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully',
        ]);
    }

    public function deleteAll()
    {
        Notification::truncate();

        return response()->json([
            'success' => true,
            'message' => 'All notifications deleted successfully',
        ]);
    }
}