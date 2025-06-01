<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Verify Your PharmaWISE Account')
                ->greeting('Hello ' . $notifiable->first_name . '!')
                ->line('Welcome to PharmaWISE! Please verify your email address to complete your account setup.')
                ->line('Click the button below to verify your email address.')
                ->action('Verify Email Address', $url)
                ->line('If you did not create an account with PharmaWISE, no further action is required.')
                ->salutation('Best regards, The PharmaWISE Team');
        });
    }
}