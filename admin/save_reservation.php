<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $school = $_POST['school'];
    $parent_name = $_POST['parent_name'];
    $parent_phone = $_POST['parent_phone'];
    $parent_job = $_POST['parent_job'];
    $code = $_POST['code'];
    $group_id = $_POST['group_id'];
    $study_type = $_POST['study_type'];
    $gender = $_POST['gender'];
    $is_paid = $_POST['payed'];

    try {
        $sql = "INSERT INTO reservations 
        (name, phone, address, school, parent_name, parent_phone, parent_job, code, group_id, study_type, gender, is_paid) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $name, $phone, $address, $school, $parent_name, $parent_phone, 
            $parent_job, $code, $group_id, $study_type, $gender, $is_paid
        ]);

        echo "<script>alert('تم إضافة الحجز بنجاح!'); window.location.href='add_reservation.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ: " . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }
}
?>