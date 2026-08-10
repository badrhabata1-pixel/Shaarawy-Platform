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

try {
    if (!empty($search_keyword)) {
        // البحث بالاسم
        $sql = "SELECT * FROM academic_years WHERE name LIKE :keyword ORDER BY id DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':keyword', "%$search_keyword%");
    } else {
        // عرض الكل
        $sql = "SELECT * FROM academic_years ORDER BY id DESC";
        $stmt = $conn->prepare($sql);
    }
    
    $stmt->execute();
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض الصفوف الدراسية | أحياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- ملفات CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
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

        body, h1, h2, h3, h4, th, td, input, button {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--brand-slate) !important; }
        .skin-blue .main-header .logo { background-color: var(--brand-dark-slate) !important; color: #fff; }
        .skin-blue .main-header .logo:hover { background-color: var(--brand-red) !important; }

        /* الصندوق الرئيسي */
        .box {
            border: none;
            border-top: 4px solid var(--brand-slate); /* تغيير لون البوردر للكحلي */
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border-radius: 8px;
        }

        /* قسم البحث */
        .search-box {
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
            border-color: var(--brand-slate);
            box-shadow: none;
        }
        .btn-search {
            height: 45px;
            background-color: var(--brand-slate);
            color: white;
            border: none;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-search:hover {
            background-color: var(--brand-red); /* أحمر عند التحويم */
            color: white;
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

        /* تنسيق شكل شريط التمرير */
        .table-container::-webkit-scrollbar { height: 8px; }
        .table-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .table-container::-webkit-scrollbar-thumb { background: var(--brand-slate); border-radius: 4px; }
        .table-container::-webkit-scrollbar-thumb:hover { background: var(--brand-red); }

        @media (max-width: 768px) {
            .table-container table { min-width: 700px; }
        }

        .table thead th {
            background-color: var(--brand-slate); /* خلفية الهيدر للكحلي */
            color: white;
            border: none;
            padding: 15px;
            font-weight: 600;
            white-space: nowrap;
            text-align: center;
        }
        .table tbody tr { transition: 0.2s; }
        .table tbody tr:hover { background-color: #f9f9ff; }
        .table td {
            vertical-align: middle !important;
            padding: 12px;
            color: #555;
            font-size: 15px;
            white-space: nowrap;
        }

        /* الصورة */
        .class-img {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            object-fit: cover;
            border: 2px solid var(--brand-gold); /* إطار ذهبي للصورة */
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* الشارات (Badges) */
        .badge-price {
            background-color: var(--brand-gold); /* خلفية ذهبية */
            color: var(--brand-slate); /* نص كحلي */
            padding: 5px 10px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 13px;
        }

        /* أزرار الإجراءات */
        .action-btn {
            width: 35px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            border-radius: 50%;
            display: inline-block;
            margin: 0 3px;
            color: white;
            transition: 0.3s;
        }
        .btn-edit { background-color: var(--brand-slate); } /* زر التعديل كحلي */
        .btn-edit:hover { background-color: #2C3E45; box-shadow: 0 3px 8px rgba(59, 82, 92, 0.4); }
        
        .btn-delete { background-color: var(--brand-red); } /* زر الحذف أحمر */
        .btn-delete:hover { background-color: #a81630; box-shadow: 0 3px 8px rgba(219, 31, 65, 0.4); }

        /* زر إضافة جديد */
        .btn-add-new {
            background: linear-gradient(45deg, var(--brand-red), #ff5f6d); /* تدرج أحمر */
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
            color: #fff;
            background: var(--brand-slate); /* يتحول للكحلي عند التحويم */
        }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <!-- الرأس -->
    <header class="main-header">
        <a href="dashboard.php" class="logo"><span class="logo-lg"><b>أحياء</b> غنيم</span></a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"></a>
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

    <!-- القائمة الجانبية -->
    <?php include 'sidebar.php'; ?>

    <!-- المحتوى -->
    <div class="content-wrapper" style="background-color: #f4f6f9;">
        <section class="content-header">
            <div class="row">
                <div class="col-xs-6">
                    <h1>
                        الصفوف الدراسية
                        <small>عرض وإدارة الصفوف</small>
                    </h1>
                </div>
                <div class="col-xs-6 text-left">
                    <a href="add_class.php" class="btn btn-add-new">
                        <i class="fa fa-plus-circle"></i> إضافة صف جديد
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            
            <!-- مربع البحث -->
            <div class="search-box">
                <form action="view_classes.php" method="get">
                    <div class="row">
                        <div class="col-md-2">
                            <label style="margin-top: 10px; color: #666;">بحث سريع:</label>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon" style="border-color: #ddd;"><i class="fa fa-search"></i></span>
                                <input type="text" name="search" class="form-control" placeholder="اكتب اسم الصف للبحث..." value="<?php echo htmlspecialchars($search_keyword); ?>">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <button type="submit" class="btn btn-search btn-block">بحث</button>
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
                                        <th class="text-center" style="width: 50px;">#</th>
                                        <th class="text-center" style="width: 100px;">الصورة</th>
                                        <th class="text-center">اسم الصف الدراسي</th>
                                        <th class="text-center">السعر</th>
                                        <th class="text-center" style="width: 35%;">الوصف</th>
                                        <th class="text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($classes) > 0): ?>
                                        <?php foreach ($classes as $index => $class): ?>
                                        <tr>
                                            <td class="text-center"><?php echo $index + 1; ?></td>
                                            
                                            <td class="text-center">
                                                <?php 
                                                    $img_src = !empty($class['image']) ? "../" . $class['image'] : "https://via.placeholder.com/60?text=No+Img";
                                                ?>
                                                <img src="<?php echo $img_src; ?>" alt="Class Image" class="class-img">
                                            </td>
                                            
                                            <td class="text-center">
                                                <strong style="color: var(--brand-slate);"><?php echo htmlspecialchars($class['name']); ?></strong>
                                            </td>

                                            <td class="text-center">
                                                <span class="badge-price">
                                                    <?php echo number_format($class['price'], 0); ?> ج.م
                                                </span>
                                            </td>
                                            
                                            <td class="text-center" style="white-space: normal; min-width: 200px;">
                                                <span style="display:block; max-height:50px; overflow:hidden; color:#777;">
                                                    <?php echo htmlspecialchars($class['description']); ?>
                                                </span>
                                            </td>
                                            
                                            <td class="text-center">
                                                <!-- زر التعديل -->
                                               <a href="edit_class.php?id=<?php echo $class['id']; ?>" class="action-btn btn-edit" title="تعديل">
                                                    <i class="fa fa-edit"></i>
                                                </a>
                                                <!-- زر الحذف -->
                                                <a href="delete_class.php?id=<?php echo $class['id']; ?>" class="action-btn btn-delete" onclick="return confirm('تحذير هام:\nهل أنت متأكد من حذف هذا الصف؟\nسيتم حذف جميع المجموعات والطلاب المرتبطين به!');" title="حذف">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="6" class="text-center" style="padding: 50px;">
                                                <i class="fa fa-folder-open-o fa-3x" style="color:#ddd;"></i><br>
                                                <h4 style="color:#999; margin-top:15px;">لا توجد صفوف دراسية مضافة حالياً</h4>
                                                <a href="add_class.php" class="btn btn-add-new btn-sm" style="margin-top:10px;">أضف أول صف</a>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div><!-- /.box-body -->
                        
                        <div class="box-footer clearfix text-center">
                            <small style="color: #999;">إجمالي الصفوف: <?php echo count($classes); ?></small>
                        </div>
                    </div><!-- /.box -->
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