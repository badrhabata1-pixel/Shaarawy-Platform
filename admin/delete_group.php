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
        // حذف الصورة من السيرفر
        $stmt = $conn->prepare("SELECT image FROM groups WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && !empty($row['image'])) {
            $file_path = "../" . $row['image'];
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        // حذف السجل من قاعدة البيانات
        $sql = "DELETE FROM groups WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        echo "<script>alert('تم حذف المجموعة بنجاح'); window.location.href='view_groups.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ أثناء الحذف: " . $e->getMessage() . "'); window.location.href='view_groups.php';</script>";
    }
} else {
    header("Location: view_groups.php");
}
?>