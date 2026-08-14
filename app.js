// ========================================
// برني كافيه - النظام النظيف
// ========================================

const SUPABASE_URL =
  "https://yxojtouxwoztjwtmzbys.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";


// ========================================
// المنتجات
// ========================================

const products = [

  {
    id: 1,
    category: "القهوة الحارة",
    name: "إسبريسو",
    desc: "قهوة إسبريسو مركزة",
    price: 1.500,
    icon: "☕"
  },

  {
    id: 2,
    category: "القهوة الحارة",
    name: "لاتيه",
    desc: "إسبريسو مع حليب ناعم",
    price: 2.000,
    icon: "🥛"
  },

  {
    id: 3,
    category: "القهوة الحارة",
    name: "كابتشينو",
    desc: "إسبريسو وحليب ورغوة",
    price: 2.000,
    icon: "☕"
  },

  {
    id: 4,
    category: "القهوة الحارة",
    name: "قهوة تركية",
    desc: "قهوة تركية على الطريقة التقليدية",
    price: 1.500,
    icon: "🫖"
  },

  {
    id: 5,
    category: "القهوة الحارة",
    name: "أمريكانو",
    desc: "إسبريسو مع ماء ساخن",
    price: 1.500,
    icon: "☕"
  },

  {
    id: 6,
    category: "القهوة الباردة",
    name: "آيس لاتيه",
    desc: "إسبريسو وحليب مع الثلج",
    price: 2.200,
    icon: "🧊"
  },

  {
    id: 7,
    category: "القهوة الباردة",
    name: "آيس أمريكانو",
    desc: "إسبريسو بارد مع الثلج",
    price: 1.800,
    icon: "🧊"
  },

  {
    id: 8,
    category: "القهوة الباردة",
    name: "كولد برو",
    desc: "قهوة مستخلصة على البارد",
    price: 2.500,
    icon: "🧊"
  },

  {
    id: 9,
    category: "الشاي",
    name: "شاي أحمر",
    desc: "شاي كلاسيكي ساخن",
    price: 1.000,
    icon: "🫖"
  },

  {
    id: 10,
    category: "الشاي",
    name: "شاي كرك",
    desc: "شاي بالحليب والهيل",
    price: 1.200,
    icon: "🫖"
  },

  {
    id: 11,
    category: "الشاي",
    name: "شاي أخضر",
    desc: "شاي أخضر خفيف",
    price: 1.000,
    icon: "🍵"
  },

  {
    id: 12,
    category: "المشروبات",
    name: "موهيتو",
    desc: "ليمون ونعناع وانتعاش",
    price: 2.000,
    icon: "🥤"
  },

  {
    id: 13,
    category: "المشروبات",
    name: "ليمون بالنعناع",
    desc: "ليمون طازج مع النعناع",
    price: 1.800,
    icon: "🍋"
  },

  {
    id: 14,
    category: "المشروبات",
    name: "ماء",
    desc: "مياه معدنية",
    price: 0.300,
    icon: "💧"
  },

  {
    id: 15,
    category: "الحلويات",
    name: "تشيز كيك",
    desc: "قطعة كريمية ناعمة",
    price: 2.200,
    icon: "🍰"
  },

  {
    id: 16,
    category: "الحلويات",
    name: "براوني",
    desc: "براوني شوكولاتة",
    price: 1.800,
    icon: "🍫"
  },

  {
    id: 17,
    category: "الحلويات",
    name: "كوكيز",
    desc: "كوكيز طازج بالشوكولاتة",
    price: 1.200,
    icon: "🍪"
  }

];


// ========================================
// الحالة
// ========================================

const categories = [
  "الكل",
  ...new Set(
    products.map(p => p.category)
  )
];

const categoryIcons = {
  "الكل": "▦",
  "القهوة الحارة": "☕",
  "القهوة الباردة": "🧊",
  "الشاي": "🍵",
  "المشروبات": "🥤",
  "الحلويات": "🍰"
};

let currentCategory = "القهوة الحارة";
let cart = [];
let orderMode = "cafe";
let supabaseClient = null;
let submitting = false;


// ========================================
// أدوات
// ========================================

const $ = id =>
  document.getElementById(id);

const money = value =>
  Number(value).toFixed(3) + " ر.ع";

const total = () =>
  cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


// ========================================
// التصنيفات
// ========================================

function renderCategories() {

  const element =
    $("categories");

  if (!element) return;

  element.innerHTML =
    categories.map(category => `

      <button
        class="category ${
          category === currentCategory
            ? "active"
            : ""
        }"
        data-category="${category}"
        type="button"
      >

        <div class="category-icon">
          ${categoryIcons[category] || "•"}
        </div>

        <span>
          ${category}
        </span>

      </button>

    `).join("");


  document
    .querySelectorAll(".category")
    .forEach(button => {

      button.onclick = () => {

        currentCategory =
          button.dataset.category;

        renderCategories();
        renderMenu();

      };

    });

}


// ========================================
// المنيو
// ========================================

function renderMenu() {

  const menu =
    $("menu");

  if (!menu) return;

  const visible =
    currentCategory === "الكل"
      ? products
      : products.filter(
          p =>
            p.category ===
            currentCategory
        );


  if ($("categoryTitle")) {

    $("categoryTitle")
      .textContent =
      currentCategory;

  }


  menu.innerHTML =
    visible.map(product => `

      <article class="item">

        <div class="item-info">

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.desc}
          </p>

          <div class="price">
            ${money(product.price)}
          </div>

        </div>

        <div class="item-image">

          <div class="cup">
            ${product.icon}
          </div>

          <button
            class="add-btn"
            data-add="${product.id}"
            type="button"
          >
            +
          </button>

        </div>

      </article>

    `).join("");


  document
    .querySelectorAll("[data-add]")
    .forEach(button => {

      button.onclick = () => {

        add(
          Number(
            button.dataset.add
          )
        );

      };

    });

}


// ========================================
// إضافة للسلة
// ========================================

function add(id) {

  const product =
    products.find(
      p => p.id === id
    );

  if (!product) return;


  const existing =
    cart.find(
      item => item.id === id
    );


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({

      ...product,
      quantity: 1

    });

  }


  renderCart();

  toast(
    `تمت إضافة ${product.name} للسلة`
  );

}


// ========================================
// تغيير الكمية
// ========================================

function changeQty(id, difference) {

  const item =
    cart.find(
      product => product.id === id
    );

  if (!item) return;


  item.quantity +=
    difference;


  if (item.quantity < 1) {

    cart =
      cart.filter(
        product =>
          product.id !== id
      );

  }


  renderCart();

}


// ========================================
// السلة
// ========================================

function renderCart() {

  const count =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const cartCount =
    $("cartCount");

  const cartTotal =
    $("cartTotal");


  if (cartCount) {

    cartCount.textContent =
      count;

  }


  if (cartTotal) {

    cartTotal.textContent =
      money(total());

  }


  const bottomCart =
    $("bottomCart");

  if (bottomCart) {

    bottomCart.hidden =
      count === 0;

  }


  const cartItems =
    $("cartItems");

  if (cartItems) {

    cartItems.innerHTML =
      cart.length

        ? cart.map(item => `

            <div class="cart-row">

              <div>

                <strong>
                  ${item.name}
                </strong>

                <div class="qty">

                  <button
                    data-q="${item.id}"
                    data-d="-1"
                    type="button"
                  >
                    −
                  </button>

                  <span>
                    ${item.quantity}
                  </span>

                  <button
                    data-q="${item.id}"
                    data-d="1"
                    type="button"
                  >
                    +
                  </button>

                </div>

              </div>

              <span class="line-price">
                ${money(
                  item.price *
                  item.quantity
                )}
              </span>

            </div>

          `).join("")

        : `
          <div class="empty">
            السلة فاضية ☕
          </div>
        `;

  }


  document
    .querySelectorAll("[data-q]")
    .forEach(button => {

      button.onclick = () => {

        changeQty(
          Number(
            button.dataset.q
          ),
          Number(
            button.dataset.d
          )
        );

      };

    });


  updateTotals();

}


// ========================================
// الإجماليات
// ========================================

function updateTotals() {

  const value =
    money(total());


  [
    "sheetTotal",
    "sheetGrandTotal",
    "checkoutTotal"
  ].forEach(id => {

    if ($(id)) {

      $(id).textContent =
        value;

    }

  });

}


// ========================================
// النوافذ
// ========================================

function openSheet(id) {

  const sheet =
    $(id);

  const overlay =
    $("overlay");

  if (!sheet) return;

  if (overlay) {

    overlay.hidden = false;

  }

  sheet.classList.add("open");

  sheet.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


function closeSheets() {

  document
    .querySelectorAll(".sheet.open")
    .forEach(sheet => {

      sheet.classList.remove(
        "open"
      );

      sheet.setAttribute(
        "aria-hidden",
        "true"
      );

    });


  if ($("overlay")) {

    $("overlay").hidden =
      true;

  }


  document.body.style.overflow =
    "";

}


// ========================================
// طريقة الطلب
// ========================================

function showModeSheet() {

  document
    .querySelectorAll(".mode-option")
    .forEach(button => {

      button.classList.toggle(
        "selected",
        button.dataset.mode ===
        orderMode
      );

    });

  openSheet("modeSheet");

}


function setMode(mode) {

  orderMode =
    mode === "car"
      ? "car"
      : "cafe";


  if ($("modeLabel")) {

    $("modeLabel").textContent =
      orderMode === "car"
        ? "من السيارة"
        : "داخل المقهى";

  }


  if ($("checkoutModeLabel")) {

    $("checkoutModeLabel")
      .textContent =
      orderMode === "car"
        ? "من السيارة"
        : "داخل المقهى";

  }


  if ($("pickupHint")) {

    $("pickupHint")
      .textContent =
      orderMode === "car"

        ? "أضف بيانات سيارتك لنتعرف عليها عند الوصول"

        : "حدد رقم الطاولة بالأسفل";

  }


  if ($("cafeFields")) {

    $("cafeFields").hidden =
      orderMode !== "cafe";

  }


  if ($("carFields")) {

    $("carFields").hidden =
      orderMode !== "car";

  }


  closeSheets();

}


// ========================================
// Supabase
// ========================================

async function loadSupabase() {

  if (supabaseClient) return;


  await new Promise(
    (resolve, reject) => {

      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

      script.onload =
        resolve;

      script.onerror =
        () =>
          reject(
            new Error(
              "تعذر تحميل Supabase"
            )
          );

      document.head.appendChild(
        script
      );

    }
  );


  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

}


// ========================================
// التحقق من الطلب
// ========================================

function validate() {

  if (!cart.length) {

    toast(
      "السلة فاضية"
    );

    return false;

  }


  const phone =
    $("phone")?.value.trim();


  if (!phone) {

    toast(
      "أدخل رقم الجوال"
    );

    $("phone")?.focus();

    return false;

  }


  if (
    orderMode === "cafe" &&
    !$("tableNumber")?.value.trim()
  ) {

    toast(
      "أدخل رقم الطاولة"
    );

    $("tableNumber")?.focus();

    return false;

  }


  // طلب السيارة
  // نوع السيارة + اللون فقط

  if (orderMode === "car") {

    if (
      !$("carType")?.value.trim()
    ) {

      toast(
        "أدخل نوع السيارة"
      );

      $("carType")?.focus();

      return false;

    }


    if (
      !$("carColor")?.value.trim()
    ) {

      toast(
        "أدخل لون السيارة"
      );

      $("carColor")?.focus();

      return false;

    }

  }


  return true;

}


// ========================================
// إرسال الطلب
// ========================================

async function submitOrder() {

  if (
    submitting ||
    !validate()
  ) return;


  submitting = true;


  const button =
    $("submitOrderButton");


  if (button) {

    button.disabled = true;

    button.textContent =
      "جارٍ إرسال الطلب...";

  }


  try {

    await loadSupabase();


    const orderNumber =
      "BRN-" +
      Date.now()
        .toString()
        .slice(-6);


    let notes = "";


    if (orderMode === "car") {

      notes =
        `طلب من السيارة | نوع السيارة: ${
          $("carType").value.trim()
        } | اللون: ${
          $("carColor").value.trim()
        }`;

    } else {

      notes =
        `طلب داخل المقهى | الطاولة: ${
          $("tableNumber").value.trim()
        }`;

    }


    const extraNote =
      $("orderNotes")
        ?.value
        .trim();


    const quickNote =
      $("quickNote")
        ?.value
        .trim();


    if (extraNote) {

      notes +=
        ` | الملاحظة: ${extraNote}`;

    }


    if (quickNote) {

      notes +=
        ` | ${quickNote}`;

    }


    const items =
      cart.map(item => ({

        id: item.id,

        name: item.name,

        quantity:
          item.quantity,

        price:
          Number(
            item.price
          )

      }));


    const payload = {

      order_number:
        orderNumber,

      table_number:
        orderMode === "cafe"
          ? $("tableNumber")
              .value
              .trim()
          : "سيارة",

      phone:
        $("phone")
          .value
          .trim(),

      items,

      total:
        Number(
          total().toFixed(3)
        ),

      status:
        "new",

      notes:
        notes || null

    };


    const { error } =
      await supabaseClient
        .from("orders")
        .insert(
          payload
        );


    if (error) {

      throw error;

    }


    closeSheets();


    if ($("successOrderNumber")) {

      $("successOrderNumber")
        .textContent =
        orderNumber;

    }


    if ($("successMeta")) {

      $("successMeta")
        .textContent =

        orderMode === "car"

          ? "طلب من السيارة • سيتم التعرف على سيارتك عند الوصول"

          : `طلب داخل المقهى • الطاولة ${
              $("tableNumber")
                .value
                .trim()
            }`;

    }


    if ($("successModal")) {

      $("successModal").hidden =
        false;

    }


    cart = [];

    renderCart();

  }

  catch (error) {

    console.error(error);

    toast(
      "تعذر إرسال الطلب، حاول مرة ثانية"
    );

  }

  finally {

    submitting = false;


    if (button) {

      button.disabled =
        false;

      button.textContent =
        "قم بتقديم الطلب";

    }

  }

}


// ========================================
// رسالة صغيرة
// ========================================

function toast(text) {

  const element =
    $("toast");

  if (!element) return;

  element.textContent =
    text;

  element.classList.add(
    "show"
  );


  clearTimeout(
    window._barniToast
  );


  window._barniToast =
    setTimeout(
      () => {

        element.classList.remove(
          "show"
        );

      },
      2200
    );

}


// ========================================
// الأزرار
// ========================================

if ($("modeButton")) {

  $("modeButton").onclick =
    showModeSheet;

}


if ($("openCartButton")) {

  $("openCartButton").onclick =
    () =>
      openSheet(
        "cartSheet"
      );

}


if ($("checkoutButton")) {

  $("checkoutButton").onclick =
    () => {

      closeSheets();


      if (!cart.length) {

        toast(
          "السلة فاضية"
        );

        return;

      }


      setMode(
        orderMode
      );


      openSheet(
        "checkoutSheet"
      );

    };

}


if ($("submitOrderButton")) {

  $("submitOrderButton").onclick =
    submitOrder;

}


if ($("changeMode")) {

  $("changeMode").onclick =
    () => {

      closeSheets();
      showModeSheet();

    };

}


if ($("doneButton")) {

  $("doneButton").onclick =
    () => {

      if ($("successModal")) {

        $("successModal").hidden =
          true;

      }

    };

}


if ($("overlay")) {

  $("overlay").onclick =
    closeSheets;

}


document
  .querySelectorAll(
    "[data-close]"
  )
  .forEach(button => {

    button.onclick =
      closeSheets;

  });


document
  .querySelectorAll(
    ".mode-option"
  )
  .forEach(button => {

    button.onclick = () => {

      setMode(
        button.dataset.mode
      );

    };

  });


// ========================================
// تشغيل
// ========================================

setMode("cafe");

renderCategories();

renderMenu();

renderCart();
