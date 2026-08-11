<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة: التأكد من أن المستخدم مسجل دخول كمعلم
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. التحقق من وجود المعرف (ID) في الرابط
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // --- الخطوة الأولى: التحقق من وجود صورة وصل وحذفها ---
        // (لأن الاشتراكات الأونلاين تحتوي على صور تحويلات بنكية)
        $stmt = $conn->prepare("SELECT receipt_image FROM subscriptions WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $subscription = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($subscription && !empty($subscription['receipt_image'])) {
            $file_path = "../" . $subscription['receipt_image'];
            // التأكد من أن الملف موجود فعلياً ثم حذفه
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        // --- الخطوة الثانية: حذف سجل الاشتراك من قاعدة البيانات ---
        $delete_stmt = $conn->prepare("DELETE FROM subscriptions WHERE id = :id");
        $delete_stmt->execute([':id' => $id]);

        // رسالة نجاح وإعادة توجيه
        echo "<script>
                alert('تم حذف الاشتراك (وصورة الوصل إن وجدت) بنجاح.');
                window.location.href = 'view_subscriptions.php';
              </script>";

    } catch (PDOException $e) {
        // في حالة حدوث خطأ
        echo "<script>
                alert('حدث خطأ أثناء الحذف: " . addslashes($e->getMessage()) . "');
                window.location.href = 'view_subscriptions.php';
              </script>";
    }

} else {
    // إذا تم فتح الصفحة بدون ID
    header("Location: view_subscriptions.php");
    exit();
}
?>