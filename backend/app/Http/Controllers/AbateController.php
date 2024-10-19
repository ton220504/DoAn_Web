<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Abate; // Gọi model Abate
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class AbateController extends Controller
{

    public function store(Request $request)
{
    try {
        // Lấy thông tin người dùng từ JWT
        $user = JWTAuth::parseToken()->authenticate();

        // Validate dữ liệu đầu vào
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'email' => 'required|email|max:255',
            'products' => 'required|array',
            'products.*.name' => 'required|string|max:255',
            'products.*.quantity' => 'required|integer|min:1',
            'totalMoney' => 'required|numeric|min:0',
            'provinces' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'wards' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        // Lưu dữ liệu vào bảng abate
        $abate = new Abate();
        $abate->name = $request->name;
        $abate->user_id = $user->id; // Lấy từ JWT token
        $abate->phone = $request->phone;
        $abate->email = $request->email;
        $abate->products = json_encode($request->products); // Chuyển mảng products thành JSON để lưu
        $abate->totalMoney = $request->totalMoney;
        $abate->provinces = $request->provinces;
        $abate->district = $request->district;
        $abate->wards = $request->wards;
        $abate->address = $request->address;

        $abate->save(); // Lưu đơn hàng

        return response()->json(['message' => 'Đơn hàng đã được lưu thành công!'], 200);
    } catch (\Exception $e) {
        // Ghi lại lỗi và trả về phản hồi lỗi 500
        \Log::error('Lỗi lưu đơn hàng: ' . $e->getMessage());
        return response()->json(['message' => 'Lỗi lưu đơn hàng', 'error' => $e->getMessage()], 500);
    }
}


    public function getAll()
    {
        return Abate::all();
    }

    public function getAbateById($id)
    {
        return Abate::find($id);
    }

    public function getAbateByUserId($userId)
    {
        // Lọc đơn hàng theo user_id
        return Abate::where('user_id', $userId)->get(); // Sử dụng get() để lấy tất cả các bản ghi
    }


    public function delete($id)
    {
        $abate = Abate::find($id);  // Tìm bản ghi với id
        if ($abate) {
            $abate->delete();  // Xóa bản ghi nếu tìm thấy
            return response()->json(['message' => 'Xóa thành công!'], 200);
        } else {
            return response()->json(['message' => 'Bản ghi không tồn tại!'], 404);
        }
    }




}
