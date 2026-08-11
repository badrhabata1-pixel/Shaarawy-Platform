<?php
session_start();
include '../db_connect.php';

if (!isset($_GET['id'])) {
    header("Location: view_classes.php");
    exit();
}

$id = $_GET['id'];
$stmt = $conn->prepare("SELECT * FROM academic_years WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$class = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$class) {
    die("الصف غير موجود");
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل صف دراسي | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root { 
            --main-red: #DB1F41; 
            --dark-grey: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        .box.box-purple { border-top: 4px solid var(--main-yellow); padding: 20px; background: #fff; }
        .btn-submit { background-color: var(--main-red); color: white; border-radius: 50px; padding: 10px 40px; border: none; font-weight: bold; }
        .btn-submit:hover { background-color: var(--dark-grey); color: var(--main-yellow); }
    </style>
</head>
<body class="skin-blue sidebar-mini">
<div class="wrapper">
    <header class="main-header">
         <a href="dashboard.php" class="logo">
             <span class="logo-mini"><b>أ</b> غ</span>
             <span class="logo-lg"><b>احياء</b> غنيم</span>
         </a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu"></a></nav>
    </header>
    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header"><h1>تعديل الصف الدراسي</h1></section>
        <section class="content">
            <div class="col-md-8 col-md-offset-2">
                <div class="box box-purple">
                    <form action="update_class.php" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo $class['id']; ?>">
                        <input type="hidden" name="old_image" value="<?php echo $class['image']; ?>">
                        
                        <div class="form-group">
                            <label>اسم الصف</label>
                            <input type="text" class="form-control" name="name" value="<?php echo htmlspecialchars($class['name']); ?>" required>
                        </div>
                        <div class="form-group">
                            <label>السعر</label>
                            <input type="number" class="form-control" name="price" value="<?php echo $class['price']; ?>" required>
                        </div>
                        <div class="form-group">
                            <label>الوصف</label>
                            <textarea class="form-control" name="description" rows="3"><?php echo htmlspecialchars($class['description']); ?></textarea>
                        </div>
                        <div class="form-group">
                            <label>الصورة الحالية</label><br>
                            <?php if(!empty($class['image'])): ?>
                                <img src="../<?php echo $class['image']; ?>" width="100" style="border-radius:10px; border: 2px solid var(--main-yellow);">
                            <?php else: echo "لا توجد صورة"; endif; ?>
                            <br><br>
                            <label>تغيير الصورة (اختياري)</label>
                            <input type="file" class="form-control" name="image">
                        </div>
                        
                        <div class="text-center">
                            <button type="submit" class="btn btn-submit">حفظ التعديلات</button>
                        </div>
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