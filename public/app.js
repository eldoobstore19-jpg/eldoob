<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ELDOOB.DZ — متجر الدب</title>
<style>
:root{--bg:#f6f4ee;--card:#fff;--tx:#1a1a1a;--mu:#7a7468;--line:#e6e1d4;--gold:#C9A24B;--gold-hi:#F3DC9A;--ok:#1f9d55;--bad:#d64545}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#121212;--card:#1c1c1c;--tx:#f1ede2;--mu:#a39d8e;--line:#2c2a24}}
:root[data-theme=dark]{--bg:#121212;--card:#1c1c1c;--tx:#f1ede2;--mu:#a39d8e;--line:#2c2a24}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.6 system-ui,'Segoe UI',Tahoma,sans-serif;padding-bottom:76px}
#top{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);padding:8px 12px;display:flex;align-items:center;gap:10px}
#brand{display:flex;align-items:center;gap:8px;flex:1}#brand small{color:var(--mu)}
.bell{position:relative;margin-inline-start:auto;background:none;border:0;font-size:20px;cursor:pointer}
.badge{position:absolute;top:-4px;inset-inline-end:-6px;background:var(--bad);color:#fff;border-radius:9px;font-size:10px;padding:0 5px}
#tt{display:flex;align-items:center;gap:8px;cursor:pointer}
.av{width:36px;height:36px;border-radius:50%;background:var(--line);display:flex;align-items:center;justify-content:center;overflow:hidden}
.av img{width:100%;height:100%;object-fit:cover}
#cm{background:var(--gold);color:#121212;border-radius:10px;padding:4px 10px;cursor:pointer;font-size:12px;text-align:center}#cm b{display:block;font-size:14px}
#body{max-width:760px;margin:0 auto;padding:12px}
#nav{position:fixed;bottom:0;inset-inline:0;background:var(--card);border-top:1px solid var(--line);display:flex;z-index:5}
#nav button{flex:1;background:none;border:0;padding:8px 0;color:var(--mu);font:inherit;font-size:12px;cursor:pointer}
#nav button span{display:block;font-size:20px}#nav button.on{color:var(--gold);font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.p{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:0;overflow:hidden;cursor:pointer;text-align:start;color:inherit;font:inherit}
.im{position:relative;aspect-ratio:1;background:var(--line);display:flex;align-items:center;justify-content:center;font-size:44px}
.im img{width:100%;height:100%;object-fit:cover}
.out{position:absolute;inset:0;background:#000a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px}
.p .b{padding:8px 10px}.p .t{font-weight:700}.pr{color:var(--gold);font-weight:800}
.mute{color:var(--mu);font-size:13px}
.tag{display:inline-block;border-radius:6px;padding:0 7px;font-size:12px;background:var(--line)}
.t-Pending,.t-Requested{background:#f4e3b0;color:#6b5412}.t-Shipped{background:#cfe3f7;color:#164a7a}
.t-Delivered,.t-Completed{background:#cdeedb;color:#14663a}.t-Cancelled,.t-Retour,.t-Rejected{background:#f6d0d0;color:#8a2323}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px}
.card h3{margin:0 0 8px}
label{display:block;margin-bottom:10px;font-size:13px;color:var(--mu)}
input,select,textarea{display:block;width:100%;margin-top:4px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit}
.btn{display:block;width:100%;background:linear-gradient(135deg,#F3DC9A,#C9A24B 55%,#8F7330);color:#121212;border:0;border-radius:10px;padding:11px;font:inherit;font-weight:700;cursor:pointer}
.btn.sm{display:inline-block;width:auto;padding:5px 12px;font-size:13px}
.btn.gh{background:none;border:1px solid var(--line);color:var(--tx)}.btn.dk{background:#121212;color:var(--gold-hi)}
.link{background:none;border:0;color:var(--gold);cursor:pointer;font:inherit}
.empty{text-align:center;color:var(--mu);padding:30px 10px}
.o{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--line)}
.stat{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
.stat div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center}
.stat b{display:block;color:var(--gold)}.stat span{font-size:12px;color:var(--mu)}
.cover{height:90px;background:linear-gradient(135deg,#121212,#8F7330)}
.pav{width:84px;height:84px;margin:-42px auto 0;border:3px solid var(--card);font-size:36px}
.vok{color:var(--ok);font-size:12px}
.toast{position:fixed;bottom:88px;inset-inline:16px;max-width:420px;margin:auto;background:#222;color:#fff;padding:10px 14px;border-radius:10px;text-align:center;z-index:30}
.toast.bad{background:var(--bad)}.toast.ok{background:var(--ok)}
#sheet{position:fixed;inset:0;background:#0009;z-index:20;display:flex;align-items:flex-end;justify-content:center}
#sheet .in{background:var(--card);width:100%;max-width:560px;max-height:90vh;overflow:auto;border-radius:16px 16px 0 0;padding:16px}
[hidden]{display:none!important}
</style>
</head>
<body>
<div id="top" hidden><div id="brand" hidden></div><div id="cm" hidden>رصيدي<b id="cv"></b></div><div id="tt" hidden><div class="av" id="av"></div><span id="nm" class="mute"></span></div></div>
<div id="body"></div>
<nav id="nav" hidden></nav>
<div id="sheet" hidden><div class="in" id="sin"></div></div>
<div id="toast" class="toast" hidden></div>
<script>
const fmt=n=>new Intl.NumberFormat('ar-DZ').format(Math.round(n))+' د.ج';
try{const t=localStorage.getItem('eldoob-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
const dark=()=>document.documentElement.dataset.theme?document.documentElement.dataset.theme=='dark':matchMedia('(prefers-color-scheme: dark)').matches;
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem('eldoob-theme',t)}catch(e){}};
const unread=()=>S.N.filter(n=>n.uid==S.user.id&&!n.read).length;
const reqN=()=>S.W.filter(p=>p.st=='Requested').length;
const notify=(uid,msg,kind)=>S.N.unshift({uid,msg,kind,read:false,t:new Date().toLocaleTimeString('ar-DZ',{hour:'2-digit',minute:'2-digit'})});
const NAMES='أدرار,الشلف,الأغواط,أم البواقي,باتنة,بجاية,بسكرة,بشار,البليدة,البويرة,تمنراست,تبسة,تلمسان,تيارت,تيزي وزو,الجزائر,الجلفة,جيجل,سطيف,سعيدة,سكيكدة,سيدي بلعباس,عنابة,قالمة,قسنطينة,المدية,مستغانم,المسيلة,معسكر,ورقلة,وهران,البيض,إليزي,برج بوعريريج,بومرداس,الطارف,تندوف,تيسمسيلت,الوادي,خنشلة,سوق أهراس,تيبازة,ميلة,عين الدفلى,النعامة,عين تموشنت,غرداية,غليزان,تيميمون,برج باجي مختار,أولاد جلال,بني عباس,عين صالح,عين قزام,تقرت,جانت,المغير,المنيعة,أفلو,بريكة,قصر الشلالة,مسعد,عين وسارة,بوسعادة,الأبيض سيدي الشيخ,القنطرة,بئر العاتر,قصر البخاري,العريشة'.split(',');
// أسعار مبدئية معتمدة (مكتب،منزل) حسب المنطقة. يعدّلها المدير لاحقاً.
const TR={'350,500':[16],'400,600':[9, 35, 42],'400,750':[10, 15, 26, 44],'500,700':[2, 6, 13, 18, 21, 22, 23, 25, 27, 29, 31, 34, 36, 41, 43, 46, 48],'550,750':[19],'600,850':[4, 5, 12, 14, 17, 20, 24, 28, 38, 40],'700,1000':[3, 7, 30, 32, 39, 45, 47, 51, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69],'1000,1400':[1, 8, 52],'1100,1500':[49],'1100,1600':[53],'1200,1700':[33, 37],'1200,1800':[11, 50, 54, 56]};
const WIL=[];for(const[k,l]of Object.entries(TR)){const[d,m]=k.split(',').map(Number);l.forEach(c=>WIL[c-1]={c,n:NAMES[c-1],desk:d,home:m})}
const ST={Pending:'قيد المراجعة',Shipped:'قيد الشحن',Delivered:'تم التسليم',Retour:'مرتجع',Cancelled:'ملغى'};
// بيانات تجريبية. في النسخة الحقيقية تُفرض الصلاحيات في الخادم وقاعدة البيانات وليس في الواجهة.
const U={};
const logo=z=>`<svg width="${z}" height="${z}" viewBox="0 0 100 100" role="img" aria-label="شعار ELDOOB"><defs><linearGradient id="gg${z}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3DC9A"/><stop offset=".5" stop-color="#C9A24B"/><stop offset="1" stop-color="#8F7330"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="#121212" stroke="url(#gg${z})" stroke-width="4"/><circle cx="50" cy="50" r="40" fill="none" stroke="url(#gg${z})" stroke-width="1" opacity=".6"/><circle cx="31" cy="33" r="9" fill="url(#gg${z})"/><circle cx="69" cy="33" r="9" fill="url(#gg${z})"/><circle cx="50" cy="52" r="23" fill="url(#gg${z})"/><ellipse cx="50" cy="60" rx="10" ry="8" fill="#121212"/><circle cx="41" cy="48" r="3" fill="#121212"/><circle cx="59" cy="48" r="3" fill="#121212"/><ellipse cx="50" cy="57" rx="4" ry="3" fill="#C9A24B"/></svg>`;
const S={scr:'land',reg:false,N:[],push:{},later:{},dl:null,PD:[],del:null,user:null,tab:'home',q:'',wallet:{},P:[],O:[],W:[]};
let TOKEN=null;try{TOKEN=sessionStorage.getItem('eldoob-token')}catch(e){}
async function api(m,url,body){
 const fd=body instanceof FormData,hd={};if(body&&!fd)hd['Content-Type']='application/json';if(TOKEN)hd.Authorization='Bearer '+TOKEN;
 let r;try{r=await fetch('/api'+url,{method:m,headers:hd,body:body?(fd?body:JSON.stringify(body)):undefined})}catch(e){throw new Error('تعذّر الاتصال بالخادم')}
 let d=null;try{d=await r.json()}catch(e){}
 if(!r.ok){if(r.status==401&&TOKEN&&url!='/auth/login')logout();throw new Error((d&&d.error)||'حدث خطأ')}
 return d}
const run=f=>f().catch(e=>toast(e.message,'bad'));
const ST_IN={pending:'Pending',shipped:'Shipped',delivered:'Delivered',cancelled:'Cancelled',retour:'Retour'},PM_IN={flexy:'Flexy',baridimob:'BaridiMob',direct:'Direct'},PS_IN={requested:'Requested',completed:'Completed',rejected:'Rejected'};
const mP=p=>({id:p.id,t:p.title,ct:p.commercial_title||p.title,base:p.base_price,sug:p.suggested_price||p.base_price,stock:p.stock_qty,h:p.hook||'',d:p.description||'',imgs:p.images||[],e:'📦',active:p.is_active});
const mO=o=>({id:o.id,cust:o.customer_name,phone:o.customer_phone,wil:o.wilaya,dt:o.delivery_type,pt:o.product,qty:o.quantity,price:o.resale_price,base:o.base_price,fee:o.delivery_fee,st:ST_IN[o.status],an:o.affiliate});
const mW=p=>({id:p.id,a:p.amount,m:PM_IN[p.method],st:PS_IN[p.status],an:p.full_name,ph:p.phone,pa:p.payout_account,d:new Date(p.requested_at).toLocaleDateString('ar-DZ')});
const mN=n=>({id:n.id,msg:n.body,kind:n.kind,read:n.is_read,t:new Date(n.created_at).toLocaleTimeString('ar-DZ',{hour:'2-digit',minute:'2-digit'})});
const mu=u=>({id:u.id,role:'aff',name:u.full_name,phone:u.phone,email:u.email||'',st:u.is_active?'active':(u.rejected_at?'rejected':'pending')});
/* ===== نهاية الجزء 1 — الصق الجزء 2 تحت هذا السطر مباشرة ===== */async function load(){
 const u=S.user,jobs=[api('GET','/products'),api('GET','/wilayas'),api('GET','/orders'),api('GET','/payouts')];
 if(isAff())jobs.push(api('GET','/wallet'),api('GET','/notifications'));else jobs.push(api('GET','/admin/users'));
 const [P,Wl,O,W,x,y]=await Promise.all(jobs);
 S.P=P.map(mP).filter(p=>p.active);
 Wl.forEach(w=>{WIL[w.code-1]={c:w.code,n:w.name_ar,desk:w.desk_fee,home:w.home_fee}});
 S.O=O.map(mO);S.W=W.map(mW);
 if(isAff()){S.wallet={[u.id]:x.balance};const old=new Map(S.N.map(n=>[n.id,n]));S.N=y.items.map(n=>({...mN(n),uid:u.id,new:!!(old.get(n.id)&&old.get(n.id).new)}))}
 else{Object.keys(U).forEach(k=>delete U[k]);x.forEach(a=>U[a.id]=mu(a))}}
async function boot(){
 const m=await api('GET','/me');
 S.user={id:m.id,role:m.role=='admin'?'adm':'aff',name:m.full_name,username:m.username||'',av:m.avatar_url||'',phone:m.phone,email:m.email||'',pm:PM_IN[m.payout_method]||'Flexy',pa:m.payout_account||''};
 S.tab=isAdm()?'aord':'home';await load();render();
 if(isAff()&&S.push[S.user.id]&&unread())toast('🔔 لديك '+unread()+' إشعارات جديدة')}
function logout(){TOKEN=null;try{sessionStorage.removeItem('eldoob-token')}catch(e){}S.user=null;S.scr='land';S.N=[];closeSheet();render()}
const toBlob=u=>{const[h,b]=u.split(','),bin=atob(b),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:h.match(/:(.*?);/)[1]})};
const upImg=async u=>{const fd=new FormData();fd.append('image',toBlob(u),'p.jpg');return (await api('POST','/uploads',fd)).url};
const $=s=>document.querySelector(s),pid=i=>S.P.find(p=>p.id==i)||S.PD.find(p=>p.id==i),pro=o=>(o.price-o.base)*o.qty;
const isAdm=()=>S.user&&S.user.role=='adm',isAff=()=>S.user&&S.user.role=='aff';
const mine=()=>S.O;
const toast=(m,k='')=>{const t=$('#toast');t.textContent=m;t.className='toast '+k;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2400)};
const stk=p=>p.stock==0?'<span class="tag t-Cancelled">نفد المخزون</span>':`<span class="mute">متوفر: ${p.stock} قطعة</span>${p.stock<5?' <span class="tag t-Pending">كمية محدودة!</span>':''}`;
const card=p=>`<button class="p" data-p="${p.id}" ${p.stock?'':'style="opacity:.75" aria-disabled="true"'}><div class="im">${p.imgs&&p.imgs[0]?`<img src="${p.imgs[0]}" alt="">`:p.e}${p.stock?'':'<div class="out">نفد المخزون</div>'}</div><div class="b"><div class="t">${p.t}</div><div class="pr">${fmt(p.base)}</div><div class="mute">سعر الجملة</div><div style="margin-top:4px;line-height:1.9">${stk(p)}</div></div></button>`;
const NAV={aff:[['home','🏠','الرئيسية'],['search','🔍','البحث'],['orders','📦','طلباتي'],['more','☰','المزيد']],adm:[['aord','📋','الطلبات'],['apay','💸','السحب'],['aprod','📦','المنتجات'],['out','🚪','خروج']]};
function render(){
 const u=S.user,b=$('#body');
 $('#top').hidden=$('#nav').hidden=$('#brand').hidden=$('#tt').hidden=!u;if(u)$('#brand').innerHTML=logo(30)+'<b>ELDOOB.DZ</b><small>متجر الدب</small>'+(isAff()?`<button class="bell" id="bell" aria-label="الإشعارات">🔔${unread()?`<span class="badge">${unread()}</span>`:''}</button>`:'');
 if(!u){b.innerHTML=({login:loginV,reg:regV,otp:otpV,forgot:forgotV,reset:resetV}[S.scr]||landV)();return}
 $('#av').innerHTML=u.av?`<img src="${esc(u.av)}" alt="">`:(isAdm()?'🛡️':'👤');$('#nm').textContent=u.name+(isAdm()?' — مدير':' — مسوّق');
 $('#cm').hidden=isAdm();if(isAff())$('#cv').textContent=fmt(S.wallet[u.id]);
 $('#nav').innerHTML=NAV[u.role].map(([k,i,l])=>`<button data-n="${k}" class="${(S.tab==k||(k=='more'&&['deliv','help','tuts','acct'].includes(S.tab)))?'on':''}"><span>${i}</span>${l}${k=='apay'&&reqN()?` (${reqN()})`:''}</button>`).join('');
 const V={home:()=>pushAsk()+`<div class="grid">${S.P.map(card).join('')}</div>`,more:more,acct:acct,tuts:tuts,notifs:notifs,ausers:ausers,search:search,help:help,deliv:deliv,profile:profile,orders:orders,wallet:wallet,aord:aord,apay:apay,aprod:aprod};
 const adminTabs=['aord','apay','aprod'];
 if(adminTabs.includes(S.tab)&&!isAdm())S.tab='home'; // منع المسوّق من أي شاشة إدارة
 if(isAdm()&&!adminTabs.includes(S.tab))S.tab='aord';
 b.innerHTML=V[S.tab]();if(S.tab=='search'){res();$('#q').focus()}if(S.tab=='deliv')dl();
}
const search=()=>`<label>البحث عن المنتجات<input id="q" type="search" placeholder="اكتب اسم المنتج" value="${S.q}"></label><div class="grid" id="res"></div>`;
function res(){const l=S.P.filter(p=>p.t.includes(S.q.trim()));$('#res').innerHTML=l.length?l.map(card).join(''):'<div class="empty" style="grid-column:1/-1">لا يوجد منتج بهذا الاسم. جرّب كلمة أقصر.</div>'}
const help=()=>`<div class="card"><h3>التواصل مع الإدارة</h3><div class="mute" style="margin-bottom:10px">للاستفسار أو المساعدة، راسلنا على البريد الإلكتروني وسنردّ عليك في أقرب وقت.</div><a class="btn" href="mailto:eldoobstore19@gmail.com" dir="ltr" style="display:block;text-align:center;text-decoration:none">✉️ eldoobstore19@gmail.com</a></div>
 <div class="card"><h3>كيف تُحسب عمولتي؟</h3><div>العمولة = (سعر بيعك − سعر الجملة) × الكمية. رسوم التوصيل يدفعها الزبون فوق سعرك.</div></div>
 <div class="card"><h3>متى تصل العمولة إلى محفظتي؟</h3><div>بعد تسليم الطلب وتحصيل المبلغ كاملاً فقط. المرتجع أو الملغى لا يترتب عليك فيه أي شيء.</div></div>
 <div class="card"><h3>السحب</h3><div>تُدفع الطلبات مرتين في الأسبوع: فليكسي (2–12 ساعة)، بريدي موب (12 ساعة – يومان)، واستلام يدوي للمبالغ فوق 5,000 د.ج.</div></div>`;
/* ===== نهاية الجزء 2 — الصق الجزء 3 تحت هذا السطر مباشرة ===== */const RX={u:/^[a-z0-9_]{3,20}$/,p:/^0[567]\d{8}$/,e:/^\S+@\S+\.\S+$/};
const shrinkAv=f=>new Promise((res,rej)=>{const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=256;c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,256,256);res(c.toDataURL('image/jpeg',.85))};im.onerror=()=>rej(new Error('صورة غير صالحة'));im.src=rd.result};rd.onerror=()=>rej(new Error('تعذّرت قراءة الصورة'));rd.readAsDataURL(f)});
const landV=()=>`<div style="background:linear-gradient(180deg,#121212,#1d1a12);border-radius:14px;padding:64px 18px;text-align:center;display:flex;flex-direction:column;gap:14px;margin-top:16px"><div style="display:flex;justify-content:center">${logo(120)}</div><h1 style="margin:0 0 20px;letter-spacing:3px;color:var(--gold-hi)">ELDOOB.DZ</h1><button class="btn" data-g="login">تسجيل الدخول</button><button class="btn" data-g="reg" style="background:none;border:1px solid var(--gold);color:var(--gold-hi)">انضم إلينا كمسوّق</button></div>`;
const loginV=()=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 14px">تسجيل الدخول</h2></div><div class="card"><label>رقم الهاتف أو اسم المستخدم<input id="lp" dir="ltr" autocapitalize="none" autocomplete="username"></label><label>كلمة المرور<input id="lw" type="password" autocomplete="current-password"></label><button class="btn" id="lgo">دخول</button><button class="link" data-g="forgot" style="display:block;margin:10px auto 0">نسيت كلمة السر؟</button></div><button class="link" data-g="land">رجوع</button></div>`;
const regV=()=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 14px">انضم إلينا كمسوّق</h2></div><div class="card"><label>الاسم الكامل<input id="rn"></label><label>اسم المستخدم (فريد: a-z وأرقام و _)<input id="ru" dir="ltr" autocapitalize="none"></label><label>رقم الهاتف<input id="rp" inputmode="tel" placeholder="05XXXXXXXX"></label><label>البريد الإلكتروني<input id="re" type="email" dir="ltr"></label><label>كلمة المرور (8 أحرف فأكثر)<input id="rw" type="password"></label><button class="btn" id="rgo">إرسال رمز التأكيد</button></div><button class="link" data-g="land">رجوع</button></div>`;
const otpV=()=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 4px">تأكيد البريد الإلكتروني</h2><p class="mute" style="margin:0 0 12px">أرسلنا رمزاً من 6 أرقام إلى<br><b dir="ltr">${esc(S.rd.email)}</b></p></div><div class="card"><label>رمز التأكيد<input id="oc" inputmode="numeric" maxlength="6" autocomplete="one-time-code" dir="ltr" style="text-align:center;font-size:22px;letter-spacing:6px"></label><button class="btn" id="ogo">تأكيد وإنشاء الحساب</button><button class="link" id="ors" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button></div><button class="link" data-g="reg">تعديل البيانات</button></div>`;
const forgotV=()=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 4px">نسيت كلمة السر؟</h2><p class="mute" style="margin:0 0 12px">أدخل بريدك وسنرسل إليه رمز إعادة التعيين.</p></div><div class="card"><label>البريد الإلكتروني<input id="fe" type="email" dir="ltr"></label><button class="btn" id="fgo">إرسال الرمز</button></div><button class="link" data-g="login">رجوع</button></div>`;
const resetV=()=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 4px">كلمة سر جديدة</h2><p class="mute" style="margin:0 0 12px">الرمز أُرسل إلى<br><b dir="ltr">${esc(S.fe||'')}</b></p></div><div class="card"><label>الرمز<input id="fc" inputmode="numeric" maxlength="6" dir="ltr" style="text-align:center;font-size:22px;letter-spacing:6px"></label><label>كلمة السر الجديدة (8 أحرف فأكثر)<input id="fn" type="password"></label><label>تأكيد كلمة السر<input id="fn2" type="password"></label><button class="btn" id="fro">تغيير كلمة السر</button></div><button class="link" data-g="login">رجوع</button></div>`;
const more=()=>`<div class="card" style="padding:2px 12px">${[['deliv','🚚','أسعار التوصيل','أسعار الشحن المعتمدة لـ 69 ولاية'],['acct','⚙️','إدارة الحساب','بياناتك الشخصية وكلمة السر'],['help','💬','الدعم والاستفسار','تواصل مباشر مع الإدارة'],['tuts','🎓','الدروس والشروحات','كيف تعمل وتسوّق عبر المنصة']].map(([k,i,t,d])=>`<button data-n="${k}" style="display:flex;width:100%;gap:12px;align-items:center;background:none;border:0;border-bottom:1px solid var(--line);padding:13px 0;font:inherit;color:inherit;cursor:pointer;text-align:start"><span style="font-size:24px">${i}</span><span style="flex:1"><b>${t}</b><div class="mute">${d}</div></span><span class="mute">‹</span></button>`).join('')}</div>`;
const profile=()=>{const u=S.user,l=mine(),ern=l.filter(o=>o.st=='Delivered').reduce((a,o)=>a+pro(o),0),pen=l.filter(o=>['Pending','Shipped'].includes(o.st)).reduce((a,o)=>a+pro(o),0),dn=l.filter(o=>o.st=='Delivered').length;
 return`<div class="card" style="padding:0;overflow:hidden"><div class="cover"></div><div class="av pav">${u.av?`<img src="${esc(u.av)}" alt="">`:'👤'}</div><div style="text-align:center;padding:8px 12px 16px"><div style="font-weight:800;font-size:19px">${esc(u.name)}</div><div class="mute" dir="ltr">@${esc(u.username)}</div></div></div>
<div class="card"><div class="o" style="border:0"><span class="mute">📞 رقم الهاتف</span><span dir="ltr">${esc(u.phone)}</span></div><div class="o" style="border:0"><span class="mute">✉️ البريد الإلكتروني</span><span><span dir="ltr">${esc(u.email)}</span> <span class="vok">✔ موثّق</span></span></div></div>
<div class="stat"><div><b>${fmt(ern)}</b><span>إجمالي الأرباح</span></div><div><b>${fmt(pen)}</b><span>أرباح قيد الانتظار</span></div><div><b>${dn}</b><span>طلبات مسلّمة</span></div></div>
<div class="card"><div class="o" style="border:0"><span>المظهر: ${dark()?'الوضع المظلم':'الوضع الفاتح'}</span><button class="btn sm dk" id="thm">${dark()?'☀️ فاتح':'🌙 مظلم'}</button></div></div>
<button class="btn gh" data-n="out">تسجيل الخروج</button>`};
const acct=()=>{const u=S.user;return`<div class="card"><h3>الصورة الشخصية</h3><div style="display:flex;align-items:center;gap:12px"><div class="av" style="width:64px;height:64px;font-size:30px;flex:none">${u.av?`<img src="${esc(u.av)}" alt="">`:'👤'}</div><label style="margin:0;flex:1">اختر صورة<input id="avf" type="file" accept="image/*"></label></div></div>
<div class="card"><h3>بياناتي</h3><label>الاسم الكامل<input id="an" value="${esc(u.name)}"></label><label>اسم المستخدم (فريد)<input id="au" dir="ltr" autocapitalize="none" value="${esc(u.username)}"></label><label>رقم الهاتف<input id="ap" inputmode="tel" value="${esc(u.phone)}"></label><label>البريد الإلكتروني (موثّق، لا يمكن تعديله)<input value="${esc(u.email)}" readonly dir="ltr"></label>
<label>وسيلة الدفع المعتمدة<select id="pm2"><option value="Flexy" ${u.pm=='Flexy'?'selected':''}>فليكسي</option><option value="BaridiMob" ${u.pm=='BaridiMob'?'selected':''}>بريدي موب</option></select></label><label>رقم الحساب (فليكسي أو RIP)<input id="pa2" inputmode="numeric" value="${esc(u.pa)}"></label><button class="btn" id="sva">حفظ التعديلات</button></div>
<div class="card"><h3>تغيير كلمة السر</h3><label>كلمة السر الحالية<input id="pw0" type="password"></label><label>كلمة السر الجديدة (8 أحرف فأكثر)<input id="pw1" type="password"></label><label>تأكيد كلمة السر الجديدة<input id="pw2" type="password"></label><button class="btn dk" id="chp">تغيير كلمة السر</button></div>`};
async function doLogin(){
 try{const d=await api('POST','/auth/login',{identifier:$('#lp').value.trim(),password:$('#lw').value});
  TOKEN=d.token;try{sessionStorage.setItem('eldoob-token',TOKEN)}catch(e){}await boot()}
 catch(e){toast(e.message,'bad')}}
async function doReg(){const n=$('#rn').value.trim(),us=$('#ru').value.trim().toLowerCase(),p=$('#rp').value.replace(/\s/g,''),e=$('#re').value.trim().toLowerCase(),w=$('#rw').value;
 const bad=m=>toast(m,'bad');
 if(!n)return bad('أدخل الاسم الكامل');if(!RX.u.test(us))return bad('اسم المستخدم: 3 إلى 20 حرفاً (a-z وأرقام و _ فقط)');if(!RX.p.test(p))return bad('رقم هاتف جزائري غير صالح');if(!RX.e.test(e))return bad('بريد إلكتروني غير صالح');if(w.length<8)return bad('كلمة المرور 8 أحرف على الأقل');
 const body={full_name:n,username:us,phone:p,email:e,password:w};
 try{await api('POST','/auth/register/start',body);S.rd=body;S.scr='otp';render();toast('أرسلنا رمز التأكيد إلى بريدك','ok')}catch(er){toast(er.message,'bad')}}
async function doOtp(){try{const d=await api('POST','/auth/register/verify',{email:S.rd.email,code:$('#oc').value.trim()});TOKEN=d.token;try{sessionStorage.setItem('eldoob-token',TOKEN)}catch(e){}S.rd=null;await boot();toast('تم تأكيد بريدك وإنشاء حسابك','ok')}catch(e){toast(e.message,'bad')}}
async function doResend(){try{await api('POST','/auth/register/start',S.rd);toast('أُعيد إرسال الرمز','ok')}catch(e){toast(e.message,'bad')}}
async function doForgot(){const e=$('#fe').value.trim().toLowerCase();if(!RX.e.test(e)){toast('بريد إلكتروني غير صالح','bad');return}
 try{await api('POST','/auth/forgot',{email:e});S.fe=e;S.scr='reset';render();toast('إن كان البريد مسجّلاً فقد أرسلنا إليه رمزاً','ok')}catch(er){toast(er.message,'bad')}}
async function doReset(){const c=$('#fc').value.trim(),a=$('#fn').value,b=$('#fn2').value;
 if(a.length<8){toast('كلمة السر 8 أحرف على الأقل','bad');return}if(a!==b){toast('كلمتا السر غير متطابقتين','bad');return}
 try{await api('POST','/auth/reset',{email:S.fe,code:c,new_password:a});S.scr='login';render();toast('تم تغيير كلمة السر. سجّل الدخول','ok')}catch(e){toast(e.message,'bad')}}
/* ===== نهاية الجزء 3 — الصق الجزء 4 (الأخير) تحت هذا السطر مباشرة ===== *//* ===================== الجزء المُكمَّل ===================== */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const openSheet=h=>{$('#sin').innerHTML=h;$('#sheet').hidden=false};
function closeSheet(){const s=$('#sheet');if(s)s.hidden=true}
const pushAsk=()=>'';
const ausers=()=>aord();
const tag=s=>`<span class="tag t-${s}">${ST[s]||s}</span>`;
const empty=m=>`<div class="empty">${m}</div>`;
const go=t=>{S.tab=t;render();scrollTo(0,0)};
const refresh=async(msg)=>{await load();render();if(msg)toast(msg,'ok')};

async function doChp(){const a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value;
 if(b.length<8)return toast('كلمة السر الجديدة 8 أحرف على الأقل','bad');
 if(b!==c)return toast('كلمتا السر غير متطابقتين','bad');
 await api('PUT','/me/password',{current_password:a,new_password:b});
 ['#pw0','#pw1','#pw2'].forEach(s=>$(s).value='');toast('تم تغيير كلمة السر','ok')}
async function doSaveAcct(){const body={full_name:$('#an').value.trim(),username:$('#au').value.trim().toLowerCase(),phone:$('#ap').value.replace(/\s/g,''),payout_method:$('#pm2').value.toLowerCase(),payout_account:$('#pa2').value.trim()};
 if(!body.full_name)return toast('أدخل الاسم','bad');if(!RX.u.test(body.username))return toast('اسم مستخدم غير صالح','bad');if(!RX.p.test(body.phone))return toast('رقم هاتف غير صالح','bad');
 await api('PUT','/me',body);await boot();toast('تم الحفظ','ok')}
async function doAvatar(f){if(!f)return;const url=await upImg(await shrinkAv(f));await api('PUT','/me',{avatar_url:url});await boot();toast('تم تحديث الصورة','ok')}

/* المسوّق */
const orders=()=>{const l=mine();return l.length?l.map(o=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${esc(o.pt)} × ${o.qty}</b>${tag(o.st)}</div><div class="mute">${esc(o.cust)} — ${esc(o.wil)} — ${o.dt=='home'?'للمنزل':'للمكتب'}</div><div class="o" style="border:0;padding:4px 0 0"><span>سعر البيع: ${fmt(o.price)}</span><b style="color:var(--ok)">ربحك: ${fmt(pro(o))}</b></div></div>`).join(''):empty('لا توجد طلبات بعد. اختر منتجاً وابدأ البيع.')};
const wallet=()=>{const u=S.user,bal=S.wallet[u.id]||0;return`<div class="card"><h3>رصيدي</h3><div class="pr" style="font-size:24px">${fmt(bal)}</div><label style="margin-top:10px">المبلغ المطلوب سحبه<input id="wa" inputmode="numeric" placeholder="مثال: 3000"></label><button class="btn" id="wgo">طلب سحب (${u.pm=='Flexy'?'فليكسي':'بريدي موب'})</button></div><div class="card"><h3>سجل السحب</h3>${S.W.length?S.W.map(w=>`<div class="o"><span>${fmt(w.a)}<div class="mute">${w.d}</div></span>${tag(w.st)}</div>`).join(''):empty('لا توجد عمليات سحب')}</div>`};
const notifs=()=>`<div class="card"><h3>الإشعارات</h3>${S.N.length?S.N.map(n=>`<div class="o" style="${n.read?'opacity:.6':''}"><span>${esc(n.msg)}</span><span class="mute">${n.t}</span></div>`).join(''):empty('لا توجد إشعارات')}</div>`;
const deliv=()=>`<label>ابحث عن ولاية<input id="dq" placeholder="اسم الولاية"></label><div class="card" id="dlist"></div>`;
function dl(){const q=$('#dq'),f=()=>{const v=q.value.trim(),l=WIL.filter(w=>w&&w.n.includes(v));$('#dlist').innerHTML=`<div class="o" style="font-weight:700"><span>الولاية</span><span>مكتب / منزل</span></div>`+(l.length?l.map(w=>`<div class="o"><span>${w.c}. ${esc(w.n)}</span><span>${fmt(w.desk)} / ${fmt(w.home)}</span></div>`).join(''):empty('لا نتيجة'))};q.oninput=f;f()}
const tuts=()=>[['1) اختر منتجاً','تصفّح المنتجات واطّلع على سعر الجملة والمخزون.'],['2) حدّد سعر بيعك','ربحك = (سعر بيعك − سعر الجملة) × الكمية.'],['3) أدخل بيانات الزبون','الاسم والهاتف والولاية ونوع التوصيل، ويدفع الزبون رسوم التوصيل فوق سعرك.'],['4) تابع طلبك','ستصلك إشعارات عند الشحن والتسليم.'],['5) اسحب أرباحك','بعد التسليم تُضاف العمولة إلى محفظتك، ثم اطلب السحب.']].map(([t,d])=>`<div class="card"><h3>${t}</h3><div>${d}</div></div>`).join('');

function productSheet(id){const p=pid(id);if(!p||!p.stock)return;
 openSheet(`<h3>${esc(p.ct)}</h3>${p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="" style="width:100%;border-radius:10px;max-height:240px;object-fit:cover">`:''}<p>${esc(p.d)}</p><div class="mute">سعر الجملة: ${fmt(p.base)} — المقترح: ${fmt(p.sug)}</div>
 <form id="of" data-p="${p.id}" onsubmit="return false"><label>اسم الزبون<input id="oc1"></label><label>هاتف الزبون<input id="oc2" inputmode="tel" placeholder="05XXXXXXXX"></label>
 <label>الولاية<select id="ow">${WIL.filter(Boolean).map(w=>`<option value="${w.c}">${w.c} - ${esc(w.n)}</option>`).join('')}</select></label>
 <label>التوصيل<select id="od"><option value="home">إلى المنزل</option><option value="desk">إلى المكتب</option></select></label>
 <label>الكمية<input id="oq" type="number" min="1" max="${p.stock}" value="1"></label><label>سعر بيعك للزبون (د.ج)<input id="op" type="number" value="${p.sug}"></label>
 <div class="card" id="osum"></div><button class="btn" id="ogo2">تأكيد الطلب</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button></form>`);sumUpd()}
function sumUpd(){const f=$('#of');if(!f)return;const p=pid(f.dataset.p),q=+$('#oq').value||1,pr=+$('#op').value||0,w=WIL[$('#ow').value-1],fee=w?w[$('#od').value]:0;
 $('#osum').innerHTML=`<div class="o"><span>ربحك</span><b style="color:${pr>=p.base?'var(--ok)':'var(--bad)'}">${fmt((pr-p.base)*q)}</b></div><div class="o"><span>رسوم التوصيل (على الزبون)</span><span>${fmt(fee)}</span></div><div class="o" style="border:0"><span>الزبون يدفع</span><b>${fmt(pr*q+fee)}</b></div>`}
async function doOrder(){const f=$('#of'),p=pid(f.dataset.p),n=$('#oc1').value.trim(),ph=$('#oc2').value.replace(/\s/g,''),q=+$('#oq').value,pr=+$('#op').value;
 if(!n)return toast('أدخل اسم الزبون','bad');if(!RX.p.test(ph))return toast('هاتف الزبون غير صالح','bad');if(q<1||q>p.stock)return toast('كمية غير صالحة','bad');if(pr<p.base)return toast('سعر البيع أقل من سعر الجملة','bad');
 await api('POST','/orders',{product_id:p.id,customer_name:n,customer_phone:ph,wilaya:+$('#ow').value,delivery_type:$('#od').value,quantity:q,resale_price:pr});
 closeSheet();S.tab='orders';await refresh('تم إرسال الطلب')}
async function doPayout(){const a=+$('#wa').value,bal=S.wallet[S.user.id]||0;
 if(!a||a<=0)return toast('أدخل مبلغاً صحيحاً','bad');if(a>bal)return toast('المبلغ أكبر من رصيدك','bad');if(!S.user.pa)return toast('أضف رقم حسابك من إدارة الحساب','bad');
 await api('POST','/payouts',{amount:a,method:S.user.pm.toLowerCase()});await refresh('تم إرسال طلب السحب')}

/* المدير */
const aord=()=>{const pend=Object.values(U).filter(u=>u.st=='pending');
 return(pend.length?`<div class="card"><h3>مسوّقون بانتظار الموافقة (${pend.length})</h3>${pend.map(u=>`<div class="o"><span>${esc(u.name)}<div class="mute" dir="ltr">${esc(u.phone)}</div></span><span><button class="btn sm" data-ua="${u.id}:approve">قبول</button> <button class="btn sm gh" data-ua="${u.id}:reject">رفض</button></span></div>`).join('')}</div>`:'')
 +(S.O.length?S.O.map(o=>`<div class="card"><div class="o" style="border:0;padding:0"><b>#${o.id} ${esc(o.pt)} × ${o.qty}</b>${tag(o.st)}</div><div class="mute">${esc(o.cust)} — <span dir="ltr">${esc(o.phone)}</span> — ${esc(o.wil)} — ${o.dt=='home'?'منزل':'مكتب'}</div><div class="mute">المسوّق: ${esc(o.an)} — ${fmt(o.price*o.qty+(o.fee||0))}</div><select data-os="${o.id}">${Object.entries(ST).map(([k,v])=>`<option value="${k}" ${k==o.st?'selected':''}>${v}</option>`).join('')}</select></div>`).join(''):empty('لا توجد طلبات'))};
const apay=()=>S.W.length?S.W.map(w=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${fmt(w.a)}</b>${tag(w.st)}</div><div class="mute">${esc(w.an)} — <span dir="ltr">${esc(w.ph)}</span> — ${w.m=='Flexy'?'فليكسي':'بريدي موب'}: <span dir="ltr">${esc(w.pa)}</span> — ${w.d}</div>${w.st=='Requested'?`<div style="margin-top:8px"><button class="btn sm" data-pa="${w.id}:completed">تم الدفع</button> <button class="btn sm gh" data-pa="${w.id}:rejected">رفض</button></div>`:''}</div>`).join(''):empty('لا توجد طلبات سحب');
const aprod=()=>`<button class="btn" data-addp="1" style="margin-bottom:10px">＋ إضافة منتج</button>`+(S.P.length?S.P.map(p=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${esc(p.t)}</b><span class="mute">مخزون: ${p.stock}</span></div><div class="mute">جملة ${fmt(p.base)} — مقترح ${fmt(p.sug)}</div><button class="btn sm gh" data-dp="${p.id}" style="margin-top:6px">إخفاء</button></div>`).join(''):empty('لا توجد منتجات'));
function prodSheet(){openSheet(`<h3>منتج جديد</h3><label>الاسم<input id="pt1"></label><label>سعر الجملة<input id="pt2" type="number"></label><label>السعر المقترح<input id="pt3" type="number"></label><label>المخزون<input id="pt4" type="number"></label><label>الوصف<textarea id="pt5" rows="3"></textarea></label><label>صورة<input id="pt6" type="file" accept="image/*"></label><button class="btn" id="pgo">حفظ</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button>`)}
async function doAddProd(){const t=$('#pt1').value.trim(),b=+$('#pt2').value,s=+$('#pt3').value||b,k=+$('#pt4').value,f=$('#pt6').files[0];
 if(!t||!b||k<0)return toast('أكمل الاسم والسعر والمخزون','bad');
 const images=f?[await upImg(await shrinkAv(f))]:[];
 await api('POST','/admin/products',{title:t,base_price:b,suggested_price:s,stock_qty:k,description:$('#pt5').value.trim(),images});closeSheet();await refresh('تمت الإضافة')}

/* الأحداث */
document.addEventListener('click',e=>{const t=e.target,c=s=>t.closest(s);let x;
 if(c('[data-c]'))return closeSheet();
 if(t.id=='sheet')return closeSheet();
 if(x=c('[data-g]')){S.scr=x.dataset.g;return render()}
 if(x=c('[data-p]')&&!c('form'))return productSheet(c('[data-p]').dataset.p);
 if(x=c('[data-n]')){const k=x.dataset.n;return k=='out'?logout():go(k)}
 if(x=c('[data-ua]')){const[i,a]=x.dataset.ua.split(':');return run(async()=>{await api('POST','/admin/users/'+i+'/'+a);await refresh('تم')})}
 if(x=c('[data-pa]')){const[i,s]=x.dataset.pa.split(':');return run(async()=>{await api('PATCH','/admin/payouts/'+i,{status:s});await refresh('تم التحديث')})}
 if(x=c('[data-dp]'))return run(async()=>{await api('PATCH','/admin/products/'+x.dataset.dp,{is_active:false});await refresh('تم الإخفاء')});
 if(c('[data-addp]'))return prodSheet();
 if(c('#bell')){run(async()=>{await api('POST','/notifications/read');S.N.forEach(n=>n.read=true);go('notifs')});return}
 if(c('#cm'))return go('wallet');
 if(c('#tt')&&isAff())return go('profile');
 const id=(c('button[id]')||{}).id,A={lgo:doLogin,rgo:doReg,ogo:doOtp,ors:doResend,fgo:doForgot,fro:doReset,chp:()=>run(doChp),sva:()=>run(doSaveAcct),wgo:()=>run(doPayout),ogo2:()=>run(doOrder),pgo:()=>run(doAddProd),thm:()=>{setTheme(dark()?'light':'dark');render()}};
 if(A[id])A[id]()});
document.addEventListener('input',e=>{const i=e.target.id;
 if(i=='q'){S.q=e.target.value;res()}
 if(['oq','op'].includes(i))sumUpd()});
document.addEventListener('change',e=>{const t=e.target;
 if(['ow','od'].includes(t.id))sumUpd();
 if(t.id=='avf')run(()=>doAvatar(t.files[0]));
 if(t.dataset.os)run(async()=>{await api('PATCH','/admin/orders/'+t.dataset.os,{status:ST_IN_REV(t.value)});await refresh('تم تحديث الحالة')})});
const ST_IN_REV=k=>k.toLowerCase();

/* التشغيل */
(async()=>{if(TOKEN){try{await boot()}catch(e){TOKEN=null;S.user=null;render()}}else render()})();
</script>
</body>
</html>
