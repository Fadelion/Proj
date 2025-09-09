<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'AlphaStat API',
        'version' => '1.0.0',
        'status' => 'active',
        'documentation' => url('/docs')
    ]);
});

Route::get('/docs', function () {
    return response()->json([
        'message' => 'API Documentation - AlphaStat',
        'base_url' => url('/api'),
        'endpoints' => [
            'Authentication' => [
                'POST /api/auth/register' => 'Inscription utilisateur',
                'POST /api/auth/login' => 'Connexion utilisateur',
                'POST /api/auth/logout' => 'Déconnexion (JWT requis)',
                'GET /api/auth/me' => 'Profile utilisateur (JWT requis)',
                'POST /api/auth/refresh' => 'Rafraîchir token JWT'
            ]
        ]
    ]);
});