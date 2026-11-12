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
