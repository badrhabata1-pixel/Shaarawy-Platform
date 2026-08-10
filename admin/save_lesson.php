<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات النصية
    $title = $_POST['title'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $video_url = $_POST['video_url'];
    $lesson_number = $_POST['lesson_number'];
    $unit_id = $_POST['unit_id'];

    // دالة مساعدة لرفع الملفات
    function uploadFile($fileInputName, $folder, $prefix) {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] == 0) {
            $upload_dir = '../uploads/' . $folder . '/';
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
            
            $file_ext = pathinfo($_FILES[$fileInputName]['name'], PATHINFO_EXTENSION);
            $new_name = uniqid() . '_' . $prefix . '.' . $file_ext;
            $target_file = $upload_dir . $new_name;

            if (move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $target_file)) {
                return 'uploads/' . $folder . '/' . $new_name;
            }
        }
        return NULL;
    }

    // رفع الملفات
    $image_path = uploadFile('image', 'lessons', 'img');
    $pdf_path_1 = uploadFile('pdf_file', 'pdfs', 'doc1');
    $pdf_path_2 = uploadFile('pdf_file_2', 'pdfs', 'doc2');

    try {
        $sql = "INSERT INTO lessons 
        (title, price, description, image, pdf_file, pdf_file_2, video_url, lesson_number, unit_id) 
        VALUES 
        (:title, :price, :desc, :img, :pdf1, :pdf2, :vid, :num, :uid)";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':title' => $title,
            ':price' => $price,
            ':desc' => $description,
            ':img' => $image_path,
            ':pdf1' => $pdf_path_1,
            ':pdf2' => $pdf_path_2,
            ':vid' => $video_url,
            ':num' => $lesson_number,
            ':uid' => $unit_id
        ]);

        echo "<script>alert('تم إضافة الدرس بنجاح!'); window.location.href='add_lesson.php';</script>";

    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ: " . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }
}
?>