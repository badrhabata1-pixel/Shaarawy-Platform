export function teacherReactionImage(percentage) {
    if (percentage >= 85) return encodeURI('/images/ممتاز.png');
    if (percentage >= 50) return encodeURI('/images/ماشي حاله.png');
    return encodeURI('/images/ضعييف.png');
}
