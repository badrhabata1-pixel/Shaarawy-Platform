<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    try {
        $conn->beginTransaction();

        $exam_id = $_POST['exam_id'];
        $name = $_POST['name'];
        $lesson_id = !empty($_POST['lesson_id']) ? $_POST['lesson_id'] : NULL;
        $total_degree = $_POST['total_degree'];
        $time_limit = $_POST['time_limit'];
        $description = $_POST['description'];
        $exam_type = $_POST['exam_type'];
        $start_at = ($exam_type == 'closed') ? $_POST['start_at'] : NULL;
        $end_at = ($exam_type == 'closed') ? $_POST['end_at'] : NULL;

        // الصورة
        $image_path = isset($_POST['old_image']) ? $_POST['old_image'] : NULL;
        if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $upload_dir = '../uploads/exams/';
            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $new_name = uniqid() . '_exam.' . $ext;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $new_name)) {
                if ($image_path && file_exists("../" . $image_path)) unlink("../" . $image_path);
                $image_path = 'uploads/exams/' . $new_name;
            }
        }

        // تحديث الامتحان
        $sql = "UPDATE exams SET title=?, lesson_id=?, description=?, time_limit_minutes=?, total_marks=?, exam_type=?, start_time=?, end_time=?, image=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $lesson_id, $description, $time_limit, $total_degree, $exam_type, $start_at, $end_at, $image_path, $exam_id]);

        // حذف الأسئلة القديمة وإعادة إدخالها
        $conn->prepare("DELETE FROM question_choices WHERE question_id IN (SELECT id FROM questions WHERE exam_id = ?)")->execute([$exam_id]);
        $conn->prepare("DELETE FROM questions WHERE exam_id = ?")->execute([$exam_id]);

        if (isset($_POST['questions']) && is_array($_POST['questions'])) {
            foreach ($_POST['questions'] as $index => $qData) {
                $q_text = $qData['text'];
                $q_degree = $qData['degree'];
                $ans_type = $qData['type'];
                $correct = isset($qData['correct_answer']) ? $qData['correct_answer'] : '';
                
                $q_image_path = isset($qData['old_image']) ? $qData['old_image'] : NULL;
                $q_type = (!empty($q_image_path)) ? 'image' : 'text';

                if (isset($_FILES['questions']['name'][$index]['image']) && $_FILES['questions']['error'][$index]['image'] == 0) {
                    $q_type = 'image';
                    $upload_q = '../uploads/questions/';
                    $ext = pathinfo($_FILES['questions']['name'][$index]['image'], PATHINFO_EXTENSION);
                    $new_q_name = uniqid() . '_q_exam.' . $ext;
                    if (move_uploaded_file($_FILES['questions']['tmp_name'][$index]['image'], $upload_q . $new_q_name)) {
                        if ($q_image_path && file_exists("../" . $q_image_path)) unlink("../" . $q_image_path);
                        $q_image_path = 'uploads/questions/' . $new_q_name;
                    }
                }

                $sql_q = "INSERT INTO questions (exam_id, sheet_id, question_text, question_type, answer_type, marks, correct_answer, image_path) VALUES (?, NULL, ?, ?, ?, ?, ?, ?)";
                $stmt_q = $conn->prepare($sql_q);
                $stmt_q->execute([$exam_id, $q_text, $q_type, $ans_type, $q_degree, $correct, $q_image_path]);
                
                $qid = $conn->lastInsertId();

                if ($ans_type == 'mcq' && isset($qData['choices'])) {
                    $stmt_c = $conn->prepare("INSERT INTO question_choices (question_id, choice_text) VALUES (?, ?)");
                    foreach ($qData['choices'] as $ch) {
                        if (!empty(trim($ch))) $stmt_c->execute([$qid, $ch]);
                    }
                }
            }
        }

        $conn->commit();
        echo "<script>alert('تم تعديل الامتحان بنجاح'); window.location.href='view_exams.php';</script>";

    } catch (Exception $e) {
        $conn->rollBack();
        echo "<script>alert('خطأ: " . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }
}
?>