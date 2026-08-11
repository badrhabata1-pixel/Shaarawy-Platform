<?php
// المسار: admin/get_students_ajax.php
include '../db_connect.php';

// حل مشكلة توافق المتغيرات
if (!isset($pdo) && isset($conn)) { $pdo = $conn; }

if (isset($_GET['year_id'])) {
    $year_id = $_GET['year_id'];
    
    try {
        $sql = "SELECT id, name, student_type FROM students WHERE academic_year_id = ? ORDER BY name ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$year_id]);
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($students as &$student) {
            // التحقق من وجود المفتاح قبل استخدامه لتجنب التحذيرات
            $type_val = isset($student['student_type']) ? $student['student_type'] : '';
            $type = ($type_val == 'online') ? '(Online)' : '(Center)';
            $student['name'] = $student['name'] . " " . $type;
        }
        
        echo json_encode($students);
    } catch (PDOException $e) {
        echo json_encode([]);
    }
}
?>