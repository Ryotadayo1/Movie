<?php

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LikeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// 全レビュー取得
Route::get('reviews', [ReviewController::class, 'index']);

// レビュー投稿（認証）
Route::middleware('auth:sanctum')->post('reviews', [ReviewController::class, 'store']);

// レビュー削除（認証）✅ 修正済み
Route::middleware('auth:sanctum')->delete('/reviews/{review}', [ReviewController::class, 'destroy']);

// ✅ レビュー更新（編集）を追加（認証）
Route::middleware('auth:sanctum')->put('/reviews/{id}', [ReviewController::class, 'update']);

// いいね一覧取得（認証）
Route::middleware('auth:sanctum')->get('/likes', [LikeController::class, 'index']);

// いいね追加・削除（認証）
Route::middleware('auth:sanctum')->post('/likes', [LikeController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/likes/{movie_id}', [LikeController::class, 'destroy']);
