<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $old_image = $_POST['old_image'];

    $image_path = $old_image;

    // هل تم رفع صورة جديدة؟
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/classes/';
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_class.' . $file_ext;
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $image_path = 'uploads/classes/' . $new_name;
            // حذف الصورة القديمة لتوفير المساحة
            if (!empty($old_image) && file_exists("../" . $old_image)) {
                unlink("../" . $old_image);
            }
        }
    }

    try {
        $sql = "UPDATE academic_years SET name=?, price=?, description=?, image=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $price, $description, $image_path, $id]);
        
        echo "<script>alert('تم تعديل الصف بنجاح'); window.location.href='view_classes.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ'); window.history.back();</script>";
    }
}
?>