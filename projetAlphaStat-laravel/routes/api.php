<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DemandeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ============================================
// ROUTES PUBLIQUES (sans authentification)
// ============================================

// Authentification
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Services (consultation publique)
Route::get('services', [ServiceController::class, 'index']);
Route::get('services/{service}', [ServiceController::class, 'show']);

// ============================================
// ROUTES PROTÉGÉES (authentification JWT requise)
// ============================================

Route::middleware('jwt.auth')->group(function () {
    
    // Authentification - Profil utilisateur
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
    
    // Demandes - Routes pour les clients
    Route::prefix('demandes')->group(function () {
        Route::get('/', [DemandeController::class, 'index']); // Liste selon rôle
        Route::post('/', [DemandeController::class, 'store']); // Créer demande
        Route::get('{demande}', [DemandeController::class, 'show']); // Détails demande
        Route::delete('{demande}', [DemandeController::class, 'destroy']); // Supprimer (avec règles)
    });
    
    // ============================================
    // ROUTES ADMIN UNIQUEMENT
    // ============================================
    
    Route::middleware('admin')->prefix('admin')->group(function () {
        
        // Services - Gestion complète (Admin)
        Route::prefix('services')->group(function () {
            Route::post('/', [ServiceController::class, 'store']); // Créer service
            Route::put('{service}', [ServiceController::class, 'update']); // Modifier service
            Route::delete('{service}', [ServiceController::class, 'destroy']); // Supprimer service
        });
        
        // Demandes - Gestion Admin
        Route::prefix('demandes')->group(function () {
            Route::put('{demande}/status', [DemandeController::class, 'updateStatus']); // Changer statut
            Route::get('stats', [DemandeController::class, 'getStats']); // Statistiques admin
        });
        
    });
    
});

// ============================================
// ROUTE FALLBACK POUR API
// ============================================

Route::fallback(function () {
   return response()->json([
        'success' => false,
        'message' => 'Route API non trouvée'
    ], 404);
});