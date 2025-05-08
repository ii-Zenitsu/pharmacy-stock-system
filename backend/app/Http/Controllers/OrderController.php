<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Resources\OrderResource;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('medicine')->get();
        return OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with('medicine')->findOrFail($id);
        return new OrderResource($order);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $order = Order::create([
            'medicine_id' => $validated['medicine_id'],
            'quantity' => $validated['quantity'],
        ]);

        return new OrderResource($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $order->update([
            'medicine_id' => $validated['medicine_id'],
            'quantity' => $validated['quantity'],
        ]);

        return new OrderResource($order);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully.']);
       
    }

}
