<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Analyse Statistique Descriptive',
                'description' => 'Analyse complète de vos données : moyennes, médianes, écarts-types, distribution des variables, détection d\'outliers. Idéal pour une première exploration de vos données.',
                'prix_indicatif' => 250.00,
            ],
            [
                'title' => 'Tests Statistiques et Inférence',
                'description' => 'Tests d\'hypothèses, tests de corrélation, ANOVA, régression linéaire. Pour valider scientifiquement vos hypothèses de recherche.',
                'prix_indicatif' => 400.00,
            ],
            [
                'title' => 'Visualisation de Données Interactive',
                'description' => 'Création de graphiques interactifs, tableaux de bord dynamiques, infographies. Rendez vos données compréhensibles et attractives.',
                'prix_indicatif' => 350.00,
            ],
            [
                'title' => 'Modélisation Prédictive',
                'description' => 'Développement de modèles de machine learning : régression, classification, clustering. Prédisez les tendances futures de votre activité.',
                'prix_indicatif' => 800.00,
            ],
            [
                'title' => 'Analyse de Séries Temporelles',
                'description' => 'Étude de l\'évolution de vos données dans le temps : tendances, saisonnalité, prévisions. Parfait pour les données économiques et financières.',
                'prix_indicatif' => 600.00,
            ],
            [
                'title' => 'Enquêtes et Sondages',
                'description' => 'Conception de questionnaires, échantillonnage, collecte et analyse des données d\'enquête. De la conception à l\'analyse finale.',
                'prix_indicatif' => 500.00,
            ],
            [
                'title' => 'Nettoyage et Préparation de Données',
                'description' => 'Nettoyage, transformation et préparation de vos datasets. Élimination des valeurs aberrantes, gestion des données manquantes.',
                'prix_indicatif' => 300.00,
            ],
            [
                'title' => 'Formation Statistiques Appliquées',
                'description' => 'Formation personnalisée en statistiques pour vos équipes. Théorie et pratique adaptées à votre secteur d\'activité.',
                'prix_indicatif' => 450.00,
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}