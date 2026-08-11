<?php
session_start();
include '../db_connect.php';

// التأكد من أن الطلب POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات
    $name = $_POST['name'];
    $email = $_POST['email'];
    $raw_password = $_POST['password']; // كلمة المرور الخام
    $phone = $_POST['phone'];
    $parent_phone = $_POST['parent_phone'];
    $academic_year_id = $_POST['academic_year_id'];
    $group_id = !empty($_POST['group_id']) ? $_POST['group_id'] : NULL; // قد يكون فارغاً للأونلاين
    $student_type = $_POST['student_type'];
    $governorate = $_POST['governorate'];

    // === التصحيح هنا: تشفير كلمة المرور ===
    $password = password_hash($raw_password, PASSWORD_DEFAULT);

    // معالجة الصورة
    $image_path = NULL;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/students/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '.' . $file_ext;
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $image_path = 'uploads/students/' . $new_name;
        }
    }

    try {
        // جملة الإدخال (لاحظ أننا نمرر $password المشفرة)
        // ونقوم بتفعيل الحساب فوراً (is_active = 1) لأن المعلم هو من أضافه
        $sql = "INSERT INTO students 
                (name, email, password, phone, parent_phone, academic_year_id, group_id, student_type, governorate, image, is_active) 
                VALUES 
                (:name, :email, :password, :phone, :parent_phone, :academic_year_id, :group_id, :student_type, :governorate, :image, 1)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $password, // هنا نرسل المشفرة
            ':phone' => $phone,
            ':parent_phone' => $parent_phone,
            ':academic_year_id' => $academic_year_id,
            ':group_id' => $group_id,
            ':student_type' => $student_type,
            ':governorate' => $governorate,
            ':image' => $image_path
        ]);

        echo "<script>
                alert('تم إضافة الطالب وتفعيل حسابه بنجاح!');
                window.location.href = 'add_student.php';
              </script>";

    } catch (PDOException $e) {
        echo "<script>
                alert('حدث خطأ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    header("Location: add_student.php");
    exit();
}
?>