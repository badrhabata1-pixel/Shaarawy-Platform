<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    try {
        $conn->beginTransaction();

        $sheet_id = $_POST['sheet_id'];
        $name = $_POST['name'];
        $lesson_id = $_POST['lesson_id'];
        $total_degree = $_POST['total_degree'];
        $description = $_POST['description'];

        // 1. تحديث بيانات الشيت
        $sheet_pdf_path = isset($_POST['old_sheet_pdf']) ? $_POST['old_sheet_pdf'] : NULL;
        
        // إذا تم رفع ملف جديد، استبدل القديم
        if (isset($_FILES['sheet_pdf']) && $_FILES['sheet_pdf']['error'] == 0) {
            $upload_dir = '../uploads/sheets/';
            $file_ext = pathinfo($_FILES['sheet_pdf']['name'], PATHINFO_EXTENSION);
            $new_name = uniqid() . '_sheet.' . $file_ext;
            if (move_uploaded_file($_FILES['sheet_pdf']['tmp_name'], $upload_dir . $new_name)) {
                if ($sheet_pdf_path && file_exists("../" . $sheet_pdf_path)) unlink("../" . $sheet_pdf_path);
                $sheet_pdf_path = 'uploads/sheets/' . $new_name;
            }
        }

        $sql_sheet = "UPDATE sheets SET title=?, lesson_id=?, description=?, file_path=?, total_marks=? WHERE id=?";
        $stmt = $conn->prepare($sql_sheet);
        $stmt->execute([$name, $lesson_id, $description, $sheet_pdf_path, $total_degree, $sheet_id]);

        // 2. حذف جميع الأسئلة والاختيارات القديمة لهذا الشيت (لإعادة بنائها)
        // ملاحظة: الصور القديمة لن تُحذف من السيرفر لأننا سنعيد استخدام مساراتها إذا لم تتغير
        $conn->prepare("DELETE FROM question_choices WHERE question_id IN (SELECT id FROM questions WHERE sheet_id = ?)")->execute([$sheet_id]);
        $conn->prepare("DELETE FROM questions WHERE sheet_id = ?")->execute([$sheet_id]);

        // 3. إعادة إدخال الأسئلة
        if (isset($_POST['questions']) && is_array($_POST['questions'])) {
            
            foreach ($_POST['questions'] as $index => $qData) {
                
                $q_text = $qData['text'];
                $q_degree = $qData['degree'];
                $ans_type = $qData['type'];
                $correct_answer = isset($qData['correct_answer']) ? $qData['correct_answer'] : '';
                
                // التعامل مع الصورة
                $q_image_path = isset($qData['old_image']) ? $qData['old_image'] : NULL;
                $q_type = (!empty($q_image_path)) ? 'image' : 'text';

                // إذا تم رفع صورة جديدة للسؤال
                if (isset($_FILES['questions']['name'][$index]['image']) && $_FILES['questions']['error'][$index]['image'] == 0) {
                    $q_type = 'image';
                    $upload_q_dir = '../uploads/questions/';
                    $f_tmp = $_FILES['questions']['tmp_name'][$index]['image'];
                    $ext = pathinfo($_FILES['questions']['name'][$index]['image'], PATHINFO_EXTENSION);
                    $new_q_name = uniqid() . '_q.' . $ext;

                    if (move_uploaded_file($f_tmp, $upload_q_dir . $new_q_name)) {
                        // حذف الصورة القديمة إذا استبدلت
                        if ($q_image_path && file_exists("../" . $q_image_path)) unlink("../" . $q_image_path);
                        $q_image_path = 'uploads/questions/' . $new_q_name;
                    }
                }

                // إدخال السؤال الجديد
                $sql_q = "INSERT INTO questions (sheet_id, question_text, question_type, answer_type, marks, correct_answer, image_path) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt_q = $conn->prepare($sql_q);
                $stmt_q->execute([$sheet_id, $q_text, $q_type, $ans_type, $q_degree, $correct_answer, $q_image_path]);
                
                $question_id = $conn->lastInsertId();

                // حفظ الاختيارات
                if ($ans_type == 'mcq' && isset($qData['choices']) && is_array($qData['choices'])) {
                    $sql_choice = "INSERT INTO question_choices (question_id, choice_text) VALUES (?, ?)";
                    $stmt_choice = $conn->prepare($sql_choice);
                    foreach ($qData['choices'] as $choice_text) {
                        if (!empty(trim($choice_text))) {
                            $stmt_choice->execute([$question_id, $choice_text]);
                        }
                    }
                }
            }
        }

        $conn->commit();
        echo "<script>alert('تم تعديل الشيت بنجاح!'); window.location.href = 'view_sheets.php';</script>";

    } catch (Exception $e) {
        $conn->rollBack();
        echo "<script>alert('خطأ: " . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }

} else {
    header("Location: view_sheets.php");
    exit();
}
?>