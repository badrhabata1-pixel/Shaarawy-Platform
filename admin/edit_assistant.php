<?php
session_start();
include '../db_connect.php';

if (!isset($_GET['id'])) { header("Location: view_assistants.php"); exit(); }

$id = $_GET['id'];
$stmt = $conn->prepare("SELECT * FROM admins WHERE id = :id AND role = 'assistant'");
$stmt->execute([':id' => $id]);
$assistant = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$assistant) die("المساعد غير موجود");
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل المساعد | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Cairo', sans-serif !important; }
        /* الهوية الجديدة: أحمر للشريط، زيتي للوجو، أصفر للحدود */
        .skin-blue .main-header .navbar { background-color: #DB1F41 !important; }
        .skin-blue .main-header .logo { background-color: #3B525C !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* لون الصندوق والزر */
        .box.box-primary { border-top-color: #DCD001 !important; }
        .btn-primary { background-color: #DB1F41 !important; border: none; font-weight: bold; }
        .btn-primary:hover { background-color: #b01833 !important; }
        
        label { color: #3B525C; }
    </style>
</head>
<body class="skin-blue sidebar-mini">
<div class="wrapper">
    <header class="main-header">
        <a href="dashboard.php" class="logo">
            <!-- نص صغير عند غلق القائمة -->
            <span class="logo-mini"><b>أ</b> غ</span>
            <!-- النص الكامل -->
            <span class="logo-lg"><b>احياء</b> غنيم</span>
        </a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
        </nav>
    </header>
    
    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header"><h1>تعديل بيانات المساعد</h1></section>
        <section class="content">
            <div class="box box-primary">
                <div class="box-body">
                    <form action="update_assistant.php" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo $assistant['id']; ?>">
                        <input type="hidden" name="old_image" value="<?php echo $assistant['image']; ?>">

                        <div class="form-group">
                            <label>الاسم</label>
                            <input type="text" class="form-control" name="name" value="<?php echo htmlspecialchars($assistant['name']); ?>" required>
                        </div>

                        <div class="form-group">
                            <label>البريد الإلكتروني</label>
                            <input type="email" class="form-control" name="email" value="<?php echo htmlspecialchars($assistant['email']); ?>" required>
                        </div>

                        <div class="form-group">
                            <label>كلمة المرور (اتركها فارغة لعدم التغيير)</label>
                            <input type="password" class="form-control" name="password" placeholder="******">
                        </div>

                        <div class="form-group">
                            <label>رقم الهاتف</label>
                            <input type="text" class="form-control" name="phone" value="<?php echo $assistant['phone']; ?>">
                        </div>

                        <div class="form-group">
                            <label>الراتب</label>
                            <input type="number" class="form-control" name="salary" value="<?php echo $assistant['salary']; ?>">
                        </div>

                        <div class="form-group">
                            <label>الصورة الحالية</label><br>
                            <?php if($assistant['image']): ?>
                                <img src="../<?php echo $assistant['image']; ?>" width="100" style="border-radius: 8px; border: 2px solid #DCD001;"><br><br>
                            <?php endif; ?>
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