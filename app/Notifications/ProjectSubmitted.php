<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Project $project,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail', 'broadcast'];
    }

    /**
     * Route each channel to its own queue so a slow/failing mail job
     * never delays or gets duplicated alongside the broadcast job.
     *
     * @return array<string, string>
     */
    public function viaQueues(): array
    {
        return [
            'broadcast' => 'broadcasts',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouveau projet soumis')
            ->greeting('Bonjour '.$notifiable->name.',')
            ->line($this->project->user->name.' a soumis un nouveau projet : « '.$this->project->title.' ».')
            ->action('Voir les projets', route('admin.projects.index'))
            ->line('Merci de faire partie de la communauté ReviewMe !');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'project_id' => $this->project->id,
            'project_slug' => $this->project->slug,
            'project_title' => $this->project->title,
            'creator_name' => $this->project->user->name,
            'message' => $this->project->user->name.' a soumis un nouveau projet : « '.$this->project->title.' ».',
        ];
    }
}
