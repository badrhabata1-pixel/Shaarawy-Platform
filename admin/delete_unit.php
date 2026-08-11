<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة: التأكد من أن المستخدم مسجل دخول
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. التحقق من وجود ID في الرابط
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // --- الخطوة الأولى: جلب مسار الصورة لحذفها ---
        $stmt = $conn->prepare("SELECT image FROM units WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $unit = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($unit) {
            // إذا كان للوحدة صورة، نقوم بحذفها من السيرفر
            if (!empty($unit['image'])) {
                // نستخدم ../ للرجوع للمجلد الرئيسي لأننا داخل مجلد admin
                $image_path = "../" . $unit['image'];
                
                if (file_exists($image_path)) {
                    unlink($image_path); // دالة الحذف
                }
            }
        }

        // --- الخطوة الثانية: حذف السجل من قاعدة البيانات ---
        // ملاحظة: سيتم حذف الدروس التابعة لهذه الوحدة تلقائياً (Cascade)
        $delete_stmt = $conn->prepare("DELETE FROM units WHERE id = :id");
        $delete_stmt->execute([':id' => $id]);

        // رسالة نجاح وإعادة توجيه
        echo "<script>
                alert('تم حذف الوحدة الدراسية بنجاح.');
                window.location.href = 'view_units.php';
              </script>";

    } catch (PDOException $e) {
        // في حال وجود خطأ (مثل ارتباطات تمنع الحذف)
        echo "<script>
                alert('حدث خطأ أثناء الحذف: " . addslashes($e->getMessage()) . "');
                window.location.href = 'view_units.php';
              </script>";
    }

} else {
    // إذا تم فتح الصفحة بدون ID، نعيده لصفحة العرض
    header("Location: view_units.php");
    exit();
}
?>