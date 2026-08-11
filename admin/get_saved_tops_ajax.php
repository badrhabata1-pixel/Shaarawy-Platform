<?php
// admin/get_saved_tops_ajax.php
include '../db_connect.php';

if (!isset($pdo) && isset($conn)) { $pdo = $conn; }

if (isset($_POST['year_id']) && isset($_POST['month'])) {
    $year_id = $_POST['year_id'];
    $month = $_POST['month']; // الصيغة: 2026-02

    try {
        $stmt = $pdo->prepare("SELECT rank, student_id FROM top_students WHERE academic_year_id = ? AND month = ?");
        $stmt->execute([$year_id, $month]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = [];
        foreach ($rows as $row) {
            $data[$row['rank']] = $row['student_id'];
        }
        echo json_encode($data);
    } catch (PDOException $e) {
        echo json_encode([]);
    }
}
?>