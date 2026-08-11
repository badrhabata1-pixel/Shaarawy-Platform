<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

$search = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    $sql = "SELECT sheets.*, 
                   lessons.title AS lesson_name, 
                   academic_years.name AS class_name,
                   (SELECT COUNT(*) FROM questions WHERE questions.sheet_id = sheets.id) as q_count
            FROM sheets
            JOIN lessons ON sheets.lesson_id = lessons.id
            JOIN units ON lessons.unit_id = units.id
            JOIN academic_years ON units.academic_year_id = academic_years.id";

    if (!empty($search)) {
        $sql .= " WHERE sheets.title LIKE :search OR lessons.title LIKE :search";
    }

    $sql .= " ORDER BY sheets.id DESC";

    $stmt = $conn->prepare($sql);
    if (!empty($search)) $stmt->bindValue(':search', "%$search%");
    $stmt->execute();
    $sheets = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض الواجبات - احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        :root { 
            --main-red: #DB1F41; 
            --dark-green: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-green) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصناديق والحدود */
        .box { border-top: 4px solid var(--main-yellow) !important; }
        
        .badge-lesson { background-color: var(--dark-green); color: white; padding: 5px 10px; border-radius: 4px; }
        .badge-q { background-color: var(--main-red); color: white; padding: 3px 8px; border-radius: 10px; }
        
        .action-btn { width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; display: inline-block; color: white; margin: 0 2px; }
        .btn-edit { background-color: #f39c12; }
        .btn-delete { background-color: var(--main-red); }
        .btn-view { background-color: #00a65a; }
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

    <div class="content-wrapper">
        <section class="content-header">
            <div class="row">
                <div class="col-xs-6"><h1>أرشيف الواجبات</h1></div>
                <div class="col-xs-6 text-left">
                    <a href="add_sheet.php" class="btn btn-primary" style="background:var(--main-red); border:none;">
                        <i class="fa fa-plus"></i> إضافة شيت جديد
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            <div class="box">
                <div class="box-header">
                    <form action="view_sheets.php" method="get">
                        <div class="input-group" style="width: 300px;">
                            <input type="text" name="search" class="form-control" placeholder="بحث عن شيت..." value="<?php echo htmlspecialchars($search); ?>">
                            <div class="input-group-btn">
                                <button type="submit" class="btn btn-default" style="border-right: none;"><i class="fa fa-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>اسم الشيت</th>
                                <th>الدرس / الصف</th>
                                <th>عدد الأسئلة</th>
                                <th>الدرجة</th>
                                <th>ملف PDF</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($sheets) > 0): ?>
                                <?php foreach ($sheets as $index => $sheet): ?>
                                <tr>
                                    <td><?php echo $index + 1; ?></td>
                                    <td style="font-weight:bold;"><?php echo htmlspecialchars($sheet['title']); ?></td>
                                    <td>
                                        <span class="badge-lesson"><?php echo htmlspecialchars($sheet['lesson_name']); ?></span><br>
                                        <small style="color:#777;"><?php echo htmlspecialchars($sheet['class_name']); ?></small>
                                    </td>
                                    <td><span class="badge-q"><?php echo $sheet['q_count']; ?> سؤال</span></td>
                                    <td><span class="label" style="background-color: var(--main-yellow); color: #000;"><?php echo $sheet['total_marks']; ?> درجة</span></td>
                                    <td>
                                        <?php if (!empty($sheet['file_path'])): ?>
                                            <a href="../<?php echo $sheet['file_path']; ?>" target="_blank" style="color: var(--main-red);">
                                                <i class="fa fa-file-pdf-o fa-lg"></i> تحميل
                                            </a>
                                        <?php else: ?>
                                            <span class="text-muted">--</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <a href="edit_sheet.php?id=<?php echo $sheet['id']; ?>" class="action-btn btn-edit" title="تعديل"><i class="fa fa-edit"></i></a>
                                        <a href="delete_sheet.php?id=<?php echo $sheet['id']; ?>" class="action-btn btn-delete" onclick="return confirm('حذف هذا الشيت؟');" title="حذف"><i class="fa fa-trash"></i></a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr><td colspan="7" class="text-center">لا توجد شيتات مضافة</td></tr>
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