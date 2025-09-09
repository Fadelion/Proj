<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrateur principal
        User::updateOrCreate(
            ['email' => 'admin@alphastat.com'], // CRITÈRE DE RECHERCHE
            [                                   // DONNÉES À CRÉER/METTRE À JOUR
                'name' => 'Admin Principal',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'telephone' => '+226 71 59 19 94',
                'entreprise' => 'AlphaStat SARL',
                'secteur_activite' => 'Conseil statistique',
            ]
        );

        // Clients de test
        User::updateOrCreate(
            ['email' => 'marie.dupont@email.com'],
            [
                'name' => 'Marie Dupont',
                'password' => Hash::make('password123'),
                'role' => 'client',
                'telephone' => '+33 6 12 34 56 78',
                'entreprise' => 'Tech Innovate',
                'secteur_activite' => 'Technologie',
            ]
        );

        User::updateOrCreate(
            ['email' => 'ramde.martin@universite.edu'],
            [
                'name' => 'Ramdé Martin',
                'password' => Hash::make('password123'),
                'role' => 'client',
                'telephone' => '+226 74 25 00 32',
                'entreprise' => 'Université Joseph Ki Zerbo',
                'secteur_activite' => 'Recherche académique',
            ]
        );

        User::updateOrCreate(
            ['email' => 'sophie.laurent@pharma.com'],
            [
                'name' => 'Sophie Laurent',
                'password' => Hash::make('password123'),
                'role' => 'client',
                'telephone' => '+33 6 11 22 33 44',
                'entreprise' => 'BioPharm Solutions',
                'secteur_activite' => 'Pharmacie',
            ]
        );

        User::updateOrCreate(
            ['email' => 'kabore.soum@startup.io'],
            [
                'name' => 'Kaboré Soumaïla',
                'password' => Hash::make('password123'),
                'role' => 'client',
                'telephone' => '+226 64 55 42 17',
                'entreprise' => 'DataStart',
                'secteur_activite' => 'Startup',
            ]
        );

        // Administrateur secondaire
        User::updateOrCreate(
            ['email' => 'alice.kouadio@alphastat.com'],
            [
                'name' => 'Alice Kouadio',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'telephone' => '+225 07 85 10 23 15',
                'entreprise' => 'AlphaStat SARL',
                'secteur_activite' => 'Conseil statistique',
            ]
        );
    }
}