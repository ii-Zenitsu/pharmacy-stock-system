<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\isAdminMiddleWare;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProviderController;
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


Route::middleware(["auth:sanctum", 'verified', isAdminMiddleWare::class])->group(function(){
    Route::post("/register", [AuthController::class, 'register']);
    Route::apiResource('users', UserController::class);
    Route::apiResource("providers",ProviderController::class);
    Route::apiResource("orders",OrderController::class);
   

});

// Route::middleware(["auth:sanctum", 'verified', isEmployeMiddleWare::class])->group(function(){
    
    
// });


// admin and employe routes
Route::middleware(["auth:sanctum", 'verified', IsAdminEmployeeMiddleware::class])->group(function(){
    Route::apiResource("medicines",MedicineController::class)->except(['index', 'show']);
});

// internaute routes
Route::get("/medicines", [MedicineController::class, 'index']);
Route::get("/medicines/{id}", [MedicineController::class, 'show']);



