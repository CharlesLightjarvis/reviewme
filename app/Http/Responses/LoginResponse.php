<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Http\Responses\Concerns\RedirectsToIntendedPath;
use App\Models\User;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    use RedirectsToIntendedPath;

    public function toResponse($request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $redirect = $this->safeIntendedPath($request->input('redirect')) ?? match (true) {
            $user->isCreator() => route('creator.dashboard'),
            $user->isAdmin() => route('admin.dashboard'),
            default => route('home'),
        };

        return redirect($redirect);
    }
}
