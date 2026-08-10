<?php
session_start();
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // 1. استقبال البيانات النصية
    $id = $_POST['id'];
    $title = $_POST['title'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $video_url = $_POST['video_url'];
    $lesson_number = $_POST['lesson_number'];
    $sort_order = $_POST['sort_order'];
    $unit_id = $_POST['unit_id'];

    // المسارات القديمة (للحفاظ عليها إذا لم يتم رفع جديد)
    $image_path = $_POST['old_image'];
    $pdf1_path = $_POST['old_pdf1'];
    $pdf2_path = $_POST['old_pdf2'];

    // 2. دالة مساعدة لرفع الملف وحذف القديم
    function handleFileUpload($fileInputName, $folder, $prefix, $oldPath) {
        // إذا تم رفع ملف جديد
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] == 0) {
            $upload_dir = '../uploads/' . $folder . '/';
            $file_ext = pathinfo($_FILES[$fileInputName]['name'], PATHINFO_EXTENSION);
            $new_name = uniqid() . '_' . $prefix . '.' . $file_ext;
            $target_file = $upload_dir . $new_name;

            if (move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $target_file)) {
                // حذف الملف القديم إذا وجد
                if (!empty($oldPath) && file_exists("../" . $oldPath)) {
                    unlink("../" . $oldPath);
                }
                // إرجاع المسار الجديد
                return 'uploads/' . $folder . '/' . $new_name;
            }
        }
        // إذا لم يتم الرفع، أعد المسار القديم كما هو
        return $oldPath;
    }

    // 3. معالجة الملفات الثلاثة
    $image_path = handleFileUpload('image', 'lessons', 'img', $image_path);
    $pdf1_path = handleFileUpload('pdf_file', 'pdfs', 'doc1', $pdf1_path);
    $pdf2_path = handleFileUpload('pdf_file_2', 'pdfs', 'doc2', $pdf2_path);

    try {
        // 4. تحديث قاعدة البيانات
        $sql = "UPDATE lessons SET 
                title = :title, 
                price = :price, 
                description = :desc, 
                video_url = :vid, 
                lesson_number = :num, 
                sort_order = :sort, 
                unit_id = :uid, 
                image = :img, 
                pdf_file = :pdf1, 
                pdf_file_2 = :pdf2 
                WHERE id = :id";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':title' => $title,
            ':price' => $price,
            ':desc' => $description,
            ':vid' => $video_url,
            ':num' => $lesson_number,
            ':sort' => $sort_order,
            ':uid' => $unit_id,
            ':img' => $image_path,
            ':pdf1' => $pdf1_path,
            ':pdf2' => $pdf2_path,
            ':id' => $id
        ]);

        echo "<script>
                alert('تم تعديل الدرس بنجاح!');
                window.location.href='view_lessons.php';
              </script>";

    } catch (PDOException $e) {
        echo "<script>
                alert('حدث خطأ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }
} else {
    header("Location: view_lessons.php");
    exit();
}
?>