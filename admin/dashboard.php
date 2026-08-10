<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

try {
    $students_count  = $conn->query("SELECT COUNT(*) FROM students")->fetchColumn();
    $groups_count    = $conn->query("SELECT COUNT(*) FROM groups")->fetchColumn();
    $lessons_count   = $conn->query("SELECT COUNT(*) FROM lessons")->fetchColumn();
    $revenue         = $conn->query("SELECT SUM(price) FROM subscriptions WHERE status='active'")->fetchColumn() ?: 0;
    $pending_subs    = $conn->query("SELECT COUNT(*) FROM subscriptions WHERE status='pending'")->fetchColumn();
    $online_students = $conn->query("SELECT COUNT(*) FROM students WHERE student_type='online'")->fetchColumn();
    $offline_students= $conn->query("SELECT COUNT(*) FROM students WHERE student_type='offline'")->fetchColumn();

    $latest_students = $conn->query(
        "SELECT students.*, academic_years.name AS class_name
         FROM students
         LEFT JOIN academic_years ON students.academic_year_id = academic_years.id
         ORDER BY students.id DESC LIMIT 5"
    )->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    $students_count = $groups_count = $lessons_count = $revenue = $pending_subs = 0;
    $online_students = $offline_students = 0;
    $latest_students = [];
}
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>لوحة القيادة | منصة الصيفي</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- Bootstrap 3 RTL (للتوافق مع AdminLTE) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        /* ══════════════════════════════════════════
           متغيرات التصميم الجديد — منصة الصيفي
        ══════════════════════════════════════════ */
        :root {
            --navy:      #14213D;
            --navy-deep: #0d1829;
            --navy-mid:  #1e3a6e;
            --orange:    #F47C20;
            --orange-dk: #d96a12;
            --gold:      #DCC9A3;
            --bg:        #F7F3EB;
            --white:     #ffffff;
            --text-muted:#6b7280;
        }

        /* ── Base ───────────────────────────────── */
        * { box-sizing: border-box; }
        body, h1,h2,h3,h4,h5,h6,
        label,span,p,th,td,div,a,button {
            font-family: 'Cairo', sans-serif !important;
        }
        body.skin-blue { background-color: var(--bg) !important; }

        /* ── Header / Navbar ────────────────────── */
        .skin-blue .main-header .navbar {
            background: var(--navy) !important;
            border-bottom: 3px solid var(--orange) !important;
        }
        .skin-blue .main-header .logo {
            background: var(--navy-deep) !important;
            color: var(--white) !important;
            font-weight: 900 !important;
            font-size: 18px !important;
            letter-spacing: 1px;
            border-bottom: 3px solid var(--orange) !important;
        }
        .skin-blue .main-header .logo b { color: var(--orange); }
        .skin-blue .main-header .logo:hover { background: var(--orange) !important; }
        .skin-blue .main-header .logo:hover b { color: var(--white); }

        .navbar-custom-menu .user-image {
            border: 2px solid var(--orange) !important;
        }
        .sidebar-toggle:before {
            font-family: FontAwesome !important;
            content: "\f0c9";
        }
        .skin-blue .main-header .navbar .sidebar-toggle:hover {
            background: var(--orange) !important;
        }

        /* ── Sidebar ────────────────────────────── */
        aside.main-sidebar {
            background: var(--navy) !important;
            position: fixed !important; top:0 !important; left:0 !important;
            bottom:0 !important; height:100vh !important;
            z-index: 1000 !important; overflow: hidden !important;
        }
        .sidebar {
            position: absolute !important; top:0 !important; bottom:0 !important;
            width:100% !important; overflow-y: auto !important;
            overflow-x: hidden !important; padding-bottom: 50px !important;
        }
        .sidebar-menu > li > a {
            color: rgba(220,201,163,.8) !important;
            border-right: 3px solid transparent !important;
            font-weight: 600 !important;
            transition: all .25s !important;
        }
        .sidebar-menu > li:hover > a {
            background: rgba(244,124,32,.12) !important;
            color: var(--white) !important;
        }
        .sidebar-menu > li.active > a {
            background: var(--orange) !important;
            color: var(--white) !important;
            border-right-color: var(--white) !important;
            font-weight: 700 !important;
            box-shadow: 0 2px 10px rgba(244,124,32,.4) !important;
        }
        .treeview-menu { background: var(--navy-deep) !important; }
        .treeview-menu > li > a { color: var(--gold) !important; }
        .treeview-menu > li.active > a { color: var(--orange) !important; font-weight:700 !important; }
        .sidebar-form input[type="text"] {
            background: rgba(255,255,255,.07) !important; color:#fff !important; border:none !important;
        }
        .sidebar::-webkit-scrollbar { width: 4px; }
        .sidebar::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 10px; }

        /* ── Content Wrapper ────────────────────── */
        .content-wrapper { background: var(--bg) !important; }
        .content-header h1 {
            color: var(--navy) !important; font-weight: 900 !important; font-size: 26px !important;
        }
        .content-header h1 small { color: var(--text-muted) !important; font-size: 14px; }

        /* ── Stat Cards ─────────────────────────── */
        .stat-card {
            border-radius: 18px;
            padding: 24px 20px;
            color: #fff;
            position: relative;
            overflow: hidden;
            box-shadow: 0 6px 24px rgba(0,0,0,.13);
            transition: transform .3s, box-shadow .3s;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 130px;
        }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,.2); }
        .stat-card .stat-icon {
            position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
            font-size: 60px; opacity: .15;
        }
        .stat-card h3 { font-size: 38px; font-weight: 900; margin:0 0 4px; }
        .stat-card p  { font-size: 14px; font-weight: 600; margin:0; opacity:.9; }
        .stat-card a  {
            display: block; margin-top: 14px;
            font-size: 12px; font-weight: 700;
            color: rgba(255,255,255,.8);
            text-decoration: none;
            border-top: 1px solid rgba(255,255,255,.2);
            padding-top: 10px;
        }
        .stat-card a:hover { color: #fff; }

        .card-navy   { background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%); }
        .card-orange { background: linear-gradient(135deg, var(--orange) 0%, var(--orange-dk) 100%); }
        .card-gold   { background: linear-gradient(135deg, #c9a14a 0%, #a8832e 100%); }
        .card-teal   { background: linear-gradient(135deg, #0e7490 0%, #0891b2 100%); }

        /* ── White Box ──────────────────────────── */
        .panel-box {
            background: var(--white);
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(20,33,61,.07);
            overflow: hidden;
            margin-bottom: 24px;
        }
        .panel-box-header {
            padding: 18px 22px;
            border-bottom: 1px solid #f0ece4;
            display: flex; align-items: center; justify-content: space-between;
        }
        .panel-box-header h3 {
            margin: 0; font-size: 16px; font-weight: 800; color: var(--navy);
        }
        .panel-box-body { padding: 20px 22px; }

        /* ── Quick Action Buttons ───────────────── */
        .quick-btn {
            display: block; text-align: center;
            background: var(--bg); border: 2px solid #e8e0d4;
            padding: 20px 10px; border-radius: 14px;
            color: var(--navy); text-decoration: none;
            transition: all .3s; margin-bottom: 14px;
        }
        .quick-btn i {
            font-size: 28px; display: block; margin-bottom: 8px;
            color: var(--orange);
        }
        .quick-btn span { font-size: 13px; font-weight: 700; }
        .quick-btn:hover {
            background: var(--navy); border-color: var(--navy);
            color: #fff; transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(20,33,61,.2);
        }
        .quick-btn:hover i { color: var(--orange); }

        /* ── Alert ──────────────────────────────── */
        .alert-platform {
            background: linear-gradient(135deg, #fff8f0, #fff3e6);
            border: 2px solid var(--orange);
            border-radius: 14px;
            padding: 16px 20px;
            margin-bottom: 20px;
            color: var(--navy);
        }
        .alert-platform h4 { color: var(--orange); font-weight: 800; margin:0 0 6px; }

        /* ── Table ──────────────────────────────── */
        .table thead tr th {
            background: var(--navy) !important;
            color: var(--gold) !important;
            font-weight: 700 !important;
            border: none !important;
            padding: 12px 16px !important;
        }
        .table tbody tr:hover { background: rgba(244,124,32,.04); }
        .table img {
            width: 38px; height: 38px; border-radius: 50%;
            object-fit: cover; border: 2px solid var(--orange);
        }
        .badge-online  { background: var(--orange); color:#fff; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
        .badge-offline { background: var(--navy);   color:#fff; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
        .badge-active  { background: #10b981; color:#fff; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
        .badge-pending { background: #f59e0b; color:#fff; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }

        /* ── Footer ─────────────────────────────── */
        .main-footer {
            background: var(--navy) !important;
            color: var(--gold) !important;
            border-top: 3px solid var(--orange) !important;
            text-align: center;
        }
        .main-footer a { color: var(--orange) !important; font-weight: 700; }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <!-- ══ Header ══════════════════════════════════ -->
    <header class="main-header">
        <a href="dashboard.php" class="logo">
            <span class="logo-mini"><b>م</b>ص</span>
            <span class="logo-lg"><b>منصة</b> الصيفي</span>
        </a>
        <nav class="navbar navbar-static-top">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <!-- Notification Bell -->
                    <?php if($pending_subs > 0): ?>
                    <li class="dropdown">
                        <a href="view_subscriptions.php" style="color:#fff; position:relative; padding:15px 16px; display:block;">
                            <i class="fa fa-bell"></i>
                            <span style="position:absolute;top:8px;right:6px;background:var(--orange);color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;"><?php echo $pending_subs; ?></span>
                        </a>
                    </li>
                    <?php endif; ?>
                    <!-- User -->
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="https://ui-avatars.com/api/?name=Sweefy&background=F47C20&color=fff&bold=true"
                                 class="user-image" alt="Mr. Sweefy">
                            <span class="hidden-xs" style="color:#fff; font-weight:700;">
                                <?php echo htmlspecialchars($_SESSION['admin_name'] ?? 'Mr. Sweefy'); ?>
                            </span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="user-header" style="background:var(--navy);">
                                <img src="https://ui-avatars.com/api/?name=Sweefy&background=F47C20&color=fff&bold=true&size=90"
                                     class="img-circle" alt="User Image">
                                <p style="color:var(--gold);">
                                    <?php echo htmlspecialchars($_SESSION['admin_name'] ?? 'Mr. Sweefy'); ?>
                                    <small>مدرس — منصة الصيفي</small>
                                </p>
                            </li>
                            <li class="user-footer">
                                <div class="text-center">
                                    <a href="logout.php" class="btn btn-default btn-flat"
                                       style="border-color:var(--orange);color:var(--orange);font-weight:700;">
                                        <i class="fa fa-sign-out"></i> تسجيل الخروج
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- ══ Sidebar ═════════════════════════════════ -->
    <?php include 'sidebar.php'; ?>

    <!-- ══ Content ═════════════════════════════════ -->
    <div class="content-wrapper">

        <section class="content-header">
            <h1>لوحة القيادة <small>نظرة عامة على المنصة</small></h1>
            <ol class="breadcrumb" style="background:transparent;">
                <li><a href="dashboard.php" style="color:var(--orange);"><i class="fa fa-home"></i> الرئيسية</a></li>
                <li class="active" style="color:var(--navy);">لوحة القيادة</li>
            </ol>
        </section>

        <section class="content">

            <!-- ─ Alert ─────────────────────────── -->
            <?php if($pending_subs > 0): ?>
            <div class="alert-platform">
                <h4><i class="fa fa-bell"></i> تنبيه — طلبات جديدة!</h4>
                يوجد <b><?php echo $pending_subs; ?></b> طلب اشتراك بانتظار المراجعة.
                <a href="view_subscriptions.php" style="color:var(--orange);font-weight:700;margin-right:8px;">
                    مراجعة الطلبات ←
                </a>
            </div>
            <?php endif; ?>

            <!-- ─ Stat Cards ─────────────────────── -->
            <div class="row">

                <div class="col-lg-3 col-sm-6">
                    <div class="stat-card card-orange">
                        <div class="stat-icon"><i class="ion ion-cash"></i></div>
                        <div>
                            <h3><?php echo number_format($revenue); ?> <small style="font-size:16px;">ج.م</small></h3>
                            <p>إجمالي الاشتراكات المفعّلة</p>
                        </div>
                        <a href="view_subscriptions.php"><i class="fa fa-arrow-left"></i> التفاصيل</a>
                    </div>
                </div>

                <div class="col-lg-3 col-sm-6">
                    <div class="stat-card card-navy">
                        <div class="stat-icon"><i class="ion ion-person-stalker"></i></div>
                        <div>
                            <h3><?php echo $students_count; ?></h3>
                            <p>عدد الطلاب الكلي</p>
                        </div>
                        <a href="view_students.php"><i class="fa fa-arrow-left"></i> عرض الطلاب</a>
                    </div>
                </div>

                <div class="col-lg-3 col-sm-6">
                    <div class="stat-card card-teal">
                        <div class="stat-icon"><i class="ion ion-ios-people"></i></div>
                        <div>
                            <h3><?php echo $groups_count; ?></h3>
                            <p>المجموعات الدراسية</p>
                        </div>
                        <a href="view_groups.php"><i class="fa fa-arrow-left"></i> إدارة المجموعات</a>
                    </div>
                </div>

                <div class="col-lg-3 col-sm-6">
                    <div class="stat-card card-gold">
                        <div class="stat-icon"><i class="ion ion-ios-videocam"></i></div>
                        <div>
                            <h3><?php echo $lessons_count; ?></h3>
                            <p>الدروس المرفوعة</p>
                        </div>
                        <a href="view_lessons.php" style="color:rgba(255,255,255,.8);"><i class="fa fa-arrow-left"></i> المحتوى</a>
                    </div>
                </div>

            </div><!-- /row -->

            <!-- ─ Chart + Quick Actions ──────────── -->
            <div class="row">

                <!-- Chart -->
                <div class="col-md-8">
                    <div class="panel-box">
                        <div class="panel-box-header">
                            <h3><i class="fa fa-pie-chart" style="color:var(--orange);margin-left:8px;"></i> توزيع الطلاب — Online vs Center</h3>
                        </div>
                        <div class="panel-box-body">
                            <canvas id="studentsChart" style="height:260px; max-height:260px;"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="col-md-4">
                    <div class="panel-box">
                        <div class="panel-box-header">
                            <h3><i class="fa fa-bolt" style="color:var(--orange);margin-left:8px;"></i> إجراءات سريعة</h3>
                        </div>
                        <div class="panel-box-body">
                            <div class="row">
                                <div class="col-xs-6">
                                    <a href="add_lesson.php" class="quick-btn">
                                        <i class="fa fa-upload"></i>
                                        <span>إضافة درس</span>
                                    </a>
                                </div>
                                <div class="col-xs-6">
                                    <a href="add_exam.php" class="quick-btn">
                                        <i class="fa fa-file-text-o"></i>
                                        <span>إنشاء امتحان</span>
                                    </a>
                                </div>
                                <div class="col-xs-6">
                                    <a href="add_sheet.php" class="quick-btn">
                                        <i class="fa fa-file-pdf-o"></i>
                                        <span>رفع شيت</span>
                                    </a>
                                </div>
                                <div class="col-xs-6">
                                    <a href="view_subscriptions.php" class="quick-btn">
                                        <i class="fa fa-check-square-o"></i>
                                        <span>مراجعة الطلبات</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div><!-- /row -->

            <!-- ─ Latest Students ────────────────── -->
            <div class="row">
                <div class="col-md-12">
                    <div class="panel-box">
                        <div class="panel-box-header">
                            <h3><i class="fa fa-users" style="color:var(--orange);margin-left:8px;"></i> أحدث الطلاب المنضمين</h3>
                            <a href="view_students.php"
                               style="font-size:13px;font-weight:700;color:var(--orange);text-decoration:none;">
                                عرض الجميع →
                            </a>
                        </div>
                        <div class="panel-box-body" style="padding:0;">
                            <div class="table-responsive">
                                <table class="table table-hover" style="margin:0;">
                                    <thead>
                                        <tr>
                                            <th>الطالب</th>
                                            <th>الصف الدراسي</th>
                                            <th>النظام</th>
                                            <th>المحافظة</th>
                                            <th>تاريخ التسجيل</th>
                                            <th>الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <?php if(count($latest_students) > 0): ?>
                                        <?php foreach($latest_students as $s): ?>
                                        <tr>
                                            <td style="vertical-align:middle;">
                                                <?php
                                                $img = !empty($s['image'])
                                                    ? '../' . $s['image']
                                                    : 'https://ui-avatars.com/api/?name=' . urlencode($s['name']) . '&background=14213D&color=DCC9A3&bold=true';
                                                ?>
                                                <img src="<?php echo $img; ?>" alt="img">
                                                <span style="margin-right:10px;font-weight:700;color:var(--navy);">
                                                    <?php echo htmlspecialchars($s['name']); ?>
                                                </span>
                                            </td>
                                            <td style="vertical-align:middle;">
                                                <span style="background:var(--navy);color:var(--gold);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">
                                                    <?php echo htmlspecialchars($s['class_name'] ?? 'غير محدد'); ?>
                                                </span>
                                            </td>
                                            <td style="vertical-align:middle;">
                                                <?php if($s['student_type'] === 'online'): ?>
                                                    <span class="badge-online"><i class="fa fa-globe"></i> Online</span>
                                                <?php else: ?>
                                                    <span class="badge-offline"><i class="fa fa-building"></i> Center</span>
                                                <?php endif; ?>
                                            </td>
                                            <td style="vertical-align:middle;color:var(--text-muted);">
                                                <?php echo htmlspecialchars($s['governorate'] ?? '—'); ?>
                                            </td>
                                            <td style="vertical-align:middle;color:var(--text-muted);">
                                                <?php echo isset($s['created_at']) ? date('Y-m-d', strtotime($s['created_at'])) : '—'; ?>
                                            </td>
                                            <td style="vertical-align:middle;">
                                                <?php if($s['is_active']): ?>
                                                    <span class="badge-active"><i class="fa fa-check"></i> مفعّل</span>
                                                <?php else: ?>
                                                    <span class="badge-pending"><i class="fa fa-clock-o"></i> انتظار</span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="6" class="text-center" style="padding:40px;color:var(--text-muted);">
                                                <i class="fa fa-users" style="font-size:32px;display:block;margin-bottom:10px;opacity:.3;"></i>
                                                لا يوجد طلاب مسجلين بعد
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>

    <!-- ══ Footer ═══════════════════════════════════ -->
    <footer class="main-footer">
        <strong>
            <a href="https://kaboxdev.vercel.app/" target="_blank">Powered by KABOx / Mindly</a>
        </strong>
        &nbsp;— منصة الصيفي &copy; <?php echo date('Y'); ?>
    </footer>

</div><!-- /wrapper -->

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

<script>
    var ctx = document.getElementById('studentsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Online', 'Center'],
            datasets: [{
                data: [<?php echo $online_students; ?>, <?php echo $offline_students; ?>],
                backgroundColor: ['#F47C20', '#14213D'],
                borderWidth: 3,
                borderColor: '#F7F3EB',
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 68,
            legend: {
                position: 'bottom',
                labels: { fontFamily: 'Cairo', fontColor: '#14213D', fontSize: 13, fontStyle: 'bold', padding: 20 }
            },
            tooltips: { bodyFontFamily: 'Cairo', titleFontFamily: 'Cairo' }
        }
    });
</script>

</body>
</html>
