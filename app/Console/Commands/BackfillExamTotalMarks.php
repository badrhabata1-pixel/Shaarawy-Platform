<?php

namespace App\Console\Commands;

use App\Models\Exam;
use App\Models\ExamResult;
use Illuminate\Console\Command;

class BackfillExamTotalMarks extends Command
{
    /**
     * إصلاح لمرة واحدة: total_marks كانت بتتكتب يدويًا وممكن متطابقش مجموع درجات
     * الأسئلة الفعلي، فطالب بيجاوب صح في كل الأسئلة كان بيتحسب "راسب". وكمان لو
     * أستاذ غيّر درجة سؤال بعد ما طالب سلّم، الدرجة المحفوظة للطالب كانت فاضلة
     * جامدة على الدرجة القديمة. الأمر ده بيعيد تصحيح الامتحانات (اختياري بالكامل)
     * من جديد باستخدام درجات الأسئلة والإجابة الصحيحة الحالية.
     */
    protected $signature = 'exams:backfill-total-marks';

    protected $description = 'يصلّح total_marks ليطابق مجموع درجات الأسئلة، ويعيد تصحيح نتائج الامتحانات الاختيارية بالكامل (الدرجة والحالة) بناءً على درجات الأسئلة والإجابات الصحيحة الحالية';

    public function handle(): int
    {
        $fixedExams   = 0;
        $fixedResults = 0;

        Exam::with('questions')->chunkById(50, function ($exams) use (&$fixedExams, &$fixedResults) {
            foreach ($exams as $exam) {
                $realTotal = max(1, (int) $exam->questions->sum('marks'));

                if ((int) $exam->total_marks !== $realTotal) {
                    $exam->update(['total_marks' => $realTotal]);
                    $fixedExams++;
                }

                // نعيد التصحيح بالكامل (الدرجة + الحالة) بس للامتحانات الاختيارية
                // بالكامل (كل الأسئلة mcq) — عشان معندناش عمود لمجموع درجات الأسئلة
                // المقالية المصححة يدويًا، فمش هنلمس امتحان فيه تصحيح يدوي.
                $isPureMcq = $exam->questions->isNotEmpty()
                    && $exam->questions->every(fn ($q) => $q->question_type === 'mcq');

                $passMark = $realTotal * ($exam->exam_mode === 'gate' ? 0.5 : 0.7);

                $results = ExamResult::where('exam_id', $exam->id)
                    ->where('status', '!=', 'pending')
                    ->with('responses.question')
                    ->get();

                foreach ($results as $result) {
                    // Responses can be missing entirely if this exam was edited after the
                    // student submitted (questions get recreated, cascading their old
                    // responses away). There's nothing left to re-grade from — mark it
                    // "pending" for manual review instead of fabricating a 0 score.
                    if ($result->responses->isEmpty()) {
                        if ($result->status !== 'pending') {
                            $result->update(['status' => 'pending']);
                            $fixedResults++;
                        }
                        continue;
                    }

                    $newScore = $result->score;

                    if ($isPureMcq) {
                        $newScore = 0;
                        foreach ($result->responses as $response) {
                            $question = $response->question;
                            if (!$question) {
                                continue;
                            }

                            $isCorrect = $response->selected_answer !== null
                                && $response->selected_answer === $question->correct_answer;

                            if ($response->is_correct !== $isCorrect) {
                                $response->update(['is_correct' => $isCorrect]);
                            }

                            if ($isCorrect) {
                                $newScore += $question->marks;
                            }
                        }
                    }

                    $newStatus = $newScore >= $passMark ? 'passed' : 'failed';

                    if ((int) $result->score !== (int) $newScore || $result->status !== $newStatus) {
                        $result->update(['score' => $newScore, 'status' => $newStatus]);
                        $fixedResults++;
                    }
                }
            }
        });

        $this->info("تم تصحيح total_marks لـ {$fixedExams} امتحان، وإعادة تصحيح {$fixedResults} محاولة طالب بالكامل (الدرجة والحالة).");

        return self::SUCCESS;
    }
}
