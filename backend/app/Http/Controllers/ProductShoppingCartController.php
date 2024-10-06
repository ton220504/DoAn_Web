<?php

namespace App\Http\Controllers;


use App\Models\User;
use App\Models\Stock;
use App\Models\Product;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductShoppingCartController extends Controller
{

    public function index()
    {
        // return ShoppingCart::all();
        $user = JWTAuth::parseToken()->authenticate(); // Lấy thông tin người dùng từ token
        $cartItems = ShoppingCart::where('user_id', $user->id)->get(); // Lấy giỏ hàng của người dùng
        return response()->json($cartItems);
    }

    public function getAllShoppingCart()
    {
        return shoppingCart::with('user', 'stock')->get();
    }


    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // Kiểm tra nếu có danh sách giỏ hàng từ phía client
        if ($request->localCartList) {
            $cartList = json_decode($request->localCartList, true);

            foreach ($cartList as $cartArrayList) {
                foreach ($cartArrayList as $cartItem) {
                    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng
                    $item = $user->cartItems()
                        ->where('stock_id', $cartItem['stock_id'])
                        ->where('photo', $cartItem['photo']) // Kiểm tra hình ảnh
                        ->first();

                    // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
                    if (!$item) {
                        ShoppingCart::create([
                            'user_id' => $user->id,
                            'stock_id' => $cartItem['stock_id'],
                            'quantity' => $cartItem['quantity'],
                            'name' => $cartItem['name'], // Thêm tên sản phẩm
                            'price' => $cartItem['price'], // Thêm giá sản phẩm
                            'photo' => $cartItem['photo'] // Thêm URL hình ảnh sản phẩm
                        ]);
                    } else {
                        // Nếu đã có trong giỏ hàng với hình ảnh giống, cập nhật số lượng
                        $item->increment('quantity', $cartItem['quantity']);
                    }
                }
            }
        } else {
            // Nếu không có danh sách giỏ hàng, thêm sản phẩm một cách đơn lẻ
            $item = $user->cartItems()
                ->where('stock_id', $request->stockId)
                ->where('photo', $request->photo) // Kiểm tra hình ảnh
                ->first();

            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            if (!$item) {
                ShoppingCart::create([
                    'user_id' => $user->id,
                    'stock_id' => $request->stockId,
                    'quantity' => $request->quantity,
                    'name' => $request->name, // Thêm tên sản phẩm
                    'price' => $request->price, // Thêm giá sản phẩm
                    'photo' => $request->photo // Thêm URL hình ảnh sản phẩm
                ]);
            } else {
                // Nếu sản phẩm đã có nhưng hình ảnh khác, tạo bản ghi mới
                if ($item->photo !== $request->photo) {
                    ShoppingCart::create([
                        'user_id' => $user->id,
                        'stock_id' => $request->stockId,
                        'quantity' => $request->quantity,
                        'name' => $request->name, // Thêm tên sản phẩm
                        'price' => $request->price, // Thêm giá sản phẩm
                        'photo' => $request->photo // Thêm URL hình ảnh sản phẩm
                    ]);
                } else {
                    // Nếu sản phẩm đã có và hình ảnh giống nhau, cập nhật số lượng
                    $stock = Stock::findOrFail($request->stockId);
                    if (($item->quantity + $request->quantity) <= $stock->quantity) {
                        $item->increment('quantity', $request->quantity);
                    } else {
                        $item->update(['quantity' => $stock->quantity]);
                    }
                }
            }

            return $user->cartItems()->count(); // Trả về số lượng sản phẩm trong giỏ hàng
        }
    }



    public function guestCart(Request $request)
    {

        $cartList = json_decode($request['cartList'], true);

        $data = [];
        $count = 1;
        foreach ($cartList as $cartArrayList) {
            foreach ($cartArrayList as $cartItem) {
                if ($cartItem['stock_id'] != null || $cartItem['quantity'] != null) {

                    $stock = null;
                    if ($cartItem['stock_id'] != null) {
                        $stock = Stock::with('product')->where('id', $cartItem['stock_id'])->first();
                    }

                    $data[] = ['id' => $count, 'stock_id' => $cartItem['stock_id'], 'quantity' => $cartItem['quantity'], 'stock' => $stock];
                    $count++;
                }
            }
        }

        return $data;
    }

    public function update(Request $request, $id)
    {

        $cartItem = ShoppingCart::with('stock')->where('id', $id)->get();

        $stockQty = $cartItem->pluck('stock.quantity')->pop();

        if ($request->quantity <= $stockQty && $request->quantity > 0)
            ShoppingCart::where('id', $id)->update(['quantity' => $request->quantity]);
    }

    public function destroy($id)
    {
        try {
            $cartItem = ShoppingCart::find($id);

            if (!$cartItem) {
                return response()->json(['error' => 'Item not found'], 404);
            }

            $cartItem->delete();

            return response()->json(['message' => 'Item deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

     // Hàm xóa sản phẩm đã chọn trong giỏ hàng
     public function clearSelected(Request $request)
    {
        $userId = $request->input('user_id');
        $cartIds = $request->input('cart_ids'); // Thay đổi từ stock_ids thành cart_ids

        // Kiểm tra xem các sản phẩm có tồn tại trong giỏ hàng không
        $cartItems = ShoppingCart::where('user_id', $userId)->whereIn('id', $cartIds)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        // Xóa các sản phẩm trong giỏ hàng
        ShoppingCart::where('user_id', $userId)->whereIn('id', $cartIds)->delete();

        return response()->json(['message' => 'Giỏ hàng đã được xóa thành công!'], 200);
    }



    public function cartCount(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        return $user->cartItems()->pluck('stock_id')->toArray();

    }
}
