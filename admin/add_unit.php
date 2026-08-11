<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. جلب الصفوف الدراسية للقائمة المنسدلة
try {
    $classes = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("خطأ: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة وحدة جديدة | أحياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- حل مشكلة الأيقونة -->
    <link rel="shortcut icon" href="#">

    <!-- ملفات CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تخصيص الثيم (أحياء غنيم) === */
        :root {
            --brand-slate: #3B525C;   /* كحلي مزرّق */
            --brand-dark-slate: #2C3E45; 
            --brand-red: #DB1F41;     /* أحمر */
            --brand-gold: #DCD001;    /* ذهبي */
        }

        body, h1, h2, h3, h4, label, input, select, textarea, button {
            font-family: 'Cairo', sans-serif !important;
        }

        .skin-blue .main-header .navbar { background-color: var(--brand-slate) !important; }
        .skin-blue .main-header .logo { background-color: var(--brand-dark-slate) !important; color: #fff; }
        .skin-blue .main-header .logo:hover { background-color: var(--brand-red) !important; }

        /* تنسيق الصندوق */
        .box.box-custom {
            border-top: 4px solid var(--brand-slate); /* بوردر علوي كحلي */
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            background: #fff;
        }
        
        .box-header {
            background-color: #f9f9f9;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        .box-header .fa {
            color: var(--brand-slate); /* أيقونة الهيدر كحلي */
        }

        /* تنسيق الحقول */
        .form-horizontal .control-label {
            text-align: right;
            color: #555;
            font-weight: bold;
        }
        
        .form-control {
            height: 45px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        
        .form-control:focus {
            border-color: var(--brand-red); /* أحمر عند التركيز */
            box-shadow: 0 0 5px rgba(219, 31, 65, 0.3);
        }

        /* زر الحفظ */
        .btn-submit {
            background: var(--brand-slate); /* خلفية كحلي */
            color: white;
            padding: 10px 50px;
            border-radius: 50px;
            border: none;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(59, 82, 92, 0.4);
            transition: 0.3s;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            background: var(--brand-red); /* أحمر عند التحويم */
            color: white;
            box-shadow: 0 6px 15px rgba(219, 31, 65, 0.4);
        }

        /* تنسيق رفع الملف */
        .file-input-wrapper {
            position: relative;
            overflow: hidden;
            border: 2px dashed #ddd;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            background: #fdfdfd;
            cursor: pointer;
            transition: 0.3s;
        }
        .file-input-wrapper:hover {
            border-color: var(--brand-gold); /* ذهبي عند التحويم */
            background: #fffcf0;
        }
        .file-input-wrapper input {
            position: absolute; top: 0; right: 0; min-width: 100%; min-height: 100%;
            opacity: 0; cursor: pointer;
        }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <header class="main-header">
        <a href="dashboard.php" class="logo"><span class="logo-lg"><b>أحياء</b> غنيم</span></a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu"></a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="https://ui-avatars.com/api/?name=Ghoneim&background=DCD001&color=3B525C" class="user-image" alt="User">
                            <span class="hidden-xs">Mr. Ghoneim</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header">
            <h1>إدارة الوحدات <small>إضافة وحدة جديدة</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php"><i class="fa fa-dashboard"></i> الرئيسية</a></li>
                <li><a href="view_units.php">الوحدات</a></li>
                <li class="active">إضافة وحدة</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-custom"> <!-- تم تغيير الكلاس هنا -->
                        <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-folder-open"></i> بيانات الوحدة الدراسية</h3>
                        </div>

                        <div class="box-body">
                            <!-- الفورم -->
                            <form class="form-horizontal" action="save_unit.php" method="post" enctype="multipart/form-data">
                                
                                <!-- اسم الوحدة -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">اسم الوحدة</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" name="title" required placeholder="مثال: الوحدة الأولى - التغذية في الكائنات الحية">
                                    </div>
                                </div>

                                <!-- الوصف -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">وصف الوحدة</label>
                                    <div class="col-sm-8">
                                        <textarea class="form-control" rows="3" name="description" required placeholder="نبذة مختصرة عن محتوى الوحدة..."></textarea>
                                    </div>
                                </div>

                                <!-- صورة الوحدة -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">صورة الوحدة</label>
                                    <div class="col-sm-8">
                                        <div class="file-input-wrapper">
                                            <i class="fa fa-image fa-2x" style="color: #ccc;"></i><br>
                                            اضغط هنا لاختيار صورة الغلاف
                                            <input type="file" name="image" required>
                                        </div>
                                    </div>
                                </div>

                                <!-- الصف الدراسي -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الصف الدراسي</label>
                                    <div class="col-sm-8">
                                        <select class="form-control select2" name="academic_year_id" required>
                                            <option value="" disabled selected>-- اختر الصف --</option>
                                            <?php foreach ($classes as $class): ?>
                                                <option value="<?php echo $class['id']; ?>"><?php echo $class['name']; ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>

                                <!-- الترم -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الفصل الدراسي (الترم)</label>
                                    <div class="col-sm-8">
                                        <select class="form-control select2" name="term" required>
                                            <option value="1">الترم الأول</option> 
                                            <option value="2">الترم الثاني</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- زر الحفظ -->
                                <div class="box-footer text-center">
                                    <button type="submit" class="btn-submit">
                                        <i class="fa fa-save"></i> حفظ وإضافة الوحدة
                                    </button>
                                </div>

                            </form>
                        </div><!-- /.box-body -->
                    </div><!-- /.box -->
                </div><!-- /.col -->
            </div><!-- /.row -->
        </section><!-- /.content -->
    </div><!-- /.content-wrapper -->

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