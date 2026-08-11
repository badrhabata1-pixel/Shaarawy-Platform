<?php
session_start();
include '../db_connect.php';

// 1. حماية الملف: التأكد من أن المستخدم هو المعلم
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. معالجة البيانات عند إرسال النموذج
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات النصية
    $title = $_POST['title'];
    $description = $_POST['description'];
    $academic_year_id = $_POST['academic_year_id'];
    $term = $_POST['term'];
    
    // تحديد السعر بصفر تلقائياً (لأننا أزلنا الحقل من الواجهة)
    $price = 0; 

    // معالجة رفع الصورة
    $image_path = NULL;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/units/';
        
        // إنشاء المجلد إذا لم يكن موجوداً
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_name = uniqid() . '_unit.' . $file_ext; // اسم فريد للصورة
        $target_file = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            // تخزين المسار النسبي في قاعدة البيانات
            $image_path = 'uploads/units/' . $new_name;
        }
    }

    try {
        // جملة الإدخال في قاعدة البيانات
        $sql = "INSERT INTO units 
                (title, price, description, academic_year_id, term, image) 
                VALUES 
                (:title, :price, :description, :academic_year_id, :term, :image)";
        
        $stmt = $conn->prepare($sql);
        
        // تنفيذ الاستعلام
        $stmt->execute([
            ':title' => $title,
            ':price' => $price, // القيمة 0
            ':description' => $description,
            ':academic_year_id' => $academic_year_id,
            ':term' => $term,
            ':image' => $image_path
        ]);

        // رسالة نجاح وإعادة توجيه
        echo "<script>
                alert('تم إضافة الوحدة الدراسية بنجاح!');
                window.location.href = 'add_unit.php';
              </script>";

    } catch (PDOException $e) {
        // رسالة خطأ في حال فشل الاتصال بالقاعدة
        echo "<script>
                alert('حدث خطأ أثناء الحفظ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    // إذا حاول شخص فتح الملف مباشرة دون إرسال بيانات
    header("Location: add_unit.php");
    exit();
}
?>