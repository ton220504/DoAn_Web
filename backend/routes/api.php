<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\ProductDealsController;
use App\Http\Controllers\ProductShoppingCartController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductCategoriesController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;

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

Route::get('stocks', [StockController::class, 'index']);//1
Route::post('stocks', [StockController::class, 'store']);//2
Route::get('stocks/{id}', [StockController::class, 'show']);//3
Route::put('stocks/{id}', [StockController::class, 'update']);//4
Route::delete('stocks/{id}', [StockController::class, 'destroy']);//5


Route::get('/dashboard', 'App\Http\Controllers\DashboardController@index');
Route::get('/auth', 'App\Http\Controllers\UserController@getAuthenticatedUser');
Route::post('/register', 'App\Http\Controllers\UserController@register');//6
Route::post('/login', [UserController::class, 'login']);//7
Route::post('/loginadmin', [UserController::class, 'loginadmin']);//7

//user
Route::get('/user/default-address', [AddressController::class, 'show']);
Route::post('/user/create-user-address', [AddressController::class, 'createUser']);
Route::post('/user/address', [AddressController::class, 'store']);
Route::get('/users', 'App\Http\Controllers\UserController@show');//8
Route::delete('/users/{id}', 'App\Http\Controllers\UserController@deleteUser');//8
Route::get('/getUser', [UserController::class, 'getUser']);


//product
Route::get('/products', 'App\Http\Controllers\ProductController@index');//8
Route::get('/products/{id}', 'App\Http\Controllers\ProductController@show');//9
Route::post('/products', 'App\Http\Controllers\ProductController@store');//10
Route::delete('/products/{id}', 'App\Http\Controllers\ProductController@destroy');//1
Route::put('/products/{id}', 'App\Http\Controllers\ProductController@update');//12
Route::get('/product', 'App\Http\Controllers\ProductController@showAll');//show all product 13
Route::get('/productSearch', 'App\Http\Controllers\ProductController@showAllSearch');//show all product 13


Route::get('/product/category/{id}', [ProductCategoriesController::class, 'getProductsByCategory']);//show product by id //14
Route::get('/product/category/paginate/{id}', [ProductCategoriesController::class, 'getProductsByCategoryPaginate']);//show product by category by id //15

//thanh toán
Route::post('/vnpay_payment',[PaymentController::class,'vnpay_payment']);


//abate
Route::post('/abate', 'App\Http\Controllers\AbateController@store');
Route::get('/abate/getAll', 'App\Http\Controllers\AbateController@getAll');
Route::get('/abate/getAbate/{id}', 'App\Http\Controllers\AbateController@getAbateById');
Route::get('/abate/getAbateUserId/{userId}', 'App\Http\Controllers\AbateController@getAbateByUserId');
Route::get('/abate/getAbateByUserId_status/{userId}', 'App\Http\Controllers\AbateController@getAbateByUserId_status');
Route::get('/abate/candAbate/{userId}', 'App\Http\Controllers\AbateController@candAbate');

Route::delete('/abate/{id}', 'App\Http\Controllers\AbateController@delete');
Route::put('/abate/{id}/update-status', 'App\Http\Controllers\AbateController@updateStatus');
Route::put('/abate/{id}/cancel', 'App\Http\Controllers\AbateController@checkCandAbate');



Route::get('/product/hot-deal', [ProductDealsController::class, 'hotDeals']);
Route::post('/stripe', 'App\Http\Controllers\ProductOrdersController@stripePost');
Route::post('/product/orders', 'App\Http\Controllers\ProductOrdersController@store');

// Ensure there is only one definition for categories routes
Route::get('/product/categories', [CategoryController::class, 'index']);//16
Route::post('/product/categories', [CategoryController::class, 'store']);//17
Route::get('/product/categories/{id}/top-selling', [CategoryController::class, 'topSelling']);
Route::get('/product/categories/{id}/new', [CategoryController::class, 'new']);
Route::get('/product/categories/{id}/newpage', [CategoryController::class, 'newPage']);
Route::delete('/product/categories/{id}', [CategoryController::class, 'destroy']);//18
Route::put('/product/categories/{id}', [CategoryController::class, 'update']);//19
Route::get('/product/categories/{id}', [CategoryController::class, 'show']);//20




Route::get('/product/cart-list/count', [ProductShoppingCartController::class, 'cartCount']);
Route::delete('/product/cart-list/{id}', [ProductShoppingCartController::class, 'destroy']);//21
Route::get('/product/cart-list', [ProductShoppingCartController::class, 'index']);//22
Route::get('/product/allshoppingcart', [ProductShoppingCartController::class, 'getAllShoppingCart']);//22
Route::post('/product/cart-list', 'App\Http\Controllers\ProductShoppingCartController@store');//23
Route::put('/product/cart-list/{id}', 'App\Http\Controllers\ProductShoppingCartController@update');//24
Route::delete('/cart-list/clear-selected', [ProductShoppingCartController::class, 'clearSelected']);



Route::get('/product/wishlist/count', 'App\Http\Controllers\ProductWishlistController@count');
Route::get('/product/wishlist', 'App\Http\Controllers\ProductWishlistController@index');
Route::post('/product/wishlist', 'App\Http\Controllers\ProductWishlistController@store');
Route::delete('/product/wishlist/{id}', 'App\Http\Controllers\ProductWishlistController@destroy');
Route::get('/product/wishlist/all', 'App\Http\Controllers\ProductWishlistController@getAll');

Route::get('/product/stocks/{id}', [StockController::class, 'show']);
Route::post('/newsletter', 'App\Http\Controllers\NewsLetterController@store');

// Ensure there is only one definition for categories routes
Route::get('/categories', [CategoryController::class, 'index']);
//

Route::get('/post', [PostController::class, 'index']);
Route::get('/post/{id}', [PostController::class, 'show']);


//24
