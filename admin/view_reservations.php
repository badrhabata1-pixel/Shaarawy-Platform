<?php
// المسار: admin/view_reservations.php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. منطق الحذف
if (isset($_GET['delete_id'])) {
    $id = $_GET['delete_id'];
    try {
        $stmt = $conn->prepare("DELETE FROM reservations WHERE id = ?");
        $stmt->execute([$id]);
        echo "<script>alert('تم حذف الحجز بنجاح'); window.location.href='view_reservations.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('حدث خطأ أثناء الحذف');</script>";
    }
}

// 3. منطق البحث وجلب البيانات
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    // جلب بيانات الحجز + اسم المجموعة (LEFT JOIN)
    $sql = "SELECT r.*, g.name as group_name 
            FROM reservations r
            LEFT JOIN `groups` g ON r.group_id = g.id";

    if (!empty($search)) {
        $sql .= " WHERE r.name LIKE :search OR r.phone LIKE :search OR r.code LIKE :search";
    }

    $sql .= " ORDER BY r.id DESC";

    $stmt = $conn->prepare($sql);
    if (!empty($search)) {
        $stmt->bindValue(':search', "%$search%");
    }
    $stmt->execute();
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض الحجوزات | احياء غنيم</title>
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

        body, h1, h2, h3, h4, th, td, input, button {
            font-family: 'Cairo', sans-serif !important;
        }

        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }

        /* الصندوق والحدود */
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
        .btn-search:hover { background-color: var(--dark-grey); color: var(--main-yellow); }

        /* الجدول */
        .table thead th {
            background-color: var(--dark-grey); color: white; border: none; padding: 15px; font-weight: 600; text-align: center;
        }
        .table tbody tr:hover { background-color: #f9f9ff; }
        .table td { vertical-align: middle !important; padding: 12px; color: #555; font-size: 15px; text-align: center; }

        /* الشارات */
        .badge-paid { background-color: #00a65a; color: white; padding: 5px 10px; border-radius: 4px; }
        .badge-unpaid { background-color: var(--main-red); color: white; padding: 5px 10px; border-radius: 4px; }
        .badge-group { background-color: var(--main-yellow); color: #000; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; }
        
        .code-box { 
            background: #eee; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold; border: 1px dashed var(--dark-grey);
        }
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

    <div class="content-wrapper" style="background-color: #f4f6f9;">
        <section class="content-header">
            <div class="row">
                <div class="col-xs-6">
                    <h1>سجل الحجوزات - احياء غنيم</h1>
                </div>
                <div class="col-xs-6 text-left">
                    <a href="add_reservation.php" class="btn btn-success" style="background: var(--main-red); border: none;">
                        <i class="fa fa-plus"></i> إضافة حجز جديد
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            
            <!-- مربع البحث -->
            <div class="search-box">
                <form action="view_reservations.php" method="get">
                    <div class="row">
                        <div class="col-md-2">
                            <label style="margin-top: 10px;">بحث سريع:</label>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon" style="background-color: var(--dark-grey); color: #fff;"><i class="fa fa-search"></i></span>
                                <input type="text" name="search" class="form-control" placeholder="ابحث بالاسم، الهاتف، أو الكود..." value="<?php echo htmlspecialchars($search); ?>">
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
                                        <th>الاسم</th>
                                        <th>الهاتف</th>
                                        <th>المجموعة</th>
                                        <th>الكود</th>
                                        <th>ولي الأمر</th>
                                        <th>حالة الدفع</th>
                                        <th>تاريخ الحجز</th>
                                        <th>إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($reservations) > 0): ?>
                                        <?php foreach ($reservations as $index => $res): ?>
                                        <tr>
                                            <td><?php echo $index + 1; ?></td>
                                            
                                            <td style="text-align: right;">
                                                <strong><?php echo htmlspecialchars($res['name']); ?></strong><br>
                                                <small class="text-muted"><?php echo htmlspecialchars($res['address']); ?></small>
                                            </td>

                                            <td>
                                                <i class="fa fa-phone" style="color: var(--main-red);"></i> <?php echo htmlspecialchars($res['phone']); ?>
                                            </td>

                                            <td>
                                                <?php if(!empty($res['group_name'])): ?>
                                                    <span class="badge-group"><?php echo htmlspecialchars($res['group_name']); ?></span>
                                                <?php else: ?>
                                                    <span class="text-muted">--</span>
                                                <?php endif; ?>
                                            </td>

                                            <td>
                                                <span class="code-box"><?php echo htmlspecialchars($res['code']); ?></span>
                                            </td>
                                            
                                            <td>
                                                <?php echo htmlspecialchars($res['parent_name']); ?><br>
                                                <small><?php echo htmlspecialchars($res['parent_phone']); ?></small>
                                            </td>

                                            <td>
                                                <?php if($res['is_paid'] == 'yes'): ?>
                                                    <span class="badge-paid">تم الدفع</span>
                                                <?php else: ?>
                                                    <span class="badge-unpaid">لم يدفع</span>
                                                <?php endif; ?>
                                            </td>

                                            <td style="direction: ltr;">
                                                <small><?php echo date('Y-m-d', strtotime($res['created_at'])); ?></small>
                                            </td>
                                            
                                            <td>
                                                <a href="view_reservations.php?delete_id=<?php echo $res['id']; ?>" class="btn btn-danger btn-sm" style="background-color: var(--main-red);" onclick="return confirm('هل أنت متأكد من حذف هذا الحجز؟');" title="حذف">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="9" class="text-center" style="padding: 50px; color: #999;">
                                                <i class="fa fa-address-book-o fa-3x" style="margin-bottom: 10px;"></i><br>
                                                لا توجد حجوزات مطابقة للبحث.
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="box-footer clearfix text-center">
                            <small class="text-muted">إجمالي الحجوزات: <?php echo count($reservations); ?></small>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>

    <footer class="main-footer text-center">
        <strong>powered by Mr. Ghoneim Biology Platform</strong>
    </footer>

</div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

</body>
</html>