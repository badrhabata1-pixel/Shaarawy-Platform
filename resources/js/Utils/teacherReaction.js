export function teacherReactionImage(percentage) {
    if (percentage >= 85) return '/images/excellent.png';
    if (percentage >= 50) return '/images/good.png';
    return '/images/bad.png';
}
