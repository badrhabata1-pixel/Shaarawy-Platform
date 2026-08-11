<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. التحقق من وجود ID
if (!isset($_GET['id'])) {
    header("Location: view_units.php");
    exit();
}

$id = $_GET['id'];

try {
    // جلب بيانات الوحدة الحالية
    $stmt = $conn->prepare("SELECT * FROM units WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $unit = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$unit) {
        die("الوحدة غير موجودة");
    }

    // جلب الصفوف الدراسية للقائمة المنسدلة
    $classes = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل الوحدة | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <link rel="shortcut icon" href="#">

    <!-- ملفات CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === تخصيص الثيم (أحمر، زيتي، أصفر) === */
        :root {
            --main-red: #DB1F41;
            --dark-grey: #3B525C;
            --main-yellow: #DCD001;
        }

        body, h1, h2, h3, h4, label, input, select, textarea, button {
            font-family: 'Cairo', sans-serif !important;
        }

        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }

        .box.box-purple {
            border-top: 4px solid var(--main-yellow) !important;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            background: #fff;
        }
        
        .form-control:focus {
            border-color: var(--main-red);
            box-shadow: 0 0 5px rgba(219, 31, 65, 0.3);
        }

        .btn-submit {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white;
            padding: 10px 50px;
            border-radius: 50px;
            border: none;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(219, 31, 65, 0.4);
            transition: 0.3s;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            color: var(--main-yellow);
        }

        .current-img-container {
            background: #f4f6f9;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 10px;
            border: 2px solid var(--main-yellow);
            text-align: center;
        }
        .current-img-container img { max-height: 100px; border-radius: 4px; }
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
            <h1>إدارة الوحدات <small>تعديل الوحدة</small></h1>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="box box-purple">
                        <div class="box-header with-border">
                            <h3 class="box-title"><i class="fa fa-edit"></i> تعديل بيانات الوحدة: <?php echo htmlspecialchars($unit['title']); ?></h3>
                        </div>

                        <div class="box-body">
                            <form class="form-horizontal" action="update_unit.php" method="post" enctype="multipart/form-data">
                                <input type="hidden" name="id" value="<?php echo $unit['id']; ?>">
                                <input type="hidden" name="old_image" value="<?php echo $unit['image']; ?>">

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">اسم الوحدة</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" name="title" value="<?php echo htmlspecialchars($unit['title']); ?>" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">وصف الوحدة</label>
                                    <div class="col-sm-8">
                                        <textarea class="form-control" rows="3" name="description" required><?php echo htmlspecialchars($unit['description']); ?></textarea>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">صورة الوحدة</label>
                                    <div class="col-sm-8">
                                        <?php if (!empty($unit['image'])): ?>
                                            <div class="current-img-container">
                                                <img src="../<?php echo $unit['image']; ?>" alt="صورة الوحدة الحالية">
                                            </div>
                                        <?php endif; ?>
                                        <input type="file" class="form-control" name="image">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الصف الدراسي</label>
                                    <div class="col-sm-8">
                                        <select class="form-control select2" name="academic_year_id" required>
                                            <?php foreach ($classes as $class): ?>
                                                <option value="<?php echo $class['id']; ?>" <?php echo ($class['id'] == $unit['academic_year_id']) ? 'selected' : ''; ?>>
                                                    <?php echo $class['name']; ?>
                                                </option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label">الفصل الدراسي (الترم)</label>
                                    <div class="col-sm-8">
                                        <select class="form-control select2" name="term" required>
                                            <option value="1" <?php echo ($unit['term'] == 1) ? 'selected' : ''; ?>>الترم الأول</option> 
                                            <option value="2" <?php echo ($unit['term'] == 2) ? 'selected' : ''; ?>>الترم الثاني</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="box-footer text-center">
                                    <button type="submit" class="btn-submit">
                                        <i class="fa fa-save"></i> حفظ التعديلات
                                    </button>
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