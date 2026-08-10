<?php
/**
 * db_connect.php — Shared PDO connection for the admin panel.
 * Reads DB settings from Laravel's .env so both the admin PHP panel
 * and Laravel itself always talk to the same database.
 */

// ── Parse .env ──────────────────────────────────────────────────────────────
$envPath = __DIR__ . '/.env';
$env = [];
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $env[trim($key)] = trim($value, " \t\n\r\0\x0B\"'");
    }
}

$dbDriver   = $env['DB_CONNECTION'] ?? 'sqlite';
$dbHost     = $env['DB_HOST']       ?? '127.0.0.1';
$dbPort     = $env['DB_PORT']       ?? '3306';
$dbName     = $env['DB_DATABASE']   ?? 'database';
$dbUser     = $env['DB_USERNAME']   ?? 'root';
$dbPass     = $env['DB_PASSWORD']   ?? '';

// ── Build DSN ───────────────────────────────────────────────────────────────
try {
    if ($dbDriver === 'sqlite') {
        // Laravel default when DB_DATABASE is unset: database/database.sqlite
        if (empty($dbName) || $dbName === 'database') {
            $dbName = __DIR__ . '/database/database.sqlite';
        } elseif (!str_starts_with($dbName, '/') && !preg_match('/^[A-Za-z]:[\/\\\\]/', $dbName)) {
            $dbName = __DIR__ . '/' . $dbName;
        }
        $dsn  = "sqlite:{$dbName}";
        $conn = new PDO($dsn);
        $conn->exec('PRAGMA foreign_keys = ON;');
        $conn->exec('PRAGMA journal_mode = WAL;');
    } else {
        $dsn  = "{$dbDriver}:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $conn = new PDO($dsn, $dbUser, $dbPass);
    }

    $conn->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES,   false);

} catch (PDOException $e) {
    die('<div style="font-family:monospace;color:red;padding:20px">
        <h3>❌ خطأ في الاتصال بقاعدة البيانات</h3>
        <p>' . htmlspecialchars($e->getMessage()) . '</p>
        <p>تأكد من إعدادات ملف <code>.env</code></p>
    </div>');
}
