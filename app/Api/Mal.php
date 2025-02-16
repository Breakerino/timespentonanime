<?php

namespace App\Api;

use Illuminate\Support\Facades\Http;

class Mal {
	private const API_BASE_URL = 'https://api.myanimelist.net/v2';

	private $accessToken;

	public function __construct(array $props = []) {
		$this->accessToken = $props['access_token'];
	}

	public function get_anime_list(array $args = []) {
		$response = Http::withToken($this->accessToken)
			->get(self::API_BASE_URL . '/users/' . $args['username'] . '/animelist', $args);

		$data = $response->json();

		return $data['data'] ?? [];
	}

	public function get_anime(array $args = []) {
		$animeID = $args['id'];

		$response = Http::withToken($this->accessToken)
			->get(self::API_BASE_URL . '/anime/' . $animeID, array_diff($args, ['id']));

		return $response->json();
	}
}