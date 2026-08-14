const SUPABASE_URL="https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";

const products=[
  {id:1,cat:"القهوة الساخنة",name:"إسبريسو",en:"Espresso",desc:"مركز، غني، ومحضر من حبوب مختارة.",price:1.2,code:"ESP"},
  {id:2,cat:"القهوة الساخنة",name:"لاتيه برني",en:"Latte",desc:"إسبريسو ناعم مع حليب مخملي.",price:1.8,code:"LAT"},
  {id:3,cat:"القهوة الباردة",name:"كولد برو",en:"Cold Brew",desc:"بارد، منعش، بنكهة أعمق.",price:1.9,code:"CB"},
  {id:4,cat:"المشروبات",name:"ماء",en:"Water",desc:"ماء بارد ومنعش.",price:.3,code:"WTR"},
  {id:5,cat:"الحلويات",name:"كيك التمر",en:"Date Cake",desc:"كيكة تمر مع لمسة من التوابل العطرية.",price:1.5,code:"DATE"}
];

let category="القهوة الساخنة";
let cart=[];
let table=6;
let submitting=false;
let orderType="";
let customer={phone:"",carType:"",carColor:"",note:""};

const $=id=>document.getElementById(id);
const money=n=>Number(n).toFixed(3)+" ر.ع";
const total=()=>cart.reduce((s,i)=>s+i.price*i.quantity,0);
const cartCount=()=>cart.reduce((s,i)=>s+i.quantity,0);

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo({top:0,behavior:"instant"});
}

function renderCats(){
  const cats=["القهوة الساخنة","القهوة الباردة","المشروبات","الحلويات"];
  $("categories").innerHTML=cats.map(c=>`
    <button class="cat ${c===category?"active":""}" data-cat="${c}">${c}</button>
  `).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>{
    b.onclick=()=>{
      category=b.dataset.cat;
      renderCats();
      renderProducts();
    };
  });
}

function renderProducts(){
  const list=products.filter(p=>p.cat===category);
  $("products").innerHTML=list.map((p,i)=>`
    <article class="product">
      ${i===0&&category==="القهوة الساخنة"?'<span class="popular">الأكثر طلباً</span>':""}
      <div class="product-name"><span>${p.name}</span><span class="product-en">${p.en}</span></div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-bottom">
        <span class="price">${money(p.price)}</span>
        <button class="add" data-add="${p.id}">+</button>
      </div>
    </article>
  `).join("");
  document.querySelectorAll("[data-add]").forEach(b=>{
    b.onclick=()=>add(Number(b.dataset.add));
  });
}

function add(id){
  const p=products.find(x=>x.id===id);
  const old=cart.find(x=>x.id===id);
  if(old) old.quantity++;
  else cart.push({...p,quantity:1});
  renderCart();
}

function renderCart(){
  $("cartCount").textContent=cartCount();
  $("cartTotal").textContent=money(total());
}

function renderReview(){
  $("reviewItems").innerHTML=cart.map(i=>`
    <div class="review-item">
      <div>
        <div class="review-name">${i.name}</div>
        <div class="review-desc">${i.desc}</div>
        <div class="qty">
          <button data-q="${i.id}" data-d="-1">−</button>
          <span>${i.quantity}</span>
          <button data-q="${i.id}" data-d="1">+</button>
        </div>
      </div>
      <div class="review-price">${money(i.price*i.quantity)}</div>
    </div>
  `).join("");

  document.querySelectorAll("[data-q]").forEach(b=>{
    b.onclick=()=>{
      const x=cart.find(i=>i.id===Number(b.dataset.q));
      x.quantity+=Number(b.dataset.d);
      if(x.quantity<1) cart=cart.filter(i=>i.id!==x.id);
      renderCart();
      renderReview();
    };
  });

  $("reviewTotal").textContent=money(total());

  let html="";
  if(orderType==="car"){
    html+=info("طريقة الطلب","من السيارة");
    html+=info("رقم الجوال",customer.phone||"غير مضاف");
    html+=info("نوع السيارة",customer.carType||"غير مضاف");
    html+=info("لون السيارة",customer.carColor||"غير مضاف");
    html+=info("الملاحظة",customer.note||"لا توجد");
  }else{
    html+=info("طريقة الطلب","داخل المقهى");
    html+=info("رقم الطاولة",String(table));
  }
  $("orderInfoCard").innerHTML=html;
}

function info(label,value){
  return `<div class="info-row"><small>${label}</small><strong>${escapeHtml(value)}</strong></div>`;
}

function escapeHtml(v){
  return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function buildNotes(){
  const lines=[`طريقة الطلب: ${orderType==="car"?"من السيارة":"داخل المقهى"}`];
  if(orderType==="car"){
    lines.push(`نوع السيارة: ${customer.carType||"غير مضاف"}`);
    lines.push(`لون السيارة: ${customer.carColor||"غير مضاف"}`);
    if(customer.note) lines.push(`ملاحظة: ${customer.note}`);
  }
  return lines.join(" | ");
}

async function getSupabase(){
  if(window.supabase) return window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  await new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=resolve;
    s.onerror=reject;
    document.head.appendChild(s);
  });
  return window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
}

async function submitOrder(){
  if(!cart.length || submitting) return;
  submitting=true;
  $("submitOrder").disabled=true;
  $("submitOrder").textContent="جارٍ إرسال الطلب...";

  try{
    const client=await getSupabase();
    const orderNumber="BRN-"+Date.now().toString().slice(-6);
    const payload={
      order_number:orderNumber,
      table_number:orderType==="inside"?String(table):"CAR",
      phone:orderType==="car"?customer.phone:"",
      items:cart.map(i=>({id:i.id,name:i.name,quantity:i.quantity,price:i.price})),
      total:Number(total().toFixed(3)),
      status:"new",
      notes:buildNotes()
    };

    const {error}=await client.from("orders").insert(payload);
    if(error) throw error;

    const rows=[
      ["رقم الطلب",orderNumber],
      ["طريقة الطلب",orderType==="car"?"من السيارة":"داخل المقهى"]
    ];
    if(orderType==="car"){
      rows.push(["رقم الجوال",customer.phone||"غير مضاف"]);
      rows.push(["نوع السيارة",customer.carType||"غير مضاف"]);
      rows.push(["لون السيارة",customer.carColor||"غير مضاف"]);
      rows.push(["الملاحظة",customer.note||"لا توجد"]);
    }else{
      rows.push(["رقم الطاولة",String(table)]);
    }
    rows.push(["الإجمالي",money(total())]);

    $("successDetails").innerHTML=rows.map(r=>`
      <div class="success-row"><span>${r[0]}</span><strong>${escapeHtml(r[1])}</strong></div>
    `).join("");

    $("success").classList.remove("hidden");
    cart=[];
    renderCart();
  }catch(e){
    console.error(e);
    alert("تعذر إرسال الطلب. تأكد من اتصال Supabase ثم حاول مرة ثانية.");
  }finally{
    submitting=false;
    $("submitOrder").disabled=false;
    $("submitOrder").textContent="إرسال الطلب";
  }
}

function resetOrder(){
  orderType="";
  customer={phone:"",carType:"",carColor:"",note:""};
  cart=[];
  table=6;
  renderCart();
}

document.addEventListener("DOMContentLoaded",()=>{
  renderCats();
  renderProducts();
  renderCart();

  setTimeout(()=>{$("splash")?.classList.add("hidden")},1800);

  $("homeMenu").onclick=()=>show("orderChoice");
  $("heroMenu").onclick=()=>show("orderChoice");

  document.querySelectorAll("[data-order-type]").forEach(b=>{
    b.onclick=()=>{
      orderType=b.dataset.orderType;
      if(orderType==="car") show("carInfo");
      else show("menuScreen");
    };
  });

  $("carContinue").onclick=()=>{
    customer.phone=$("carPhone").value.trim();
    customer.carType=$("carType").value.trim();
    customer.carColor=$("carColor").value.trim();
    customer.note=$("carNote").value.trim();
    if(!customer.phone||!customer.carType||!customer.carColor){
      alert("اكتب رقم الجوال ونوع السيارة واللون أولاً.");
      return;
    }
    show("menuScreen");
  };

  document.querySelectorAll("[data-back]").forEach(b=>{
    b.onclick=()=>show(b.dataset.back);
  });

  $("backHome").onclick=()=>show("home");
  $("changeOrder").onclick=()=>{
    resetOrder();
    show("orderChoice");
  };
  $("backMenu").onclick=()=>show("menuScreen");

  $("openReview").onclick=()=>{
    if(!cart.length){
      alert("أضف صنف واحد على الأقل قبل مراجعة الطلب.");
      return;
    }
    renderReview();
    show("reviewScreen");
  };

  $("submitOrder").onclick=submitOrder;

  $("successDone").onclick=()=>{
    $("success").classList.add("hidden");
    resetOrder();
    show("home");
  };

  $("tableTop").onclick=()=>{
    if(orderType==="inside"){
      alert("رقم الطاولة يتم اختياره داخل مراجعة الطلب.");
    }else{
      show("orderChoice");
    }
  };
});
