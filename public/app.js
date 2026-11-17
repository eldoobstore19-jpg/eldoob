const ICONS={
home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
clipboard:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 12h6M9 16h4"/>',
wallet:'<path d="M4 7a2 2 0 0 1 2-2h12v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 14h2"/>',
logout:'<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m16 8 4 4-4 4M20 12H9"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
shield:'<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
truck:'<path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
chat:'<path d="M4 5h16v11H9l-5 4z"/>',
cap:'<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 11.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5"/>',
book:'<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
idcard:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h4M14 14h3"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
phone:'<path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
check:'<path d="m5 12 5 5 9-10"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
x:'<path d="M6 6l12 12M18 6 6 18"/>',
chev:'<path d="m15 6-6 6 6 6"/>',
heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>'};
const ic=(n,z=22)=>`<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle" aria-hidden="true">${ICONS[n]||''}</svg>`;
const fmt=n=>new Intl.NumberFormat('ar-DZ').format(Math.round(n))+' د.ج';
const ST={Pending:'قيد المراجعة',Shipped:'قيد الشحن',Delivered:'تم التسليم',Retour:'مرتجع',Cancelled:'ملغى',Requested:'بانتظار المعالجة',Processing:'جاري المعالجة',Completed:'تم السحب',Rejected:'مرفوض'};
const OST=['Pending','Shipped','Delivered','Retour','Cancelled'];
const RX={u:/^[a-z0-9_]{3,20}$/,p:/^0[567]\d{8}$/,e:/^\S+@\S+\.\S+$/};
const logo=z=>`<img src="${z>=60?'/assets/logo-512.png':'/assets/logo-mark.png'}" width="${z}" height="${z}" alt="ELDOOB" style="border-radius:50%;vertical-align:middle">`;
const pic=(n,z=48,x='')=>`<img src="/assets/i-${n}.png" width="${z}" height="${z}" alt="" style="vertical-align:middle;border-radius:50%;${x}">`;
const emptyPic=(n,m)=>`<div class="empty">${pic(n,110)}<div style="margin-top:8px">${m}</div></div>`;
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
const mP=p=>({id:p.id,t:p.title,ct:p.commercial_title||p.title,base:p.base_price,sug:p.suggested_price||p.base_price,stock:p.stock_qty,d:p.description||'',imgs:p.images||[],e:ic('box',44),active:p.is_active});
const mO=o=>({id:o.id,cust:o.customer_name,phone:o.customer_phone,wil:o.wilaya,com:o.commune,adr:o.address,dt:o.delivery_type,pt:o.product,qty:o.quantity,price:o.resale_price,base:o.base_price,fee:o.delivery_fee,tot:o.total_to_collect,st:ST_IN[o.status]||o.status,an:o.affiliate,nt:o.admin_note||''});
const mW=p=>({id:p.id,a:p.amount,m:PM_IN[p.method]||p.method,st:PS_IN[p.status]||p.status,an:p.affiliate||'',ph:p.phone||'',pa:p.account,d:new Date(p.created_at).toLocaleDateString('ar-DZ'),fid:p.front_id,bid:p.back_id,nt:p.admin_note||''});
async function load(){
 const adm=isAdm(),needGeo=!isAdm()&&!Object.keys(S.G.w).length;
 const [P,O,x,geo]=await Promise.all([api('GET','/products'),api('GET','/orders'),api('GET',adm?'/admin/payouts':'/wallet'),needGeo?api('GET','/geo'):null]);
 S.P=P.map(mP).filter(p=>p.active);S.O=O.map(mO);
 if(adm)S.W=x.map(mW);else{S.W=x.payouts.map(mW);S.wallet={b:x.balance,e:x.total_earned,p:x.pending_balance};S.idOk=!!x.id_ok}
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
let GT=null,FV={k:'',l:[]};
const favKey=()=>'eldoob-fav-'+(S.user?S.user.id:'x');
const favs=()=>{const k=favKey();if(FV.k!==k){let l=[];try{l=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){}FV={k,l:Array.isArray(l)?l.map(String):[]}}return FV.l};
const isFav=id=>favs().includes(String(id));
function togFav(id){id=String(id);const l=favs(),on=!l.includes(id);FV.l=on?[...l,id]:l.filter(x=>x!==id);try{localStorage.setItem(FV.k,JSON.stringify(FV.l))}catch(e){}
 document.querySelectorAll('[data-fav="'+id+'"]').forEach(h=>h.classList.toggle('on',on));
 if(S.tab=='fav')render();toast(on?'أُضيف إلى المفضلة':'أُزيل من المفضلة','ok')}
const hrt=id=>`<span class="hrt${isFav(id)?' on':''}" data-fav="${id}" role="button" aria-label="المفضلة">${ic('heart',18)}</span>`;
const stk=p=>!p.stock?'<span class="stk s0">نفد المخزون</span>':p.stock<5?`<span class="stk s1">كمية محدودة — بقي ${p.stock}</span>`:`<span class="stk s2">متوفر ${p.stock} قطعة</span>`;
const stkS=p=>!p.stock?'<span class="stk s0">نفد</span>':p.stock<5?`<span class="stk s1">بقي ${p.stock}</span>`:`<span class="stk s2">${p.stock} قطعة</span>`;
const card=p=>`<div class="p" data-p="${p.id}" role="button" tabindex="0" ${p.stock?'':'style="opacity:.8"'}><div class="im">${p.imgs&&p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="" loading="lazy">`:p.e}${hrt(p.id)}${p.stock?'':'<div class="out">نفد المخزون</div>'}</div><div class="b"><div class="t">${esc(p.t)}</div>${p.d?`<div class="sd">${esc(p.d)}</div>`:''}<div class="pk"><span class="pr">${fmt(p.base)}</span>${stkS(p)}</div></div></div>`;
const homeV=()=>{if(!S.P.length)return emptyPic('cart','لا توجد منتجات حالياً');
 let w=S.P.filter(p=>p.stock&&p.imgs&&p.imgs[0]);if(!w.length)w=S.P.filter(p=>p.imgs&&p.imgs[0]);
 let mq='';if(w.length){let l=[...w];while(l.length<8)l=l.concat(w);
  const it=l.map(p=>`<div class="mqi" data-p="${p.id}"><img src="${esc(p.imgs[0])}" alt="" loading="lazy"></div>`).join('');
  mq=`<div class="sec">منتجات مميزة</div><div class="mq"><div class="mqt" style="--d:${l.length*4}s">${it}${it}</div></div>`}
 return mq+`<div class="sec">كل المنتجات</div><div class="grid">${S.P.map(card).join('')}</div>`};
const favV=()=>{const l=S.P.filter(p=>isFav(p.id));return `<div class="sec">منتجاتي المفضلة</div>`+(l.length?`<div class="grid">${l.map(card).join('')}</div>`:emptyPic('bear-thumb','لا توجد منتجات مفضلة بعد. اضغط على القلب في أي منتج لإضافته هنا.'))};
const prodV=()=>{const p=pid(S.cp),im=p.imgs||[],pc=Math.min(100,Math.round(p.stock/30*100)),bc=!p.stock?'var(--bad)':p.stock<5?'var(--warn)':'var(--ok)';
 return `<button class="bk" data-back="1">${ic('chev',18)} رجوع</button>
<div class="gal"><div class="gt" id="gt" dir="ltr">${im.length?im.map(u=>`<img src="${esc(u)}" alt="">`).join(''):`<div class="gph">${p.e}</div>`}</div>${hrt(p.id)}${im.length>1?`<div class="dots" id="dots">${im.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}${p.stock?'':'<div class="out">نفد المخزون</div>'}</div>
<div class="cpr"><button class="cp" data-copy="n">${ic('copy',15)} نسخ الاسم</button></div>
<h2 class="pn">${esc(p.ct)}</h2>
<div class="card dsc"><div class="dh"><b>وصف المنتج</b>${p.d?`<button class="cp" data-copy="d">${ic('copy',15)} نسخ الوصف</button>`:''}</div>${p.d?`<div class="dt" id="dt">${esc(p.d)}</div><button class="link" id="dmore" data-more="1" hidden>عرض الوصف كاملاً ▾</button>`:'<div class="mute">لا يوجد وصف لهذا المنتج.</div>'}</div>
<div class="pbox"><div class="mute">سعر المنتج</div><div class="bigp pr">${fmt(p.base)}</div><div class="o" style="border:0;padding:10px 0 0"><span class="mute">الكمية المتوفرة</span>${stk(p)}</div><div class="bar"><i style="width:${p.stock?Math.max(pc,6):0}%;background:${bc}"></i></div></div>
<div class="cta"><button class="btn" data-buy="${p.id}" ${p.stock?'':'disabled'}>${p.stock?'اضغط لمتابعة الشراء':'نفد المخزون'}</button></div>`};
const buyV=()=>{const p=pid(S.cp),ws=Object.values(S.G.w),first=(ws.find(w=>w.av)||ws[0]||{c:16}).c;
 return `<button class="bk" data-back="1">${ic('chev',18)} رجوع</button>
<div class="card" style="display:flex;gap:12px;align-items:center">${p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="" style="width:72px;height:72px;border-radius:14px;object-fit:cover">`:`<div class="av" style="width:72px;height:72px;border-radius:14px">${p.e}</div>`}<div style="flex:1"><b>${esc(p.ct)}</b><div class="mute">سعر المنتج</div><div class="pr" style="color:var(--gold)">${fmt(p.base)}</div></div></div>
<div id="of" data-pid="${p.id}">
<div class="card"><h3>بيانات الزبون</h3><label>اسم الزبون<input id="oc1" autocomplete="off"></label><label>هاتف الزبون<input id="oc2" inputmode="tel" placeholder="05XXXXXXXX"></label></div>
<div class="card"><h3>مكان التوصيل</h3><label>الولاية<select id="ow">${ws.map(w=>`<option value="${w.c}" ${w.av?'':'disabled'} ${w.c==first?'selected':''}>${w.c} - ${esc(w.n)}${w.av?'':' (غير متوفر)'}</option>`).join('')}</select></label>
<label>البلدية<span id="ocw">${communeField(first)}</span></label><label>العنوان<input id="oad" autocomplete="off"></label>
<label>نوع التوصيل<select id="od"><option value="home">إلى المنزل</option><option value="desk">إلى المكتب</option></select></label></div>
<div class="card"><h3>الكمية والسعر</h3><label>الكمية (المتوفر ${p.stock})<div class="qs"><button type="button" data-q="-1">−</button><input id="oq" type="number" min="1" max="${p.stock}" value="1" inputmode="numeric"><button type="button" data-q="1">+</button></div></label>
<label>سعر بيعك النهائي للزبون (د.ج)<input id="op" type="number" inputmode="numeric" min="${p.base}" value="${p.base}"></label><div class="mute">ارفع السعر فوق سعر المنتج وربحك يزيد تلقائياً.</div></div>
<div class="card" id="osum"></div><button class="btn" id="ogo2">تأكيد الطلب</button></div>`};
const copyTxt=async(t,m)=>{try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()}toast(m,'ok')};
function initGal(){clearInterval(GT);const g=$('#gt');if(g){const d=$('#dots'),n=g.children.length;
 g.addEventListener('scroll',()=>{if(!d)return;const i=Math.round(Math.abs(g.scrollLeft)/g.clientWidth);[...d.children].forEach((x,k)=>x.classList.toggle('on',k==i))},{passive:true});
 if(n>1){g.addEventListener('touchstart',()=>{g.dataset.t=1},{passive:true});g.addEventListener('touchend',()=>setTimeout(()=>{delete g.dataset.t},4000),{passive:true});
  GT=setInterval(()=>{if(!document.body.contains(g)){clearInterval(GT);return}if(g.dataset.t)return;g.scrollTo({left:((Math.round(g.scrollLeft/g.clientWidth)+1)%n)*g.clientWidth,behavior:'smooth'})},3000)}}
 const t=$('#dt'),m=$('#dmore');if(t&&m&&t.scrollHeight>t.clientHeight+2)m.hidden=false}
function openProd(id){if(!isAff())return;S.cp=id;if(!['prod','buy'].includes(S.tab))S.from=S.tab;
 try{history.replaceState({t:S.tab,cp:S.cp},'');history.pushState({t:'prod',cp:id},'')}catch(e){}S.tab='prod';render();scrollTo(0,0)}
function openBuy(){try{history.pushState({t:'buy',cp:S.cp},'')}catch(e){}S.tab='buy';render();scrollTo(0,0)}
window.addEventListener('popstate',e=>{if(!S.user)return;const st=e.state||{};S.tab=st.t||(isAdm()?'aord':'home');if(st.cp)S.cp=st.cp;render();scrollTo(0,0)});
const NAV={aff:[['home','home','الرئيسية'],['search','search','البحث'],['fav','heart','المفضلة'],['orders','box','طلباتي'],['more','menu','المزيد']],adm:[['aord','clipboard','الطلبات'],['apay','wallet','السحب'],['aprod','box','المنتجات'],['out','logout','خروج']]};
const reqN=()=>S.W.filter(p=>p.st=='Requested'||p.st=='Processing').length;
function render(){
 const u=S.user,b=$('#body');clearInterval(GT);
 $('#top').hidden=$('#nav').hidden=$('#brand').hidden=$('#tt').hidden=!u;
 if(u)$('#brand').innerHTML=logo(30)+'<b>ELDOOB.DZ</b><small>متجر الدب</small>';
 if(!u){b.innerHTML=({login:loginV,reg:regV,otp:otpV,forgot:forgotV,fcode:fcodeV,freset:fresetV,lcode:lcodeV,lverify:lverifyV}[S.scr]||landV)();return}
 $('#av').innerHTML=u.av?`<img src="${esc(u.av)}" alt="">`:(isAdm()?pic('shield',36):pic('bear-thumb',36));$('#nm').textContent=u.name+(isAdm()?' — مدير':' — مسوّق');
 $('#cm').hidden=isAdm();if(isAff())$('#cv').textContent=fmt(S.wallet.b);
 $('#nav').innerHTML=NAV[u.role].map(([k,i,l])=>`<button data-n="${k}" class="${(S.tab==k||(k=='more'&&['deliv','help','tuts','acct'].includes(S.tab))||(['prod','buy'].includes(S.tab)&&S.from==k))?'on':''}"><span style="display:flex;justify-content:center">${ic(i,22)}</span>${l}${k=='apay'&&reqN()?` (${reqN()})`:''}</button>`).join('');
 const V={home:homeV,fav:favV,prod:prodV,buy:buyV,more,acct,tuts,search,help,deliv,profile,orders,wallet,aord,apay,aprod,photo:photoV};
 const adminTabs=['aord','apay','aprod'];
 if(adminTabs.includes(S.tab)&&!isAdm())S.tab='home';
 if(isAdm()&&!adminTabs.includes(S.tab))S.tab='aord';
 if(!V[S.tab])S.tab=isAdm()?'aord':'home';
 if(['prod','buy'].includes(S.tab)&&(!isAff()||!pid(S.cp)))S.tab='home';
 b.innerHTML=V[S.tab]();if(S.tab=='prod')initGal();if(S.tab=='buy')sumUpd();if(S.tab=='search'){res();$('#q').focus()}if(S.tab=='deliv')dl();
}
const go=t=>{S.tab=t;render();scrollTo(0,0)};
const refresh=async msg=>{await load();render();if(msg)toast(msg,'ok')};
const openSheet=(h,mid)=>{$('#sin').innerHTML=h;$('#sheet').className=mid?'mid':'';$('#sheet').hidden=false};
function closeSheet(){const s=$('#sheet');if(s)s.hidden=true}
const confirmOut=()=>openSheet(`<div style="display:flex;justify-content:center;color:var(--ac2);margin-bottom:4px">${ic('logout',44)}</div><h3 style="margin:6px 0">هل تريد حقاً تسجيل الخروج؟</h3><p class="mute" style="margin:0 0 16px">ستحتاج إلى إدخال بياناتك مرة أخرى للعودة إلى حسابك.</p><button class="btn bad" id="cfo">نعم، تسجيل الخروج</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button>`,true);
const search=()=>`<label>البحث عن المنتجات<input id="q" type="search" placeholder="اكتب اسم المنتج" value="${esc(S.q)}"></label><div class="grid" id="res"></div>`;
function res(){const l=S.P.filter(p=>p.t.includes(S.q.trim()));$('#res').innerHTML=l.length?l.map(card).join(''):'<div class="empty" style="grid-column:1/-1">لا يوجد منتج بهذا الاسم. جرّب كلمة أقصر.</div>'}
const help=()=>`<div class="card"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">${pic('bear-support',56)}<h3 style="margin:0">التواصل مع الإدارة</h3></div><div class="mute" style="margin-bottom:10px">للاستفسار أو المساعدة، راسلنا على البريد الإلكتروني وسنردّ عليك في أقرب وقت.</div><a class="btn" href="mailto:eldoobstore19@gmail.com" dir="ltr" style="text-align:center;text-decoration:none">${ic('mail',18)} eldoobstore19@gmail.com</a></div>
 <div class="card"><h3>كيف تُحسب عمولتي؟</h3><div>عمولتك = (سعر بيعك − سعر المنتج) × الكمية. رسوم التوصيل يدفعها الزبون فوق سعرك.</div></div>
 <div class="card"><h3>متى تصل العمولة إلى محفظتي؟</h3><div>بعد تسليم الطلب وتحصيل المبلغ كاملاً فقط. المرتجع أو الملغى لا يترتب عليك فيه أي شيء.</div></div>
 <div class="card"><h3>السحب</h3><div>الحد الأدنى للسحب 1,000 د.ج. تتابع الحالة: جاري المعالجة ثم تم السحب.</div></div>`;
const more=()=>`<div class="card" style="padding:2px 14px">${[['deliv','truck','أسعار التوصيل','أسعار الشحن المعتمدة لكل ولاية'],['acct','settings','إدارة الحساب','بياناتك وكلمة السر والإشعارات'],['help','chat','الدعم والاستفسار','تواصل مباشر مع الإدارة'],['tuts','cap','الدروس والشروحات','كيف تعمل وتسوّق عبر المنصة']].map(([k,i,t,d])=>`<button data-n="${k}" style="display:flex;width:100%;gap:12px;align-items:center;background:none;border:0;border-bottom:1px solid var(--line);padding:13px 0;font:inherit;color:inherit;cursor:pointer;text-align:start"><span style="color:var(--ac2);display:flex">${ic(i,26)}</span><span style="flex:1"><b>${t}</b><div class="mute">${d}</div></span><span class="mute">${ic('chev',18)}</span></button>`).join('')}<a href="/assets/docs/guide.html" style="display:flex;gap:12px;align-items:center;padding:13px 0;color:inherit;text-decoration:none"><span style="color:var(--ac2);display:flex">${ic('book',26)}</span><span style="flex:1"><b>دليل الاستخدام</b><div class="mute">شرح مبسّط خطوة بخطوة</div></span><span class="mute">${ic('chev',18)}</span></a></div><button class="btn gh" data-out="1">تسجيل الخروج</button>`;
const profile=()=>{const u=S.user,dn=S.O.filter(o=>o.st=='Delivered').length;
 return`<div class="card" style="padding:0;overflow:hidden"><div class="cover"></div><div class="av pav">${u.av?`<img src="${esc(u.av)}" alt="">`:pic('bear-thumb',84)}</div><div style="text-align:center;padding:8px 12px 16px"><div style="font-weight:800;font-size:19px">${esc(u.name)}</div><div class="mute" dir="ltr">@${esc(u.username)}</div></div></div>
<div class="card"><div class="o" style="border:0"><span class="mute">${ic('phone',16)} رقم الهاتف</span><span dir="ltr">${esc(u.phone)}</span></div><div class="o" style="border:0"><span class="mute">${ic('mail',16)} البريد</span><span><span dir="ltr">${esc(u.email)}</span> <span class="vok">${ic('check',14)} موثّق</span></span></div></div>
<div class="stat"><div><b>${fmt(S.wallet.e)}</b><span>إجمالي الأرباح</span></div><div><b>${fmt(S.wallet.p)}</b><span>قيد الانتظار</span></div><div><b>${dn}</b><span>طلبات مسلّمة</span></div></div>
<button class="btn gh" data-out="1">تسجيل الخروج</button>`};
const acct=()=>{const u=S.user;return`${pushCard()}<div class="card"><h3>الصورة الشخصية</h3><div style="display:flex;align-items:center;gap:12px"><div class="av" style="width:64px;height:64px;font-size:30px">${u.av?`<img src="${esc(u.av)}" alt="">`:pic('bear-thumb',64)}</div><button class="btn dk" data-act="pickavatar" style="flex:1">${ic('camera',18)} تغيير الصورة من المعرض</button></div></div>
<div class="card"><h3>بياناتي</h3><label>الاسم الكامل<input id="an" value="${esc(u.name)}"></label><label>اسم المستخدم (فريد)<input id="au" dir="ltr" autocapitalize="none" value="${esc(u.username)}"></label><label>رقم الهاتف (للسحب بفليكسي)<input id="ap" inputmode="tel" value="${esc(u.phone)}"></label><label>البريد الإلكتروني (موثّق)<input value="${esc(u.email)}" readonly dir="ltr"></label>
<label>وسيلة الدفع المعتمدة<select id="pm2"><option value="flexy" ${u.pm=='Flexy'?'selected':''}>فليكسي</option><option value="baridimob" ${u.pm=='BaridiMob'?'selected':''}>بريدي موب</option></select></label><label>رقم الاستلام (هاتف فليكسي، أو رقم RIP من 20 رقماً لبريدي موب)<input id="pa2" dir="ltr" inputmode="numeric" value="${esc(u.pa)}"></label><button class="btn" id="sva">حفظ التعديلات</button></div>
<div class="card"><h3>تغيير كلمة السر</h3><label>كلمة السر الحالية<input id="pw0" type="password"></label><label>كلمة السر الجديدة (8 أحرف فأكثر)<input id="pw1" type="password"></label><label>تأكيد كلمة السر الجديدة<input id="pw2" type="password"></label><button class="btn dk" id="chp">تغيير كلمة السر</button></div>`};
const tuts=()=>[['1) اختر منتجاً','تصفّح المنتجات واطّلع على سعر المنتج والمخزون.'],['2) حدّد سعر بيعك','سعر المنتج ثابت، وما تزيده فوقه عند بيعك للزبون هو عمولتك.'],['3) أدخل بيانات الزبون','الاسم والهاتف والولاية والبلدية والعنوان ونوع التوصيل.'],['4) تابع طلبك','تابع حالة الطلب من صفحة طلباتي.'],['5) اسحب أرباحك','بعد التسليم تُضاف العمولة إلى محفظتك، ثم اطلب السحب.']].map(([t,d])=>`<div class="card"><h3>${t}</h3><div>${d}</div></div>`).join('');
const deliv=()=>`<label>ابحث عن ولاية<input id="dq" placeholder="اسم الولاية"></label><div class="card" id="dlist"></div>`;
function dl(){const q=$('#dq'),f=()=>{const v=q.value.trim(),l=Object.values(S.G.w).filter(w=>w.n.includes(v));$('#dlist').innerHTML=`<div class="o" style="font-weight:700"><span>الولاية</span><span>مكتب / منزل</span></div>`+(l.length?l.map(w=>`<div class="o"><span>${w.c}. ${esc(w.n)}</span>${w.av?`<span>${fmt(w.desk)} / ${fmt(w.home)}</span>`:'<span class="tag t-Cancelled">غير متوفر</span>'}</div>`).join(''):empty('لا نتيجة'))};q.oninput=f;f()}

/* ===== شاشات الدخول ===== */
const steps=n=>`<div class="steps">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>`;
const wrapV=(title,sub,body,back)=>`<div style="padding:16px 4px"><div style="text-align:center">${logo(64)}<h2 style="margin:6px 0 4px">${title}</h2>${sub?`<p class="mute" style="margin:0 0 12px">${sub}</p>`:'<div style="height:10px"></div>'}</div><div class="card">${body}</div>${back?`<button class="link" data-g="${back}">رجوع</button>`:''}</div>`;
const codeIn=id=>`<label>رمز التحقق<input id="${id}" inputmode="numeric" maxlength="6" autocomplete="one-time-code" dir="ltr" style="text-align:center;font-size:22px;letter-spacing:6px"></label>`;
const landV=()=>`<div style="background:linear-gradient(180deg,#0b1a44,#070d1f);border:1px solid var(--line);border-radius:26px;padding:64px 18px;text-align:center;display:flex;flex-direction:column;gap:14px;margin-top:16px"><div style="display:flex;justify-content:center">${logo(190)}</div><h1 style="margin:0 0 20px;letter-spacing:3px;color:var(--ac2);text-shadow:var(--glow)">ELDOOB.DZ</h1><button class="btn" data-g="login">تسجيل الدخول</button><button class="btn gh" data-g="reg">انضم إلينا كمسوّق</button></div>`;
const loginV=()=>wrapV('تسجيل الدخول','',`<label>البريد الإلكتروني أو اسم المستخدم<input id="lp" dir="ltr" autocapitalize="none" autocomplete="username"></label><label>كلمة المرور<input id="lw" type="password" autocomplete="current-password"></label><button class="btn" id="lgo">دخول</button><button class="link" data-g="lcode" style="display:block;margin:12px auto 0">دخول بالرمز (بدون كلمة سر)</button><button class="link" data-g="forgot" style="display:block;margin:6px auto 0">نسيت كلمة السر؟</button>`,'land');
const regV=()=>wrapV('انضم إلينا كمسوّق','',`<label>الاسم الكامل<input id="rn"></label><label>اسم المستخدم (a-z وأرقام و _)<input id="ru" dir="ltr" autocapitalize="none" autocomplete="off"></label><div id="ruS" style="min-height:22px;font-size:13px;margin:-4px 0 8px"></div><label>رقم الهاتف<input id="rp" inputmode="tel" placeholder="05XXXXXXXX"></label><label>البريد الإلكتروني<input id="re" type="email" dir="ltr"></label><label>كلمة المرور (8 أحرف فأكثر)<input id="rw" type="password"></label><button class="btn" id="rgo">إرسال رمز التأكيد</button>`,'land');
const otpV=()=>wrapV('تأكيد البريد الإلكتروني',`أرسلنا رمزاً من 6 أرقام إلى<br><b dir="ltr">${esc(S.rd.email)}</b>`,`${codeIn('oc')}<button class="btn" id="ogo">تأكيد وإنشاء الحساب</button><button class="link" id="ors" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button>`,'reg');
const forgotV=()=>wrapV('نسيت كلمة السر؟','أدخل بريدك وسنرسل إليه رمز التحقق.',`${steps(1)}<label>البريد الإلكتروني<input id="fe" type="email" dir="ltr"></label><button class="btn" id="fgo">إرسال الرمز</button>`,'login');
const fcodeV=()=>wrapV('أدخل رمز التحقق',`الرمز أُرسل إلى<br><b dir="ltr">${esc(S.fe)}</b>`,`${steps(2)}${codeIn('fc')}<button class="btn" id="fvo">تحقّق</button><button class="link" data-rs="forgot" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button>`,'forgot');
const fresetV=()=>wrapV('كلمة سر جديدة','تم التحقق من الرمز. اختر كلمة سر جديدة.',`${steps(3)}<label>كلمة السر الجديدة (8 أحرف فأكثر)<input id="fn" type="password"></label><label>تأكيد كلمة السر<input id="fn2" type="password"></label><button class="btn" id="fro">حفظ ودخول</button>`,'');
const lcodeV=()=>wrapV('دخول بالرمز','سنرسل رمزاً إلى بريدك وتدخل به مباشرة.',`<label>البريد الإلكتروني<input id="le" type="email" dir="ltr"></label><button class="btn" id="lcs">إرسال الرمز</button>`,'login');
const lverifyV=()=>wrapV('أدخل الرمز',`الرمز أُرسل إلى<br><b dir="ltr">${esc(S.fe)}</b>`,`${codeIn('lc')}<button class="btn" id="lcv">دخول</button><button class="link" data-rs="login" style="display:block;margin:10px auto 0">إعادة إرسال الرمز</button>`,'lcode');

async function doLogin(){const d=await api('POST','/auth/login',{identifier:$('#lp').value.trim().toLowerCase(),password:$('#lw').value});saveToken(d.token);await boot()}
async function doReg(){const n=$('#rn').value.trim(),us=$('#ru').value.trim().toLowerCase(),p=$('#rp').value.replace(/\s/g,''),e=$('#re').value.trim().toLowerCase(),w=$('#rw').value;
 const bad=m=>toast(m,'bad');
 if(S.unOk===false)return bad('اسم المستخدم محجوز، اختر اسماً آخر');
 if(!n)return bad('أدخل الاسم الكامل');if(!RX.u.test(us))return bad('اسم المستخدم: 3 إلى 20 حرفاً (a-z وأرقام و _ فقط)');if(!RX.p.test(p))return bad('رقم هاتف جزائري غير صالح');if(!RX.e.test(e))return bad('بريد إلكتروني غير صالح');if(w.length<8)return bad('كلمة المرور 8 أحرف على الأقل');
 const body={full_name:n,username:us,phone:p,email:e,password:w};
 await api('POST','/auth/register/start',body);S.rd=body;S.scr='otp';render();toast('أرسلنا رمز التأكيد إلى بريدك','ok')}
async function doOtp(){const d=await api('POST','/auth/register/verify',{email:S.rd.email,code:$('#oc').value.trim()});saveToken(d.token);S.rd=null;await boot();S.tab='photo';render();toast('تم إنشاء حسابك','ok')}
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
 const pa=$('#pa2').value.replace(/\s/g,'');if(pa){body.payout_account=pa;if(body.payout_method=='baridimob'&&!/^\d{20}$/.test(pa))return toast('رقم RIP يجب أن يكون 20 رقماً بالضبط','bad');if(body.payout_method=='flexy'&&!RX.p.test(pa))return toast('رقم فليكسي غير صالح','bad')}
 if(!body.full_name)return toast('أدخل الاسم','bad');if(!RX.u.test(body.username))return toast('اسم مستخدم غير صالح','bad');if(!RX.p.test(body.phone))return toast('رقم هاتف غير صالح','bad');
 await api('PATCH','/me',body);await boot(true);toast('تم الحفظ','ok')}
async function doAvatar(f){if(!f)return;const fd=new FormData();fd.append('avatar',toBlob(await shrink(f,256,true)),'a.jpg');await api('POST','/me/avatar',fd);await boot(true);toast('تم تحديث الصورة','ok')}

/* ===== المسوّق: الطلبات والمحفظة ===== */
const orders=()=>S.O.length?S.O.map(o=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${esc(o.pt)} × ${o.qty}</b>${tag(o.st)}</div><div class="mute">${esc(o.cust)} — ${esc(o.wil)} — ${o.dt=='home'?'للمنزل':'للمكتب'}</div><div class="o" style="border:0;padding:4px 0 0"><span>للزبون: ${fmt(o.price)}</span><b style="color:var(--ok)">ربحك: ${fmt(pro(o))}</b></div>${o.nt?`<div class="note"><b>ملاحظة من الإدارة:</b> ${esc(o.nt)}</div>`:''}</div>`).join(''):emptyPic('bear-cart','لا توجد طلبات بعد. اختر منتجاً وابدأ البيع.');
const prevBox=(src,label,act)=>`<div style="flex:1;text-align:center"><div class="im" style="border-radius:14px;aspect-ratio:1.5">${src?`<img src="${src}" alt="">`:ic('idcard',40)}</div><button class="btn sm dk" data-act="${act}" style="margin-top:6px">${label}</button></div>`;
const idCard=()=>`<div class="card"><h3 style="display:flex;align-items:center;gap:8px">${pic('shield',36)} توثيق الهوية</h3><div class="mute" style="margin-bottom:10px">مطلوب مرة واحدة قبل أول سحب: صورة واضحة لوجه بطاقة الهوية وظهرها. تُحفظ بسرية ولا يراها إلا المدير.</div><div style="display:flex;gap:10px">${prevBox(S.idfp,'وجه البطاقة','pickid:front')}${prevBox(S.idbp,'ظهر البطاقة','pickid:back')}</div><button class="btn" id="ids" style="margin-top:12px;${S.idf&&S.idb?'':'opacity:.5'}">رفع الصور</button></div>`;
const walletPm=()=>S.wm||(S.user.pm=='BaridiMob'?'baridimob':'flexy');
const wallet=()=>{const u=S.user,m=walletPm(),bm=m=='baridimob',saved=((u.pm=='BaridiMob')==bm&&u.pa)?u.pa:(bm?'':u.phone);
 return `<div class="card"><h3 style="display:flex;align-items:center;gap:8px">${pic('money',36)} رصيدي</h3><div class="pr" style="font-size:24px">${fmt(S.wallet.b)}</div><div class="mute">أرباح قيد الانتظار: ${fmt(S.wallet.p)}</div></div>
<div class="card"><h3>طلب سحب</h3><label>المبلغ المطلوب سحبه (الحد الأدنى 1000 د.ج)<input id="wa" inputmode="numeric" placeholder="مثال: 3000" value="${esc(S.wa||'')}"></label>
<div class="mute">طريقة الاستلام</div><div class="seg"><button type="button" data-wm="flexy" class="${bm?'':'on'}">فليكسي</button><button type="button" data-wm="baridimob" class="${bm?'on':''}">بريدي موب</button></div>
<label>${bm?'رقم RIP الخاص بحسابك (20 رقماً)':'رقم هاتفك لاستلام الفليكسي'}<input id="wacc" dir="ltr" inputmode="numeric" maxlength="${bm?20:10}" placeholder="${bm?'00799999XXXXXXXXXXXX':'05XXXXXXXX'}" value="${esc(saved)}"></label>
<div class="mute" style="margin:-4px 0 12px">${bm?'RIP هو رقم حسابك البريدي من 20 رقماً: يبدأ بـ 00799999 ثم رقم حساب CCP ثم المفتاح. تجده على شيك CCP، وعادةً في بيانات حسابك داخل تطبيق بريدي موب. تأكد منه جيداً لأن الخطأ فيه يؤخر وصول مالك.':'اكتب رقم الهاتف الذي سيصله رصيد الفليكسي (يبدأ بـ 05 أو 06 أو 07).'}</div>
<button class="btn" id="wgo">إرسال طلب السحب</button></div>
<div class="card"><h3>سجل السحب</h3>${S.W.length?S.W.map(w=>`<div class="o"><span>${fmt(w.a)}<div class="mute">${w.m=='Flexy'?'فليكسي':'بريدي موب'} — ${w.d}</div>${w.nt?`<div class="note">${esc(w.nt)}</div>`:''}</span>${tag(w.st)}</div>`).join(''):empty('لا توجد عمليات سحب')}</div>`};
const communeField=c=>{const l=S.G.c[c];return l&&l.length?`<select id="ocm">${l.map(n=>`<option>${esc(n)}</option>`).join('')}</select>`:`<input id="ocm" placeholder="اكتب اسم البلدية">`};
function sumUpd(){const f=$('#of');if(!f)return;const p=pid(f.dataset.pid),base=Number(p.base),q=Math.max(1,+$('#oq').value||1),pr=+$('#op').value||0,gain=pr-base,w=S.G.w[$('#ow').value],fee=w?w[$('#od').value]:0;
 $('#osum').innerHTML=`<h3>ملخص الطلب</h3><div class="o"><span>سعر المنتج × ${q}</span><span>${fmt(base*q)}</span></div><div class="o"><span>سعر بيعك × ${q}</span><span>${fmt(pr*q)}</span></div><div class="o"><span>عمولتك (ربحك)</span><b style="color:${gain>=0?'var(--ok)':'var(--bad)'}">${gain>=0?'+':''}${fmt(gain*q)}</b></div><div class="o"><span>رسوم التوصيل (على الزبون)</span><span>${fmt(fee)}</span></div><div class="o tot"><span>الزبون يدفع</span><b>${fmt(pr*q+fee)}</b></div>${gain<0?'<div class="mute" style="color:var(--bad)">سعر البيع أقل من سعر المنتج، ارفعه للمتابعة.</div>':''}`}
async function doOrder(){const f=$('#of'),p=pid(f.dataset.pid),n=$('#oc1').value.trim(),ph=$('#oc2').value.replace(/\s/g,''),q=+$('#oq').value,pr=+$('#op').value||0,cm=$('#ocm').value.trim(),ad=$('#oad').value.trim();
 if(!n)return toast('أدخل اسم الزبون','bad');if(!RX.p.test(ph))return toast('هاتف الزبون غير صالح','bad');if(!cm)return toast('أدخل البلدية','bad');if(!ad)return toast('أدخل العنوان','bad');
 if(!(q>=1&&q<=p.stock))return toast('كمية غير صالحة','bad');if(!(Number.isInteger(pr)&&pr>=Number(p.base)))return toast('سعر البيع لا يمكن أن يكون أقل من سعر المنتج','bad');
 await api('POST','/orders',{product_id:p.id,customer_name:n,customer_phone:ph,wilaya_code:+$('#ow').value,commune:cm,address:ad,delivery_type:$('#od').value,quantity:q,resale_price:pr});
 closeSheet();S.tab='orders';await refresh('تم إرسال الطلب')}
async function doPayout(){const a=+$('#wa').value,m=walletPm(),acc=($('#wacc').value||'').replace(/\s/g,'');
 if(!(a>=1000))return toast('الحد الأدنى للسحب 1000 د.ج','bad');if(a>S.wallet.b)return toast('المبلغ أكبر من رصيدك','bad');
 if(m=='baridimob'){if(!/^\d{20}$/.test(acc))return toast('رقم RIP يجب أن يكون 20 رقماً بالضبط','bad')}else if(!RX.p.test(acc))return toast('رقم فليكسي غير صالح (مثال: 0550000000)','bad');
 await api('POST','/payouts',{amount:a,method:m,account:acc});S.wa='';S.wm=null;await boot(true);toast('تم إرسال طلب السحب','ok')}

/* ===== المدير ===== */
const aord=()=>pushCard()+(S.O.length?S.O.map(o=>`<div class="card"><div class="o" style="border:0;padding:0"><b>#${o.id} ${esc(o.pt)} × ${o.qty}</b>${tag(o.st)}</div><div class="mute">${esc(o.cust)} — <span dir="ltr">${esc(o.phone)}</span></div><div class="mute">${esc(o.wil)} — ${esc(o.com)} — ${esc(o.adr)} — ${o.dt=='home'?'منزل':'مكتب'}</div><div class="mute">المسوّق: ${esc(o.an)} — يُحصَّل: ${fmt(o.tot||0)}</div><select data-os="${o.id}">${OST.map(k=>`<option value="${k}" ${k==o.st?'selected':''}>${ST[k]}</option>`).join('')}</select><div class="nrow"><input data-on="${o.id}" maxlength="500" placeholder="ملاحظة للمسوّق، مثال: الزبون تأخر في الرد" value="${esc(o.nt||'')}"><button class="btn sm dk" data-onsave="${o.id}">حفظ</button></div></div>`).join(''):empty('لا توجد طلبات'));
const apay=()=>S.W.length?S.W.map(w=>`<div class="card"><div class="o" style="border:0;padding:0"><b>${fmt(w.a)}</b>${tag(w.st)}</div><div class="mute">${esc(w.an)} — <span dir="ltr">${esc(w.ph)}</span> — ${w.m=='Flexy'?'فليكسي':'بريدي موب'}: <span dir="ltr">${esc(w.pa)}</span> — ${w.d}</div><input data-pn="${w.id}" maxlength="300" placeholder="ملاحظة للمسوّق (اختياري)" value="${esc(w.nt||'')}" style="margin-top:8px"><div style="margin-top:8px">${w.fid?`<button class="btn sm dk" data-idv="${w.fid}:${w.bid}">${ic('idcard',16)} عرض الهوية</button> `:''}${w.st=='Requested'?`<button class="btn sm dk" data-pa="${w.id}:processing">جاري المعالجة</button> `:''}<button class="btn sm" data-pa="${w.id}:paid">تم السحب</button> <button class="btn sm gh" data-pa="${w.id}:rejected">رفض</button></div></div>`).join(''):empty('لا توجد طلبات سحب');
const aprod=()=>`<button class="btn" data-addp="1" style="margin-bottom:12px">${ic('plus',16)} إضافة منتج</button>`+(S.P.length?S.P.map(p=>`<div class="card"><div style="display:flex;gap:10px;align-items:center">${p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="" style="width:56px;height:56px;border-radius:12px;object-fit:cover">`:'<div class="av" style="border-radius:12px;width:56px;height:56px">'+ic('box',26)+'</div>'}<div style="flex:1"><b>${esc(p.t)}</b><div class="mute">السعر ${fmt(p.base)} — مخزون ${p.stock} — ${p.imgs.length} صور</div></div></div><div style="margin-top:8px"><button class="btn sm dk" data-ep="${p.id}">تعديل</button> <button class="btn sm gh" data-dp="${p.id}">إخفاء</button></div></div>`).join(''):empty('لا توجد منتجات'));
const imgsGrid=()=>`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${S.pi.map((m,i)=>`<div style="position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--card2)"><img src="${esc(m.prev||m.url)}" alt="" style="width:100%;height:100%;object-fit:cover"><button data-ri="${i}" style="position:absolute;top:3px;inset-inline-start:3px;width:24px;height:24px;border-radius:50%;border:0;background:#000b;color:#fff;cursor:pointer">${ic('x',14)}</button></div>`).join('')}${S.pi.length<8?`<button data-act="addimgs" style="aspect-ratio:1;border-radius:12px;border:1px dashed var(--ac);background:none;color:var(--ac2);cursor:pointer">${ic('plus',26)}</button>`:''}</div>`;
function prodSheet(p){S.ep=p?p.id:null;S.pi=p?p.imgs.map(u=>({url:u})):[];
 openSheet(`<h3>${p?'تعديل المنتج':'منتج جديد'}</h3><label>الاسم<input id="pt1" value="${esc(p?p.t:'')}"></label><label>سعر المنتج (الذي يراه البائعون)<input id="pt2" type="number" inputmode="numeric" value="${p?p.base:''}"></label><label>المخزون<input id="pt4" type="number" value="${p?p.stock:''}"></label><label>الوصف<textarea id="pt5" rows="3">${esc(p?p.d:'')}</textarea></label><div class="mute" style="margin-bottom:6px">الصور (حتى 8، الأولى هي الرئيسية)</div><div id="pgrid">${imgsGrid()}</div><button class="btn" id="pgo" style="margin-top:14px">حفظ</button><button class="btn gh" data-c="1" style="margin-top:8px">إلغاء</button>`)}
async function doAddProd(){const t=$('#pt1').value.trim(),b=+$('#pt2').value,s=b,k=+$('#pt4').value;
 if(!t||!(b>=1)||!(k>=0))return toast('أكمل الاسم والسعر والمخزون','bad');
 const images=[];for(const m of S.pi)images.push(m.file?await upImg(m.file):m.url);
 const body={title:t,base_price:b,suggested_price:s,stock_qty:k,description:$('#pt5').value.trim(),images},edit=S.ep;
 if(edit)await api('PATCH','/products/'+edit,body);else await api('POST','/products',body);
 closeSheet();await refresh(edit?'تم حفظ التعديلات':'تمت الإضافة')}

/* ===== الصور: اختيار من المعرض، الصورة الشخصية، الهوية ===== */
const pickImages=multi=>new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;i.style.display='none';document.body.appendChild(i);i.onchange=()=>{res([...i.files]);i.remove()};i.addEventListener('cancel',()=>{res([]);i.remove()});i.click()});
const fileBlob=async(f,max,sq)=>toBlob(await shrink(f,max,sq));
const authImg=async id=>{const r=await fetch('/api/admin/files/'+id,{headers:{Authorization:'Bearer '+TOKEN}});if(!r.ok)throw new Error('تعذّر تحميل الصورة');return URL.createObjectURL(await r.blob())};
const photoV=()=>`<div style="padding:16px 4px;text-align:center">${logo(64)}<h2 style="margin:6px 0 4px">أضف صورتك الشخصية</h2><p class="mute" style="margin:0 0 14px">تساعد صورتك الإدارة على التعرف عليك.</p><div class="av" style="width:150px;height:150px;margin:0 auto 14px;font-size:64px">${S.pp?`<img src="${S.pp}" alt="">`:pic('bear-thumb',150)}</div><button class="btn dk" data-act="pickphoto">${ic('camera',18)} اختيار صورة من المعرض</button><button class="btn" id="phs" style="margin-top:10px;${S.pf?'':'opacity:.5'}">حفظ ومتابعة</button><button class="link" data-n="home" style="margin-top:10px">تخطي الآن</button></div>`;
async function doPhoto(){if(!S.pf)return toast('اختر صورة أولاً','bad');const fd=new FormData();fd.append('avatar',await fileBlob(S.pf,256,true),'a.jpg');await api('POST','/me/avatar',fd);S.pf=null;S.pp='';await boot(true);go('home');toast('تم حفظ صورتك','ok')}
async function doIdDocs(){if(!S.idf||!S.idb)return toast('اختر صورة وجه البطاقة وظهرها','bad');const fd=new FormData();fd.append('front',await fileBlob(S.idf,1400,false),'f.jpg');fd.append('back',await fileBlob(S.idb,1400,false),'b.jpg');await api('POST','/me/id-docs',fd);S.idf=S.idb=null;S.idfp=S.idbp='';await refresh('تم رفع الهوية، يمكنك الآن طلب السحب')}

/* ===== فحص اسم المستخدم مباشرة ===== */
let unT=null,unSeq=0;
const unMsg=h=>{const e=$('#ruS');if(e)e.innerHTML=h};
function unCheck(raw){
 clearTimeout(unT);S.unOk=null;const v=raw.trim().toLowerCase();
 if(!v)return unMsg('');
 if(!RX.u.test(v)){S.unOk=false;return unMsg(`<span style="color:var(--bad)">${ic('x',14)} من 3 إلى 20 حرفاً: a-z وأرقام و _ فقط</span>`)}
 unMsg('<span class="mute">جارٍ التحقق…</span>');
 const my=++unSeq;
 unT=setTimeout(async()=>{try{
  const d=await api('GET','/auth/username-check?u='+encodeURIComponent(v));if(my!==unSeq)return;
  if(d.available){S.unOk=true;unMsg(`<span style="color:var(--ok)">${ic('check',14)} اسم المستخدم متاح</span>`)}
  else{S.unOk=false;unMsg(`<span style="color:var(--bad)">${ic('x',14)} اسم المستخدم محجوز.</span>${d.suggestions&&d.suggestions.length?` <span class="mute">جرّب:</span> ${d.suggestions.map(x=>`<button class="tag" data-un="${esc(x)}" dir="ltr" style="border:0;cursor:pointer;color:var(--ac2)">${esc(x)}</button>`).join(' ')}`:''}`)}
 }catch(e){if(my===unSeq){S.unOk=null;unMsg('')}}},450)}

/* ===== الأحداث ===== */
document.addEventListener('click',e=>{const t=e.target,c=s=>t.closest(s);let x;
 if(t.id=='sheet'||c('[data-c]'))return closeSheet();
 if(c('[data-out]'))return confirmOut();
 if(x=c('[data-un]')){const i=$('#ru');i.value=x.dataset.un;unCheck(i.value);return}
 if(x=c('[data-g]')){S.scr=x.dataset.g;S.unOk=null;return render()}
 if(x=c('[data-wm]')){S.wa=($('#wa')||{}).value||'';S.wm=x.dataset.wm;return render()}
 if(x=c('[data-fav]'))return togFav(x.dataset.fav);
 if((x=c('[data-p]'))&&!c('#sheet'))return openProd(x.dataset.p);
 if(c('[data-back]'))return history.back();
 if(x=c('[data-buy]'))return openBuy();
 if(x=c('[data-copy]')){const p=pid(S.cp);if(p)copyTxt(x.dataset.copy=='n'?p.ct:p.d,x.dataset.copy=='n'?'تم نسخ الاسم':'تم نسخ الوصف');return}
 if(c('[data-more]')){const t=$('#dt'),m=$('#dmore');t.classList.toggle('open');m.textContent=t.classList.contains('open')?'إخفاء ▴':'عرض الوصف كاملاً ▾';return}
 if(x=c('[data-q]')){const i=$('#oq'),p=pid(S.cp);i.value=Math.min(p.stock,Math.max(1,(+i.value||1)+(+x.dataset.q)));sumUpd();return}
 if(x=c('[data-n]')){const k=x.dataset.n;return k=='out'?confirmOut():go(k)}
 if(x=c('[data-rs]'))return run(()=>sendCode(x.dataset.rs,S.fe));
 if(x=c('[data-pa]')){const[i,s]=x.dataset.pa.split(':');const ni=document.querySelector('[data-pn="'+i+'"]');return run(async()=>{await api('PATCH','/admin/payouts/'+i,{status:s,admin_note:ni?ni.value.trim():undefined});await refresh('تم التحديث')})}
 if(x=c('[data-onsave]')){const i=x.dataset.onsave,ni=document.querySelector('[data-on="'+i+'"]');return run(async()=>{await api('PATCH','/orders/'+i+'/note',{admin_note:ni?ni.value.trim():''});await refresh('تم حفظ الملاحظة')})}
 if(x=c('[data-dp]'))return run(async()=>{await api('DELETE','/products/'+x.dataset.dp);await refresh('تم الإخفاء')});
 if(c('[data-addp]'))return prodSheet();
 if(x=c('[data-ep]')){const p=pid(x.dataset.ep);if(p)prodSheet(p);return}
 if(x=c('[data-ri]')){S.pi.splice(+x.dataset.ri,1);$('#pgrid').innerHTML=imgsGrid();return}
 if(x=c('[data-idv]')){const[f,b]=x.dataset.idv.split(':');return run(async()=>{const[u1,u2]=await Promise.all([authImg(f),authImg(b)]);openSheet(`<h3>بطاقة الهوية</h3><img src="${u1}" alt="" style="width:100%;border-radius:14px;margin-bottom:10px"><img src="${u2}" alt="" style="width:100%;border-radius:14px"><button class="btn gh" data-c="1" style="margin-top:12px">إغلاق</button>`)})}
 if(x=c('[data-act]')){const a=x.dataset.act;return run(async()=>{
  if(a=='pickphoto'){const f=(await pickImages(false))[0];if(f){S.pf=f;S.pp=URL.createObjectURL(f);render()}}
  else if(a=='pickavatar'){const f=(await pickImages(false))[0];if(f)await doAvatar(f)}
  else if(a.startsWith('pickid:')){const k=a.split(':')[1],f=(await pickImages(false))[0];if(f){if(k=='front'){S.idf=f;S.idfp=URL.createObjectURL(f)}else{S.idb=f;S.idbp=URL.createObjectURL(f)}render()}}
  else if(a=='addimgs'){const fs=await pickImages(true);fs.slice(0,8-S.pi.length).forEach(f=>S.pi.push({file:f,prev:URL.createObjectURL(f)}));$('#pgrid').innerHTML=imgsGrid()}
 })}
 if(c('#cm'))return go('wallet');
 if(c('#tt')&&isAff())return go('profile');
 const id=(c('button[id]')||{}).id,A={cfo:logout,lgo:()=>run(doLogin),rgo:()=>run(doReg),ogo:()=>run(doOtp),ors:()=>run(async()=>{await api('POST','/auth/register/start',S.rd);toast('أُعيد إرسال الرمز','ok')}),
  fgo:()=>run(()=>sendCode('forgot',$('#fe').value.trim().toLowerCase(),'fcode')),fvo:()=>run(doVerifyReset),fro:()=>run(doReset),
  lcs:()=>run(()=>sendCode('login',$('#le').value.trim().toLowerCase(),'lverify')),lcv:()=>run(doLoginCode),
  chp:()=>run(doChp),sva:()=>run(doSaveAcct),wgo:()=>run(doPayout),ogo2:()=>run(doOrder),pgo:()=>run(doAddProd),phs:()=>run(doPhoto),ids:()=>run(doIdDocs)};
 if(A[id]){const b=c('button[id]');if(b.dataset.busy)return;b.dataset.busy=1;const h=b.innerHTML;b.disabled=true;b.textContent='جاري المعالجة…';
  Promise.resolve(A[id]()).finally(()=>{delete b.dataset.busy;b.disabled=false;b.innerHTML=h})}});
document.addEventListener('input',e=>{const i=e.target.id;
 if(i=='ru'){e.target.value=e.target.value.toLowerCase().replace(/\s/g,'');unCheck(e.target.value)}
 if(i=='q'){S.q=e.target.value;res()}
 if(['oq','op'].includes(i))sumUpd()});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id=='ow'){$('#ocw').innerHTML=communeField(t.value);sumUpd()}
 if(t.id=='od')sumUpd();
 if(t.id=='avf')run(()=>doAvatar(t.files[0]));
 if(t.id=='pshs')run(async()=>{try{await(t.checked?pushOn():pushOff())}catch(er){t.checked=!t.checked;throw er}});
 if(t.dataset.os)run(async()=>{const o=S.O.find(z=>z.id==t.dataset.os),b={status:t.value.toLowerCase()};{const ni=document.querySelector('[data-on="'+t.dataset.os+'"]');if(ni)b.admin_note=ni.value.trim()}if(t.value=='Delivered'&&o&&o.tot)b.amount_collected=+o.tot;await api('PATCH','/orders/'+t.dataset.os+'/status',b);await refresh('تم تحديث الحالة')})});

(async()=>{if(TOKEN){try{await boot()}catch(e){TOKEN=null;S.user=null;render()}}else render()})();
