<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
	<title inertia>{{ isset($page['props']['title']) ? $page['props']['title'] . ' | ' . config('app.name') : config('app.name') }}</title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="author" content="Breakerino">
	<meta name="keywords" content="anime, time tracking, anime tracking, time spent on anime, wasted on anime, my anime list, total time spent watching anime">
	<meta name="theme-color" content="#ffffff">

	<!-- Fonts -->
	<link rel="preload" href="{{ asset('fonts/NotoSansJP-Regular.ttf') }}" as="font" type="font/ttf" crossorigin="anonymous">
	<link rel="preload" href="{{ asset('fonts/NotoSansJP-Medium.ttf') }}" as="font" type="font/ttf" crossorigin="anonymous">
	<link rel="preload" href="{{ asset('fonts/NotoSansJP-SemiBold.ttf') }}" as="font" type="font/ttf" crossorigin="anonymous">

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" sizes="32x32" href="/favicon-32x32.png" type="image/png">
	<link rel="icon" sizes="16x16" href="/favicon-16x16.png" type="image/png">
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Time Spent on Anime" />
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Scripts -->
	@routes
	@viteReactRefresh
	@vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
	@inertiaHead

	<!-- Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-9QGY58WCVE"></script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-9QGY58WCVE');
	</script>
</head>

<body class="font-sans antialiased">
	@inertia
</body>

</html>