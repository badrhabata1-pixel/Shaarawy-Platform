<?php
session_start();
include '../db_connect.php';

if (!isset($_GET['id'])) header("Location: view_groups.php");
$id = $_GET['id'];

// جلب بيانات المجموعة
$stmt = $conn->prepare("SELECT * FROM groups WHERE id = :id");
$stmt->execute([':id' => $id]);
$group = $stmt->fetch(PDO::FETCH_ASSOC);

// جلب القوائم
$academic_years = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);
$assistants = $conn->query("SELECT * FROM admins WHERE role = 'assistant'")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل مجموعة | احياء غنيم</title>
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
        
        .box-theme { border-top: 4px solid var(--main-yellow); padding: 20px; background: #fff; }
        .btn-submit { background-color: var(--main-red); color: white; border-radius: 50px; padding: 10px 40px; border: none; font-weight: bold; }
        .btn-submit:hover { background-color: var(--dark-grey); color: var(--main-yellow); }
        
        label { color: var(--dark-grey); font-weight: bold; }
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
        <section class="content-header"><h1>تعديل المجموعة</h1></section>
        <section class="content">
            <div class="col-md-8 col-md-offset-2">
                <div class="box box-theme">
                    <form action="update_group.php" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo $group['id']; ?>">
                        <input type="hidden" name="old_image" value="<?php echo $group['image']; ?>">

                        <div class="form-group">
                            <label>اسم المجموعة</label>
                            <input type="text" class="form-control" name="name" value="<?php echo htmlspecialchars($group['name']); ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label>الصف الدراسي</label>
                            <select class="form-control" name="academic_year_id">
                                <?php foreach($academic_years as $year): ?>
                                    <option value="<?php echo $year['id']; ?>" <?php if($year['id'] == $group['academic_year_id']) echo 'selected'; ?>>
                                        <?php echo $year['name']; ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>الوصف</label>
                            <textarea class="form-control" name="description"><?php echo htmlspecialchars($group['description']); ?></textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label>الساعة</label>
                                <input type="number" class="form-control" name="hour" value="<?php echo $group['hour']; ?>">
                            </div>
                            <div class="col-md-6">
                                <label>المساعد</label>
                                <select class="form-control" name="assistant_id">
                                    <option value="">بدون مساعد</option>
                                    <?php foreach($assistants as $asst): ?>
                                        <option value="<?php echo $asst['id']; ?>" <?php if($asst['id'] == $group['assistant_id']) echo 'selected'; ?>>
                                            <?php echo $asst['name']; ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-6">
                                <label>تاريخ البدء</label>
                                <input type="date" class="form-control" name="start_date" value="<?php echo $group['start_date']; ?>">
                            </div>
                            <div class="col-md-6">
                                <label>تاريخ الانتهاء</label>
                                <input type="date" class="form-control" name="end_date" value="<?php echo $group['end_date']; ?>">
                            </div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label>نوع الحضور</label>
                            <select class="form-control" name="loop">
                                <option value="1" <?php if($group['attendance_type'] == 1) echo 'selected'; ?>>سبت - اثنين - أربعاء</option>
                                <option value="2" <?php if($group['attendance_type'] == 2) echo 'selected'; ?>>أحد - ثلاثاء - خميس</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>تغيير الصورة</label>
                            <?php if($group['image']): ?>
                                <br><img src="../<?php echo $group['image']; ?>" width="80" style="margin-bottom: 10px; border: 1px solid var(--main-yellow);"><br>
                            <?php endif; ?>
                            <input type="file" class="form-control" name="image">
                        </div>

                        <button type="submit" class="btn btn-submit btn-block">حفظ التعديلات</button>
                    </form>
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