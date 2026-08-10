<?php
session_start();
include '../db_connect.php';

// التحقق من طريقة الطلب
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات
    $name = $_POST['name'];
    $price = $_POST['price'];
    $description = $_POST['description'];

    // معالجة الصورة
    $image_path = NULL;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/classes/'; // مجلد الصور
        
        // إنشاء المجلد إذا لم يكن موجوداً
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_class.' . $file_ext; // اسم فريد
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $image_path = 'uploads/classes/' . $new_name;
        }
    }

    try {
        // جملة الإدخال
        $sql = "INSERT INTO academic_years (name, price, description, image) VALUES (:name, :price, :description, :image)";
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':image', $image_path);
        
        $stmt->execute();

        echo "<script>
                alert('تم إضافة الصف الدراسي بنجاح!');
                window.location.href = 'add_class.php';
              </script>";

    } catch (PDOException $e) {
        echo "<script>
                alert('حدث خطأ أثناء الحفظ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    header("Location: add_class.php");
    exit();
}
?>