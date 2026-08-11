<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $salary = $_POST['salary'];
    $image_path = $_POST['old_image'];

    // التعامل مع الباسورد
    $password_sql = "";
    $params = [$name, $email, $phone, $salary];

    if (!empty($_POST['password'])) {
        $password_sql = ", password=?";
        $params[] = $_POST['password'];
    }

    // التعامل مع الصورة
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/assistants/';
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_assist.' . $file_ext;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $new_name)) {
            if (!empty($image_path) && file_exists("../" . $image_path)) unlink("../" . $image_path);
            $image_path = 'uploads/assistants/' . $new_name;
        }
    }
    $params[] = $image_path;
    $params[] = $id;

    $sql = "UPDATE admins SET name=?, email=?, phone=?, salary=? $password_sql , image=? WHERE id=? AND role='assistant'";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    header("Location: view_assistants.php");
    exit();
}
?>