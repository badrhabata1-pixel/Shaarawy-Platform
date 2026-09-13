<?php

namespace App\Console\Commands;

use App\Models\Exam;
use App\Models\ExamResult;
use Illuminate\Console\Command;

class BackfillExamTotalMarks extends Command
{
    /**
     * إصلاح لمرة واحدة: total_marks كانت بتتكتب يدويًا وممكن متطابقش مجموع درجات
     * الأسئلة الفعلي، فطالب بيجاوب صح في كل الأسئلة كان بيتحسب "راسب" لأن حد
     * النجاح كان بيتحسب من total_marks الغلط مش من مجموع درجات الأسئلة الحقيقي.
     */
    protected $signature = 'exams:backfill-total-marks';

    protected $description = 'يصلّح total_marks لكل الامتحانات ليطابق مجموع درجات الأسئلة، ويعيد حساب نتيجة (ناجح/راسب) لأي نتيجة امتحان اتصححت غلط بسبب الفرق ده';

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

                $passMark = $realTotal * ($exam->exam_mode === 'gate' ? 0.5 : 0.7);

                ExamResult::where('exam_id', $exam->id)
                    ->where('status', '!=', 'pending')
                    ->get()
                    ->each(function (ExamResult $result) use ($passMark, &$fixedResults) {
                        $correctStatus = $result->score >= $passMark ? 'passed' : 'failed';
                        if ($result->status !== $correctStatus) {
                            $result->update(['status' => $correctStatus]);
                            $fixedResults++;
                        }
                    });
            }
        });

        $this->info("تم تصحيح total_marks لـ {$fixedExams} امتحان، وتصحيح نتيجة {$fixedResults} محاولة طالب كانت متأثرة بالخطأ.");

        return self::SUCCESS;
    }
}
