<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Stock;
use Illuminate\Console\Command;

class CheckExpiredMedicines extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'medicines:check-expired';
    protected $description = 'Check for expired medicines and create notifications';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredMedicines = Stock::expired()->with(['medicine', 'location'])->get();

        foreach ($expiredMedicines as $stock) {
            $existingNotification = Notification::where('action', $stock->medicine->id)
                ->where('title', 'Expired')
                ->where('location', $stock->location->name)
                ->first();

            if (!$existingNotification) {
                Notification::create([
                    'title' => 'Expired',
                    'medicine' => $stock->medicine->name,
                    'location' => $stock->location->name,
                    'action' => $stock->medicine->id,
                ]);
            }
        }

        return Command::SUCCESS;
    }
}
