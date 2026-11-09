const STORAGE_PRODUCTS = "comercioProducts";
const STORAGE_SALES = "comercioSales";
const currentPage = document.body.dataset.page || "dashboard";
const user = JSON.parse(localStorage.getItem("comercioUser") || "null");

if (!user) window.location.href = "index.html";

const money = value => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateText = value => new Date(value).toLocaleDateString("pt-BR");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));

function seedData() {
  if (!localStorage.getItem(STORAGE_PRODUCTS)) {
    const products = [
      {id:1,name:"Café tradicional 500g",description:"Pacote de café",cost:14.5,price:19.9,stock:24,created:new Date().toISOString()},
      {id:2,name:"Arroz tipo 1 5kg",description:"Pacote de arroz",cost:22,price:29.9,stock:18,created:new Date().toISOString()},
      {id:3,name:"Feijão carioca 1kg",description:"Pacote de feijão",cost:6.8,price:9.5,stock:7,created:new Date().toISOString()},
      {id:4,name:"Óleo de soja 900ml",description:"Garrafa de óleo",cost:5.2,price:7.49,stock:0,created:new Date().toISOString()},
      {id:5,name:"Açúcar refinado 1kg",description:"Pacote de açúcar",cost:3.4,price:4.99,stock:32,created:new Date().toISOString()}
    ];
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
  }
  if (!localStorage.getItem(STORAGE_SALES)) localStorage.setItem(STORAGE_SALES, JSON.stringify([]));
}
seedData();

const getProducts = () => JSON.parse(localStorage.getItem(STORAGE_PRODUCTS) || "[]");
const saveProducts = products => localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
const getSales = () => JSON.parse(localStorage.getItem(STORAGE_SALES) || "[]");
const saveSales = sales => localStorage.setItem(STORAGE_SALES, JSON.stringify(sales));
const isAdmin = user?.role === "ADMIN";

function layout(content, title) {
  const links = [
    ["dashboard","⌂","Visão geral","dashboard.html"],
    ["produtos","▦","Produtos","produtos.html"],
    ["vendas","▤","Vendas","vendas.html"],
    ...(isAdmin ? [["relatorios","▥","Relatórios","relatorios.html"]] : [])
  ];
  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><span class="brand-mark">C</span><span>comércio<span class="brand-light"> simples</span></span></div>
        <p class="nav-label">Menu principal</p>
        <nav class="nav-list">${links.map(([key,icon,label,url]) => `<a class="nav-link ${currentPage===key?"active":""}" href="${url}"><span class="nav-icon">${icon}</span>${label}</a>`).join("")}</nav>
        <div class="sidebar-bottom">
          <div class="user-mini"><div class="avatar">${escapeHTML((user.name||"U").charAt(0).toUpperCase())}</div><div><strong>${escapeHTML(user.name)}</strong><small>${isAdmin?"Administrador":"Funcionário"}</small></div></div>
          <button class="btn logout" id="logoutBtn">↪ &nbsp; Sair do sistema</button>
        </div>
      </aside>
      <main class="main-area">
        <header class="topbar">
          <div class="topbar-left"><button class="mobile-menu" id="menuBtn" aria-label="Abrir menu">☰</button><span class="breadcrumb">Sistema / ${title}</span></div>
          <div class="topbar-right"><span>${new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})}</span><span class="avatar">${escapeHTML((user.name||"U").charAt(0).toUpperCase())}</span></div>
        </header>
        <section class="content">${content}</section>
      </main>
    </div>`;
  document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("comercioUser"); window.location.href="index.html"; });
  document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
}
function toast(message) {
  const old = document.querySelector(".toast"); if (old) old.remove();
  const el = document.createElement("div"); el.className="toast"; el.textContent=message; document.body.appendChild(el);
  setTimeout(()=>el.remove(),2600);
}
function stockBadge(stock) {
  if (stock <= 0) return '<span class="badge out">Sem estoque</span>';
  if (stock <= 10) return '<span class="badge low">Estoque baixo</span>';
  return '<span class="badge">Disponível</span>';
}
function renderDashboard() {
  const products=getProducts(), sales=getSales();
  const revenue=sales.reduce((sum,s)=>sum+s.total,0);
  const units=products.reduce((sum,p)=>sum+p.stock,0);
  const recent=[...sales].reverse().slice(0,5);
  layout(`
    <div class="page-heading"><div><h1>Visão geral</h1><p>Acompanhe os principais números do seu comércio.</p></div><a class="btn btn-primary" href="vendas.html">+ Nova venda</a></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-top">Faturamento registrado <span class="stat-symbol">R$</span></div><div class="stat-value">${money(revenue)}</div><div class="stat-note">Total das vendas registradas</div></article>
      <article class="stat-card"><div class="stat-top">Vendas realizadas <span class="stat-symbol">↗</span></div><div class="stat-value">${sales.length}</div><div class="stat-note">Quantidade de vendas</div></article>
      <article class="stat-card"><div class="stat-top">Produtos cadastrados <span class="stat-symbol">▦</span></div><div class="stat-value">${products.length}</div><div class="stat-note">Itens no catálogo</div></article>
      <article class="stat-card"><div class="stat-top">Unidades em estoque <span class="stat-symbol">□</span></div><div class="stat-value">${units}</div><div class="stat-note">${products.filter(p=>p.stock<=10).length} produto(s) com estoque baixo ou zerado</div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><h2>Vendas recentes</h2><a class="muted" href="vendas.html">Ver vendas</a></div>
        ${recent.length?`<div class="table-wrap"><table><thead><tr><th>Venda</th><th>Data</th><th>Valor total</th></tr></thead><tbody>${recent.map(s=>`<tr><td><strong>#${s.id}</strong></td><td>${dateText(s.date)}</td><td>${money(s.total)}</td></tr>`).join("")}</tbody></table></div>`:'<div class="empty-state">Nenhuma venda registrada até o momento.</div>'}
      </section>
      <section class="panel"><div class="panel-header"><h2>Atenção ao estoque</h2><a class="muted" href="produtos.html">Gerenciar</a></div>
        ${products.filter(p=>p.stock<=10).length?products.filter(p=>p.stock<=10).map(p=>`<div class="cart-line"><div><strong>${escapeHTML(p.name)}</strong><small>${p.stock} unidade(s) restantes</small></div>${stockBadge(p.stock)}</div>`).join(""):'<div class="empty-state">Todos os produtos possuem estoque adequado.</div>'}
      </section>
    </div>`, "Visão geral");
}
function renderProducts() {
  layout(`
    <div class="page-heading"><div><h1>Produtos</h1><p>Cadastre e acompanhe os produtos do seu comércio.</p></div><button class="btn btn-primary" id="newProduct">+ Novo produto</button></div>
    <section class="panel">
      <div class="toolbar"><input class="search" id="productSearch" placeholder="Pesquisar por nome do produto..."><span class="muted" id="productCount"></span></div>
      <div class="table-wrap"><table><thead><tr><th>Produto</th><th>Preço de custo</th><th>Preço de venda</th><th>Estoque</th><th>Situação</th><th>Ações</th></tr></thead><tbody id="productsBody"></tbody></table></div>
    </section>
    <div id="modalRoot"></div>`, "Produtos");
  const draw = () => {
    const q=document.getElementById("productSearch").value.toLowerCase();
    const products=getProducts().filter(p=>p.name.toLowerCase().includes(q));
    document.getElementById("productCount").textContent=`${products.length} produto(s)`;
    document.getElementById("productsBody").innerHTML=products.length?products.map(p=>`<tr>
      <td><div class="product-name"><span class="product-thumb">▦</span><strong>${escapeHTML(p.name)}</strong></div></td>
      <td>${money(p.cost)}</td><td><strong>${money(p.price)}</strong></td><td>${p.stock}</td><td>${stockBadge(p.stock)}</td>
      <td><div class="actions"><button class="btn btn-secondary btn-small" data-edit="${p.id}">Editar</button><button class="btn btn-danger btn-small" data-delete="${p.id}">Excluir</button></div></td></tr>`).join(""):'<tr><td colspan="6"><div class="empty-state">Nenhum produto encontrado.</div></td></tr>';
    document.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>openProductModal(Number(b.dataset.edit))));
    document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteProduct(Number(b.dataset.delete))));
  };
  document.getElementById("productSearch").addEventListener("input",draw);
  document.getElementById("newProduct").addEventListener("click",()=>openProductModal());
  draw();
}
function openProductModal(id=null) {
  const p=id?getProducts().find(x=>x.id===id):null;
  document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop"><div class="modal">
    <div class="modal-header"><h2>${p?"Editar produto":"Cadastrar produto"}</h2><button class="close-btn" id="closeModal">×</button></div>
    <form id="productForm"><div class="form-grid">
      <div class="full"><label for="pName">Nome do produto</label><input id="pName" required maxlength="90" value="${escapeHTML(p?.name||"")}"></div>
      <div class="full"><label for="pDescription">Descrição</label><input id="pDescription" value="${escapeHTML(p?.description||"")}"></div>
      <div><label for="pCost">Preço de custo (R$)</label><input id="pCost" type="number" min="0" step="0.01" required value="${p?.cost??""}"></div>
      <div><label for="pPrice">Preço de venda (R$)</label><input id="pPrice" type="number" min="0" step="0.01" required value="${p?.price??""}"></div>
      <div class="full"><label for="pStock">Quantidade em estoque</label><input id="pStock" type="number" min="0" step="1" required value="${p?.stock??0}"></div>
    </div><div class="modal-footer"><button type="button" class="btn btn-secondary" id="cancelModal">Cancelar</button><button class="btn btn-primary" type="submit">Salvar produto</button></div></form>
  </div></div>`;
  const close=()=>document.getElementById("modalRoot").innerHTML="";
  document.getElementById("closeModal").onclick=close; document.getElementById("cancelModal").onclick=close;
  document.getElementById("productForm").onsubmit=e=>{
    e.preventDefault();
    const products=getProducts();
    const item={id:p?.id||Date.now(),name:document.getElementById("pName").value.trim(),description:document.getElementById("pDescription").value.trim(),cost:Number(document.getElementById("pCost").value),price:Number(document.getElementById("pPrice").value),stock:Number(document.getElementById("pStock").value),created:p?.created||new Date().toISOString()};
    if(p) saveProducts(products.map(x=>x.id===p.id?item:x)); else saveProducts([...products,item]);
    close(); renderProducts(); toast(p?"Produto atualizado!":"Produto cadastrado!");
  };
}
function deleteProduct(id) {
  const products=getProducts(), p=products.find(x=>x.id===id);
  if(!confirm(`Deseja excluir "${p.name}"?`)) return;
  saveProducts(products.filter(x=>x.id!==id)); renderProducts(); toast("Produto excluído.");
}
let cart=[];
function renderSales() {
  layout(`
    <div class="page-heading"><div><h1>Vendas</h1><p>Selecione os produtos e monte uma nova venda.</p></div></div>
    <div class="sale-layout">
      <section class="panel"><div class="panel-header"><h2>Produtos disponíveis</h2><span>Selecione para adicionar ao carrinho</span></div><input id="saleSearch" placeholder="Pesquisar produto..." style="margin-bottom:14px"><div class="product-picker" id="productPicker"></div></section>
      <section class="panel"><div class="panel-header"><h2>Carrinho</h2><span id="cartCount">0 itens</span></div><div id="cartItems"></div><div class="cart-total"><span>Total</span><span id="cartTotal">${money(0)}</span></div><button class="btn btn-primary btn-full" id="finishSale">Finalizar venda</button><button class="btn btn-secondary btn-full" id="clearCart" style="margin-top:8px">Limpar carrinho</button></section>
    </div>
    <section class="panel" style="margin-top:18px"><div class="panel-header"><h2>Últimas vendas</h2></div><div class="table-wrap"><table><thead><tr><th>Código</th><th>Data e hora</th><th>Itens</th><th>Total</th></tr></thead><tbody>${getSales().slice().reverse().slice(0,8).map(s=>`<tr><td>#${s.id}</td><td>${new Date(s.date).toLocaleString("pt-BR")}</td><td>${s.items.reduce((n,i)=>n+i.quantity,0)}</td><td><strong>${money(s.total)}</strong></td></tr>`).join("")||'<tr><td colspan="4" class="empty-state">Nenhuma venda registrada.</td></tr>'}</tbody></table></div></section>`, "Vendas");
  const drawPicker=()=>{
    const q=document.getElementById("saleSearch").value.toLowerCase();
    const list=getProducts().filter(p=>p.name.toLowerCase().includes(q)&&p.stock>0);
    document.getElementById("productPicker").innerHTML=list.length?list.map(p=>`<article class="pick-card"><span class="product-thumb">▦</span><strong>${escapeHTML(p.name)}</strong><small>${money(p.price)} · ${p.stock} em estoque</small><button class="btn btn-secondary btn-small" data-add="${p.id}">Adicionar</button></article>`).join(""):'<div class="empty-state">Nenhum produto disponível.</div>';
    document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(Number(b.dataset.add)));
  };
  document.getElementById("saleSearch").addEventListener("input",drawPicker);
  document.getElementById("clearCart").onclick=()=>{cart=[];drawCart();};
  document.getElementById("finishSale").onclick=finishSale;
  drawPicker(); drawCart();
}
function addToCart(id) {
  const p=getProducts().find(x=>x.id===id), line=cart.find(x=>x.id===id);
  if(!p||p.stock<= (line?.quantity||0)){toast("Quantidade maior que o estoque disponível.");return;}
  if(line) line.quantity++; else cart.push({id:p.id,name:p.name,price:p.price,quantity:1});
  drawCart();
}
function drawCart() {
  const root=document.getElementById("cartItems"); if(!root)return;
  root.innerHTML=cart.length?cart.map(i=>`<div class="cart-line"><div><strong>${escapeHTML(i.name)}</strong><small>${i.quantity} × ${money(i.price)}</small></div><div class="actions"><strong>${money(i.quantity*i.price)}</strong><button class="btn btn-danger btn-small" data-remove="${i.id}">−</button></div></div>`).join(""):'<div class="cart-empty">Seu carrinho está vazio.</div>';
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,i)=>s+i.quantity*i.price,0));
  document.getElementById("cartCount").textContent=`${cart.reduce((s,i)=>s+i.quantity,0)} item(ns)`;
  document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{const i=cart.find(x=>x.id===Number(b.dataset.remove));if(i.quantity>1)i.quantity--;else cart=cart.filter(x=>x.id!==i.id);drawCart();});
}
function finishSale() {
  if(!cart.length){toast("Adicione pelo menos um produto.");return;}
  const products=getProducts();
  for(const item of cart){const p=products.find(x=>x.id===item.id);if(!p||p.stock<item.quantity){toast(`Estoque insuficiente: ${item.name}`);return;}}
  cart.forEach(item=>{const p=products.find(x=>x.id===item.id);p.stock-=item.quantity;});
  saveProducts(products);
  const sales=getSales();
  sales.push({id:sales.length?Math.max(...sales.map(s=>s.id))+1:1,date:new Date().toISOString(),total:cart.reduce((s,i)=>s+i.price*i.quantity,0),items:cart.map(i=>({...i}))});
  saveSales(sales);cart=[];renderSales();toast("Venda finalizada com sucesso!");
}
function renderReports() {
  if(!isAdmin){layout('<section class="panel empty-state">Você não tem permissão para acessar os relatórios.</section>',"Relatórios");return;}
  const sales=getSales(), products=getProducts(), total=sales.reduce((s,x)=>s+x.total,0);
  const units=products.reduce((s,p)=>s+p.stock,0);
  const low=products.filter(p=>p.stock<=10);
  const max=Math.max(1,...products.map(p=>p.stock));
  layout(`
    <div class="page-heading"><div><h1>Relatórios</h1><p>Visão geral de vendas e posição atual do estoque.</p></div><button class="btn btn-secondary" onclick="window.print()">Imprimir relatório</button></div>
    <div class="report-cards">
      <article class="stat-card"><div class="stat-top">Faturamento total</div><div class="stat-value">${money(total)}</div><div class="stat-note">Vendas registradas no sistema</div></article>
      <article class="stat-card"><div class="stat-top">Vendas realizadas</div><div class="stat-value">${sales.length}</div><div class="stat-note">Quantidade de operações</div></article>
      <article class="stat-card"><div class="stat-top">Unidades em estoque</div><div class="stat-value">${units}</div><div class="stat-note">${low.length} produto(s) precisam de atenção</div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><h2>Estoque por produto</h2><span>Unidades disponíveis</span></div>
        <div class="bar-list">${products.map(p=>`<div class="bar-item"><span>${escapeHTML(p.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${p.stock/max*100}%"></div></div><strong>${p.stock}</strong></div>`).join("")}</div>
      </section>
      <section class="panel"><div class="panel-header"><h2>Produtos que precisam de atenção</h2></div>
        ${low.length?low.map(p=>`<div class="cart-line"><div><strong>${escapeHTML(p.name)}</strong><small>${p.stock} unidade(s)</small></div>${stockBadge(p.stock)}</div>`).join(""):'<div class="empty-state">Nenhum alerta de estoque.</div>'}
      </section>
    </div>
    <section class="panel" style="margin-top:18px"><div class="panel-header"><h2>Histórico de vendas</h2></div><div class="table-wrap"><table><thead><tr><th>Código</th><th>Data</th><th>Quantidade de itens</th><th>Valor total</th></tr></thead><tbody>${sales.slice().reverse().map(s=>`<tr><td>#${s.id}</td><td>${new Date(s.date).toLocaleString("pt-BR")}</td><td>${s.items.reduce((n,i)=>n+i.quantity,0)}</td><td><strong>${money(s.total)}</strong></td></tr>`).join("")||'<tr><td colspan="4" class="empty-state">Nenhuma venda registrada.</td></tr>'}</tbody></table></div></section>`, "Relatórios");
}
({dashboard:renderDashboard,produtos:renderProducts,vendas:renderSales,relatorios:renderReports}[currentPage]||renderDashboard)();
