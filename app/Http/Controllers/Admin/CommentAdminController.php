<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentAdminController extends Controller
{
    public function index()
    {
        $comments = Comment::with([
                'student:id,name,image',
                'lesson:id,title,unit_id',
                'lesson.unit:id,title',
            ])
            ->orderByRaw('(replied_at IS NULL) DESC') // غير المردود عليها تظهر أولاً
            ->orderByDesc('id')
            ->get()
            ->map(fn (Comment $c) => [
                'id'              => $c->id,
                'body'            => $c->body,
                'image_url'       => $c->image_url,
                'voice_url'       => $c->voice_url,
                'reply_body'      => $c->reply_body,
                'reply_image_url' => $c->reply_image_url,
                'reply_voice_url' => $c->reply_voice_url,
                'is_replied'      => $c->is_replied,
                'created_at'      => $c->created_at->diffForHumans(),
                'replied_at'      => $c->replied_at?->diffForHumans(),
                'student'         => $c->student ? [
                    'id'    => $c->student->id,
                    'name'  => $c->student->name,
                    'image' => $c->student->image,
                ] : null,
                'lesson'          => $c->lesson ? [
                    'id'    => $c->lesson->id,
                    'title' => $c->lesson->title,
                    'unit'  => $c->lesson->unit?->title,
                ] : null,
            ]);

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
        ]);
    }

    /**
     * POST /admin/comments/{id}/reply
     * رد الأستاذ على سؤال الطالب — نص و/أو صورة و/أو تسجيل صوتي.
     */
    public function reply(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        $request->validate([
            'reply_body'  => ['nullable', 'string', 'max:2000'],
            'reply_image' => ['nullable', 'image', 'max:3072'],
            // مسجّل الصوت بيبعت webm/mp4 وسيرفرات كتير بتكتشفه video/webm أو video/mp4
            // (لأن الحاوية نفسها بتتشارك بين الصوت والفيديو)، فلازم نقبل الاتنين
            'reply_voice' => ['nullable', 'file', 'mimetypes:audio/webm,video/webm,audio/ogg,audio/mpeg,audio/mp4,video/mp4,audio/wav,audio/x-wav,audio/aac,audio/x-m4a', 'max:8192'],
        ]);

        if (!$request->filled('reply_body') && !$request->hasFile('reply_image') && !$request->hasFile('reply_voice')) {
            return back()->withErrors(['reply_body' => 'اكتب رد أو أرفق صورة أو سجّل رسالة صوتية أولاً.']);
        }

        $data = ['reply_body' => $request->input('reply_body') ?? '', 'replied_at' => now()];

        if ($request->hasFile('reply_image')) {
            $data['reply_image_path'] = $this->saveUploadedFile($request->file('reply_image'), 'uploads/support/replies/images');
        }

        if ($request->hasFile('reply_voice')) {
            $data['reply_voice_path'] = $this->saveUploadedFile($request->file('reply_voice'), 'uploads/support/replies/voice');
        }

        $comment->update($data);

        return back()->with('success', 'تم إرسال الرد بنجاح ✓');
    }

    public function destroy($id)
    {
        Comment::findOrFail($id)->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
