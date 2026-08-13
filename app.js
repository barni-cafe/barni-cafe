// ===============================
// برني كافيه - منيو يعمل بالكامل
// ===============================

const products = [
  // القهوة الحارة
  { id: 1, category: "القهوة الحارة", name: "إسبريسو", desc: "قهوة إسبريسو مركزة", price: 1.500 },
  { id: 2, category: "القهوة الحارة", name: "لاتيه", desc: "إسبريسو مع حليب ناعم", price: 2.000 },
  { id: 3, category: "القهوة الحارة", name: "كابتشينو", desc: "إسبريسو وحليب ورغوة", price: 2.000 },
  { id: 4, category: "القهوة الحارة", name: "قهوة تركية", desc: "قهوة تركية على الطريقة التقليدية", price: 1.500 },
  { id: 5, category: "القهوة الحارة", name: "أمريكانو", desc: "إسبريسو مع ماء ساخن", price: 1.500 },

  // القهوة الباردة
  { id: 6, category: "القهوة الباردة", name: "آيس لاتيه", desc: "إسبريسو وحليب مع الثلج", price: 2.200 },
  { id: 7, category: "القهوة الباردة", name: "آيس أمريكانو", desc: "إسبريسو بارد مع الثلج", price: 1.800 },
  { id: 8, category: "القهوة الباردة", name: "كولد برو", desc: "قهوة مستخلصة على البارد", price: 2.500 },

  // الشاي
  { id: 9, category: "الشاي", name: "شاي أحمر", desc: "شاي كلاسيكي ساخن", price: 1.000 },
  { id: 10, category: "الشاي", name: "شاي كرك", desc: "شاي بالحليب والهيل", price: 1.200 },
  { id: 11, category: "الشاي", name: "شاي أخضر", desc: "شاي أخضر خفيف", price: 1.000 },

  // المشروبات
  { id: 12, category: "المشروبات", name: "موهيتو", desc: "مشروب منعش بالليمون والنعناع", price: 2.000 },
  { id: 13, category: "المشروبات", name: "ليمون بالنعناع", desc: "ليمون طازج مع النعناع", price: 1.800 },
  { id: 14, category: "المشروبات", name: "ماء", desc: "مياه معدنية", price: 0.300 },

  // الحلويات
  { id: 15, category: "الحلويات", name: "تشيز كيك", desc: "قطعة تشيز كيك كريمية", price: 2.200 },
  { id: 16, category: "الحلويات", name: "براوني", desc: "براوني شوكولاتة", price: 1.800 },
  { id: 17, category: "الحلويات", name: "كوكيز", desc: "كوكيز طازج بالشوكولاتة", price: 1.200 }
];

const categories = ["الكل", ...new Set(products.map(product => product.category))];

let currentCategory = "الكل";
let cart = [];

const categoriesElement = document.getElementById("categories");
const menuElement = document.getElementById("menu");
const cartItemsElement = document.getElementById("cartItems");
const cartCountElement = document.getElementById("cartCount");
const cartTotalElement = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");

function formatPrice(price) {
  return price.toFixed(3) + " ر.ع";
}

function renderCategories() {
  categoriesElement.innerHTML = categories.map(category => `
    <button
      type="button"
      class="category ${category === currentCategory ? "active" : ""}"
      data-category="${category}">
      ${category}
    </button>
  `).join("");

  document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
      currentCategory = button.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

function renderMenu() {
  const visibleProducts = currentCategory === "الكل"
    ? products
    : products.filter(product => product.category === currentCategory);

  if (visibleProducts.length === 0) {
    menuElement.innerHTML = `<p class="empty">ما فيه منتجات في هذا القسم حاليًا.</p>`;
    return;
  }

  menuElement.innerHTML = visibleProducts.map(product => `
    <article class="item">
      <div>
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
      </div>
      <div class="item-right">
        <div class="price">${formatPrice(product.price)}</div>
        <button type="button" class="add-btn" data-id="${product.id}">
          أضف للسلة
        </button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(productId, change) {
  const item = cart.find(product => product.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== productId);
  }

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsElement.innerHTML = `<p class="empty">السلة فاضية ☕</p>`;
  } else {
    cartItemsElement.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div class="cart-row-top">
          <strong>${item.name}</strong>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
        <small>${formatPrice(item.price)} للحبة</small>
        <div class="qty">
          <button type="button" data-action="minus" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join("");

    cartItemsElement.querySelectorAll("button").forEach(button => {
      const id = Number(button.dataset.id);
      const change = button.dataset.action === "plus" ? 1 : -1;
      button.addEventListener("click", () => changeQuantity(id, change));
    });
  }

  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCountElement.textContent = count;
  cartTotalElement.textContent = formatPrice(total);
}

clearCartButton.addEventListener("click", () => {
  cart = [];
  renderCart();
});
// ===============================
// نظام الطلبات - برني كافيه
// ===============================

const SUPABASE_URL = "https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";

let supabaseClient = null;

function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = () => {
      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );
      resolve();
    };
    script.onerror = () => reject(new Error("تعذر تحميل Supabase"));
    document.head.appendChild(script);
  });
}

function getCartTotal() {
  return cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
}

let orderSubmitting = false;

async function submitOrder() {
  // منع تكرار الطلب إذا تم الضغط على الزر أكثر من مرة
  if (orderSubmitting) return;

  orderSubmitting = true;
  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) checkoutButton.disabled = true;

  try {
    if (cart.length === 0) {
      alert("السلة فاضية ☕");
      return;
    }

    const tableNumber = prompt("اكتب رقم الطاولة:");
    if (!tableNumber || !tableNumber.trim()) return;

    const phone = prompt("اكتب رقم الجوال:");
    if (!phone || !phone.trim()) return;

    const notes = prompt("ملاحظات للطلب؟ (اختياري)") || "";

    if (!supabaseClient) {
      await loadSupabase();
    }

    const orderNumber = "BRN-" + Date.now().toString().slice(-6);

    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    }));

    const total = Number(getCartTotal().toFixed(3));

    const { error } = await supabaseClient
      .from("orders")
      .insert({
        order_number: orderNumber,
        table_number: tableNumber.trim(),
        phone: phone.trim(),
        items: items,
        total: total,
        status: "new",
        notes: notes.trim() || null
      });

    if (error) {
      console.error(error);
      alert("ما قدرنا نرسل الطلب. حاول مرة ثانية.");
      return;
    }

    alert("تم إرسال طلبك بنجاح ✅\\nرقم الطلب: " + orderNumber);
    cart = [];
    renderCart();
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء إرسال الطلب.");
  } finally {
    orderSubmitting = false;
    if (checkoutButton) checkoutButton.disabled = false;
  }
}

const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) checkoutButton.disabled = true;

  try {
    if (cart.length === 0) {
    alert("السلة فاضية ☕");
    return;
  }

  const tableNumber = prompt("اكتب رقم الطاولة:");
  if (!tableNumber || !tableNumber.trim()) return;

  const phone = prompt("اكتب رقم الجوال:");
  if (!phone || !phone.trim()) return;

  const notes = prompt("ملاحظات للطلب؟ (اختياري)") || "";

  try {
    if (!supabaseClient) {
      await loadSupabase();
    }

    const orderNumber = "BRN-" + Date.now().toString().slice(-6);

    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    }));

    const total = Number(getCartTotal().toFixed(3));

    const { error } = await supabaseClient
      .from("orders")
      .insert({
        order_number: orderNumber,
        table_number: tableNumber.trim(),
        phone: phone.trim(),
        items: items,
        total: total,
        status: "new",
        notes: notes.trim() || null
      });

    if (error) {
      console.error(error);
      alert("ما قدرنا نرسل الطلب. حاول مرة ثانية.");
      return;
    }

    alert("تم إرسال طلبك بنجاح ✅\nرقم الطلب: " + orderNumber);
    cart = [];
    renderCart();
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء إرسال الطلب.");
  }
}

const checkoutButton = document.getElementById("checkoutButton");
if (checkoutButton) {
  checkoutButton.addEventListener("click", submitOrder);
}

loadSupabase().catch(error => console.error("Supabase:", error));


// تشغيل الموقع
renderCategories();
renderMenu();
renderCart();
