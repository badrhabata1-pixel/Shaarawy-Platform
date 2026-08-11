<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

$search_keyword = isset($_GET['search']) ? trim($_GET['search']) : '';

try {
    // جلب المساعدين فقط (role = assistant)
    $sql = "SELECT * FROM admins WHERE role = 'assistant'";

    if (!empty($search_keyword)) {
        $sql .= " AND (name LIKE :keyword OR email LIKE :keyword OR phone LIKE :keyword)";
    }

    $sql .= " ORDER BY id DESC";

    $stmt = $conn->prepare($sql);
    if (!empty($search_keyword)) {
        $stmt->bindValue(':keyword', "%$search_keyword%");
    }
    $stmt->execute();
    $assistants = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("خطأ: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>عرض المساعدين | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS -->
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
        
        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصناديق والحدود */
        .box { border-top: 4px solid var(--main-yellow) !important; }
        
        .user-img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--main-yellow); }
        .badge-salary { background-color: var(--dark-grey); color: white; padding: 3px 8px; border-radius: 10px; font-size: 12px; }
        
        .action-btn { width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 50%; display: inline-block; color: white; }
        .btn-edit { background-color: #3498db; }
        .btn-delete { background-color: var(--main-red); }

        .btn-add-new {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white;
            border: none;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-add-new:hover { color: var(--main-yellow); transform: translateY(-2px); }
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
                <div class="col-xs-6"><h1>المساعدين</h1></div>
                <div class="col-xs-6 text-left">
                    <a href="add_assistant.php" class="btn btn-add-new">
                        <i class="fa fa-user-plus"></i> إضافة مساعد
                    </a>
                </div>
            </div>
        </section>

        <section class="content">
            <div class="box">
                <div class="box-header">
                    <form action="view_assistants.php" method="get">
                        <div class="input-group" style="width: 300px;">
                            <input type="text" name="search" class="form-control" placeholder="بحث بالاسم أو الهاتف..." value="<?php echo htmlspecialchars($search_keyword); ?>">
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
                                <th>الاسم</th>
                                <th>الاتصال</th>
                                <th>الراتب</th>
                                <th>تاريخ الإضافة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($assistants) > 0): ?>
                                <?php foreach ($assistants as $index => $row): ?>
                                <tr>
                                    <td><?php echo $index + 1; ?></td>
                                    <td>
                                        <?php $img = !empty($row['image']) ? "../".$row['image'] : "https://via.placeholder.com/50"; ?>
                                        <img src="<?php echo $img; ?>" class="user-img">
                                    </td>
                                    <td style="font-weight:bold;"><?php echo htmlspecialchars($row['name']); ?></td>
                                    <td>
                                        <i class="fa fa-phone"></i> <?php echo htmlspecialchars($row['phone']); ?><br>
                                        <small style="color:#777;"><?php echo htmlspecialchars($row['email']); ?></small>
                                    </td>
                                    <td><span class="badge-salary"><?php echo number_format($row['salary']); ?> ج.م</span></td>
                                    <td><?php echo date('Y-m-d', strtotime($row['created_at'])); ?></td>
                                    <td>
                                        <a href="edit_assistant.php?id=<?php echo $row['id']; ?>" class="action-btn btn-edit"><i class="fa fa-edit"></i></a>
                                        <a href="delete_assistant.php?id=<?php echo $row['id']; ?>" class="action-btn btn-delete" onclick="return confirm('هل أنت متأكد من حذف هذا المساعد؟');"><i class="fa fa-trash"></i></a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr><td colspan="7" class="text-center">لا يوجد مساعدين حالياً</td></tr>
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