<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (isset($_GET['id'])) {
    $exam_id = $_GET['id'];

    try {
        // 1. حذف صورة الامتحان نفسه
        $stmt = $conn->prepare("SELECT image FROM exams WHERE id = :id");
        $stmt->execute([':id' => $exam_id]);
        $exam = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($exam && !empty($exam['image'])) {
            if (file_exists("../" . $exam['image'])) unlink("../" . $exam['image']);
        }

        // 2. حذف صور الأسئلة المرتبطة بالامتحان
        $stmt_q = $conn->prepare("SELECT image_path FROM questions WHERE exam_id = :eid");
        $stmt_q->execute([':eid' => $exam_id]);
        $questions = $stmt_q->fetchAll(PDO::FETCH_ASSOC);

        foreach ($questions as $q) {
            if (!empty($q['image_path'])) {
                if (file_exists("../" . $q['image_path'])) unlink("../" . $q['image_path']);
            }
        }

        // 3. حذف البيانات من القاعدة (Cascade سيقوم بالواجب، لكن نحذف يدوياً للأمان)
        $conn->prepare("DELETE FROM question_choices WHERE question_id IN (SELECT id FROM questions WHERE exam_id = ?)")->execute([$exam_id]);
        $conn->prepare("DELETE FROM questions WHERE exam_id = ?")->execute([$exam_id]);
        $conn->prepare("DELETE FROM exams WHERE id = ?")->execute([$exam_id]);

        echo "<script>alert('تم حذف الامتحان بنجاح'); window.location.href='view_exams.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('خطأ: " . addslashes($e->getMessage()) . "'); window.location.href='view_exams.php';</script>";
    }
} else {
    header("Location: view_exams.php");
}
?>