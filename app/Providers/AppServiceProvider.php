<?php

namespace App\Providers;

use App\Http\Responses\LoginResponse;
use App\Http\Responses\RegisterResponse;
use App\Repositories\Admin\Projects\EloquentProjectRepository as AdminEloquentProjectRepository;
use App\Repositories\Admin\Projects\ProjectRepository as AdminProjectRepository;
use App\Repositories\Creator\Projects\EloquentProjectRepository as CreatorEloquentProjectRepository;
use App\Repositories\Creator\Projects\ProjectRepository as CreatorProjectRepository;
use App\Repositories\Public\Projects\CommentRepository as PublicCommentRepository;
use App\Repositories\Public\Projects\EloquentCommentRepository as PublicEloquentCommentRepository;
use App\Repositories\Public\Projects\EloquentProjectRepository as PublicEloquentProjectRepository;
use App\Repositories\Public\Projects\ProjectRepository as PublicProjectRepository;
use Carbon\CarbonImmutable;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use ImageKit\ImageKit;
use Inertia\ExceptionResponse;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use League\Flysystem\Filesystem;
use TaffoVelikoff\ImageKitAdapter\ImagekitAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
        $this->app->singleton(RegisterResponseContract::class, RegisterResponse::class);

        $this->app->bind(CreatorProjectRepository::class, CreatorEloquentProjectRepository::class);
        $this->app->bind(PublicProjectRepository::class, PublicEloquentProjectRepository::class);
        $this->app->bind(AdminProjectRepository::class, AdminEloquentProjectRepository::class);
        $this->app->bind(PublicCommentRepository::class, PublicEloquentCommentRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureStorage();
        $this->configureErrorHandling();
    }

    /**
     * Register the ImageKit storage driver.
     */
    protected function configureStorage(): void
    {
        Storage::extend('imagekit', function ($app, $config) {
            $adapter = new ImagekitAdapter(
                new ImageKit(
                    $config['public_key'],
                    $config['private_key'],
                    $config['endpoint_url'],
                ),
            );

            return new FilesystemAdapter(
                new Filesystem($adapter, $config),
                $adapter,
                $config,
            );
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Render a branded Inertia error page for HTTP errors in production.
     * Left alone in local/testing so Laravel's debug error screens still show.
     */
    protected function configureErrorHandling(): void
    {
        if (! app()->isProduction()) {
            return;
        }

        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            if (in_array($response->statusCode(), [403, 404, 500, 503], true)) {
                return $response->render('error-page', [
                    'status' => $response->statusCode(),
                ])->withSharedData();
            }
        });
    }
}
