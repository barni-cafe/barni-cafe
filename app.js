const SUPABASE_URL = "https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_KEY = "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";
const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

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
  {id:12,category:"المشروبات",name:"موهيتو",desc:"مشروب منعش بالليمون والنعناع",price:2.000,icon:"🍋"},
  {id:13,category:"المشروبات",name:"ليمون بالنعناع",desc:"ليمون طازج مع النعناع",price:1.800,icon:"🍋"},
  {id:14,category:"المشروبات",name:"ماء",desc:"مياه معدنية",price:0.300,icon:"💧"},
  {id:15,category:"الحلويات",name:"تشيز كيك",desc:"قطعة تشيز كيك كريمية",price:2.200,icon:"🍰"},
  {id:16,category:"الحلويات",name:"براوني",desc:"براوني شوكولاتة",price:1.800,icon:"🍫"},
  {id:17,category:"الحلويات",name:"كوكيز",desc:"كوكيز طازج بالشوكولاتة",price:1.200,icon:"🍪"}
];

const fmt = n => Number(n).toFixed(3)+" ر.ع";

let cart = JSON.parse(localStorage.getItem("barni_cart") || "[]");
let currentCategory = "الكل";
let orderMode = "cafe";
let lastOrder = JSON.parse(localStorage.getItem("barni_last_order") || "null");

const $ = s => document.querySelector(s);

const toast = msg => {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window._toast);
  window._toast = setTimeout(() => t.classList.remove("show"), 2200);
};

const saveCart = () =>
  localStorage.setItem("barni_cart", JSON.stringify(cart));

function renderCategories(){
  const cats = ["الكل", ...new Set(products.map(p => p.category))];

  $("#categories").innerHTML = cats.map(c =>
    `<button class="chip ${c === currentCategory ? "active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");

  document.querySelectorAll(".chip").forEach(b =>
    b.onclick = () => {
      currentCategory = b.dataset.cat;
      renderCategories();
      renderProducts();
    }
  );
}

function renderProducts(){
  const q = ($("#search")?.value || "").trim();

  const list = products.filter(p =>
    (currentCategory === "الكل" || p.category === currentCategory) &&
    (!q || `${p.name} ${p.desc}`.includes(q))
  );

  $("#products").innerHTML = list.length
    ? list.map(p => `
      <article class="product">
        <div>
          <div class="product-top">
            <div>
              <p class="eyebrow">${p.category}</p>
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
            </div>
            <div class="product-icon">${p.icon}</div>
          </div>
        </div>

        <div class="product-bottom">
          <span class="price">${fmt(p.price)}</span>
          <button class="add" data-add="${p.id}">أضف للسلة +</button>
        </div>
      </article>
    `).join("")
    : `<p class="empty">ما لقينا شيء بهذا الاسم.</p>`;

  document.querySelectorAll("[data-add]").forEach(b =>
    b.onclick = () => add(Number(b.dataset.add))
  );
}

function add(id){
  const p = products.find(x => x.id === id);
  const i = cart.find(x => x.id === id);

  i ? i.qty++ : cart.push({
    id:p.id,
    name:p.name,
    price:p.price,
    qty:1
  });

  saveCart();
  renderCart();
  toast(`تمت إضافة ${p.name} للسلة`);
}

function renderCart(){
  const count = cart.reduce((s,x) => s + x.qty, 0);
  const total = cart.reduce((s,x) => s + x.price * x.qty, 0);

  $("#cartBadge").textContent = count;
  $("#cartTotal").textContent = fmt(total);
  $("#checkoutTotal").textContent = fmt(total);

  $("#cartItems").innerHTML = cart.length
    ? cart.map(x => `
      <div class="cart-row">
        <div class="cart-row-top">
          <strong>${x.name}</strong>
          <span>${fmt(x.price * x.qty)}</span>
        </div>

        <small>${fmt(x.price)} للحبة</small>

        <div class="qty">
          <button data-minus="${x.id}">−</button>
          <span>${x.qty}</span>
          <button data-plus="${x.id}">+</button>
        </div>
      </div>
    `).join("")
    : `<p class="empty">السلة فاضية ☕</p>`;

  document.querySelectorAll("[data-minus]").forEach(b =>
    b.onclick = () => change(Number(b.dataset.minus), -1)
  );

  document.querySelectorAll("[data-plus]").forEach(b =>
    b.onclick = () => change(Number(b.dataset.plus), 1)
  );
}

function change(id,d){
  const i = cart.find(x => x.id === id);
  if(!i) return;

  i.qty += d;

  if(i.qty <= 0)
    cart = cart.filter(x => x.id !== id);

  saveCart();
  renderCart();
}

function openDrawer(){
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false");
}

function closeDrawer(){
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true");
}

function openCheckout(){
  if(!cart.length)
    return toast("أضف شيئًا للسلة أولاً");

  closeDrawer();
  $("#checkoutModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(id){
  $(id).hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close]").forEach(
  b => b.onclick = closeDrawer
);

$("#openCart").onclick = openDrawer;
$("#checkoutBtn").onclick = openCheckout;

$("#clearCart").onclick = () => {
  cart = [];
  saveCart();
  renderCart();
  toast("تم تفريغ السلة");
};

$("#search").oninput = renderProducts;

document.querySelectorAll(".mode").forEach(b =>
  b.onclick = () => {
    orderMode = b.dataset.mode;

    document.querySelectorAll(".mode")
      .forEach(x => x.classList.toggle("active", x === b));

    $("#cafeFields").hidden = orderMode !== "cafe";
    $("#carFields").hidden = orderMode !== "car";
  }
);

document.querySelectorAll("[data-close-checkout]")
  .forEach(b => b.onclick = () => closeModal("#checkoutModal"));

function cleanPhone(v){
  return String(v || "")
    .replace(/\s+/g,"")
    .replace(/[^\d+]/g,"");
}

function orderNumber(){
  return "BRN-" + Math.floor(100000 + Math.random() * 900000);
}

function itemsForDb(){
  return cart.map(x => ({
    id:x.id,
    name:x.name,
    quantity:x.qty,
    price:Number(x.price)
  }));
}

$("#checkoutForm").onsubmit = async e => {

  e.preventDefault();

  const phone = cleanPhone($("#phone").value);

  if(phone.length < 7)
    return toast("اكتب رقم جوال صحيح");

  if(orderMode === "cafe" && !$("#tableNumber").value.trim())
    return toast("اكتب رقم الطاولة");

  /*
    استلام من السيارة:
    لا نطلب رقم السيارة.
    يكفي وصف السيارة من النوع واللون.
  */
  if(
    orderMode === "car" &&
    (!$("#carType").value.trim() || !$("#carColor").value.trim())
  )
    return toast("كمل وصف السيارة");

  const btn = $("#submitOrder");

  btn.disabled = true;
  btn.textContent = "جاري إرسال الطلب…";

  const number = orderNumber();

  const total = cart.reduce(
    (s,x) => s + x.price * x.qty,
    0
  );

  const carDescription =
    orderMode === "car"
      ? `${$("#carType").value.trim()} - ${$("#carColor").value.trim()}`
      : null;

  const payload = {

    order_number:number,

    table_number:
      orderMode === "cafe"
        ? $("#tableNumber").value.trim()
        : null,

    phone,

    customer_name:
      $("#customerName").value.trim() || null,

    notes:
      $("#notes").value.trim() || null,

    pickup_mode:orderMode,

    /*
      ما عاد نستخدم رقم السيارة.
      العمود يبقى null.
    */
    plate_number:null,

    car_type:
      orderMode === "car"
        ? carDescription
        : null,

    car_color:
      orderMode === "car"
        ? $("#carColor").value.trim()
        : null,

    items:itemsForDb(),

    total:Number(total.toFixed(3)),

    status:"new"
  };

  try {

    if(!sb)
      throw new Error("Supabase unavailable");

    /*
      تسجيل دخول مجهول للعميل.
      هذا ضروري لأن سياسة orders عندك
      تعتمد على auth.uid().
    */

    let {
      data: {
        user
      }
    } = await sb.auth.getUser();

    if(!user){

      const {
        data,
        error:authError
      } = await sb.auth.signInAnonymously();

      if(authError)
        throw authError;

      user = data.user;
    }

    if(!user)
      throw new Error("لم يتم إنشاء مستخدم مجهول");

    /*
      إضافة user_id للطلب
      حتى تتوافق العملية مع RLS.
    */

    payload.user_id = user.id;

    const {
      error
    } = await sb
      .from("orders")
      .insert(payload);

    if(error)
      throw error;

    lastOrder = {
      order_number:number,
      phone,
      table_number:payload.table_number,
      total:payload.total
    };

    localStorage.setItem(
      "barni_last_order",
      JSON.stringify(lastOrder)
    );

    cart = [];

    saveCart();
    renderCart();

    closeModal("#checkoutModal");

    $("#successNumber").textContent = number;

    $("#successMeta").textContent =
      orderMode === "cafe"
        ? `الطاولة ${payload.table_number} · ${fmt(payload.total)}`
        : `استلام من السيارة · ${fmt(payload.total)}`;

    $("#successModal").hidden = false;

    document.body.style.overflow = "hidden";

  } catch(err) {

    console.error("SUPABASE ERROR:", err);

    toast(
      "خطأ: " +
      (err?.message || "خطأ غير معروف")
    );

  } finally {

    btn.disabled = false;
    btn.textContent = "تأكيد وإرسال الطلب";

  }

};

$("#goTrack").onclick = async () => {

  closeModal("#successModal");

  const orderNumberValue =
    lastOrder?.order_number ||
    $("#successNumber").textContent.trim();

  const phoneValue =
    lastOrder?.phone || "";

  $("#trackOrder").value = orderNumberValue;
  $("#trackPhone").value = phoneValue;

  location.hash = "#track";

  if(orderNumberValue && phoneValue){

    await trackOrder();

  } else {

    $("#trackResult").innerHTML = `
      <div class="track-result">
        تم إنشاء الطلب، لكن بيانات التتبع غير محفوظة في هذه الجلسة.
        استخدم رقم الطلب ورقم الجوال يدويًا.
      </div>
    `;

  }

};

$("#heroTrack").onclick = () => {
  location.hash = "#track";
  $("#trackOrder").focus();
};

async function trackOrder(){

  const num =
    $("#trackOrder").value
      .trim()
      .toUpperCase();

  const phone =
    cleanPhone($("#trackPhone").value);

  if(!num || !phone)
    return;

  $("#trackResult").innerHTML = `
    <div class="track-result">
      جاري البحث عن طلبك…
    </div>
  `;

  const {
    data,
    error
  } = await sb
    .from("orders")
    .select("*")
    .eq("order_number",num)
    .eq("phone",phone)
    .maybeSingle();

  if(error || !data){

    $("#trackResult").innerHTML = `
      <div class="track-result">
        ما حصلنا الطلب. تأكد من رقم الطلب ورقم الجوال.
      </div>
    `;

    return;
  }

  renderTrack(data);
}

function renderTrack(o){

  const map = {
    new:0,
    preparing:1,
    completed:2,
    received:0,
    ready:1,
    delivered:2
  };

  const idx = map[o.status] ?? 0;

  const labels = [
    "تم استلام طلبك",
    "قيد التحضير",
    "تم التسلم"
  ];

  $("#trackResult").innerHTML = `
    <div class="track-result">

      <div class="track-head">
        <div>
          <p class="eyebrow">
            ORDER ${o.order_number}
          </p>

          <h3>
            ${labels[idx]}
          </h3>
        </div>

        <span class="status-pill">
          ${labels[idx]}
        </span>
      </div>

      <div class="steps">

        ${labels.map((x,i) => `
          <div class="step ${i <= idx ? "active" : ""}">
            <span>${i + 1}</span>
            <div>${x}</div>
          </div>
        `).join("")}

      </div>

      <div class="track-meta">

        <div class="meta">
          <small>الطاولة</small>
          <strong>${o.table_number || "—"}</strong>
        </div>

        <div class="meta">
          <small>الجوال</small>
          <strong>${o.phone || "—"}</strong>
        </div>

        <div class="meta">
          <small>الإجمالي</small>
          <strong>${fmt(o.total || 0)}</strong>
        </div>

      </div>

      ${
        o.notes
          ? `
            <div class="meta" style="margin-top:8px">
              <small>الملاحظة</small>
              <strong>${escapeHtml(o.notes)}</strong>
            </div>
          `
          : ""
      }

    </div>
  `;
}

function escapeHtml(s){

  return String(s).replace(
    /[&<>"']/g,
    m => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[m])
  );

}

$("#trackForm").onsubmit = e => {
  e.preventDefault();
  trackOrder();
};

if(sb){

  sb.channel("barni-order-tracking")
    .on(
      "postgres_changes",
      {
        event:"UPDATE",
        schema:"public",
        table:"orders"
      },
      payload => {

        const o = payload.new;

        if(
          o.order_number ===
          $("#trackOrder").value
            .trim()
            .toUpperCase()
          &&
          cleanPhone(o.phone) ===
          cleanPhone($("#trackPhone").value)
        ){

          renderTrack(o);

        }

      }
    )
    .subscribe();

}

renderCategories();
renderProducts();
renderCart();

setTimeout(
  () => $("splash").classList.add("hidden"),
  1800
);
