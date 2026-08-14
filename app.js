// ========================================
// برني كافيه - app.js
// ========================================

const SUPABASE_URL = "https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";

const products = [
  {
    id: 1,
    cat: "القهوة الساخنة",
    name: "إسبريسو",
    en: "Espresso",
    desc: "مركز، غني، ومحضر من حبوب مختارة.",
    price: 1.2,
    img: "espresso.jpg",
    code: "ESP"
  },
  {
    id: 2,
    cat: "القهوة الساخنة",
    name: "لاتيه برني",
    en: "Latte",
    desc: "إسبريسو ناعم مع حليب مخملي.",
    price: 1.8,
    img: "latte.jpg",
    code: "LAT"
  },
  {
    id: 3,
    cat: "القهوة الباردة",
    name: "كولد برو",
    en: "Cold Brew",
    desc: "بارد، منعش، متبوع بنكهة أعمق.",
    price: 1.9,
    img: "cold-brew.jpg",
    code: "CB"
  },
  {
    id: 4,
    cat: "الحلويات",
    name: "كيك التمر",
    en: "Date Cake",
    desc: "كيكة تمر مع لمسة من التوابل العطرية.",
    price: 1.5,
    img: "date-cake.jpg",
    code: "DATE"
  }
];

let category = "القهوة الساخنة";
let cart = [];
let table = 6;
let submitting = false;
let orderType = "";

// ========================================
// أدوات
// ========================================

const $ = id => document.getElementById(id);

const money = n => Number(n).toFixed(3) + " ر.ع";

const total = () =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartCount = () =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

// ========================================
// شاشة البداية + التلاشي
// ========================================

function startSplash() {

  const splash = $("splash");

  if (!splash) return;

  splash.style.opacity = "1";
  splash.style.visibility = "visible";
  splash.style.pointerEvents = "auto";
  splash.style.transition = "opacity .7s ease";

  setTimeout(() => {

    splash.style.opacity = "0";
    splash.style.pointerEvents = "none";

    setTimeout(() => {
      splash.style.visibility = "hidden";
    }, 700);

  }, 1800);
}

// ========================================
// اختيار طريقة الطلب
// ========================================

function setupOrderChoice() {

  const box = $("order-choice");

  if (!box) return;

  const buttons = box.querySelectorAll("button");

  buttons.forEach(button => {

    button.onclick = () => {

      const text = button.textContent.trim();

      if (text.includes("السيارة")) {
        orderType = "من السيارة";
      }

      if (text.includes("المقهى")) {
        orderType = "داخل المقهى";
      }

      box.classList.add("hidden");

      show("home");

    };

  });
}

// ========================================
// التصنيفات
// ========================================

function renderCats() {

  const categories = [
    "القهوة الساخنة",
    "القهوة الباردة",
    "المشروبات",
    "الحلويات"
  ];

  const el = $("categories");

  if (!el) return;

  el.innerHTML = categories.map(cat => `
    <button
      class="cat ${cat === category ? "active" : ""}"
      data-cat="${cat}"
      type="button"
    >
      ${cat}
    </button>
  `).join("");

  document.querySelectorAll("[data-cat]").forEach(button => {

    button.onclick = () => {

      category = button.dataset.cat;

      renderCats();
      renderProducts();

    };

  });
}

// ========================================
// المنتجات
// ========================================

function renderProducts() {

  const el = $("products");

  if (!el) return;

  const list = products.filter(item => {

    return item.cat === category;

  });

  el.innerHTML = list.map((p, index) => `

    <article class="product">

      ${
        index === 0 && category === "القهوة الساخنة"
          ? `<span class="popular">الأكثر طلباً</span>`
          : ""
      }

      <img
        src="${p.img}"
        alt="${p.name}"
        onerror="this.style.display='none'"
      >

      <div class="product-info">

        <div class="product-name">

          <span>${p.name}</span>

          <span class="product-en">
            ${p.en}
          </span>

        </div>

        <div class="product-desc">
          ${p.desc}
        </div>

        <div class="product-bottom">

          <span class="price">
            ${money(p.price)}
          </span>

          <button
            class="add"
            data-add="${p.id}"
            type="button"
          >
            +
          </button>

        </div>

      </div>

    </article>

  `).join("");

  document.querySelectorAll("[data-add]").forEach(button => {

    button.onclick = () => {

      add(Number(button.dataset.add));

    };

  });

}

// ========================================
// إضافة للسلة
// ========================================

function add(id) {

  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  renderCart();
}

// ========================================
// السلة
// ========================================

function renderCart() {

  const count = cartCount();

  const countEl = $("cartCount");
  const totalEl = $("cartTotal");
  const reviewButton = $("openReview");

  if (countEl) {
    countEl.textContent = count;
  }

  if (totalEl) {
    totalEl.textContent = money(total());
  }

  if (reviewButton) {
    reviewButton.textContent = "عرض الطلب";
  }
}

// ========================================
// مراجعة الطلب
// ========================================

function renderReview() {

  const countEl = $("reviewCount");
  const totalEl = $("reviewTotal");
  const tableEl = $("chosenTable");
  const itemsEl = $("reviewItems");

  if (countEl) {
    countEl.textContent = cartCount();
  }

  if (totalEl) {
    totalEl.textContent = money(total());
  }

  if (tableEl) {
    tableEl.textContent = table;
  }

  if (itemsEl) {

    itemsEl.innerHTML = cart.map(item => `

      <div class="review-item">

        <div class="thumb">
          ${item.code}
        </div>

        <div>

          <div class="review-name">
            ${item.name}
          </div>

          <div class="review-desc">
            ${item.desc}
          </div>

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

        <div class="review-price">
          ${money(item.price * item.quantity)}
        </div>

      </div>

    `).join("");

  }

  // تغيير الكمية

  document.querySelectorAll("[data-q]").forEach(button => {

    button.onclick = () => {

      const id = Number(button.dataset.q);
      const difference = Number(button.dataset.d);

      const item = cart.find(x => x.id === id);

      if (!item) return;

      item.quantity += difference;

      if (item.quantity <= 0) {

        cart = cart.filter(x => x.id !== id);

      }

      renderCart();
      renderReview();

    };

  });

  // الطاولات

  const tables = $("tables");

  if (tables) {

    tables.innerHTML = [4, 5, 6, 7, 8, 9]
      .map(number => `

        <button
          class="table-btn ${number === table ? "active" : ""}"
          data-table="${number}"
          type="button"
        >
          ${number}
        </button>

      `)
      .join("");

  }

  document.querySelectorAll("[data-table]").forEach(button => {

    button.onclick = () => {

      table = Number(button.dataset.table);

      renderReview();

    };

  });

}

// ========================================
// التنقل بين الصفحات
// ========================================

function show(id) {

  document.querySelectorAll(".screen").forEach(screen => {

    screen.classList.add("hidden");

  });

  const target = $(id);

  if (target) {

    target.classList.remove("hidden");

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ========================================
// زر عرض المنيو
// ========================================

if ($("homeMenu")) {

  $("homeMenu").onclick = () => {

    show("menuScreen");

  };

}

if ($("heroMenu")) {

  $("heroMenu").onclick = () => {

    show("menuScreen");

  };

}

// ========================================
// الرجوع للرئيسية
// ========================================

if ($("backHome")) {

  $("backHome").onclick = () => {

    show("home");

  };

}

// ========================================
// عرض الطلب
// ========================================

if ($("openReview")) {

  $("openReview").onclick = () => {

    if (!cart.length) {

      alert("أضف منتجاً أولاً إلى الطلب");

      return;

    }

    renderReview();

    show("reviewScreen");

  };

}

// ========================================
// الرجوع للمنيو
// ========================================

if ($("backMenu")) {

  $("backMenu").onclick = () => {

    show("menuScreen");

  };

}

// ========================================
// إرسال الطلب
// ========================================

if ($("submitOrder")) {

  $("submitOrder").onclick = async () => {

    if (!cart.length) {

      alert("الطلب فارغ");

      return;

    }

    if (!orderType) {

      alert("اختر طريقة الطلب أولاً");

      return;

    }

    if (submitting) return;

    submitting = true;

    $("submitOrder").disabled = true;
    $("submitOrder").textContent = "جارٍ الإرسال...";

    try {

      // تحميل Supabase

      if (!window.supabase) {

        await new Promise((resolve, reject) => {

          const script = document.createElement("script");

          script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

          script.onload = resolve;
          script.onerror = reject;

          document.head.appendChild(script);

        });

      }

      const client =
        window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_PUBLISHABLE_KEY
        );

      // رقم الطلب

      const orderNumber =
        "BRN-" +
        Date.now()
          .toString()
          .slice(-6);

      // بيانات الطلب

      const payload = {

        order_number: orderNumber,

        table_number:
          String(table),

        phone: "",

        items:
          cart.map(item => ({

            id: item.id,

            name: item.name,

            quantity: item.quantity,

            price: item.price

          })),

        total:
          Number(
            total().toFixed(3)
          ),

        status: "new",

        notes:
          orderType

      };

      const { error } =
        await client
          .from("orders")
          .insert(payload);

      if (error) {

        throw error;

      }

      // رسالة النجاح

      if ($("successText")) {

        $("successText").textContent =
          `رقم طلبك ${orderNumber} • الطاولة ${table}`;

      }

      if ($("success")) {

        $("success").classList.remove("hidden");

      }

      // تصفير السلة

      cart = [];

      renderCart();

    } catch (error) {

      console.error(error);

      alert(
        "تعذر إرسال الطلب، حاول مرة ثانية"
      );

    } finally {

      submitting = false;

      $("submitOrder").disabled = false;

      $("submitOrder").textContent =
        "إرسال الطلب";

    }

  };

}

// ========================================
// زر تم بعد إرسال الطلب
// ========================================

if ($("successDone")) {

  $("successDone").onclick = () => {

    if ($("success")) {

      $("success").classList.add("hidden");

    }

    orderType = "";
    table = 6;

    show("home");

  };

}

// ========================================
// تشغيل الموقع
// ========================================

renderCats();
renderProducts();
renderCart();

setupOrderChoice();

startSplash();
