<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ServiceController extends Controller
{
    /**
     * Liste tous les services (public)
     */
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $services = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'message' => 'Services récupérés avec succès',
            'data' => $services->items(),
            'meta' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ]
        ]);
    }

    /**
     * Afficher un service spécifique (public)
     */
    public function show($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message' => 'Service récupéré avec succès',
            'data' => $service
        ]);
    }

    /**
     * Créer un service (Admin seulement)
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'prix_indicatif' => 'required|numeric|min:0',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service créé avec succès',
            'data' => $service
        ], Response::HTTP_CREATED);
    }

    /**
     * Mettre à jour un service (Admin seulement)
     */
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'prix_indicatif' => 'sometimes|numeric|min:0',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service mis à jour avec succès',
            'data' => $service
        ]);
    }

    /**
     * Supprimer un service (Admin seulement)
     */
    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service supprimé avec succès']);
    }

    /**
     * Vérification admin
     */
    protected function authorizeAdmin(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(403, 'Accès non autorisé');
        }
    }
}
