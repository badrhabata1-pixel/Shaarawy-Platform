<?php
// المسار: admin/add_reservation.php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// جلب المجموعات للقائمة المنسدلة
try {
    $groups = $conn->query("SELECT id, name FROM `groups`")->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("خطأ: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة حجز جديد | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === الهوية البصرية الجديدة === */
        :root { 
            --main-red: #DB1F41; 
            --dark-grey: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصندوق والحدود */
        .box-purple { border-top: 4px solid var(--main-yellow) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.08); background: #fff; }
        
        .form-group { margin-bottom: 20px; }
        .form-control { height: 45px; border-radius: 5px; }
        .form-control:focus { border-color: var(--main-red); box-shadow: none; }
        .form-horizontal .control-label { text-align: right; padding-top: 10px; font-weight: bold; color: var(--dark-grey); }
        
        /* الزر الرئيسي */
        .btn-submit {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white; padding: 12px 60px; border-radius: 50px; 
            border: none; font-weight: bold; font-size: 18px; transition: 0.3s;
        }
        .btn-submit:hover { transform: translateY(-2px); color: var(--main-yellow); box-shadow: 0 5px 15px rgba(219, 31, 65, 0.4); }
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
        <section class="content-header">
            <h1>إدارة الحجوزات <small>إضافة حجز جديد - احياء غنيم</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php">الرئيسية</a></li>
                <li><a href="view_reservations.php">الحجوزات</a></li>
                <li class="active">إضافة حجز</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-purple">
                        <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-address-card" style="color: var(--main-red);"></i> بيانات الطالب للحجز</h3>
                        </div>
                        
                        <div class="box-body">
                            <form class="form-horizontal" action="save_reservation.php" method="post">
                                
                                <!-- الاسم -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الاسم</label>
                                    <div class="col-sm-8">
                                        <input type="text" name="name" class="form-control" required placeholder="الاسم الثلاثي">
                                    </div>
                                </div>

                                <!-- الهاتف -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">رقم الهاتف</label>
                                    <div class="col-sm-8">
                                        <input type="number" name="phone" class="form-control" required placeholder="01xxxxxxxxx">
                                    </div>
                                </div>

                                <!-- العنوان -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">العنوان</label>
                                    <div class="col-sm-8">
                                        <input type="text" name="address" class="form-control" placeholder="المحافظة - المركز - القرية">
                                    </div>
                                </div>

                                <!-- المدرسة -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">المدرسة</label>
                                    <div class="col-sm-8">
                                        <input type="text" name="school" class="form-control" placeholder="اسم المدرسة">
                                    </div>
                                </div>

                                <!-- ولي الأمر -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">اسم ولي الأمر</label>
                                    <div class="col-sm-8">
                                        <input type="text" name="parent_name" class="form-control" placeholder="اسم الوالد">
                                    </div>
                                </div>

                                <!-- هاتف ولي الأمر -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">هاتف ولي الأمر</label>
                                    <div class="col-sm-8">
                                        <input type="number" name="parent_phone" class="form-control" placeholder="01xxxxxxxxx">
                                    </div>
                                </div>

                                <!-- المهنة -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">مهنة ولي الأمر</label>
                                    <div class="col-sm-8">
                                        <input type="text" name="parent_job" class="form-control" placeholder="المهنة">
                                    </div>
                                </div>

                                <!-- الكود -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">كود الطالب</label>
                                    <div class="col-sm-8">
                                        <input type="text" name="code" class="form-control" required placeholder="الكود الخاص بالسنتر">
                                    </div>
                                </div>

                                <!-- المجموعة -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">المجموعة</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="group_id" required>
                                            <option value="" disabled selected>-- اختر المجموعة --</option>
                                            <?php foreach ($groups as $group): ?>
                                                <option value="<?php echo $group['id']; ?>"><?php echo $group['name']; ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>

                                <!-- نوع الدراسة -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">نوع الدراسة</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="study_type">
                                            <option value="general">ثانوي عام</option>
                                            <option value="azhar">أزهر</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- الجنس -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الجنس</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="gender">
                                            <option value="">لم يتم التحديد</option>
                                            <option value="man">ذكر</option>
                                            <option value="woman">أنثى</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- حالة الدفع -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">حالة الدفع</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="payed">
                                            <option value="no">لم يتم الدفع</option>
                                            <option value="yes">تم الدفع</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- زر الحفظ -->
                                <div class="box-footer text-center">
                                    <button type="submit" class="btn-submit">حفظ الحجز الآن</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by Mr. Ghoneim Platform</strong></footer>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>
</body>
</html>