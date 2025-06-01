<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #17230f;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4fce5;
        }
        .header {
            background: linear-gradient(135deg, #67ad6e, #338e6f);
            color: white;
            padding: 25px 20px;
            text-align: center;
            border-radius: 12px 12px 0 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header img {
            width: 50px;
            height: 50px;
            margin-bottom: 10px;
            border-radius: 8px;
            background-color: white;
            padding: 8px;
        }
        .content {
            background-color: white;
            padding: 25px;
            border: 1px solid #e1edbb;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .order-details {
            background-color: #f4fce5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 5px solid #67ad6e;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .detail-row {
            padding: 4px 0;
            border-bottom: 1px solid #585858;
        }
        .detail-label {
            font-weight: 600;
            color: #17230f;
        }
        .footer {
            background: linear-gradient(135deg, #17230f, #338e6f);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 12px 12px;
            font-size: 12px;
        }
        .medicine-highlight {
            background: linear-gradient(135deg, #d5f796, #e1edbb);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid #67ad6e;
            box-shadow: 0 4px 15px rgba(103, 173, 110, 0.2);
        }
        .quantity-highlight {
            background: linear-gradient(135deg, #ffbe00, #d3b32f);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            text-align: center;
            margin: 15px 0;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(32, 184, 171, 0.3);
        }
        .action-required {
            background: linear-gradient(135deg, #f7cf57, #ffbe00);
            border: none;
            color: #000000;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(32, 184, 171, 0.2);
        }
        .action-required h4 {
            color: white;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .action-required p {
            margin: 0;
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ asset('storage/images/pharmawise-logo.png') }}" alt="PharmaWISE Logo">
        <h1>New Order Notification</h1>
        <p>PharmaWISE Management System</p>
    </div>

    <div class="content">
        <h2 style="color: #338e6f;">Hello {{ $provider->name }},</h2>
        
        <p>You have received a new order through our PharmaWISE system. Please review the details below:</p>

        <div class="medicine-highlight">
            <h3 style="color: #338e6f; margin: 0;">Order Details</h3>
            
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <strong style="font-size: 22px; color: #338e6f;">{{ $medicine->name }}</strong>
            </div>
            
            @if($medicine->formulation)
            <div class="detail-row">
                <span class="detail-label">Formulation:</span>
                <strong style="font-size: 22px; color: #338e6f;">{{ ucfirst($medicine->formulation) }}</strong>
            </div>
            @endif
            
            <div class="detail-row">
                <span class="detail-label">Requested Quantity:</span>
                <strong style="font-size: 22px; color: #338e6f;">{{ $quantity }}</strong> units
            </div>
        </div>

        <div class="order-details">
            <h3 style="color: #338e6f; margin-top: 0;">Order Information</h3>
            
            <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                {{ $orderDate->format('F j, Y \a\t g:i A') }}
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Provider:</span>
                {{ $provider->name }}
            </div>
        </div>

        <div class="action-required">
            <h4 style="color: black;">⚠️ Action Required</h4>
            <p style="color: black;">
                Please confirm the availability of this medicine and respond with your delivery timeline. 
                If you cannot fulfill this order, please contact us as soon as possible.
            </p>
        </div>

        <p>Thank you for your partnership with PharmaWISE. If you have any questions about this order, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 30px; color: #338e6f;">
            Best regards,<br>
            <strong>PharmaWISE Team</strong>
        </p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} PharmaWISE. All rights reserved.</p>
        <p>This is an automated message from our order management system.</p>
    </div>
</body>
</html>
