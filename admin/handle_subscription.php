<?php
session_start();
include '../db_connect.php';

// 1. حماية الملف: التحقق من أن المستخدم هو المعلم
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. التحقق من وجود المعرف ونوع الإجراء في الرابط
if (isset($_GET['id']) && isset($_GET['action'])) {
    
    $id = $_GET['id'];
    $action = $_GET['action'];

    try {
        if ($action == 'approve') {
            // --- حالة القبول ---
            // نقوم بتحديث حالة الاشتراك ليصبح مفعلاً
            $sql = "UPDATE subscriptions SET status = 'active', is_active = 1 WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':id' => $id]);

            echo "<script>
                    alert('تم قبول وتفعيل الاشتراك بنجاح.');
                    window.location.href = 'view_subscriptions.php';
                  </script>";
        
        } elseif ($action == 'reject') {
            // --- حالة الرفض ---
            // عند الرفض، يجب حذف الطلب وحذف صورة الوصل لتوفير المساحة
            
            // أولاً: جلب مسار الصورة
            $stmt_img = $conn->prepare("SELECT receipt_image FROM subscriptions WHERE id = :id");
            $stmt_img->execute([':id' => $id]);
            $sub = $stmt_img->fetch(PDO::FETCH_ASSOC);
            
            // حذف الملف من السيرفر إذا كان موجوداً
            if ($sub && !empty($sub['receipt_image'])) {
                $file_path = "../" . $sub['receipt_image'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }

            // ثانياً: حذف السجل من قاعدة البيانات
            $stmt_del = $conn->prepare("DELETE FROM subscriptions WHERE id = :id");
            $stmt_del->execute([':id' => $id]);
            
            echo "<script>
                    alert('تم رفض الطلب وحذفه نهائياً.');
                    window.location.href = 'view_subscriptions.php';
                  </script>";
        } else {
            // إجراء غير معروف
            header("Location: view_subscriptions.php");
        }

    } catch (PDOException $e) {
        // في حالة حدوث خطأ في قاعدة البيانات
        echo "<script>
                alert('حدث خطأ أثناء تنفيذ الإجراء: " . addslashes($e->getMessage()) . "');
                window.location.href = 'view_subscriptions.php';
              </script>";
    }

} else {
    // إذا تم فتح الملف مباشرة بدون بيانات
    header("Location: view_subscriptions.php");
    exit();
}
?>