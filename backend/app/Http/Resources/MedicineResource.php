<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
                'price' => $this->price,
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
                'alert_threshold' => $this->alert_threshold,
                'automatic_reorder' => $this->automatic_reorder,
                'reorder_quantity' => $this->reorder_quantity,
                'provider_id' => $this->provider_id,
                'provider' => $this->provider,
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
            ];
        }

        return parent::toArray($request);
    }
}
