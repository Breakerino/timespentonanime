<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use \App\Api\Mal as MalApi;

class ApiController extends Controller {
	public function retrieve(Request $request, $username) {
		$accessToken = env('MAL_ACCESS_TOKEN');
		
		if (! $accessToken) {
			return response([
				'error' => 'Service is not available.'
			], 400);
		}
		
		if (! $username || $username === '@me') {
			return response([
				'error' => 'No username.'
			], 400);
		}
		
		$malApi = new MalApi([
			'access_token' => $accessToken
		]);
		
		$status = explode(',', $request->query('status', ''));
		$type = explode(',', $request->query('type', ''));

		$status = (count($status) === 1 && $status[0] === 'any') ? [] : $status;
		$type = (count($type) === 1 && $type[0] === 'any') ? [] : $type;
		
		$animes = $malApi->get_anime_list([
			'fields' => 'list_status,average_episode_duration,num_episodes,alternative_titles,media_type',
			'limit' => '1000',
			'username' => $username,
		]);
		
		if ( empty($animes) ) {
			return response([
				'error' => 'Profile not found.'
			], 404);
		}
		
		$stats = [
			'total_episodes' => 0,
			'total_minutes' => 0,
			'total_hours' => 0,
			'total_days' => 0
		];
		
		$statusLocalizationMap = [
			'plan_to_watch' => 'Plan to watch',
			'on_hold' => 'On hold',
			'watching' => 'Watching',
			'completed' => 'Completed',
			'dropped' => 'Dropped',
		];
		
		$typeLocalizationMap = [
			'unknown' => 'Unknown',
			'tv' => 'TV',
			'ova' => 'OVA',
			'movie' => 'Movie',
			'special' => 'Special',
			'ona' => 'ONA',
			'music' => 'Music',
		];
		
		if ( ! empty($type) ) {
			$animes = array_filter($animes, function($anime) use ($type) {
				return in_array($anime['node']['media_type'], $type);
			});
		}
		
		if ( ! empty($status) ) {
			$animes = array_filter($animes, function($anime) use ($status) {
				return in_array($anime['list_status']['status'], $status);
			});
		}
		
		foreach ($animes as &$anime) {
			$id = $anime['node']['id'] ?? 0;
			$name = $anime['node']['title'] ?? 'No title';
			$alternativeNames = $anime['node']['alternative_titles'] ?? [];
			$image = $anime['node']['main_picture']['large'] ?? '';
			$type = $anime['node']['media_type'] ?? 'unknown';
			$status = $anime['list_status']['status'] ?? 0;
			$watchedEpisodes = $anime['list_status']['num_episodes_watched'] ?? 0;
			$averageEpisodeDuration = $anime['node']['average_episode_duration'] ?? 0;
			$totalEpisodes = $anime['node']['num_episodes'] ?? 0;

			$totalMinutes = round(($averageEpisodeDuration / 60) * $watchedEpisodes, 1);
			$totalHours = round($totalMinutes / 60, 2);
			$totaDays = round($totalHours / 24, 1);

			$stats['total_episodes'] += $watchedEpisodes;
			$stats['total_minutes'] += $totalMinutes;
			$stats['total_hours'] += $totalHours;
			$stats['total_days'] += $totaDays;

			$anime = [
				'id' => $id,
				'name' => $name,
				'type' => [
					'id' => $type,
					'name' => $typeLocalizationMap[$type] ?? 'Unknown'
				],
				'english_name' => $alternativeNames['en'] ?? null,
				'image' => $image,
				'link' => sprintf('https://myanimelist.net/anime/%d', $id),
				'status' => $statusLocalizationMap[$status] ?? 'N/A',
				'watched_episodes' => $watchedEpisodes,
				'total_episodes' => $totalEpisodes,
				'stats' => [
					'total_minutes' => ceil($totalMinutes),
					'total_hours' => round($totalHours, 1),
					'total_days' => round($totaDays, 1),
				]
			];
		}
		
		usort($animes, function($a, $b) {
			return $a['stats']['total_minutes'] > $b['stats']['total_minutes'] ? -1 : 1;
		});
		
		$stats['total_minutes'] = ceil($stats['total_minutes']);
		$stats['total_hours'] = round($stats['total_hours'], 1);
		$stats['total_days'] = round($stats['total_days'], 1);

		return [
			'stats' => $stats,
			'animes' => $animes
		];
	}
}