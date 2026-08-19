import{u as S,r as l,j as e,L as z}from"./app-CYOsPoKt.js";const a={navy:"#14213D",navyL:"#1e2e50",orange:"#208ef4",orangeD:"#0037af",gold:"#DCC9A3"},M={dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',check:'<polyline points="20 6 9 17 4 12"/>',exam:'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>',sheet:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/>',attendance:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',ticket:'<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',receipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>',money:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',menu:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',video:'<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'},x=({name:i,size:r=18})=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",style:{flexShrink:0},dangerouslySetInnerHTML:{__html:M[i]||""}}),C=[{section:"الرئيسية",items:[{label:"لوحة التحكم",icon:"dashboard",href:"/assistant/dashboard"}]},{section:"إدارة الطلاب",items:[{label:"طلبات التفعيل",icon:"users",href:"/assistant/student-requests"},{label:"قائمة الطلاب",icon:"users",href:"/assistant/students"}]},{section:"التصحيح والدرجات",items:[{label:"تصحيح الشيتات",icon:"sheet",href:"/assistant/pending-sheets"},{label:"تصحيح الامتحانات",icon:"exam",href:"/assistant/pending-exams"}]},{section:"أكواد التفعيل والتنبيهات",items:[{label:"أكواد الشحن والفيديوهات",icon:"ticket",href:"/assistant/promo-codes"},{label:"طلبات الدفع",icon:"money",href:"/assistant/payments"},{label:"إيصالات الدفع",icon:"receipt",href:"/assistant/payment-receipts"},{label:"إرسال الإشعارات للطلاب",icon:"bell",href:"/assistant/notifications"}]}];function I({item:i,collapsed:r,dark:o}){const g=typeof window<"u"?window.location.pathname:"",d=g===i.href||i.href!=="/assistant/dashboard"&&g.startsWith(i.href),[s,p]=l.useState(!1);return e.jsxs(z,{href:i.href,style:{display:"flex",alignItems:"center",gap:r?0:10,padding:r?"10px 0":"9px 14px",justifyContent:r?"center":"flex-start",borderRadius:12,fontSize:13.5,fontFamily:"Cairo, sans-serif",fontWeight:d?700:500,cursor:"pointer",textDecoration:"none",position:"relative",overflow:"hidden",transition:"all .2s ease",color:d?o?"#fff":a.orange:s?o?"#fff":a.navy:o?"rgba(220,201,163,.7)":"#475569",background:d?o?"linear-gradient(270deg,rgba(244,124,32,.22) 0%,rgba(244,124,32,.08) 60%,transparent 100%)":"rgba(244,124,32,.09)":s?o?"rgba(255,255,255,.05)":"rgba(244,124,32,.06)":"transparent"},onMouseEnter:()=>p(!0),onMouseLeave:()=>p(!1),children:[d&&e.jsx("span",{style:{position:"absolute",right:0,top:"15%",height:"70%",width:3,borderRadius:"2px 0 0 2px",background:a.orange,boxShadow:`0 0 10px ${a.orange}cc`}}),e.jsx("span",{style:{color:d||s?a.orange:o?"rgba(220,201,163,.5)":"#94a3b8",transition:"color .2s"},children:e.jsx(x,{name:i.icon,size:17})}),!r&&e.jsx("span",{style:{whiteSpace:"nowrap"},children:i.label})]})}function N({children:i,assistant:r,title:o}){const{post:g,processing:d}=S(),[s,p]=l.useState(!1),[c,h]=l.useState(!1),[t,b]=l.useState(()=>localStorage.getItem("student-theme")==="dark"),v=l.useRef(null);l.useEffect(()=>{t?(document.documentElement.classList.add("dark"),localStorage.setItem("student-theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("student-theme","light"))},[t]),l.useEffect(()=>{h(!1)},[]);const w=n=>{n.preventDefault(),g(route("assistant.logout"))},f=s?72:260;l.useEffect(()=>{c&&window.innerWidth<=768&&p(!1)},[c]);const m=t?"#0e1726":"#f0f3fa",j=t?"#101c2c":"#ffffff",u=t?"#f8f9fa":"#14213D",k=t?"rgba(255,255,255,0.05)":"#e8edf5";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Cairo', sans-serif; background: ${m}; color: ${u}; transition: all 0.3s ease; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,.15); }
                ::-webkit-scrollbar-thumb { background: rgba(244,124,32,.4); border-radius: 4px; }
                .sb-link { text-decoration: none !important; }
                .assistant-shell {
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                }
                .assistant-shell::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    opacity: ${t?".22":".16"};
                    background-image:
                        radial-gradient(circle at 18% 16%, rgba(47,188,212,.16), transparent 24%),
                        radial-gradient(circle at 82% 76%, rgba(13,148,136,.13), transparent 28%),
                        linear-gradient(135deg, transparent 0 48%, rgba(47,188,212,.07) 49%, transparent 51% 100%);
                }
                .assistant-ornaments {
                    position: fixed;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                    overflow: hidden;
                }
                .assistant-ornament {
                    position: absolute;
                    opacity: ${t?".24":".14"};
                    color: ${t?"#2DD4BF":"#0D9488"};
                    filter: drop-shadow(0 0 14px rgba(45,212,191,.22));
                }
                .assistant-ornament.diamond {
                    width: 18px;
                    height: 18px;
                    border: 2px solid currentColor;
                    transform: rotate(45deg);
                    border-radius: 3px;
                }
                .assistant-ornament.ring {
                    width: 92px;
                    height: 92px;
                    border: 1px solid currentColor;
                    border-radius: 50%;
                }
                .assistant-ornament.star {
                    width: 14px;
                    height: 14px;
                    background: currentColor;
                    clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
                }
                .sidebar-desktop::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    opacity: ${t?".11":".07"};
                    background-image:
                        repeating-linear-gradient(135deg, transparent 0 22px, rgba(45,212,191,.65) 23px, transparent 24px),
                        radial-gradient(circle at 28% 18%, rgba(220,201,163,.45), transparent 22%),
                        radial-gradient(circle at 70% 86%, rgba(47,188,212,.5), transparent 24%);
                    z-index: 0;
                }
                .sidebar-desktop > * {
                    position: relative;
                    z-index: 1;
                }
                @media (max-width: 768px) {
                    .sidebar-desktop {
                        display: flex !important;
                        transform: translateX(110%);
                        width: min(84vw, 320px) !important;
                        height: calc(100dvh - 62px) !important;
                        min-height: 0 !important;
                        top: 62px !important;
                        right: 0 !important;
                        z-index: 430 !important;
                        border-top-left-radius: 18px;
                        box-shadow: -18px 0 42px rgba(0,0,0,.42) !important;
                        transition: transform .28s ease, background .3s ease, box-shadow .3s ease !important;
                    }
                    .sidebar-desktop.mobile-open { transform: translateX(0) !important; }
                    .main-content { margin-right: 0 !important; }
                    .main-content > div { padding: 16px 10px 28px !important; max-width: 100% !important; }
                    .assistant-topbar { padding: 12px 14px !important; gap: 10px !important; flex-wrap: wrap !important; }
                    .assistant-topbar-actions { width: 100%; justify-content: space-between !important; gap: 8px !important; }
                    .sidebar-desktop nav { padding: 12px 10px !important; }
                    .sidebar-desktop .sb-link { min-height: 42px; }
                }
                @media (min-width: 769px) {
                    .sidebar-mobile-overlay { display: none !important; }
                    .mobile-header { display: none !important; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .page-anim { animation: fadeInUp .4s ease both; }
            `}),e.jsxs("div",{dir:"rtl",className:"assistant-shell",style:{display:"flex",minHeight:"100vh",position:"relative"},children:[e.jsxs("div",{className:"assistant-ornaments","aria-hidden":"true",children:[e.jsx("span",{className:"assistant-ornament ring",style:{top:"12%",left:"8%"}}),e.jsx("span",{className:"assistant-ornament diamond",style:{top:"28%",left:"34%"}}),e.jsx("span",{className:"assistant-ornament star",style:{top:"18%",right:"31%"}}),e.jsx("span",{className:"assistant-ornament diamond",style:{bottom:"18%",left:"20%"}}),e.jsx("span",{className:"assistant-ornament ring",style:{bottom:"-42px",right:"22%"}}),e.jsx("span",{className:"assistant-ornament star",style:{bottom:"32%",right:"9%"}})]}),e.jsxs("aside",{ref:v,className:`sidebar-desktop${c?" mobile-open":""}`,style:{width:f,minHeight:"100vh",position:"fixed",right:0,top:0,zIndex:100,background:t?"linear-gradient(175deg,#060B16 0%,#0D1829 40%,#101D35 70%,#0A1422 100%)":"#ffffff",boxShadow:t?"-4px 0 50px rgba(0,0,0,.35),inset 0 0 0 1px rgba(220,201,163,.08)":"-1px 0 0 #e2e8f0, -4px 0 24px rgba(20,33,61,.06)",display:"flex",flexDirection:"column",transition:"width .3s cubic-bezier(.4,0,.2,1), background .3s ease, box-shadow .3s ease",overflow:"hidden"},children:[e.jsxs("div",{style:{padding:s?"22px 0":"22px 20px",borderBottom:`1px solid ${t?"rgba(220,201,163,.1)":"#f1f5f9"}`,display:"flex",alignItems:"center",justifyContent:s?"center":"space-between",gap:12},children:[!s&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("div",{style:{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg, ${a.orange}, ${a.orangeD})`,boxShadow:"0 0 0 3px rgba(244,124,32,.2), 0 4px 12px rgba(244,124,32,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"},children:e.jsx("img",{src:"/images/منصور لوجو.png",alt:"Logo",style:{width:"220%",height:"100%",objectFit:"contain",objectPosition:"left center"}})}),e.jsx("div",{children:e.jsx("div",{style:{color:t?a.gold:a.navy,fontSize:13,fontWeight:700,lineHeight:1.2},children:"السكرتارية"})})]}),e.jsx("button",{onClick:()=>p(n=>!n),style:{background:t?"rgba(255,255,255,.06)":"rgba(20,33,61,.05)",border:`1px solid ${t?"rgba(220,201,163,.12)":"rgba(20,33,61,.1)"}`,borderRadius:8,color:t?"rgba(220,201,163,.6)":"#64748b",cursor:"pointer",padding:"6px 8px",display:"flex",transition:"all .2s",flexShrink:0},children:e.jsx(x,{name:s?"close":"menu",size:15})})]}),e.jsx("nav",{style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:s?"16px 8px":"16px 12px"},children:C.map(n=>e.jsxs("div",{style:{marginBottom:20},children:[!s&&e.jsx("div",{style:{fontSize:10,fontWeight:700,color:t?"rgba(220,201,163,.3)":"#94a3b8",letterSpacing:"0.08em",textTransform:"uppercase",padding:"0 14px",marginBottom:6,borderBottom:`1px solid ${t?"rgba(220,201,163,.07)":"#f1f5f9"}`,paddingBottom:6},children:n.section}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:2},children:n.items.map(y=>e.jsx(I,{item:y,collapsed:s,dark:t},y.href))})]},n.section))}),e.jsxs("div",{style:{padding:s?"16px 8px":"16px 14px",borderTop:`1px solid ${t?"rgba(255,255,255,.06)":"#f1f5f9"}`,background:t?"rgba(0,0,0,.2)":"#f8fafc"},children:[!s&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:t?"rgba(255,255,255,.04)":"rgba(20,33,61,.04)",border:`1px solid ${t?"rgba(220,201,163,.1)":"#e8edf5"}`,marginBottom:10},children:[e.jsx("div",{style:{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg, ${a.orange}, ${a.orangeD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0},children:r?.name?.[0]??"A"}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("div",{style:{color:t?a.gold:a.navy,fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:r?.name??"المساعد"}),e.jsx("div",{style:{color:t?"rgba(220,201,163,.4)":"#64748b",fontSize:10},children:r?.role==="admin"?"مدير النظام":"مساعد / سكرتير"})]})]}),e.jsx("form",{onSubmit:w,children:e.jsxs("button",{type:"submit",disabled:d,style:{width:"100%",display:"flex",alignItems:"center",justifyContent:s?"center":"flex-start",gap:8,padding:s?"10px 0":"9px 14px",borderRadius:10,background:"transparent",border:`1px solid ${t?"rgba(239,68,68,.2)":"rgba(239,68,68,.25)"}`,color:t?"rgba(239,68,68,.7)":"#dc2626",cursor:d?"not-allowed":"pointer",fontSize:13,fontFamily:"Cairo, sans-serif",fontWeight:600,transition:"all .2s"},onMouseEnter:n=>{n.currentTarget.style.background="rgba(239,68,68,.1)",n.currentTarget.style.color="#ef4444"},onMouseLeave:n=>{n.currentTarget.style.background="transparent",n.currentTarget.style.color=t?"rgba(239,68,68,.7)":"#dc2626"},children:[e.jsx(x,{name:"logout",size:15}),!s&&e.jsx("span",{children:"تسجيل الخروج"})]})})]})]}),e.jsxs("header",{className:"mobile-header",style:{position:"fixed",top:0,left:0,right:0,zIndex:420,background:t?"#101c2c":a.navy,boxShadow:"0 4px 20px rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",transition:"background 0.3s ease"},children:[e.jsx("span",{style:{color:a.gold,fontSize:16,fontWeight:700},children:"السكرتارية"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("button",{type:"button",onClick:()=>b(!t),style:{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:16},children:t?"☀️":"🌙"}),e.jsx("button",{onClick:()=>h(n=>!n),style:{background:"none",border:"none",color:a.gold,cursor:"pointer"},children:e.jsx(x,{name:c?"close":"menu",size:22})})]})]}),c&&e.jsx("div",{className:"sidebar-mobile-overlay",onClick:()=>h(!1),style:{position:"fixed",inset:0,zIndex:410,background:"rgba(0,0,0,.55)",backdropFilter:"blur(3px)"}}),e.jsxs("main",{className:"main-content page-anim",style:{flex:1,marginRight:f,minHeight:"100vh",transition:"margin-right .3s cubic-bezier(.4,0,.2,1)",background:m,position:"relative",zIndex:2},children:[e.jsxs("div",{style:{background:j,borderBottom:`1px solid ${k}`,padding:"16px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 12px rgba(20,33,61,.06)",transition:"all 0.3s ease"},className:"assistant-topbar",children:[e.jsx("h1",{style:{fontSize:18,fontWeight:800,color:u,margin:0},children:o||"لوحة السكرتارية"}),e.jsxs("div",{className:"assistant-topbar-actions",style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("button",{type:"button",onClick:()=>b(!t),style:{border:"none",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",color:t?"#F47C20":"#475569",transition:"0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",background:t?"rgba(255,255,255,0.1)":"#f1f5f9"},onMouseEnter:n=>n.currentTarget.style.background="rgba(255,255,255,0.15)",onMouseLeave:n=>{n.currentTarget.style.background=t?"rgba(255,255,255,0.1)":"#f1f5f9"},title:"تغيير مظهر المنصة",children:t?"☀️":"🌙"}),e.jsx("div",{style:{padding:"6px 14px",borderRadius:20,background:`linear-gradient(135deg, ${a.navy}, ${a.navyL})`,color:a.gold,fontSize:12,fontWeight:700},children:r?.name??"المساعد"})]})]}),e.jsx("div",{style:{padding:"28px",maxWidth:1200,margin:"0 auto"},children:i})]})]})]})}export{N as A};
