<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. منطق الحذف
if (isset($_GET['delete_id'])) {
    $del_id = $_GET['delete_id'];
    try {
        $conn->prepare("DELETE FROM exam_responses WHERE exam_result_id = ?")->execute([$del_id]);
        $conn->prepare("DELETE FROM exam_results WHERE id = ?")->execute([$del_id]);
        echo "<script>alert('تم الحذف بنجاح'); window.location.href='view_exam_degrees.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('خطأ أثناء الحذف');</script>";
    }
}

// 3. جلب البيانات للقوائم المنسدلة (الفلتر)
try {
    // جلب الصفوف الدراسية
    $classes = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);

    // جلب الامتحانات (التي لها نتائج فقط لتخفيف الحمل، أو جميعها)
    $exams_list = $conn->query("SELECT id, title, class_id FROM exams ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}

// 4. منطق البحث والفلترة
$selected_class = isset($_GET['class_id']) ? $_GET['class_id'] : '';
$selected_exam = isset($_GET['exam_id']) ? $_GET['exam_id'] : '';
$search_query = isset($_GET['search']) ? trim($_GET['search']) : '';

$results = []; // المصفوفة فارغة افتراضياً (لن نعرض شيئاً حتى يختار المعلم)

// إذا تم اختيار امتحان أو صف، أو قام بالبحث، ننفذ الاستعلام
if (!empty($selected_class) || !empty($selected_exam) || !empty($search_query)) {
    try {
        $sql = "SELECT er.*, 
                       s.name AS student_name, 
                       s.phone AS student_phone,
                       e.title AS exam_title,
                       e.total_marks AS exam_max_score
                FROM exam_results er
                JOIN students s ON er.student_id = s.id
                JOIN exams e ON er.exam_id = e.id
                WHERE 1=1"; // شرط ابتدائي

        $params = [];

        // فلتر بالصف الدراسي (نحتاج لربط الطالب بصفه أو الامتحان بصفه)
        // هنا سنربط بناءً على صف الطالب لضمان الدقة
        if (!empty($selected_class)) {
            $sql .= " AND s.academic_year_id = ?";
            $params[] = $selected_class;
        }

        // فلتر بالامتحان المحدد
        if (!empty($selected_exam)) {
            $sql .= " AND er.exam_id = ?";
            $params[] = $selected_exam;
        }

        // فلتر بالبحث النصي
        if (!empty($search_query)) {
            $sql .= " AND (s.name LIKE ? OR s.phone LIKE ?)";
            $params[] = "%$search_query%";
            $params[] = "%$search_query%";
        }

        $sql .= " ORDER BY er.id DESC";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>درجات الامتحانات | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        :root { --main-red: #DB1F41; --dark-grey: #3B525C; --main-yellow: #DCD001; }
        body { font-family: 'Cairo', sans-serif !important; }
        .skin-blue .main-header .navbar { background-color: var(--main-red); }
        .skin-blue .main-header .logo { background-color: var(--dark-grey); }
        .box { border-top: 4px solid var(--main-yellow); }
        .btn-search { background-color: var(--main-red); color: white; border: none; }
        .btn-search:hover { background-color: #bd1a38; color: var(--main-yellow); }
        
        .score-high { background-color: #00a65a; color: white; }
        .score-low { background-color: var(--main-red); color: white; }
        .progress-bar-success { background-color: #00a65a; }
        .progress-bar-danger { background-color: var(--main-red); }
    </style>
</head>

<body class="skin-blue sidebar-mini">
<div class="wrapper">

    <header class="main-header">
        <a href="dashboard.php" class="logo"><span class="logo-lg"><b>احياء</b> غنيم</span></a>
        <nav class="navbar navbar-static-top"><a href="#" class="sidebar-toggle" data-toggle="push-menu"></a></nav>
    </header>

    <?php include 'sidebar.php'; ?>

    <div class="content-wrapper">
        <section class="content-header">
            <h1>سجل درجات الامتحانات</h1>
        </section>

        <section class="content">
            
            <!-- مربع الفلترة والبحث -->
            <div class="box box-solid bg-gray-light">
                <div class="box-body">
                    <form action="view_exam_degrees.php" method="get">
                        <div class="row">
                            <!-- فلتر الصف الدراسي -->
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>تصفية حسب الصف:</label>
                                    <select name="class_id" class="form-control" onchange="this.form.submit()">
                                        <option value="">-- كل الصفوف --</option>
                                        <?php foreach ($classes as $class): ?>
                                            <option value="<?= $class['id'] ?>" <?= ($selected_class == $class['id']) ? 'selected' : '' ?>>
                                                <?= $class['name'] ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>

                            <!-- فلتر الامتحان -->
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>تصفية حسب الامتحان:</label>
                                    <select name="exam_id" class="form-control" onchange="this.form.submit()">
                                        <option value="">-- كل الامتحانات --</option>
                                        <?php foreach ($exams_list as $exam): 
                                            // عرض الامتحانات التابعة للصف المختار فقط (اختياري لتحسين التجربة)
                                            if (!empty($selected_class) && !empty($exam['class_id']) && $exam['class_id'] != $selected_class) continue;
                                        ?>
                                            <option value="<?= $exam['id'] ?>" <?= ($selected_exam == $exam['id']) ? 'selected' : '' ?>>
                                                <?= $exam['title'] ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>

                            <!-- البحث بالاسم -->
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>بحث بالاسم أو الهاتف:</label>
                                    <div class="input-group">
                                        <input type="text" name="search" class="form-control" placeholder="اكتب اسم الطالب..." value="<?= htmlspecialchars($search_query) ?>">
                                        <span class="input-group-btn">
                                            <button type="submit" class="btn btn-search"><i class="fa fa-search"></i></button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- زر إعادة تعيين -->
                            <div class="col-md-1">
                                <label style="color:transparent">.</label>
                                <a href="view_exam_degrees.php" class="btn btn-default btn-block"><i class="fa fa-refresh"></i></a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- جدول البيانات -->
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        
                        <?php if (empty($selected_class) && empty($selected_exam) && empty($search_query)): ?>
                            <!-- رسالة توجيهية عند فتح الصفحة لأول مرة -->
                            <div class="box-body text-center" style="padding: 50px;">
                                <i class="fa fa-filter fa-4x text-muted mb-3"></i>
                                <h3 class="text-muted">يرجى اختيار "الصف" أو "الامتحان" لعرض النتائج</h3>
                            </div>
                        <?php else: ?>
                            
                            <div class="box-header with-border">
                                <h3 class="box-title">نتائج البحث (<?= count($results) ?> طالب)</h3>
                                <!-- زر طباعة (شكلي) -->
                                <button class="btn btn-default btn-sm pull-left" onclick="window.print()"><i class="fa fa-print"></i> طباعة التقرير</button>
                            </div>

                            <div class="box-body table-responsive no-padding">
                                <table class="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>الطالب</th>
                                            <th>الامتحان</th>
                                            <th>الدرجة</th>
                                            <th>النسبة</th>
                                            <th>التاريخ</th>
                                            <th>حذف</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if (count($results) > 0): ?>
                                            <?php foreach ($results as $index => $res): 
                                                $total = $res['total_score'] > 0 ? $res['total_score'] : ($res['exam_max_score'] > 0 ? $res['exam_max_score'] : 1);
                                                $score = $res['score'];
                                                $percentage = ($score / $total) * 100;
                                                $badge_class = ($percentage >= 50) ? 'score-high' : 'score-low';
                                                $bar_class = ($percentage >= 50) ? 'progress-bar-success' : 'progress-bar-danger';
                                            ?>
                                            <tr>
                                                <td><?= $index + 1 ?></td>
                                                <td>
                                                    <strong><?= htmlspecialchars($res['student_name']) ?></strong><br>
                                                    <small class="text-muted"><?= htmlspecialchars($res['student_phone']) ?></small>
                                                </td>
                                                <td><?= htmlspecialchars($res['exam_title']) ?></td>
                                                <td>
                                                    <span class="badge badge-score <?= $badge_class ?>"><?= $score ?> / <?= $total ?></span>
                                                </td>
                                                <td style="width: 150px;">
                                                    <div class="progress xs">
                                                        <div class="progress-bar <?= $bar_class ?>" style="width: <?= $percentage ?>%"></div>
                                                    </div>
                                                    <small><?= round($percentage, 1) ?>%</small>
                                                </td>
                                                <td style="direction: ltr;"><?= date('Y-m-d', strtotime($res['completed_at'])) ?></td>
                                                <td>
                                                    <a href="view_exam_degrees.php?delete_id=<?= $res['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('حذف النتيجة؟')"><i class="fa fa-trash"></i></a>
                                                </td>
                                            </tr>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <tr>
                                                <td colspan="7" class="text-center" style="padding: 30px;">لا توجد نتائج مطابقة لهذا الفلتر.</td>
                                            </tr>
                                        <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                        
                    </div>
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