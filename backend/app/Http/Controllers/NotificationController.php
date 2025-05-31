<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications
     */
    public function index(Request $request)
    {
        $query = Notification::query();

        // Filter by read status if specified
        if ($request->has('is_read')) {
            $isRead = filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_read', $isRead);
        }

        // Order by newest first
        $notifications = $query->orderBy('created_at', 'desc')->get();

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
            'message' => 'required|string',
            'action' => 'nullable|string|max:255',
            'is_read' => 'boolean',
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
            'message' => 'sometimes|required|string',
            'action' => 'nullable|string|max:255',
            'is_read' => 'sometimes|boolean',
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

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'data' => $notification,
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Mark a notification as unread
     */
    public function markAsUnread($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->markAsUnread();

        return response()->json([
            'success' => true,
            'data' => $notification,
            'message' => 'Notification marked as unread',
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $updatedCount = Notification::unread()->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => "{$updatedCount} notifications marked as read",
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadCount()
    {
        $count = Notification::unread()->count();

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }

    /**
     * Get recent notifications (last 10)
     */
    public function getRecent()
    {
        $notifications = Notification::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Clear all read notifications
     */
    public function clearRead()
    {
        $deletedCount = Notification::read()->delete();

        return response()->json([
            'success' => true,
            'message' => "{$deletedCount} read notifications cleared",
        ]);
    }
}