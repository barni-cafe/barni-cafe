// ===============================
// برني كافيه - نظام الطلبات
// ===============================

// 1) بيانات مشروع Supabase
const SUPABASE_URL = "https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_KEY = "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";

// إنشاء اتصال Supabase
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ===============================
// المنيو
// ===============================

const menu = [
  {
    name: "إسبريسو",
    desc: "قهوة إسبريسو مركزة",
    price: 1.500
  },
  {
    name: "لاتيه",
    desc: "إسبريسو مع حليب ناعم",
    price: 2.000
  },
  {
    name: "كابتشينو",
    desc: "إسبريسو وحليب ورغوة",
    price: 2.000
  },
  {
    name: "قهوة تركية",
    desc: "قهوة تركية على الطريقة التقليدية",
    price: 1.500
  }
];


// ===============================
// السلة
// ===============================

let cart = [];


// ===============================
// عرض المنيو
// ===============================

const menuElement = document.getElementById("menu");

if (menuElement) {
  menuElement.innerHTML = menu.map((item, index) => `
    <div class="item">

      <div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>

      <div class="price">
        ${item.price.toFixed(3)} ر.ع
      </div>

      <button onclick="addToCart(${index})">
        إضافة
      </button>

    </div>
  `).join("");
}


// ===============================
// إضافة للسلة
// ===============================

function addToCart(index) {

  const item = menu[index];

  const existing = cart.find(
    product => product.name === item.name
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }

  updateCart();

  alert(`تمت إضافة ${item.name} للسلة ☕`);
}


// ===============================
// تحديث السلة
// ===============================

function updateCart() {

  const cartElement = document.getElementById("cart");

  if (!cartElement) return;

  if (cart.length === 0) {

    cartElement.innerHTML = `
      <p>السلة فارغة</p>
    `;

    return;
  }

  let total = 0;

  cartElement.innerHTML = cart.map((item, index) => {

    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    return `
      <div class="cart-item">

        <span>
          ${item.name}
        </span>

        <span>
          × ${item.quantity}
        </span>

        <span>
          ${itemTotal.toFixed(3)} ر.ع
        </span>

        <button onclick="removeFromCart(${index})">
          حذف
        </button>

      </div>
    `;

  }).join("");

  cartElement.innerHTML += `
    <hr>

    <h3>
      الإجمالي:
      ${total.toFixed(3)} ر.ع
    </h3>

    <button onclick="sendOrder()">
      إرسال الطلب
    </button>
  `;
}


// ===============================
// حذف من السلة
// ===============================

function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();
}


// ===============================
// إرسال الطلب إلى Supabase
// ===============================

async function sendOrder() {

  if (cart.length === 0) {

    alert("السلة فارغة 😅");

    return;
  }


  const customerName = prompt(
    "اكتب اسمك:"
  );

  if (!customerName) return;


  const customerPhone = prompt(
    "اكتب رقم هاتفك:"
  );

  if (!customerPhone) return;


  const total = cart.reduce(
    (sum, item) =>
      sum + (item.price * item.quantity),
    0
  );


  const orderItems = cart.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));


  const { data, error } = await supabaseClient
    .from("orders")
    .insert([
      {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: orderItems,
        total: total
      }
    ])
    .select();


  if (error) {

    console.error(error);

    alert(
      "صار خطأ في إرسال الطلب ❌\n" +
      error.message
    );

    return;
  }


  alert(
    "تم إرسال طلبك بنجاح ✅\n" +
    "برني كافيه يشكرك ☕"
  );


  cart = [];

  updateCart();
}


// ===============================
// تشغيل السلة
// ===============================

updateCart();
