<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <script>
        (function() {
            const theme = localStorage.getItem('theme') || 'system';
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const effectiveTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
            document.documentElement.classList.add(effectiveTheme);
        })();
    </script>
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
