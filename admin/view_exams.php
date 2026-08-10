<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

$search = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    // جلب الامتحانات + اسم الدرس + عدد الأسئلة
    $sql = "SELECT exams.*, 
                   lessons.title AS lesson_name,
                   (SELECT COUNT(*) FROM questions WHERE questions.exam_id = exams.id) as q_count
            FROM exams
            LEFT JOIN lessons ON exams.lesson_id = lessons.id";

    if (!empty($search)) {
        $sql .= " WHERE exams.title LIKE :search";
    }

    $sql .= " ORDER BY exams.id DESC";

    $stmt = $conn->prepare($sql);
    if (!empty($search)) $stmt->bindValue(':search', "%$search%");
    $stmt->execute();
    $exams = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض الامتحانات | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS -->
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
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصناديق والحدود */
        .box { border-top: 4px solid var(--main-yellow) !important; }
        
        .badge-type { padding: 5px 10px; border-radius: 15px; font-size: 11px; }
        .type-open { background-color: #00a65a; color: white; }
        .type-closed { background-color: var(--main-red); color: white; }
        
        .exam-img { width: 60px; height: 40px; border-radius: 5px; object-fit: cover; border: 1px solid #ddd; }
        
        .action-btn { width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; display: inline-block; color: white; margin: 0 2px; }
        .btn-edit { background-color: #f39c12; }
        .btn-delete { background-color: var(--main-red); }

        .btn-add-new {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white;
            border: none;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-add-new:hover { color: var(--main-yellow); transform: translateY(-2px); }
        
        .bg-purple { background-color: var(--dark-grey) !important; }
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

    <div class="content-wrapper">
        <section class="content-header">
            <div class="row">
                <div class="col-xs-6"><h1>الامتحانات</h1></div>
                <div class="col-xs-6 text-left">
                    <a href="add_exam.php" class="btn btn-add-new">
                        <i class="fa fa-plus"></i> إضافة امتحان
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            <div class="box">
                <div class="box-header">
                    <form action="view_exams.php" method="get">
                        <div class="input-group" style="width: 300px;">
                            <input type="text" name="search" class="form-control" placeholder="بحث عن امتحان..." value="<?php echo htmlspecialchars($search); ?>">
                            <div class="input-group-btn">
                                <button type="submit" class="btn btn-default"><i class="fa fa-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الصورة</th>
                                <th>اسم الامتحان</th>
                                <th>النوع / التوقيت</th>
                                <th>المحتوى</th>
                                <th>الدرجة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($exams) > 0): ?>
                                <?php foreach ($exams as $index => $exam): ?>
                                <tr>
                                    <td><?php echo $index + 1; ?></td>
                                    <td>
                                        <?php $img = !empty($exam['image']) ? "../".$exam['image'] : "https://via.placeholder.com/60x40?text=Exam"; ?>
                                        <img src="<?php echo $img; ?>" class="exam-img">
                                    </td>
                                    <td style="font-weight:bold;">
                                        <?php echo htmlspecialchars($exam['title']); ?><br>
                                        <small style="color:#777;">
                                            <?php echo !empty($exam['lesson_name']) ? 'تابع لـ: '.$exam['lesson_name'] : 'امتحان عام'; ?>
                                        </small>
                                    </td>
                                    <td>
                                        <?php if($exam['exam_type'] == 'open'): ?>
                                            <span class="badge-type type-open">وقت مفتوح</span>
                                        <?php else: ?>
                                            <span class="badge-type type-closed">وقت محدد</span><br>
                                            <small style="font-size:11px;">
                                                من: <?php echo date('Y-m-d H:i', strtotime($exam['start_time'])); ?><br>
                                                إلى: <?php echo date('Y-m-d H:i', strtotime($exam['end_time'])); ?>
                                            </small>
                                        <?php endif; ?>
                                        <div style="margin-top:5px; color:var(--main-red); font-weight:bold;">
                                            <i class="fa fa-clock-o"></i> <?php echo $exam['time_limit_minutes']; ?> دقيقة
                                        </div>
                                    </td>
                                    <td><span class="badge bg-purple"><?php echo $exam['q_count']; ?> سؤال</span></td>
                                    <td><span class="label" style="background-color: var(--main-yellow); color: #000;"><?php echo $exam['total_marks']; ?> درجة</span></td>
                                    <td>
                                        <a href="edit_exam.php?id=<?php echo $exam['id']; ?>" class="action-btn btn-edit"><i class="fa fa-edit"></i></a>
                                        <a href="delete_exam.php?id=<?php echo $exam['id']; ?>" class="action-btn btn-delete" onclick="return confirm('هل أنت متأكد؟ سيتم حذف الامتحان وجميع أسئلته!');"><i class="fa fa-trash"></i></a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr><td colspan="7" class="text-center">لا توجد امتحانات مضافة</td></tr>
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