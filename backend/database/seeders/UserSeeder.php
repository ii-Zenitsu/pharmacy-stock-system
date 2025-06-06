<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ["admin", "employe"];

        foreach ($roles as $role) {
            User::factory()->create([
                'email' => strtolower($role) . '@example.com',
                'password' => 'password',
                'role' => $role,
            ]);
        }
        
        User::factory(3)->create();
    }
}
