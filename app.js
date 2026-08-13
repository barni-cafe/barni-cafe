// ===============================
// برني كافيه - نظام الطلبات
// ===============================

const SUPABASE_URL = "https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_KEY = "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";


// ===============================
// تحميل Supabase تلقائيًا
// ===============================

function loadSupabase() {
  return new Promise((resolve, reject) => {

    if (window.supabase) {
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = resolve;

    script.onerror = () => {
      reject(new Error("تعذر تحميل Supabase"));
    };

    document.head.appendChild(script);
  });
}


// ===============================
// المنيو
// ===============================

const menu = [

  {
    name: "إسبريسو",
    desc: "قهوة إسبريسو مركزة",
    price: 1.500,
    category: "قهوة حارة"
  },

  {
    name: "لاتيه",
    desc: "إسبريسو مع حليب ناعم",
    price: 2.000,
    category: "قهوة حارة"
  },

  {
    name: "كابتشينو",
    desc: "إسبريسو وحليب ورغوة",
    price: 2.000,
    category: "قهوة حارة"
  },

  {
    name: "قهوة تركية",
    desc: "قهوة تركية على الطريقة التقليدية",
    price: 1.500,
    category: "قهوة حارة"
  },

  {
    name: "آيس لاتيه",
    desc: "إسبريسو وحليب بارد مع الثلج",
    price: 2.000,
    category: "قهوة باردة"
  },

  {
    name: "كولد برو",
    desc: "قهوة باردة محضرة ببطء",
    price: 2.200,
    category: "قهوة باردة"
  },

  {
    name: "موهيتو",
    desc: "مشروب منعش بالنعناع والليمون",
    price: 1.500,
    category: "موهيتو"
  },

  {
    name: "شاي",
    desc: "شاي ساخن",
    price: 1.000,
    category: "شاي"
  },

  {
    name: "كيكة شوكولاتة",
    desc: "قطعة كيكة شوكولاتة",
    price: 1.800,
    category: "حلويات"
  }

];


// ===============================
// السلة
// ===============================

let cart = [];


// ===============================
// رقم الطلب
// ===============================

function generateOrderNumber() {

  return "BRN-" +
    Date.now().toString().slice(-6);

}


// ===============================
// عرض المنيو
// ===============================

const menuElement =
  document.getElementById("menu");

let currentCategory = "عرض الكل";


function renderMenu() {

  if (!menuElement) return;

  const filteredMenu =
    currentCategory === "عرض الكل"
      ? menu
      : menu.filter(
          item => item.category === currentCategory
        );


  menuElement.innerHTML = filteredMenu.map(item => {

    const index = menu.indexOf(item);

    return `
      <div class="item">

        <div class="item-info">

          <div class="item-name">
            ${item.name}
          </div>

          <div style="
            color:#777;
            font-size:14px;
            margin-bottom:18px;
          ">
            ${item.desc}
          </div>

          <div class="price">
            ${item.price.toFixed(3)} ر.ع
          </div>

        </div>

        <button
          class="add"
          data-index="${index}"
          aria-label="إضافة ${item.name}"
        >
          +
        </button>

      </div>
    `;

  }).join("");


  document.querySelectorAll(".add")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.index);

        addToCart(index);

      });

    });

}


// ===============================
// التصنيفات
// ===============================

function setupCategories() {

  document
    .querySelectorAll(".category")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll(".category")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        currentCategory =
          button.textContent.trim();

        renderMenu();

      });

    });

}


// ===============================
// إضافة للسلة
// ===============================

function addToCart(index) {

  const item = menu[index];

  const existing =
    cart.find(product =>
      product.name === item.name
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

}


// ===============================
// حساب الإجمالي
// ===============================

function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

}


// ===============================
// عدد المنتجات
// ===============================

function getCartCount() {

  return cart.reduce(
    (count, item) =>
      count + item.quantity,
    0
  );

}


// ===============================
// إنشاء زر السلة
// ===============================

function createCartBar() {

  let cartBar =
    document.getElementById("barni-cart-bar");

  if (cartBar) return;


  cartBar =
    document.createElement("button");

  cartBar.id =
    "barni-cart-bar";

  cartBar.style.cssText = `
    position:fixed;
    bottom:15px;
    left:15px;
    right:15px;
    max-width:720px;
    margin:auto;
    background:#d7a34a;
    color:white;
    border:0;
    border-radius:22px;
    padding:18px 25px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-size:18px;
    font-weight:bold;
    box-shadow:0 5px 20px rgba(0,0,0,.18);
    z-index:1000;
    cursor:pointer;
  `;


  cartBar.addEventListener(
    "click",
    openCart
  );


  document.body.appendChild(cartBar);

}


// ===============================
// تحديث زر السلة
// ===============================

function updateCartBar() {

  const cartBar =
    document.getElementById("barni-cart-bar");

  if (!cartBar) return;


  const count =
    getCartCount();

  const total =
    getCartTotal();


  cartBar.innerHTML = `
    <span>🛍️ السلة (${count})</span>
    <span>${total.toFixed(3)} ر.ع　›</span>
  `;

}


// ===============================
// نافذة السلة
// ===============================

function createCartModal() {

  if (
    document.getElementById(
      "barni-cart-modal"
    )
  ) return;


  const modal =
    document.createElement("div");

  modal.id =
    "barni-cart-modal";


  modal.style.cssText = `
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    z-index:2000;
    padding:20px;
    align-items:flex-end;
    justify-content:center;
  `;


  modal.innerHTML = `

    <div style="
      background:white;
      width:100%;
      max-width:600px;
      max-height:85vh;
      overflow:auto;
      border-radius:25px 25px 0 0;
      padding:25px;
      direction:rtl;
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
      ">

        <h2 style="margin:0">
          طلبك 🛍️
        </h2>

        <button
          id="close-cart"
          style="
            border:0;
            background:#eee;
            width:42px;
            height:42px;
            border-radius:50%;
            font-size:22px;
            cursor:pointer;
          "
        >
          ×
        </button>

      </div>

      <div id="cart-items"></div>

      <div id="cart-total"></div>

      <button
        id="checkout-button"
        style="
          width:100%;
          border:0;
          background:#d7a34a;
          color:white;
          padding:17px;
          border-radius:15px;
          font-size:18px;
          font-weight:bold;
          cursor:pointer;
          margin-top:15px;
        "
      >
        تنفيذ الطلب
      </button>

    </div>
  `;


  document.body.appendChild(modal);


  document
    .getElementById("close-cart")
    .addEventListener(
      "click",
      closeCart
    );


  document
    .getElementById("checkout-button")
    .addEventListener(
      "click",
      sendOrder
    );


  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {
        closeCart();
      }

    }
  );

}


// ===============================
// فتح السلة
// ===============================

function openCart() {

  createCartModal();

  const modal =
    document.getElementById(
      "barni-cart-modal"
    );


  modal.style.display =
    "flex";


  renderCart();

}


// ===============================
// إغلاق السلة
// ===============================

function closeCart() {

  const modal =
    document.getElementById(
      "barni-cart-modal"
    );


  if (modal) {
    modal.style.display =
      "none";
  }

}


// ===============================
// عرض محتوى السلة
// ===============================

function renderCart() {

  const itemsElement =
    document.getElementById(
      "cart-items"
    );

  const totalElement =
    document.getElementById(
      "cart-total"
    );


  if (!itemsElement) return;


  if (cart.length === 0) {

    itemsElement.innerHTML = `
      <div style="
        text-align:center;
        padding:40px 10px;
        color:#777;
      ">
        السلة فارغة 🛍️
      </div>
    `;

    totalElement.innerHTML = "";

    return;

  }


  itemsElement.innerHTML =
    cart.map((item, index) => {

      const itemTotal =
        item.price * item.quantity;


      return `

        <div style="
          border-bottom:1px solid #eee;
          padding:15px 0;
        ">

          <div style="
            display:flex;
            justify-content:space-between;
            gap:10px;
          ">

            <strong>
              ${item.name}
            </strong>

            <strong>
              ${itemTotal.toFixed(3)} ر.ع
            </strong>

          </div>


          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-top:12px;
          ">

            <button
              class="quantity-button"
              data-action="minus"
              data-index="${index}"
            >
              −
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              class="quantity-button"
              data-action="plus"
              data-index="${index}"
            >
              +
            </button>

            <button
              class="delete-button"
              data-index="${index}"
              style="
                margin-right:auto;
                border:0;
                background:#f5eeee;
                color:#b33;
                padding:9px 14px;
                border-radius:10px;
                cursor:pointer;
              "
            >
              حذف
            </button>

          </div>

        </div>

      `;

    }).join("");


  const total =
    getCartTotal();


  totalElement.innerHTML = `

    <div style="
      display:flex;
      justify-content:space-between;
      font-size:20px;
      font-weight:bold;
      padding-top:20px;
    ">

      <span>الإجمالي</span>

      <span>
        ${total.toFixed(3)} ر.ع
      </span>

    </div>

  `;


  document
    .querySelectorAll(".quantity-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(button.dataset.index);

          const action =
            button.dataset.action;


          if (action === "plus") {

            cart[index].quantity++;

          }


          if (action === "minus") {

            cart[index].quantity--;

            if (
              cart[index].quantity <= 0
            ) {
              cart.splice(index, 1);
            }

          }


          updateCart();

          renderCart();

        }
      );

    });


  document
    .querySelectorAll(".delete-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(button.dataset.index);

          cart.splice(index, 1);

          updateCart();

          renderCart();

        }
      );

    });

}


// ===============================
// تحديث كل شيء
// ===============================

function updateCart() {

  updateCartBar();

  renderCart();

}


// ===============================
// إرسال الطلب
// ===============================

async function sendOrder() {

  if (cart.length === 0) {

    alert("السلة فارغة 😅");

    return;

  }


  const customerName =
    prompt("اكتب اسمك:");


  if (!customerName) return;


  const customerPhone =
    prompt("اكتب رقم هاتفك:");


  if (!customerPhone) return;


  const total =
    getCartTotal();


  const orderItems =
    cart.map(item => ({

      name: item.name,
      price: item.price,
      quantity: item.quantity

    }));


  const orderNumber =
    generateOrderNumber();


  try {

    await loadSupabase();


    const supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );


    const { data, error } =
      await supabaseClient
        .from("orders")
        .insert([
          {
            customer_name:
              customerName,

            customer_phone:
              customerPhone,

            items:
              orderItems,

            total:
              total
          }
        ])
        .select();


    if (error) {

      console.error(error);

      alert(
        "صار خطأ في إرسال الطلب ❌\n\n" +
        error.message
      );

      return;

    }


    const realOrderId =
      data &&
      data[0] &&
      data[0].id
        ? data[0].id
        : orderNumber;


    showOrderSuccess(
      realOrderId,
      customerName,
      orderItems,
      total
    );


    cart = [];

    updateCart();

  }

  catch (error) {

    console.error(error);

    alert(
      "تعذر الاتصال بالخادم ❌"
    );

  }

}


// ===============================
// شاشة نجاح الطلب
// ===============================

function showOrderSuccess(
  orderNumber,
  customerName,
  items,
  total
) {

  const modal =
    document.getElementById(
      "barni-cart-modal"
    );


  if (!modal) return;


  const itemsHtml =
    items.map(item => `

      <div style="
        display:flex;
        justify-content:space-between;
        padding:10px 0;
        border-bottom:1px solid #eee;
      ">

        <span>
          ${item.name} × ${item.quantity}
        </span>

        <strong>
          ${(item.price * item.quantity).toFixed(3)}
          ر.ع
        </strong>

      </div>

    `).join("");


  modal.innerHTML = `

    <div style="
      background:white;
      width:100%;
      max-width:600px;
      max-height:85vh;
      overflow:auto;
      border-radius:25px;
      padding:30px;
      direction:rtl;
      text-align:right;
    ">

      <div style="
        text-align:center;
        font-size:55px;
      ">
        ✅
      </div>

      <h2 style="
        text-align:center;
        margin-bottom:5px;
      ">
        تم تنفيذ طلبك
      </h2>

      <p style="
        text-align:center;
        color:#777;
      ">
        شكرًا لك يا ${customerName} ☕
      </p>

      <div style="
        background:#fff8e9;
        padding:15px;
        border-radius:15px;
        text-align:center;
        margin:20px 0;
      ">

        <div style="
          color:#777;
          font-size:14px;
        ">
          رقم الطلب
        </div>

        <strong style="
          font-size:24px;
        ">
          ${orderNumber}
        </strong>

      </div>

      <h3>
        تفاصيل الطلب
      </h3>

      ${itemsHtml}

      <div style="
        display:flex;
        justify-content:space-between;
        font-size:20px;
        font-weight:bold;
        padding:20px 0;
      ">

        <span>
          الإجمالي
        </span>

        <span>
          ${total.toFixed(3)} ر.ع
        </span>

      </div>

      <button
        id="success-close"
        style="
          width:100%;
          border:0;
          background:#d7a34a;
          color:white;
          padding:17px;
          border-radius:15px;
          font-size:18px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        تم
      </button>

    </div>
  `;


  modal.style.display =
    "flex";


  document
    .getElementById("success-close")
    .addEventListener(
      "click",
      closeCart
    );

}


// ===============================
// تشغيل الموقع
// ===============================

createCartBar();

createCartModal();

renderMenu();

setupCategories();

updateCart();
