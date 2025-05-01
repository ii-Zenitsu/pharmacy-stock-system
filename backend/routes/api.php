<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\isAdminMiddleWare;
use App\Http\Controllers\MedicineController;
use App\Http\Middleware\isEmployeMiddleWare;
use App\Http\Middleware\AlreadyLoggedInMiddleware;
use App\Http\Middleware\IsAdminEmployeeMiddleware;

Route::middleware(AlreadyLoggedInMiddleware::class)->group(function(){
    Route::post("/login", [AuthController::class, 'login']);
});

Route::middleware("auth:sanctum")->controller(AuthController::class)->group(function(){
    Route::get("user", "getUser");
    Route::post("logout", "logout");
});

Route::middleware(isAdminMiddleWare::class)->group(function(){
    Route::post("/register", [AuthController::class, 'register']);
    Route::apiResource('users', UserController::class);
});

// Route::middleware(isEmployeMiddleWare::class)->group(function(){
    
    
// });


// admin and employe routes
Route::middleware(IsAdminEmployeeMiddleware::class)->group(function(){
    Route::apiResource("medicines",MedicineController::class)->except(['index', 'show']);
});

// internaute routes
Route::get("/medicines", [MedicineController::class, 'index']);
Route::get("/medicines/{id}", [MedicineController::class, 'show']);