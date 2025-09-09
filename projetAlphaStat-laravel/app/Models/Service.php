<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'description', 
        'prix_indicatif'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'prix_indicatif' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation : Un service peut avoir plusieurs demandes
     */
    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }

    /**
     * Scope pour rechercher par mot-clé
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('title', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%');
    }
}