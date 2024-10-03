<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use App\Models\Photo;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProduct;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class ProductController extends Controller
{
    public function index()
    {
        return Product::with("category", "stocks")->paginate(5);
    }

    public function show($id)
    {
        $product = Product::with("category", "stocks")->findOrFail($id);
        if ($product->reviews()->exists()) {
            $product['review'] = $product->reviews()->avg('rating');
            $product['num_reviews'] = $product->reviews()->count();
        }
        return $product;
    }


    public function showAll()
    {
        return Product::with("category", "stocks")->paginate(20);
    }

    public function showAllSearch()
    {
        return Product::with("category", "stocks")->get();
    }





    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required',
            'description' => 'required',
            'details' => 'required',
            'price' => 'required|numeric',
            'photos.*' => 'required|image',
            'size' => 'required',
            'color' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            // Lưu sản phẩm
            $product = Product::create([
                'user_id' => auth()->id(), // Lấy user_id từ người dùng hiện tại
                'category_id' => $request->category_id,
                'brand' => $request->brand,
                'name' => $request->name,
                'description' => $request->description,
                'details' => $request->details,
                'price' => $request->price,
            ]);

            // Lưu các ảnh
            foreach ($request->file('photos') as $photo) {
                $imageName = $photo->getClientOriginalName();
                $photo->move(public_path('product/images'), $imageName);

                // Tạo bản ghi ảnh cho sản phẩm
                $product->photos()->create([
                    'path' => 'product/images/' . $imageName,
                ]);
            }

            // Lưu thông tin kho (size, color, quantity)
            Stock::create([
                'product_id' => $product->id,
                'size' => $request->size,
                'color' => $request->color,
                'quantity' => $request->quantity,
            ]);

            return response()->json([
                'message' => 'Product creation successfully!'
            ]);
        } catch (\Exception $e) {
            \Log::error('Product creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Product creation failed!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }















    public function destroy($id)
    {
        try {
            if ($user = JWTAuth::parseToken()->authenticate()) {
                $product = Product::findOrFail($id);

                if ($product->photo != null) {
                    foreach (json_decode($product->photo) as $photo) {
                        // Không xóa tệp vật lý, chỉ hiển thị thông tin tệp
                        $photoPath = 'D:\exercise18\frontend\public\img\\' . $photo;
                        // Kiểm tra xem tệp có tồn tại không, nhưng không xóa nó
                        if (!file_exists($photoPath)) {
                            return response()->json(['message' => 'File not found: ' . $photoPath], 404);
                        }
                    }
                }

                $product->delete();
                return response()->json(['message' => 'Product deleted successfully']);
            } else {
                return response()->json(['message' => 'User not authenticated'], 401);
            }
        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to delete product', 'error' => $e->getMessage()], 500);
        }
    }







    public function update(Request $request, $id)
{
    // Find the product
    $product = Product::findOrFail($id);

    // Validate input
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'brand' => 'required|string|max:255',
        'description' => 'required|string',
        'details' => 'required|string',
        'price' => 'required|numeric',
        'size' => 'required|string',
        'color' => 'required|string',
        'quantity' => 'required|integer|min:1',
    ]);

    // Update product attributes
    $product->update($validatedData);

    // Update associated stock
    $product->stocks()->update(
        ['size' => $validatedData['size'], 'color' => $validatedData['color'],'quantity' => $validatedData['quantity']]
        //['quantity' => $validatedData['quantity']]
    );

    return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
}

}
