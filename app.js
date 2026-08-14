// ========================================
// برني كافيه - app.js
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


// ========================================
// المتغيرات
// ========================================

let category = "القهوة الساخنة";
let cart = [];
let table = 6;
let submitting = false;
let orderType = "";

let customerPhone = "";
let carNumber = "";
let orderNote = "";


// ========================================
// أدوات
// ========================================

const $ = id =>
  document.getElementById(id);

const money = number =>
  Number(number).toFixed(3) + " ر.ع";

const total = () =>
  cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

const cartCount = () =>
  cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );


// ========================================
// شاشة البداية
// ========================================

function startSplash() {

  const splash = $("splash");

  if (!splash) return;

  splash.style.opacity = "1";
  splash.style.visibility = "visible";
  splash.style.pointerEvents = "auto";
  splash.style.transition =
    "opacity .8s ease";

  setTimeout(() => {

    splash.style.opacity = "0";
    splash.style.pointerEvents = "none";

    setTimeout(() => {

      splash.style.visibility =
        "hidden";

    }, 800);

  }, 1800);

}


// ========================================
// اختيار طريقة الطلب
// ========================================

function setupOrderChoice() {

  const box = $("order-choice");

  if (!box) return;

  const buttons =
    box.querySelectorAll("button");

  buttons.forEach(button => {

    button.onclick = () => {

      const text =
        button.textContent.trim();

      if (text.includes("السيارة")) {

        orderType = "من السيارة";

      }

      else if (text.includes("المقهى")) {

        orderType = "داخل المقهى";

      }

      box.classList.add("hidden");

      show("menuScreen");

    };

  });

}


// ========================================
// التصنيفات
// ========================================

function renderCats() {

  const cats = [

    "القهوة الساخنة",
    "القهوة الباردة",
    "المشروبات",
    "الحلويات"

  ];

  const element =
    $("categories");

  if (!element) return;

  element.innerHTML =
    cats.map(cat => `

      <button
        class="cat ${cat === category ? "active" : ""}"
        data-cat="${cat}"
        type="button"
      >
        ${cat}
      </button>

    `).join("");


  document
    .querySelectorAll("[data-cat]")
    .forEach(button => {

      button.onclick = () => {

        category =
          button.dataset.cat;

        renderCats();
        renderProducts();

      };

    });

}


// ========================================
// المنتجات
// ========================================

function renderProducts() {

  const element =
    $("products");

  if (!element) return;

  const list =
    products.filter(
      product =>
        product.cat === category
    );


  element.innerHTML =
    list.map((product, index) => `

      <article class="product">

        ${
          index === 0 &&
          category === "القهوة الساخنة"

          ? `<span class="popular">
               الأكثر طلباً
             </span>`

          : ""
        }

        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.style.display='none'"
        >

        <div class="product-info">

          <div class="product-name">

            <span>
              ${product.name}
            </span>

            <span class="product-en">
              ${product.en}
            </span>

          </div>

          <div class="product-desc">
            ${product.desc}
          </div>

          <div class="product-bottom">

            <span class="price">
              ${money(product.price)}
            </span>

            <button
              class="add"
              data-add="${product.id}"
              type="button"
            >
              +
            </button>

          </div>

        </div>

      </article>

    `).join("");


  document
    .querySelectorAll("[data-add]")
    .forEach(button => {

      button.onclick = () => {

        add(
          Number(button.dataset.add)
        );

      };

    });

}


// ========================================
// إضافة منتج
// ========================================

function add(id) {

  const product =
    products.find(
      item => item.id === id
    );

  if (!product) return;


  const existing =
    cart.find(
      item => item.id === id
    );


  if (existing) {

    existing.quantity++;

  }

  else {

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

  const count =
    cartCount();

  const countElement =
    $("cartCount");

  const totalElement =
    $("cartTotal");

  if (countElement) {

    countElement.textContent =
      count;

  }

  if (totalElement) {

    totalElement.textContent =
      money(total());

  }

  const reviewButton =
    $("openReview");

  if (reviewButton) {

    reviewButton.textContent =
      "عرض الطلب";

  }

}


// ========================================
// مراجعة الطلب
// ========================================

function renderReview() {

  const countElement =
    $("reviewCount");

  const totalElement =
    $("reviewTotal");

  const tableElement =
    $("chosenTable");

  const itemsElement =
    $("reviewItems");


  if (countElement) {

    countElement.textContent =
      cartCount();

  }


  if (totalElement) {

    totalElement.textContent =
      money(total());

  }


  if (tableElement) {

    tableElement.textContent =
      table;

  }


  // ====================================
  // معلومات طلب السيارة
  // ====================================

  let carInfo = "";

  if (orderType === "من السيارة") {

    carInfo = `

      <div class="car-order-info">

        <h3>
          بيانات طلب السيارة
        </h3>

        <input
          id="customerPhone"
          type="tel"
          inputmode="numeric"
          maxlength="8"
          placeholder="رقم الهاتف"
          value="${customerPhone}"
        >

        <input
          id="carNumber"
          type="text"
          placeholder="رقم السيارة"
          value="${carNumber}"
        >

        <textarea
          id="orderNote"
          rows="3"
          placeholder="ملاحظة على الطلب"
        >${orderNote}</textarea>

      </div>

    `;

  }


  // ====================================
  // المنتجات
  // ====================================

  if (itemsElement) {

    itemsElement.innerHTML = `

      ${carInfo}

      ${cart.map(item => `

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
                type="button"
                data-q="${item.id}"
                data-d="-1"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                type="button"
                data-q="${item.id}"
                data-d="1"
              >
                +
              </button>

            </div>

          </div>

          <div class="review-price">
            ${money(
              item.price *
              item.quantity
            )}
          </div>

        </div>

      `).join("")}

    `;

  }


  // ====================================
  // حفظ بيانات السيارة
  // ====================================

  const phoneInput =
    $("customerPhone");

  const carInput =
    $("carNumber");

  const noteInput =
    $("orderNote");


  if (phoneInput) {

    phoneInput.oninput = () => {

      customerPhone =
        phoneInput.value;

    };

  }


  if (carInput) {

    carInput.oninput = () => {

      carNumber =
        carInput.value;

    };

  }


  if (noteInput) {

    noteInput.oninput = () => {

      orderNote =
        noteInput.value;

    };

  }


  // ====================================
  // الكميات
  // ====================================

  document
    .querySelectorAll("[data-q]")
    .forEach(button => {

      button.onclick = () => {

        const id =
          Number(button.dataset.q);

        const difference =
          Number(button.dataset.d);

        const item =
          cart.find(
            x => x.id === id
          );

        if (!item) return;


        item.quantity +=
          difference;


        if (item.quantity <= 0) {

          cart =
            cart.filter(
              x => x.id !== id
            );

        }


        renderCart();
        renderReview();

      };

    });


  // ====================================
  // الطاولات
  // ====================================

  const tables =
    $("tables");

  if (tables) {

    tables.innerHTML =
      [4, 5, 6, 7, 8, 9]
        .map(number => `

          <button
            class="table-btn ${
              number === table
                ? "active"
                : ""
            }"
            data-table="${number}"
            type="button"
          >
            ${number}
          </button>

        `)
        .join("");

  }


  document
    .querySelectorAll("[data-table]")
    .forEach(button => {

      button.onclick = () => {

        table =
          Number(
            button.dataset.table
          );

        renderReview();

      };

    });

}


// ========================================
// التنقل
// ========================================

function show(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.add(
        "hidden"
      );

    });


  const target =
    $(id);

  if (target) {

    target.classList.remove(
      "hidden"
    );

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// الرئيسية → المنيو
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

      alert(
        "أضف منتجاً أولاً إلى الطلب"
      );

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

  $("submitOrder").onclick =
    async () => {

      if (!cart.length) {

        alert(
          "الطلب فارغ"
        );

        return;

      }


      if (!orderType) {

        alert(
          "اختر طريقة الطلب أولاً"
        );

        return;

      }


      // ==================================
      // التحقق من طلب السيارة
      // ==================================

      if (
        orderType === "من السيارة"
      ) {

        const phone =
          $("customerPhone");

        const car =
          $("carNumber");

        const note =
          $("orderNote");


        customerPhone =
          phone
            ? phone.value.trim()
            : customerPhone;

        carNumber =
          car
            ? car.value.trim()
            : carNumber;

        orderNote =
          note
            ? note.value.trim()
            : orderNote;


        if (!customerPhone) {

          alert(
            "اكتب رقم الهاتف"
          );

          if (phone) phone.focus();

          return;

        }


        if (
          customerPhone.length !== 8
        ) {

          alert(
            "رقم الهاتف يجب أن يكون 8 أرقام"
          );

          if (phone) phone.focus();

          return;

        }


        if (!carNumber) {

          alert(
            "اكتب رقم السيارة"
          );

          if (car) car.focus();

          return;

        }

      }


      if (submitting) return;


      submitting = true;


      $("submitOrder").disabled =
        true;

      $("submitOrder").textContent =
        "جارٍ الإرسال...";


      try {

        // =================================
        // تحميل Supabase
        // =================================

        if (!window.supabase) {

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
                reject;

              document.head.appendChild(
                script
              );

            }
          );

        }


        const client =
          window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
          );


        // =================================
        // رقم الطلب
        // =================================

        const orderNumber =
          "BRN-" +
          Date.now()
            .toString()
            .slice(-6);


        // =================================
        // بيانات الطلب
        // =================================

        const payload = {

          order_number:
            orderNumber,

          table_number:
            String(table),

          phone:
            customerPhone || "",

          items:
            cart.map(item => ({

              id: item.id,

              name: item.name,

              quantity:
                item.quantity,

              price:
                item.price

            })),

          total:
            Number(
              total().toFixed(3)
            ),

          status:
            "new",

          notes:
            orderNote
              ? `${orderType} | رقم السيارة: ${carNumber} | ${orderNote}`
              : `${orderType} | رقم السيارة: ${carNumber}`

        };


        // =================================
        // إرسال
        // =================================

        const { error } =
          await client
            .from("orders")
            .insert(
              payload
            );


        if (error) {

          throw error;

        }


        // =================================
        // شاشة النجاح
        // =================================

        if ($("successText")) {

          $("successText").innerHTML = `

            <strong>
              تم إرسال طلبك بنجاح
            </strong>

            <br><br>

            رقم الطلب:
            ${orderNumber}

            <br>

            طريقة الطلب:
            ${orderType}

            <br>

            رقم الطاولة:
            ${table}

            <br>

            رقم الهاتف:
            ${customerPhone}

            ${
              carNumber
                ? `
                  <br>
                  رقم السيارة:
                  ${carNumber}
                `
                : ""
            }

            ${
              orderNote
                ? `
                  <br>
                  الملاحظة:
                  ${orderNote}
                `
                : ""
            }

          `;

        }


        if ($("success")) {

          $("success")
            .classList
            .remove(
              "hidden"
            );

        }


        // =================================
        // تصفير الطلب
        // =================================

        cart = [];

        customerPhone = "";
        carNumber = "";
        orderNote = "";

        renderCart();


      }

      catch (error) {

        console.error(
          error
        );

        alert(
          "تعذر إرسال الطلب، حاول مرة ثانية"
        );

      }

      finally {

        submitting =
          false;

        $("submitOrder").disabled =
          false;

        $("submitOrder").textContent =
          "إرسال الطلب";

      }

    };

}


// ========================================
// زر تم
// ========================================

if ($("successDone")) {

  $("successDone").onclick =
    () => {

      if ($("success")) {

        $("success")
          .classList
          .add(
            "hidden"
          );

      }


      orderType = "";

      table = 6;

      customerPhone = "";
      carNumber = "";
      orderNote = "";


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
