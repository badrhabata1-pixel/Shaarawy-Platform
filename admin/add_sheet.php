<?php
session_start();
include '../db_connect.php';

// حماية الصفحة
if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

// جلب الدروس
try {
    $sql = "SELECT lessons.id, lessons.title, academic_years.name AS class_name 
            FROM lessons 
            JOIN units ON lessons.unit_id = units.id
            JOIN academic_years ON units.academic_year_id = academic_years.id
            ORDER BY academic_years.id, lessons.id";
    $lessons = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إضافة شيت ذكي | احياء غنيم</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="shortcut icon" href="#">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/AdminLTE.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* تم تحديث الألوان بناءً على الهوية الجديدة (أحمر، زيتي، أصفر) */
        :root { 
            --main-red: #DB1F41; 
            --dark-zayti: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        /* الهيدر واللوجو */
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-zayti) !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        /* الصناديق والحدود */
        .box-purple { border-top: 4px solid var(--main-yellow); background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.08); }
        
        /* الأزرار */
        .btn-add-q { background: var(--dark-zayti); color: white; border-radius: 50px; padding: 10px 30px; font-weight: bold; border: none; transition: 0.3s; }
        .btn-add-q:hover { color: #fff; background: var(--main-red); transform: scale(1.02); }

        .btn-success { background-color: var(--main-red) !important; border-color: var(--main-red); font-weight: bold; }
        .btn-success:hover { background-color: #b01833 !important; }

        /* كارت السؤال */
        .question-card { background: #fdfdfd; border: 1px solid #e1e1e1; border-right: 5px solid var(--main-red); padding: 20px; margin-bottom: 25px; border-radius: 8px; position: relative; }
        .btn-delete-q { position: absolute; top: 10px; left: 10px; background: var(--main-red); color: white; border: none; padding: 5px 10px; border-radius: 4px; }
        
        .mcq-options { display: none; margin-top: 15px; padding: 15px; background: #f4f6f9; border: 1px dashed #ccc; border-radius: 5px; }
        .essay-answer { display: none; margin-top: 15px; }
        
        .hidden { display: none; }
        
        /* تنسيق زر الاختيار الصحيح */
        .correct-radio { transform: scale(1.5); margin-left: 10px !important; cursor: pointer; }
        
        /* تخصيص الـ label */
        label { color: var(--dark-zayti); }
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
            <h1>إدارة الواجبات <small>إضافة شيت جديد</small></h1>
        </section>

        <section class="content">
            <form action="save_sheet.php" method="post" enctype="multipart/form-data" id="sheetForm">
                
                <!-- القسم الأول: بيانات الشيت -->
                <div class="box box-purple">
                    <div class="box-header with-border"><h3 class="box-title" style="color: var(--dark-zayti); font-weight: bold;">البيانات الأساسية</h3></div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>اسم الشيت</label>
                                    <input type="text" class="form-control" name="name" required placeholder="مثال: واجب الدرس الأول">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>تابع للدرس</label>
                                    <select class="form-control select2" name="lesson_id" required>
                                        <option value="" disabled selected>-- اختر الدرس --</option>
                                        <?php foreach ($lessons as $lesson): ?>
                                            <option value="<?php echo $lesson['id']; ?>">
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
                                    <input type="number" class="form-control" name="total_degree" placeholder="50" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>وصف الشيت</label>
                                    <textarea class="form-control" name="description" rows="1"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>ملف PDF (اختياري)</label>
                            <input type="file" class="form-control" name="sheet_pdf">
                        </div>
                    </div>
                </div>

                <!-- القسم الثاني: الأسئلة -->
                <div class="box box-solid" style="background: transparent; box-shadow: none;">
                    <div class="box-header text-center">
                        <button type="button" class="btn btn-add-q" onclick="addQuestion()"><i class="fa fa-plus-circle"></i> إضافة سؤال جديد</button>
                    </div>
                    
                    <div id="questions_container"></div>

                    <div class="box-footer text-center" style="margin-top: 20px;">
                        <button type="submit" class="btn btn-success btn-lg" style="width: 200px;">
                            <i class="fa fa-save"></i> حفظ الشيت
                        </button>
                    </div>
                </div>

            </form>
        </section>
    </div>
    <footer class="main-footer text-center"><strong>powered by KABOx / Mindly</strong></footer>
</div>

<!-- ================= القوالب (Templates) ================= -->

<!-- 1. قالب السؤال -->
<div id="question_template" style="display:none;">
    <div class="question-card" id="q_CARD_ID">
        <button type="button" class="btn-delete-q" onclick="removeQuestion('q_CARD_ID')"><i class="fa fa-trash"></i></button>
        <h4 style="color: var(--dark-zayti); border-bottom: 1px solid #eee; padding-bottom: 10px; font-weight: bold;">
            <i class="fa fa-question-circle"></i> سؤال رقم <span class="q-num"></span>
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
                <div class="form-group"><label>الدرجة</label><input type="number" name="questions[INDEX][degree]" class="form-control" value="1" required></div>
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
            <select class="form-control" name="questions[INDEX][type]" onchange="toggleAnswerType(this, 'INDEX')">
                <option value="essay">مقالي (تصحيح يدوي)</option>
                <option value="mcq">اختيار من متعدد (تصحيح تلقائي)</option>
            </select>
        </div>

        <!-- أ) قسم الاختيارات (للتصحيح التلقائي) -->
        <div class="mcq-options" id="mcq_options_INDEX">
            <label style="color: #00a65a;">أدخل الاختيارات وحدد الإجابة الصحيحة:</label>
            <div class="choices-list"></div>
            <button type="button" class="btn btn-default btn-sm" onclick="addChoice('INDEX')" style="margin-top:10px;"><i class="fa fa-plus"></i> إضافة اختيار</button>
            <input type="hidden" name="questions[INDEX][correct_answer]" class="correct-answer-input">
        </div>

        <!-- ب) قسم المقالي (للتصحيح اليدوي) -->
        <div class="essay-answer" id="essay_options_INDEX" style="display:block;">
            <div class="form-group">
                <label style="color: #e67e22;">الإجابة النموذجية (تظهر للمساعدين فقط)</label>
                <textarea name="questions[INDEX][correct_answer]" class="form-control" rows="2" placeholder="اكتب عناصر الإجابة هنا..."></textarea>
            </div>
        </div>

    </div>
</div>

<!-- 2. قالب الاختيار (مع زر الراديو) -->
<div id="choice_template" style="display:none;">
    <div class="input-group" style="margin-bottom: 8px;">
        <span class="input-group-addon" style="background:#fff; border-left:0;">
            <input type="radio" name="radio_Q_INDEX" class="correct-radio" onchange="setCorrectAnswer(this, 'Q_INDEX')" title="اضغط هنا لتحديد هذا الاختيار كإجابة صحيحة">
        </span>
        <input type="text" name="questions[Q_INDEX][choices][]" class="form-control choice-text" placeholder="نص الاختيار..." required oninput="syncCorrectAnswer(this, 'Q_INDEX')">
        <span class="input-group-btn">
            <button type="button" class="btn btn-danger btn-flat" onclick="$(this).closest('.input-group').remove()"><i class="fa fa-times"></i></button>
        </span>
    </div>
</div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

<script>
    let questionCount = 0;

    function addQuestion() {
        questionCount++;
        let template = $('#question_template').html().replace(/INDEX/g, questionCount).replace(/CARD_ID/g, questionCount);
        let $newQ = $(template);
        $newQ.find('.q-num').text(questionCount);
        $('#questions_container').append($newQ);
        $newQ.hide().slideDown();
    }

    function removeQuestion(id) {
        if(confirm('حذف السؤال؟')) $('#' + id).slideUp(function() { $(this).remove(); });
    }

    function toggleFile(select) {
        let $card = $(select).closest('.question-card');
        let $text = $card.find('.q-text'), $file = $card.find('.q-file');
        if (select.value === 'image') {
            $text.addClass('hidden').removeAttr('required').val('');
            $file.removeClass('hidden').attr('required', 'required');
        } else {
            $text.removeClass('hidden').attr('required', 'required');
            $file.addClass('hidden').removeAttr('required').val('');
        }
    }

    function toggleAnswerType(select, index) {
        let $mcqDiv = $('#mcq_options_' + index);
        let $essayDiv = $('#essay_options_' + index);
        let $mcqInputs = $mcqDiv.find('.choice-text');
        
        let $essayInput = $essayDiv.find('textarea');

        if (select.value === 'mcq') {
            $essayDiv.slideUp();
            $essayInput.removeAttr('name'); 
            
            $mcqDiv.slideDown();
            $mcqInputs.attr('required', 'required');
            
            $('#q_' + index + ' .correct-answer-input').attr('name', 'questions['+index+'][correct_answer]');

            if($mcqDiv.find('.choices-list').children().length === 0) { addChoice(index); addChoice(index); }
        } else {
            $mcqDiv.slideUp();
            $mcqInputs.removeAttr('required');
            
            $('#q_' + index + ' .correct-answer-input').removeAttr('name');

            $essayDiv.slideDown();
            $essayInput.attr('name', 'questions['+index+'][correct_answer]');
        }
    }

    function addChoice(qIndex) {
        let template = $('#choice_template').html().replace(/Q_INDEX/g, qIndex);
        $('#mcq_options_' + qIndex + ' .choices-list').append(template);
    }

    function setCorrectAnswer(radio, qIndex) {
        let textVal = $(radio).closest('.input-group').find('.choice-text').val();
        $('#q_CARD_ID'.replace('CARD_ID', qIndex)).find('.correct-answer-input').val(textVal);
    }

    function syncCorrectAnswer(input, qIndex) {
        let $radio = $(input).closest('.input-group').find('.correct-radio');
        if ($radio.is(':checked')) {
            $('#q_CARD_ID'.replace('CARD_ID', qIndex)).find('.correct-answer-input').val($(input).val());
        }
    }
</script>

</body>
</html>

