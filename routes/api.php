<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ApiController;

Route::get('/', function () {
		return response()->json(['status' => 'ok']);
});

Route::get('/report/{username}/retrieve', [ApiController::class, 'retrieve'])->whereAlphaNumeric('username');