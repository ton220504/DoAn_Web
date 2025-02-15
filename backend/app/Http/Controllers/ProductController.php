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
        // Validate các dữ liệu đầu vào
        $request->validate([
            'name' => 'required',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required',
            'description' => 'required',
            'details' => 'required',
            'price' => 'required|numeric',
            'photo' => 'required|array', // Kiểm tra nếu photo là mảng
            'photo.*' => 'string', // Kiểm tra từng phần tử của mảng là chuỗi
        ]);

        try {
            // Mảng để lưu tên của từng ảnh
            $photoNames = [];

            // Lưu tên của các ảnh từ request vào mảng
            if ($request->has('photo')) {
                $photoNames = $request->input('photo'); // Giả định rằng tên file được gửi dưới dạng mảng
            }

            // Đường dẫn tới thư mục img trong frontend
            $path = 'C:/Users/ACER_HANG/Desktop/DO_AN_TTTN/frontend/public/img'; // Đường dẫn đến thư mục img trong frontend

            // Kiểm tra nếu thư mục không tồn tại, tạo nó
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            // Lưu ảnh vào thư mục
            foreach ($photoNames as $photoName) {
                // Đường dẫn nguồn (nơi mà bạn đã tải ảnh về)
                // Bạn có thể điều chỉnh đường dẫn này theo ý bạn
                //$sourcePath = "D:/java-projects/example14/public/images/{$photoName}"; // Thay đổi thành đường dẫn chính xác của bạn
                $sourcePath = "D:/img/{$photoName}";
                // Đường dẫn đích
                $destinationPath = $path . '/' . $photoName;

                // Kiểm tra nếu ảnh đã tồn tại
                if (!file_exists($destinationPath)) {
                    // Di chuyển hoặc sao chép ảnh vào thư mục đích
                    if (file_exists($sourcePath)) {
                        // Sử dụng copy() để sao chép
                        copy($sourcePath, $destinationPath);
                        // Nếu bạn muốn di chuyển thay vì sao chép, sử dụng rename()
                        // rename($sourcePath, $destinationPath);
                    }
                } else {
                    // Log hoặc xử lý khi file đã tồn tại
                    \Log::info("File {$photoName} đã tồn tại, không cần sao chép.");
                }
            }

            // Chuyển đổi mảng tên ảnh thành chuỗi JSON
            $photoJson = json_encode($photoNames);

            // Lưu sản phẩm
            $product = Product::create([
                'user_id' => $request->user_id ?? 1,
                'deal_id' => $request->deal_id ?? null,
                'category_id' => $request->category_id,
                'brand' => $request->brand,
                'name' => $request->name,
                'description' => $request->description,
                'details' => $request->details,
                'price' => $request->price,
                'photo' => $photoJson, // Lưu tên ảnh dưới dạng JSON
            ]);

            return response()->json([
                'message' => 'Product created successfully!',
                'product' => $product
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
                        $photoPath = 'C:\Users\ACER_HANG\Desktop\DO_AN_TTTN\frontend\public\img\\' . $photo;
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
        // Tìm sản phẩm
        $product = Product::findOrFail($id);

        // Xác thực dữ liệu đầu vào
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required|string|max:255',
            'description' => 'required|string',
            'details' => 'required|string',
            'price' => 'required|numeric',
            'photo' => 'array', // Kiểm tra nếu photo là mảng
            'photo.*' => 'string', // Kiểm tra từng phần tử của mảng là chuỗi
        ]);

        // Mảng để lưu tên của từng ảnh
        $photoNames = [];

        // Lưu tên của các ảnh từ request vào mảng
        if ($request->has('photo')) {
            $photoNames = $request->input('photo'); // Giả định rằng tên file được gửi dưới dạng mảng
        }

        // Đường dẫn tới thư mục img trong frontend
        $path = 'C:/Users/ACER_HANG/Desktop/DO_AN_TTTN/frontend/public/img'; // Đường dẫn đến thư mục img trong frontend

        // Kiểm tra nếu thư mục không tồn tại, tạo nó
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        // Xử lý cập nhật ảnh
        if (!empty($photoNames)) {
            // Lấy ảnh cũ
            $currentPhotos = json_decode($product->photo, true) ?: []; // Chuyển đổi từ JSON thành mảng hoặc khởi tạo mảng rỗng

            foreach ($photoNames as $photoName) {
                // Đường dẫn nguồn (nơi mà bạn đã tải ảnh về)
                // Bạn có thể điều chỉnh đường dẫn này theo ý bạn
                $sourcePath = "D:/img/{$photoName}"; // Thay đổi thành đường dẫn chính xác của bạn

                // Đường dẫn đích
                $destinationPath = $path . '/' . $photoName;

                // Kiểm tra nếu ảnh đã tồn tại
                if (!file_exists($destinationPath)) {
                    // Di chuyển hoặc sao chép ảnh vào thư mục đích
                    if (file_exists($sourcePath)) {
                        // Sử dụng copy() để sao chép
                        copy($sourcePath, $destinationPath);
                    }
                } else {
                    // Log hoặc xử lý khi file đã tồn tại
                    \Log::info("File {$photoName} đã tồn tại, không cần sao chép.");
                }
            }

            // Cập nhật tên ảnh mới vào thuộc tính photo của sản phẩm
            $updatedPhotos = array_merge($currentPhotos, $photoNames); // Kết hợp ảnh cũ với ảnh mới
            $product->photo = json_encode($updatedPhotos); // Chuyển đổi lại thành JSON
        }

        // Cập nhật các thuộc tính sản phẩm khác
        $product->update($validatedData);

        return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
    }


}
