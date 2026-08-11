<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') { 
    header("Location: login.html"); 
    exit(); 
}

// حذف تعليق
if (isset($_GET['delete_id'])) {
    $stmt = $conn->prepare("DELETE FROM comments WHERE id = :id");
    $stmt->execute([':id' => $_GET['delete_id']]);
    header("Location: view_comments.php");
    exit();
}

// جلب التعليقات
$sql = "SELECT comments.*, students.name AS student_name, lessons.title AS lesson_title
        FROM comments
        JOIN students ON comments.student_id = students.id
        JOIN lessons ON comments.lesson_id = lessons.id
        ORDER BY comments.id DESC";
$comments = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>التعليقات - احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Cairo', sans-serif !important; }
        /* اللون الأحمر للهيدر */
        .skin-blue .main-header .navbar { background-color: #DB1F41 !important; }
        /* اللون الزيتي الغامق للوجو */
        .skin-blue .main-header .logo { background-color: #3B525C !important; }
        /* اللون الأصفر للحدود العلوية للصناديق */
        .box { border-top: 4px solid #DCD001 !important; }
        /* تعديل لون الليبل (الدرس) ليناسب الهوية الجديدة */
        .label-primary { background-color: #3B525C !important; }
        .btn-danger { background-color: #DB1F41 !important; border-color: #DB1F41; }
    </style>
</head>
<body class="skin-blue sidebar-mini">
<div class="wrapper">
    <header class="main-header">
        <!-- تغيير الاسم هنا -->
        <a href="dashboard.php" class="logo"><span class="logo-lg"><b>احياء</b> غنيم</span></a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu"></a></nav>
    </header>
    
    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header"><h1>التعليقات على الدروس</h1></section>
        <section class="content">
            <div class="box">
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الطالب</th>
                                <th>الدرس</th>
                                <th style="width: 50%;">التعليق</th>
                                <th>التاريخ</th>
                                <th>حذف</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($comments as $index => $comm): ?>
                            <tr>
                                <td><?php echo $index + 1; ?></td>
                                <td style="font-weight:bold;"><?php echo htmlspecialchars($comm['student_name']); ?></td>
                                <td><span class="label label-primary"><?php echo htmlspecialchars($comm['lesson_title']); ?></span></td>
                                <td><?php echo htmlspecialchars($comm['comment']); ?></td>
                                <td><?php echo $comm['created_at']; ?></td>
                                <td>
                                    <a href="view_comments.php?delete_id=<?php echo $comm['id']; ?>" class="btn btn-danger btn-xs" onclick="return confirm('حذف التعليق؟')"><i class="fa fa-trash"></i></a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            <?php if(empty($comments)) echo "<tr><td colspan='6' class='text-center'>لا توجد تعليقات</td></tr>"; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by KABOx / Mindly</strong></footer>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>
</body>
</html>