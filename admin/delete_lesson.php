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
        // --- الخطوة الأولى: جلب مسارات الملفات (الصورة و PDF) لحذفها من السيرفر ---
        $stmt = $conn->prepare("SELECT image, pdf_file, pdf_file_2 FROM lessons WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $lesson = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($lesson) {
            // حذف الصورة
            if (!empty($lesson['image'])) {
                $image_path = "../" . $lesson['image'];
                if (file_exists($image_path)) {
                    unlink($image_path); // حذف الملف
                }
            }

            // حذف ملف PDF الأول
            if (!empty($lesson['pdf_file'])) {
                $pdf1_path = "../" . $lesson['pdf_file'];
                if (file_exists($pdf1_path)) {
                    unlink($pdf1_path);
                }
            }

            // حذف ملف PDF الثاني
            if (!empty($lesson['pdf_file_2'])) {
                $pdf2_path = "../" . $lesson['pdf_file_2'];
                if (file_exists($pdf2_path)) {
                    unlink($pdf2_path);
                }
            }
        }

        // --- الخطوة الثانية: حذف السجل من قاعدة البيانات ---
        $delete_stmt = $conn->prepare("DELETE FROM lessons WHERE id = :id");
        $delete_stmt->bindParam(':id', $id);
        $delete_stmt->execute();

        // رسالة نجاح وإعادة توجيه
        echo "<script>
                alert('تم حذف الدرس وجميع الملفات المرفقة بنجاح.');
                window.location.href = 'view_lessons.php';
              </script>";

    } catch (PDOException $e) {
        // رسالة خطأ
        echo "<script>
                alert('حدث خطأ أثناء الحذف: " . addslashes($e->getMessage()) . "');
                window.location.href = 'view_lessons.php';
              </script>";
    }

} else {
    // إذا لم يتم تمرير ID، أعد التوجيه لصفحة العرض
    header("Location: view_lessons.php");
    exit();
}
?>