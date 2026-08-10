<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// جلب البيانات للقوائم
try {
    $stmt_classes = $conn->query("SELECT * FROM academic_years");
    $classes = $stmt_classes->fetchAll(PDO::FETCH_ASSOC);

    $stmt_groups = $conn->query("SELECT id, name, academic_year_id FROM groups");
    $groups = $stmt_groups->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ في جلب البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة طالب جديد | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تخصيص الألوان الجديدة (أحمر، زيتي، أصفر) === */
        :root {
            --main-red: #DB1F41;
            --dark-grey: #3B525C;
            --main-yellow: #DCD001;
            --light-purple: #f9f9f9;
            --text-grey: #555;
        }

        body, h1, h2, h3, h4, label, input, select, textarea, button {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }

        /* الصندوق الرئيسي */
        .box.box-purple {
            border-top: 4px solid var(--main-yellow);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            background: #fff;
            padding-bottom: 20px;
        }
        
        .box-header {
            background-color: var(--light-purple);
            color: var(--dark-grey);
            border-radius: 8px 8px 0 0;
            padding: 15px 20px;
            margin-bottom: 20px;
        }

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

        /* زر رفع الصورة */
        .file-input-wrapper {
            position: relative;
            overflow: hidden;
            border: 2px dashed var(--main-red);
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            background: #fdfdfd;
            transition: 0.3s;
            cursor: pointer;
        }
        .file-input-wrapper:hover {
            border-color: var(--dark-grey);
            background: #fffafa;
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
        .file-msg { font-size: 14px; color: #777; }

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
            <h1>إدارة الطلاب <small>تسجيل طالب جديد - احياء غنيم</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php"><i class="fa fa-dashboard"></i> الرئيسية</a></li>
                <li><a href="view_students.php">الطلاب</a></li>
                <li class="active">إضافة طالب</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-purple">
                        
                        <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-user-plus"></i> بيانات الطالب الشخصية والدراسية</h3>
                        </div>

                        <form role="form" action="save_student.php" method="post" enctype="multipart/form-data">
                            <div class="box-body">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>اسم الطالب (ثلاثي)</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-user"></i></span>
                                                <input type="text" class="form-control" name="name" placeholder="محمد أحمد محمود" required>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>البريد الإلكتروني</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
                                                <input type="email" class="form-control" name="email" placeholder="student@example.com" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>كلمة المرور</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                                                <input type="password" class="form-control" name="password" placeholder="******" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>رقم الطالب</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-phone"></i></span>
                                                <input type="number" class="form-control" name="phone" placeholder="01xxxxxxxxx" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>رقم ولي الأمر</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-users"></i></span>
                                                <input type="number" class="form-control" name="parent_phone" placeholder="01xxxxxxxxx" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr style="border-top: 1px dashed #ddd;">

                                <div class="row">
                                    <!-- نوع الطالب -->
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>نوع الطالب</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-globe"></i></span>
                                                <select class="form-control" name="student_type" id="studentType" required>
                                                    <option value="offline" selected>الحضور بمجموعة (Center)</option>
                                                    <option value="online">الحضور أونلاين (Online)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>الصف الدراسي</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-laptop"></i></span>
                                                <select class="form-control" name="academic_year_id" id="classSelect" required>
                                                    <option value="" disabled selected>-- اختر الصف أولاً --</option>
                                                    <?php foreach ($classes as $class): ?>
                                                        <option value="<?php echo $class['id']; ?>"><?php echo $class['name']; ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- قسم المجموعة (سيتم إخفاؤه في حالة الأونلاين) -->
                                    <div class="col-md-4" id="groupSection">
                                        <div class="form-group">
                                            <label>المجموعة</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-users"></i></span>
                                                <select class="form-control" name="group_id" id="groupSelect" required>
                                                    <option value="" disabled selected>-- اختر المجموعة --</option>
                                                    <?php foreach ($groups as $group): ?>
                                                        <option value="<?php echo $group['id']; ?>" data-class-id="<?php echo $group['academic_year_id']; ?>">
                                                            <?php echo $group['name']; ?>
                                                        </option>
                                                    <?php endforeach; ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>المحافظة</label>
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="fa fa-map-marker"></i></span>
                                                <select class="form-control" name="governorate" required>
                                                    <option value="" disabled selected>-- اختر المحافظة --</option>
                                                    <option value="القاهرة">القاهرة</option>
                                                    <option value="الجيزة">الجيزة</option>
                                                    <option value="الإسكندرية">الإسكندرية</option>
                                                    <option value="الدقهلية">الدقهلية</option>
                                                    <option value="الشرقية">الشرقية</option>
                                                    <option value="المنوفية">المنوفية</option>
                                                    <option value="القليوبية">القليوبية</option>
                                                    <option value="البحيرة">البحيرة</option>
                                                    <option value="الغربية">الغربية</option>
                                                    <option value="بورسعيد">بورسعيد</option>
                                                    <option value="دمياط">دمياط</option>
                                                    <option value="الإسماعيلية">الإسماعيلية</option>
                                                    <option value="السويس">السويس</option>
                                                    <option value="كفر الشيخ">كفر الشيخ</option>
                                                    <option value="الفيوم">الفيوم</option>
                                                    <option value="بني سويف">بني سويف</option>
                                                    <option value="المنيا">المنيا</option>
                                                    <option value="أسيوط">أسيوط</option>
                                                    <option value="سوهاج">سوهاج</option>
                                                    <option value="قنا">قنا</option>
                                                    <option value="الأقصر">الأقصر</option>
                                                    <option value="أسوان">أسوان</option>
                                                    <option value="شمال سيناء">شمال سيناء</option>
                                                    <option value="جنوب سيناء">جنوب سيناء</option>
                                                    <option value="مطروح">مطروح</option>
                                                    <option value="الوادي الجديد">الوادي الجديد</option>
                                                    <option value="البحر الأحمر">البحر الأحمر</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>صورة الطالب</label>
                                            <div class="file-input-wrapper">
                                                <span class="file-msg">
                                                    <i class="fa fa-camera fa-lg"></i> اضغط لاختيار صورة شخصية
                                                </span>
                                                <input type="file" name="image" accept="image/*" required onchange="document.querySelector('.file-msg').innerHTML = '<i class=\'fa fa-check text-success\'></i> تم اختيار: ' + this.files[0].name;">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="box-footer text-center">
                                <button type="submit" class="btn-submit">
                                    <i class="fa fa-save"></i> تسجيل الطالب
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

<script>
    $(document).ready(function() {
        
        // --- 1. منطق فلترة المجموعات حسب الصف ---
        var $groupSelect = $('#groupSelect');
        var $allGroups = $groupSelect.find('option').clone(); // حفظ نسخة

        $('#classSelect').change(function() {
            var selectedClassId = $(this).val();
            $groupSelect.empty();
            $groupSelect.append('<option value="" disabled selected>-- اختر المجموعة --</option>');

            $allGroups.each(function() {
                var groupClassId = $(this).attr('data-class-id');
                if (groupClassId == selectedClassId) {
                    $groupSelect.append($(this).clone());
                }
            });
        });

        // --- 2. منطق إخفاء المجموعة عند اختيار "Online" ---
        $('#studentType').change(function() {
            var type = $(this).val();
            var $groupSection = $('#groupSection');
            var $groupInput = $('#groupSelect');

            if(type === 'online') {
                // إذا أونلاين: إخفاء القسم وإلغاء "مطلوب" وتصفير القيمة
                $groupSection.fadeOut();
                $groupInput.removeAttr('required');
                $groupInput.val(''); 
            } else {
                // إذا سنتر: إظهار القسم وجعله "مطلوب"
                $groupSection.fadeIn();
                $groupInput.attr('required', 'required');
            }
        });

        // تشغيل الدالة مرة واحدة عند التحميل
        $('#studentType').trigger('change');
    });
</script>

</body>
</html>