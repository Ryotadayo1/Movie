<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    /**
     * ログインユーザーの「いいね」一覧取得
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json($user->likes);
    }

    /**
     * 映画に「いいね」追加
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|integer',
        ]);

        $like = Like::firstOrCreate([
            'user_id' => Auth::id(),
            'movie_id' => $validated['movie_id'],
        ]);

        return response()->json(['message' => 'いいねしました', 'like' => $like], 201);
    }

    /**
     * 映画の「いいね」削除
     */
    public function destroy($movie_id)
    {
        $user = Auth::user();

        $like = Like::where('user_id', $user->id)
            ->where('movie_id', $movie_id)
            ->first();

        if ($like) {
            $like->delete();
            return response()->json(['message' => 'いいねを解除しました']);
        }

        return response()->json(['message' => 'いいねが見つかりません'], 404);
    }
}
