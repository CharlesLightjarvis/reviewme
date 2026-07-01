# ReviewMe

Plateforme de soumission de projets tech (web, mobile, design, no-code) pour revue en direct lors de lives TikTok. Les créateurs soumettent leurs projets, les administrateurs les programment et les revoient en live, et la communauté peut commenter en temps réel.

## Stack

- [Laravel 13](https://laravel.com) + [Inertia.js v3](https://inertiajs.com) + [React 19](https://react.dev)
- [Laravel Fortify](https://laravel.com/docs/fortify) pour l'authentification (2FA, passkeys)
- [Laravel Reverb](https://laravel.com/docs/reverb) pour le temps réel (notifications, commentaires)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Laravel Wayfinder](https://github.com/laravel/wayfinder) pour les routes/actions typées côté frontend

## Installation

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run build
```

## Développement

```bash
composer run dev
```

Lance en parallèle le serveur PHP, la queue, et Vite.
