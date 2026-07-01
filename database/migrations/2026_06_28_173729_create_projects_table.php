<?php

use App\Enums\ProjectStatusEnum;
use App\Enums\ProjectTypeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');

            $table->string('type')->default(ProjectTypeEnum::Web->value);
            $table->string('status')->default(ProjectStatusEnum::Draft->value);

            $table->string('image')->nullable();
            $table->json('links')->nullable();

            $table->unsignedInteger('view_count')->default(0);
            $table->decimal('rating', 3, 1)->nullable();
            $table->boolean('featured')->default(false);
            $table->json('tech_stack')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
