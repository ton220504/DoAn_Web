<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Stock;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductWishlistController extends Controller
{
    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if ($user) {
            $wishlist = Wishlist::where('user_id', $user->id)
                ->with('product.stocks')
                ->orderBy('id', 'desc')
                ->paginate(5);
            foreach ($wishlist as $item) {
                foreach ($item->product->stocks as $stock) {
                    if ($stock['quantity'] > 0) {
                        $item['stock'] = true;
                        break;
                    }
                }
                unset($item->product->stocks);
            }
            return $wishlist;
        }
        return [];
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if ($user) {
            $product = Wishlist::where('user_id', $user->id)
                ->where('product_id', $request->productId)
                ->first();
            if ($product === null) {
                Wishlist::create([
                    'user_id' => $user->id,
                    'product_id' => $request->productId
                ]);
            } else {
                abort(405);
            }
            return $user->wishlistProducts()->count();
        }
        return 0;
    }

    public function destroy($id)
    {
        // $user = JWTAuth::parseToken()->authenticate();
        // if ($user) {
        //     $item = $user->wishlistProducts()->findOrFail($id);
        //     if ($item)
        //         $item->delete();
        // }
        // return $user->wishlistProducts()->count();
        try {
            $WishListItem = Wishlist::find($id);

            if (!$WishListItem) {
                return response()->json(['error' => 'Item not found'], 404);
            }

            $WishListItem->delete();

            return response()->json(['message' => 'Item deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function count(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        //return $user->wishlistProducts()->count();
        return $user->wishlistProducts()->pluck('product_id')->toArray();
    }
}
