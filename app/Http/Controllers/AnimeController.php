<?php

namespace App\Http\Controllers;

use \App\Api\Mal as MalApi;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class AnimeController extends Controller {
	public static function retrieve_report($username, $params = []) {
		if (! $username || $username === '@me') {
			return [
				'error' => 'No username.'
			];
		}

		$types = (is_array($params['type']) && count($params['type']) === 1 && $params['type'][0] === 'any') ? [] : (is_array($params['type']) ? $params['type'] : []);
		$statuses = (is_array($params['status']) && count($params['status']) === 1 && $params['status'][0] === 'any') ? [] : (is_array($params['status']) ? $params['status'] : []);
		
		$stats = [
			'total_episodes' => 0,
			'total_minutes' => 0,
			'total_hours' => 0,
			'total_days' => 0
		];

		$cacheKey = sprintf('user:%s:data', $username);

		$data = Redis::get($cacheKey);

		if ($data) {
			$data = json_decode($data, true);

			if (! empty($types)) {
				$data['animes'] = array_filter($data['animes'], function ($anime) use ($types) {
					return in_array($anime['type']['id'], $types);
				});
			}

			if (! empty($statuses)) {
				$data['animes'] = array_filter($data['animes'], function ($anime) use ($statuses) {
					return in_array($anime['status']['id'], $statuses);
				});
			}
			
			$data['animes'] = array_values($data['animes']);
			
			foreach ($data['animes'] as $anime) {
				$stats['total_episodes'] += $anime['watched_episodes'];
				$stats['total_minutes'] += $anime['stats']['total_minutes'];
				$stats['total_hours'] += $anime['stats']['total_hours'];
				$stats['total_days'] += $anime['stats']['total_days'];
			}

			$stats['total_minutes'] = ceil($stats['total_minutes']);
			$stats['total_hours'] = round($stats['total_hours'], 1);
			$stats['total_days'] = round($stats['total_days'], 1);
			
			$data = [
				'animes' => $data['animes'],
				'stats' => $stats
			];

			return compact('data');
		}

		$accessToken = env('MAL_ACCESS_TOKEN');

		if (! $accessToken) {
			return [
				'error' => 'Service is not available.'
			];
		}

		$malApi = new MalApi([
			'access_token' => $accessToken
		]);

		$animes = $malApi->get_anime_list([
			'fields' => 'list_status,average_episode_duration,num_episodes,alternative_titles,media_type',
			'limit' => '1000',
			'username' => $username,
		]);

		if (empty($animes)) {
			return [
				'error' => 'Profile not found.'
			];
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

			$anime = [
				'id' => $id,
				'name' => $name,
				'type' => [
					'id' => $type,
					'name' => \App\Constants::MEDIA_TYPE_LOCALIZATIONS[$type] ?? 'Unknown'
				],
				'english_name' => $alternativeNames['en'] ?? null,
				'image' => $image,
				'link' => sprintf('https://myanimelist.net/anime/%d', $id),
				'status' => [
					'id' => $status,
					'name' => \App\Constants::STATUS_LOCALIZATIONS[$status] ?? 'Unknown'
				],
				'watched_episodes' => $watchedEpisodes,
				'total_episodes' => $totalEpisodes,
				'stats' => [
					'total_minutes' => ceil($totalMinutes),
					'total_hours' => round($totalHours, 1),
					'total_days' => round($totaDays, 1),
				]
			];
		}

		usort($animes, function ($a, $b) {
			return $a['stats']['total_minutes'] > $b['stats']['total_minutes'] ? -1 : 1;
		});

		$data = compact('animes');

		Redis::setex($cacheKey, 3600, json_encode($data));

		// TODO: Queue job to update sitemaps
		try {
			// Update users sitemap
			$sitemapFile = public_path('sitemap-users.xml');
			$sitemapXml = simplexml_load_file($sitemapFile);
			$namespaces = $sitemapXml->getNamespaces(true);
			$sitemapXml->registerXPathNamespace('ns', $namespaces['']);

			$appUrl = env('APP_URL');
			$userEntry = $sitemapXml->xpath("//ns:url[ns:loc='{$appUrl}/u/{$username}']");

			if ($userEntry) {
				$userEntry[0]->lastmod = date('Y-m-d');
			} else {
				$url = $sitemapXml->addChild('url');
				$url->addChild('loc', "{$appUrl}/u/{$username}");
				$url->addChild('lastmod', date('Y-m-d'));
			}

			$dom = new \DOMDocument('1.0');
			$dom->preserveWhiteSpace = false;
			$dom->formatOutput = true;
			$dom->loadXML($sitemapXml->asXML());
			$dom->save($sitemapFile);

			// Update main sitemap
			$sitemapFile = public_path('sitemap.xml');
			$sitemapXml = simplexml_load_file($sitemapFile);
			$namespaces = $sitemapXml->getNamespaces(true);
			$sitemapXml->registerXPathNamespace('ns', $namespaces['']);

			$sitemapEntry = $sitemapXml->xpath("//ns:sitemap[ns:loc='{$appUrl}/sitemap-users.xml']");

			if ($sitemapEntry) {
				$sitemapEntry[0]->lastmod = date('Y-m-d');
			}

			$dom = new \DOMDocument('1.0');
			$dom->preserveWhiteSpace = false;
			$dom->formatOutput = true;
			$dom->loadXML($sitemapXml->asXML());
			$dom->save($sitemapFile);
		} catch (\Exception $e) {
			Log::error('Error updating users sitemap: ' . $e->getMessage());
		}

		if (! empty($types)) {
			$data['animes'] = array_filter($data['animes'], function ($anime) use ($types) {
				return in_array($anime['type']['id'], $types);
			});
		}

		if (! empty($statuses)) {
			$data['animes'] = array_filter($data['animes'], function ($anime) use ($statuses) {
				return in_array($anime['status']['id'], $statuses);
			});
		}
		
		$data['animes'] = array_values($data['animes']);
				
		foreach ($data['animes'] as $anime) {
			$stats['total_episodes'] += $anime['watched_episodes'];
			$stats['total_minutes'] += $anime['stats']['total_minutes'];
			$stats['total_hours'] += $anime['stats']['total_hours'];
			$stats['total_days'] += $anime['stats']['total_days'];
		}

		$stats['total_minutes'] = ceil($stats['total_minutes']);
		$stats['total_hours'] = round($stats['total_hours'], 1);
		$stats['total_days'] = round($stats['total_days'], 1);
		
		$data = [
			'animes' => $data['animes'],
			'stats' => $stats
		];
		
		return compact('data');
	}
}
