<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use \App\Http\Controllers\AnimeController;

Route::get('/', function () {
	return Inertia::render('homepage', []);
});

Route::get('/u/{username}', function (Request $request, $username) {
	return Inertia::render('user', [
		'title' => '',
		'username' => strtolower(trim($username)),
		'userMalLink' => sprintf('https://myanimelist.net/profile/%s', strtolower(trim($username))), // TODO: Constant
		'type' => $request->query('type', 'any'),
		'status' => $request->query('status', 'any'),
		...AnimeController::retrieve_report(
			strtolower(trim($username)), 
			[
				'status' => explode(',', $request->query('status', 'any')), 
				'type' => explode(',', $request->query('type', 'any'))
			]
		)
	]);
});