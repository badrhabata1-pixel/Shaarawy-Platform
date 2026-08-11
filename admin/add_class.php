<?php
session_start();
include '../db_connect.php';

// حماية الصفحة: التأكد من تسجيل الدخول
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة صف دراسي | أحياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- ملفات CSS الأساسية -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <!-- خط القاهرة -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تخصيص الألوان (باليتة أحياء غنيم) === */
        :root {
            --brand-slate: #3B525C;   /* كحلي مزرّق */
            --brand-dark-slate: #2C3E45; 
            --brand-red: #DB1F41;     /* أحمر */
            --brand-gold: #DCD001;    /* ذهبي */
            --light-bg: #f4f6f9;
            --light-slate: #eceff1;   /* خلفية فاتحة مشتقة من الكحلي */
            --text-grey: #555;
        }

        body, h1, h2, h3, h4, label, input, textarea, button, .box-title {
            font-family: 'Cairo', sans-serif !important;
        }

        /* تعديل الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--brand-slate) !important; }
        .skin-blue .main-header .logo { background-color: var(--brand-dark-slate) !important; color: #fff; }
        .skin-blue .main-header .logo:hover { background-color: var(--brand-red) !important; }

        /* تنسيق الصندوق (Card) */
        .box.box-custom {
            border-top: 4px solid var(--brand-slate); /* لون البوردر العلوي */
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            background: #fff;
            padding-bottom: 20px;
        }
        
        .box-header {
            background-color: var(--light-slate);
            color: var(--brand-slate);
            border-radius: 8px 8px 0 0;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        /* تنسيق الحقول */
        .form-group label {
            color: var(--text-grey);
            font-weight: 700;
            margin-bottom: 8px;
        }

        .input-group-addon {
            background-color: var(--brand-slate);
            color: white;
            border-color: var(--brand-slate);
        }

        .form-control {
            border-radius: 0 4px 4px 0 !important;
            height: 45px;
            font-size: 15px;
            border: 1px solid #ddd;
            transition: all 0.3s;
        }

        .form-control:focus {
            border-color: var(--brand-red); /* أحمر عند التركيز */
            box-shadow: 0 0 8px rgba(219, 31, 65, 0.2);
        }

        /* تنسيق زر الرفع (File Input) */
        .file-input-wrapper {
            position: relative;
            overflow: hidden;
            border: 2px dashed #ddd;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            background: #f9f9f9;
            transition: 0.3s;
        }
        .file-input-wrapper:hover {
            border-color: var(--brand-gold); /* ذهبي عند التحويم */
            background: #fffcf0;
        }
        .file-input-wrapper input[type=file] {
            position: absolute;
            top: 0;
            right: 0;
            min-width: 100%;
            min-height: 100%;
            font-size: 100px;
            text-align: right;
            filter: alpha(opacity=0);
            opacity: 0;
            outline: none;
            background: white;
            cursor: pointer;
            display: block;
        }
        .file-msg {
            color: #777;
            pointer-events: none;
        }
        .file-msg i {
            color: var(--brand-slate); /* لون الأيقونة */
        }

        /* زر الحفظ */
        .btn-submit {
            background-color: var(--brand-slate);
            color: white;
            font-size: 18px;
            font-weight: bold;
            padding: 12px 50px;
            border-radius: 50px;
            border: none;
            box-shadow: 0 4px 10px rgba(59, 82, 92, 0.4);
            transition: all 0.3s ease;
        }
        .btn-submit:hover {
            background-color: var(--brand-red);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(219, 31, 65, 0.4);
        }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <!-- الرأس (Header) -->
    <header class="main-header">
        <a href="dashboard.php" class="logo"><span class="logo-lg"><b>أحياء</b> غنيم</span></a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="https://ui-avatars.com/api/?name=Ghoneim&background=DCD001&color=3B525C" class="user-image" alt="User Image">
                            <span class="hidden-xs">Mr. Ghoneim</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- القائمة الجانبية (Sidebar) -->
    <?php include 'sidebar.php'; ?>

    <!-- المحتوى (Content) -->
    <div class="content-wrapper">
        <section class="content-header">
            <h1>إدارة الصفوف الدراسية <small>إضافة جديد</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php"><i class="fa fa-dashboard"></i> الرئيسية</a></li>
                <li><a href="view_classes.php">الصفوف الدراسية</a></li>
                <li class="active">إضافة صف</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-custom"> <!-- تم تغيير الكلاس هنا -->
                        
                        <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-plus-circle"></i> بيانات الصف الدراسي الجديد</h3>
                        </div>

                        <!-- بداية النموذج -->
                        <form role="form" action="save_class.php" method="post" enctype="multipart/form-data">
                            <div class="box-body">
                                
                                <div class="row">
                                    <!-- اسم الصف -->
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>اسم الصف الدراسي</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-laptop"></i></span>
                                                <input type="text" class="form-control" name="name" placeholder="مثال: الصف الأول الثانوي" required>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- السعر -->
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>سعر الاشتراك (بالجنيه)</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-money"></i></span>
                                                <input type="number" class="form-control" name="price" placeholder="مثال: 150" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <!-- الوصف -->
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>وصف الصف الدراسي</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-file-text-o"></i></span>
                                                <textarea class="form-control" name="description" rows="4" placeholder="اكتب وصفاً مختصراً لمحتوى الصف..." required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <!-- الصورة -->
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>صورة الغلاف</label>
                                            <div class="file-input-wrapper">
                                                <span class="file-msg">
                                                    <i class="fa fa-cloud-upload fa-3x"></i><br>
                                                    اضغط هنا لاختيار صورة أو قم بسحبها وإفلاتها
                                                </span>
                                                <input type="file" name="image" accept="image/*" required onchange="document.querySelector('.file-msg').innerHTML = '<i class=\'fa fa-check-circle fa-3x text-success\'></i><br> تم اختيار الملف: ' + this.files[0].name;">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!-- /.box-body -->

                            <div class="box-footer text-center">
                                <button type="submit" class="btn-submit">
                                    <i class="fa fa-save"></i> حفظ البيانات
                                </button>
                            </div>
                        </form>
                        <!-- نهاية النموذج -->

                    </div>
                </div>
            </div>
        </section>
    </div>

    <footer class="main-footer text-center">
        <strong>powerd by KABOx / Mindly</strong>
    </footer>

</div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

</body>
</html>