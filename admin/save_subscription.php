<?php
session_start();
include '../db_connect.php';

// 1. حماية الملف
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. معالجة الطلب
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // استقبال البيانات من النموذج
    $student_id = $_POST['student_id'];
    $type = $_POST['type']; // class or unit
    $class_id = $_POST['class_id'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    
    // معالجة الحقول الاختيارية
    $price = !empty($_POST['price']) ? $_POST['price'] : 0;
    $unit_id = !empty($_POST['unit_id']) ? $_POST['unit_id'] : NULL;

    // منطق إضافي: إذا كان الاشتراك "صف كامل"، نجعل الوحدة NULL
    if ($type == 'class') {
        $unit_id = NULL;
    }

    try {
        // جملة الإدخال
        // نلاحظ هنا أننا نضع الحالة 'active' و is_active = 1 مباشرة لأن الإضافة يدوية
        // ونضع طريقة الدفع 'manual' للتوثيق
        $sql = "INSERT INTO subscriptions 
                (student_id, class_id, unit_id, type, price, start_date, end_date, status, is_active, payment_method) 
                VALUES 
                (:sid, :cid, :uid, :type, :price, :sdate, :edate, 'active', 1, 'manual')";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':sid'   => $student_id,
            ':cid'   => $class_id,
            ':uid'   => $unit_id,
            ':type'  => $type,
            ':price' => $price,
            ':sdate' => $start_date,
            ':edate' => $end_date
        ]);

        // رسالة النجاح
        echo "<script>
                alert('تم تفعيل الاشتراك للطالب بنجاح!');
                window.location.href='view_subscriptions.php';
              </script>";

    } catch (PDOException $e) {
        // رسالة الخطأ
        echo "<script>
                alert('حدث خطأ أثناء الحفظ: " . addslashes($e->getMessage()) . "');
                window.history.back();
              </script>";
    }

} else {
    // إذا حاول شخص فتح الملف مباشرة بدون إرسال بيانات
    header("Location: add_subscription.php");
    exit();
}
?>