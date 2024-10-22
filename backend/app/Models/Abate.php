<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abate extends Model
{
    use HasFactory;

    // Danh sách các trường có thể điền được
    protected $fillable = [
        'name',
        'user_id',
        'abate_status',//trạng thái đơn hàng
        'phone',
        'email',
        'products',  // Đảm bảo rằng products sẽ lưu JSON
        'totalMoney',
        'provinces',  // Đảm bảo đúng tên trường
        'district',
        'wards',
        'address'
    ];
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
