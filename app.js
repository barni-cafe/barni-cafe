// ===============================
// برني كافيه - تجربة طلب كاملة
// ===============================

// شاشة افتتاحية برني
(function(){
  const splashStyle = document.createElement("style");

  splashStyle.textContent = `
    #barniSplash{
      position:fixed;
      inset:0;
      z-index:9999;
      background:#111315;
      display:grid;
      place-items:center;
      opacity:1;
      transition:opacity .7s ease;
    }

    #barniSplash .barniSplashLogo{
      color:#f8b700;
      font-family:"Cairo",Tahoma,Arial,sans-serif;
      font-size:clamp(58px,16vw,92px);
      font-weight:800;
      opacity:0;
      transform:scale(.96);
      animation:barniLogoIn .55s ease forwards;
    }

    @keyframes barniLogoIn{
      to{
        opacity:1;
        transform:scale(1);
      }
    }

    #barniSplash.hide{
      opacity:0;
      pointer-events:none;
    }
  `;

  document.head.appendChild(splashStyle);

  const splash = document.createElement("div");

  splash.id = "barniSplash";

  splash.innerHTML = `
    <div class="barniSplashLogo">برني</div>
  `;

  document.body.appendChild(splash);

  setTimeout(() => {
    splash.classList.add("hide");
  }, 1500);

  setTimeout(() => {
    splash.remove();
  }, 2250);
})();


const SUPABASE_URL = "https://yxojtouxwoztjwtmzbys.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";


const products = [
  {id:1,category:"القهوة الحارة",name:"إسبريسو",desc:"قهوة إسبريسو مركزة",price:1.500,icon:"☕"},
  {id:2,category:"القهوة الحارة",name:"لاتيه",desc:"إسبريسو مع حليب ناعم",price:2.000,icon:"🥛"},
  {id:3,category:"القهوة الحارة",name:"كابتشينو",desc:"إسبريسو وحليب ورغوة",price:2.000,icon:"☕"},
  {id:4,category:"القهوة الحارة",name:"قهوة تركية",desc:"قهوة تركية على الطريقة التقليدية",price:1.500,icon:"🫖"},
  {id:5,category:"القهوة الحارة",name:"أمريكانو",desc:"إسبريسو مع ماء ساخن",price:1.500,icon:"☕"},

  {id:6,category:"القهوة الباردة",name:"آيس لاتيه",desc:"إسبريسو وحليب مع الثلج",price:2.200,icon:"🧊"},
  {id:7,category:"القهوة الباردة",name:"آيس أمريكانو",desc:"إسبريسو بارد مع الثلج",price:1.800,icon:"🧊"},
  {id:8,category:"القهوة الباردة",name:"كولد برو",desc:"قهوة مستخلصة على البارد",price:2.500,icon:"🧊"},

  {id:9,category:"الشاي",name:"شاي أحمر",desc:"شاي كلاسيكي ساخن",price:1.000,icon:"🫖"},
  {id:10,category:"الشاي",name:"شاي كرك",desc:"شاي بالحليب والهيل",price:1.200,icon:"🫖"},
  {id:11,category:"الشاي",name:"شاي أخضر",desc:"شاي أخضر خفيف",price:1.000,icon:"🍵"},

  {id:12,category:"المشروبات",name:"موهيتو",desc:"ليمون ونعناع وانتعاش",price:2.000,icon:"🥤"},
  {id:13,category:"المشروبات",name:"ليمون بالنعناع",desc:"ليمون طازج مع النعناع",price:1.800,icon:"🍋"},
  {id:14,category:"المشروبات",name:"ماء",desc:"مياه معدنية",price:0.300,icon:"💧"},

  {id:15,category:"الحلويات",name:"تشيز كيك",desc:"قطعة كريمية ناعمة",price:2.200,icon:"🍰"},
  {id:16,category:"الحلويات",name:"براوني",desc:"براوني شوكولاتة",price:1.800,icon:"🍫"},
  {id:17,category:"الحلويات",name:"كوكيز",desc:"كوكيز طازج بالشوكولاتة",price:1.200,icon:"🍪"}
];


const categoryIcons = {
  "الكل":"▦",
  "القهوة الحارة":"☕",
  "القهوة الباردة":"🧊",
  "الشاي":"🍵",
  "المشروبات":"🥤",
  "الحلويات":"🍰"
};

const categories = ["الكل", ...new Set(products.map(p => p.category))];

let currentCategory = "القهوة الحارة";
let cart = [];
let orderMode = "cafe";
let supabaseClient = null;
let submitting = false;


const $ = id => document.getElementById(id);

const money = n => Number(n).toFixed(3) + " ر.ع";

const total = () => cart.reduce((s,i) => s + i.price * i.quantity, 0);


function renderCategories(){

  $("categories").innerHTML = categories.map(c => `
    <button
      class="category ${c === currentCategory ? 'active' : ''}"
      data-category="${c}"
    >
      <div class="category-icon">
        ${categoryIcons[c] || '•'}
      </div>

      <span>${c}</span>
    </button>
  `).join("");

  document.querySelectorAll(".category").forEach(b => {

    b.onclick = () => {

      currentCategory = b.dataset.category;

      renderCategories();

      renderMenu();

      window.scrollTo({
        top:120,
        behavior:"smooth"
      });

    };

  });

}


function renderMenu(){

  const visible =
    currentCategory === "الكل"
      ? products
      : products.filter(p => p.category === currentCategory);

  $("categoryTitle").textContent = currentCategory;

  $("menu").innerHTML = visible.map(p => `
    <article class="item">

      <div class="item-info">

        <h3>${p.name}</h3>

        <p>${p.desc}</p>

        <div class="price">
          ${money(p.price)}
        </div>

      </div>

      <div class="item-image">

        <div class="cup">
          ${p.icon}
        </div>

        <button
          class="add-btn"
          data-add="${p.id}"
          aria-label="إضافة ${p.name}"
        >
          +
        </button>

      </div>

    </article>
  `).join("");

  document.querySelectorAll("[data-add]").forEach(b => {

    b.onclick = e => {

      e.stopPropagation();

      add(Number(b.dataset.add));

    };

  });

}


function add(id){

  const p = products.find(x => x.id === id);

  if(!p) return;

  const old = cart.find(x => x.id === id);

  old
    ? old.quantity++
    : cart.push({...p, quantity:1});

  renderCart();

  toast(`تمت إضافة ${p.name} للسلة`);

}


function changeQty(id,d){

  const i = cart.find(x => x.id === id);

  if(!i) return;

  i.quantity += d;

  if(i.quantity < 1){
    cart = cart.filter(x => x.id !== id);
  }

  renderCart();

}


function renderCart(){

  const count =
    cart.reduce((s,i) => s + i.quantity, 0);

  const t = total();

  $("cartCount").textContent = count;

  $("cartTotal").textContent = money(t);

  $("sheetTotal").textContent = money(t);

  $("sheetGrandTotal").textContent = money(t);

  $("checkoutTotal").textContent = money(t);

  $("bottomCart").hidden = count === 0;


  $("cartItems").innerHTML = cart.length

    ? cart.map(i => `
      <div class="cart-row">

        <div>

          <strong>${i.name}</strong>

          <div class="qty">

            <button
              data-q="${i.id}"
              data-d="-1"
            >
              −
            </button>

            <span>${i.quantity}</span>

            <button
              data-q="${i.id}"
              data-d="1"
            >
              +
            </button>

          </div>

        </div>

        <span class="line-price">
          ${money(i.price * i.quantity)}
        </span>

      </div>
    `).join("")

    : `<div class="empty">السلة فاضية ☕</div>`;


  document.querySelectorAll("[data-q]").forEach(b => {

    b.onclick = () => {

      changeQty(
        Number(b.dataset.q),
        Number(b.dataset.d)
      );

    };

  });


  const rec = products
    .filter(p => !cart.some(i => i.id === p.id))
    .slice(0,4);


  $("suggestions").innerHTML = rec.map(p => `
    <button
      class="suggestion"
      data-add="${p.id}"
    >

      <div class="suggestion-image">
        ${p.icon}
      </div>

      <div class="suggestion-name">
        ${p.name}
      </div>

      <div class="suggestion-price">
        ${money(p.price)}
      </div>

    </button>
  `).join("");


  document
    .querySelectorAll(".suggestion[data-add]")
    .forEach(b => {

      b.onclick = () => {
        add(Number(b.dataset.add));
      };

    });

}


function openSheet(id){

  $("overlay").hidden = false;

  $(id).classList.add("open");

  $(id).setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";

}


function closeSheets(){

  document
    .querySelectorAll(".sheet.open")
    .forEach(s => {

      s.classList.remove("open");

      s.setAttribute(
        "aria-hidden",
        "true"
      );

    });

  $("overlay").hidden = true;

  document.body.style.overflow = "";

}


function showModeSheet(){

  document
    .querySelectorAll(".mode-option")
    .forEach(b => {

      b.classList.toggle(
        "selected",
        b.dataset.mode === orderMode
      );

    });

  openSheet("modeSheet");

}


function setMode(mode){

  orderMode = mode;

  $("modeLabel").textContent =
    mode === "car"
      ? "من السيارة"
      : "داخل المقهى";

  $("checkoutModeLabel").textContent =
    mode === "car"
      ? "من السيارة"
      : "داخل المقهى";

  $("pickupHint").textContent =
    mode === "car"
      ? "أضف بيانات سيارتك لنتعرف عليها عند الوصول"
      : "حدد رقم الطاولة بالأسفل";

  $("cafeFields").hidden = mode !== "cafe";

  $("carFields").hidden = mode !== "car";

  closeSheets();

}


async function loadSupabase(){

  if(supabaseClient) return;

  await new Promise((resolve,reject) => {

    const s = document.createElement("script");

    s.src =
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    s.onload = resolve;

    s.onerror = () =>
      reject(
        new Error("تعذر تحميل Supabase")
      );

    document.head.appendChild(s);

  });

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

}


function validate(){

  if(!cart.length){

    toast("السلة فاضية");

    return false;

  }


  const phone =
    $("phone").value.trim();

  if(!phone){

    toast("أدخل رقم الجوال");

    $("phone").focus();

    return false;

  }


  if(
    orderMode === "cafe" &&
    !$("tableNumber").value.trim()
  ){

    toast("أدخل رقم الطاولة");

    $("tableNumber").focus();

    return false;

  }


  if(orderMode === "car"){

    for(
      const id of [
        "plateNumber",
        "carType",
        "carColor"
      ]
    ){

      if(!$(`${id}`).value.trim()){

        toast("أكمل تفاصيل السيارة");

        $(`${id}`).focus();

        return false;

      }

    }

  }

  return true;

}


async function submitOrder(){

  if(
    submitting ||
    !validate()
  ) return;

  submitting = true;

  $("submitOrderButton").disabled = true;

  $("submitOrderButton").textContent =
    "جارٍ إرسال الطلب...";


  try{

    await loadSupabase();

    const orderNumber =
      "BRN-" +
      Date.now().toString().slice(-6);


    const vehicle =
      orderMode === "car"

        ? `طلب من السيارة | اللوحة: ${$("plateNumber").value.trim()} | السيارة: ${$("carType").value.trim()} | اللون: ${$("carColor").value.trim()}`

        : "طلب داخل المقهى";


    const noteParts = [
      vehicle,
      $("orderNotes").value.trim(),
      $("quickNote").value.trim()
    ].filter(Boolean);


    const items = cart.map(i => ({
      id:i.id,
      name:i.name,
      quantity:i.quantity,
      price:Number(i.price)
    }));


    const payload = {

      order_number:orderNumber,

      table_number:
        orderMode === "cafe"
          ? $("tableNumber").value.trim()
          : "سيارة",

      phone:$("phone").value.trim(),

      items,

      total:Number(
        total().toFixed(3)
      ),

      status:"new",

      notes:
        noteParts.join(" | ") || null

    };


    const {error} =
      await supabaseClient
        .from("orders")
        .insert(payload);


    if(error) throw error;


    closeSheets();

    $("successOrderNumber").textContent =
      orderNumber;


    $("successMeta").textContent =
      orderMode === "car"

        ? "طلب من السيارة • سيتم التعرف على سيارتك عند الوصول"

        : "طلب داخل المقهى • الطاولة " +
          $("tableNumber").value.trim();


    $("successModal").hidden = false;

    cart = [];

    renderCart();


  }catch(err){

    console.error(err);

    toast(
      "تعذر إرسال الطلب، حاول مرة ثانية"
    );

  }finally{

    submitting = false;

    $("submitOrderButton").disabled = false;

    $("submitOrderButton").textContent =
      "قم بتقديم الطلب";

  }

}


function toast(text){

  const t = $("toast");

  t.textContent = text;

  t.classList.add("show");

  clearTimeout(window._toast);

  window._toast = setTimeout(
    () => t.classList.remove("show"),
    2200
  );

}


$("modeButton").onclick =
  showModeSheet;


$("openCartButton").onclick =
  () => openSheet("cartSheet");


$("checkoutButton").onclick = () => {

  closeSheets();

  if(!cart.length){

    toast("السلة فاضية");

    return;

  }

  setMode(orderMode);

  openSheet("checkoutSheet");

};


$("submitOrderButton").onclick =
  submitOrder;


$("changeMode").onclick = () => {

  closeSheets();

  showModeSheet();

};


$("doneButton").onclick = () => {

  $("successModal").hidden = true;

};


$("overlay").onclick =
  closeSheets;


document
  .querySelectorAll("[data-close]")
  .forEach(b => {

    b.onclick = closeSheets;

  });


document
  .querySelectorAll(".mode-option")
  .forEach(b => {

    b.onclick = () =>
      setMode(b.dataset.mode);

  });


$("menuButton").onclick = () =>
  toast("القائمة الرئيسية قريبًا");


$("searchButton").onclick = () =>
  toast("البحث عن المنتجات قريبًا");


setMode("cafe");

renderCategories();

renderMenu();

renderCart();
