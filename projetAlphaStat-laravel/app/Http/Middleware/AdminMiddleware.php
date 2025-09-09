<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier que l'utilisateur est authentifié
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Non authentifié'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Vérifier que l'utilisateur est admin
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès non autorisé. Droits administrateur requis.'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}