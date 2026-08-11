<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. جلب البيانات
try {
    // جلب الطلاب مع نوعهم (Online/Offline)
    $stmt_students = $conn->query("SELECT id, name, phone, student_type FROM students ORDER BY id DESC");
    $students = $stmt_students->fetchAll(PDO::FETCH_ASSOC);
    
    $stmt_classes = $conn->query("SELECT * FROM academic_years");
    $classes = $stmt_classes->fetchAll(PDO::FETCH_ASSOC);
    
    $stmt_units = $conn->query("SELECT id, title, academic_year_id FROM units");
    $units = $stmt_units->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تفعيل اشتراك يدوي | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="shortcut icon" href="#">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === الهوية البصرية الجديدة (أحمر، زيتي غامق، أصفر) === */
        :root { 
            --main-red: #DB1F41; 
            --dark-grey: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الشريط العلوي واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصندوق والحدود */
        .box-purple { border-top: 4px solid var(--main-yellow) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.08); background: #fff; }
        
        /* زر الحفظ */
        .btn-submit { 
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey)); 
            color: white; padding: 10px 50px; border-radius: 50px; border: none; font-weight: bold; transition: 0.3s; 
        }
        .btn-submit:hover { color: var(--main-yellow); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        
        .select2-container--default .select2-selection--single { height: 45px; padding: 8px; border: 1px solid #ddd; }
        .select2-container--default .select2-selection--single .select2-selection__arrow { height: 40px; }
        
        /* تنبيه الطالب */
        #student_alert { display: none; margin-top: 10px; padding: 10px; border-radius: 5px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
        
        /* تنسيق Breadcrumb */
        .breadcrumb > li + li:before { color: #ccc; content: "/\00a0"; }
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
            <h1>إدارة الاشتراكات <small>تفعيل يدوي (للطوارئ) - احياء غنيم</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php">الرئيسية</a></li>
                <li><a href="view_subscriptions.php">الاشتراكات</a></li>
                <li class="active">إضافة يدوي</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    
                    <div class="alert alert-info alert-dismissible" style="border-right: 5px solid var(--dark-grey);">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <h4><i class="icon fa fa-info"></i> ملاحظة هامة!</h4>
                        تُستخدم هذه الصفحة لإضافة اشتراك لطالب <b>أونلاين</b> واجه مشكلة في الدفع أو لفتح كورس <b>مجاني</b>. طلاب السنتر لا يحتاجون لهذه الخطوة عادةً.
                    </div>

                    <div class="box box-purple">
                        <div class="box-header with-border">
                            <h3 class="box-title">بيانات الاشتراك الجديد</h3>
                        </div>
                        
                        <form action="save_subscription.php" method="post">
                            <div class="box-body">
                                
                                <!-- اختيار الطالب -->
                                <div class="form-group">
                                    <label>الطالب</label>
                                    <select class="form-control select2" name="student_id" id="student_select" required style="width: 100%;">
                                        <option value="" selected disabled>ابحث عن الطالب...</option>
                                        <?php foreach ($students as $student): ?>
                                            <option value="<?php echo $student['id']; ?>" data-type="<?php echo $student['student_type']; ?>">
                                                <?php 
                                                    $typeLabel = ($student['student_type'] == 'online') ? 'Online' : 'Center';
                                                    echo htmlspecialchars($student['name']) . " (" . $student['phone'] . ") - " . $typeLabel; 
                                                ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    
                                    <div id="student_alert">
                                        <i class="fa fa-exclamation-triangle"></i> 
                                        <b>تنبيه:</b> هذا الطالب مسجل كـ <u>(Center)</u>. طلاب السنتر يُفتح لهم المحتوى عادةً عبر كود المركز. هل أنت متأكد من تفعيل اشتراك يدوي؟
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>نوع الاشتراك</label>
                                            <select class="form-control" name="type" id="sub_type" onchange="toggleUnits()">
                                                <option value="class">اشتراك صف كامل (ترم)</option>
                                                <option value="unit">اشتراك وحدة محددة</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>المبلغ (للأرشيف فقط)</label>
                                            <input type="number" name="price" class="form-control" placeholder="0" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>الصف الدراسي</label>
                                    <select class="form-control" name="class_id" id="class_select" onchange="filterUnits()" required>
                                        <option value="" disabled selected>-- اختر الصف --</option>
                                        <?php foreach ($classes as $class): ?>
                                            <option value="<?php echo $class['id']; ?>"><?php echo $class['name']; ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>

                                <div class="form-group" id="unit_div" style="display: none;">
                                    <label>الوحدة</label>
                                    <select class="form-control" name="unit_id" id="unit_select">
                                        <option value="">-- اختر الوحدة --</option>
                                    </select>
                                </div>

                                <hr>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>تاريخ البدء</label>
                                            <input type="date" class="form-control" name="start_date" value="<?php echo date('Y-m-d'); ?>" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>تاريخ الانتهاء</label>
                                            <input type="date" class="form-control" name="end_date" value="<?php echo date('Y-m-d', strtotime('+30 days')); ?>" required>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="box-footer text-center">
                                <button type="submit" class="btn btn-submit">تفعيل الاشتراك الآن</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by KABOx / Mindly</strong></footer>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>

<script>
    $(document).ready(function() {
        $('.select2').select2({ dir: "rtl" });

        // مراقبة اختيار الطالب لإظهار التنبيه
        $('#student_select').on('change', function() {
            var selectedOption = $(this).find(':selected');
            var type = selectedOption.data('type');
            
            if (type === 'offline') {
                $('#student_alert').slideDown();
            } else {
                $('#student_alert').slideUp();
            }
        });
    });

    var allUnits = <?php echo json_encode($units); ?>;

    function toggleUnits() {
        var type = document.getElementById('sub_type').value;
        if(type === 'unit') {
            $('#unit_div').slideDown();
            $('#unit_select').attr('required', 'required');
        } else {
            $('#unit_div').slideUp();
            $('#unit_select').removeAttr('required');
            $('#unit_select').val('');
        }
    }

    function filterUnits() {
        var classId = document.getElementById('class_select').value;
        var unitSelect = document.getElementById('unit_select');
        unitSelect.innerHTML = '<option value="">-- اختر الوحدة --</option>';
        
        allUnits.forEach(function(unit) {
            if(unit.academic_year_id == classId) {
                var option = document.createElement("option");
                option.value = unit.id;
                option.text = unit.title;
                unitSelect.add(option);
            }
        });
    }
</script>

</body>
</html>