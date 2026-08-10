<?php
session_start();
include '../db_connect.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['role'] !== 'teacher') {
    header("Location: login.html");
    exit();
}

if (!isset($_GET['id'])) { header("Location: view_exams.php"); exit(); }

$exam_id = $_GET['id'];

try {
    // 1. بيانات الامتحان
    $stmt = $conn->prepare("SELECT * FROM exams WHERE id = :id");
    $stmt->execute([':id' => $exam_id]);
    $exam = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$exam) die("الامتحان غير موجود");

    // 2. الدروس
    $lessons = $conn->query("SELECT lessons.id, lessons.title, academic_years.name AS class_name 
                             FROM lessons 
                             JOIN units ON lessons.unit_id = units.id
                             JOIN academic_years ON units.academic_year_id = academic_years.id")->fetchAll(PDO::FETCH_ASSOC);

    // 3. الأسئلة
    $stmt_q = $conn->prepare("SELECT * FROM questions WHERE exam_id = :eid");
    $stmt_q->execute([':eid' => $exam_id]);
    $existing_questions = $stmt_q->fetchAll(PDO::FETCH_ASSOC);

    // الاختيارات
    foreach ($existing_questions as &$question) {
        if ($question['answer_type'] == 'mcq') {
            $stmt_c = $conn->prepare("SELECT choice_text FROM question_choices WHERE question_id = :qid");
            $stmt_c->execute([':qid' => $question['id']]);
            $question['choices'] = $stmt_c->fetchAll(PDO::FETCH_COLUMN);
        }
    }
    unset($question);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تعديل الامتحان | احياء غنيم</title>
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
        :root { 
            --main-red: #DB1F41; 
            --dark-grey: #3B525C; 
            --main-yellow: #DCD001; 
        }
        body { font-family: 'Cairo', sans-serif !important; }
        
        .skin-blue .main-header .navbar { background-color: var(--main-red) !important; }
        .skin-blue .main-header .logo { background-color: var(--dark-grey) !important; color: #fff !important; }
        .skin-blue .main-header .logo:hover { background-color: #2e4149 !important; }
        
        .box-purple { border-top: 4px solid var(--main-yellow); background: #fff; }
        .btn-add-q { background: var(--dark-grey); color: white; border-radius: 50px; padding: 10px 30px; border: none; font-weight: bold; }
        .btn-add-q:hover { color: var(--main-yellow); background: var(--main-red); }

        .question-card { background: #fdfdfd; border: 1px solid #e1e1e1; border-right: 5px solid var(--main-red); padding: 20px; margin-bottom: 25px; border-radius: 8px; position: relative; }
        .btn-delete-q { position: absolute; top: 10px; left: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; }
        
        .mcq-options { display: none; margin-top: 15px; padding: 15px; background: #f4f6f9; border: 1px dashed #ccc; border-radius: 5px; }
        #timer_section { display: none; background: #fff8e1; padding: 15px; border-radius: 5px; margin-bottom: 15px; border: 1px dashed var(--main-yellow); }
        
        .btn-success { background-color: var(--dark-grey) !important; border-color: var(--dark-grey); font-weight: bold; }
        .btn-success:hover { background-color: var(--main-red) !important; border-color: var(--main-red); }
        
        .current-img-preview { background: #eee; padding: 5px; display: inline-block; margin-bottom: 5px; border: 1px solid var(--main-yellow); }
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
            <h1>إدارة الامتحانات <small>تعديل الامتحان</small></h1>
        </section>

        <section class="content">
            <form action="update_exam.php" method="post" enctype="multipart/form-data" id="examForm">
                <input type="hidden" name="exam_id" value="<?php echo $exam['id']; ?>">
                
                <!-- البيانات الأساسية -->
                <div class="box box-purple">
                    <div class="box-header with-border"><h3 class="box-title">البيانات الأساسية</h3></div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>اسم الامتحان</label>
                                    <input type="text" class="form-control" name="name" value="<?php echo htmlspecialchars($exam['title']); ?>" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>تابع للدرس</label>
                                    <select class="form-control" name="lesson_id">
                                        <option value="">-- امتحان عام --</option>
                                        <?php foreach ($lessons as $lesson): ?>
                                            <option value="<?php echo $lesson['id']; ?>" <?php echo ($lesson['id'] == $exam['lesson_id']) ? 'selected' : ''; ?>>
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
                                    <input type="number" class="form-control" name="total_degree" value="<?php echo $exam['total_marks']; ?>" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>المدة (دقائق)</label>
                                    <input type="number" class="form-control" name="time_limit" value="<?php echo $exam['time_limit_minutes']; ?>" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>نوع الامتحان</label>
                            <select class="form-control" name="exam_type" id="exam_type" onchange="toggleTimer()">
                                <option value="open" <?php echo ($exam['exam_type'] == 'open') ? 'selected' : ''; ?>>وقت مفتوح</option>
                                <option value="closed" <?php echo ($exam['exam_type'] == 'closed') ? 'selected' : ''; ?>>وقت محدد</option>
                            </select>
                        </div>

                        <div id="timer_section" style="display: <?php echo ($exam['exam_type'] == 'closed') ? 'block' : 'none'; ?>;">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>بدء الامتحان</label>
                                        <input type="datetime-local" class="form-control" name="start_at" value="<?php echo $exam['start_time']; ?>">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>انتهاء الامتحان</label>
                                        <input type="datetime-local" class="form-control" name="end_at" value="<?php echo $exam['end_time']; ?>">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>الصورة</label><br>
                            <?php if(!empty($exam['image'])): ?>
                                <img src="../<?php echo $exam['image']; ?>" height="50" style="border: 1px solid var(--main-yellow);">
                                <input type="hidden" name="old_image" value="<?php echo $exam['image']; ?>">
                            <?php endif; ?>
                            <input type="file" class="form-control" name="image" style="margin-top:5px;">
                        </div>
                    </div>
                </div>

                <!-- الأسئلة -->
                <div class="box box-solid" style="background: transparent; box-shadow: none;">
                    <div class="box-header text-center">
                        <button type="button" class="btn btn-add-q" onclick="addQuestion()"><i class="fa fa-plus-circle"></i> إضافة سؤال</button>
                    </div>
                    
                    <div id="questions_container">
                        <?php 
                        $q_counter = 0;
                        foreach ($existing_questions as $q): 
                            $q_counter++;
                            $is_img = ($q['question_type'] == 'image');
                            $is_mcq = ($q['answer_type'] == 'mcq');
                        ?>
                        <div class="question-card" id="q_exist_<?php echo $q_counter; ?>">
                            <button type="button" class="btn-delete-q" onclick="removeQuestion('q_exist_<?php echo $q_counter; ?>')"><i class="fa fa-trash"></i></button>
                            <h4 style="color:var(--dark-grey); border-bottom:1px solid #eee; font-weight: bold;">سؤال <?php echo $q_counter; ?></h4>
                            <input type="hidden" name="questions[<?php echo $q_counter; ?>][old_image]" value="<?php echo $q['image_path']; ?>">

                            <div class="row">
                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label>السؤال</label>
                                        <input type="text" name="questions[<?php echo $q_counter; ?>][text]" class="form-control q-text <?php echo $is_img ? 'hidden' : ''; ?>" value="<?php echo htmlspecialchars($q['question_text']); ?>" <?php echo !$is_img ? 'required' : ''; ?>>
                                        <div class="q-file <?php echo !$is_img ? 'hidden' : ''; ?>">
                                            <?php if($is_img): ?><img src="../<?php echo $q['image_path']; ?>" height="60" style="border: 1px solid var(--main-yellow); margin-bottom: 5px;"><br><?php endif; ?>
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
                                            <option value="text" <?php echo !$is_img ? 'selected' : ''; ?>>نص</option>
                                            <option value="image" <?php echo $is_img ? 'selected' : ''; ?>>صورة</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>نوع الإجابة</label>
                                <select class="form-control" name="questions[<?php echo $q_counter; ?>][type]" onchange="toggleMCQ(this, '<?php echo $q_counter; ?>')">
                                    <option value="essay" <?php echo !$is_mcq ? 'selected' : ''; ?>>مقالي</option>
                                    <option value="mcq" <?php echo $is_mcq ? 'selected' : ''; ?>>اختياري</option>
                                </select>
                            </div>

                            <div class="mcq-options" id="mcq_options_<?php echo $q_counter; ?>" style="display: <?php echo $is_mcq ? 'block' : 'none'; ?>;">
                                <label style="color: var(--main-red);">الاختيارات:</label>
                                <div class="choices-list">
                                    <?php if($is_mcq && isset($q['choices'])): ?>
                                        <?php foreach($q['choices'] as $choice): ?>
                                            <div class="input-group" style="margin-bottom: 8px;">
                                                <span class="input-group-addon"><i class="fa fa-check-circle" style="color: var(--main-yellow);"></i></span>
                                                <input type="text" name="questions[<?php echo $q_counter; ?>][choices][]" class="form-control choice-input" value="<?php echo htmlspecialchars($choice); ?>" required>
                                                <span class="input-group-btn"><button type="button" class="btn btn-danger" onclick="$(this).closest('.input-group').remove()">x</button></span>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </div>
                                <button type="button" class="btn btn-default btn-sm" onclick="addChoice('<?php echo $q_counter; ?>')">+ إضافة اختيار</button>
                                <div class="form-group" style="margin-top:10px;">
                                    <label>الإجابة الصحيحة</label>
                                    <input type="text" name="questions[<?php echo $q_counter; ?>][correct_answer]" class="form-control" value="<?php echo htmlspecialchars($q['correct_answer']); ?>" placeholder="نص الإجابة الصحيحة">
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="box-footer text-center" style="margin-top: 20px;">
                        <button type="submit" class="btn btn-success btn-lg" style="width: 200px;">حفظ كل التعديلات</button>
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
        <h4 style="color:var(--main-red); border-bottom:1px solid #eee; font-weight: bold;">سؤال جديد <span class="q-num"></span></h4>
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label>السؤال</label>
                    <input type="text" name="questions[INDEX][text]" class="form-control q-text" required>
                    <input type="file" name="questions[INDEX][image]" class="form-control q-file hidden">
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group"><label>الدرجة</label><input type="number" name="questions[INDEX][degree]" class="form-control" value="1" required></div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label>عرض</label>
                    <select class="form-control" onchange="toggleFile(this)">
                        <option value="text">نص</option>
                        <option value="image">صورة</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>النوع</label>
            <select class="form-control" name="questions[INDEX][type]" onchange="toggleMCQ(this, 'INDEX')">
                <option value="essay">مقالي</option>
                <option value="mcq">اختياري</option>
            </select>
        </div>
        <div class="mcq-options" id="mcq_options_INDEX">
            <label style="color: var(--main-red);">الاختيارات:</label>
            <div class="choices-list"></div>
            <button type="button" class="btn btn-default btn-sm" onclick="addChoice('INDEX')">+ إضافة اختيار</button>
            <div class="form-group" style="margin-top:10px;">
                <label>الإجابة الصحيحة</label>
                <input type="text" name="questions[INDEX][correct_answer]" class="form-control" placeholder="نص الإجابة الصحيحة">
            </div>
        </div>
    </div>
</div>

<div id="choice_template" style="display:none;">
    <div class="input-group" style="margin-bottom: 8px;">
        <span class="input-group-addon"><i class="fa fa-circle-o" style="color: var(--main-yellow);"></i></span>
        <input type="text" name="questions[Q_INDEX][choices][]" class="form-control choice-input" required>
        <span class="input-group-btn"><button type="button" class="btn btn-danger" onclick="$(this).closest('.input-group').remove()">x</button></span>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.18/js/adminlte.min.js"></script>

<script>
    let questionCount = <?php echo $q_counter; ?>;

    function toggleTimer() {
        var type = document.getElementById('exam_type').value;
        document.getElementById('timer_section').style.display = (type === 'closed') ? 'block' : 'none';
    }

    function addQuestion() {
        questionCount++;
        let template = $('#question_template').html().replace(/INDEX/g, questionCount).replace(/CARD_ID/g, 'new_' + questionCount);
        let $newQ = $(template);
        $newQ.find('.q-num').text(questionCount);
        $('#questions_container').append($newQ);
        $newQ.hide().slideDown();
    }

    function removeQuestion(id) {
        if(confirm('حذف السؤال من الامتحان؟')) $('#' + id).slideUp(function() { $(this).remove(); });
    }

    function toggleFile(select) {
        let $card = $(select).closest('.question-card');
        let $text = $card.find('.q-text'), $file = $card.find('.q-file');
        if (select.value === 'image') {
            $text.addClass('hidden').removeAttr('required').val('');
            $file.removeClass('hidden');
        } else {
            $text.removeClass('hidden').attr('required', 'required');
            $file.addClass('hidden');
        }
    }

    function toggleMCQ(select, index) {
        let $opts = $('#mcq_options_' + index);
        let $inps = $opts.find('.choice-input');
        if (select.value === 'mcq') {
            $opts.slideDown();
            $inps.attr('required', 'required');
            if($opts.find('.choices-list').children().length === 0) { addChoice(index); addChoice(index); }
        } else {
            $opts.slideUp();
            $inps.removeAttr('required');
        }
    }

    function addChoice(qIndex) {
        let template = $('#choice_template').html().replace(/Q_INDEX/g, qIndex);
        $('#mcq_options_' + qIndex + ' .choices-list').append(template);
    }
</script>

</body>
</html>