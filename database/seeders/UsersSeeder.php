<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['role' => RoleEnum::Admin,   'name' => 'Admin',   'email' => 'admin@reviewme.com'],
            ['role' => RoleEnum::Creator, 'name' => 'Creator', 'email' => 'creator@reviewme.com'],
        ];

        foreach ($users as $entry) {
            $user = User::firstOrCreate(
                ['email' => $entry['email']],
                [
                    'name' => $entry['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ],
            );

            $user->syncRoles([$entry['role']->value]);
        }
    }
}
