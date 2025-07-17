<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    // 保存可能なカラムを指定
    protected $fillable = [
        'user_id',
        'movie_id',
        'review_text',
        'rating',
    ];

    // User モデルとのリレーション
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
