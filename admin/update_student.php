<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $parent_phone = $_POST['parent_phone'];
    $academic_year_id = $_POST['academic_year_id'];
    $group_id = $_POST['group_id'];
    $student_type = $_POST['student_type'];
    $governorate = $_POST['governorate'];
    $image_path = $_POST['old_image'];

    // التعامل مع كلمة المرور
    // إذا كتب المستخدم كلمة مرور جديدة، نأخذها، وإلا نستخدم القديمة
    // ملاحظة: لجلب القديمة نحتاج استعلام، أو يمكننا بناء الجملة ديناميكياً
    // الأسهل هنا: إذا الحقل فارغ لا نحدثه
    $password_sql_part = "";
    $params = [$name, $email, $phone, $parent_phone, $academic_year_id, $group_id, $student_type, $governorate];

    if (!empty($_POST['password'])) {
        $password_sql_part = ", password=?";
        $params[] = $_POST['password'];
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/students/';
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_student.' . $file_ext;
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            if (!empty($image_path) && file_exists("../" . $image_path)) unlink("../" . $image_path);
            $image_path = 'uploads/students/' . $new_name;
        }
    }
    
    // إضافة الصورة للمصفوفة
    $params[] = $image_path;
    $params[] = $id; // للـ WHERE

    $sql = "UPDATE students SET name=?, email=?, phone=?, parent_phone=?, academic_year_id=?, group_id=?, student_type=?, governorate=? $password_sql_part , image=? WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    header("Location: view_students.php");
    exit();
}
?>