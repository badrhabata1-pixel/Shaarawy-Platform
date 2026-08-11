import React, { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // جلب بيانات التوثيق لمعرفة هل الطالب مسجل دخول أم لا
    const { auth } = usePage().props;
    const isStudent = auth?.user !== null;

    return (
        <div className="min-h-screen bg-[#F7F3EB] text-[#14213D] font-sans overflow-x-hidden relative select-none scroll-smooth">
            
            {/* جزيئات ذهبية تطفو في الخلفية العامة كـ Animation هادئ */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-20">
                <div className="absolute w-4 h-4 bg-[#F47C20]/20 rounded-full top-10 left-10 animate-ping duration-[3000ms]"></div>
                <div className="absolute w-3 h-3 bg-[#C9A14A]/30 rounded-full top-1/3 right-12 animate-bounce duration-[4000ms]"></div>
                <div className="absolute w-5 h-5 bg-[#F47C20]/10 rounded-full bottom-20 left-1/4 animate-pulse duration-[5000ms]"></div>
            </div>

            {/* 1. Navbar تفاعلي فخم وحجم نصوص كبير */}
            <nav className="bg-[#14213D]/95 backdrop-blur-md text-white py-5 px-6 md:px-12 sticky top-0 z-50 shadow-md border-b border-[#DCC9A3]/20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    {/* إبقاء اسم المنصة فقط وإلغاء اللوجو الدائري تماماً بناءً على طلبك */}
                    <div className="flex flex-col text-right">
                        <span className="text-2xl md:text-3xl font-black tracking-widest text-white hover:text-[#F47C20] cursor-pointer transition-colors block">منصة الصيفي</span>
                        <span className="text-[10px] text-[#DCC9A3] tracking-widest hidden lg:inline">HISTORIA MAGISTRA VITAE</span>
                    </div>

                    <div className="hidden lg:flex items-center space-x-10 rtl:space-x-reverse font-extrabold text-base text-gray-300">
                        <a href="#hero" className="hover:text-[#F47C20] transition-all">الرئيسية</a>
                        <a href="#features" className="hover:text-[#F47C20] transition-all">المقررات</a>
                        <a href="#testimonials" className="hover:text-[#F47C20] transition-all">عن المنصة</a>
                    </div>
                    
                    {/* أزرار الـ Navbar الذكية */}
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <span className="text-sm font-bold text-[#DCC9A3] bg-white/10 px-3 py-1.5 rounded cursor-pointer hover:bg-white/20 transition">عربي</span>
                        
                        {isStudent ? (
                            <Link href={route('student.dashboard')} className="bg-[#F47C20] text-white px-6 py-2.5 rounded-full font-black text-sm md:text-base shadow-md hover:bg-white hover:text-[#14213D] transition duration-300">
                                لوحة التحكم الخاصة بك 🏛️
                            </Link>
                        ) : (
                            <div className="flex space-x-2 rtl:space-x-reverse">
                                <Link href={route('student.login')} className="border border-white/30 text-white px-5 py-2 rounded-full font-bold hover:bg-white/10 transition text-sm">
                                    تسجيل الدخول
                                </Link>
                                <Link href={route('register')} className="bg-[#F47C20] text-white px-5 py-2 rounded-full font-bold hover:bg-white hover:text-[#14213D] transition duration-300 text-sm shadow-md">
                                    إنشاء حساب
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section (استكشف التاريخ بطريقة مختلفة) بنصوص وأزرار ضخمة */}
            <section id="hero" className="relative bg-[#14213D] text-white pt-28 pb-40 px-6 overflow-hidden border-b-8 border-[#F47C20]">
                <div className="absolute top-20 left-10 w-1 bg-white/5 h-64 hidden lg:block rounded animate-pulse"></div>
                <div className="absolute top-20 right-10 w-1 bg-white/5 h-64 hidden lg:block rounded animate-pulse"></div>

                <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10" data-aos="zoom-in">
                    <span className="text-xs sm:text-sm font-extrabold text-[#DCC9A3] tracking-widest block uppercase animate-pulse">HISTORIA - MAGISTRA VITAE • التاريخ معلم الحياة</span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-wide">
                        استكشف <span className="text-[#F47C20]">التاريخ</span> <br />
                        بطريقة مختلفة
                    </h1>
                    <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-semibold">
                        منصة تعليمية متكاملة مع مستر محمد الصيفي - رحلة تفاعلية رائعة عبر الزمن لتجعل التاريخ حياً وممتعاً في ذهنك.
                    </p>
                    <span className="text-xs text-gray-500 tracking-widest block font-bold">EXPLORE HISTORY IN A WHOLE NEW WAY</span>
                    
                    {/* أزرار Hero ضخمة وذكية جداً */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-6">
                        {isStudent ? (
                            <Link href={route('student.dashboard')} className="w-full sm:w-auto bg-[#F47C20] text-white px-12 py-5 rounded-md font-black text-lg shadow-xl hover:bg-white hover:text-[#14213D] transition duration-300 text-center">
                                دخول سريع للوحة التحكم 🚀
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')} className="w-full sm:w-auto bg-[#F47C20] text-white px-12 py-5 rounded-md font-black text-base md:text-lg shadow-xl hover:bg-white hover:text-[#14213D] transition duration-300 transform hover:-translate-y-1 hover:shadow-[#F47C20]/30 text-center">
                                    إنشاء حساب طالب جديد 🏺
                                </Link>
                                <Link href={route('student.login')} className="w-full sm:w-auto border border-white/30 text-white px-12 py-5 rounded-md font-black text-base md:text-lg hover:bg-white/10 transition duration-300 transform hover:-translate-y-1 text-center">
                                    تسجيل دخول الطلاب
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. الإحصائيات البرتقالية (شريط الأرقام) */}
            <section className="bg-[#F47C20] text-white py-10 md:py-14 px-6 -mt-16 relative z-20 max-w-6xl mx-auto rounded-xl shadow-2xl transition hover:scale-[1.01]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="space-y-1">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black">+5,200</h3>
                        <p className="text-xs sm:text-sm text-orange-100 font-extrabold">طالب مسجل</p>
                    </div>
                    <div className="space-y-1 border-r border-white/20">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black">18</h3>
                        <p className="text-xs sm:text-sm text-orange-100 font-extrabold">مقرر دراسي</p>
                    </div>
                    <div className="space-y-1 border-r border-white/20">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black">+320</h3>
                        <p className="text-xs sm:text-sm text-orange-100 font-extrabold">ساعة محتوى</p>
                    </div>
                    <div className="space-y-1 border-r border-white/20">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black">12</h3>
                        <p className="text-xs sm:text-sm text-orange-100 font-extrabold">سنة خبرة</p>
                    </div>
                </div>
            </section>

            {/* 4. قسم المميزات الستة مع الخلفية التاريخية بالكامل وتأثير الضباب */}
            <section 
                id="features" 
                className="py-24 px-6 max-w-7xl mx-auto my-16 rounded-3xl shadow-xl border border-[#DCC9A3]/30 relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/egypt-history.png')" }}
            >
                <div className="absolute inset-0 bg-[#F7F3EB]/85 backdrop-blur-[3px] -z-10"></div>

                <div className="relative z-10">
                    <div className="text-center space-y-4 mb-20">
                        <span className="bg-[#14213D] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">FEATURES • الميزات</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">لماذا <span className="text-[#F47C20]">منصة الصيفي؟</span></h2>
                        <p className="text-gray-800 text-sm sm:text-base font-extrabold">كل ما تحتاجه لرحلة تعليمية متميزة في مكان واحد</p>
                    </div>

                    {/* المربعات الستة الأصلية بخطوط واضحة وكبيرة */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* كارت 1 */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-sm border-t-4 border-[#14213D] text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5" data-aos="fade-up">
                            <div className="w-14 h-14 bg-[#14213D] text-white rounded-md flex items-center justify-center text-2xl mx-auto mb-6 hover:rotate-12 transition">📖</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">محتوى تفاعلي</h3>
                            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase">Interactive Content</span>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">دروس مصورة ومنهج مبسط يجعل التاريخ قصة ممتعة لا حفظاً مملاً.</p>
                        </div>

                        {/* كارت 2 */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-sm border-t-4 border-[#14213D] text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5" data-aos="fade-up" data-aos-delay="100">
                            <div className="w-14 h-14 bg-[#14213D] text-white rounded-md flex items-center justify-center text-2xl mx-auto mb-6 hover:rotate-12 transition">💻</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">أونلاين وأوفلاين</h3>
                            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase">Online & Offline</span>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">تابع دروسك في أي وقت ومن أي مكان - سواء بالإنترنت أو بدونه.</p>
                        </div>

                        {/* كارت 3 */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-sm border-t-4 border-[#14213D] text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5" data-aos="fade-up" data-aos-delay="200">
                            <div className="w-14 h-14 bg-[#14213D] text-white rounded-md flex items-center justify-center text-2xl mx-auto mb-6 hover:rotate-12 transition">📈</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">متابعة التقدم</h3>
                            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase">Track Progress</span>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">لوحة تحكم ذكية تتابع أداءك وتحدد نقاط قوتك وضعفك بالامتحانات.</p>
                        </div>

                        {/* كارت 4 */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-sm border-t-4 border-[#14213D] text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5" data-aos="fade-up">
                            <div className="w-14 h-14 bg-[#14213D] text-white rounded-md flex items-center justify-center text-2xl mx-auto mb-6 hover:rotate-12 transition">🏆</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">شهادات معتمدة</h3>
                            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase">Certificates</span>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">احصل على شهادة إتمام معتمدة تثبت مستواك وتضاف لملفك الأكاديمي.</p>
                        </div>

                        {/* كارت 5 */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-sm border-t-4 border-[#14213D] text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5" data-aos="fade-up" data-aos-delay="100">
                            <div className="w-14 h-14 bg-[#14213D] text-white rounded-md flex items-center justify-center text-2xl mx-auto mb-6 hover:rotate-12 transition">👥</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">مجتمع الطلاب</h3>
                            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase">Community</span>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">تواصل مع آلاف الطلاب وتبادل الأفكار في مجتمع تعليمي نشط.</p>
                        </div>

                        {/* كارت 6 */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-sm border-t-4 border-[#14213D] text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5" data-aos="fade-up" data-aos-delay="200">
                            <div className="w-14 h-14 bg-[#14213D] text-white rounded-md flex items-center justify-center text-2xl mx-auto mb-6 hover:rotate-12 transition">⏱️</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">مرونة كاملة</h3>
                            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase">Flexibility</span>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">تعلم بالسرعة التي تناسبك - لا قيود على الوقت أو عدد المشاهدات.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. آراء الطلاب (Testimonials) */}
            <section id="testimonials" className="bg-[#14213D] text-white py-24 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <span className="bg-[#F47C20] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">TESTIMONIALS • آراء الطلاب</span>
                        <h2 className="text-3xl sm:text-4xl font-black">ماذا قال <span className="text-[#F47C20]">طلابنا؟</span></h2>
                        <p className="text-gray-400 text-sm sm:text-base font-semibold">آلاف الطلاب وثقوا بمنصة الصيفي وغيرت نظرتهم للتاريخ</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* رأي 1 */}
                        <div className="bg-white/5 border border-white/10 p-10 rounded-lg space-y-6 hover:border-[#F47C20]/50 transition" data-aos="fade-right">
                            <span className="text-yellow-500 text-base md:text-lg">★★★★★</span>
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">"مستر الصيفي بيخلي التاريخ حكاية مش بس حفظ تواريخ، ده بيخليك تعيش الحدث وتفهم ليه حصل."</p>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                                <span className="w-12 h-12 bg-[#F47C20] rounded-full flex items-center justify-center text-sm font-bold shadow-md">أح</span>
                                <div>
                                    <h4 className="text-sm font-extrabold">أحمد محمد</h4>
                                    <span className="text-[10px] text-gray-500 font-bold">طالب ثانوي — القاهرة</span>
                                </div>
                            </div>
                        </div>

                        {/* رأي 2 */}
                        <div className="bg-white/5 border border-white/10 p-10 rounded-lg space-y-6 hover:border-[#F47C20]/50 transition" data-aos="fade-up">
                            <span className="text-yellow-500 text-base md:text-lg">★★★★★</span>
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">"من أفضل المنصات اللي جربتها — الشرح واضح والمحتوى منظم بشكل احترافي جداً."</p>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                                <span className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-sm font-bold shadow-md">سا</span>
                                <div>
                                    <h4 className="text-sm font-extrabold">سارة أحمد</h4>
                                    <span className="text-[10px] text-gray-500 font-bold">طالبة جامعة — الإسكندرية</span>
                                </div>
                            </div>
                        </div>

                        {/* رأي 3 */}
                        <div className="bg-white/5 border border-white/10 p-10 rounded-lg space-y-6 hover:border-[#F47C20]/50 transition" data-aos="fade-left">
                            <span className="text-yellow-500 text-base md:text-lg">★★★★★</span>
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">"ربنا يبارك في مستر الصيفي، بسببه عشقت التاريخ وجبت أعلى درجة في الفصل."</p>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                                <span className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-sm font-bold shadow-md">مع</span>
                                <div>
                                    <h4 className="text-sm font-extrabold">محمود علي</h4>
                                    <span className="text-[10px] text-gray-500 font-bold">طالب ثانوي — الجيزة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. سجل مجاناً الآن (الجزء السفلي البرتقالي مع أزرار ضخمة) */}
            <section className="bg-[#F47C20] text-white py-24 px-6 text-center space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-linen.png')" }}></div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black relative z-10" data-aos="zoom-in">ابدأ رحلتك مع التاريخ اليوم</h2>
                <p className="text-sm sm:text-base md:text-lg text-orange-100 max-w-xl mx-auto relative z-10 font-bold">سجل الآن وانضم لآلاف الطلاب في أكبر منصة تاريخ عربية.</p>
                <div className="pt-4 relative z-10" data-aos="zoom-in" data-aos-delay="100">
                    <Link href={route('register')} className="bg-white text-[#F47C20] px-12 py-5 rounded-md font-black text-sm md:text-base hover:bg-[#14213D] hover:text-white transition-all duration-300 shadow-2xl transform hover:-translate-y-1 inline-block">
                        سجل مجاناً الآن 🏛️
                    </Link>
                </div>
                <span className="text-xs text-orange-200 block tracking-widest pt-4 relative z-10 font-bold">HISTORIA MAGISTRA VITAE — التاريخ معلم الحياة</span>
            </section>

            {/* 7. الـ Footer الفخم */}
            <footer id="footer" className="bg-[#14213D] text-gray-400 py-12 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-xs sm:text-sm text-center md:text-right">
                    <span className="font-bold">&copy; 2026 منصة محمد الصيفي — جميع الحقوق محفوظة</span>
                    <div className="flex space-x-8 rtl:space-x-reverse font-bold">
                        <a href="#" className="hover:text-white transition">سياسة الخصوصية</a>
                        <a href="#" className="hover:text-white transition">الشروط والأحكام</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}

function GoogleFonts() {
    return (
        <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cairo:wght@400;600;700;800;900&display=swap"
            rel="stylesheet"
        />
    );
}