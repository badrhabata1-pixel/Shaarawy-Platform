<?php
// المسار: admin/save_exam.php
session_start();
include '../db_connect.php';

// 1. التحقق من الصلاحيات
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    try {
        // بدء المعاملة لضمان حفظ كل البيانات أو لا شيء
        $conn->beginTransaction();

        // 2. استقبال البيانات الأساسية
        $name = $_POST['name'];
        $class_id = $_POST['class_id']; // الحقل الجديد
        // إذا كان lesson_id فارغاً، نرسل NULL لقاعدة البيانات
        $lesson_id = !empty($_POST['lesson_id']) ? $_POST['lesson_id'] : NULL;
        
        $total_degree = $_POST['total_degree'];
        $time_limit = $_POST['time_limit'];
        $description = $_POST['description'];
        $exam_type = $_POST['exam_type'];
        
        // التواريخ (فقط إذا كان الامتحان محدداً بوقت)
        $start_at = ($exam_type == 'closed') ? $_POST['start_at'] : NULL;
        $end_at = ($exam_type == 'closed') ? $_POST['end_at'] : NULL;

        // 3. رفع صورة غلاف الامتحان
        $image_path = NULL;
        if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $upload_dir = '../uploads/exams/';
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
            
            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $new_name = uniqid() . '_exam.' . $ext;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $new_name)) {
                $image_path = 'uploads/exams/' . $new_name;
            }
        }

        // 4. إدخال بيانات الامتحان في الجدول
        $sql = "INSERT INTO exams 
                (title, class_id, lesson_id, description, time_limit_minutes, total_marks, exam_type, start_time, end_time, image) 
                VALUES 
                (:title, :class_id, :lesson_id, :desc, :time, :total, :type, :start, :end, :img)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':title' => $name,
            ':class_id' => $class_id,
            ':lesson_id' => $lesson_id,
            ':desc' => $description,
            ':time' => $time_limit,
            ':total' => $total_degree,
            ':type' => $exam_type,
            ':start' => $start_at,
            ':end' => $end_at,
            ':img' => $image_path
        ]);
        
        // الحصول على ID الامتحان الجديد
        $exam_id = $conn->lastInsertId();

        // 5. حفظ الأسئلة
        if (isset($_POST['questions']) && is_array($_POST['questions'])) {
            
            foreach ($_POST['questions'] as $index => $qData) {
                
                $q_text = $qData['text'];
                $q_degree = $qData['degree'];
                $ans_type = $qData['type']; // mcq or essay
                $correct_answer = isset($qData['correct_answer']) ? $qData['correct_answer'] : '';
                
                // معالجة صورة السؤال
                $q_image_path = NULL;
                $q_type = 'text'; // الافتراضي نص

                // إذا تم رفع صورة للسؤال
                if (isset($_FILES['questions']['name'][$index]['image']) && $_FILES['questions']['error'][$index]['image'] == 0) {
                    $q_type = 'image';
                    $upload_q_dir = '../uploads/questions/';
                    if (!is_dir($upload_q_dir)) mkdir($upload_q_dir, 0777, true);
                    
                    $ext = pathinfo($_FILES['questions']['name'][$index]['image'], PATHINFO_EXTENSION);
                    $new_q_name = uniqid() . '_q_exam.' . $ext;
                    
                    if (move_uploaded_file($_FILES['questions']['tmp_name'][$index]['image'], $upload_q_dir . $new_q_name)) {
                        $q_image_path = 'uploads/questions/' . $new_q_name;
                    }
                }

                // إدخال السؤال (sheet_id يكون NULL)
                $sql_q = "INSERT INTO questions 
                          (exam_id, sheet_id, question_text, question_type, answer_type, marks, correct_answer, image_path) 
                          VALUES 
                          (:eid, NULL, :txt, :qtype, :atype, :marks, :correct, :img)";
                
                $stmt_q = $conn->prepare($sql_q);
                $stmt_q->execute([
                    ':eid' => $exam_id,
                    ':txt' => $q_text,
                    ':qtype' => $q_type,
                    ':atype' => $ans_type,
                    ':marks' => $q_degree,
                    ':correct' => $correct_answer,
                    ':img' => $q_image_path
                ]);
                
                $question_id = $conn->lastInsertId();

                // 6. حفظ الاختيارات (لأسئلة MCQ فقط)
                if ($ans_type == 'mcq' && isset($qData['choices']) && is_array($qData['choices'])) {
                    $sql_choice = "INSERT INTO question_choices (question_id, choice_text) VALUES (?, ?)";
                    $stmt_choice = $conn->prepare($sql_choice);
                    
                    foreach ($qData['choices'] as $choice) {
                        if (!empty(trim($choice))) {
                            $stmt_choice->execute([$question_id, $choice]);
                        }
                    }
                }
            }
        }

        // إتمام المعاملة
        $conn->commit();
        echo "<script>alert('تم إضافة الامتحان بنجاح!'); window.location.href='add_exam.php';</script>";

    } catch (Exception $e) {
        // التراجع في حالة الخطأ
        $conn->rollBack();
        echo "<script>alert('حدث خطأ أثناء الحفظ: " . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }
} else {
    header("Location: add_exam.php");
    exit();
}
?>