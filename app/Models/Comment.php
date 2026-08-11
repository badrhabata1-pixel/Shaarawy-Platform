<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'student_id',
        'lesson_id',
        'body',
        'image_path',
        'voice_path',
        'reply_body',
        'reply_image_path',
        'reply_voice_path',
        'replied_at',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * uploads/... بتتبني مباشرة عن طريق public_path (من غير symlink)،
     * وأي مسار قديم (storage/...) لسه بيتبني بالطريقة القديمة عشان الملفات القديمة تفضل شغالة.
     */
    private function buildUploadUrl(?string $path): ?string
    {
        if (!$path) return null;
        return str_starts_with($path, 'uploads/') ? asset($path) : asset('storage/' . $path);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->buildUploadUrl($this->image_path);
    }

    public function getVoiceUrlAttribute(): ?string
    {
        return $this->buildUploadUrl($this->voice_path);
    }

    public function getReplyImageUrlAttribute(): ?string
    {
        return $this->buildUploadUrl($this->reply_image_path);
    }

    public function getReplyVoiceUrlAttribute(): ?string
    {
        return $this->buildUploadUrl($this->reply_voice_path);
    }

    public function getIsRepliedAttribute(): bool
    {
        return $this->replied_at !== null;
    }
}
