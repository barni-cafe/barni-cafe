const SUPABASE_URL="https://yxojtouxwoztjwtmzbys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_G4P7-79B7uwYO-xe5fsBTA_7VK7BxQ-";

const products=[
{id:1,cat:"القهوة الساخنة",name:"إسبريسو",en:"Espresso",desc:"مركز، غني، ومحضر من حبوب مختارة.",price:1.2,img:"espresso.jpg",code:"ESP"},
{id:2,cat:"القهوة الساخنة",name:"لاتيه برني",en:"Latte",desc:"إسبريسو ناعم مع حليب مخملي.",price:1.8,img:"latte.jpg",code:"LAT"},
{id:3,cat:"القهوة الساخنة",name:"كولد برو",en:"Cold Brew",desc:"بارد، منعش، متبوع بنكهة أعمق.",price:1.9,img:"cold-brew.jpg",code:"CB"},
{id:4,cat:"الحلويات",name:"كيك التمر",en:"Date Cake",desc:"كيكة تمر مع لمسة من التوابل العطرية.",price:1.5,img:"date-cake.jpg",code:"DATE"}
];

let category="القهوة الساخنة";
let cart=[];
let table=6;
let submitting=false;
let orderType="";

const $=id=>document.getElementById(id);

const money=n=>Number(n).toFixed(3)+" ر.ع";

const total=()=>cart.reduce((s,i)=>s+i.price*i.quantity,0);


function renderCats(){

  const cats=[
    "القهوة الساخنة",
    "القهوة الباردة",
    "المشروبات",
    "الحلويات"
  ];

  $("categories").innerHTML=cats.map(c=>`
    <button
      class="cat ${c===category?"active":""}"
      data-cat="${c}"
    >
      ${c}
    </button>
  `).join("");

  document
    .querySelectorAll("[data-cat]")
    .forEach(b=>{

      b.onclick=()=>{
        category=b.dataset.cat;
        renderCats();
        renderProducts();
      };

    });

}


function renderProducts(){

  const list=
    products.filter(
      p=>category==="القهوة الساخنة"
        ?p.cat===category
        :true
    );

  $("products").innerHTML=list.map((p,i)=>`

    <article class="product">

      ${
        i===0&&category==="القهوة الساخنة"
        ?'<span class="popular">الأكثر طلباً</span>'
        :""
      }

      <img
        src="${p.img}"
        alt="${p.name}"
      >

      <div class="product-info">

        <div class="product-name">
          <span>${p.name}</span>
          <span class="product-en">${p.en}</span>
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
          >
            +
          </button>

        </div>

      </div>

    </article>

  `).join("");

  document
    .querySelectorAll("[data-add]")
    .forEach(b=>{
      b.onclick=()=>{
        add(+b.dataset.add);
      };
    });

}


function add(id){

  const p=products.find(x=>x.id===id);

  const old=cart.find(x=>x.id===id);

  old
    ?old.quantity++
    :cart.push({
      ...p,
      quantity:1
    });

  renderCart();

}


function renderCart(){

  const c=
    cart.reduce(
      (s,i)=>s+i.quantity,
      0
    );

  $("cartCount").textContent=c;

  $("cartTotal").textContent=
    money(total());

  $("openReview").textContent=
    "عرض الطلب";

}


function renderReview(){

  $("reviewCount").textContent=
    cart.reduce(
      (s,i)=>s+i.quantity,
      0
    );

  $("reviewTotal").textContent=
    money(total());

  $("chosenTable").textContent=
    table;


  $("reviewItems").innerHTML=
    cart.map(i=>`

      <div class="review-item">

        <div class="thumb">
          ${i.code}
        </div>

        <div>

          <div class="review-name">
            ${i.name}
          </div>

          <div class="review-desc">
            ${i.desc}
          </div>

          <div class="qty">

            <button
              data-q="${i.id}"
              data-d="-1"
            >
              −
            </button>

            <span>
              ${i.quantity}
            </span>

            <button
              data-q="${i.id}"
              data-d="1"
            >
              +
            </button>

          </div>

        </div>

        <div class="review-price">
          ${money(i.price*i.quantity)}
        </div>

      </div>

    `).join("");


  document
    .querySelectorAll("[data-q]")
    .forEach(b=>{

      b.onclick=()=>{

        const x=
          cart.find(
            i=>i.id===+b.dataset.q
          );

        x.quantity+=+b.dataset.d;

        if(x.quantity<1){

          cart=cart.filter(
            i=>i.id!==x.id
          );

        }

        renderCart();
        renderReview();

      };

    });


  $("tables").innerHTML=
    [4,5,6,7,8,9]
      .map(n=>`

        <button
          class="table-btn ${
            n===table?"active":""
          }"
          data-table="${n}"
        >
          ${n}
        </button>

      `)
      .join("");


  document
    .querySelectorAll("[data-table]")
    .forEach(b=>{

      b.onclick=()=>{

        table=+b.dataset.table;

        renderReview();

      };

    });

}


function show(id){

  document
    .querySelectorAll(".screen")
    .forEach(
      s=>s.classList.add("hidden")
    );

  const screen=$(id);

  if(screen){
    screen.classList.remove("hidden");
  }

  window.scrollTo(0,0);

}


/* الصفحة الرئيسية */

$("homeMenu").onclick=
$("heroMenu").onclick=()=>{
  show("menuScreen");
};


/* الرجوع للرئيسية */

$("backHome").onclick=()=>{
  show("home");
};


/* مراجعة الطلب */

$("openReview").onclick=()=>{

  if(!cart.length){
    add(1);
  }

  renderReview();

  show("reviewScreen");

};


/* الرجوع للمنيو */

$("backMenu").onclick=()=>{
  show("menuScreen");
};


/* =========================
   اختيار طريقة الطلب
========================= */

document.addEventListener("click",(e)=>{

  if(e.target.closest("#carOrderBtn")){

    orderType="car";

    const choice=$("order-choice");

    if(choice){
      choice.classList.add("hidden");
    }

    show("home");

    return;
  }


  if(e.target.closest("#insideOrderBtn")){

    orderType="inside";

    const choice=$("order-choice");

    if(choice){
      choice.classList.add("hidden");
    }

    show("home");

    return;
  }

});


/* =========================
   إرسال الطلب
========================= */

$("submitOrder").onclick=async()=>{

  if(!cart.length)return;

  if(submitting)return;

  submitting=true;

  $("submitOrder").disabled=true;

  $("submitOrder").textContent=
    "جارٍ الإرسال...";


  try{

    await new Promise(
      (resolve,reject)=>{

        const s=
          document.createElement("script");

        s.src=
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        s.onload=resolve;

        s.onerror=reject;

        document.head.appendChild(s);

      }
    );


    const orderNumber=
      "BRN-"+
      Date.now()
        .toString()
        .slice(-6);


    const payload={

      order_number:orderNumber,

      table_number:String(table),

      phone:"",

      items:
        cart.map(i=>({
          id:i.id,
          name:i.name,
          quantity:i.quantity,
          price:i.price
        })),

      total:
        Number(
          total().toFixed(3)
        ),

      status:"new",

      notes:null

    };


    const {error}=
      await window.supabase
        .createClient(
          SUPABASE_URL,
          SUPABASE_PUBLISHABLE_KEY
        )
        .from("orders")
        .insert(payload);


    if(error)throw error;


    $("successText").textContent=
      `رقم طلبك ${orderNumber} • الطاولة ${table}`;


    $("success").classList.remove(
      "hidden"
    );


    cart=[];

    renderCart();


  }catch(e){

    console.error(e);

    alert(
      "تعذر إرسال الطلب، حاول مرة ثانية"
    );

  }finally{

    submitting=false;

    $("submitOrder").disabled=false;

    $("submitOrder").textContent=
      "إرسال الطلب";

  }

};


/* إنهاء الطلب */

$("successDone").onclick=()=>{

  $("success").classList.add(
    "hidden"
  );

  show("home");

};


/* =========================
   تشغيل الموقع
========================= */

renderCats();

renderProducts();

renderCart();


/* شاشة البداية */

setTimeout(
  ()=>{
    const splash=$("splash");

    if(splash){
      splash.classList.add("hidden");
    }
  },
  3500
);
