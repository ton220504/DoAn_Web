<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['user_id', 'category_id', 'photo', 'brand ', 'name', 'description', 'details', 'price'];
    //protected $fillable = ['name', 'category_id', 'brand', 'description', 'details', 'price', 'size', 'color', 'quantity'];


    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }
    public function reviews()
    {
        return $this->hasMany('App\Models\Review');
    }
    public function stocks()
    {
        return $this->hasMany('App\Models\Stock');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Product extends Model
// {
//     protected $fillable = ['user_id', 'category_id', 'brand', 'name', 'description', 'details', 'price'];

//     public function user()
//     {
//         return $this->belongsTo(User::class);
//     }

//     public function category()
//     {
//         return $this->belongsTo(Category::class);
//     }

//     public function photos()
//     {
//         return $this->hasMany(Photo::class);
//     }
// }

