<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MedicineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        if (!$user) {
            return [
                'name' => $this->name,
                'bar_code' => $this->bar_code,
                'price' => $this->price,
                'image' => $this->image ? url(Storage::url($this->image)) : null,
            ];
        }

        if ($user->role === 'admin') {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'bar_code' => $this->bar_code,
                'dosage' => $this->dosage,
                'formulation' => $this->formulation,
                'price' => $this->price,
                'total_quantity' => $this->total_quantity,
                'image' => $this->image ? url(Storage::url($this->image)) : null,
                'alert_threshold' => $this->alert_threshold,
                'automatic_reorder' => $this->automatic_reorder,
                'reorder_quantity' => $this->reorder_quantity,
                'provider_id' => $this->provider_id,
                'provider' => $this->provider,
                'stocks' => $this->stocks,
                // 'orders' => $this->orders,
                'created_at' => $this->created_at,
            ];
        }

        if ($user->role === 'employe') {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'bar_code' => $this->bar_code,
                'dosage' => $this->dosage,
                'formulation' => $this->formulation,
                'price' => $this->price,
                'total_quantity' => $this->total_quantity,
                'image' => $this->image ? url(Storage::url($this->image)) : null,
                'stocks' => $this->stocks,
            ];
        }

        return parent::toArray($request);
    }
}
