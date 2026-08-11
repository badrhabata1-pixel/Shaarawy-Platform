<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة مساعد جديد | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* الهوية الجديدة: أحمر، زيتي، أصفر */
        :root {
            --main-red: #DB1F41;
            --dark-grey: #3B525C;
            --main-yellow: #DCD001;
        }

        body, h1, h2, h3, h4, label, input, select, textarea, button {
            font-family: 'Cairo', sans-serif !important;
        }

        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }

        .box {
            border-top: 4px solid var(--main-yellow);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .form-horizontal .control-label {
            text-align: right;
            color: #555;
            font-weight: bold;
        }

        .form-control:focus {
            border-color: var(--main-red);
            box-shadow: 0 0 5px rgba(219, 31, 65, 0.3);
        }

        .btn-submit {
            background: linear-gradient(45deg, var(--main-red), var(--dark-grey));
            color: white;
            border: none;
            padding: 10px 40px;
            font-size: 16px;
            font-weight: bold;
            transition: 0.3s;
            border-radius: 4px;
        }
        .btn-submit:hover {
            color: var(--main-yellow);
            transform: translateY(-2px);
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
            <h1>إدارة المساعدين <small>إضافة مساعد جديد</small></h1>
            <ol class="breadcrumb">
                <li><a href="dashboard.php"><i class="fa fa-dashboard"></i> الرئيسية</a></li>
                <li><a href="view_assistants.php">المساعدين</a></li>
                <li class="active">إضافة مساعد</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">بيانات المساعد الجديد</h3>
                        </div>

                        <div class="box-body">
                            <!-- الفورم -->
                            <form class="form-horizontal" action="save_assistant.php" method="post" enctype="multipart/form-data">
                                
                                <!-- اسم المساعد -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">اسم المساعد</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" name="name" required placeholder="الاسم الكامل">
                                    </div>
                                </div>

                                <!-- صورة المساعد -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">صورة المساعد</label>
                                    <div class="col-sm-8">
                                        <input type="file" class="form-control" name="image" required>
                                    </div>
                                </div>

                                <!-- البريد الإلكتروني -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">البريد الإلكتروني</label>
                                    <div class="col-sm-8">
                                        <input type="email" class="form-control" name="email" required placeholder="assistant@example.com">
                                    </div>
                                </div>

                                <!-- كلمة المرور -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">كلمة المرور</label>
                                    <div class="col-sm-8">
                                        <input type="password" class="form-control" name="password" required placeholder="******">
                                    </div>
                                </div>

                                <!-- المرتب -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">المرتب (جنيه)</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" name="salary" required placeholder="مثال: 2000">
                                    </div>
                                </div>

                                <!-- رقم الهاتف -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">رقم الهاتف</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" name="phone" required placeholder="01xxxxxxxxx">
                                    </div>
                                </div>

                                <!-- زر الحفظ -->
                                <div class="box-footer text-center">
                                    <input type="submit" name="submit" value="إضافة المساعد" class="btn-submit">
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <footer class="main-footer text-center">
        <strong>powered by KABOx / Mindly</strong>
    </footer>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

</body>
</html>