<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة: التأكد من أن المستخدم مسجل دخول كمعلم
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. منطق البحث
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    // ---------------------------------------------------------
    // أ) جلب الطلبات المعلقة (Pending Requests)
    // ---------------------------------------------------------
    $sql_pending = "SELECT subscriptions.*, 
                   students.name AS student_name, 
                   students.phone AS student_phone,
                   academic_years.name AS class_name,
                   units.title AS unit_name,
                   lessons.title AS lesson_name
            FROM subscriptions 
            JOIN students ON subscriptions.student_id = students.id
            LEFT JOIN academic_years ON subscriptions.class_id = academic_years.id
            LEFT JOIN units ON subscriptions.unit_id = units.id
            LEFT JOIN lessons ON subscriptions.lesson_id = lessons.id
            WHERE subscriptions.status = 'pending'
            ORDER BY subscriptions.id DESC";
    
    $pending_reqs = $conn->query($sql_pending)->fetchAll(PDO::FETCH_ASSOC);

    // ---------------------------------------------------------
    // ب) جلب الاشتراكات المفعلة (Active Subscriptions)
    // ---------------------------------------------------------
    $sql_active = "SELECT subscriptions.*, 
                   students.name AS student_name, 
                   students.phone AS student_phone,
                   academic_years.name AS class_name,
                   units.title AS unit_name,
                   lessons.title AS lesson_name
            FROM subscriptions 
            JOIN students ON subscriptions.student_id = students.id
            LEFT JOIN academic_years ON subscriptions.class_id = academic_years.id
            LEFT JOIN units ON subscriptions.unit_id = units.id
            LEFT JOIN lessons ON subscriptions.lesson_id = lessons.id
            WHERE subscriptions.status = 'active'";

    // إضافة شرط البحث (بالاسم أو الهاتف)
    if (!empty($search)) {
        $sql_active .= " AND (students.name LIKE :search OR students.phone LIKE :search)";
    }
    
    $sql_active .= " ORDER BY subscriptions.id DESC";

    $stmt = $conn->prepare($sql_active);
    if (!empty($search)) {
        $stmt->bindValue(':search', "%$search%");
    }
    $stmt->execute();
    $active_subs = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إدارة الاشتراكات | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
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
        
        /* الشريط العلوي واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* صناديق الجداول */
        .box-pending { border-top: 4px solid var(--main-yellow) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .box-active { border-top: 4px solid var(--dark-grey) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        
        /* صورة الوصل */
        .img-receipt { 
            width: 100px; 
            height: 60px; 
            object-fit: cover; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            cursor: zoom-in; 
            transition: transform 0.2s; 
        }
        .img-receipt:hover { 
            transform: scale(2.5); 
            border-color: var(--main-red); 
            z-index: 100; 
            position: relative; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        /* الأزرار */
        .btn-add-manual {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white;
            border: none;
            border-radius: 50px;
            padding: 8px 25px;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-add-manual:hover { color: var(--main-yellow); transform: translateY(-2px); text-decoration: none; }
        
        .label-custom { font-size: 12px; padding: 5px 8px; border-radius: 4px; }
        /* تعديل ألوان الشارات الافتراضية لتناسب الثيم */
        .bg-purple { background-color: var(--dark-grey) !important; }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <!-- الهيدر -->
    <header class="main-header">
        <a href="dashboard.php" class="logo">
            <span class="logo-mini"><b>أ</b> غ</span>
            <span class="logo-lg"><b>احياء</b> غنيم</span>
        </a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu"></a></nav>
    </header>

    <!-- القائمة الجانبية -->
    <?php include 'sidebar.php'; ?>

    <!-- المحتوى -->
    <div class="content-wrapper" style="background-color: #f4f6f9;">
        <section class="content-header">
            <div class="row">
                <div class="col-xs-6">
                    <h1>إدارة الاشتراكات <small>مراجعة وتفعيل الطلاب</small></h1>
                </div>
                <div class="col-xs-6 text-left">
                    <a href="add_subscription.php" class="btn btn-add-manual">
                        <i class="fa fa-plus-circle"></i> تفعيل اشتراك يدوياً
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            
            <!-- 1. جدول الطلبات المعلقة (Pending) -->
            <?php if(count($pending_reqs) > 0): ?>
            <div class="box box-pending">
                <div class="box-header with-border">
                    <h3 class="box-title" style="color: var(--dark-grey);">
                        <i class="fa fa-clock-o"></i> طلبات قيد المراجعة (<?php echo count($pending_reqs); ?>)
                    </h3>
                </div>
                <div class="box-body table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr style="background-color: #fcf8e3;">
                                <th>الطالب</th>
                                <th>نوع الاشتراك</th>
                                <th>التفاصيل</th>
                                <th>المبلغ</th>
                                <th>طريقة الدفع</th>
                                <th>صورة الوصل</th>
                                <th>تاريخ الطلب</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($pending_reqs as $req): ?>
                            <tr>
                                <td>
                                    <strong><?php echo htmlspecialchars($req['student_name']); ?></strong><br>
                                    <small><i class="fa fa-phone"></i> <?php echo htmlspecialchars($req['student_phone']); ?></small>
                                </td>
                                <td>
                                    <?php 
                                        if($req['type'] == 'class') echo "<span class='label label-primary' style='background-color:var(--dark-grey)!important;'>صف كامل</span>";
                                        elseif($req['type'] == 'unit') echo "<span class='label label-info'>وحدة</span>";
                                        elseif($req['type'] == 'lesson') echo "<span class='label bg-purple'>درس</span>";
                                    ?>
                                </td>
                                <td>
                                    <?php 
                                        if($req['type'] == 'class') echo $req['class_name'];
                                        elseif($req['type'] == 'unit') echo $req['unit_name'];
                                        elseif($req['type'] == 'lesson') echo $req['lesson_name'];
                                    ?>
                                </td>
                                <td><strong><?php echo $req['price']; ?></strong> ج.م</td>
                                <td><?php echo htmlspecialchars($req['payment_method']); ?></td>
                                <td>
                                    <?php if(!empty($req['receipt_image'])): ?>
                                        <a href="../uploads/receipts/<?php echo $req['receipt_image']; ?>" target="_blank">
                                            <img src="../uploads/receipts/<?php echo $req['receipt_image']; ?>" class="img-receipt" title="اضغط للتكبير" onerror="this.src='https://via.placeholder.com/100x60?text=No+Image'">
                                        </a>
                                    <?php else: ?>
                                        <span class="text-muted">--</span>
                                    <?php endif; ?>
                                </td>
                                <td style="direction: ltr;"><?php echo date('Y-m-d', strtotime($req['start_date'])); ?></td>
                                <td>
                                    <div class="btn-group">
                                        <a href="handle_subscription.php?id=<?php echo $req['id']; ?>&action=approve" class="btn btn-success btn-sm" onclick="return confirm('هل أنت متأكد من قبول وتفعيل هذا الاشتراك؟')">
                                            <i class="fa fa-check"></i> قبول
                                        </a>
                                        <a href="handle_subscription.php?id=<?php echo $req['id']; ?>&action=reject" class="btn btn-danger btn-sm" style="background-color: var(--main-red); border-color: var(--main-red);" onclick="return confirm('هل أنت متأكد من رفض وحذف هذا الطلب؟')">
                                            <i class="fa fa-times"></i> رفض
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php endif; ?>

            <!-- 2. جدول الاشتراكات المفعلة (Active) -->
            <div class="box box-active">
                <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-check-circle" style="color: #00a65a;"></i> الاشتراكات المفعلة (الأرشيف)</h3>
                    
                    <div class="box-tools pull-left">
                        <form action="view_subscriptions.php" method="get" class="form-inline">
                            <div class="input-group input-group-sm" style="width: 250px;">
                                <input type="text" name="search" class="form-control pull-right" placeholder="ابحث باسم الطالب..." value="<?php echo htmlspecialchars($search); ?>">
                                <div class="input-group-btn">
                                    <button type="submit" class="btn btn-default"><i class="fa fa-search"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الطالب</th>
                                <th>النوع</th>
                                <th>التفاصيل (صف/وحدة/درس)</th>
                                <th>السعر</th>
                                <th>تاريخ الانتهاء</th>
                                <th>الحالة</th>
                                <th>إلغاء</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($active_subs) > 0): ?>
                                <?php foreach ($active_subs as $index => $sub): 
                                    $is_expired = ($sub['end_date'] != '0000-00-00' && date('Y-m-d') > $sub['end_date']);
                                ?>
                                <tr>
                                    <td><?php echo $index + 1; ?></td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($sub['student_name']); ?></strong><br>
                                        <small class="text-muted"><?php echo htmlspecialchars($sub['student_phone']); ?></small>
                                    </td>
                                    <td>
                                        <?php 
                                            if($sub['type'] == 'class') echo '<span class="label label-primary" style="background-color:var(--dark-grey)!important;">صف كامل</span>';
                                            elseif($sub['type'] == 'unit') echo '<span class="label label-warning" style="background-color:var(--main-yellow)!important; color:#000;">وحدة</span>';
                                            elseif($sub['type'] == 'lesson') echo '<span class="label bg-purple">درس</span>';
                                        ?>
                                    </td>
                                    <td>
                                        <?php 
                                            if($sub['type'] == 'class') echo $sub['class_name'];
                                            elseif($sub['type'] == 'unit') echo $sub['unit_name'] . " <small class='text-muted'>(" . $sub['class_name'] . ")</small>";
                                            elseif($sub['type'] == 'lesson') echo $sub['lesson_name'] . " <small class='text-muted'>(" . $sub['unit_name'] . ")</small>";
                                        ?>
                                    </td>
                                    <td><?php echo number_format($sub['price'], 0); ?> ج.م</td>
                                    <td style="direction: ltr;">
                                        <?php echo ($sub['end_date'] == '0000-00-00') ? 'مفتوح' : $sub['end_date']; ?>
                                    </td>
                                    <td>
                                        <?php if(!$is_expired): ?>
                                            <span class="label label-success"><i class="fa fa-check"></i> ساري</span>
                                        <?php else: ?>
                                            <span class="label label-danger" style="background-color: var(--main-red)!important;"><i class="fa fa-clock-o"></i> منتهي</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <a href="delete_subscription.php?id=<?php echo $sub['id']; ?>" class="btn btn-danger btn-xs" style="background-color: var(--main-red); border-color: var(--main-red);" onclick="return confirm('تحذير: هل أنت متأكد من إلغاء وحذف هذا الاشتراك نهائياً؟');">
                                            <i class="fa fa-trash"></i> حذف
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="8" class="text-center" style="padding: 30px; color: #999;">
                                        <i class="fa fa-search fa-2x"></i><br>
                                        لا توجد اشتراكات مفعلة مطابقة لبحثك
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
                
                <div class="box-footer clearfix text-center">
                    <small class="text-muted">إجمالي الاشتراكات المفعلة: <?php echo count($active_subs); ?></small>
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