<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // 1. حذف الصورة
        $stmt = $conn->prepare("SELECT image FROM admins WHERE id = :id AND role = 'assistant'");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            if (!empty($row['image']) && file_exists("../" . $row['image'])) {
                unlink("../" . $row['image']);
            }

            // 2. حذف السجل (نتأكد من role=assistant لكي لا يحذف المعلم نفسه بالخطأ)
            $del = $conn->prepare("DELETE FROM admins WHERE id = :id AND role = 'assistant'");
            $del->execute([':id' => $id]);

            echo "<script>alert('تم حذف المساعد بنجاح'); window.location.href='view_assistants.php';</script>";
        } else {
            echo "<script>alert('لم يتم العثور على المساعد'); window.location.href='view_assistants.php';</script>";
        }

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ'); window.history.back();</script>";
    }
}
?>