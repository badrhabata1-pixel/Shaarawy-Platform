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
    // استعلام لجلب بيانات المجموعة + اسم الصف + اسم المساعد
    $sql = "SELECT groups.*, 
                   academic_years.name AS class_name,
                   admins.name AS assistant_name
            FROM groups 
            LEFT JOIN academic_years ON groups.academic_year_id = academic_years.id
            LEFT JOIN admins ON groups.assistant_id = admins.id";

    // إضافة شرط البحث
    if (!empty($search_keyword)) {
        $sql .= " WHERE groups.name LIKE :keyword";
    }

    $sql .= " ORDER BY groups.id DESC";

    $stmt = $conn->prepare($sql);

    if (!empty($search_keyword)) {
        $stmt->bindValue(':keyword', "%$search_keyword%");
    }

    $stmt->execute();
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض المجموعات | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تصميم الألوان والهوية الجديدة (أحمر، زيتي، أصفر) === */
        :root {
            --main-red: #DB1F41;
            --dark-grey: #3B525C;
            --main-yellow: #DCD001;
            --light-bg: #f4f6f9;
            --text-dark: #333;
        }

        body, h1, h2, h3, h4, th, td, input, button, span {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }

        /* الصندوق الرئيسي */
        .box {
            border: none;
            border-top: 4px solid var(--main-yellow);
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

        /* تنسيق شكل شريط التمرير */
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
                min-width: 950px;
            }
        }

        .table thead th {
            background-color: var(--dark-grey);
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
            font-size: 15px;
            text-align: center;
            white-space: nowrap;
        }

        /* الصورة */
        .group-img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--main-yellow);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* الشارات (Badges) */
        .badge-class {
            background-color: var(--dark-grey);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
        }
        .badge-time {
            background-color: var(--main-yellow);
            color: #333;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 20px;
        }
        .badge-assistant {
            background-color: var(--main-red);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
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
        .btn-edit { background-color: #3498db; }
        .btn-edit:hover { background-color: #2980b9; transform: translateY(-2px); }
        .btn-delete { background-color: var(--main-red); }
        .btn-delete:hover { background-color: #b51935; transform: translateY(-2px); }

        /* زر إضافة جديد */
        .btn-add-new {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
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
                        المجموعات الدراسية
                        <small>عرض وإدارة المجموعات</small>
                    </h1>
                </div>
                <div class="col-xs-6 text-left">
                    <a href="add_group.php" class="btn btn-add-new">
                        <i class="fa fa-plus-circle"></i> إضافة مجموعة جديدة
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            
            <!-- مربع البحث -->
            <div class="search-box">
                <form action="view_groups.php" method="get">
                    <div class="row">
                        <div class="col-md-2">
                            <label style="margin-top: 10px; color: #666;">معيار البحث:</label>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-users"></i></span>
                                <input type="text" name="search" class="form-control" placeholder="ابحث باسم المجموعة..." value="<?php echo htmlspecialchars($search_keyword); ?>">
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
                                        <th>اسم المجموعة & المواعيد</th>
                                        <th>الصف الدراسي</th>
                                        <th>المساعد المسئول</th>
                                        <th>الساعة</th>
                                        <th>تواريخ</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($groups) > 0): ?>
                                        <?php foreach ($groups as $index => $group): ?>
                                        <tr>
                                            <td><?php echo $index + 1; ?></td>
                                            
                                            <td>
                                                <?php 
                                                    $img_src = !empty($group['image']) ? "../" . $group['image'] : "https://via.placeholder.com/60?text=No+Img";
                                                ?>
                                                <img src="<?php echo $img_src; ?>" alt="Group Image" class="group-img">
                                            </td>
                                            
                                            <td class="text-right">
                                                <strong><?php echo htmlspecialchars($group['name']); ?></strong>
                                                <br>
                                                <small style="color: #666; display:block; margin-top:5px;">
                                                    <i class="fa fa-calendar"></i> 
                                                    <?php 
                                                        if($group['attendance_type'] == 1) echo "سبت - اثنين - أربعاء";
                                                        elseif($group['attendance_type'] == 2) echo "أحد - ثلاثاء - خميس";
                                                        else echo "غير محدد";
                                                    ?>
                                                </small>
                                                <small style="color: #888; display:block; margin-top:3px; white-space: normal; max-width: 250px;">
                                                    <?php echo htmlspecialchars($group['description']); ?>
                                                </small>
                                            </td>

                                            <td>
                                                <span class="badge-class">
                                                    <?php echo htmlspecialchars($group['class_name'] ?? 'غير محدد'); ?>
                                                </span>
                                            </td>

                                            <td>
                                                <?php if(!empty($group['assistant_name'])): ?>
                                                    <span class="badge-assistant">
                                                        <i class="fa fa-user"></i> <?php echo htmlspecialchars($group['assistant_name']); ?>
                                                    </span>
                                                <?php else: ?>
                                                    <span class="text-muted">--</span>
                                                <?php endif; ?>
                                            </td>
                                            
                                            <td>
                                                <span class="badge-time">
                                                    <i class="fa fa-clock-o"></i> <?php echo htmlspecialchars($group['hour']); ?>:00
                                                </span>
                                            </td>

                                            <td style="font-size: 13px;">
                                                <span class="text-success">بدء: <?php echo $group['start_date']; ?></span><br>
                                                <span class="text-danger">انتهاء: <?php echo $group['end_date']; ?></span>
                                            </td>
                                            
                                            <td>
                                                <a href="edit_group.php?id=<?php echo $group['id']; ?>" class="action-btn btn-edit" title="تعديل">
                                                    <i class="fa fa-edit"></i>
                                                </a>
                                                <a href="delete_group.php?id=<?php echo $group['id']; ?>" class="action-btn btn-delete" onclick="return confirm('تحذير هام:\nهل أنت متأكد من حذف هذه المجموعة؟\nسيتم التأثير على جميع الطلاب المسجلين بها!');" title="حذف">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="8" class="text-center" style="padding: 50px;">
                                                <i class="fa fa-users fa-3x" style="color:#ddd;"></i><br>
                                                <h4 style="color:#999; margin-top:15px;">لا توجد مجموعات مضافة حالياً</h4>
                                                <a href="add_group.php" class="btn btn-primary btn-sm" style="margin-top:10px; background-color: var(--main-red); border:none;">أضف أول مجموعة</a>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div><!-- /.box-body -->
                        
                        <div class="box-footer clearfix text-center">
                            <small style="color: #999;">إجمالي المجموعات: <?php echo count($groups); ?></small>
                        </div>
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