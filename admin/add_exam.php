<?php
session_start();
include '../db_connect.php';

// 1. حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// 2. جلب البيانات للقوائم
try {
    // جلب الصفوف الدراسية
    $classes = $conn->query("SELECT * FROM academic_years")->fetchAll(PDO::FETCH_ASSOC);

    // جلب الدروس (مع اسم الصف للفلترة لاحقاً)
    $lessons = $conn->query("
        SELECT lessons.id, lessons.title, academic_years.id AS class_id, academic_years.name AS class_name 
        FROM lessons 
        JOIN units ON lessons.unit_id = units.id
        JOIN academic_years ON units.academic_year_id = academic_years.id
        ORDER BY academic_years.id, lessons.id
    ")->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة امتحان | احياء غنيم</title>
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
        /* === الهوية الجديدة === */
        :root { --main-red: #DB1F41; --dark-grey: #3B525C; --main-yellow: #DCD001; }
        body { font-family: 'Cairo', sans-serif !important; }
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; }
        .box-purple { border-top: 4px solid var(--main-yellow) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.08); background: #fff; }
        .btn-add-q { background: var(--dark-grey); color: white; border-radius: 50px; padding: 10px 30px; border: none; }
        .question-card { background: #fdfdfd; border: 1px solid #e1e1e1; border-right: 5px solid var(--main-red); padding: 20px; margin-bottom: 25px; border-radius: 8px; position: relative; }
        .btn-delete-q { position: absolute; top: 10px; left: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; }
        .mcq-options { display: none; margin-top: 15px; padding: 15px; background: #f4f6f9; border: 1px dashed #ccc; border-radius: 5px; }
        .essay-answer { display: none; margin-top: 15px; padding: 15px; background: #fff8e1; border: 1px dashed var(--main-yellow); border-radius: 5px; }
        #timer_section { display: none; background: #e8f0fe; padding: 15px; border-radius: 5px; margin-bottom: 15px; border: 1px dashed var(--dark-grey); }
        .hidden { display: none; }
        .correct-radio { transform: scale(1.5); margin-left: 10px !important; cursor: pointer; }
        .btn-success { background-color: var(--dark-grey) !important; border-color: var(--dark-grey); font-weight: bold; }
        .btn-success:hover { background-color: var(--main-red) !important; border-color: var(--main-red); }
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
            <h1>إدارة الامتحانات <small>إضافة امتحان جديد</small></h1>
        </section>

        <section class="content">
            <form action="save_exam.php" method="post" enctype="multipart/form-data" id="examForm">
                
                <!-- البيانات الأساسية -->
                <div class="box box-purple">
                    <div class="box-header with-border"><h3 class="box-title">البيانات الأساسية</h3></div>
                    <div class="box-body">
                        
                        <!-- الصف الدراسي (الجديد) -->
                        <div class="form-group">
                            <label>الصف الدراسي (إجباري)</label>
                            <select class="form-control" name="class_id" id="classSelect" onchange="filterLessons()" required>
                                <option value="" disabled selected>-- اختر الصف --</option>
                                <?php foreach ($classes as $class): ?>
                                    <option value="<?= $class['id'] ?>"><?= $class['name'] ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <!-- الدروس -->
                        <div class="form-group">
                            <label>ارتباط الامتحان</label>
                            <select class="form-control" name="lesson_id" id="lessonSelect">
                                <option value="">-- امتحان عام (غير مرتبط بدرس) --</option>
                                <!-- سيتم ملء الدروس بالجافاسكريبت بناءً على الصف المختار -->
                                <?php foreach ($lessons as $lesson): ?>
                                    <option value="<?= $lesson['id'] ?>" data-class="<?= $lesson['class_id'] ?>">
                                        <?= $lesson['title'] ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small class="text-muted">اختر "امتحان عام" إذا كان الامتحان يغطي المنهج كاملاً أو وحدة كاملة.</small>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>اسم الامتحان</label>
                                    <input type="text" class="form-control" name="name" required placeholder="مثال: امتحان شامل">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>نوع الامتحان</label>
                                    <select class="form-control" name="exam_type" id="exam_type" onchange="toggleTimer()">
                                        <option value="open">وقت مفتوح</option>
                                        <option value="closed">وقت محدد (تاريخ)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>الدرجة العظمى</label>
                                    <input type="number" class="form-control" name="total_degree" placeholder="100" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>مدة الامتحان (دقائق)</label>
                                    <input type="number" class="form-control" name="time_limit" placeholder="60" required>
                                </div>
                            </div>
                        </div>

                        <div id="timer_section">
                            <div class="row">
                                <div class="col-md-6"><div class="form-group"><label>بدء الامتحان</label><input type="datetime-local" class="form-control" name="start_at"></div></div>
                                <div class="col-md-6"><div class="form-group"><label>انتهاء الامتحان</label><input type="datetime-local" class="form-control" name="end_at"></div></div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>وصف الامتحان</label>
                                    <textarea class="form-control" name="description" rows="2"></textarea>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>صورة الغلاف</label>
                                    <input type="file" class="form-control" name="image">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- الأسئلة -->
                <div class="box box-solid" style="background: transparent; box-shadow: none;">
                    <div class="box-header text-center">
                        <button type="button" class="btn btn-add-q" onclick="addQuestion()"><i class="fa fa-plus-circle"></i> إضافة سؤال</button>
                    </div>
                    <div id="questions_container"></div>
                    <div class="box-footer text-center" style="margin-top: 20px;">
                        <button type="submit" class="btn btn-success btn-lg" style="width: 200px;">حفظ الامتحان</button>
                    </div>
                </div>
            </form>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by KABOx / Mindly</strong></footer>
</div>

<!-- القوالب (نفس القديم) -->
<div id="question_template" style="display:none;">
    <div class="question-card" id="q_CARD_ID">
        <button type="button" class="btn-delete-q" onclick="removeQuestion('q_CARD_ID')"><i class="fa fa-trash"></i></button>
        <h4 style="color: var(--main-red); border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <i class="fa fa-question-circle"></i> سؤال <span class="q-num"></span>
        </h4>
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label>السؤال</label>
                    <input type="text" name="questions[INDEX][text]" class="form-control q-text" required>
                    <input type="file" name="questions[INDEX][image]" class="form-control q-file hidden" style="margin-top:5px;">
                </div>
            </div>
            <div class="col-md-2"><div class="form-group"><label>الدرجة</label><input type="number" name="questions[INDEX][degree]" class="form-control" value="1" required></div></div>
            <div class="col-md-2">
                <div class="form-group"><label>العرض</label><select class="form-control" onchange="toggleFile(this)"><option value="text">نص</option><option value="image">صورة</option></select></div>
            </div>
        </div>
        <div class="form-group">
            <label>النوع</label>
            <select class="form-control" name="questions[INDEX][type]" onchange="toggleAnswerType(this, 'INDEX')">
                <option value="essay">مقالي</option>
                <option value="mcq">اختياري</option>
            </select>
        </div>
        <div class="mcq-options" id="mcq_options_INDEX">
            <label style="color: #00a65a;">الاختيارات:</label>
            <div class="choices-list"></div>
            <button type="button" class="btn btn-default btn-sm" onclick="addChoice('INDEX')">+ اختيار</button>
            <input type="hidden" class="correct-answer-input"> 
        </div>
        <div class="essay-answer" id="essay_options_INDEX" style="display:block;">
            <label style="color: #e67e22;">الإجابة النموذجية</label>
            <textarea name="questions[INDEX][correct_answer]" class="form-control essay-input" rows="2"></textarea>
        </div>
    </div>
</div>

<div id="choice_template" style="display:none;">
    <div class="input-group" style="margin-bottom: 8px;">
        <span class="input-group-addon" style="background:#fff; border-left:0;">
            <input type="radio" name="radio_Q_INDEX" class="correct-radio" onchange="setCorrectAnswer(this, 'Q_INDEX')">
        </span>
        <input type="text" name="questions[Q_INDEX][choices][]" class="form-control choice-text" required oninput="syncCorrectAnswer(this, 'Q_INDEX')">
        <span class="input-group-btn"><button type="button" class="btn btn-danger" onclick="$(this).closest('.input-group').remove()">x</button></span>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

<script>
    // فلترة الدروس حسب الصف المختار
    function filterLessons() {
        var selectedClass = document.getElementById('classSelect').value;
        var lessonSelect = document.getElementById('lessonSelect');
        var options = lessonSelect.getElementsByTagName('option');
        
        // إظهار الخيار الأول (عام) دائماً
        options[0].style.display = 'block';
        lessonSelect.value = ""; // إعادة تعيين

        for (var i = 1; i < options.length; i++) {
            var optionClass = options[i].getAttribute('data-class');
            if (optionClass == selectedClass) {
                options[i].style.display = 'block';
            } else {
                options[i].style.display = 'none';
            }
        }
    }

    // دوال الامتحان (نفس السابق)
    let questionCount = 0;
    function toggleTimer() { var type = document.getElementById('exam_type').value; document.getElementById('timer_section').style.display = (type === 'closed') ? 'block' : 'none'; }
    function addQuestion() { questionCount++; let t = $('#question_template').html().replace(/INDEX/g, questionCount).replace(/CARD_ID/g, questionCount); let n = $(t); n.find('.q-num').text(questionCount); $('#questions_container').append(n); n.hide().slideDown(); }
    function removeQuestion(id) { if(confirm('حذف؟')) $('#' + id).slideUp(function() { $(this).remove(); }); }
    function toggleFile(s) { let c = $(s).closest('.question-card'), t = c.find('.q-text'), f = c.find('.q-file'); if(s.value==='image'){t.addClass('hidden').removeAttr('required'); f.removeClass('hidden').attr('required','required');}else{t.removeClass('hidden').attr('required','required'); f.addClass('hidden').removeAttr('required');} }
    function toggleAnswerType(s, idx) { let m = $('#mcq_options_'+idx), e = $('#essay_options_'+idx), h = $('#q_'+idx+' .correct-answer-input'), i = e.find('.essay-input'), c = m.find('.choice-text'); if(s.value==='mcq'){e.slideUp(); i.removeAttr('name'); m.slideDown(); c.attr('required','required'); h.attr('name', 'questions['+idx+'][correct_answer]'); if(m.find('.choices-list').children().length===0){addChoice(idx);addChoice(idx);}}else{m.slideUp(); c.removeAttr('required'); h.removeAttr('name'); e.slideDown(); i.attr('name', 'questions['+idx+'][correct_answer]');} }
    function addChoice(idx) { let t = $('#choice_template').html().replace(/Q_INDEX/g, idx); $('#mcq_options_'+idx+' .choices-list').append(t); }
    function setCorrectAnswer(r, idx) { $('#q_'+idx+' .correct-answer-input').val($(r).closest('.input-group').find('.choice-text').val()); }
    function syncCorrectAnswer(i, idx) { let r = $(i).closest('.input-group').find('.correct-radio'); if(r.is(':checked')) $('#q_'+idx+' .correct-answer-input').val($(i).val()); }
</script>
</body>
</html>