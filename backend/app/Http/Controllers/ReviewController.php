<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * レビュー一覧取得（movie_id 指定で絞り込み）
     */
    public function index(Request $request)
    {
        $query = Review::with('user');

        // movie_id がある場合は絞り込み
        if ($request->has('movie_id')) {
            $query->where('movie_id', $request->query('movie_id'));
        }

        $reviews = $query->get();

        return response()->json($reviews);
    }

    /**
     * レビュー投稿（保存）
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id'    => 'required|integer',
            'review_text' => 'required|string|max:1000',
            'rating'      => 'required|integer|min:1|max:5',
        ]);

        $review = new Review();
        $review->user_id     = Auth::id();
        $review->movie_id    = $validated['movie_id'];
        $review->review_text = $validated['review_text'];
        $review->rating      = $validated['rating'];
        $review->save();

        return response()->json(['message' => 'レビューを投稿しました', 'review' => $review], 201);
    }

    /**
     * レビュー更新（編集）
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'review_text' => 'required|string|max:1000',
                'rating'      => 'required|integer|min:1|max:5',
            ]);

            $review = Review::findOrFail($id);

            if ($review->user_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $review->review_text = $validated['review_text'];
            $review->rating      = $validated['rating'];
            $review->save();

            $reviewWithUser = Review::with('user')->find($review->id);

            return response()->json([
                'message' => 'レビューを更新しました',
                'review'  => $reviewWithUser,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * レビュー削除（認証付き）
     */
    public function destroy(Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'レビューを削除しました']);
    }
}
