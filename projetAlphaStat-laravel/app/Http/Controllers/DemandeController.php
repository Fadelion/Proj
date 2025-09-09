<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class DemandeController extends Controller
{
    /**
     * Liste des demandes
     * - Admin: toutes les demandes
     * - Client: seulement ses demandes
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Demande::with(['user:id,name,email', 'service:id,title']);

        // Si client, ne voir que ses demandes
        if ($user->role === 'client') {
            $query->where('user_id', $user->id);
        }

        // Filtrer par statut si fourni
        if ($request->has('statut') && $request->statut) {
            $query->where('statut', $request->statut);
        }

        // Pagination
        $demandes = $query->orderBy('created_at', 'desc')
                         ->paginate(15);

        return response()->json([
            'message' => 'Demandes récupérées avec succès',
            'data' => $demandes->items(),
            'meta' => [
                'current_page' => $demandes->currentPage(),
                'last_page' => $demandes->lastPage(),
                'per_page' => $demandes->perPage(),
                'total' => $demandes->total(),
            ]
        ]);
    }

    /**
     * Afficher une demande spécifique
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $query = Demande::with(['user:id,name,email', 'service:id,title,description,prix_indicatif']);

        // Si client, vérifier que c'est sa demande
        if ($user->role === 'client') {
            $query->where('user_id', $user->id);
        }

        $demande = $query->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Demande non trouvée ou accès non autorisé'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message' => 'Demande récupérée avec succès',
            'data' => $demande
        ]);
    }

    /**
     * Créer une nouvelle demande (Client authentifié)
     */
    public function store(Request $request)
    {
        // $this->authorizeAdmin($request);
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'description_projet' => 'required|string|min:10',
            'fichier_joint' => 'nullable|file|max:2048|mimes:pdf,doc,docx,png,jpg,jpeg', // 2MB max, types courants
        ]);

        // Vérifier que le service existe
        $service = Service::find($request->service_id);
        if (!$service) {
            return response()->json([
                'message' => 'Service non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        $fichierPath = null;

        // Gérer l'upload du fichier si présent
        if ($request->hasFile('fichier_joint')) {
            $file = $request->file('fichier_joint');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $fichierPath = $file->storeAs('demandes', $fileName, 'public');
        }

        $demande = Demande::create([
            'user_id' => $request->user()->id,
            'service_id' => $request->service_id,
            'description_projet' => $request->description_projet,
            'fichier_joint' => $fichierPath,
            'statut' => 'en_attente',
        ]);

        // Charger les relations pour la réponse
        $demande->load(['user:id,name,email', 'service:id,title']);

        return response()->json([
            'message' => 'Demande créée avec succès',
            'data' => $demande
        ], Response::HTTP_CREATED);
    }

    /**
     * Mettre à jour le statut d'une demande (Admin seulement)
     */
    public function updateStatus(Request $request, $id)
    {
        // $this->authorizeAdmin($request);
        // Vérifier que l'utilisateur est admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], Response::HTTP_FORBIDDEN);
        }

        $demande = Demande::with(['user:id,name,email', 'service:id,title'])->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Demande non trouvée'
            ], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'statut' => 'required|in:en_attente,en_cours,termine',
        ]);

        $demande->update([
            'statut' => $request->statut
        ]);

        return response()->json([
            'message' => 'Statut de la demande mis à jour avec succès',
            'data' => $demande
        ]);
    }

    /**
     * Supprimer une demande
     * - Admin: peut supprimer toute demande
     * - Client: peut supprimer ses demandes en statut "en_attente" seulement
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $query = Demande::query();

        // Si client, vérifier que c'est sa demande et qu'elle est en attente
        if ($user->role === 'client') {
            $query->where('user_id', $user->id)->where('statut', 'en_attente');
        }

        $demande = $query->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Demande non trouvée ou suppression non autorisée'
            ], Response::HTTP_NOT_FOUND);
        }

        // Supprimer le fichier s'il existe
        if ($demande->fichier_joint) {
            Storage::disk('public')->delete($demande->fichier_joint);
        }

        $demande->delete();

        return response()->json([
            'message' => 'Demande supprimée avec succès'
        ]);
    }

    /**
     * Obtenir les statistiques des demandes (Admin seulement)
     */
    public function getStats(Request $request)
    {
        // Vérifier que l'utilisateur est admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], Response::HTTP_FORBIDDEN);
        }

        $stats = [
            'total_demandes' => Demande::count(),
            'demandes_en_attente' => Demande::where('statut', 'en_attente')->count(),
            'demandes_en_cours' => Demande::where('statut', 'en_cours')->count(),
            'demandes_terminees' => Demande::where('statut', 'termine')->count(),
            'demandes_par_service' => Service::withCount('demandes')->get()->map(function ($service) {
                return [
                    'service' => $service->title,
                    'nombre_demandes' => $service->demandes_count,
                ];
            }),
        ];

        return response()->json([
            'message' => 'Statistiques récupérées avec succès',
            'data' => $stats
        ]);
    }
}