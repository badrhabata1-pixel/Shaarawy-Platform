<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (!isset($_GET['id'])) {
    header("Location: view_sheets.php");
    exit();
}

$sheet_id = $_GET['id'];

try {
    // 1. جلب بيانات الشيت الأساسية
    $stmt = $conn->prepare("SELECT * FROM sheets WHERE id = :id");
    $stmt->execute([':id' => $sheet_id]);
    $sheet = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sheet) die("الشيت غير موجود");

    // 2. جلب الدروس للقائمة
    $sql_lessons = "SELECT lessons.id, lessons.title, academic_years.name AS class_name 
                    FROM lessons 
                    JOIN units ON lessons.unit_id = units.id
                    JOIN academic_years ON units.academic_year_id = academic_years.id
                    ORDER BY academic_years.id, lessons.id";
    $lessons = $conn->query($sql_lessons)->fetchAll(PDO::FETCH_ASSOC);

    // 3. جلب الأسئلة المرتبطة بالشيت
    $stmt_q = $conn->prepare("SELECT * FROM questions WHERE sheet_id = :sid");
    $stmt_q->execute([':sid' => $sheet_id]);
    $existing_questions = $stmt_q->fetchAll(PDO::FETCH_ASSOC);

    // تجهيز الاختيارات لكل سؤال
    foreach ($existing_questions as &$question) {
        if ($question['answer_type'] == 'mcq') {
            $stmt_c = $conn->prepare("SELECT choice_text FROM question_choices WHERE question_id = :qid");
            $stmt_c->execute([':qid' => $question['id']]);
            $question['choices'] = $stmt_c->fetchAll(PDO::FETCH_COLUMN);
        }
    }
    unset($question); // كسر الرابط

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل الشيت | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="shortcut icon" href="#">
    
    <!-- CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* === الهوية البصرية الجديدة === */
        :root { 
            --main-red: #DB1F41;       /* الأحمر */
            --dark-grey: #3B525C;      /* الزيتي الغامق */
            --main-yellow: #DCD001;    /* الأصفر */
        }
        
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الشريط العلوي واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصناديق والحدود العلوية */
        .box-purple { border-top: 4px solid var(--main-yellow) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.08); background: #fff; }
        
        /* الأزرار */
        .btn-add-q { background: var(--dark-grey); color: white; border-radius: 50px; padding: 10px 30px; font-weight: bold; border: none; transition: 0.3s; }
        .btn-add-q:hover { color: var(--main-yellow); background: var(--main-red); }
        
        .btn-success { background-color: var(--dark-grey) !important; border-color: var(--dark-grey); }
        .btn-success:hover { background-color: var(--main-red) !important; border-color: var(--main-red); }

        .question-card {
            background: #fdfdfd;
            border: 1px solid #e1e1e1;
            border-right: 5px solid var(--main-red);
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 8px;
            position: relative;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .btn-delete-q { position: absolute; top: 10px; left: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; }
        .mcq-options { display: none; margin-top: 15px; padding: 15px; background: #f4f6f9; border: 1px dashed #ccc; border-radius: 5px; }
        .current-img-preview { margin-top: 5px; margin-bottom: 5px; padding: 5px; border: 1px dashed var(--main-yellow); display: inline-block; background: #eee; }
        .hidden { display: none; }
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
            <h1>إدارة الواجبات <small>تعديل الشيت</small></h1>
            <ol class="breadcrumb">
                <li><a href="view_sheets.php">الشيتات</a></li>
                <li class="active">تعديل</li>
            </ol>
        </section>

        <section class="content">
            <form action="update_sheet.php" method="post" enctype="multipart/form-data">
                <input type="hidden" name="sheet_id" value="<?php echo $sheet['id']; ?>">
                
                <!-- القسم الأول: بيانات الشيت -->
                <div class="box box-purple">
                    <div class="box-header with-border">
                        <h3 class="box-title">البيانات الأساسية</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>اسم الشيت</label>
                                    <input type="text" class="form-control" name="name" value="<?php echo htmlspecialchars($sheet['title']); ?>" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>تابع للدرس</label>
                                    <select class="form-control" name="lesson_id" required>
                                        <?php foreach ($lessons as $lesson): ?>
                                            <option value="<?php echo $lesson['id']; ?>" <?php echo ($lesson['id'] == $sheet['lesson_id']) ? 'selected' : ''; ?>>
                                                <?php echo $lesson['title'] . " (" . $lesson['class_name'] . ")"; ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>الدرجة العظمى</label>
                                    <input type="number" class="form-control" name="total_degree" value="<?php echo $sheet['total_marks']; ?>" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>وصف الشيت</label>
                                    <textarea class="form-control" name="description" rows="1"><?php echo htmlspecialchars($sheet['description']); ?></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>ملف PDF</label><br>
                            <?php if(!empty($sheet['file_path'])): ?>
                                <a href="../<?php echo $sheet['file_path']; ?>" target="_blank" class="btn btn-xs btn-info" style="background: var(--dark-grey); border:none;"><i class="fa fa-file-pdf-o"></i> الملف الحالي</a>
                                <input type="hidden" name="old_sheet_pdf" value="<?php echo $sheet['file_path']; ?>">
                            <?php endif; ?>
                            <input type="file" class="form-control" name="sheet_pdf" style="margin-top:5px;">
                        </div>
                    </div>
                </div>

                <!-- القسم الثاني: الأسئلة -->
                <div class="box box-solid" style="background: transparent; box-shadow: none;">
                    <div class="box-header text-center">
                        <button type="button" class="btn btn-add-q" onclick="addQuestion()">
                            <i class="fa fa-plus-circle"></i> إضافة سؤال جديد
                        </button>
                    </div>
                    
                    <div id="questions_container">
                        
                        <?php 
                        $q_counter = 0;
                        foreach ($existing_questions as $q): 
                            $q_counter++;
                            $is_image = ($q['question_type'] == 'image');
                            $is_mcq = ($q['answer_type'] == 'mcq');
                        ?>
                        <div class="question-card" id="q_exist_<?php echo $q_counter; ?>">
                            <button type="button" class="btn-delete-q" onclick="removeQuestion('q_exist_<?php echo $q_counter; ?>')"><i class="fa fa-trash"></i></button>
                            <h4 style="color: var(--dark-grey); border-bottom: 1px solid #eee; padding-bottom: 10px; font-weight: bold;">
                                <i class="fa fa-question-circle"></i> سؤال رقم <span class="q-num"><?php echo $q_counter; ?></span>
                            </h4>
                            
                            <input type="hidden" name="questions[<?php echo $q_counter; ?>][old_image]" value="<?php echo $q['image_path']; ?>">

                            <div class="row">
                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label>نص السؤال</label>
                                        <input type="text" name="questions[<?php echo $q_counter; ?>][text]" class="form-control q-text <?php echo $is_image ? 'hidden' : ''; ?>" value="<?php echo htmlspecialchars($q['question_text']); ?>" placeholder="اكتب السؤال هنا..." <?php echo $is_image ? '' : 'required'; ?>>
                                        
                                        <div class="q-file <?php echo $is_image ? '' : 'hidden'; ?>">
                                            <?php if(!empty($q['image_path'])): ?>
                                                <div class="current-img-preview">
                                                    <img src="../<?php echo $q['image_path']; ?>" height="50"> <small>الصورة الحالية</small>
                                                </div>
                                            <?php endif; ?>
                                            <input type="file" name="questions[<?php echo $q_counter; ?>][image]" class="form-control" style="margin-top:5px;">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>الدرجة</label>
                                        <input type="number" name="questions[<?php echo $q_counter; ?>][degree]" class="form-control" value="<?php echo $q['marks']; ?>" required>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>طريقة العرض</label>
                                        <select class="form-control" onchange="toggleFile(this)">
                                            <option value="text" <?php echo !$is_image ? 'selected' : ''; ?>>نص</option>
                                            <option value="image" <?php echo $is_image ? 'selected' : ''; ?>>صورة</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>نوع الإجابة</label>
                                <select class="form-control" name="questions[<?php echo $q_counter; ?>][type]" onchange="toggleMCQ(this, '<?php echo $q_counter; ?>')">
                                    <option value="essay" <?php echo !$is_mcq ? 'selected' : ''; ?>>مقالي (نصي)</option>
                                    <option value="mcq" <?php echo $is_mcq ? 'selected' : ''; ?>>اختيار من متعدد (MCQ)</option>
                                </select>
                            </div>

                            <div class="mcq-options" id="mcq_options_<?php echo $q_counter; ?>" style="display: <?php echo $is_mcq ? 'block' : 'none'; ?>;">
                                <label style="color: var(--main-red);">الاختيارات:</label>
                                <div class="choices-list">
                                    <?php if($is_mcq && isset($q['choices'])): ?>
                                        <?php foreach($q['choices'] as $choice): ?>
                                            <div class="input-group" style="margin-bottom: 8px;">
                                                <span class="input-group-addon"><i class="fa fa-circle-o" style="color: var(--main-yellow);"></i></span>
                                                <input type="text" name="questions[<?php echo $q_counter; ?>][choices][]" class="form-control choice-input" value="<?php echo htmlspecialchars($choice); ?>" required>
                                                <span class="input-group-btn">
                                                    <button type="button" class="btn btn-danger btn-flat" onclick="$(this).closest('.input-group').remove()"><i class="fa fa-times"></i></button>
                                                </span>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </div>
                                <button type="button" class="btn btn-default btn-sm" onclick="addChoice('<?php echo $q_counter; ?>')" style="margin-top:10px;">
                                    <i class="fa fa-plus"></i> إضافة اختيار آخر
                                </button>
                                
                                <div class="form-group" style="margin-top:15px; border-top: 1px solid #ddd; padding-top: 10px;">
                                    <label style="color: #00a65a;">الإجابة الصحيحة</label>
                                    <input type="text" name="questions[<?php echo $q_counter; ?>][correct_answer]" class="form-control" value="<?php echo htmlspecialchars($q['correct_answer']); ?>">
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>

                    </div>

                    <div class="box-footer text-center" style="margin-top: 20px;">
                        <button type="submit" class="btn btn-success btn-lg" style="width: 200px;">
                            <i class="fa fa-save"></i> حفظ التعديلات
                        </button>
                    </div>
                </div>
            </form>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by KABOx / Mindly</strong></footer>
</div>

<!-- قوالب (Templates) -->
<div id="question_template" style="display:none;">
    <div class="question-card" id="q_CARD_ID">
        <button type="button" class="btn-delete-q" onclick="removeQuestion('q_CARD_ID')"><i class="fa fa-trash"></i></button>
        <h4 style="color: var(--dark-grey); border-bottom: 1px solid #eee; padding-bottom: 10px; font-weight: bold;">
            <i class="fa fa-question-circle"></i> سؤال جديد <span class="q-num"></span>
        </h4>
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label>نص السؤال</label>
                    <input type="text" name="questions[INDEX][text]" class="form-control q-text" placeholder="اكتب السؤال هنا..." required>
                    <input type="file" name="questions[INDEX][image]" class="form-control q-file hidden" style="margin-top:5px;">
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label>الدرجة</label>
                    <input type="number" name="questions[INDEX][degree]" class="form-control" value="1" required>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label>طريقة العرض</label>
                    <select class="form-control" onchange="toggleFile(this)">
                        <option value="text">نص</option>
                        <option value="image">صورة</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>نوع الإجابة</label>
            <select class="form-control" name="questions[INDEX][type]" onchange="toggleMCQ(this, 'INDEX')">
                <option value="essay">مقالي (نصي)</option>
                <option value="mcq">اختيار من متعدد (MCQ)</option>
            </select>
        </div>
        <div class="mcq-options" id="mcq_options_INDEX">
            <label style="color: var(--main-red);">الاختيارات:</label>
            <div class="choices-list"></div>
            <button type="button" class="btn btn-default btn-sm" onclick="addChoice('INDEX')" style="margin-top:10px;"><i class="fa fa-plus"></i> إضافة اختيار</button>
            <div class="form-group" style="margin-top:15px; border-top: 1px solid #ddd; padding-top: 10px;">
                <label style="color: #00a65a;">الإجابة الصحيحة</label>
                <input type="text" name="questions[INDEX][correct_answer]" class="form-control" placeholder="الإجابة الصحيحة">
            </div>
        </div>
    </div>
</div>

<div id="choice_template" style="display:none;">
    <div class="input-group" style="margin-bottom: 8px;">
        <span class="input-group-addon"><i class="fa fa-circle-o" style="color: var(--main-yellow);"></i></span>
        <input type="text" name="questions[Q_INDEX][choices][]" class="form-control choice-input" placeholder="نص الاختيار..." required>
        <span class="input-group-btn">
            <button type="button" class="btn btn-danger btn-flat" onclick="$(this).closest('.input-group').remove()"><i class="fa fa-times"></i></button>
        </span>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

<script>
    let questionCount = <?php echo $q_counter; ?>;

    function addQuestion() {
        questionCount++;
        let template = $('#question_template').html();
        template = template.replace(/INDEX/g, questionCount);
        template = template.replace(/CARD_ID/g, 'new_' + questionCount);
        
        let $newQ = $(template);
        $newQ.find('.q-num').text(questionCount);
        $('#questions_container').append($newQ);
        $newQ.hide().slideDown();
    }

    function removeQuestion(id) {
        if(confirm('هل أنت متأكد من حذف هذا السؤال نهائياً؟')) {
            $('#' + id).slideUp(function() { $(this).remove(); });
        }
    }

    function toggleFile(select) {
        let $card = $(select).closest('.question-card');
        let $textInput = $card.find('.q-text');
        let $fileInput = $card.find('.q-file');

        if (select.value === 'image') {
            $textInput.addClass('hidden').removeAttr('required').val('');
            $fileInput.removeClass('hidden');
        } else {
            $textInput.removeClass('hidden').attr('required', 'required');
            $fileInput.addClass('hidden');
        }
    }

    function toggleMCQ(select, index) {
        let $optionsDiv = $('#mcq_options_' + index);
        let $choiceInputs = $optionsDiv.find('.choice-input');

        if (select.value === 'mcq') {
            $optionsDiv.slideDown();
            $choiceInputs.attr('required', 'required');
            if($optionsDiv.find('.choices-list').children().length === 0) {
                addChoice(index);
                addChoice(index);
            }
        } else {
            $optionsDiv.slideUp();
            $choiceInputs.removeAttr('required');
        }
    }

    function addChoice(qIndex) {
        let template = $('#choice_template').html();
        template = template.replace(/Q_INDEX/g, qIndex);
        $('#mcq_options_' + qIndex + ' .choices-list').append(template);
    }
</script>

</body>
</html>