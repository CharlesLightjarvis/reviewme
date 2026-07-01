# Backend Architecture Guidelines

> Document de référence pour développeurs et assistants IA.
> Objectif : produire un code Laravel clair, testable, maintenable, typé, et cohérent sur tout le projet.

---

## 1. Principes directeurs

Ce projet suit une architecture Laravel orientée séparation des responsabilités.

Chaque couche a un rôle précis :

```txt
Request        → validation + autorisation HTTP
Controller     → orchestration HTTP minimale
Action         → logique métier / use case
Repository     → accès aux données
Model          → relations, casts, scopes simples
Enum           → états métier typés
Policy/Gate    → règles d’autorisation réutilisables
Resource       → transformation de sortie si nécessaire
```

La règle centrale :

> Le contrôleur ne doit pas contenir la logique métier.
> Le repository ne doit pas contenir la logique métier.
> L’action est le cœur du cas d’usage.

---

## 2. Règles non négociables pour les IA

Toute IA qui intervient sur ce projet doit respecter ces règles :

1. Ne jamais utiliser `$table->enum()` dans une migration.
2. Toujours utiliser une colonne `string` pour les statuts ou types métier.
3. Toujours créer un Enum PHP lorsque la valeur est fermée et métier.
4. Toujours caster l’Enum dans le modèle concerné.
5. Toujours définir les valeurs par défaut avec `EnumName::Case->value`.
6. Pour les CRUD, toujours créer :
    - une interface Repository ;
    - une implémentation Eloquent ;
    - des Actions ;
    - des Form Requests `Store...Request` et `Update...Request`.

7. Les Actions doivent utiliser `DB::transaction()` pour les opérations d’écriture.
8. Les Controllers doivent appeler des Actions injectées par constructeur.
9. Les Form Requests doivent être rangées par dossier de modèle.
10. Toute logique séparée par rôle doit être rangée dans un dossier dédié :
    - `Actions/SuperAdmin`
    - `Actions/Admin`
    - `Http/Controllers/SuperAdmin`
    - `Http/Controllers/Admin`
    - etc.

11. Ne jamais mettre de logique de validation dans un Controller.
12. Ne jamais mettre de redirect, Inertia render, flash message ou logique HTTP dans un Repository.
13. Ne jamais faire dépendre une Action directement d’Eloquent si un Repository existe pour ce modèle.
14. Toujours typer les retours et les paramètres.
15. Toujours garder les noms explicites, même si le fichier devient un peu plus long.

---

## 3. Convention sur les Enums

### 3.1 Interdiction de `$table->enum()`

Dans les migrations, ne jamais écrire :

```php
$table->enum('status', ['active', 'inactive']);
```

À la place, utiliser :

```php
$table->string('status')->default(EventStatus::Draft->value);
```

ou :

```php
$table->string('status')->default(GenericStatus::Active->value);
```

### 3.2 Exemple d’Enum

```php
<?php

namespace App\Enums;

enum EventStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Open = 'open';
    case Full = 'full';
    case Finished = 'finished';
    case Cancelled = 'cancelled';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::Published => 'Publié',
            self::Open => 'Ouvert aux réservations',
            self::Full => 'Complet',
            self::Finished => 'Terminé',
            self::Cancelled => 'Annulé',
            self::Archived => 'Archivé',
        };
    }
}
```

### 3.3 Exemple de migration

```php
<?php

use App\Enums\EventStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            $table->string('status')->default(EventStatus::Draft->value);

            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
```

### 3.4 Cast dans le Model

```php
<?php

namespace App\Models;

use App\Enums\EventStatus;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => EventStatus::class,
        ];
    }
}
```

---

## 4. Structure des dossiers si il ya des roles

```txt
app/
├── Actions/
│   ├── Admin/
        |---- Events
│   └── SuperAdmin/
├── Enums/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   ├── SuperAdmin/
│   └── Requests/
│       ├── Events/
│       ├── Reservations/
│       └── Tickets/
├── Models/
├── Policies/
└── Repositories/
    ├── Events/
    │   ├── EventRepository.php
    │   └── EloquentEventRepository.php
```

---

## 5. Repositories

Le Repository sert uniquement à isoler l’accès aux données.

Il peut contenir :

```txt
- paginate
- find
- create
- update
- delete
- query métier simple
- relation-based queries
```

Il ne doit pas contenir :

```txt
- validation
- autorisation
- DB::transaction
- redirect
- Inertia::render
- flash messages
- envoi email
```

### Interface Repository

```php
<?php

namespace App\Repositories\Events;

use App\Models\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EventRepository
{
    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function create(array $data): Event;

    public function update(Event $event, array $data): Event;

    public function delete(Event $event): void;
}
```

### Implémentation Eloquent

```php
<?php

namespace App\Repositories\Events;

use App\Models\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentEventRepository implements EventRepository
{
    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Event::query()
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Event
    {
        return Event::query()->create($data);
    }

    public function update(Event $event, array $data): Event
    {
        $event->update($data);

        return $event->fresh();
    }

    public function delete(Event $event): void
    {
        $event->delete();
    }
}
```

---

## 6. Binding des Repositories

Créer binder dans le AppServiceProvider

Exemple :

```php
<?php

namespace App\Providers;

use App\Repositories\Events\EloquentEventRepository;
use App\Repositories\Events\EventRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(EventRepository::class, EloquentEventRepository::class);
    }
}
```

---

## 7. Actions

Une Action représente un cas d’usage métier.

Exemples :

```txt
CreateEventAction
UpdateEventAction
PublishEventAction
CreateReservationAction
ConfirmReservationPaymentAction
GenerateTicketAction
ValidateTicketAction
CreateVenueAction
```

Une Action peut :

```txt
- ouvrir une transaction
- appeler un ou plusieurs repositories
- appliquer une règle métier
- déclencher un job
- générer un QR code
- appeler un service de paiement
- envoyer un événement Laravel
```

Une Action ne doit pas :

```txt
- retourner une réponse HTTP
- faire un redirect
- appeler Inertia::render
- lire directement `$request`
```

### Action standard avec transaction

```php
<?php

namespace App\Actions\Events;

use App\Models\Event;
use App\Repositories\Events\EventRepository;
use Illuminate\Support\Facades\DB;

class UpdateEventAction
{
    public function __construct(
        private readonly EventRepository $repository,
    ) {}

    public function handle(Event $event, array $data): Event
    {
        return DB::transaction(function () use ($event, $data) {
            return $this->repository->update($event, $data);
        });
    }
}
```

---

## 8. Controllers

Le Controller reste mince.
Il reçoit la requête, appelle l’Action, puis retourne une réponse.

Il peut contenir :

```txt
- appels aux Actions
- redirects
- Inertia::render
- flash messages
- choix de vue
```

Il ne doit pas contenir :

```txt
- logique métier
- requêtes Eloquent complexes
- transactions
- validation inline
- création manuelle de tickets
- logique de paiement
```

### Exemple Controller

```php
<?php

namespace App\Http\Controllers\Admin\Events;

use App\Actions\Events\CreateEventAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreEventRequest;
use Illuminate\Http\RedirectResponse;

class EventController extends Controller
{
    public function __construct(
        private readonly CreateEventAction $createAction,
    ) {}

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $event = $this->createAction->handle(
            $request->validated(),
        );

        return redirect()
            ->route('admin.events.show', $event)
            ->with('success', 'Événement créé avec succès.');
    }
}
```

---

## 9. Form Requests

Chaque modèle ou domaine a son propre dossier :

```txt
app/Http/Requests/Events/StoreEventRequest.php
app/Http/Requests/Events/UpdateEventRequest.php

app/Http/Requests/TicketTypes/StoreTicketTypeRequest.php
app/Http/Requests/TicketTypes/UpdateTicketTypeRequest.php

app/Http/Requests/Venues/StoreVenueRequest.php
app/Http/Requests/Venues/UpdateVenueRequest.php
```

### Store Request

```php
<?php

namespace App\Http\Requests\Events;

use App\Enums\EventStatus;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Event::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'venue_id' => ['required', 'exists:venues,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:events,slug'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(EventStatus::class)],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
```

---

## 10. Séparation par rôle

Quand une fonctionnalité change fortement selon le rôle, il faut créer un dossier dédié.

```txt
app/Http/Controllers/SuperAdmin/Users/UserController.php
app/Http/Controllers/Admin/Events/EventController.php
app/Http/Controllers/Staff/Tickets/TicketValidationController.php

app/Actions/SuperAdmin/Users/SuspendUserAction.php
app/Actions/Admin/Events/PublishEventAction.php
app/Actions/Staff/Tickets/ValidateTicketAction.php
```

Séparer par rôle si :

```txt
- les routes ne sont pas les mêmes
- les permissions ne sont pas les mêmes
- les écrans ne sont pas les mêmes
- les règles métier changent fortement
- le vocabulaire produit change selon le rôle
```

Ne pas séparer si seule la donnée filtrée change.
Dans ce cas, utiliser une query filtrée, une policy ou un scope.

---

## 11. Inertia + React

Laravel envoie aux pages Inertia uniquement les données nécessaires à l’écran.

````

Ces décisions restent côté Laravel.

---

## 13. Gestion des tickets et quotas

Les actions qui touchent aux tickets doivent être strictes.

Règles :

1. Vérifier le statut de l’événement.
2. Vérifier le quota du type de billet.
3. Vérifier la capacité totale de l’événement.
4. Empêcher les réservations au-delà du quota.
5. Empêcher le double scan.
6. Utiliser une transaction.
7. Utiliser un verrou si nécessaire.

---

## Slug et Order

ces colonnes seront gerées par spatie sluggable sur : https://spatie.be/docs/laravel-sluggable/v4/introduction pour la creation de slug automatique et spatie eloquent-sortable via https://github.com/spatie/eloquent-sortable pour gerer les oder de facon automatique

## Role et permissions

les roles et permissions sont gerer par spatie laravel permission https://spatie.be/docs/laravel-permission/v7/installation-laravel

## 14. Checklist avant génération de code par IA

Avant de générer un CRUD, l’IA doit répondre mentalement à ces questions :

```txt
1. Quel est le modèle concerné ?
2. Y a-t-il un parent obligatoire ?
3. Y a-t-il des statuts ou types métier ?
4. Faut-il créer un Enum ?
5. Quelle colonne doit avoir un default Enum::Case->value ?
6. Où sont les Form Requests ?
7. Quelles Actions sont nécessaires ?
8. Quel Repository créer ?
9. Faut-il une séparation par rôle ?
10. Faut-il une transaction ?
11. Faut-il gérer la concurrence ?
12. Quelle réponse HTTP/Inertia le Controller doit-il retourner ?
````

---

## 15. Checklist de revue de code

```txt
[ ] Aucun `$table->enum()`
[ ] Tous les statuts métier utilisent des Enums PHP
[ ] Les Enums sont castés dans les Models
[ ] Les defaults de migration utilisent `Enum::Case->value`
[ ] Le Controller est mince
[ ] Les Form Requests existent
[ ] La validation n’est pas dans le Controller
[ ] Les Actions utilisent `DB::transaction()` pour les écritures
[ ] Le Repository ne contient pas de logique HTTP
[ ] Les interfaces Repository sont bindées dans un Provider
[ ] Les namespaces correspondent aux dossiers
[ ] Les droits sont vérifiés via Request, Policy ou Controller
[ ] Les opérations sensibles sont protégées contre les doubles actions
[ ] Les noms de classes sont explicites
```

---

## Wayfinder

en frontend toujours utiliser wayfinder voir les skills D:\Laravel_Projects\pmindfull\.claude\skills\wayfinder-development\SKILL.md

## Resource

Toujours utilisé les ressources dans le controller pour renvoyer les données vers le front

## 16. Résumé décisionnel

```txt
Migration → string + Enum::Case->value
Model → casts Enum
Request → validation + authorization
Controller → appel Action
Action → transaction + use case
Repository → accès données
Policy → autorisation réutilisable
React → affichage et interaction
Laravel → vérité métier
```

Ce document doit être respecté pour tout nouveau module du projet.
