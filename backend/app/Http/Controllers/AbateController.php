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
            $abate->abate_status = 0; // Đặt thủ công giá trị mặc định là 0
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
        $user = JWTAuth::parseToken()->authenticate(); // Lấy thông tin người dùng từ token
        return Abate::where('user_id', $user->id)
                    ->where('abate_status', 0)
                    ->get(); // Sử dụng get() để lấy tất cả các bản ghi
    }

    public function getAbateByUserId_status($userId)
    {
        $user = JWTAuth::parseToken()->authenticate(); // Lấy thông tin người dùng từ token
        return Abate::where('user_id', $user->id)
                    ->where('abate_status', 1)
                    ->get(); // Sử dụng get() để lấy tất cả các bản ghi
    }

    public function candAbate($userId)
    {
        $user = JWTAuth::parseToken()->authenticate(); // Lấy thông tin người dùng từ token
        return Abate::where('user_id', $user->id)
                    ->where('abate_status', 2)
                    ->get(); // Sử dụng get() để lấy tất cả các bản ghi
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


    //check xác nhận đơn hàng
    public function updateStatus($id)
    {
        try {
            // Tìm đơn hàng theo id
            $abate = Abate::find($id);

            // Kiểm tra nếu không tìm thấy đơn hàng
            if (!$abate) {
                return response()->json(['message' => 'Đơn hàng không tồn tại!'], 404);
            }

            // Kiểm tra trạng thái hiện tại là 0 hay không
            if ($abate->abate_status == 0) {
                // Cập nhật trạng thái thành 1
                $abate->abate_status = 1;
                $abate->save(); // Lưu thay đổi

                return response()->json(['message' => 'Trạng thái đã được cập nhật thành công!'], 200);
            } else {
                return response()->json(['message' => 'Trạng thái hiện tại không phải là 0, không thể cập nhật!'], 400);
            }
        } catch (\Exception $e) {
            // Ghi lại lỗi và trả về phản hồi lỗi 500
            \Log::error('Lỗi cập nhật trạng thái: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi cập nhật trạng thái', 'error' => $e->getMessage()], 500);
        }
    }

    //check hủy đơn hàng
    public function checkCandAbate($id)
    {
        try {
            // Tìm đơn hàng theo id
            $abate = Abate::find($id);

            // Kiểm tra nếu không tìm thấy đơn hàng
            if (!$abate) {
                return response()->json(['message' => 'Đơn hàng không tồn tại!'], 404);
            }

            // Kiểm tra trạng thái hiện tại là 0 hay không
            if ($abate->abate_status == 0) {
                // Cập nhật trạng thái thành 1
                $abate->abate_status = 2;
                $abate->save(); // Lưu thay đổi

                return response()->json(['message' => 'Đơn hàng đã được hủy thành công!'], 200);
            } else {
                return response()->json(['message' => 'Không thể hủy đơn hàng này!'], 400);
            }
        } catch (\Exception $e) {
            // Ghi lại lỗi và trả về phản hồi lỗi 500
            \Log::error('Lỗi cập nhật trạng thái: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi khi hủy đơn hàng', 'error' => $e->getMessage()], 500);
        }
    }



}
