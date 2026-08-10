<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// جلب البيانات للقوائم المنسدلة
try {
    // جلب الصفوف الدراسية
    $academic_years = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);
    
    // جلب المساعدين
    $assistants = $conn->query("SELECT * FROM admins WHERE role = 'assistant'")->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    die("خطأ في جلب البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة مجموعة جديدة | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تخصيص الألوان الجديدة (أحمر - زيتي - أصفر) === */
        :root {
            --main-red: #DB1F41;
            --dark-grey: #3B525C;
            --light-bg: #f4f6f9;
            --main-yellow: #DCD001;
            --text-grey: #555;
        }

        body, h1, h2, h3, h4, label, input, select, textarea, button {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }

        /* الصندوق (Card) */
        .box.box-purple {
            border-top: 4px solid var(--main-yellow); /* التغيير للأصفر كما في صورة الجدول */
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            background: #fff;
            padding-bottom: 20px;
        }
        
        .box-header {
            background-color: #f9f9f9;
            color: var(--dark-grey);
            border-radius: 8px 8px 0 0;
            padding: 15px 20px;
            margin-bottom: 20px;
        }

        /* الحقول */
        .form-group label {
            color: var(--text-grey);
            font-weight: 700;
            margin-bottom: 8px;
        }

        .input-group-addon {
            background-color: var(--dark-grey);
            color: white;
            border-color: var(--dark-grey);
        }

        .form-control {
            border-radius: 0 4px 4px 0 !important;
            height: 45px;
            border: 1px solid #ddd;
            transition: all 0.3s;
        }

        .form-control:focus {
            border-color: var(--main-red);
            box-shadow: 0 0 8px rgba(219, 31, 65, 0.2);
        }

        /* تنسيق زر رفع الصورة */
        .file-input-wrapper {
            position: relative;
            overflow: hidden;
            border: 2px dashed #ddd;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            background: #f9f9f9;
            transition: 0.3s;
            cursor: pointer;
        }
        .file-input-wrapper:hover {
            border-color: var(--main-red);
            background: #fff5f6;
        }
        .file-input-wrapper input[type=file] {
            position: absolute;
            top: 0;
            right: 0;
            min-width: 100%;
            min-height: 100%;
            opacity: 0;
            cursor: pointer;
        }

        /* زر الحفظ */
        .btn-submit {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white;
            font-size: 18px;
            font-weight: bold;
            padding: 12px 60px;
            border-radius: 50px;
            border: none;
            box-shadow: 0 4px 15px rgba(219, 31, 65, 0.4);
            transition: all 0.3s ease;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            color: var(--main-yellow);
        }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <!-- الرأس -->
    <header class="main-header">
        <a href="dashboard.php" class="logo">
            <span class="logo-mini"><b>أ</b> غ</span>
            <span class="logo-lg"><b>احياء</b> غنيم</span>
        </a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"></a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="https://ui-avatars.com/api/?name=Ghoneim&background=DCD001&color=000" class="user-image" alt="User">
                            <span class="hidden-xs"><?php echo $_SESSION['admin_name']; ?></span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- القائمة الجانبية -->
    <?php include 'sidebar.php'; ?>

    <!-- المحتوى -->
    <div class="content-wrapper">
        <section class="content-header">
            <h1>إدارة المجموعات <small>احياء غنيم</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php"><i class="fa fa-dashboard"></i> الرئيسية</a></li>
                <li><a href="view_groups.php">المجموعات</a></li>
                <li class="active">إضافة مجموعة</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-purple">
                        
                        <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-users"></i> بيانات المجموعة الجديدة</h3>
                        </div>

                        <!-- بداية النموذج -->
                        <form role="form" action="save_group.php" method="post" enctype="multipart/form-data">
                            <div class="box-body">
                                
                                <!-- السطر الأول: الاسم + الوصف -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>اسم المجموعة</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-tag"></i></span>
                                                <input type="text" class="form-control" name="name" placeholder="مثال: مجموعة السبت - 10 صباحاً" required>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>وصف المجموعة</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-file-text-o"></i></span>
                                                <textarea class="form-control" name="description" rows="1" placeholder="ملاحظات حول المجموعة..." style="height: 45px;" required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- السطر الثاني: الصف + الساعة -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>الصف الدراسي</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-laptop"></i></span>
                                                <select class="form-control" name="clas_id" required>
                                                    <option value="" disabled selected>-- اختر الصف --</option>
                                                    <?php foreach ($academic_years as $year): ?>
                                                        <option value="<?php echo $year['id']; ?>"><?php echo $year['name']; ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>الساعة (بنظام 24)</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                                                <input type="number" class="form-control" name="hour" placeholder="مثال: 14 للساعة 2 ظهراً" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- السطر الثالث: المساعد + نوع الحضور -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>المساعد المسئول</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-user-secret"></i></span>
                                                <select class="form-control" name="assistant_id">
                                                    <option value="" selected>-- بدون مساعد --</option>
                                                    <?php foreach ($assistants as $assistant): ?>
                                                        <option value="<?php echo $assistant['id']; ?>"><?php echo $assistant['name']; ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>أيام الحضور</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-calendar-check-o"></i></span>
                                                <select class="form-control" name="loop" required>
                                                    <option value="1">سبت - اثنين - أربعاء</option> 
                                                    <option value="2">أحد - ثلاثاء - خميس</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- السطر الرابع: التواريخ -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>تاريخ البدء</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                                <input type="date" class="form-control" name="start_date" required value="<?php echo date('Y-m-d'); ?>">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>تاريخ الانتهاء</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-calendar-times-o"></i></span>
                                                <input type="date" class="form-control" name="end_date" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- السطر الخامس: الصورة -->
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>صورة المجموعة</label>
                                            <div class="file-input-wrapper">
                                                <span class="file-msg">
                                                    <i class="fa fa-image fa-2x"></i><br>
                                                    اضغط لاختيار صورة للمجموعة
                                                </span>
                                                <input type="file" name="photo" accept="image/*" required onchange="document.querySelector('.file-msg').innerHTML = '<i class=\'fa fa-check text-success\'></i> تم اختيار: ' + this.files[0].name;">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!-- /.box-body -->

                            <div class="box-footer text-center">
                                <button type="submit" class="btn-submit">
                                    <i class="fa fa-save"></i> حفظ المجموعة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <footer class="main-footer text-center">
        <strong>powered by KABOx / Mindly</strong>
    </footer>

</div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

</body>
</html>