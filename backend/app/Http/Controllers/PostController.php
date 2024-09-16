<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Phương thức index để hiển thị danh sách bài viết
    public function index()
    {
        $post = Post::all();
        return response()->json($post);
    }

    // Phương thức show để hiển thị một bài viết cụ thể
    public function show($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post);
    }
}
