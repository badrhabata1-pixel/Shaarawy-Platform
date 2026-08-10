<?php
session_start();
include '../db_connect.php';

if (!isset($_GET['id'])) header("Location: view_students.php");
$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM students WHERE id = :id");
$stmt->execute([':id' => $id]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

// جلب القوائم
$academic_years = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);
$groups = $conn->query("SELECT * FROM groups")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل بيانات الطالب | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style> 
        body { font-family: 'Cairo', sans-serif !important; } 
        /* الهوية الجديدة */
        .skin-blue .main-header .navbar { background-color: #DB1F41 !important; }
        .skin-blue .main-header .logo { background-color: #3B525C !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        .box-purple { border-top: 4px solid #DCD001 !important; padding: 20px; background: #fff; } 
        .btn-primary { background-color: #DB1F41 !important; border: none; font-weight: bold; }
        .btn-primary:hover { background-color: #3B525C !important; color: #DCD001 !important; }
    </style>
</head>
<body class="skin-blue sidebar-mini">
<div class="wrapper">
     <header class="main-header">
        <a href="dashboard.php" class="logo">
            <span class="logo-mini"><b>أ</b> غ</span>
            <span class="logo-lg"><b>احياء</b> غنيم</span>
        </a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"></a></nav>
    </header>
    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header"><h1>تعديل بيانات الطالب</h1></section>
        <section class="content">
            <div class="col-md-8 col-md-offset-2">
                <div class="box box-purple">
                    <form action="update_student.php" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo $student['id']; ?>">
                        <input type="hidden" name="old_image" value="<?php echo $student['image']; ?>">

                        <div class="form-group">
                            <label>اسم الطالب</label>
                            <input type="text" class="form-control" name="name" value="<?php echo htmlspecialchars($student['name']); ?>" required>
                        </div>

                        <div class="form-group">
                            <label>البريد الإلكتروني</label>
                            <input type="email" class="form-control" name="email" value="<?php echo htmlspecialchars($student['email']); ?>" required>
                        </div>

                        <div class="form-group">
                            <label>كلمة المرور (اتركها فارغة إذا لم ترد تغييرها)</label>
                            <input type="password" class="form-control" name="password" placeholder="******">
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label>رقم الطالب</label>
                                <input type="text" class="form-control" name="phone" value="<?php echo $student['phone']; ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label>رقم ولي الأمر</label>
                                <input type="text" class="form-control" name="parent_phone" value="<?php echo $student['parent_phone']; ?>" required>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-6">
                                <label>الصف الدراسي</label>
                                <select class="form-control" name="academic_year_id">
                                    <?php foreach($academic_years as $year): ?>
                                        <option value="<?php echo $year['id']; ?>" <?php if($year['id'] == $student['academic_year_id']) echo 'selected'; ?>>
                                            <?php echo $year['name']; ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label>المجموعة</label>
                                <select class="form-control" name="group_id">
                                    <?php foreach($groups as $grp): ?>
                                        <option value="<?php echo $grp['id']; ?>" <?php if($grp['id'] == $student['group_id']) echo 'selected'; ?>>
                                            <?php echo $grp['name']; ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-6">
                                <label>نوع الطالب</label>
                                <select class="form-control" name="student_type">
                                    <option value="offline" <?php if($student['student_type'] == 'offline') echo 'selected'; ?>>سنتر</option>
                                    <option value="online" <?php if($student['student_type'] == 'online') echo 'selected'; ?>>أونلاين</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label>المحافظة</label>
                                <select class="form-control" name="governorate">
                                    <option value="<?php echo $student['governorate']; ?>" selected><?php echo $student['governorate']; ?> (الحالية)</option>
                                    <option value="القاهرة">القاهرة</option>
                                    <option value="الجيزة">الجيزة</option>
                                    <option value="الإسكندرية">الإسكندرية</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>تغيير الصورة</label>
                            <input type="file" class="form-control" name="image">
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">حفظ التعديلات</button>
                    </form>
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