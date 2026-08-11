<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (isset($_GET['id']) && isset($_GET['action'])) {
    $id = $_GET['id'];
    $action = $_GET['action'];

    try {
        if ($action == 'approve') {
            // تفعيل الحساب
            $stmt = $conn->prepare("UPDATE students SET is_active = 1 WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo "<script>alert('تم تفعيل حساب الطالب بنجاح'); window.location.href='student_requests.php';</script>";
        
        } elseif ($action == 'reject') {
            // حذف الحساب وصورته
            $stmt = $conn->prepare("SELECT image FROM students WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $student = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($student && !empty($student['image'])) {
                if (file_exists("../" . $student['image'])) unlink("../" . $student['image']);
            }

            $conn->prepare("DELETE FROM students WHERE id = :id")->execute([':id' => $id]);
            echo "<script>alert('تم حذف طلب التسجيل'); window.location.href='student_requests.php';</script>";
        }

    } catch (PDOException $e) {
        echo "<script>alert('خطأ'); window.history.back();</script>";
    }
} else {
    header("Location: student_requests.php");
}
?>