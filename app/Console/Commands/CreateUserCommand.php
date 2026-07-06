<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Concerns\PasswordValidationRules;
use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Console\Concerns\RequiresCliSecret;
use App\Console\Concerns\AuditsCliActions;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\password;
use function Laravel\Prompts\select;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

class CreateUserCommand extends Command
{
    use PasswordValidationRules, RequiresCliSecret, AuditsCliActions;

    protected $signature = 'make:user';

    protected $description = 'Crée un utilisateur de façon interactive';

    public function handle(): int
    {
        $name = text(
            label: 'Nom complet',
            required: true,
            validate: function (string $value): ?string {
                if (mb_strlen($value) > 255) {
                    return 'Le nom ne doit pas dépasser 255 caractères.';
                }

                return null;
            },
        );

        $email = text(
            label: 'Email',
            required: true,
            validate: fn(string $value): ?string => $this->validateEmail($value),
        );

        $password = password(
            label: 'Mot de passe',
            required: true,
            validate: fn(string $value): ?string => $this->validatePasswordWithoutConfirmation($value),
        );

        password(
            label: 'Confirme le mot de passe',
            required: true,
            validate: fn(string $value): ?string => $value === $password
                ? null
                : 'Les mots de passe ne correspondent pas.',
        );

        $role = select(
            label: 'Rôle à attribuer',
            options: collect(RoleEnum::cases())
                ->mapWithKeys(
                    fn(RoleEnum $role): array => [
                        $role->value => $role->label(),
                    ],
                )
                ->all(),
        );

        if ($role === RoleEnum::Admin->value) {
            warning(
                'Tu es sur le point de créer un compte administrateur avec un accès total à la plateforme.',
            );

            if (! confirm(
                label: 'Confirmer la création de cet administrateur ?',
                default: false,
            )) {
                $this->info('Création annulée.');

                return self::SUCCESS;
            }
        }

        $user = User::query()->create([
            'name' => $name,
            'email' => mb_strtolower($email),
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($role);

        $this->newLine();
        $this->info("Utilisateur créé : {$user->email}");
        $this->line("Rôle attribué : {$role}");

        return self::SUCCESS;
    }

    private function validateEmail(string $email): ?string
    {
        $validator = Validator::make(
            ['email' => $email],
            [
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    'unique:users,email',
                ],
            ],
        );

        return $validator->errors()->first('email') ?: null;
    }

    private function validatePasswordWithoutConfirmation(string $password): ?string
    {
        $rules = collect($this->passwordRules())
            ->reject(
                fn(mixed $rule): bool => $rule === 'confirmed',
            )
            ->values()
            ->all();

        $validator = Validator::make(
            ['password' => $password],
            ['password' => $rules],
        );

        return $validator->errors()->first('password') ?: null;
    }
}
