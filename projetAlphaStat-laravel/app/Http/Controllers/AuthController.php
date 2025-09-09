<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'telephone' => 'nullable|string|max:20',
            'entreprise' => 'nullable|string|max:255',
            'secteur_activite' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client', // Par défaut
            'telephone' => $request->telephone,
            'entreprise' => $request->entreprise,
            'secteur_activite' => $request->secteur_activite,
        ]);

        // Créer le token JWT
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'telephone' => $user->telephone,
                'entreprise' => $user->entreprise,
                'secteur_activite' => $user->secteur_activite,
            ],
            'token' => $token,
        ], Response::HTTP_CREATED);
    }

    /**
     * Connexion utilisateur
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'message' => 'Les informations de connexion sont incorrectes.'
                ], Response::HTTP_UNAUTHORIZED);
            }
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Impossible de créer le token'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $user = auth()->user();

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'telephone' => $user->telephone,
                'entreprise' => $user->entreprise,
                'secteur_activite' => $user->secteur_activite,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Déconnexion utilisateur
     */
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            
            return response()->json([
                'message' => 'Déconnexion réussie'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Impossible de se déconnecter'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
                'telephone' => $request->user()->telephone,
                'entreprise' => $request->user()->entreprise,
                'secteur_activite' => $request->user()->secteur_activite,
                'created_at' => $request->user()->created_at,
            ]
        ]);
    }

    /**
     * Rafraîchir le token JWT
     */
    public function refresh()
    {
        try {
            $newToken = JWTAuth::refresh(JWTAuth::getToken());
            
            return response()->json([
                'message' => 'Token rafraîchi avec succès',
                'token' => $newToken
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Impossible de rafraîchir le token'
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
}