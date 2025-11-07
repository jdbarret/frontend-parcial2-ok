<?php
/**
 * Azure App Service PHP Container Entry Point
 * This file serves the static HTML/JS files
 */

// Set the default timezone
date_default_timezone_set('UTC');

// Get the requested file
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$requestPath = ltrim($requestPath, '/');

// If no file is specified, serve index.html
if (empty($requestPath) || $requestPath === '/') {
    $requestPath = 'index.html';
}

// Security: Prevent directory traversal
$requestPath = str_replace('..', '', $requestPath);

// Define allowed file types
$allowedExtensions = ['html', 'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'ico', 'json'];
$extension = pathinfo($requestPath, PATHINFO_EXTENSION);

// Check if file exists and is allowed
if (file_exists($requestPath) && in_array($extension, $allowedExtensions)) {
    // Set appropriate content type
    $contentTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon'
    ];
    
    header('Content-Type: ' . ($contentTypes[$extension] ?? 'text/plain'));
    readfile($requestPath);
} else {
    // File not found - serve index.html for client-side routing
    if (file_exists('index.html')) {
        header('Content-Type: text/html');
        readfile('index.html');
    } else {
        header("HTTP/1.0 404 Not Found");
        echo "404 - File Not Found";
    }
}
?>
