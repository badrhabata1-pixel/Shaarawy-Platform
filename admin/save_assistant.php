<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password']; // يفضل تشفيرها بـ password_hash في النسخ النهائية
    $salary = $_POST['salary'];
    $phone = $_POST['phone'];
    $role = 'assistant'; // نثبت الدور كمساعد

    // رفع الصورة
    $image_path = NULL;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/assistants/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_assist.' . $file_ext;
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $image_path = 'uploads/assistants/' . $new_name;
        }
    }

    try {
        // التحقق من عدم تكرار البريد الإلكتروني
        $check = $conn->prepare("SELECT id FROM admins WHERE email = :email");
        $check->execute([':email' => $email]);
        if ($check->rowCount() > 0) {
            echo "<script>alert('البريد الإلكتروني مسجل بالفعل'); window.history.back();</script>";
            exit();
        }

        $sql = "INSERT INTO admins 
                (name, email, password, salary, phone, role, image) 
                VALUES 
                (:name, :email, :password, :salary, :phone, :role, :image)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $password,
            ':salary' => $salary,
            ':phone' => $phone,
            ':role' => $role,
            ':image' => $image_path
        ]);

        echo "<script>
                alert('تم إضافة المساعد بنجاح!');
                window.location.href='add_assistant.php';
              </script>";

    } catch (PDOException $e) {
        echo "<script>
                alert('حدث خطأ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    header("Location: add_assistant.php");
    exit();
}
?>