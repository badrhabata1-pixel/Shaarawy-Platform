<?php

namespace App\Http\Controllers;

use Illuminate\Http\UploadedFile;

abstract class Controller
{
    /**
     * يحفظ الملف مباشرة داخل public/uploads بدون الاعتماد على symlink الـ storage
     * (بعض بيئات الاستضافة المشتركة ما بتحطش الـ symlink، فده بيشتغل دايماً).
     */
    protected function saveUploadedFile(UploadedFile $file, string $subdir): string
    {
        $dir = public_path($subdir);
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);

        return $subdir . '/' . $filename;
    }
}
