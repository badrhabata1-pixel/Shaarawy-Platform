<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// منطق البحث
$search_keyword = isset($_GET['search']) ? trim($_GET['search']) : '';
$filter_type = isset($_GET['type']) ? $_GET['type'] : '';

try {
    // بناء الاستعلام مع ربط الجداول (JOIN)
    $sql = "SELECT students.*, 
                   academic_years.name AS class_name, 
                   groups.name AS group_name 
            FROM students 
            LEFT JOIN academic_years ON students.academic_year_id = academic_years.id
            LEFT JOIN groups ON students.group_id = groups.id
            WHERE 1=1"; // شرط ابتدائي لسهولة إضافة الشروط اللاحقة

    $params = [];

    // إضافة شرط البحث بالنص
    if (!empty($search_keyword)) {
        $sql .= " AND (students.name LIKE :keyword OR students.phone LIKE :keyword OR students.email LIKE :keyword)";
        $params[':keyword'] = "%$search_keyword%";
    }

    // إضافة فلتر النوع (أونلاين / سنتر)
    if (!empty($filter_type)) {
        $sql .= " AND students.student_type = :type";
        $params[':type'] = $filter_type;
    }

    $sql .= " ORDER BY students.id DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض الطلاب | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تصميم الألوان والهوية الجديدة === */
        :root {
            --main-red: #DB1F41;
            --dark-zayti: #3B525C;
            --main-yellow: #DCD001;
            --light-bg: #f4f6f9;
            --text-dark: #333;
        }

        body, h1, h2, h3, h4, th, td, input, button, select {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-zayti) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }

        /* الصندوق الرئيسي */
        .box {
            border: none;
            border-top: 4px solid var(--main-yellow);
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border-radius: 8px;
        }

        /* قسم البحث */
        .search-container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.03);
            margin-bottom: 20px;
        }
        .form-control {
            height: 45px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        .form-control:focus {
            border-color: var(--main-red);
            box-shadow: none;
        }
        .btn-search {
            height: 45px;
            background-color: var(--main-red);
            color: white;
            border: none;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-search:hover {
            background-color: #b51935;
            color: var(--main-yellow);
        }

        /* === تعديلات الجدول وشريط التمرير === */
        .table-container {
            background: white;
            border-radius: 8px;
            overflow-x: auto; 
            width: 100%;
            display: block;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 5px;
        }

        .table-container::-webkit-scrollbar {
            height: 8px;
        }
        .table-container::-webkit-scrollbar-track {
            background: #f1f1f1; 
            border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb {
            background: var(--main-red); 
            border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb:hover {
            background: #b51935; 
        }

        @media (max-width: 768px) {
            .table-container table {
                min-width: 900px; 
            }
        }

        .table thead th {
            background-color: var(--dark-zayti);
            color: white;
            border: none;
            padding: 15px;
            font-weight: 600;
            text-align: center;
            white-space: nowrap;
        }
        .table tbody tr {
            transition: 0.2s;
        }
        .table tbody tr:hover {
            background-color: #f9f9ff;
        }
        .table td {
            vertical-align: middle !important;
            padding: 12px;
            color: #555;
            font-size: 14px;
            text-align: center;
            white-space: nowrap;
        }

        /* الصورة */
        .student-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--main-yellow);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* الشارات (Badges) */
        .badge-class {
            background-color: var(--dark-zayti);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            display: block;
            margin-bottom: 3px;
        }
        .badge-group {
            background-color: var(--main-red);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            display: block;
        }
        .badge-online {
            background-color: #00a65a;
            color: white;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 11px;
        }
        .badge-offline {
            background-color: var(--dark-zayti);
            color: white;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 11px;
        }

        /* أزرار الإجراءات */
        .action-btn {
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 50%;
            display: inline-block;
            margin: 0 2px;
            color: white;
            transition: 0.3s;
            font-size: 14px;
        }
        .btn-edit { background-color: #f39c12; }
        .btn-delete { background-color: var(--main-red); }

        /* زر إضافة جديد */
        .btn-add-new {
            background: linear-gradient(45deg, var(--main-red), var(--dark-zayti));
            color: white;
            padding: 10px 25px;
            border-radius: 50px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(219, 31, 65, 0.3);
            border: none;
            transition: 0.3s;
        }
        .btn-add-new:hover {
            transform: translateY(-2px);
            color: var(--main-yellow);
        }
        
        .contact-info {
            font-size: 12px;
            text-align: right;
            display: inline-block;
            min-width: 150px;
        }
        .contact-info i {
            width: 15px;
            text-align: center;
            color: var(--main-red);
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
    <div class="content-wrapper" style="background-color: #f4f6f9;">
        <section class="content-header">
            <div class="row">
                <div class="col-xs-6">
                    <h1>
                        الطلاب المسجلين
                        <small>احياء غنيم</small>
                    </h1>
                </div>
                <div class="col-xs-6 text-left">
                    <a href="add_student.php" class="btn btn-add-new">
                        <i class="fa fa-user-plus"></i> تسجيل طالب جديد
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            
            <!-- مربع البحث والفلترة -->
            <div class="search-container">
                <form action="view_students.php" method="get">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label>بحث شامل (الاسم، الهاتف، الإيميل)</label>
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                                    <input type="text" name="search" class="form-control" placeholder="اكتب للبحث..." value="<?php echo htmlspecialchars($search_keyword); ?>">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>فلتر حسب النوع</label>
                                <select name="type" class="form-control">
                                    <option value="">الكل</option>
                                    <option value="offline" <?php echo ($filter_type == 'offline') ? 'selected' : ''; ?>>سنتر (Center)</option>
                                    <option value="online" <?php echo ($filter_type == 'online') ? 'selected' : ''; ?>>أونلاين (Online)</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label>&nbsp;</label>
                            <button type="submit" class="btn btn-search btn-block">تطبيق البحث</button>
                        </div>
                        <div class="col-md-3 text-left">
                             <label>&nbsp;</label>
                             <h4 style="margin: 0; padding-top: 10px; color: var(--main-red);">
                                 العدد الإجمالي: <strong><?php echo count($students); ?></strong>
                             </h4>
                        </div>
                    </div>
                </form>
            </div>

            <!-- جدول البيانات -->
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-body table-container">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;">#</th>
                                        <th style="width: 80px;">الصورة</th>
                                        <th>بيانات الطالب</th>
                                        <th>معلومات الاتصال</th>
                                        <th>الصف والمجموعة</th>
                                        <th>النوع / المحافظة</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($students) > 0): ?>
                                        <?php foreach ($students as $index => $student): ?>
                                        <tr>
                                            <td><?php echo $index + 1; ?></td>
                                            
                                            <td>
                                                <?php 
                                                    $img_src = !empty($student['image']) ? "../" . $student['image'] : "https://via.placeholder.com/60?text=No+Img";
                                                ?>
                                                <img src="<?php echo $img_src; ?>" alt="Student" class="student-img">
                                            </td>
                                            
                                            <td class="text-right">
                                                <strong><?php echo htmlspecialchars($student['name']); ?></strong>
                                                <br>
                                                <small style="color: #666;">
                                                    <i class="fa fa-envelope-o"></i> <?php echo htmlspecialchars($student['email']); ?>
                                                </small>
                                            </td>

                                            <td>
                                                <div class="contact-info">
                                                    <div><i class="fa fa-phone"></i> <?php echo htmlspecialchars($student['phone']); ?></div>
                                                    <div style="color: #e67e22;"><i class="fa fa-users"></i> <?php echo htmlspecialchars($student['parent_phone']); ?> (ولي الأمر)</div>
                                                </div>
                                            </td>

                                            <td>
                                                <span class="badge-class">
                                                    <?php echo htmlspecialchars($student['class_name'] ?? 'غير محدد'); ?>
                                                </span>
                                                <span class="badge-group">
                                                    <?php echo htmlspecialchars($student['group_name'] ?? 'بدون مجموعة'); ?>
                                                </span>
                                            </td>

                                            <td>
                                                <?php if($student['student_type'] == 'online'): ?>
                                                    <span class="badge-online"><i class="fa fa-globe"></i> Online</span>
                                                <?php else: ?>
                                                    <span class="badge-offline"><i class="fa fa-building"></i> Center</span>
                                                <?php endif; ?>
                                                <br>
                                                <small style="margin-top:5px; display:inline-block;"><?php echo htmlspecialchars($student['governorate']); ?></small>
                                            </td>
                                            
                                            <td>
                                                <a href="edit_student.php?id=<?php echo $student['id']; ?>" class="action-btn btn-edit" title="تعديل">
                                                    <i class="fa fa-edit"></i>
                                                </a>
                                                <a href="delete_student.php?id=<?php echo $student['id']; ?>" class="action-btn btn-delete" onclick="return confirm('هل أنت متأكد من حذف الطالب؟');" title="حذف">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="7" class="text-center" style="padding: 50px;">
                                                <i class="fa fa-user-times fa-3x" style="color:#ddd;"></i><br>
                                                <h4 style="color:#999; margin-top:15px;">لا يوجد طلاب مطابقين للبحث</h4>
                                                <a href="add_student.php" class="btn btn-primary btn-sm" style="margin-top:10px; background-color: var(--main-red); border:none;">إضافة طالب جديد</a>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div><!-- /.box-body -->
                    </div><!-- /.box -->
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