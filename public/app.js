const fmt=n=>new Intl.NumberFormat('ar-DZ').format(Math.round(n))+' د.ج';
const ST={Pending:'قيد المراجعة',Shipped:'قيد الشحن',Delivered:'تم التسليم',Retour:'مرتجع',Cancelled:'ملغى',Requested:'بانتظار المعالجة',Processing:'جاري المعالجة',Completed:'تم السحب',Rejected:'مرفوض'};
const OST=['Pending','Shipped','Delivered','Retour','Cancelled'];
const RX={u:/^[a-z0-9_]{3,20}$/,p:/^0[567]\d{8}$/,e:/^\S+@\S+\.\S+$/};
const logo=z=>`<svg width="${z}" height="${z}" viewBox="0 0 100 100" role="img" aria-label="ELDOOB"><defs><linearGradient id="gg${z}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9cc8ff"/><stop offset=".5" stop-color="#3d8bff"/><stop offset="1" stop-color="#1f4fc2"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="#070d1f" stroke="url(#gg${z})" stroke-width="4"/><circle cx="31" cy="33" r="9" fill="url(#gg${z})"/><circle cx="69" cy="33" r="9" fill="url(#gg${z})"/><circle cx="50" cy="52" r="23" fill="url(#gg${z})"/><ellipse cx="50" cy="60" rx="10" ry="8" fill="#070d1f"/><circle cx="41" cy="48" r="3" fill="#070d1f"/><circle cx="59" cy="48" r="3" fill="#070d1f"/><ellipse cx="50" cy="57" rx="4" ry="3" fill="#3d8bff"/></svg>`;
const S={scr:'land',rd:null,fe:'',rt:'',user:null,tab:'home',q:'',wallet:{b:0,e:0,p:0},P:[],O:[],W:[],G:{w:{},c:{}},pushOn:false};
let TOKEN=null;try{TOKEN=sessionStorage.getItem('eldoob-token')}catch(e){}
const saveToken=t=>{TOKEN=t;try{sessionStorage.setItem('eldoob-token',t)}catch(e){}};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isAdm=()=>S.user&&S.user.role=='adm',isAff=()=>S.user&&S.user.role=='aff';
const pid=i=>S.P.find(p=>p.id==i),pro=o=>(o.price-o.base)*o.qty;
const empty=m=>`<div class="empty">${m}</div>`;
const tag=s=>`<span class="tag t-${s}">${ST[s]||s}</span>`;
const toast=(m,k='')=>{const t=$('#toast');t.textContent=m;t.className='toast '+k;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2800)};
async function api(m,url,body){
 const fd=body instanceof FormData,hd={};if(body&&!fd)hd['Content-Type']='application/json';if(TOKEN)hd.Authorization='Bearer '+TOKEN;
 let r;try{r=await fetch('/api'+url,{method:m,headers:hd,body:body?(fd?body:JSON.stringify(body)):undefined})}catch(e){throw new Error('تعذّر الاتصال بالخادم')}
 let d=null;try{d=await r.json()}catch(e){}
 if(!r.ok){if(r.status==401&&TOKEN&&!url.startsWith('/auth/'))logout();throw new Error((d&&d.error)||'حدث خطأ')}
 return d}
const run=f=>f().catch(e=>toast(e.message,'bad'));
const PM_IN={flexy:'Flexy',baridimob:'BaridiMob',direct:'Direct'},PS_IN={pending:'Requested',processing:'Processing',paid:'Completed',rejected:'Rejected'};
const ST_IN={pending:'Pending',shipped:'Shipped',delivered:'Delivered',cancelled:'Cancelled',retour:'Retour'};
const mP=p=>({id:p.id,t:p.title,ct:p.commercial_title||p.title,base:p.base_price,sug:p.suggested_price||p.base_price,stock:p.stock_qty,d:p.description||'',imgs:p.images||[],e:'📦',active:p.is_active});
const mO=o=>({id:o.id,cust:o.customer_name,phone:o.customer_phone,wil:o.wilaya,com:o.commune,adr:o.address,dt:o.delivery_type,pt:o.product,qty:o.quantity,price:o.resale_price,base:o.base_price,fee:o.delivery_fee,tot:o.total_to_collect,st:ST_IN[o.status]||o.status,an:o.affiliate});
const mW=p=>({id:p.id,a:p.amount,m:PM_IN[p.method]||p.method,st:PS_IN[p.status]||p.status,an:p.affiliate||'',ph:p.phone||'',pa:p.account,d:new Date(p.created_at).toLocaleDateString('ar-DZ')});
async function load(){
 const adm=isAdm(),needGeo=!isAdm()&&!Object.keys(S.G.w).length;
 const [P,O,x,geo]=await Promise.all([api('GET','/products'),api('GET','/orders'),api('GET',adm?'/admin/payouts':'/wallet'),needGeo?api('GET','/geo'):null]);
 S.P=P.map(mP).filter(p=>p.active);S.O=O.map(mO);
 if(adm)S.W=x.map(mW);else{S.W=x.payouts.map(mW);S.wallet={b:x.balance,e:x.total_earned,p:x.pending_balance}}
 if(geo){geo.wilayas.forEach(w=>S.G.w[w.code]={c:w.code,n:w.name_ar,desk:w.desk_fee,home:w.home_fee,av:w.available});S.G.c=geo.communes}}
async function boot(keep){
 const m=await api('GET','/me');
 S.user={id:m.id,role:m.role=='admin'?'adm':'aff',name:m.full_name,username:m.username||'',av:m.avatar_url||'',phone:m.phone,email:m.email||'',pm:PM_IN[m.payout_method]||'Flexy',pa:m.payout_account||''};
 if(!keep)S.tab=isAdm()?'aord':'home';
 await load();render();pushState()}
function logout(){TOKEN=null;try{sessionStorage.removeItem('eldoob-token')}catch(e){}S.user=null;S.scr='land';S.G={w:{},c:{}};closeSheet();render()}
const toBlob=u=>{const[h,b]=u.split(','),bin=atob(b),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:h.match(/:(.*?);/)[1]})};
const shrink=(f,max,sq)=>new Promise((ok,no)=>{const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{let sx=0,sy=0,sw=im.width,sh=im.height,w,h;
 if(sq){const s=Math.min(sw,sh);sx=(sw-s)/2;sy=(sh-s)/2;sw=sh=s;w=h=max}else{const k=Math.min(1,max/Math.max(sw,sh));w=Math.round(sw*k);h=Math.round(sh*k)}
 const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,w,h);ok(c.toDataURL('image/jpeg',.85))};im.onerror=()=>no(new Error('صورة غير صالحة'));im.src=rd.result};rd.onerror=()=>no(new Error('تعذّرت قراءة الصورة'));rd.readAsDataURL(f)});
const upImg=async f=>{const fd=new FormData();fd.append('image',toBlob(await shrink(f,900,false)),'p.jpg');return (await api('POST','/uploads',fd)).url};

/* ===== الإشعارات ===== */
const pushOK=()=>'serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window;
const b64u8=s=>{const p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0))};
async function pushState(){if(!pushOK())return;try{const r=await navigator.serviceWorker.getRegistration('/sw.js');const s=r&&await r.pushManager.getSubscription();S.pushOn=!!s&&Notification.permission=='granted'}catch(e){}}
async function pushOn(){
 if(await Notification.requestPermission()!='granted')throw new Error('لم يتم السماح بالإشعارات من إعدادات المتصفح');
 const reg=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
 const key=(await api('GET','/push/key')).key;
 const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u8(key)});
 await api('POST','/push/subscribe',sub.toJSON());S.pushOn=true;toast('تم تفعيل الإشعارات','ok')}
async function pushOff(){
 const r=await navigator.serviceWorker.getRegistration('/sw.js'),s=r&&await r.pushManager.getSubscription();
 if(s){await api('POST','/push/unsubscribe',{endpoint:s.endpoint});await s.unsubscribe()}
 S.pushOn=false;toast('تم إيقاف الإشعارات')}
const pushCard=()=>pushOK()?`<div class="card"><div class="o" style="border:0"><span><b>الإشعارات</b><div class="mute">تنبيهات الطلبات والسحب على هذا الجهاز</div></span><label class="sw" style="margin:0"><input type="checkbox" id="pshs" ${S.pushOn?'checked':''}><s></s></label></div></div>`:'';

/* ===== الواجهة العامة ===== */
const card=p=>`<button class="p" data-p="${p.id}" ${p.stock?'':'style="opacity:.75" aria-disabled="true"'}><div class="im">${p.imgs&&p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="">`:p.e}${p.stock?'':'<div class="out">نفد المخزون</div>'}</div><div class="b"><div class="t">${esc(p.t)}</div><div class="pr">${fmt(p.base)}</div><div class="mute">سعر الجملة</div><div style="margin-top:4px;line-height:1.9">${p.stock==0?'<span class="tag t-Cancelled">نفد المخزون</span>':`<span class="mute">متوفر: ${p.stock} قطعة</span>${p.stock<5?' <span class="tag t-Pending">كمية محدودة!</span>':''}`}</div></div></button>`;
const NAV={aff:[['home','🏠','الرئيسية'],['search','🔍','البحث'],['orders','📦','طلباتي'],['more','☰','المزيد']],adm:[['aord','📋','الطلبات'],['apay','💸','السحب'],['aprod','📦','المنتجات'],['out','🚪','خروج']]};
const reqN=()=>S.W.filter(p=>p.st=='Requested'||p.st=='Processing').length;
function render(){
 const u=S.user,b=$('#body');
 $('#top').hidden=$('#nav').hidden=$('#brand').hidden=$('#tt').hidden=!u;
 if(u)$('#brand').innerHTML=logo(30)+'<b>ELDOOB.DZ</b><small>متجر الدب</small>';
 if(!u){b.innerHTML=({login:loginV,reg:regV,otp:otpV,forgot:forgotV,fcode:fcodeV,freset:fresetV,lcode:lcodeV,lverify:lverifyV}[S.scr]||landV)();return}
 $('#av').innerHTML=u.av?`<img src="${esc(u.av)}" alt="">`:(isAdm()?'🛡️':'👤');$('#nm').textContent=u.name+(isAdm()?' — مدير':' — مسوّق');
 $('#cm').hidden=isAdm();if(isAff())$('#cv').textContent=fmt(S.wallet.b);
 $('#nav').innerHTML=NAV[u.role].map(([k,i,l])=>`<button data-n="${k}" class="${(S.tab==k||(k=='more'&&['deliv','help','tuts','acct'].includes(S.tab)))?'on':''}"><span>${i}</span>${l}${k=='apay'&&reqN()?` (${reqN()})`:''}</button>`).join('');
 const V={home:()=>S.P.length?`<div class="grid">${S.P.map(card).join('')}</div>`:empty('لا توجد منتجات حالياً'),more,acct,tuts,search,help,deliv,profile,orders,wallet,aord,apay,aprod};
 const adminTabs=['aord','apay','aprod'];
 if(adminTabs.includes(S.tab)&&!isAdm())S.tab='home';
 if(isAdm()&&!adminTabs.includes(S.tab))S.tab='aord';
 if(!V[S.tab])S.tab=isAdm()?'aord':'home';
 b.innerHTML=V[S.tab]();if(S.tab=='search'){res();$('#q').focus()}if(S.tab=='deliv')dl();
}
const go=t=>{S.tab=t;render();scrollTo(0,0)};
const refresh=async msg=>{await load();render();if(msg)toast(msg,'ok')};
const openSheet=(h,mid)=>{$('#sin').innerHTML=h;$('#sheet').className=mid?'mid':'';$('#sheet').hidden=false};
function closeSheet(){const s=$('#sheet');if(s)s.hidden=true}
const confirmOut=()=>openSheet(`<div style="font-size:40px">👋</div><h3 style="margin:6px 0">هل تريد حقاً تسجيل الخروج؟</h3><p class="mute" style="margin:0 0 16px">ستحتاج إلى إدخال بياناتك مرة أخرى للعودة إلى حسابك.</p><button class="btn bad" id="cfo">نعم، تسجيل الخروج</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button>`,true);
const search=()=>`<label>البحث عن المنتجات<input id="q" type="search" placeholder="اكتب اسم المنتج" value="${esc(S.q)}"></label><div class="grid" id="res"></div>`;
function res(){const l=S.P.filter(p=>p.t.includes(S.q.trim()));$('#res').innerHTML=l.length?l.map(card).join(''):'<div class="empty" style="grid-column:1/-1">لا يوجد منتج بهذا الاسم. جرّب كلمة أقصر.</div>'}
const help=()=>`<div class="card"><h3>التواصل مع الإدارة</h3><div class="mute" style="margin-bottom:10px">للاستفسار أو المساعدة، راسلنا على البريد الإلكتروني وسنردّ عليك في أقرب وقت.</div><a class="btn" href="mailto:eldoobstore19@gmail.com" dir="ltr" style="text-align:center;text-decoration:none">✉️ eldoobstore19@gmail.com</a></div>
 <div class="card"><h3>كيف تُحسب عمولتي؟</h3><div>العمولة = (سعر بيعك − سعر الجملة) × الكمية. رسوم التوصيل يدفعها الزبون فوق سعرك.</div></div>
 <div class="card"><h3>متى تصل العمولة إلى محفظتي؟</h3><div>بعد تسليم الطلب وتحصيل المبلغ كاملاً فقط. المرتجع أو الملغى لا يترتب عليك فيه أي شيء.</div></div>
 <div class="card"><h3>السحب</h3><div>الحد الأدنى للسحب 1,000 د.ج. تتابع الحالة: جاري المعالجة ثم تم السحب.</div></div>`;
const more=()=>`<div class="card" style="padding:2px 14px">${[['deliv','🚚','أسعار التوصيل','أسعار الشحن المعتمدة لكل ولاية'],['acct','⚙️','إدارة الحساب','بياناتك وكلمة السر والإشعارات'],['help','💬','الدعم والاستفسار','تواصل مباشر مع الإدارة'],['tuts','🎓','الدروس والشروحات','كيف تعمل وتسوّق عبر المنصة']].map(([k,i,t,d])=>`<button data-n="${k}" style="display:flex;width:100%;gap:12px;align-items:center;background:none;border:0;border-bottom:1px solid var(--line);padding:13px 0;font:inherit;color:inherit;cursor:pointer;text-align:start"><span style="font-size:24px">${i}</span><span style="flex:1"><b>${t}</b><div class="mute">${d}</div></span><span class="mute">‹</span></button>`).join('')}<a href="/assets/docs/guide.html" style="display:flex;gap:12px;align-items:center;padding:13px 0;color:inherit;text-decoration:none"><span style="font-size:24px">📘</span><span style="flex:1"><b>دليل الاستخدام</b><div class="mute">شرح مبسّط خطوة بخطوة</div></span><span class="mute">‹</span></a></div><button class="btn gh" data-out="1">تسجيل الخروج</button>`;
const profile=()=>{const u=S.user,dn=S.O.filter(o=>o.st=='Delivered').length;
 return`<div class="card" style="padding:0;overflow:hidden"><div class="cover"></div><div class="av pav">${u.av?`<img src="${esc(u.av)}" alt="">`:'👤'}</div><div style="text-align:center;padding:8px 12px 16px"><div style="font-weight:800;font-size:19px">${esc(u.name)}</div><div class="mute" dir="ltr">@${esc(u.username)}</div></div></div>
<div class="card"><div class="o" style="border:0"><span class="mute">📞 رقم الهاتف</span><span dir="ltr">${esc(u.phone)}</span></div><div class="o" style="border:0"><span class="mute">✉️ البريد</span><span><span dir="ltr">${esc(u.email)}</span> <span class="vok">✔ موثّق</span></span></div></div>
<div class="stat"><div><b>${fmt(S.wallet.e)}</b><span>إجمالي الأرباح</span></div><div><b>${fmt(S.wallet.p)}</b><span>قيد الانتظار</span></div><div><b>${dn}</b><span>طلبات مسلّمة</span></div></div>
<button class="btn gh" data-out="1">تسجيل الخروج</button>`};
const acct=()=>{const u=S.user;return`${pushCard()}<div class="card"><h3>الصورة الشخصية</h3><div style="display:flex;align-items:center;gap:12px"><div class="av" style="width:64px;height:64px;font-size:30px">${u.av?`<img src="${esc(u.av)}" alt="">`:'👤'}</div><label style="margin:0;flex:1">اختر صورة<input id="avf" type="file" accept="image/*"></label></div></div>
<div class="card"><h3>بياناتي</h3><label>الاسم الكامل<input id="an" value="${esc(u.name)}"></label><label>اسم المستخدم (فريد)<input id="au" dir="ltr" autocapitalize="none" value="${esc(u.username)}"></label><label>رقم الهاتف (للسحب بفليكسي)<input id="ap" inputmode="tel" value="${esc(u.phone)}"></label><label>البريد الإلكتروني (موثّق)<input value="${esc(u.email)}" readonly dir="ltr"></label>
<label>وسيلة الدفع المعتمدة<select id="pm2"><option value="flexy" ${u.pm=='Flexy'?'selected':''}>فليكسي</option><option value="baridimob" ${u.pm=='BaridiMob'?'selected':''}>بريدي موب</option></select></label><label>رقم الحساب (فليكسي أو RIP)<input id="pa2" inputmode="numeric" value="${esc(u.pa)}"></label><button class="btn" id="sva">حفظ التعديلات</button></div>
<div class="card"><h3>تغيير كلمة السر</h3><label>كلمة السر الحالية<input id="pw0" type="password"></label><label>كلمة السر الجديدة (8 أحرف فأكثر)<input id="pw1" type="password"></label><label>تأكيد كلمة السر الجديدة<input id="pw2" type="password"></label><button class="btn dk" id="chp">تغيير كلمة السر</button></div>`};
const tuts=()=>[['1) اختر منتجاً','تصفّح المنتجات واطّلع على سعر الجملة والمخزون.'],['2) حدّد سعر بيعك','ربحك = (سعر بيعك − سعر الجملة) × الكمية.'],['3) أدخل بيانات الزبون','الاسم والهاتف والولاية والبلدية والعنوان ونوع التوصيل.'],['4) تابع طلبك','تابع حالة الطلب من صفحة طلباتي.'],['5) اسحب أرباحك','بعد التسليم تُضاف العمولة إلى محفظتك، ثم اطلب السحب.']].map(([t,d])=>`<div class="card"><h3>${t}</h3><div>${d}</div></div>`).join('');
const deliv=()=>`<label>ابحث عن ولاية<input id="dq" placeholder="اسم الولاية"></label><div class="card" id="dlist"></div>`;
function dl(){const q=$('#dq'),f=()=>{const v=q.value.trim(),l=Object.values(S.G.w).filter(w=>w.n.includes(v));$('#dlist').innerHTML=`<div class="o" style="font-weight:700"><span>الولاية</span><span>مكتب / منزل</span></div>`+(l.length?l.map(w=>`<div class="o"><span>${w.c}. ${esc(w.n)}</span>${w.av?`<span>${fmt(w.desk)} / ${fmt(w.home)}</span>`:'<span class="tag t-Cancelled">غير متوفر</span>'}</div>`).join(''):empty('لا نتيجة'))};q.oninput=f;f()}

/* ===== شاشات الدخول ===== */
const steps=n=>`<div class="steps">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>`;
const wrapV=(title,sub,body,back)=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 4px">${title}</h2>${sub?`<p class="mute" style="margin:0 0 12px">${sub}</p>`:'<div style="height:10px"></div>'}</div><div class="card">${body}</div>${back?`<button class="link" data-g="${back}">رجوع</button>`:''}</div>`;
const codeIn=id=>`<label>رمز التحقق<input id="${id}" inputmode="numeric" maxlength="6" autocomplete="one-time-code" dir="ltr" style="text-align:center;font-size:22px;letter-spacing:6px"></label>`;
const landV=()=>`<div style="background:linear-gradient(180deg,#0b1a44,#070d1f);border:1px solid var(--line);border-radius:26px;padding:64px 18px;text-align:center;display:flex;flex-direction:column;gap:14px;margin-top:16px"><div style="display:flex;justify-content:center">${logo(120)}</div><h1 style="margin:0 0 20px;letter-spacing:3px;color:var(--ac2);text-shadow:var(--glow)">ELDOOB.DZ</h1><button class="btn" data-g="login">تسجيل الدخول</button><button class="btn gh" data-g="reg">انضم إلينا كمسوّق</button></div>`;
const loginV=()=>wrapV('تسجيل الدخول','',`<label>البريد الإلكتروني أو اسم المستخدم<input id="lp" dir="ltr" autocapitalize="none" autocomplete="username"></label><label>كلمة المرور<input id="lw" type="password" autocomplete="current-password"></label><button class="btn" id="lgo">دخول</button><button class="link" data-g="lcode" style="display:block;margin:12px auto 0">دخول بالرمز (بدون كلمة سر)</button><button class="link" data-g="forgot" style="display:block;margin:6px auto 0">نسيت كلمة السر؟</button>`,'land');
const regV=()=>wrapV('انضم إلينا كمسوّق','',`<label>الاسم الكامل<input id="rn"></label><label>اسم المستخدم (a-z وأرقام و _)<input id="ru" dir="ltr" autocapitalize="none"></label><label>رقم الهاتف<input id="rp" inputmode="tel" placeholder="05XXXXXXXX"></label><label>البريد الإلكتروني<input id="re" type="email" dir="ltr"></label><label>كلمة المرور (8 أحرف فأكثر)<input id="rw" type="password"></label><button class="btn" id="rgo">إرسال رمز التأكيد</button>`,'land');
const otpV=()=>wrapV('تأكيد البريد الإلكتروني',`أرسلنا رمزاً من 6 أرقام إلى<br><b dir="ltr">${esc(S.rd.email)}</b>`,`${codeIn('oc')}<button class="btn" id="ogo">تأكيد وإنشاء الحساب</button><button class="link" id="ors" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button>`,'reg');
const forgotV=()=>wrapV('نسيت كلمة السر؟','أدخل بريدك وسنرسل إليه رمز التحقق.',`${steps(1)}<label>البريد الإلكتروني<input id="fe" type="email" dir="ltr"></label><button class="btn" id="fgo">إرسال الرمز</button>`,'login');
const fcodeV=()=>wrapV('أدخل رمز التحقق',`الرمز أُرسل إلى<br><b dir="ltr">${esc(S.fe)}</b>`,`${steps(2)}${codeIn('fc')}<button class="btn" id="fvo">تحقّق</button><button class="link" data-rs="forgot" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button>`,'forgot');
const fresetV=()=>wrapV('كلمة سر جديدة','تم التحقق من الرمز. اختر كلمة سر جديدة.',`${steps(3)}<label>كلمة السر الجديدة (8 أحرف فأكثر)<input id="fn" type="password"></label><label>تأكيد كلمة السر<input id="fn2" type="password"></label><button class="btn" id="fro">حفظ ودخول</button>`,'');
const lcodeV=()=>wrapV('دخول بالرمز','سنرسل رمزاً إلى بريدك وتدخل به مباشرة.',`<label>البريد الإلكتروني<input id="le" type="email" dir="ltr"></label><button class="btn" id="lcs">إرسال الرمز</button>`,'login');
const lverifyV=()=>wrapV('أدخل الرمز',`الرمز أُرسل إلى<br><b dir="ltr">${esc(S.fe)}</b>`,`${codeIn('lc')}<button class="btn" id="lcv">دخول</button><button class="link" data-rs="login" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button>`,'lcode');

async function doLogin(){const d=await api('POST','/auth/login',{identifier:$('#lp').value.trim().toLowerCase(),password:$('#lw').value});saveToken(d.token);await boot()}
async function doReg(){const n=$('#rn').value.trim(),us=$('#ru').value.trim().toLowerCase(),p=$('#rp').value.replace(/\s/g,''),e=$('#re').value.trim().toLowerCase(),w=$('#rw').value;
 const bad=m=>toast(m,'bad');
 if(!n)return bad('أدخل الاسم الكامل');if(!RX.u.test(us))return bad('اسم المستخدم: 3 إلى 20 حرفاً (a-z وأرقام و _ فقط)');if(!RX.p.test(p))return bad('رقم هاتف جزائري غير صالح');if(!RX.e.test(e))return bad('بريد إلكتروني غير صالح');if(w.length<8)return bad('كلمة المرور 8 أحرف على الأقل');
 const body={full_name:n,username:us,phone:p,email:e,password:w};
 await api('POST','/auth/register/start',body);S.rd=body;S.scr='otp';render();toast('أرسلنا رمز التأكيد إلى بريدك','ok')}
async function doOtp(){const d=await api('POST','/auth/register/verify',{email:S.rd.email,code:$('#oc').value.trim()});saveToken(d.token);S.rd=null;await boot();toast('تم إنشاء حسابك','ok')}
async function sendCode(kind,email,next){
 if(!RX.e.test(email))return toast('بريد إلكتروني غير صالح','bad');
 await api('POST',kind=='forgot'?'/auth/forgot':'/auth/login-code/start',{email});
 S.fe=email;if(next){S.scr=next;render()}toast('إن كان البريد مسجّلاً فقد أرسلنا إليه رمزاً','ok')}
async function doVerifyReset(){const d=await api('POST','/auth/reset/verify',{email:S.fe,code:$('#fc').value.trim()});S.rt=d.reset_token;S.scr='freset';render()}
async function doReset(){const a=$('#fn').value,b=$('#fn2').value;
 if(a.length<8)return toast('كلمة السر 8 أحرف على الأقل','bad');if(a!==b)return toast('كلمتا السر غير متطابقتين','bad');
 const d=await api('POST','/auth/reset',{reset_token:S.rt,new_password:a});saveToken(d.token);S.rt='';await boot();toast('تم تغيير كلمة السر ودخلت إلى حسابك','ok')}
async function doLoginCode(){const d=await api('POST','/auth/login-code/verify',{email:S.fe,code:$('#lc').value.trim()});saveToken(d.token);await boot()}
async function doChp(){const a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value;
 if(b.length<8)return toast('كلمة السر الجديدة 8 أحرف على الأقل','bad');if(b!==c)return toast('كلمتا السر غير متطابقتين','bad');
 const d=await api('POST','/me/password',{current_password:a,new_password:b});saveToken(d.token);['#pw0','#pw1','#pw2'].forEach(s=>$(s).value='');toast('تم تغيير كلمة السر','ok')}
async function doSaveAcct(){const body={full_name:$('#an').value.trim(),username:$('#au').value.trim().toLowerCase(),phone:$('#ap').value.replace(/\s/g,''),payout_method:$('#pm2').value};
 const pa=$('#pa2').value.trim();if(pa)body.payout_account=pa;
 if(!body.full_name)return toast('أدخل الاسم','bad');if(!RX.u.test(body.username))return toast('اسم مستخدم غير صالح','bad');if(!RX.p.test(body.phone))return toast('رقم هاتف غير صالح','bad');
 await api('PATCH','/me',body);await boot(true);toast('تم الحفظ','ok')}
async function doAvatar(f){if(!f)return;const fd=new FormData();fd.append('avatar',toBlob(await shrink(f,256,true)),'a.jpg');await api('POST','/me/avatar',fd);await boot(true);toast('تم تحديث الصورة','ok')}

/* ===== المسوّق: الطلبات والمحفظة ===== */
const orders=()=>S.O.length?S.O.map(o=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${esc(o.pt)} × ${o.qty}</b>${tag(o.st)}</div><div class="mute">${esc(o.cust)} — ${esc(o.wil)} — ${o.dt=='home'?'للمنزل':'للمكتب'}</div><div class="o" style="border:0;padding:4px 0 0"><span>سعر البيع: ${fmt(o.price)}</span><b style="color:var(--ok)">ربحك: ${fmt(pro(o))}</b></div></div>`).join(''):empty('لا توجد طلبات بعد. اختر منتجاً وابدأ البيع.');
const wallet=()=>`<div class="card"><h3>رصيدي</h3><div class="pr" style="font-size:24px">${fmt(S.wallet.b)}</div><div class="mute">أرباح قيد الانتظار: ${fmt(S.wallet.p)}</div><label style="margin-top:10px">المبلغ المطلوب سحبه (الحد الأدنى 1000)<input id="wa" inputmode="numeric" placeholder="مثال: 3000"></label><button class="btn" id="wgo">طلب سحب (${S.user.pm=='Flexy'?'فليكسي':'بريدي موب'})</button></div><div class="card"><h3>سجل السحب</h3>${S.W.length?S.W.map(w=>`<div class="o"><span>${fmt(w.a)}<div class="mute">${w.d}</div></span>${tag(w.st)}</div>`).join(''):empty('لا توجد عمليات سحب')}</div>`;
const communeField=c=>{const l=S.G.c[c];return l&&l.length?`<select id="ocm">${l.map(n=>`<option>${esc(n)}</option>`).join('')}</select>`:`<input id="ocm" placeholder="اكتب اسم البلدية">`};
function productSheet(id){const p=pid(id);if(!p||!p.stock)return;
 const ws=Object.values(S.G.w),first=(ws.find(w=>w.av)||ws[0]||{c:16}).c;
 openSheet(`<h3>${esc(p.ct)}</h3>${p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="" style="width:100%;border-radius:16px;max-height:240px;object-fit:cover">`:''}<p>${esc(p.d)}</p><div class="mute">سعر الجملة: ${fmt(p.base)} — المقترح: ${fmt(p.sug)}</div>
 <div id="of" data-pid="${p.id}"><label>اسم الزبون<input id="oc1"></label><label>هاتف الزبون<input id="oc2" inputmode="tel" placeholder="05XXXXXXXX"></label>
 <label>الولاية<select id="ow">${ws.map(w=>`<option value="${w.c}" ${w.av?'':'disabled'} ${w.c==first?'selected':''}>${w.c} - ${esc(w.n)}${w.av?'':' (غير متوفر)'}</option>`).join('')}</select></label>
 <label>البلدية<span id="ocw">${communeField(first)}</span></label><label>العنوان<input id="oad"></label>
 <label>التوصيل<select id="od"><option value="home">إلى المنزل</option><option value="desk">إلى المكتب</option></select></label>
 <label>الكمية<input id="oq" type="number" min="1" max="${p.stock}" value="1"></label><label>سعر بيعك للزبون (د.ج)<input id="op" type="number" value="${p.sug}"></label>
 <div class="card" id="osum"></div><button class="btn" id="ogo2">تأكيد الطلب</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button></div>`);sumUpd()}
function sumUpd(){const f=$('#of');if(!f)return;const p=pid(f.dataset.pid),q=+$('#oq').value||1,pr=+$('#op').value||0,w=S.G.w[$('#ow').value],fee=w?w[$('#od').value]:0;
 $('#osum').innerHTML=`<div class="o"><span>ربحك</span><b style="color:${pr>=p.base?'var(--ok)':'var(--bad)'}">${fmt((pr-p.base)*q)}</b></div><div class="o"><span>رسوم التوصيل (على الزبون)</span><span>${fmt(fee)}</span></div><div class="o" style="border:0"><span>الزبون يدفع</span><b>${fmt(pr*q+fee)}</b></div>`}
async function doOrder(){const f=$('#of'),p=pid(f.dataset.pid),n=$('#oc1').value.trim(),ph=$('#oc2').value.replace(/\s/g,''),q=+$('#oq').value,pr=+$('#op').value,cm=$('#ocm').value.trim(),ad=$('#oad').value.trim();
 if(!n)return toast('أدخل اسم الزبون','bad');if(!RX.p.test(ph))return toast('هاتف الزبون غير صالح','bad');if(!cm)return toast('أدخل البلدية','bad');if(!ad)return toast('أدخل العنوان','bad');
 if(!(q>=1&&q<=p.stock))return toast('كمية غير صالحة','bad');if(!(pr>=p.base))return toast('سعر البيع أقل من سعر الجملة','bad');
 await api('POST','/orders',{product_id:p.id,customer_name:n,customer_phone:ph,wilaya_code:+$('#ow').value,commune:cm,address:ad,delivery_type:$('#od').value,quantity:q,resale_price:pr});
 closeSheet();S.tab='orders';await refresh('تم إرسال الطلب')}
async function doPayout(){const a=+$('#wa').value;
 if(!(a>=1000))return toast('الحد الأدنى للسحب 1000 د.ج','bad');if(a>S.wallet.b)return toast('المبلغ أكبر من رصيدك','bad');if(!S.user.pa)return toast('أضف رقم حسابك من إدارة الحساب','bad');
 await api('POST','/payouts',{amount:a});await refresh('تم إرسال طلب السحب')}

/* ===== المدير ===== */
const aord=()=>pushCard()+(S.O.length?S.O.map(o=>`<div class="card"><div class="o" style="border:0;padding:0"><b>#${o.id} ${esc(o.pt)} × ${o.qty}</b>${tag(o.st)}</div><div class="mute">${esc(o.cust)} — <span dir="ltr">${esc(o.phone)}</span></div><div class="mute">${esc(o.wil)} — ${esc(o.com)} — ${esc(o.adr)} — ${o.dt=='home'?'منزل':'مكتب'}</div><div class="mute">المسوّق: ${esc(o.an)} — يُحصَّل: ${fmt(o.tot||0)}</div><select data-os="${o.id}">${OST.map(k=>`<option value="${k}" ${k==o.st?'selected':''}>${ST[k]}</option>`).join('')}</select></div>`).join(''):empty('لا توجد طلبات'));
const apay=()=>S.W.length?S.W.map(w=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${fmt(w.a)}</b>${tag(w.st)}</div><div class="mute">${esc(w.an)} — <span dir="ltr">${esc(w.ph)}</span> — ${w.m=='Flexy'?'فليكسي':'بريدي موب'}: <span dir="ltr">${esc(w.pa)}</span> — ${w.d}</div><div style="margin-top:8px">${w.st=='Requested'?`<button class="btn sm dk" data-pa="${w.id}:processing">جاري المعالجة</button> `:''}<button class="btn sm" data-pa="${w.id}:paid">تم السحب</button> <button class="btn sm gh" data-pa="${w.id}:rejected">رفض</button></div></div>`).join(''):empty('لا توجد طلبات سحب');
const aprod=()=>`<button class="btn" data-addp="1" style="margin-bottom:12px">＋ إضافة منتج</button>`+(S.P.length?S.P.map(p=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${esc(p.t)}</b><span class="mute">مخزون: ${p.stock}</span></div><div class="mute">جملة ${fmt(p.base)} — مقترح ${fmt(p.sug)}</div><button class="btn sm gh" data-dp="${p.id}" style="margin-top:6px">إخفاء</button></div>`).join(''):empty('لا توجد منتجات'));
const prodSheet=()=>openSheet(`<h3>منتج جديد</h3><label>الاسم<input id="pt1"></label><label>سعر الجملة<input id="pt2" type="number"></label><label>السعر المقترح<input id="pt3" type="number"></label><label>المخزون<input id="pt4" type="number"></label><label>الوصف<textarea id="pt5" rows="3"></textarea></label><label>صورة<input id="pt6" type="file" accept="image/*"></label><button class="btn" id="pgo">حفظ</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button>`);
async function doAddProd(){const t=$('#pt1').value.trim(),b=+$('#pt2').value,s=+$('#pt3').value||b,k=+$('#pt4').value,f=$('#pt6').files[0];
 if(!t||!(b>=1)||!(k>=0))return toast('أكمل الاسم والسعر والمخزون','bad');
 const images=f?[await upImg(f)]:[];
 await api('POST','/products',{title:t,base_price:b,suggested_price:s,stock_qty:k,description:$('#pt5').value.trim(),images});closeSheet();await refresh('تمت الإضافة')}

/* ===== الأحداث ===== */
document.addEventListener('click',e=>{const t=e.target,c=s=>t.closest(s);let x;
 if(t.id=='sheet'||c('[data-c]'))return closeSheet();
 if(c('[data-out]'))return confirmOut();
 if(x=c('[data-g]')){S.scr=x.dataset.g;return render()}
 if((x=c('[data-p]'))&&!c('#sheet'))return productSheet(x.dataset.p);
 if(x=c('[data-n]')){const k=x.dataset.n;return k=='out'?confirmOut():go(k)}
 if(x=c('[data-rs]'))return run(()=>sendCode(x.dataset.rs,S.fe));
 if(x=c('[data-pa]')){const[i,s]=x.dataset.pa.split(':');return run(async()=>{await api('PATCH','/admin/payouts/'+i,{status:s});await refresh('تم التحديث')})}
 if(x=c('[data-dp]'))return run(async()=>{await api('DELETE','/products/'+x.dataset.dp);await refresh('تم الإخفاء')});
 if(c('[data-addp]'))return prodSheet();
 if(c('#cm'))return go('wallet');
 if(c('#tt')&&isAff())return go('profile');
 const id=(c('button[id]')||{}).id,A={cfo:logout,lgo:()=>run(doLogin),rgo:()=>run(doReg),ogo:()=>run(doOtp),ors:()=>run(async()=>{await api('POST','/auth/register/start',S.rd);toast('أُعيد إرسال الرمز','ok')}),
  fgo:()=>run(()=>sendCode('forgot',$('#fe').value.trim().toLowerCase(),'fcode')),fvo:()=>run(doVerifyReset),fro:()=>run(doReset),
  lcs:()=>run(()=>sendCode('login',$('#le').value.trim().toLowerCase(),'lverify')),lcv:()=>run(doLoginCode),
  chp:()=>run(doChp),sva:()=>run(doSaveAcct),wgo:()=>run(doPayout),ogo2:()=>run(doOrder),pgo:()=>run(doAddProd)};
 if(A[id])A[id]()});
document.addEventListener('input',e=>{const i=e.target.id;
 if(i=='q'){S.q=e.target.value;res()}
 if(['oq','op'].includes(i))sumUpd()});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id=='ow'){$('#ocw').innerHTML=communeField(t.value);sumUpd()}
 if(t.id=='od')sumUpd();
 if(t.id=='avf')run(()=>doAvatar(t.files[0]));
 if(t.id=='pshs')run(async()=>{try{await(t.checked?pushOn():pushOff())}catch(er){t.checked=!t.checked;throw er}});
 if(t.dataset.os)run(async()=>{const o=S.O.find(z=>z.id==t.dataset.os),b={status:t.value.toLowerCase()};if(t.value=='Delivered'&&o&&o.tot)b.amount_collected=+o.tot;await api('PATCH','/orders/'+t.dataset.os+'/status',b);await refresh('تم تحديث الحالة')})});

(async()=>{if(TOKEN){try{await boot()}catch(e){TOKEN=null;S.user=null;render()}}else render()})();
