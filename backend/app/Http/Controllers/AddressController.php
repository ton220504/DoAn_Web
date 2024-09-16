<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Address;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    public function createUser(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'zip' => 'required|max:20',
            'telephone' => 'required|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::create([
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $address = Address::create([
            'user_id' => $user->id,
            'firstname' => $request->firstName,
            'lastname' => $request->lastName,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country,
            'zip' => $request->zip,
            'telephone' => $request->telephone
        ]);


        $user->update(['address_id' => $address->id]);
        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user', 'token'), 201);
    }
    public function show()
    {
        $user = JWTAuth::parseToken()->authenticate();
        return $user->addresses()->where('id', $user->address_id)->first();
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate(); // Ensure user is authenticated

        // Create new address for the authenticated user
        $address = Address::create([
            'user_id' => $user->id,
            'firstname' => $request->firstName,
            'lastname' => $request->lastName,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country,
            'zip' => $request->zip,
            'telephone' => $request->telephone
        ]);

        $user->update(['address_id' => $address->id]);

        return response()->json(compact('address'), 201);
    }
}
