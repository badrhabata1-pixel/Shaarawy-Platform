<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit();
}

$email    = htmlspecialchars(strip_tags(trim($_POST['email']   ?? '')));
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo "<script>alert('يرجى إدخال البريد وكلمة المرور'); window.location.href='login.html';</script>";
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM admins WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($password, $admin['password'])) {
        $_SESSION['admin_id']   = $admin['id'];
        $_SESSION['admin_name'] = $admin['name'];
        $_SESSION['admin_role'] = $admin['role'];
        $_SESSION['role']       = 'teacher';

        // Generate one-time bridge token for the new React dashboard
        $token = bin2hex(random_bytes(16));
        $data  = json_encode(['token' => $token, 'expires' => time() + 60]);
        file_put_contents(
            __DIR__ . '/../storage/app/bridge_token.json',
            $data
        );

        header('Location: http://localhost:8000/admin/bridge?token=' . $token);
        exit();
    }

    echo "<script>alert('البريد الإلكتروني أو كلمة المرور غير صحيحة'); window.location.href='login.html';</script>";

} catch (PDOException $e) {
    echo "<script>alert('خطأ في قاعدة البيانات: " . addslashes($e->getMessage()) . "'); window.location.href='login.html';</script>";
}
