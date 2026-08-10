<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. منطق الحذف (إذا أراد المعلم حذف درجة معينة لإتاحة الإعادة للطالب)
if (isset($_GET['delete_id'])) {
    $del_id = $_GET['delete_id'];
    try {
        // حذف التفاصيل أولاً (الردود)
        $conn->prepare("DELETE FROM sheet_responses WHERE sheet_answer_id = ?")->execute([$del_id]);
        // حذف السجل الرئيسي
        $conn->prepare("DELETE FROM sheet_answers WHERE id = ?")->execute([$del_id]);
        
        echo "<script>alert('تم حذف إجابة الطالب بنجاح'); window.location.href='view_sheet_degrees.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('خطأ أثناء الحذف');</script>";
    }
}

// 3. منطق البحث وجلب البيانات
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    // جلب البيانات: اسم الطالب، اسم الشيت، الدرجة، الملاحظات
    // الشرط: status = 'graded' (يعني تم الانتهاء من تصحيحه)
    $sql = "SELECT sa.*, 
                   s.name AS student_name, 
                   s.phone AS student_phone,
                   sh.title AS sheet_title,
                   g.name AS group_name
            FROM sheet_answers sa
            JOIN students s ON sa.student_id = s.id
            JOIN sheets sh ON sa.sheet_id = sh.id
            LEFT JOIN `groups` g ON s.group_id = g.id
            WHERE sa.status = 'graded'";

    if (!empty($search)) {
        $sql .= " AND (s.name LIKE :search OR sh.title LIKE :search)";
    }

    $sql .= " ORDER BY sa.id DESC";

    $stmt = $conn->prepare($sql);
    if (!empty($search)) {
        $stmt->bindValue(':search', "%$search%");
    }
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>درجات الواجبات | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === الهوية الجديدة (أحمر، زيتي، أصفر) === */
        :root {
            --main-red: #DB1F41;
            --dark-grey: #3B525C;
            --main-yellow: #DCD001;
        }

        body, h1, h2, h3, h4, th, td, input, button {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }

        /* الصندوق الرئيسي والحدود الصفراء */
        .box {
            border: none;
            border-top: 4px solid var(--main-yellow) !important;
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
        .form-control { height: 45px; border-radius: 4px; border: 1px solid #ddd; }
        .form-control:focus { border-color: var(--main-red); box-shadow: none; }
        
        .btn-search {
            height: 45px; background-color: var(--main-red); color: white; border: none; font-weight: bold; transition: 0.3s;
        }
        .btn-search:hover { background-color: #bd1a38; color: var(--main-yellow); }

        /* الجدول */
        .table thead th {
            background-color: var(--dark-grey); color: white; border: none; padding: 15px; font-weight: 600; text-align: center;
        }
        .table tbody tr:hover { background-color: #f9f9ff; }
        .table td { vertical-align: middle !important; padding: 12px; color: #555; font-size: 15px; text-align: center; }

        /* الشارات */
        .badge-score { font-size: 14px; padding: 5px 10px; border-radius: 4px; }
        .score-high { background-color: #00a65a; color: white; }
        .score-medium { background-color: #f39c12; color: white; }
        .score-low { background-color: var(--main-red); color: white; }
        
        .progress { height: 10px; margin-bottom: 0; background-color: #ddd; border-radius: 5px; }
        .progress-bar-success { background-color: #00a65a; }
        .progress-bar-warning { background-color: #f39c12; }
        .progress-bar-danger { background-color: var(--main-red); }

        .group-label { background-color: #eee; color: #333; padding: 3px 8px; border-radius: 10px; font-size: 12px; }
        
        /* تعديل لون ليبل الشيت */
        .label-sheet-info { background-color: var(--main-red) !important; font-size: 12px; }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <header class="main-header">
        <a href="dashboard.php" class="logo">
            <span class="logo-mini"><b>أ</b> غ</span>
            <span class="logo-lg"><b>احياء</b> غنيم</span>
        </a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"></a></nav>
    </header>

    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper" style="background-color: #f4f6f9;">
        <section class="content-header">
            <h1>سجل درجات الواجبات (الشيتات) - احياء غنيم</h1>
        </section>

        <section class="content">
            
            <!-- مربع البحث -->
            <div class="search-box">
                <form action="view_sheet_degrees.php" method="get">
                    <div class="row">
                        <div class="col-md-2">
                            <label style="margin-top: 10px;">بحث سريع:</label>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon" style="background-color: var(--dark-grey); color: white;"><i class="fa fa-search"></i></span>
                                <input type="text" name="search" class="form-control" placeholder="ابحث باسم الطالب أو اسم الشيت..." value="<?php echo htmlspecialchars($search); ?>">
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
                        <div class="box-body table-responsive no-padding">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;">#</th>
                                        <th>اسم الطالب</th>
                                        <th>اسم الشيت</th>
                                        <th>الدرجة</th>
                                        <th>المجموع</th>
                                        <th>النسبة المئوية</th>
                                        <th>ملاحظات</th>
                                        <th>تاريخ التصحيح</th>
                                        <th>حذف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($results) > 0): ?>
                                        <?php foreach ($results as $index => $res): 
                                            // حساب النسبة المئوية
                                            $total = $res['total_marks'];
                                            $score = $res['score'];
                                            
                                            if ($total > 0) {
                                                $percentage = ($score / $total) * 100;
                                            } else {
                                                $percentage = 0;
                                            }

                                            // تحديد اللون والحالة
                                            if ($percentage >= 85) {
                                                $badge_class = 'score-high';
                                                $bar_class = 'progress-bar-success';
                                            } elseif ($percentage >= 50) {
                                                $badge_class = 'score-medium';
                                                $bar_class = 'progress-bar-warning';
                                            } else {
                                                $badge_class = 'score-low';
                                                $bar_class = 'progress-bar-danger';
                                            }
                                        ?>
                                        <tr>
                                            <td><?php echo $index + 1; ?></td>
                                            
                                            <td class="text-right">
                                                <strong style="color: var(--dark-grey);"><?php echo htmlspecialchars($res['student_name']); ?></strong><br>
                                                <small class="text-muted"><i class="fa fa-phone"></i> <?php echo htmlspecialchars($res['student_phone']); ?></small><br>
                                                <span class="group-label"><?php echo htmlspecialchars($res['group_name'] ?? 'بدون مجموعة'); ?></span>
                                            </td>

                                            <td>
                                                <span class="label label-sheet-info">
                                                    <?php echo htmlspecialchars($res['sheet_title']); ?>
                                                </span>
                                            </td>

                                            <td>
                                                <span class="badge badge-score <?php echo $badge_class; ?>">
                                                    <?php echo $score; ?>
                                                </span>
                                            </td>
                                            
                                            <td>
                                                <strong><?php echo $total; ?></strong>
                                            </td>

                                            <td style="width: 150px;">
                                                <div class="clearfix">
                                                    <small class="pull-right"><?php echo round($percentage, 1); ?>%</small>
                                                </div>
                                                <div class="progress xs">
                                                    <div class="progress-bar <?php echo $bar_class; ?>" style="width: <?php echo $percentage; ?>%;"></div>
                                                </div>
                                            </td>

                                            <td>
                                                <?php if(!empty($res['feedback'])): ?>
                                                    <span title="<?php echo htmlspecialchars($res['feedback']); ?>" style="cursor:help; color:var(--dark-grey);">
                                                        <i class="fa fa-commenting-o"></i> عرض
                                                    </span>
                                                <?php else: ?>
                                                    <span class="text-muted">-</span>
                                                <?php endif; ?>
                                            </td>

                                            <td style="direction: ltr;">
                                                <small><?php echo date('Y-m-d', strtotime($res['created_at'])); ?></small>
                                            </td>
                                            
                                            <td>
                                                <a href="view_sheet_degrees.php?delete_id=<?php echo $res['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('هل أنت متأكد من حذف هذه الدرجة؟ سيتم حذف إجابة الطالب أيضاً وسيضطر للإعادة.');" title="حذف النتيجة">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="9" class="text-center" style="padding: 50px; color: #999;">
                                                <i class="fa fa-file-text-o fa-3x" style="margin-bottom: 10px;"></i><br>
                                                لا توجد درجات واجبات متاحة حالياً.
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="box-footer clearfix text-center">
                            <small class="text-muted">إجمالي السجلات: <?php echo count($results); ?></small>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>

    <footer class="main-footer text-center">
        <strong>powered by Mr. Ghoneim Platform</strong>
    </footer>

</div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

</body>
</html>