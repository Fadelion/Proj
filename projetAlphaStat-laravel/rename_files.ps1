# Script pour renommer les fichiers selon la convention PSR-4

# 1. Renommer les seeders
Rename-Item -Path ".\database\seeders\demandeTableSeeder.php" -NewName "DemandeTableSeeder.php" -Force
Rename-Item -Path ".\database\seeders\serviceTableSeeder.php" -NewName "ServiceTableSeeder.php" -Force
Rename-Item -Path ".\database\seeders\usersTableSeeder.php" -NewName "UsersTableSeeder.php" -Force

# 2. Renommer les modèles
Rename-Item -Path ".\app\Models\demande.php" -NewName "Demande.php" -Force
Rename-Item -Path ".\app\Models\service.php" -NewName "Service.php" -Force

# 3. Renommer le fichier Kernel
Rename-Item -Path ".\app\Http\kernel.php" -NewName "Kernel.php" -Force

Write-Host "Les fichiers ont été renommés avec succès selon la convention PSR-4."
