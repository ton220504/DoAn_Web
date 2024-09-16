<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProduct extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|min:3|max:255',
            'category_id' => 'required|integer',
            'user_id' => 'required|integer',
            'photos' => 'required',
            'photos.*' => 'image|mimes:jpg,jpeg,png,gif',
            'brand' => 'required|string|max:80',
            'description' => 'required|string|max:500',
            'details' => 'required|string',
            'price' => 'required|integer|min:1',
            'size' => 'required|string|max:100',
            'color' => 'required|string|max:100',
            'quantity' => 'required|integer|min:1',
        ];
    }

    public function attributes()
    {
        return [
            'category_id' => 'category',
            'user_id' => 'required|integer',
            'photos' => 'Photo(s)',
            'photos.*' => 'Photo(s)',
        ];
    }
}
