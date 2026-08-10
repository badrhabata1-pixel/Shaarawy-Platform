<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (isset($_GET['id'])) {
    $sheet_id = $_GET['id'];

    try {
        // 1. حذف ملف PDF الخاص بالشيت
        $stmt = $conn->prepare("SELECT file_path FROM sheets WHERE id = :id");
        $stmt->execute([':id' => $sheet_id]);
        $sheet = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($sheet && !empty($sheet['file_path'])) {
            if (file_exists("../" . $sheet['file_path'])) {
                unlink("../" . $sheet['file_path']);
            }
        }

        // 2. حذف صور الأسئلة المرتبطة بالشيت
        // نحتاج لجلب مسارات الصور لكل الأسئلة التابعة لهذا الشيت
        $stmt_q = $conn->prepare("SELECT image_path FROM questions WHERE sheet_id = :sid");
        $stmt_q->execute([':sid' => $sheet_id]);
        $questions = $stmt_q->fetchAll(PDO::FETCH_ASSOC);

        foreach ($questions as $q) {
            if (!empty($q['image_path'])) {
                if (file_exists("../" . $q['image_path'])) {
                    unlink("../" . $q['image_path']);
                }
            }
        }

        // 3. حذف السجل من قاعدة البيانات
        // (سيتم حذف الأسئلة والاختيارات تلقائياً بفضل الـ Cascade إذا كانت مفعلة، 
        // أو نقوم بحذفها يدوياً للأمان)
        
        // حذف الاختيارات (عن طريق حذف الأسئلة)
        $conn->prepare("DELETE FROM question_choices WHERE question_id IN (SELECT id FROM questions WHERE sheet_id = ?)")->execute([$sheet_id]);
        
        // حذف الأسئلة
        $conn->prepare("DELETE FROM questions WHERE sheet_id = ?")->execute([$sheet_id]);
        
        // حذف الشيت نفسه
        $conn->prepare("DELETE FROM sheets WHERE id = ?")->execute([$sheet_id]);

        echo "<script>alert('تم حذف الشيت وجميع محتوياته بنجاح'); window.location.href='view_sheets.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ: " . addslashes($e->getMessage()) . "'); window.location.href='view_sheets.php';</script>";
    }
} else {
    header("Location: view_sheets.php");
}
?>