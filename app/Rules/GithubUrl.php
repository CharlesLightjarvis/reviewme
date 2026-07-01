<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class GithubUrl implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('The URL must be a valid GitHub URL.');

            return;
        }

        $host = parse_url($value, PHP_URL_HOST);
        $host = $host !== false ? mb_strtolower((string) $host) : null;

        if (! in_array($host, ['github.com', 'www.github.com'], true)) {
            $fail('The URL must be a valid GitHub URL (e.g. https://github.com/username/project).');
        }
    }
}
