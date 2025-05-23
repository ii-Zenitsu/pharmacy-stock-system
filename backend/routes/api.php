<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\isAdminMiddleWare;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\StockController; // Added import
use App\Http\Middleware\isEmployeMiddleWare;
use App\Http\Middleware\AlreadyLoggedInMiddleware;
use App\Http\Middleware\IsAdminEmployeeMiddleware;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::middleware(AlreadyLoggedInMiddleware::class)->group(function(){
    Route::post("/login", [AuthController::class, 'login']);
});

Route::middleware("auth:sanctum")->controller(AuthController::class)->group(function(){
    Route::get("user", "getUser");
    Route::post("logout", "logout");
});

// Email verification routes
Route::get('/email/verify', function () {
    return response()->json(['message' => 'Email verification required.'], 403);
})->middleware(['auth:sanctum'])->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email verified successfully.']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::post('/email/resend', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification email sent.']);
})->middleware(['auth:sanctum', 'signed', 'throttle:6,1'])->name('verification.resend');


Route::middleware(["auth:sanctum", 'verified'])->group(function(){
    // Admin specific routes
    Route::middleware([isAdminMiddleWare::class])->group(function(){
        Route::post("/register", [AuthController::class, 'register']);
        Route::apiResource('users', UserController::class);
        Route::apiResource("medicines",MedicineController::class)->except(['index', 'show']);
        Route::apiResource("locations",LocationController::class)->except(['index', 'show']);
        Route::apiResource("providers",ProviderController::class);
        Route::apiResource("orders",OrderController::class);
        Route::put("/stock/{id}", [StockController::class, 'update']);
        Route::delete("/stock/{id}", [StockController::class, 'destroy']);
    });

    // Admin or Employee routes
    Route::middleware([IsAdminEmployeeMiddleware::class])->group(function(){
        Route::get("/medicines", [MedicineController::class, 'index']);
        Route::get("/medicines/{id}", [MedicineController::class, 'show']);
        Route::get("/locations", [LocationController::class, 'index']);
        Route::get("/locations/{id}", [LocationController::class, 'show']);
        Route::get("/stock", [StockController::class, 'index']);
        Route::get("/stock/{id}", [StockController::class, 'show']);
        Route::post("/stock", [StockController::class, 'store']);
        Route::post("/stock/batch-adjust/{id}", [StockController::class, 'adjustBatchQuantity']);
    });
});


// Public routes
Route::get("/public/medicines", [MedicineController::class, 'index']);
Route::get("/public/medicines/{id}", [MedicineController::class, 'show']);
