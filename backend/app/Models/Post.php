<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Nếu bạn có các cột khác muốn bảo vệ, hãy thêm chúng vào đây
    protected $fillable = ['detail', 'name'];
}
