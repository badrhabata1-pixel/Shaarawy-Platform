<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات
    $name = $_POST['name'];
    $description = $_POST['description'];
    $academic_year_id = $_POST['clas_id']; // اسم الحقل في الفورم
    $hour = $_POST['hour'];
    $assistant_id = !empty($_POST['assistant_id']) ? $_POST['assistant_id'] : NULL;
    $start_date = $_POST['start_date'];
    $attendance_type = $_POST['loop'];
    $end_date = $_POST['end_date'];

    // معالجة الصورة
    $image_path = NULL;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $upload_dir = '../uploads/groups/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $file_ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_group.' . $file_ext;
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
            $image_path = 'uploads/groups/' . $new_name;
        }
    }

    try {
        $sql = "INSERT INTO groups 
        (name, description, academic_year_id, hour, assistant_id, start_date, end_date, attendance_type, image) 
        VALUES 
        (:name, :desc, :class_id, :hour, :assist_id, :s_date, :e_date, :att_type, :img)";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':desc' => $description,
            ':class_id' => $academic_year_id,
            ':hour' => $hour,
            ':assist_id' => $assistant_id,
            ':s_date' => $start_date,
            ':e_date' => $end_date,
            ':att_type' => $attendance_type,
            ':img' => $image_path
        ]);

        echo "<script>alert('تم إضافة المجموعة بنجاح!'); window.location.href='add_group.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ: " . $e->getMessage() . "'); window.history.back();</script>";
    }
}
?>