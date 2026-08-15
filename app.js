const SUPABASE_URL="https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";

const products=[
{id:1,cat:"القهوة الساخنة",name:"إسبريسو",en:"Espresso",desc:"قهوة إسبريسو مركزة",price:1.500,icon:"☕",code:"ESP"},
{id:2,cat:"القهوة الساخنة",name:"لاتيه",en:"Latte",desc:"إسبريسو مع حليب ناعم",price:2.000,icon:"🥛",code:"LAT"},
{id:3,cat:"القهوة الساخنة",name:"كابتشينو",en:"Cappuccino",desc:"إسبريسو وحليب ورغوة",price:2.000,icon:"☕",code:"CAP"},
{id:4,cat:"القهوة الساخنة",name:"قهوة تركية",en:"Turkish Coffee",desc:"قهوة تركية على الطريقة التقليدية",price:1.500,icon:"🫖",code:"TRK"},
{id:5,cat:"القهوة الساخنة",name:"أمريكانو",en:"Americano",desc:"إسبريسو مع ماء ساخن",price:1.500,icon:"☕",code:"AME"},
{id:6,cat:"القهوة الباردة",name:"آيس لاتيه",en:"Iced Latte",desc:"إسبريسو وحليب مع الثلج",price:2.200,icon:"🧊",code:"ICL"},
{id:7,cat:"القهوة الباردة",name:"آيس أمريكانو",en:"Iced Americano",desc:"إسبريسو بارد مع الثلج",price:1.800,icon:"🧊",code:"ICA"},
{id:8,cat:"القهوة الباردة",name:"كولد برو",en:"Cold Brew",desc:"قهوة مستخلصة على البارد",price:2.500,icon:"🧊",code:"CB"},
{id:9,cat:"الشاي",name:"شاي أحمر",en:"Black Tea",desc:"شاي كلاسيكي ساخن",price:1.000,icon:"🫖",code:"BT"},
{id:10,cat:"الشاي",name:"شاي كرك",en:"Karak Tea",desc:"شاي بالحليب والهيل",price:1.200,icon:"🫖",code:"KT"},
{id:11,cat:"الشاي",name:"شاي أخضر",en:"Green Tea",desc:"شاي أخضر خفيف",price:1.000,icon:"🍵",code:"GT"},
{id:12,cat:"المشروبات",name:"موهيتو",en:"Mojito",desc:"ليمون ونعناع وانتعاش",price:2.000,icon:"🥤",code:"MOJ"},
{id:13,cat:"المشروبات",name:"ليمون بالنعناع",en:"Mint Lemon",desc:"ليمون طازج مع النعناع",price:1.800,icon:"🍋",code:"ML"},
{id:14,cat:"المشروبات",name:"ماء",en:"Water",desc:"مياه معدنية",price:0.300,icon:"💧",code:"WTR"},
{id:15,cat:"الحلويات",name:"تشيز كيك",en:"Cheesecake",desc:"قطعة كريمية ناعمة",price:2.200,icon:"🍰",code:"CHK"},
{id:16,cat:"الحلويات",name:"براوني",en:"Brownie",desc:"براوني شوكولاتة",price:1.800,icon:"🍫",code:"BRW"},
{id:17,cat:"الحلويات",name:"كوكيز",en:"Cookies",desc:"كوكيز طازج بالشوكولاتة",price:1.200,icon:"🍪",code:"CK"}
];

let category="القهوة الساخنة",cart=[],table=6,submitting=false;
const $=id=>document.getElementById(id);
const money=n=>Number(n).toFixed(3)+" ر.ع";
const total=()=>cart.reduce((s,i)=>s+i.price*i.quantity,0);

function renderCats(){
  const cats=["القهوة الساخنة","القهوة الباردة","الشاي","المشروبات","الحلويات"];
  $("categories").innerHTML=cats.map(c=>`<button class="cat ${c===category?"active":""}" data-cat="${c}">${c}</button>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{category=b.dataset.cat;renderCats();renderProducts();});
}

function renderProducts(){
  const list=products.filter(p=>p.cat===category);
  $("products").innerHTML=list.map((p,i)=>`<article class="product">
    ${i===0&&category==="القهوة الساخنة"?'<span class="popular">الأكثر طلباً</span>':""}
    <div class="product-media">${p.icon}</div>
    <div class="product-info">
      <div class="product-name"><span>${p.name}</span><span class="product-en">${p.en}</span></div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">+</button></div>
    </div>
  </article>`).join("");
  document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(+b.dataset.add));
}

function add(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  const old=cart.find(x=>x.id===id);
  old?old.quantity++:cart.push({...p,quantity:1});
  renderCart();
}

function renderCart(){
  const c=cart.reduce((s,i)=>s+i.quantity,0);
  $("cartCount").textContent=c;
  $("cartTotal").textContent=money(total());
}

function renderReview(){
  $("reviewCount").textContent=cart.reduce((s,i)=>s+i.quantity,0);
  $("reviewTotal").textContent=money(total());
  $("chosenTable").textContent=table;
  $("reviewItems").innerHTML=cart.length?cart.map(i=>`<div class="review-item">
    <div class="thumb">${i.icon}</div>
    <div>
      <div class="review-name">${i.name}</div>
      <div class="review-desc">${i.desc}</div>
      <div class="qty"><button data-q="${i.id}" data-d="-1">−</button><span>${i.quantity}</span><button data-q="${i.id}" data-d="1">+</button></div>
    </div>
    <div class="review-price">${money(i.price*i.quantity)}</div>
  </div>`).join(""):`<div class="review-item"><div class="thumb">☕</div><div><div class="review-name">السلة فاضية</div><div class="review-desc">أضف منتجات من المنيو أولاً.</div></div></div>`;

  document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{
    const x=cart.find(i=>i.id===+b.dataset.q);
    if(!x)return;
    x.quantity+=+b.dataset.d;
    if(x.quantity<1)cart=cart.filter(i=>i.id!==x.id);
    renderCart();renderReview();
  });

  $("tables").innerHTML=[4,5,6,7,8,9].map(n=>`<button class="table-btn ${n===table?"active":""}" data-table="${n}">${n}</button>`).join("");
  document.querySelectorAll("[data-table]").forEach(b=>b.onclick=()=>{table=+b.dataset.table;renderReview();});
}

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo(0,0);
}

$("homeMenu").onclick=()=>show("menuScreen");
$("backHome").onclick=()=>show("home");
$("openReview").onclick=()=>{
  if(!cart.length){
    alert("السلة فاضية، أضف منتجاً من المنيو أولاً.");
    return;
  }
  renderReview();show("reviewScreen");
};
$("backMenu").onclick=()=>show("menuScreen");

$("submitOrder").onclick=async()=>{
  if(!cart.length)return;
  if(submitting)return;
  submitting=true;
  $("submitOrder").disabled=true;
  $("submitOrder").textContent="جارٍ الإرسال...";
  try{
    await new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    });
    const orderNumber="BRN-"+Date.now().toString().slice(-6);
    const payload={
      order_number:orderNumber,
      table_number:String(table),
      phone:"",
      items:cart.map(i=>({id:i.id,name:i.name,quantity:i.quantity,price:i.price})),
      total:Number(total().toFixed(3)),
      status:"new",
      notes:null
    };
    const {error}=await window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY).from("orders").insert(payload);
    if(error)throw error;
    $("successText").textContent=`رقم طلبك ${orderNumber} • الطاولة ${table}`;
    $("success").classList.remove("hidden");
    cart=[];renderCart();
  }catch(e){
    console.error(e);
    alert("تعذر إرسال الطلب، حاول مرة ثانية");
  }finally{
    submitting=false;
    $("submitOrder").disabled=false;
    $("submitOrder").textContent="إرسال الطلب";
  }
};

$("successDone").onclick=()=>{$("success").classList.add("hidden");show("home");};

renderCats();
renderProducts();
renderCart();
setTimeout(()=>$("splash").classList.add("hidden"),1800);
