<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $desc = $_POST['description'];
    $year_id = $_POST['academic_year_id'];
    $hour = $_POST['hour'];
    $assist_id = !empty($_POST['assistant_id']) ? $_POST['assistant_id'] : NULL;
    $s_date = $_POST['start_date'];
    $e_date = $_POST['end_date'];
    $loop = $_POST['loop'];
    $old_image = $_POST['old_image'];

    $image_path = $old_image;

    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/groups/';
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_group.' . $file_ext;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $new_name)) {
            $image_path = 'uploads/groups/' . $new_name;
            if (!empty($old_image) && file_exists("../" . $old_image)) unlink("../" . $old_image);
        }
    }

    try {
        $sql = "UPDATE groups SET name=?, description=?, academic_year_id=?, hour=?, assistant_id=?, start_date=?, end_date=?, attendance_type=?, image=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $desc, $year_id, $hour, $assist_id, $s_date, $e_date, $loop, $image_path, $id]);
        echo "<script>alert('تم التعديل بنجاح'); window.location.href='view_groups.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('خطأ'); window.history.back();</script>";
    }
}
?>