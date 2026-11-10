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
async function load(){
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



const RX={u:/^[a-z0-9_]{3,20}$/,p:/^0[567]\d{8}$/,e:/^\S+@\S+\.\S+$/};
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
async function doChp(){const a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value;
 if(b.length<8){toast('كلمة السر الجديدة 8 أحرف على الأقل','bad');return}if(b!==c){toast('كلمتا السر غير متطابقتين','bad');return}
 try{const d=await api('POST','/me/password',{current_password:a,new_password:b});TOKEN=d.token;try{sessionStorage.setItem('eldoob-token',TOKEN)}catch(e){}render();toast('تم تغيير كلمة السر','ok')}catch(e){toast(e.message,'bad')}}
async function doSva(){const n=$('#an').value.trim(),us=$('#au').value.trim().toLowerCase(),p=$('#ap').value.replace(/\s/g,''),a=$('#pa2').value.trim(),m=$('#pm2').value;
 const bad=x=>toast(x,'bad');
 if(!n)return bad('أدخل الاسم الكامل');if(!RX.u.test(us))return bad('اسم المستخدم: 3 إلى 20 حرفاً (a-z وأرقام و _ فقط)');if(!RX.p.test(p))return bad('رقم هاتف جزائري غير صالح');if(!/^\d{8,24}$/.test(a))return bad('رقم الحساب غير صالح');
 try{await api('PATCH','/me',{full_name:n,username:us,phone:p,payout_method:m.toLowerCase(),payout_account:a});Object.assign(S.user,{name:n,username:us,phone:p,pa:a,pm:m});render();toast('تم حفظ التعديلات','ok')}catch(e){toast(e.message,'bad')}}
async function avChg(f){if(!f)return;try{const u=await shrinkAv(f),fd=new FormData();fd.append('avatar',toBlob(u),'a.jpg');const r=await api('POST','/me/avatar',fd);S.user.av=r.url;render();toast('تم تحديث الصورة','ok')}catch(e){toast(e.message,'bad')}}

// ---------- المزيد والدروس والإشعارات

const tuts=()=>`<div class="mute" style="margin-bottom:8px">شروحات مبسطة تساعدك على البدء بسرعة. الفيديوهات تُضاف قريباً.</div>${[['كيف تنشئ طلباً لزبونك','دقيقتان'],['كيف تحدد سعر البيع وتحسب ربحك','3 دقائق'],['التوصيل للمكتب أو للمنزل: متى تختار؟','دقيقتان'],['كيف تسحب أرباحك','دقيقة']].map(([t,d],i)=>`<div class="card" style="display:flex;gap:12px;align-items:center"><div class="th" style="width:64px;height:48px;background:var(--ink);color:var(--gold-hi);font-size:22px">▶</div><div style="flex:1"><b>${i+1}. ${t}</b><div class="mute">فيديو · ${d} · قريباً</div></div></div>`).join('')}`;
