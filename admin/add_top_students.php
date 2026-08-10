<?php
// المسار: admin/add_top_students.php
session_start();
include '../db_connect.php';

// 1. التحقق من الصلاحيات
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. جلب الصفوف الدراسية للقائمة
try {
    $years = $conn->query("SELECT id, name FROM academic_years ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل لوحة الشرف</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="shortcut icon" href="#">

    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    
    <!-- مكتبة Select2 -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تصميم الألوان والهوية (أحياء غنيم) === */
        :root {
            --brand-slate: #3B525C;   /* كحلي مزرّق */
            --brand-dark-slate: #2C3E45; 
            --brand-red: #DB1F41;     /* أحمر */
            --brand-gold: #DCD001;    /* ذهبي */
            --light-bg: #f4f6f9;
        }

        body { font-family: 'Cairo', sans-serif !important; }

        /* الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--brand-slate) !important; }
        .skin-blue .main-header .logo { background-color: var(--brand-dark-slate) !important; color: #fff; }
        .skin-blue .main-header .logo:hover { background-color: var(--brand-red) !important; }

        /* الصناديق */
        .box-primary-custom { 
            border-top: 4px solid var(--brand-slate); 
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            background: #fff; 
            border-radius: 8px;
        }

        /* تنسيق صفوف المراكز */
        .rank-row { 
            background: #fff; 
            padding: 15px 20px; 
            border-radius: 12px; 
            margin-bottom: 20px; 
            border: 1px solid #eee;
            box-shadow: 0 3px 10px rgba(0,0,0,0.03);
            display: flex; 
            align-items: center;
            transition: 0.3s;
        }
        .rank-row:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

        .rank-badge {
            width: 50px; height: 50px; border-radius: 50%; color: #fff;
            display: flex; align-items: center; justify-content: center; 
            font-size: 22px; font-weight: 900; margin-left: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            border: 3px solid #fff;
        }

        /* ألوان المراكز */
        /* المركز الأول ذهبي */
        .rank-1 .rank-badge { background: linear-gradient(135deg, #ffd700, #ffb900); color: #000; border-color: #ffd700; }
        
        /* المركز الثاني فضي */
        .rank-2 .rank-badge { background: linear-gradient(135deg, #c0c0c0, #999999); color: #000; border-color: #c0c0c0; }
        
        /* المركز الثالث برونزي */
        .rank-3 .rank-badge { background: linear-gradient(135deg, #cd7f32, #8b4513); border-color: #cd7f32; }
        
        /* المركز الرابع والخامس يأخذون هوية الموقع (الكحلي) */
        .rank-4 .rank-badge, .rank-5 .rank-badge { background: var(--brand-slate); border-color: var(--brand-slate); }

        /* تنسيق Select2 */
        .select2-container--default .select2-selection--single {
            height: 45px; border-radius: 5px; border: 1px solid #ddd; padding: 8px;
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 40px;
        }
        
        /* زر الحفظ (بتصميم مشابه لزر الإضافة في الكود الأول) */
        .btn-save {
            background: linear-gradient(45deg, var(--brand-red), #ff5f6d); /* تدرج أحمر */
            color: #fff; border: none; padding: 12px 50px; font-weight: bold; font-size: 18px;
            border-radius: 50px; box-shadow: 0 4px 15px rgba(219, 31, 65, 0.3);
            transition: 0.3s;
        }
        .btn-save:hover {
            background: var(--brand-slate); /* تحويل للكحلي */
            color: #fff; transform: translateY(-2px);
        }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <!-- الرأس (تم تعديله ليطابق الكود الأول من حيث الألوان) -->
    <header class="main-header">
        <a href="dashboard.php" class="logo"><span class="logo-lg"><b>احياء</b> غنيم</span></a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"></a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <!-- صورة افتراضية للمستخدم لتوحيد الشكل -->
                            <img src="https://ui-avatars.com/api/?name=Admin&background=DCD001&color=3B525C" class="user-image" alt="User">
                            <span class="hidden-xs">المسؤول</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper" style="background-color: #f4f6f9;">
        <section class="content-header">
            <h1>
                <i class="fa fa-trophy" style="color: var(--brand-gold);"></i> لوحة الشرف 
            </h1>
            <ol class="breadcrumb">
               
            </ol>
        </section>

        <section class="content">
            <form action="save_top_students.php" method="post">
                
                <div class="row">
                    
                    <!-- القسم الأول: الإعدادات -->
                    <div class="col-md-12">
                        <div class="box box-primary-custom">
                            <div class="box-header with-border">
                                <h3 class="box-title" style="color: var(--brand-slate);">إعدادات القائمة</h3>
                            </div>
                            <div class="box-body" style="background-color: #fff;">
                                <div class="row">
                                    
                                    <!-- اختيار الشهر -->
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label style="font-size: 16px;">اختر الشهر</label>
                                            <input type="month" name="month" id="month_input" class="form-control input-lg" required value="<?php echo date('Y-m'); ?>">
                                            <small class="text-muted">اختر الشهر والصف لإظهار البيانات المحفوظة (إن وجدت).</small>
                                        </div>
                                    </div>

                                    <!-- اختيار الصف الدراسي -->
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label style="font-size: 16px;">اختر الصف الدراسي</label>
                                            <select name="academic_year_id" id="year_select" class="form-control select2" required style="width: 100%;">
                                                <option value="" disabled selected>-- حدد الصف --</option>
                                                <?php foreach($years as $year): ?>
                                                    <option value="<?php echo $year['id']; ?>"><?php echo $year['name']; ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- القسم الثاني: اختيار الطلاب -->
                    <div class="col-md-12">
                        <div class="box box-solid" style="border-top: 4px solid var(--brand-red); border-radius: 8px;">
                            <div class="box-header with-border">
                                <h3 class="box-title"><i class="fa fa-users"></i> تحديد المراكز الخمسة الأولى</h3>
                            </div>
                            
                            <div class="box-body" style="background: #fff; padding: 30px;">
                                
                                <!-- المركز الأول -->
                                <div class="rank-row rank-1">
                                    <div class="rank-badge">1</div>
                                    <div style="flex-grow: 1;">
                                        <label style="color: #d4af37;">المركز الأول (الذهبي)</label>
                                        <select name="ranks[1]" class="form-control student-select" style="width: 100%;">
                                            <option value="">-- اختر الطالب الأول --</option>
                                        </select>
                                    </div>
                                    <i class="fa fa-crown fa-2x" style="color: #ffd700; margin-right: 15px;"></i>
                                </div>

                                <!-- المركز الثاني -->
                                <div class="rank-row rank-2">
                                    <div class="rank-badge">2</div>
                                    <div style="flex-grow: 1;">
                                        <label style="color: #7f8c8d;">المركز الثاني (الفضي)</label>
                                        <select name="ranks[2]" class="form-control student-select" style="width: 100%;">
                                            <option value="">-- اختر الطالب الثاني --</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- المركز الثالث -->
                                <div class="rank-row rank-3">
                                    <div class="rank-badge">3</div>
                                    <div style="flex-grow: 1;">
                                        <label style="color: #a0522d;">المركز الثالث (البرونزي)</label>
                                        <select name="ranks[3]" class="form-control student-select" style="width: 100%;">
                                            <option value="">-- اختر الطالب الثالث --</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- المركز الرابع -->
                                <div class="rank-row rank-4">
                                    <div class="rank-badge">4</div>
                                    <div style="flex-grow: 1;">
                                        <label>المركز الرابع</label>
                                        <select name="ranks[4]" class="form-control student-select" style="width: 100%;">
                                            <option value="">-- اختر الطالب الرابع --</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- المركز الخامس -->
                                <div class="rank-row rank-5">
                                    <div class="rank-badge">5</div>
                                    <div style="flex-grow: 1;">
                                        <label>المركز الخامس</label>
                                        <select name="ranks[5]" class="form-control student-select" style="width: 100%;">
                                            <option value="">-- اختر الطالب الخامس --</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <div class="box-footer text-center" style="background: #fff;">
                                <button type="submit" class="btn-save">
                                    <i class="fa fa-save"></i> حفظ التعديلات ونشر القائمة
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </form>
        </section>
    </div>

    <!-- الفوتيير (تم تعديله ليطابق الكود الأول) -->
    <footer class="main-footer text-center">
        <strong>powerd by KABOx / Mindly</strong>
    </footer>

</div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>

<script>
    $(document).ready(function() {
        $('.select2').select2({ dir: "rtl" });
        $('.student-select').select2({ dir: "rtl", placeholder: "-- يرجى اختيار الصف أولاً --", allowClear: true });

        // الدالة الرئيسية لجلب البيانات
        function loadData() {
            var yearId = $('#year_select').val();
            var month = $('#month_input').val();
            var $studentSelects = $('.student-select');

            if (!yearId || !month) return; // لا تفعل شيئاً إذا البيانات ناقصة

            // 1. جلب قائمة الطلاب للصف المختار
            $studentSelects.empty().append('<option value="">-- جاري التحميل... --</option>');
            $studentSelects.prop('disabled', true);

            $.ajax({
                url: 'get_students_ajax.php',
                type: 'GET',
                data: { year_id: yearId },
                dataType: 'json',
                success: function(students) {
                    var options = '<option value="">-- اختر الطالب --</option>';
                    students.forEach(function(student) {
                        options += '<option value="' + student.id + '">' + student.name + '</option>';
                    });

                    // تعبئة القوائم بأسماء الطلاب
                    $studentSelects.empty().append(options);
                    $studentSelects.prop('disabled', false);

                    // 2. الآن، جلب الأوائل المحفوظين (إذا وجدوا) وتحديدهم
                    $.ajax({
                        url: 'get_saved_tops_ajax.php',
                        type: 'POST',
                        data: { year_id: yearId, month: month },
                        dataType: 'json',
                        success: function(savedRanks) {
                            // savedRanks عبارة عن { "1": id, "2": id ... }
                            
                            // تصفير الاختيارات أولاً
                            $studentSelects.val(null).trigger('change');

                            // تعيين القيم المحفوظة
                            for (var rank = 1; rank <= 5; rank++) {
                                if (savedRanks[rank]) {
                                    // نختار القائمة الخاصة بالمركز (rank) ونحدد الطالب
                                    $('select[name="ranks[' + rank + ']"]').val(savedRanks[rank]).trigger('change');
                                }
                            }
                        }
                    });
                },
                error: function() {
                    alert('حدث خطأ أثناء جلب البيانات');
                }
            });
        }

        // الاستماع لتغيير الصف أو الشهر
        $('#year_select, #month_input').change(function() {
            loadData();
        });
    });
</script>

</body>
</html>