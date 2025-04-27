<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\OrderResource;

class MedicineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'bar_code' => $this->bar_code,
            'dosage' => $this->dosage,
            'formulation' => $this->formulation,
            'expiration_date' => $this->expiration_date,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'location' => $this->location,
            'alert_threshold' => $this->alert_threshold,
            'automatic_reorder' => $this->automatic_reorder,
            'reorder_quantity' => $this->reorder_quantity,
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            
        ];
    }
}
