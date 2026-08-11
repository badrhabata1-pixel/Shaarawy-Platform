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
        // 1. حذف الصورة من السيرفر
        $stmt = $conn->prepare("SELECT image FROM students WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && !empty($row['image'])) {
            $file_path = "../" . $row['image'];
            if (file_exists($file_path)) {
                unlink($file_path); // حذف الملف الفعلي
            }
        }

        // 2. حذف السجل من قاعدة البيانات
        $sql = "DELETE FROM students WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        echo "<script>alert('تم حذف الطالب بنجاح'); window.location.href='view_students.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ أثناء الحذف: " . $e->getMessage() . "'); window.location.href='view_students.php';</script>";
    }
} else {
    header("Location: view_students.php");
}
?>