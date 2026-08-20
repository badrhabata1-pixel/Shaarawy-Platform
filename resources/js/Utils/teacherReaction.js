export function teacherReactionImage(percentage) {
    if (percentage >= 85) return encodeURI('/images/ممتاز.png');
    if (percentage >= 50) return encodeURI('/images/جيد جدا.png');
    return encodeURI('/images/ضعيف.png');
}
