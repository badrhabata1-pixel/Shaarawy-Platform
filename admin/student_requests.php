<?php
// admin/student_requests.php
session_start();
include '../db_connect.php'; // تأكد أن المسار صحيح لملف الاتصال

// التحقق من الصلاحيات (يجب أن يكون Teacher)
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.php");
    exit();
}

try {
    // جلب الطلاب غير المفعلين (is_active = 0)
    $sql = "SELECT students.*, 
                   academic_years.name AS class_name, 
                   groups.name AS group_name 
            FROM students 
            LEFT JOIN academic_years ON students.academic_year_id = academic_years.id
            LEFT JOIN groups ON students.group_id = groups.id
            WHERE students.is_active = 0 
            ORDER BY students.id DESC";
    // تم تصحيح $pdo إلى $conn إذا كان هذا هو المتغير المستخدم في db_connect
    $requests = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}

// مصفوفة لربط أسماء الأفاتار بالروابط
$avatar_links = [
    'avatar_einstein.png' => 'https://cdn-icons-png.flaticon.com/512/3429/3429402.png',
    'avatar_student_m.png' => 'https://cdn-icons-png.flaticon.com/512/1999/1999625.png',
    'avatar_student_f.png' => 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
    'avatar_astro.png'     => 'https://cdn-icons-png.flaticon.com/512/2026/2026521.png',
    'avatar_atom.png'      => 'https://cdn-icons-png.flaticon.com/512/2933/2933861.png'
];
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>طلبات التسجيل الجديدة | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* تطبيق الألوان المطلوبة */
        :root { 
            --main-red: #DB1F41; 
            --dark-zayti: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-zayti) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصناديق والحدود العلوية الصفراء */
        .box { border-top: 4px solid var(--main-yellow) !important; }
        
        .student-img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid #eee; padding: 2px; background: #fff; }
        
        /* تنسيق شارات الحضور لتناسب الهوية */
        .badge-online { background-color: #00a65a; color: white; padding: 5px 10px; font-size: 12px; }
        .badge-center { background-color: var(--dark-zayti); color: white; padding: 5px 10px; font-size: 12px; }
        .code-badge { background-color: var(--main-red); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; display: inline-block; margin-top: 3px; }
        
        .btn-success { background-color: #00a65a !important; border-color: #008d4c; }
        .btn-danger { background-color: var(--main-red) !important; border-color: #bd1a38; }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <header class="main-header">
        <a href="dashboard.php" class="logo">
            <!-- نص صغير يظهر عند غلق القائمة -->
            <span class="logo-mini"><b>أ</b> غ</span>
            <!-- النص الكامل -->
            <span class="logo-lg"><b>احياء</b> غنيم</span>
        </a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu"></a></nav>
    </header>

    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header">
            <h1>طلبات إنشاء الحساب <small>مراجعة وتفعيل الطلاب</small></h1>
        </section>

        <section class="content">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">الطلاب الجدد (بانتظار التفعيل)</h3>
                </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الصورة</th>
                                <th>بيانات الطالب</th>
                                <th>نظام الحضور</th>
                                <th>تفاصيل الدراسة</th>
                                <th>أرقام الهاتف</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($requests) > 0): ?>
                                <?php foreach ($requests as $index => $req): ?>
                                
                                <?php 
                                    $img_src = "https://via.placeholder.com/60"; 
                                    if (!empty($req['image'])) {
                                        if (array_key_exists($req['image'], $avatar_links)) {
                                            $img_src = $avatar_links[$req['image']];
                                        } else {
                                            $img_src = "../uploads/students/" . $req['image'];
                                        }
                                    }
                                ?>

                                <tr>
                                    <td style="vertical-align: middle;"><?php echo $index + 1; ?></td>
                                    
                                    <td style="vertical-align: middle;">
                                        <img src="<?php echo $img_src; ?>" class="student-img" alt="Student Image">
                                    </td>
                                    
                                    <td style="vertical-align: middle;">
                                        <strong><?php echo htmlspecialchars($req['name']); ?></strong><br>
                                        <?php if(!empty($req['email'])): ?>
                                            <small class="text-muted"><i class="fa fa-envelope"></i> <?php echo htmlspecialchars($req['email']); ?></small><br>
                                        <?php endif; ?>
                                        <small style="color:#666;"><i class="fa fa-map-marker"></i> <?php echo htmlspecialchars($req['governorate']); ?></small>
                                    </td>
                                    
                                    <td style="vertical-align: middle;">
                                        <?php if ($req['student_type'] == 'online'): ?>
                                            <span class="badge badge-online"><i class="fa fa-laptop"></i> Online</span>
                                        <?php else: ?>
                                            <span class="badge badge-center"><i class="fa fa-building"></i> Center</span>
                                        <?php endif; ?>
                                    </td>
                                    
                                    <td style="vertical-align: middle;">
                                        <span class="label label-info" style="font-size:12px; display:block; margin-bottom:4px; background-color: var(--dark-zayti) !important;">
                                            <?php echo htmlspecialchars($req['class_name'] ?? 'غير محدد'); ?>
                                        </span>
                                        
                                        <?php if ($req['student_type'] == 'offline'): ?>
                                            <div style="margin-top:5px;">
                                                <span class="label label-warning" style="color:black; display:block; margin-bottom:4px; background-color: var(--main-yellow) !important;">
                                                    <i class="fa fa-users"></i> <?php echo htmlspecialchars($req['group_name'] ?? 'بدون مجموعة'); ?>
                                                </span>
                                                <?php if(!empty($req['center_code'])): ?>
                                                    <span class="code-badge">
                                                        <i class="fa fa-barcode"></i> الكود: <?php echo htmlspecialchars($req['center_code']); ?>
                                                    </span>
                                                <?php else: ?>
                                                    <span class="label label-danger">لا يوجد كود</span>
                                                <?php endif; ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    
                                    <td style="vertical-align: middle;">
                                        <div style="margin-bottom: 5px;">
                                            <i class="fa fa-phone text-green"></i> <?php echo htmlspecialchars($req['phone']); ?>
                                        </div>
                                        <div style="color:#e67e22; font-size:12px;">
                                            <i class="fa fa-user-plus"></i> ولي الأمر: <?php echo htmlspecialchars($req['parent_phone']); ?>
                                        </div>
                                    </td>
                                    
                                    <td style="vertical-align: middle;">
                                        <a href="handle_student_request.php?id=<?php echo $req['id']; ?>&action=approve" class="btn btn-success btn-sm btn-flat" onclick="return confirm('هل أنت متأكد من تفعيل حساب الطالب؟')">
                                            <i class="fa fa-check"></i> تفعيل
                                        </a>
                                        <a href="handle_student_request.php?id=<?php echo $req['id']; ?>&action=reject" class="btn btn-danger btn-sm btn-flat" style="margin-right: 5px;" onclick="return confirm('هل أنت متأكد من رفض وحذف الطلب نهائياً؟')">
                                            <i class="fa fa-trash"></i> حذف
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr><td colspan="7" class="text-center" style="padding: 40px; color: #777; font-size: 1.2rem;">
                                    <i class="fa fa-folder-open-o" style="font-size: 3rem; margin-bottom: 10px;"></i><br>
                                    لا توجد طلبات تسجيل جديدة في الوقت الحالي
                                </td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by KABOx / Mindly</strong></footer>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>
</body>
</html>