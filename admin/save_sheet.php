<?php
session_start();
include '../db_connect.php';

// التأكد من الصلاحيات
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    try {
        // 1. بدء المعاملة (Transaction) لضمان حفظ كل البيانات أو لا شيء
        $conn->beginTransaction();

        // --- أولاً: حفظ بيانات الشيت الأساسية ---
        $name = $_POST['name'];
        $lesson_id = $_POST['lesson_id'];
        $total_degree = $_POST['total_degree'];
        $description = $_POST['description'];

        // رفع ملف PDF الشيت (إن وجد)
        $sheet_pdf_path = NULL;
        if (isset($_FILES['sheet_pdf']) && $_FILES['sheet_pdf']['error'] == 0) {
            $upload_dir = '../uploads/sheets/';
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
            
            $file_ext = pathinfo($_FILES['sheet_pdf']['name'], PATHINFO_EXTENSION);
            $new_name = uniqid() . '_sheet.' . $file_ext;
            if (move_uploaded_file($_FILES['sheet_pdf']['tmp_name'], $upload_dir . $new_name)) {
                $sheet_pdf_path = 'uploads/sheets/' . $new_name;
            }
        }

        // إدخال الشيت في قاعدة البيانات
        $sql_sheet = "INSERT INTO sheets (title, lesson_id, description, file_path, total_marks) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql_sheet);
        $stmt->execute([$name, $lesson_id, $description, $sheet_pdf_path, $total_degree]);
        
        // الحصول على ID الشيت الذي تم إنشاؤه للتو لربط الأسئلة به
        $sheet_id = $conn->lastInsertId();

        // --- ثانياً: حفظ الأسئلة (Loop) ---
        if (isset($_POST['questions']) && is_array($_POST['questions'])) {
            
            foreach ($_POST['questions'] as $index => $qData) {
                
                $q_text = $qData['text']; // نص السؤال
                $q_degree = $qData['degree'];
                $ans_type = $qData['type']; // essay or mcq
                $correct_answer = isset($qData['correct_answer']) ? $qData['correct_answer'] : '';
                
                // تحديد نوع السؤال (نص أم صورة) بناءً على ما إذا تم رفع ملف
                // التعامل مع مصفوفة الملفات المعقدة في PHP
                $q_image_path = NULL;
                $q_type = 'text';

                // فحص إذا كان هناك صورة مرفوعة لهذا السؤال تحديداً
                // $_FILES['questions']['name'][$index]['image']
                if (isset($_FILES['questions']['name'][$index]['image']) && $_FILES['questions']['error'][$index]['image'] == 0) {
                    
                    $q_type = 'image'; // تغيير نوع السؤال إلى صورة
                    $upload_q_dir = '../uploads/questions/';
                    if (!is_dir($upload_q_dir)) mkdir($upload_q_dir, 0777, true);

                    $f_name = $_FILES['questions']['name'][$index]['image'];
                    $f_tmp = $_FILES['questions']['tmp_name'][$index]['image'];
                    $ext = pathinfo($f_name, PATHINFO_EXTENSION);
                    $new_q_name = uniqid() . '_q.' . $ext;

                    if (move_uploaded_file($f_tmp, $upload_q_dir . $new_q_name)) {
                        $q_image_path = 'uploads/questions/' . $new_q_name;
                    }
                }

                // إدخال السؤال
                $sql_q = "INSERT INTO questions (sheet_id, question_text, question_type, answer_type, marks, correct_answer, image_path) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt_q = $conn->prepare($sql_q);
                $stmt_q->execute([$sheet_id, $q_text, $q_type, $ans_type, $q_degree, $correct_answer, $q_image_path]);
                
                // الحصول على ID السؤال لربط الاختيارات به
                $question_id = $conn->lastInsertId();

                // --- ثالثاً: حفظ الاختيارات (إذا كان السؤال MCQ) ---
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

        // إتمام المعاملة وحفظ التغييرات
        $conn->commit();

        echo "<script>
                alert('تم حفظ الشيت والأسئلة بنجاح!');
                window.location.href = 'add_sheet.php';
              </script>";

    } catch (Exception $e) {
        // في حال حدوث أي خطأ، التراجع عن كل شيء (Rollback)
        $conn->rollBack();
        echo "<script>
                alert('حدث خطأ أثناء الحفظ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    header("Location: add_sheet.php");
    exit();
}
?>