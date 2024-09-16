<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\ProductDealsController;
use App\Http\Controllers\ProductShoppingCartController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('stocks', [StockController::class, 'index']);
Route::post('stocks', [StockController::class, 'store']);
Route::get('stocks/{id}', [StockController::class, 'show']);
Route::put('stocks/{id}', [StockController::class, 'update']);
Route::delete('stocks/{id}', [StockController::class, 'destroy']);


Route::get('/dashboard', 'App\Http\Controllers\DashboardController@index');
Route::get('/auth', 'App\Http\Controllers\UserController@getAuthenticatedUser');
Route::post('/register', 'App\Http\Controllers\UserController@register');
Route::post('/login', [UserController::class, 'login']);
Route::get('/user/default-address', [AddressController::class, 'show']);
Route::post('/user/create-user-address', [AddressController::class, 'createUser']);
Route::post('/user/address', [AddressController::class, 'store']);
Route::get('/products', 'App\Http\Controllers\ProductController@index');
Route::get('/products/{id}', 'App\Http\Controllers\ProductController@show');
Route::post('/products', 'App\Http\Controllers\ProductController@store');
Route::delete('/products/{id}', 'App\Http\Controllers\ProductController@destroy');
Route::put('/products/{id}', 'App\Http\Controllers\ProductController@update');

Route::get('/product/hot-deal', [ProductDealsController::class, 'hotDeals']);
Route::post('/stripe', 'App\Http\Controllers\ProductOrdersController@stripePost');
Route::post('/product/orders', 'App\Http\Controllers\ProductOrdersController@store');

// Ensure there is only one definition for categories routes
Route::get('/product/categories', [CategoryController::class, 'index']);
Route::post('/product/categories', [CategoryController::class, 'store']);
Route::get('/product/categories/{id}/top-selling', [CategoryController::class, 'topSelling']);
Route::get('/product/categories/{id}/new', [CategoryController::class, 'new']);
Route::get('/product/categories/{id}/newpage', [CategoryController::class, 'newPage']);
Route::delete('/product/categories/{id}', [CategoryController::class, 'destroy']);
Route::put('/product/categories/{id}', [CategoryController::class, 'update']);
Route::get('/product/categories/{id}', [CategoryController::class, 'show']);




Route::get('/product/cart-list/count', [ProductShoppingCartController::class, 'cartCount']);
Route::delete('/product/cart-list/{id}', [ProductShoppingCartController::class, 'destroy']);
Route::get('/product/cart-list', [ProductShoppingCartController::class, 'index']);
Route::post('/product/cart-list', 'App\Http\Controllers\ProductShoppingCartController@store');
Route::put('/product/cart-list/{id}', 'App\Http\Controllers\ProductShoppingCartController@guestCart');

Route::get('/product/wishlist/count', 'App\Http\Controllers\ProductWishlistController@count');
Route::get('/product/wishlist', 'App\Http\Controllers\ProductWishlistController@index');
Route::post('/product/wishlist', 'App\Http\Controllers\ProductWishlistController@store');
Route::delete('/product/wishlist/{id}', 'App\Http\Controllers\ProductWishlistController@destroy');

Route::get('/product/stocks/{id}', [StockController::class, 'show']);
Route::post('/newsletter', 'App\Http\Controllers\NewsLetterController@store');

// Ensure there is only one definition for categories routes
Route::get('/categories', [CategoryController::class, 'index']);
//

Route::get('/post', [PostController::class, 'index']);
Route::get('/post/{id}', [PostController::class, 'show']);
