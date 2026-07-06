<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Concerns\AuditsCliActions;
use App\Concerns\PasswordValidationRules;
use App\Concerns\RequiresCliSecret;
use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\password;
use function Laravel\Prompts\select;
use function Laravel\Prompts\table;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

class ManageUsersCommand extends Command
{
    use PasswordValidationRules, RequiresCliSecret, AuditsCliActions;

    protected $signature = 'make:users';

    protected $description = 'Gestion interactive des utilisateurs : lister, créer, modifier, supprimer, changer de rôle';

    public function handle(): int
    {
        while (true) {
            $action = select(
                label: 'Que veux-tu faire ?',
                options: [
                    'list' => 'Lister les utilisateurs',
                    'create' => 'Créer un utilisateur',
                    'update' => 'Modifier un utilisateur',
                    'role' => 'Changer le rôle d\'un utilisateur',
                    'delete' => 'Supprimer un utilisateur',
                    'exit' => 'Quitter',
                ],
            );

            match ($action) {
                'list' => $this->listUsers(),
                'create' => $this->createUser(),
                'update' => $this->updateUser(),
                'role' => $this->changeRole(),
                'delete' => $this->deleteUser(),
                'exit' => null,
            };

            if ($action === 'exit') {
                break;
            }

            $this->newLine();
        }

        return self::SUCCESS;
    }

    private function listUsers(): void
    {
        $users = User::with('roles')->orderBy('name')->get();

        if ($users->isEmpty()) {
            warning('Aucun utilisateur trouvé.');

            return;
        }

        table(
            headers: ['ID', 'Nom', 'Email', 'Rôle(s)', 'Créé le'],
            rows: $users->map(fn(User $user) => [
                $user->id,
                $user->name,
                $user->email,
                $user->roles->pluck('name')->implode(', ') ?: '—',
                $user->created_at?->format('d/m/Y'),
            ])->toArray(),
        );
    }

    private function createUser(): void
    {
        $name = text(label: 'Nom complet', required: true);

        $email = text(
            label: 'Email',
            required: true,
            validate: fn(string $value) => Validator::make(
                ['email' => $value],
                ['email' => ['required', 'email', 'max:255', 'unique:users,email']],
            )->errors()->first('email'),
        );

        $pass = password(
            label: 'Mot de passe',
            required: true,
            validate: fn(string $value) => $this->validatePasswordWithoutConfirmation($value),
        );

        password(
            label: 'Confirme le mot de passe',
            required: true,
            validate: fn(string $value) => $value === $pass
                ? null
                : 'Les mots de passe ne correspondent pas.',
        );

        $role = select(
            label: 'Rôle',
            options: $this->roleOptions(),
        );

        if ($role === RoleEnum::Admin->value && ! confirm('Confirmer la création de cet ADMIN ?', default: false)) {
            info('Annulé.');

            return;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($pass),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($role);

        info("Utilisateur créé : {$user->email} ({$role})");
    }

    private function updateUser(): void
    {
        $user = $this->pickUser();

        if (! $user) {
            return;
        }

        $name = text(label: 'Nom', default: $user->name, required: true);

        $email = text(
            label: 'Email',
            default: $user->email,
            required: true,
            validate: fn(string $value) => Validator::make(
                ['email' => $value],
                ['email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id]],
            )->errors()->first('email'),
        );

        $changePassword = confirm('Changer le mot de passe ?', default: false);

        $user->name = $name;
        $user->email = $email;

        if ($changePassword) {
            $pass = password(
                label: 'Nouveau mot de passe',
                required: true,
                validate: fn(string $value) => $this->validatePasswordWithoutConfirmation($value),
            );

            password(
                label: 'Confirme le nouveau mot de passe',
                required: true,
                validate: fn(string $value) => $value === $pass
                    ? null
                    : 'Les mots de passe ne correspondent pas.',
            );

            $user->password = Hash::make($pass);
        }

        $user->save();

        info("Utilisateur #{$user->id} mis à jour.");
    }

    private function changeRole(): void
    {
        $user = $this->pickUser();

        if (! $user) {
            return;
        }

        $currentRole = $user->roles->first()?->name;

        $newRole = select(
            label: "Nouveau rôle pour {$user->email} (actuel : " . ($currentRole ?? '—') . ')',
            options: $this->roleOptions(),
        );

        // Empêche de retirer le dernier admin par erreur
        if (
            $currentRole === RoleEnum::Admin->value
            && $newRole !== RoleEnum::Admin->value
            && User::role(RoleEnum::Admin->value)->count() <= 1
        ) {
            error('Impossible : c\'est le dernier compte administrateur restant.');

            return;
        }

        if ($newRole === RoleEnum::Admin->value && ! confirm('Confirmer la promotion en ADMIN ?', default: false)) {
            info('Annulé.');

            return;
        }

        $user->syncRoles([$newRole]);

        info("Rôle de {$user->email} mis à jour : {$newRole}");
    }

    private function deleteUser(): void
    {
        $user = $this->pickUser();

        if (! $user) {
            return;
        }

        if ($user->hasRole(RoleEnum::Admin->value) && User::role(RoleEnum::Admin->value)->count() <= 1) {
            error('Impossible : c\'est le dernier compte administrateur restant.');

            return;
        }

        if (! confirm("Supprimer définitivement {$user->email} ? Cette action est irréversible.", default: false)) {
            info('Annulé.');

            return;
        }

        $user->delete();

        info('Utilisateur supprimé.');
    }

    private function pickUser(): ?User
    {
        $query = text(
            label: 'Cherche un utilisateur par nom ou email',
            required: true,
        );

        $users = User::query()
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get();

        if ($users->isEmpty()) {
            warning("Aucun utilisateur trouvé pour « {$query} ».");

            return null;
        }

        $id = select(
            label: 'Sélectionne un utilisateur',
            options: $users
                ->mapWithKeys(
                    fn(User $user) => [
                        $user->id => "{$user->name} ({$user->email})",
                    ],
                )
                ->toArray(),
        );

        return User::find($id);
    }

    private function roleOptions(): array
    {
        return collect(RoleEnum::cases())
            ->mapWithKeys(fn(RoleEnum $role) => [$role->value => $role->label()])
            ->toArray();
    }

    private function validatePasswordWithoutConfirmation(string $password): ?string
    {
        $rules = collect($this->passwordRules())
            ->reject(fn(mixed $rule): bool => $rule === 'confirmed')
            ->values()
            ->all();

        $validator = Validator::make(
            ['password' => $password],
            ['password' => $rules],
        );

        return $validator->errors()->first('password') ?: null;
    }
}
