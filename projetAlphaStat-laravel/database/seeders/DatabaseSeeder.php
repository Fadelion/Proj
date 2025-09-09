<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ordre important : respecter les dépendances
        $this->call([
            UsersTableSeeder::class,
            ServiceTableSeeder::class,
            DemandeTableSeeder::class,
        ]);

        $this->command->info('🎉 Base de données AlphaStat peuplée avec succès !');
        $this->command->info('📊 Services créés : 8');
        $this->command->info('👥 Utilisateurs créés : 6 (2 admins + 4 clients)');
        $this->command->info('📝 Demandes créées : 4');
        $this->command->info('');
        $this->command->info('🔑 Comptes de test :');
        $this->command->info('Admin : admin@alphastat.com / password123');
        $this->command->info('Client : marie.dupont@email.com / password123');
    }
}