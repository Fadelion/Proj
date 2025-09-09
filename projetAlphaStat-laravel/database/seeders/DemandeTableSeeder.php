<?php

namespace Database\Seeders;

use App\Models\Demande;
use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Seeder;

class DemandeTableSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les clients et services
        $clients = User::where('role', 'client')->get();
        $services = Service::all();

        $demandes = [
            [
                'user_id' => $clients->where('email', 'marie.dupont@email.com')->first()->id,
                'service_id' => $services->where('title', 'Analyse Statistique Descriptive')->first()->id,
                'description_projet' => 'J\'aimerais analyser les données de satisfaction client de notre application mobile. Nous avons collecté environ 2000 réponses sur les 6 derniers mois.',
                'statut' => 'en_cours',
                'fichier_joint' => null,
            ],
            [
                'user_id' => $clients->where('email', 'ramde.martin@universite.edu')->first()->id,
                'service_id' => $services->where('title', 'Tests Statistiques et Inférence')->first()->id,
                'description_projet' => 'Dans le cadre de ma thèse, j\'ai besoin de tests statistiques pour valider mes hypothèses. Population étudiée : 300 étudiants.',
                'statut' => 'en_attente',
                'fichier_joint' => null,
            ],
            [
                'user_id' => $clients->where('email', 'sophie.laurent@pharma.com')->first()->id,
                'service_id' => $services->where('title', 'Modélisation Prédictive')->first()->id,
                'description_projet' => 'Développement d\'un modèle prédictif pour anticiper l\'efficacité de nouveaux composés pharmaceutiques.',
                'statut' => 'termine',
                'fichier_joint' => null,
            ],
            [
                'user_id' => $clients->where('email', 'kabore.soum@startup.io')->first()->id,
                'service_id' => $services->where('title', 'Visualisation de Données Interactive')->first()->id,
                'description_projet' => 'Création d\'un tableau de bord interactif pour suivre les KPIs de notre startup.',
                'statut' => 'en_cours',
                'fichier_joint' => null,
            ],
        ];

        foreach ($demandes as $demandeData) {
            Demande::create($demandeData);
        }
    }
}