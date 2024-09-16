<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $stocks = Stock::all();
    return response()->json($stocks);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'product_id' => 'required|exists:products,id',
        'size' => 'required|string|max:50',
        'color' => 'required|string|max:50',
        'quantity' => 'required|integer|min:1',
    ]);

    $stock = Stock::create($validatedData);

    return response()->json([
        'message' => 'Stock created successfully',
        'stock' => $stock,
    ], 201);
}


    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
{
    return response()->json($stock);
}


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
{
    $validatedData = $request->validate([
        'size' => 'required|string|max:50',
        'color' => 'required|string|max:50',
        'quantity' => 'required|integer|min:1',
    ]);

    $stock->update($validatedData);

    return response()->json([
        'message' => 'Stock updated successfully',
        'stock' => $stock,
    ], 200);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
{
    $stock->delete();

    return response()->json([
        'message' => 'Stock deleted successfully',
    ], 200);
}
}
