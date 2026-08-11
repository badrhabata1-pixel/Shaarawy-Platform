import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ receipts = [] }) {
    const [selectedImg, setSelectedImg] = useState(null);

    return (
        <AdminLayout title="سجل إيصالات دفع الطلاب">
            <Head title="إيصالات الدفع - بوابة المعلم" />

            <div className="max-w-6xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-800 flex-wrap gap-4">
                    <div>
                        <h2 className="text-xl font-black text-[#1b3a60] dark:text-[#f8f9fa]">طلبات الدفع المقبولة</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            هنا يظهر أرشيف طلبات الدفع التي تم قبولها فقط. المراجعة والقبول والرفض تتم من صفحة طلبات الدفع.
                        </p>
                    </div>
                    <span className="bg-[#2fbcd4]/10 text-[#2fbcd4] px-4 py-1.5 rounded-full text-xs font-bold border border-[#2fbcd4]/30">
                        {receipts.length} طلب دفع مقبول
                    </span>
                </div>

                {receipts.length === 0 ? (
                    <div className="bg-white dark:bg-[#152238] rounded-2xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-md">
                        <span className="text-5xl block mb-4">🧾</span>
                        <h3 className="text-lg font-bold text-gray-500">لا توجد طلبات دفع مقبولة حتى الآن</h3>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {receipts.map((receipt) => (
                            <ReceiptCard key={receipt.id} receipt={receipt} onImageClick={setSelectedImg} />
                        ))}
                    </div>
                )}

                {selectedImg && (
                    <div
                        className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setSelectedImg(null)}
                    >
                        <button className="absolute top-6 right-6 text-white text-3xl font-black cursor-pointer">×</button>
                        <img
                            src={selectedImg}
                            alt="Receipt"
                            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl border-4 border-white/20 object-contain"
                            onClick={(event) => event.stopPropagation()}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function ReceiptCard({ receipt, onImageClick }) {
    return (
        <div className="bg-white dark:bg-[#152238] p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 space-y-4 flex flex-col transition-all duration-300 hover:shadow-lg">
            <div
                className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border relative group cursor-pointer"
                onClick={() => onImageClick(receipt.image_url)}
            >
                <img src={receipt.image_url} alt="Receipt" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    اضغط لتكبير صورة الإيصال
                </div>
            </div>

            <div className="bg-gray-50/60 dark:bg-gray-900/30 p-4 rounded-xl space-y-2 text-xs text-gray-900">
                <InfoRow label="اسم الطالب:" value={receipt.student_name} strong />
                <InfoRow label="البريد الإلكتروني:" value={receipt.student_email} ltr />
                <InfoRow label="رقم الهاتف:" value={receipt.student_phone} ltr accent />
                <InfoRow label="تاريخ الإرسال:" value={receipt.created_at} muted />
                {receipt.unit_title && <InfoRow label="الدرس:" value={receipt.unit_title} />}
                {receipt.amount && <InfoRow label="المبلغ:" value={`${receipt.amount} جنيه`} strong />}
                {receipt.payment_method && <InfoRow label="طريقة الدفع:" value={receipt.payment_method} />}
                {receipt.admin_note && (
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="block text-gray-400 font-bold mb-1">الملاحظة:</span>
                        <span className="block text-gray-600 dark:text-gray-300 leading-relaxed">{receipt.admin_note}</span>
                    </div>
                )}
            </div>

            <div className="pt-2 mt-auto">
                <div className="py-2.5 bg-green-600/10 text-green-700 dark:text-green-300 rounded-lg font-black text-xs text-center border border-green-600/20">
                    تم قبول طلب الدفع
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, strong = false, ltr = false, accent = false, muted = false }) {
    return (
        <div className="flex justify-between items-center gap-3">
            <span className="text-gray-400 font-bold shrink-0">{label}</span>
            <span
                className={[
                    strong ? 'font-black text-[#1b3a60] dark:text-[#f8f9fa]' : 'font-bold text-gray-500 dark:text-gray-300',
                    accent ? 'text-[#2fbcd4]' : '',
                    muted ? 'text-gray-400' : '',
                ].join(' ')}
                style={{ direction: ltr ? 'ltr' : 'rtl' }}
            >
                {value || '-'}
            </span>
        </div>
    );
}
