<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// التحقق من ID
if (!isset($_GET['id'])) {
    header("Location: view_lessons.php");
    exit();
}

$id = $_GET['id'];

try {
    // 1. جلب بيانات الدرس الحالي
    $stmt = $conn->prepare("SELECT * FROM lessons WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $lesson = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lesson) die("الدرس غير موجود");

    // 2. جلب الوحدات للقائمة المنسدلة
    $sql_units = "SELECT units.id, units.title, academic_years.name AS class_name 
                  FROM units 
                  JOIN academic_years ON units.academic_year_id = academic_years.id 
                  ORDER BY academic_years.id ASC, units.id ASC";
    $units = $conn->query($sql_units)->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل الدرس | احياء غنيم</title>
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
            --dark-grey: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        .box.box-theme {
            border-top: 4px solid var(--main-yellow);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .form-control:focus { border-color: var(--main-red); box-shadow: 0 0 5px rgba(219, 31, 65, 0.3); }
        .btn-primary { background-color: var(--main-red); border: none; padding: 10px 40px; font-weight: bold; }
        .btn-primary:hover { background-color: var(--dark-grey); color: var(--main-yellow); }
        
        .current-file-preview {
            background: #f9f9f9;
            padding: 10px;
            border: 1px dashed var(--main-yellow);
            border-radius: 5px;
            margin-bottom: 10px;
            font-size: 13px;
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

    <div class="content-wrapper">
        <section class="content-header">
            <h1>إدارة الدروس <small>تعديل بيانات الدرس</small></h1>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-theme">
                        <div class="box-header with-border">
                            <h3 class="box-title">تعديل: <?php echo htmlspecialchars($lesson['title']); ?></h3>
                        </div>

                        <div class="box-body">
                            <form class="form-horizontal" action="update_lesson.php" method="post" enctype="multipart/form-data">
                                
                                <input type="hidden" name="id" value="<?php echo $lesson['id']; ?>">
                                <input type="hidden" name="old_image" value="<?php echo $lesson['image']; ?>">
                                <input type="hidden" name="old_pdf1" value="<?php echo $lesson['pdf_file']; ?>">
                                <input type="hidden" name="old_pdf2" value="<?php echo $lesson['pdf_file_2']; ?>">

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">اسم الدرس</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" name="title" value="<?php echo htmlspecialchars($lesson['title']); ?>" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">سعر الدرس</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" name="price" value="<?php echo $lesson['price']; ?>" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">وصف الدرس</label>
                                    <div class="col-sm-8">
                                        <textarea class="form-control" rows="3" name="description" required><?php echo htmlspecialchars($lesson['description']); ?></textarea>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">صورة الدرس</label>
                                    <div class="col-sm-8">
                                        <?php if (!empty($lesson['image'])): ?>
                                            <div class="current-file-preview">
                                                <img src="../<?php echo $lesson['image']; ?>" height="80">
                                                <span class="text-success"><i class="fa fa-check"></i> الصورة الحالية</span>
                                            </div>
                                        <?php endif; ?>
                                        <input type="file" class="form-control" name="image">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">ملف PDF 1</label>
                                    <div class="col-sm-8">
                                        <?php if (!empty($lesson['pdf_file'])): ?>
                                            <div class="current-file-preview">
                                                <i class="fa fa-file-pdf-o text-red"></i> <a href="../<?php echo $lesson['pdf_file']; ?>" target="_blank">عرض الملف الحالي</a>
                                            </div>
                                        <?php endif; ?>
                                        <input type="file" class="form-control" name="pdf_file">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">لينك الفيديو</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" name="video_url" value="<?php echo htmlspecialchars($lesson['video_url']); ?>">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">رقم الدرس</label>
                                    <div class="col-sm-3">
                                        <input type="number" class="form-control" name="lesson_number" value="<?php echo $lesson['lesson_number']; ?>" required>
                                    </div>
                                    
                                    <label class="col-sm-2 control-label">الترتيب</label>
                                    <div class="col-sm-3">
                                        <input type="number" class="form-control" name="sort_order" value="<?php echo $lesson['sort_order']; ?>">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الوحدة</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="unit_id" required>
                                            <?php foreach ($units as $unit): ?>
                                                <option value="<?php echo $unit['id']; ?>" <?php echo ($unit['id'] == $lesson['unit_id']) ? 'selected' : ''; ?>>
                                                    <?php echo $unit['title'] . " (" . $unit['class_name'] . ")"; ?>
                                                </option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>

                                <div class="box-footer text-center">
                                    <button type="submit" class="btn btn-primary">حفظ التعديلات</button>
                                </div>

                            </form>
                        </div>
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