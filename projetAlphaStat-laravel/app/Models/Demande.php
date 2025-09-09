<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'service_id',
        'description_projet',
        'fichier_joint',
        'statut',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Les valeurs par défaut des attributs
     */
    protected $attributes = [
        'statut' => 'en_attente',
    ];

    /**
     * Relation : Une demande appartient à un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Une demande appartient à un service
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('statut', $status);
    }

    /**
     * Scope pour les demandes d'un utilisateur
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Accessor pour formater le statut
     */
    public function getStatutFormatteAttribute()
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            default => $this->statut
        };
    }
}