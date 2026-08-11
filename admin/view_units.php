<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. منطق البحث
$search_keyword = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    // استعلام لجلب بيانات الوحدة + اسم الصف الدراسي
    $sql = "SELECT units.*, academic_years.name AS class_name 
            FROM units 
            LEFT JOIN academic_years ON units.academic_year_id = academic_years.id";

    // إضافة شرط البحث
    if (!empty($search_keyword)) {
        $sql .= " WHERE units.title LIKE :keyword OR academic_years.name LIKE :keyword";
    }

    $sql .= " ORDER BY units.id DESC";

    $stmt = $conn->prepare($sql);

    if (!empty($search_keyword)) {
        $stmt->bindValue(':keyword', "%$search_keyword%");
    }

    $stmt->execute();
    $units = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض الوحدات | أحياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
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

        body, h1, h2, h3, h4, th, td, input, button, span {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--brand-slate) !important; }
        .skin-blue .main-header .logo { background-color: var(--brand-dark-slate) !important; color: #fff; }
        .skin-blue .main-header .logo:hover { background-color: var(--brand-red) !important; }

        /* الصندوق الرئيسي */
        .box {
            border: none;
            border-top: 4px solid var(--brand-slate); /* البوردر العلوي كحلي */
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
            -webkit-overflow-scrolling: touch;
            width: 100%;
            padding-bottom: 5px;
        }
        
        /* تخصيص السكرول بار */
        .table-container::-webkit-scrollbar { height: 8px; }
        .table-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .table-container::-webkit-scrollbar-thumb { background: var(--brand-slate); border-radius: 4px; }
        .table-container::-webkit-scrollbar-thumb:hover { background: var(--brand-red); }

        .table {
            margin-bottom: 0;
            width: 100%;
            max-width: 100%;
        }
        .table thead th {
            background-color: var(--brand-slate);
            color: white;
            border: none;
            padding: 15px;
            font-weight: 600;
            text-align: center;
            white-space: nowrap; 
        }
        .table tbody tr { transition: 0.2s; }
        .table tbody tr:hover { background-color: #f9f9ff; }
        .table td {
            vertical-align: middle !important;
            padding: 12px;
            color: #555;
            font-size: 15px;
            text-align: center;
            white-space: nowrap;
        }

        .description-cell {
            white-space: normal !important;
            min-width: 200px; 
        }

        /* الصورة */
        .unit-img {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
            border: 2px solid var(--brand-gold); /* إطار ذهبي */
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* الشارات (Badges) */
        .badge-class {
            background-color: var(--brand-slate);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            display: inline-block;
            margin-bottom: 5px;
        }
        .badge-term {
            background-color: var(--brand-gold); /* خلفية ذهبية */
            color: var(--brand-slate); /* نص كحلي */
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
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
        .btn-edit { background-color: var(--brand-slate); }
        .btn-edit:hover { background-color: #2C3E45; transform: translateY(-2px); box-shadow: 0 3px 8px rgba(59, 82, 92, 0.4); }
        
        .btn-delete { background-color: var(--brand-red); }
        .btn-delete:hover { background-color: #a81630; transform: translateY(-2px); box-shadow: 0 3px 8px rgba(219, 31, 65, 0.4); }

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
            background: var(--brand-slate); /* تحويل للكحلي */
            color: #fff;
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
                        الوحدات الدراسية
                        <small>عرض وإدارة الوحدات</small>
                    </h1>
                </div>
                <div class="col-xs-6 text-left">
                    <a href="add_unit.php" class="btn btn-add-new">
                        <i class="fa fa-plus-circle"></i> إضافة وحدة جديدة
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            
            <!-- مربع البحث -->
            <div class="search-box">
                <form action="view_units.php" method="get">
                    <div class="row">
                        <div class="col-md-2">
                            <label style="margin-top: 10px; color: #666;">بحث سريع:</label>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon" style="border-color: #ddd;"><i class="fa fa-search"></i></span>
                                <input type="text" name="search" class="form-control" placeholder="ابحث باسم الوحدة أو الصف..." value="<?php echo htmlspecialchars($search_keyword); ?>">
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
                                        <th style="width: 50px;">#</th>
                                        <th style="width: 100px;">الصورة</th>
                                        <th>عنوان الوحدة</th>
                                        <th>الصف والترم</th>
                                        <th style="min-width: 200px;">الوصف</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($units) > 0): ?>
                                        <?php foreach ($units as $index => $unit): ?>
                                        <tr>
                                            <td><?php echo $index + 1; ?></td>
                                            
                                            <td>
                                                <?php 
                                                    $img_src = !empty($unit['image']) ? "../" . $unit['image'] : "https://via.placeholder.com/60?text=No+Img";
                                                ?>
                                                <img src="<?php echo $img_src; ?>" alt="Unit Image" class="unit-img">
                                            </td>
                                            
                                            <td class="text-center">
                                                <strong style="color: var(--brand-slate);"><?php echo htmlspecialchars($unit['title']); ?></strong>
                                            </td>

                                            <td>
                                                <span class="badge-class">
                                                    <?php echo htmlspecialchars($unit['class_name'] ?? 'غير محدد'); ?>
                                                </span>
                                                <br>
                                                <?php if($unit['term'] == 1): ?>
                                                    <span class="badge-term">الترم الأول</span>
                                                <?php else: ?>
                                                    <span class="badge-term">الترم الثاني</span>
                                                <?php endif; ?>
                                            </td>
                                            
                                            <td class="description-cell">
                                                <span style="display:block; max-height:50px; overflow:hidden; color:#777; font-size:13px;">
                                                    <?php echo htmlspecialchars($unit['description']); ?>
                                                </span>
                                            </td>
                                            
                                            <td>
                                                <a href="edit_unit.php?id=<?php echo $unit['id']; ?>" class="action-btn btn-edit" title="تعديل">
                                                    <i class="fa fa-edit"></i>
                                                </a>
                                                <a href="delete_unit.php?id=<?php echo $unit['id']; ?>" class="action-btn btn-delete" onclick="return confirm('تحذير:\nهل أنت متأكد من حذف هذه الوحدة؟\nقد يتم حذف الدروس المرتبطة بها!');" title="حذف">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="6" class="text-center" style="padding: 50px;">
                                                <i class="fa fa-folder-open-o fa-3x" style="color:#ddd;"></i><br>
                                                <h4 style="color:#999; margin-top:15px;">لا توجد وحدات مضافة حالياً</h4>
                                                <a href="add_unit.php" class="btn btn-add-new btn-sm" style="margin-top:10px;">أضف أول وحدة</a>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div><!-- /.box-body -->
                        
                        <div class="box-footer clearfix text-center">
                            <small style="color: #999;">إجمالي الوحدات: <?php echo count($units); ?></small>
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