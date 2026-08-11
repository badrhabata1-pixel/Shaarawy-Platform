<?php
// admin/save_top_students.php
session_start();
include '../db_connect.php';

// توحيد متغير الاتصال
if (!isset($pdo) && isset($conn)) { $pdo = $conn; }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $academic_year_id = $_POST['academic_year_id'];
    $month = $_POST['month']; // تأتي بصيغة 2026-02 وهي مناسبة تماماً لقاعدة بياناتك
    $ranks = $_POST['ranks'];

    try {
        $pdo->beginTransaction();

        // 1. حذف الأوائل السابقين (الآن سيجدهم لأن الصيغة متطابقة)
        $del = $pdo->prepare("DELETE FROM top_students WHERE academic_year_id = ? AND month = ?");
        $del->execute([$academic_year_id, $month]);

        // 2. إضافة الأوائل الجدد
        $insert = $pdo->prepare("INSERT INTO top_students (student_id, academic_year_id, rank, month) VALUES (?, ?, ?, ?)");

        $used_students = [];

        foreach ($ranks as $rank => $student_id) {
            if (!empty($student_id) && is_numeric($student_id) && !in_array($student_id, $used_students)) {
                $insert->execute([$student_id, $academic_year_id, $rank, $month]);
                $used_students[] = $student_id;
            }
        }

        $pdo->commit();
        echo "<script>alert('تم نشر قائمة الأوائل بنجاح!'); window.location.href='add_top_students.php';</script>";

    } catch (PDOException $e) {
        $pdo->rollBack();
        echo "<script>alert('حدث خطأ: " . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }

} else {
    header("Location: add_top_students.php");
}
?>