<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $provider;
    public $medicine;
    public $quantity;
    public $orderDate;

    /**
     * Create a new message instance.
     */
    public function __construct($provider, $medicine, $quantity)
    {
        $this->provider = $provider;
        $this->medicine = $medicine;
        $this->quantity = $quantity;
        $this->orderDate = now();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Order Notification - ' . $this->medicine->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.order-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
