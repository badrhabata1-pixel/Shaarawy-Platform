<?php $current_page = basename($_SERVER['PHP_SELF']); ?>

<style>
/* ══════════════════════════════════════════════
   MANSOUR ADMIN SIDEBAR — Professional v2
   Light / Dark adaptive
══════════════════════════════════════════════ */

/* ── CSS Variables ── */
:root {
    --sb-bg:        #14213D;
    --sb-bg2:       #0d1829;
    --sb-border:    rgba(255,255,255,.07);
    --sb-text:      rgba(220,201,163,.85);
    --sb-text-muted:rgba(220,201,163,.45);
    --sb-hover-bg:  rgba(244,124,32,.12);
    --sb-hover-text:#fff;
    --sb-active-bg: linear-gradient(135deg,#F47C20,#d96a12);
    --sb-active-txt:#fff;
    --sb-sub-bg:    rgba(0,0,0,.25);
    --sb-sub-txt:   rgba(220,201,163,.75);
    --sb-sub-active:#F47C20;
    --sb-label:     rgba(220,201,163,.35);
    --sb-scrollbar: #F47C20;
    --sb-shadow:    0 4px 24px rgba(0,0,0,.4);
    --sb-logo-bg:   rgba(0,0,0,.3);
    --sb-search-bg: rgba(255,255,255,.07);
    --sb-search-txt:#fff;
    --sb-badge-bg:  #F47C20;
    --sb-badge-txt: #fff;
    --orange: #F47C20;
    --transition: .22s cubic-bezier(.4,0,.2,1);
}

/* Light mode overrides */
.sb-light {
    --sb-bg:        #f4f6fb;
    --sb-bg2:       #eaecf3;
    --sb-border:    rgba(20,33,61,.09);
    --sb-text:      #334155;
    --sb-text-muted:#94a3b8;
    --sb-hover-bg:  rgba(244,124,32,.1);
    --sb-hover-text:#14213D;
    --sb-active-bg: linear-gradient(135deg,#F47C20,#d96a12);
    --sb-active-txt:#fff;
    --sb-sub-bg:    rgba(20,33,61,.04);
    --sb-sub-txt:   #475569;
    --sb-sub-active:#F47C20;
    --sb-label:     #94a3b8;
    --sb-scrollbar: #F47C20;
    --sb-shadow:    0 4px 24px rgba(20,33,61,.12);
    --sb-logo-bg:   rgba(20,33,61,.06);
    --sb-search-bg: rgba(20,33,61,.07);
    --sb-search-txt:#14213D;
    --sb-badge-bg:  #F47C20;
    --sb-badge-txt: #fff;
}

/* ── Reset AdminLTE overrides ── */
aside.main-sidebar {
    position: fixed !important; top: 0 !important;
    left: 0 !important; bottom: 0 !important;
    width: 250px !important; height: 100vh !important;
    background: var(--sb-bg) !important;
    z-index: 1050 !important; overflow: hidden !important;
    box-shadow: var(--sb-shadow) !important;
    transition: background var(--transition), box-shadow var(--transition) !important;
    border-right: 1px solid var(--sb-border) !important;
}
.sidebar {
    position: absolute !important; top: 0 !important;
    bottom: 0 !important; width: 100% !important;
    overflow-y: auto !important; overflow-x: hidden !important;
    padding-bottom: 20px !important;
}
.sidebar::-webkit-scrollbar { width: 3px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb {
    background: var(--sb-scrollbar);
    border-radius: 99px;
}
/* Kill AdminLTE defaults */
.sidebar-menu, .sidebar-menu > li > a,
.treeview-menu, .treeview-menu > li > a { all: unset; }

/* ── Logo / Brand ── */
.sw-brand {
    display: flex; align-items: center; gap: 12px;
    padding: 18px 18px 14px;
    background: var(--sb-logo-bg);
    border-bottom: 1px solid var(--sb-border);
    transition: background var(--transition);
}
.sw-brand-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg,#F47C20,#d96a12);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 900; color: #fff;
    flex-shrink: 0; box-shadow: 0 4px 12px rgba(244,124,32,.4);
}
.sw-brand-text { flex: 1; min-width: 0; }
.sw-brand-name {
    font-size: 14px; font-weight: 900; color: var(--sb-hover-text);
    line-height: 1.2; transition: color var(--transition);
    font-family: 'Cairo', sans-serif;
}
.sw-brand-sub {
    font-size: 10px; color: var(--sb-text-muted);
    font-weight: 600; transition: color var(--transition);
}
/* Theme toggle button */
.sw-theme-toggle {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    background: var(--sb-search-bg); border: 1px solid var(--sb-border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--sb-text); font-size: 15px;
    transition: all var(--transition);
}
.sw-theme-toggle:hover {
    background: rgba(244,124,32,.2); color: var(--orange);
    border-color: rgba(244,124,32,.4);
}

/* ── Search ── */
.sw-search {
    padding: 12px 14px 4px;
}
.sw-search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--sb-search-bg);
    border: 1px solid var(--sb-border);
    border-radius: 10px; padding: 7px 12px;
    transition: all var(--transition);
}
.sw-search-wrap:focus-within {
    border-color: rgba(244,124,32,.5);
    background: rgba(244,124,32,.06);
}
.sw-search-wrap i { color: var(--sb-text-muted); font-size: 12px; flex-shrink: 0; }
.sw-search-wrap input {
    border: none !important; background: transparent !important;
    outline: none !important; color: var(--sb-search-txt) !important;
    font-size: 12px !important; width: 100% !important;
    font-family: 'Cairo', sans-serif !important;
    caret-color: var(--orange);
}
.sw-search-wrap input::placeholder { color: var(--sb-text-muted) !important; }

/* ── Section Labels ── */
.sw-label {
    font-size: 9.5px; font-weight: 800;
    color: var(--sb-label);
    letter-spacing: 1.2px; text-transform: uppercase;
    padding: 14px 18px 4px;
    font-family: 'Cairo', sans-serif;
    transition: color var(--transition);
}

/* ── Menu items ── */
.sw-nav { list-style: none; margin: 0; padding: 4px 10px; }
.sw-nav li { margin: 1px 0; }

/* Direct link */
.sw-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px;
    color: var(--sb-text) !important;
    text-decoration: none !important;
    font-size: 13px; font-weight: 600;
    font-family: 'Cairo', sans-serif;
    transition: all var(--transition);
    cursor: pointer; border: none; background: none;
    width: 100%; text-align: right;
}
.sw-link i {
    width: 20px; text-align: center;
    font-size: 14px; color: var(--sb-text-muted);
    transition: color var(--transition), transform var(--transition);
    flex-shrink: 0;
}
.sw-link .sw-arrow {
    margin-right: auto;
    font-size: 10px;
    color: var(--sb-text-muted);
    transition: transform var(--transition), color var(--transition);
    width: auto;
}
.sw-link:hover {
    background: var(--sb-hover-bg) !important;
    color: var(--sb-hover-text) !important;
}
.sw-link:hover i { color: var(--orange); transform: scale(1.1); }

/* Active direct */
li.sw-active > .sw-link {
    background: var(--sb-active-bg) !important;
    color: var(--sb-active-txt) !important;
    font-weight: 700;
    box-shadow: 0 3px 12px rgba(244,124,32,.35);
}
li.sw-active > .sw-link i { color: rgba(255,255,255,.9) !important; }

/* Treeview open */
li.sw-open > .sw-link { color: var(--orange) !important; }
li.sw-open > .sw-link i { color: var(--orange) !important; }
li.sw-open > .sw-link .sw-arrow { transform: rotate(-90deg); color: var(--orange) !important; }

/* Treeview parent active (has active child) */
li.sw-parent-active > .sw-link {
    background: rgba(244,124,32,.1) !important;
    color: var(--orange) !important;
}
li.sw-parent-active > .sw-link i { color: var(--orange) !important; }

/* ── Sub-menu ── */
.sw-sub {
    list-style: none; margin: 4px 0 4px 28px;
    padding: 4px 0;
    background: var(--sb-sub-bg);
    border-radius: 10px;
    border-right: 2px solid rgba(244,124,32,.25);
    overflow: hidden;
    /* collapse animation */
    max-height: 0;
    opacity: 0;
    transition: max-height .3s ease, opacity .25s ease;
    display: block !important;
}
.sw-sub.sw-open-sub {
    max-height: 400px;
    opacity: 1;
}
.sw-sub li { margin: 0; }
.sw-sub-link {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 14px 7px 10px;
    color: var(--sb-sub-txt) !important;
    text-decoration: none !important;
    font-size: 12px; font-weight: 600;
    font-family: 'Cairo', sans-serif;
    transition: all var(--transition);
    border-radius: 8px; margin: 1px 4px;
}
.sw-sub-link i { font-size: 10px; color: var(--sb-text-muted); flex-shrink: 0; }
.sw-sub-link:hover {
    background: rgba(244,124,32,.1) !important;
    color: var(--orange) !important;
}
.sw-sub-link:hover i { color: var(--orange) !important; }
.sw-sub li.sw-active .sw-sub-link {
    color: var(--sb-sub-active) !important;
    font-weight: 800;
    background: rgba(244,124,32,.12) !important;
}
.sw-sub li.sw-active .sw-sub-link i { color: var(--orange) !important; }

/* ── Divider ── */
.sw-divider {
    height: 1px; background: var(--sb-border);
    margin: 8px 14px;
    transition: background var(--transition);
}

/* ── Logout ── */
.sw-logout-link {
    color: #f87171 !important;
    font-weight: 700;
}
.sw-logout-link i { color: #f87171 !important; }
.sw-logout-link:hover {
    background: rgba(248,113,113,.12) !important;
    color: #ef4444 !important;
}
.sw-logout-link:hover i { color: #ef4444 !important; transform: translateX(-3px) !important; }
</style>

<aside class="main-sidebar" id="swSidebar">
<section class="sidebar" id="swSidebarInner">

    <!-- Brand -->
    <div class="sw-brand">
        <div class="sw-brand-icon">م</div>
        <div class="sw-brand-text">
            <div class="sw-brand-name">منصة منصور</div>
            <div class="sw-brand-sub">MANSOUR PLATFORM</div>
        </div>
        <button class="sw-theme-toggle" id="swThemeBtn" title="تبديل الوضع" onclick="swToggleTheme()">
            <i class="fa fa-sun-o" id="swThemeIcon"></i>
        </button>
    </div>

    <!-- Search -->
    <div class="sw-search">
        <div class="sw-search-wrap">
            <i class="fa fa-search"></i>
            <input type="text" placeholder="بحث سريع..." id="swSearchInput" oninput="swSearch(this.value)">
        </div>
    </div>

    <!-- Nav -->
    <ul class="sw-nav" id="swNavList">

        <!-- ══ الرئيسية ══ -->
        <li class="sw-label">الرئيسية</li>

        <li class="<?php echo ($current_page=='dashboard.php') ? 'sw-active' : ''; ?>">
            <a class="sw-link" href="dashboard.php">
                <i class="fa fa-th-large"></i> لوحة التحكم
            </a>
        </li>

        <!-- ══ المحتوى التعليمي ══ -->
        <li class="sw-label">المحتوى التعليمي</li>

        <?php $cls = in_array($current_page,['add_class.php','view_classes.php']); ?>
        <li class="<?php echo $cls ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-graduation-cap"></i> الصفوف الدراسية
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $cls ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_classes.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_classes.php"><i class="fa fa-list"></i> عرض الصفوف</a>
                </li>
                <li class="<?php echo ($current_page=='add_class.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_class.php"><i class="fa fa-plus"></i> إضافة صف</a>
                </li>
            </ul>
        </li>

        <?php $unt = in_array($current_page,['add_unit.php','view_units.php','edit_unit.php']); ?>
        <li class="<?php echo $unt ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-book"></i> الفصول / الوحدات
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $unt ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_units.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_units.php"><i class="fa fa-list"></i> عرض الفصول</a>
                </li>
                <li class="<?php echo ($current_page=='add_unit.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_unit.php"><i class="fa fa-plus"></i> إضافة فصل</a>
                </li>
            </ul>
        </li>

        <?php $les = in_array($current_page,['add_lesson.php','view_lessons.php','edit_lesson.php']); ?>
        <li class="<?php echo $les ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-play-circle"></i> الدروس
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $les ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_lessons.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_lessons.php"><i class="fa fa-list"></i> عرض الدروس</a>
                </li>
                <li class="<?php echo ($current_page=='add_lesson.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_lesson.php"><i class="fa fa-plus"></i> إضافة درس</a>
                </li>
            </ul>
        </li>

        <?php $sht = in_array($current_page,['add_sheet.php','view_sheets.php','edit_sheet.php']); ?>
        <li class="<?php echo $sht ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-file-text-o"></i> الشيتات
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $sht ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_sheets.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_sheets.php"><i class="fa fa-list"></i> عرض الشيتات</a>
                </li>
                <li class="<?php echo ($current_page=='add_sheet.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_sheet.php"><i class="fa fa-plus"></i> إضافة شيت</a>
                </li>
            </ul>
        </li>

        <?php $exm = in_array($current_page,['add_exam.php','view_exams.php','edit_exam.php']); ?>
        <li class="<?php echo $exm ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-pencil-square-o"></i> الامتحانات
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $exm ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_exams.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_exams.php"><i class="fa fa-list"></i> عرض الامتحانات</a>
                </li>
                <li class="<?php echo ($current_page=='add_exam.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_exam.php"><i class="fa fa-plus"></i> إضافة امتحان</a>
                </li>
            </ul>
        </li>

        <li class="<?php echo ($current_page=='view_comments.php') ? 'sw-active' : ''; ?>">
            <a class="sw-link" href="view_comments.php">
                <i class="fa fa-comments-o"></i> التعليقات
            </a>
        </li>

        <!-- ══ إدارة الطلاب ══ -->
        <div class="sw-divider"></div>
        <li class="sw-label">إدارة الطلاب</li>

        <?php $std = in_array($current_page,['add_student.php','view_students.php','student_requests.php','add_top_students.php']); ?>
        <li class="<?php echo $std ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-users"></i> الطلاب
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $std ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='student_requests.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="student_requests.php">
                        <i class="fa fa-bell" style="color:#F47C20"></i> طلبات التسجيل
                    </a>
                </li>
                <li class="<?php echo ($current_page=='view_students.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_students.php"><i class="fa fa-list"></i> جميع الطلاب</a>
                </li>
                <li class="<?php echo ($current_page=='add_student.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_student.php"><i class="fa fa-plus"></i> إضافة طالب</a>
                </li>
                <li class="<?php echo ($current_page=='add_top_students.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_top_students.php"><i class="fa fa-trophy"></i> الطلاب الأوائل</a>
                </li>
            </ul>
        </li>

        <?php $grp = in_array($current_page,['add_group.php','view_groups.php']); ?>
        <li class="<?php echo $grp ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-object-group"></i> المجموعات
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $grp ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_groups.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_groups.php"><i class="fa fa-list"></i> عرض المجموعات</a>
                </li>
                <li class="<?php echo ($current_page=='add_group.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_group.php"><i class="fa fa-plus"></i> إضافة مجموعة</a>
                </li>
            </ul>
        </li>

        <?php $ast = in_array($current_page,['add_assistant.php','view_assistants.php','edit_assistant.php']); ?>
        <li class="<?php echo $ast ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-user-secret"></i> المساعدون
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $ast ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_assistants.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_assistants.php"><i class="fa fa-list"></i> عرض المساعدين</a>
                </li>
                <li class="<?php echo ($current_page=='add_assistant.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_assistant.php"><i class="fa fa-plus"></i> إضافة مساعد</a>
                </li>
            </ul>
        </li>

        <!-- ══ المالية ══ -->
        <div class="sw-divider"></div>
        <li class="sw-label">المالية والحجوزات</li>

        <?php $sub = in_array($current_page,['add_subscription.php','view_subscriptions.php']); ?>
        <li class="<?php echo $sub ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-credit-card"></i> الاشتراكات
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $sub ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_subscriptions.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_subscriptions.php"><i class="fa fa-list"></i> عرض الاشتراكات</a>
                </li>
                <li class="<?php echo ($current_page=='add_subscription.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_subscription.php"><i class="fa fa-plus"></i> تفعيل اشتراك</a>
                </li>
            </ul>
        </li>

        <?php $res = in_array($current_page,['add_reservation.php','view_reservations.php']); ?>
        <li class="<?php echo $res ? 'sw-open sw-parent-active' : ''; ?>" data-tree>
            <a class="sw-link" href="#" onclick="swToggle(this);return false;">
                <i class="fa fa-calendar-check-o"></i> الحجوزات
                <i class="fa fa-angle-left sw-arrow"></i>
            </a>
            <ul class="sw-sub <?php echo $res ? 'sw-open-sub' : ''; ?>">
                <li class="<?php echo ($current_page=='view_reservations.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="view_reservations.php"><i class="fa fa-list"></i> عرض الحجوزات</a>
                </li>
                <li class="<?php echo ($current_page=='add_reservation.php') ? 'sw-active' : ''; ?>">
                    <a class="sw-sub-link" href="add_reservation.php"><i class="fa fa-plus"></i> إضافة حجز</a>
                </li>
            </ul>
        </li>

        <!-- ══ الدرجات ══ -->
        <div class="sw-divider"></div>
        <li class="sw-label">الدرجات والتقارير</li>

        <li class="<?php echo ($current_page=='view_sheet_degrees.php') ? 'sw-active' : ''; ?>">
            <a class="sw-link" href="view_sheet_degrees.php">
                <i class="fa fa-check-square-o"></i> درجات الشيتات
            </a>
        </li>

        <li class="<?php echo ($current_page=='view_exam_degrees.php') ? 'sw-active' : ''; ?>">
            <a class="sw-link" href="view_exam_degrees.php">
                <i class="fa fa-bar-chart"></i> درجات الامتحانات
            </a>
        </li>

        <!-- ══ تسجيل خروج ══ -->
        <div class="sw-divider"></div>

        <li>
            <a class="sw-link sw-logout-link" href="logout.php">
                <i class="fa fa-sign-out"></i> تسجيل الخروج
            </a>
        </li>

    </ul><!-- /sw-nav -->
</section>
</aside>

<script>
(function () {
    /* ── Theme ── */
    var SB  = document.getElementById('swSidebar');
    var BTN = document.getElementById('swThemeBtn');
    var ICO = document.getElementById('swThemeIcon');

    function applyTheme(t) {
        if (t === 'light') {
            SB.classList.add('sb-light');
            ICO.className = 'fa fa-moon-o';
            BTN.title = 'الوضع الليلي';
        } else {
            SB.classList.remove('sb-light');
            ICO.className = 'fa fa-sun-o';
            BTN.title = 'الوضع النهاري';
        }
    }

    // Initial: localStorage → system preference → dark
    var saved = localStorage.getItem('sw_theme');
    if (!saved) {
        saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(saved);

    window.swToggleTheme = function () {
        var cur = SB.classList.contains('sb-light') ? 'light' : 'dark';
        var next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('sw_theme', next);
    };

    /* ── Treeview toggle ── */
    window.swToggle = function (el) {
        var li  = el.closest('li');
        var sub = li.querySelector('.sw-sub');
        if (!sub) return;
        var open = li.classList.contains('sw-open');
        li.classList.toggle('sw-open', !open);
        sub.classList.toggle('sw-open-sub', !open);
    };

    /* ── Search filter ── */
    window.swSearch = function (q) {
        q = q.trim().toLowerCase();
        var items = document.querySelectorAll('#swNavList li:not(.sw-label)');
        items.forEach(function (li) {
            if (!q) { li.style.display = ''; return; }
            var txt = li.textContent.toLowerCase();
            li.style.display = txt.includes(q) ? '' : 'none';
        });
        // Show all labels
        document.querySelectorAll('.sw-label').forEach(function (l) {
            l.style.display = q ? 'none' : '';
        });
        document.querySelectorAll('.sw-divider').forEach(function (d) {
            d.style.display = q ? 'none' : '';
        });
        // Open subs that have visible children
        if (q) {
            document.querySelectorAll('.sw-sub').forEach(function (sub) {
                var hasVisible = Array.from(sub.querySelectorAll('li')).some(function (l) {
                    return l.style.display !== 'none';
                });
                sub.classList.toggle('sw-open-sub', hasVisible);
            });
        }
    };
})();
</script>
