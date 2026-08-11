<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Student\AuthController         as StudentAuthController;
use App\Http\Controllers\Student\DashboardController    as StudentDashboardController;
use App\Http\Controllers\Student\LessonController       as StudentLessonController;
use App\Http\Controllers\Student\ExamController         as StudentExamController;
use App\Http\Controllers\Student\SheetController        as StudentSheetController;
use App\Http\Controllers\Admin\PromoCodeController;
use App\Http\Controllers\Admin\DashboardController      as AdminDashboardController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\LessonAdminController;
use App\Http\Controllers\Admin\StudentAdminController;
use App\Http\Controllers\Admin\GroupController;
use App\Http\Controllers\Admin\SubscriptionAdminController;
use App\Http\Controllers\Admin\SheetController          as AdminSheetController;
use App\Http\Controllers\Admin\ExamAdminController;
use App\Http\Controllers\Admin\AssistantController;
use App\Http\Controllers\Admin\ReservationAdminController;
use App\Http\Controllers\Admin\CommentAdminController;
use App\Http\Controllers\Admin\SheetGradeController;
use App\Http\Controllers\Admin\ExamGradeController;
use App\Http\Controllers\Admin\TopStudentAdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Student\VideoQuestionController;
use App\Http\Controllers\Student\CommentController      as StudentCommentController;
use App\Http\Controllers\Admin\VideoQuestionAdminController;
use App\Http\Controllers\Admin\PaymentController         as AdminPaymentController;
use App\Http\Controllers\Student\PaymentController       as StudentPaymentController;
use App\Http\Controllers\Student\PaymentReceiptController as StudentPaymentReceiptController;
use App\Http\Controllers\Assistant\PaymentController     as AssistantPaymentController;
use App\Http\Controllers\Assistant\PaymentReceiptController as PaymentReceiptReviewController;
use App\Http\Controllers\Assistant\PromoCodeController   as AssistantPromoCodeController;

/* ── Public (الصفحات العامة المفتوحة للجميع) ─────────────────────────── */
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'units' => \App\Models\Unit::with('academicYear:id,name')
            ->where('is_visible', true)
            ->orderByDesc('id')
            ->get(['id', 'title', 'description', 'price', 'image', 'academic_year_id', 'term']), // تم حذف is_free
        'topStudents' => \App\Models\TopStudent::with(['student:id,name', 'academicYear:id,name'])
            ->orderByDesc('month')
            ->orderBy('rank')
            ->get(['id', 'student_id', 'academic_year_id', 'rank', 'month', 'notes']),
    ]);
})->name('home');
Route::get('/home', fn() => Inertia::render('Home'))->name('home.legacy');

/* ── Student Registration (إنشاء حساب طالب جديد) ──────────────────────── */
Route::get('/register',  [StudentController::class, 'create'])->name('register');
Route::post('/register', [StudentController::class, 'store'])->name('register.store');

/* ── Student Auth (دخول وخروج الطلاب) ─────────────────────────────────── */
Route::get('/student/login',  [StudentAuthController::class, 'showLogin'])->name('student.login');
Route::post('/student/login', [StudentAuthController::class, 'login'])->name('student.login.post');
// تفعيل الخروج المباشر للطالب ليدعم الـ GET والـ POST معاً لحل أي تعليق في الواجهة
Route::match(['get', 'post'], '/student/logout', [StudentAuthController::class, 'logout'])->name('student.logout');

/* ── Student Protected (لوحة تحكم الطلاب والدروس والامتحانات) ───────────────── */
Route::middleware(['auth:student', 'no.cache'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard',            [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/lessons',              [StudentLessonController::class,    'index'])->name('lessons');
    Route::get('/lessons/unit/{unit}',  [StudentLessonController::class,    'unitLessons'])->name('lessons.unit');
    Route::get('/lessons/{id}',         [StudentLessonController::class,    'show'])->name('lessons.show');
    Route::post('/lessons/{id}/unlock',      [StudentLessonController::class, 'unlock'])->name('lessons.unlock');
    Route::post('/lessons/{id}/quiz-submit', [StudentLessonController::class, 'submitQuiz'])->name('lessons.quiz.submit');
    Route::get('/exams',                [StudentExamController::class,      'index'])->name('exams');
    Route::get('/exams/{id}',           [StudentExamController::class,      'show'])->name('exams.show');
    Route::post('/exams/{id}/submit',   [StudentExamController::class,      'submit'])->name('exams.submit');
    Route::get('/sheets',               [StudentSheetController::class,     'index'])->name('sheets');
    Route::get('/sheets/{id}',          [StudentSheetController::class,     'show'])->name('sheets.show');
    Route::post('/sheets/{id}/submit',  [StudentSheetController::class,     'submit'])->name('sheets.submit');

    /* In-video quiz (الاختبارات القصيرة داخل الفيديو) */
    Route::get('/lessons/{lesson}/video-questions',                          [VideoQuestionController::class, 'index'])->name('lessons.vq.index');
    Route::post('/lessons/{lesson}/video-questions/{question}/trigger',      [VideoQuestionController::class, 'trigger'])->name('lessons.vq.trigger');
    Route::post('/lessons/{lesson}/video-questions/{question}/answer',       [VideoQuestionController::class, 'answer'])->name('lessons.vq.answer');

    /* دعم المادة الفني (أسئلة الطالب تحت فيديو المحاضرة) */
    Route::post('/lessons/{lesson}/comments', [StudentCommentController::class, 'store'])->name('lessons.comments.store');

    /* Payment (طلبات الدفع للطلاب) */
    Route::get('/payment',         [StudentPaymentController::class, 'create'])->name('payment.create');
    Route::post('/payment',        [StudentPaymentController::class, 'store'])->name('payment.store');
    Route::get('/payment/history', [StudentPaymentController::class, 'history'])->name('payment.history');
    Route::post('/receipts',       [StudentPaymentReceiptController::class, 'store'])->name('receipts.store');

    Route::get('/profile',  [StudentController::class, 'profileEdit'])->name('profile');
    Route::post('/profile', [StudentController::class, 'profileUpdate'])->name('profile.update');
});

/* ── Assistant Auth (دخول وخروج المساعدين والسكرتارية) ───────────────────── */
Route::middleware('guest:assistant')->group(function () {
    Route::get('/assistant/login', [App\Http\Controllers\Assistant\AuthController::class, 'showLogin'])->name('assistant.login');
    Route::post('/assistant/login', [App\Http\Controllers\Assistant\AuthController::class, 'login'])->name('assistant.login.post');
});

Route::post('/assistant/logout', [App\Http\Controllers\Assistant\AuthController::class, 'logout'])
    ->middleware('auth:assistant')
    ->name('assistant.logout');

/* ── Assistant Protected Area (لوحة تحكم السكرتارية والعمليات التفاعلية) ── */
Route::middleware(['auth:assistant', 'no.cache'])->prefix('assistant')->name('assistant.')->group(function () {
    
    // لوحة التحكم الخاصة بالمساعد
    Route::get('/dashboard', [App\Http\Controllers\Assistant\DashboardController::class, 'index'])->name('dashboard');

    // تسجيل الحضور والغياب للمجموعات بالسنتر
    Route::get('/attendance', [App\Http\Controllers\Assistant\AttendanceController::class, 'index'])->name('attendance');
    Route::post('/attendance', [App\Http\Controllers\Assistant\AttendanceController::class, 'store'])->name('attendance.store');

    // مراجعة وقبول وتفعيل حسابات الطلاب الجدد
    Route::get('/student-requests', [App\Http\Controllers\Assistant\StudentController::class, 'requests'])->name('students.requests');
    Route::post('/student-requests/{id}/approve', [App\Http\Controllers\Assistant\StudentController::class, 'approve'])->name('students.approve');
    Route::post('/student-requests/{id}/reject',  [App\Http\Controllers\Assistant\StudentController::class, 'reject'])->name('students.reject');

    // قائمة جميع الطلاب وحذف حساب الطالب للسكرتارية
    Route::get('/students', [App\Http\Controllers\Assistant\StudentController::class, 'index'])->name('students.index');
    Route::delete('/students/{id}', [App\Http\Controllers\Assistant\StudentController::class, 'destroy'])->name('students.destroy');

    // تتبع نسب مشاهدات الطلاب للمحاضرات (الصفحة المستقلة الجديدة)

    // تصحيح ورصد درجات واجبات الشيتات المعلقة يدوياً
    Route::get('/pending-sheets', [App\Http\Controllers\Assistant\GradingController::class, 'pendingSheets'])->name('sheets.pending');
    Route::get('/grade-sheet/{id}', [App\Http\Controllers\Assistant\GradingController::class, 'gradeSheetForm'])->name('sheets.grade.form');
    Route::post('/grade-sheet/{id}', [App\Http\Controllers\Assistant\GradingController::class, 'saveSheetGrade'])->name('sheets.grade.save');

    // تصحيح ورصد درجات امتحانات الطلاب المعلقة يدوياً
    Route::get('/pending-exams', [App\Http\Controllers\Assistant\GradingController::class, 'pendingExams'])->name('exams.pending');
    Route::get('/grade-exam/{id}', [App\Http\Controllers\Assistant\GradingController::class, 'gradeExamForm'])->name('exams.grade.form');
    Route::post('/grade-exam/{id}', [App\Http\Controllers\Assistant\GradingController::class, 'saveExamGrade'])->name('exams.grade.save');

    // مسار أكواد تفعيل شحن المحاضرات للسكرتارية
    Route::post('/promo-codes/generate', [AssistantPromoCodeController::class, 'generate'])->name('promo.generate');
    Route::get('/promo-codes',           [AssistantPromoCodeController::class, 'index'])->name('promo.index');
    Route::delete('/promo-codes/{id}',   [AssistantPromoCodeController::class, 'destroy'])->name('promo.destroy');

    // إدارة وإرسال الإشعارات والتنبيهات للطلاب من السكرتارية
    Route::get('/notifications', [App\Http\Controllers\Assistant\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications', [App\Http\Controllers\Assistant\NotificationController::class, 'store'])->name('notifications.store');
    Route::delete('/notifications/{id}', [App\Http\Controllers\Assistant\NotificationController::class, 'destroy'])->name('notifications.destroy');

    // طلبات الدفع
    Route::get('/payments', [AssistantPaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments/{paymentRequest}/approve', [AssistantPaymentController::class, 'approve'])->name('payments.approve');
    Route::post('/payments/{paymentRequest}/reject', [AssistantPaymentController::class, 'reject'])->name('payments.reject');
    Route::get('/payment-receipts', [PaymentReceiptReviewController::class, 'index'])->name('receipts.index');
    Route::post('/payment-receipts/{id}/approve', [PaymentReceiptReviewController::class, 'approve'])->name('receipts.approve');
    Route::post('/payment-receipts/{id}/reject', [PaymentReceiptReviewController::class, 'reject'])->name('receipts.reject');
});

/* ── PHP Admin Bridge (رابط الدخول السريع للمدرس من السيرفر القديم) ── */
Route::get('/admin/bridge', function (\Illuminate\Http\Request $request) {
    $token = $request->query('token');
    $file  = storage_path('app/bridge_token.json');

    if (!$token || !file_exists($file)) {
        return redirect()->route('login');
    }

    $data = json_decode(file_get_contents($file), true);
    @unlink($file);

    if (!$data || $data['token'] !== $token || $data['expires'] < time()) {
        return redirect()->route('login')->withErrors(['email' => 'رابط منتهي الصلاحية، سجّل دخولك مجدداً']);
    }

    $user = \App\Models\User::first();
    if (!$user) {
        return redirect()->route('login');
    }

    Auth::login($user, remember: true);
    $request->session()->regenerate();

    return redirect()->route('admin.dashboard');
});

/* ── Admin Auth (تسجيل دخول وخروج المدرس والآدمن) ───────────────────────── */
Route::middleware('guest')->group(function () {
    Route::get('login',  [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});
Route::middleware('auth')->post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/* ══════════════════════════════════════════════════════
   ADMIN PROTECTED AREA (لوحة تحكم المعلم الفخمة لإدارة المنصة بالكامل)
══════════════════════════════════════════════════════ */
Route::middleware(['auth', 'no.cache'])->prefix('admin')->name('admin.')->group(function () {

    /* Dashboard الإحصائيات والإيرادات */
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    /* الموارد التعليمية - عمليات إضافة وتعديل وحذف كاملة */
    Route::resource('classes',       ClassController::class);
    Route::resource('units',         UnitController::class);
    Route::resource('lessons',       LessonAdminController::class);
    Route::resource('students',      StudentAdminController::class);
    Route::resource('groups',        GroupController::class);
    Route::resource('subscriptions', SubscriptionAdminController::class);
    Route::resource('sheets',        AdminSheetController::class);
    Route::resource('exams',         ExamAdminController::class);
    Route::resource('assistants',    AssistantController::class);
    Route::resource('reservations',  ReservationAdminController::class);

    /* تفعيل وقبول وحذف الطلاب يدوياً للآدمن */
    Route::post('/students/{id}/toggle-active',   [StudentAdminController::class, 'toggleActive'])->name('students.toggle');
    Route::get('/student-requests',               [StudentAdminController::class, 'requests'])->name('students.requests');
    Route::post('/student-requests/{id}/approve', [StudentAdminController::class, 'approve'])->name('students.approve');
    Route::post('/student-requests/{id}/reject',  [StudentAdminController::class, 'reject'])->name('students.reject');

    /* تصفح تقارير الدرجات والتعليقات واللوحات الصامتة */
    Route::get('/comments',          [CommentAdminController::class,   'index'])->name('comments.index');
    Route::post('/comments/{id}/reply', [CommentAdminController::class, 'reply'])->name('comments.reply');
    Route::delete('/comments/{id}',  [CommentAdminController::class,   'destroy'])->name('comments.destroy');
    Route::get('/sheet-grades',      [SheetGradeController::class,     'index'])->name('sheet-grades.index');
    Route::get('/exam-grades',       [ExamGradeController::class,      'index'])->name('exam-grades.index');
    Route::get('/top-students',      [TopStudentAdminController::class, 'index'])->name('top-students.index');
    Route::post('/top-students',     [TopStudentAdminController::class, 'store'])->name('top-students.store');
    Route::delete('/top-students/{id}', [TopStudentAdminController::class, 'destroy'])->name('top-students.destroy');

    /* الأسئلة والامتحانات التفاعلية داخل مشغل الفيديو */
    Route::get('/video-questions',                                      [VideoQuestionAdminController::class, 'index'])->name('video-questions.index');
    Route::get('/lessons/{lesson}/focus-report',                        [VideoQuestionAdminController::class, 'focusReport'])->name('lessons.focus-report');
    Route::get('/lessons/{lesson}/video-questions',                     [VideoQuestionAdminController::class, 'questions'])->name('lessons.vq.manage');
    Route::post('/lessons/{lesson}/video-questions',                    [VideoQuestionAdminController::class, 'store'])->name('lessons.vq.store');
    Route::put('/video-questions/{question}',                           [VideoQuestionAdminController::class, 'update'])->name('vq.update');
    Route::delete('/video-questions/{question}',                        [VideoQuestionAdminController::class, 'destroy'])->name('vq.destroy');

    /* أكواد تفعيل شحن المحاضرات للآدمن */
    Route::post('/promo-codes/generate', [PromoCodeController::class, 'generate'])->name('promo.generate');
    Route::get('/promo-codes',           [PromoCodeController::class, 'webIndex'])->name('promo.index');
    Route::delete('/promo-codes/{id}',   [PromoCodeController::class, 'destroy'])->name('promo.destroy');

    /* مراجعة وقبول اشتراكات الدفع الإلكتروني */
    Route::post('/subscriptions/{id}/approve', [SubscriptionAdminController::class, 'approve'])->name('subscriptions.approve');
    Route::post('/subscriptions/{id}/reject',  [SubscriptionAdminController::class, 'reject'])->name('subscriptions.reject');

    /* Payment requests — طلبات الدفع الجديدة */
    Route::get('/payments',                              [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments/{paymentRequest}/approve',    [AdminPaymentController::class, 'approve'])->name('payments.approve');
    Route::post('/payments/{paymentRequest}/reject',     [AdminPaymentController::class, 'reject'])->name('payments.reject');
    Route::get('/payment-settings',                      [AdminPaymentController::class, 'settings'])->name('payment-settings');
    Route::post('/payment-settings',                     [AdminPaymentController::class, 'updateSettings'])->name('payment-settings.update');
    Route::get('/payment-receipts',                      [PaymentReceiptReviewController::class, 'index'])->name('receipts.index');
    Route::post('/payment-receipts/{id}/approve',        [PaymentReceiptReviewController::class, 'approve'])->name('receipts.approve');
    Route::post('/payment-receipts/{id}/reject',         [PaymentReceiptReviewController::class, 'reject'])->name('receipts.reject');
});
