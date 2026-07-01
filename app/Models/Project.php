<?php

namespace App\Models;

use App\Enums\ProjectStatusEnum;
use App\Enums\ProjectTypeEnum;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property ProjectTypeEnum $type
 * @property ProjectStatusEnum $status
 * @property string|null $image
 * @property array<string, string>|null $links
 * @property int $view_count
 * @property float|null $rating
 * @property bool $featured
 * @property array<int, string>|null $tech_stack
 */
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, HasSlug;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'type',
        'status',
        'image',
        'links',
        'view_count',
        'rating',
        'featured',
        'tech_stack',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProjectTypeEnum::class,
            'status' => ProjectStatusEnum::class,
            'links' => 'array',
            'tech_stack' => 'array',
            'featured' => 'boolean',
            'rating' => 'float',
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function scopePubliclyVisible(Builder $query): void
    {
        $query->whereIn('status', [
            ProjectStatusEnum::Scheduled,
            ProjectStatusEnum::ReviewedLive,
        ]);
    }
}
