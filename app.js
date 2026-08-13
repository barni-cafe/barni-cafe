const menu = [
  {name:"إسبريسو", desc:"قهوة إسبريسو مركزة", price:"1.500 ر.ع"},
  {name:"لاتيه", desc:"إسبريسو مع حليب ناعم", price:"2.000 ر.ع"},
  {name:"كابتشينو", desc:"إسبريسو وحليب ورغوة", price:"2.000 ر.ع"},
  {name:"قهوة تركية", desc:"قهوة تركية على الطريقة التقليدية", price:"1.500 ر.ع"}
];

document.getElementById("menu").innerHTML = menu.map(item => `
  <div class="item">
    <div>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
    </div>
    <div class="price">${item.price}</div>
  </div>
`).join("");
