<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Provider;
use App\Models\Medicine;
use App\Models\ActivityLog;
use App\Http\Resources\OrderResource;
use App\Mail\OrderNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['provider', 'medicine'])->get();
        return OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with(['provider', 'medicine'])->findOrFail($id);
        return new OrderResource($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'provider_id' => 'required|exists:providers,id',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $provider = Provider::findOrFail($validated['provider_id']);
            $medicine = Medicine::findOrFail($validated['medicine_id']);
            Mail::to($provider->email)->send(new OrderNotification($provider, $medicine, $validated['quantity']));

            $order = Order::create($validated);

            ActivityLog::log('order_created', "Created order for {$validated['quantity']} units of {$medicine->name} from provider {$provider->name} (Order ID: {$order->id})");

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully and notification sent to provider.',
                'data' => new OrderResource($order)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order or send notification. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function update(Request $request, $id)
    // {
    //     $order = Order::findOrFail($id);

    //     $validated = $request->validate([
    //         'medicine_id' => 'required|exists:medicines,id',
    //         'quantity' => 'required|integer|min:1',
    //     ]);

    //     $order->update([
    //         'medicine_id' => $validated['medicine_id'],
    //         'quantity' => $validated['quantity'],
    //     ]);

    //     return new OrderResource($order);
    // }

    // public function destroy($id)
    // {
    //     $order = Order::findOrFail($id);
    //     $order->delete();
    //     return response()->json(['message' => 'Order deleted successfully.']);
       
    // }

}
