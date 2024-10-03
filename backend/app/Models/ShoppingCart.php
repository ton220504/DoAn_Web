<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    protected $fillable = ['user_id', 'stock_id', 'quantity', 'name', 'price','photo'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function stock()
    {
        return $this->belongsTo('App\Models\Stock');
    }

    // Định nghĩa mối quan hệ với sản phẩm
    public function product()
    {
        return $this->belongsTo(product::class);
    }

}
