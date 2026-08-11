<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // أولاً: نحذف الصورة من السيرفر لتوفير المساحة
        $stmt = $conn->prepare("SELECT image FROM academic_years WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && !empty($row['image'])) {
            $file_path = "../" . $row['image'];
            if (file_exists($file_path)) {
                unlink($file_path); // حذف الملف
            }
        }

        // ثانياً: نحذف السجل من قاعدة البيانات
        // بفضل خاصية ON DELETE CASCADE التي وضعناها في قاعدة البيانات
        // سيتم حذف المجموعات والدروس المرتبطة بهذا الصف تلقائياً
        $sql = "DELETE FROM academic_years WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // إعادة التوجيه
        echo "<script>alert('تم حذف الصف الدراسي بنجاح'); window.location.href='view_classes.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ أثناء الحذف: " . $e->getMessage() . "'); window.location.href='view_classes.php';</script>";
    }
} else {
    header("Location: view_classes.php");
}
?>