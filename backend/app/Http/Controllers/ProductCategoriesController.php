<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Review;
use Illuminate\Http\Request;

class ProductCategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Category::all();
    }
    public function getProductsByCategory($id)
    {
        // Kiểm tra nếu category tồn tại trước khi tìm sản phẩm
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Lấy tất cả sản phẩm thuộc category_id
        $products = Product::with('category', 'stocks')
            ->where('category_id', $id)
            ->get();

        // Kiểm tra nếu không có sản phẩm nào thuộc category này
        if ($products->isEmpty()) {
            return response()->json(['message' => 'No products found for this category'], 404);
        }

        return response()->json($products, 200);
    }



    /**
     * Display all products by categoryId
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function new($id)
    {

        $products = Product::with('category')->where('category_id', $id)->orderBy('id', 'desc')->take(4)->get();

        foreach ($products as $product) {
            if ($product->reviews()->exists()) {
                $product['review'] = $product->reviews()->avg('rating');
            }
        }

        return $products;
    }


    public function topSelling($id)
    {

        $products = Product::with('category')->where('category_id', $id)->take(6)->get();

        foreach ($products as $product) {
            if ($product->reviews()->exists())
                $product['review'] = $product->reviews()->avg('rating');

            if ($product->stocks()->exists()) {
                $num_orders = 0;
                $stocks = $product->stocks()->get();

                foreach ($stocks as $stock)
                    $num_orders += $stock->orders()->count();

                $product['num_orders'] = $num_orders;
            } else {
                $product['num_orders'] = 0;
            }
        }

        return $products->sortByDesc('num_orders')->values()->all();
    }
}
