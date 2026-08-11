<?php
session_start();
include '../db_connect.php';

// 1. حماية الملف: التأكد من أن المستخدم مسجل دخول
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. التحقق من طريقة الطلب
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات الأساسية
    $id = $_POST['id'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $academic_year_id = $_POST['academic_year_id'];
    $term = $_POST['term'];
    
    // استقبال مسار الصورة القديمة (للاحتفاظ به في حال عدم التغيير)
    $image_path = $_POST['old_image'];

    // 3. معالجة الصورة الجديدة (إذا وجدت)
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = '../uploads/units/';
        
        // الحصول على الامتداد
        $file_ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        // إنشاء اسم جديد فريد
        $new_name = uniqid() . '_unit.' . $file_ext;
        $target_file = $upload_dir . $new_name;

        // رفع الملف الجديد
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            // حذف الصورة القديمة من السيرفر لتوفير المساحة
            if (!empty($image_path) && file_exists("../" . $image_path)) {
                unlink("../" . $image_path);
            }
            // تحديث المسار ليتم حفظه في القاعدة
            $image_path = 'uploads/units/' . $new_name;
        }
    }

    try {
        // 4. تحديث البيانات في قاعدة البيانات
        // لاحظ: لم نقم بتحديث عمود price لأنه تم إلغاؤه من المنطق
        $sql = "UPDATE units SET 
                title = :title, 
                description = :description, 
                academic_year_id = :academic_year_id, 
                term = :term, 
                image = :image 
                WHERE id = :id";
        
        $stmt = $conn->prepare($sql);
        
        $stmt->execute([
            ':title' => $title,
            ':description' => $description,
            ':academic_year_id' => $academic_year_id,
            ':term' => $term,
            ':image' => $image_path,
            ':id' => $id
        ]);

        // رسالة نجاح وإعادة توجيه
        echo "<script>
                alert('تم تعديل بيانات الوحدة بنجاح!');
                window.location.href = 'view_units.php';
              </script>";

    } catch (PDOException $e) {
        // رسالة خطأ
        echo "<script>
                alert('حدث خطأ أثناء التحديث: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    // إذا تم فتح الملف مباشرة
    header("Location: view_units.php");
    exit();
}
?>