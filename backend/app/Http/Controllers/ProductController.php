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
        return Product::with("category", "stocks")->paginate(4);
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

    // public function store(StoreProduct $request)
    // {
    //     if ($user = JWTAuth::parseToken()->authenticate()) {
    //         $validator = $request->validated();
    //         $data = null;
    //         if ($request->hasFile('photos')) {
    //             foreach ($request->file('photos') as $photo) {
    //                 $name = time() . '.' . $photo->getClientOriginalName();
    //                 $photo->move('img', $name);
    //                 $data[] = $name;
    //             }
    //         }
    //         $product = Product::create([
    //             'user_id' => $user->id,
    //             'category_id' => $request->category_id,
    //             'photo' => json_encode($data),
    //             'brand' => $request->brand,
    //             'name' => $request->name,
    //             'description' => $request->description,
    //             'details' => $request->details,
    //             'price' => $request->price,
    //         ]);
    //         Stock::create([
    //             'product_id' => $product->id,
    //             'size' => $request->size,
    //             'color' => $request->color,
    //             'quantity' => $request->quantity,
    //         ]);
    //     }
    // }


    // public function store(StoreProduct $request)
    // {
    //     // Xác thực người dùng từ JWT token
    //     $user = JWTAuth::parseToken()->authenticate();

    //     // Kiểm tra xem người dùng có tồn tại không
    //     if (!$user) {
    //         return response()->json(['error' => 'Unauthorized'], 401);
    //     }

    //     // Validate dữ liệu từ request
    //     $validator = $request->validated();

    //     // Xử lý và lưu ảnh sản phẩm
    //     $photos = [];
    //     if ($request->hasFile('photos')) {
    //         foreach ($request->file('photos') as $photo) {
    //             $name = time() . '_' . $photo->getClientOriginalName();
    //             $photo->move(public_path('images'), $name);
    //             $photos[] = $name;
    //         }
    //     }

    //     // Tạo mới sản phẩm
    //     try {
    //         $product = Product::create([
    //             'user_id' => $user->id,
    //             'category_id' => $request->category_id,
    //             'photo' => json_encode($photos),
    //             'brand' => $request->brand,
    //             'name' => $request->name,
    //             'description' => $request->description,
    //             'details' => $request->details,
    //             'price' => $request->price,
    //         ]);

    //         // Tạo mới bản ghi trong bảng Stock
    //         Stock::create([
    //             'product_id' => $product->id,
    //             'size' => $request->size,
    //             'color' => $request->color,
    //             'quantity' => $request->quantity,
    //         ]);

    //         // Trả về thông tin sản phẩm vừa tạo thành công
    //         return response()->json([
    //             'message' => 'Product created successfully',
    //             'product' => $product,
    //         ], 201);

    //     } catch (\Exception $e) {
    //         // Xử lý nếu có lỗi khi tạo sản phẩm
    //         return response()->json(['error' => $e->getMessage()], 500);
    //     }
    // }

    // public function store(Request $request)
    // {
    //     // Validate input
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'category_id' => 'required|exists:categories,id',
    //         'brand' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'details' => 'required|string',
    //         'price' => 'required|numeric',
    //         'size' => 'required|string',
    //         'color' => 'required|string',
    //         'quantity' => 'required|integer|min:1',
    //         'photos.*' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
    //     ]);

    //     $product = new Product();
    //     $product->name = $request->name;
    //     $product->slug = Str::of($request->name)->slug('-');
    //     $product->category_id = $request->category_id;
    //     $product->brand = $request->brand;
    //     $product->price = $request->price;
    //     $product->details = $request->details;
    //     $product->description = $request->description;
    //     $product->size = $request->size;
    //     $product->color = $request->color;
    //     $product->quantity = $request->quantity;
    //     $product->created_at = now();
    //     $product->created_by = Auth::id() ?? 1;

    //     $product->save();

    //     // Lưu thông tin kho hàng
    //     Stock::create([
    //         'product_id' => $product->id,
    //         'size' => $validatedData['size'],
    //         'color' => $validatedData['color'],
    //         'quantity' => $validatedData['quantity'],
    //     ]);

    //     // Lưu ảnh sản phẩm
    //     if ($request->hasFile('photos')) {
    //         foreach ($request->file('photos') as $photo) {
    //             $filename = $product->slug . '-' . uniqid() . '.' . $photo->getClientOriginalExtension();
    //             $photo->move(public_path("images/products"), $filename);
    //             $product->photos()->create(['path' => "images/products/" . $filename]);
    //         }
    //     }

    //     return response()->json([
    //         'message' => 'Product created successfully',
    //         'product' => $product,
    //     ], 201);
    // }
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




    // public function update(Request $request, $id)
    // {
    //     if ($user = JWTAuth::parseToken()->authenticate()) {
    //         // Find the product
    //         $product = Product::findOrFail($id);

    //         // Validate input
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255',
    //             'category_id' => 'required|exists:categories,id',
    //             'brand' => 'required|string|max:255',
    //             'description' => 'required|string',
    //             'details' => 'required|string',
    //             'price' => 'required|numeric',
    //             'size' => 'required|string',
    //             'color' => 'required|string',
    //             'quantity' => 'required|integer|min:1',
    //         ]);

    //         // Update product attributes
    //         $product->update($validatedData);

    //         // Update associated stock
    //         $product->stocks()->updateOrCreate(
    //             ['size' => $validatedData['size'], 'color' => $validatedData['color']],
    //             ['quantity' => $validatedData['quantity']]
    //         );
    //     } else {
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }
    //     return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
    // }



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
