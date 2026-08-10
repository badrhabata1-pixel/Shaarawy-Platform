<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * POST /student/lessons/{lesson}/comments
     * الطالب بيبعت سؤال تحت فيديو المحاضرة — نص و/أو صورة و/أو تسجيل صوتي.
     */
    public function store(Request $request, Lesson $lesson)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        abort_unless(
            $lesson->unit && $lesson->unit->academic_year_id === $student->academic_year_id,
            403
        );

        $request->validate([
            'body'  => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'max:3072'],
            // مسجّل الصوت بيبعت webm/mp4 وسيرفرات كتير بتكتشفه video/webm أو video/mp4
            // (لأن الحاوية نفسها بتتشارك بين الصوت والفيديو)، فلازم نقبل الاتنين
            'voice' => ['nullable', 'file', 'mimetypes:audio/webm,video/webm,audio/ogg,audio/mpeg,audio/mp4,video/mp4,audio/wav,audio/x-wav,audio/aac,audio/x-m4a', 'max:8192'],
        ]);

        if (!$request->filled('body') && !$request->hasFile('image') && !$request->hasFile('voice')) {
            return response()->json([
                'message' => 'اكتب سؤالك أو أرفق صورة أو سجّل رسالة صوتية أولاً.',
            ], 422);
        }

        $imagePath = $request->hasFile('image')
            ? $this->saveUploadedFile($request->file('image'), 'uploads/support/questions/images')
            : null;

        $voicePath = $request->hasFile('voice')
            ? $this->saveUploadedFile($request->file('voice'), 'uploads/support/questions/voice')
            : null;

        $comment = Comment::create([
            'student_id' => $student->id,
            'lesson_id'  => $lesson->id,
            'body'       => $request->input('body') ?? '',
            'image_path' => $imagePath,
            'voice_path' => $voicePath,
        ]);

        return response()->json([
            'comment' => [
                'id'         => $comment->id,
                'body'       => $comment->body,
                'image_url'  => $comment->image_url,
                'voice_url'  => $comment->voice_url,
                'reply_body'      => null,
                'reply_image_url' => null,
                'reply_voice_url' => null,
                'replied_at' => null,
                'created_at' => $comment->created_at->diffForHumans(),
            ],
        ]);
    }
}
