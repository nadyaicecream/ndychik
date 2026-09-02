let state;
const orders=[
 {qty:2, reward:15000, text:"Pelanggan membutuhkan 2 ekor ayam."},
 {qty:3, reward:21000, text:"Pelanggan membutuhkan 3 ekor ayam."},
 {qty:1, reward:8000, text:"Pelanggan membutuhkan 1 ekor ayam."},
 {qty:4, reward:28000, text:"Pelanggan membutuhkan 4 ekor ayam."}
];
let order;

const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active")}
function rupiah(n){return "Rp"+n.toLocaleString("id-ID")}

$("start").onclick=()=>startGame();
$("again").onclick=()=>startGame();

function startGame(){
 state={money:100000,stock:10,rep:70,level:1,day:1,served:0};
 show("game"); newOrder(); update();
}
function update(){
 $("money").textContent=rupiah(state.money);$("stock").textContent=state.stock+" ekor";
 $("rep").textContent=state.rep+"%";$("level").textContent=state.level;$("day").textContent=state.day;
}
function newOrder(){
 order=orders[Math.floor(Math.random()*orders.length)];
 $("orderTitle").textContent="Pesanan "+order.qty+" Ekor";
 $("orderText").textContent=order.text;
 $("bubble").textContent="Kak, saya mau "+order.qty+" ekor ayam ya!";
 $("feedback").textContent="";
 $("orderButtons").innerHTML=`
 <button class="choice" data-action="correct">🐔 Siapkan ${order.qty} ekor</button>
 <button class="choice" data-action="more">🐔 Siapkan ${order.qty+1} ekor</button>
 <button class="choice" data-action="less">🐔 Siapkan ${Math.max(1,order.qty-1)} ekor</button>`;
 document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>serve(b.dataset.action));
}
function serve(action){
 if(state.stock<=0){feedback("Stok habis! Beli stok dulu 📦",false);return}
 if(action==="correct"){
   if(state.stock<order.qty){feedback("Stok tidak cukup. Beli stok dulu!",false);return}
   state.stock-=order.qty; state.money+=order.reward; state.rep=Math.min(100,state.rep+4); state.served++;
   feedback("Pesanan tepat! Pelanggan puas 😊 +"+rupiah(order.reward),true);
 }else if(action==="more"){
   const q=order.qty+1;
   if(state.stock<q){feedback("Stok tidak cukup!",false);return}
   state.stock-=q;state.money+=order.reward;state.rep=Math.max(0,state.rep-2);state.served++;
   feedback("Ups, kelebihan satu. Tetap dibayar sesuai pesanan 😅",false);
 }else{
   const q=Math.max(1,order.qty-1);
   if(state.stock<q){feedback("Stok tidak cukup!",false);return}
   state.stock-=q;state.money+=Math.floor(order.reward*.5);state.rep=Math.max(0,state.rep-7);state.served++;
   feedback("Pesanan kurang, pelanggan agak kecewa 😅",false);
 }
 update();
 if(state.served>=5){setTimeout(endDay,700)}else{setTimeout(newOrder,800)}
}
function feedback(t,good){
 $("feedback").textContent=t;$("feedback").className="feedback "+(good?"good":"bad");
}
$("buy").onclick=()=>{
 const cost=25000;
 if(state.money<cost){feedback("Uang belum cukup untuk membeli stok.",false);return}
 state.money-=cost;state.stock+=5;feedback("Berhasil membeli 5 ekor stok! 📦",true);update();
};
function endDay(){
 if(state.rep>=85)state.money+=15000;
 if(state.money>=140000)state.level=2;
 if(state.money>=190000)state.level=3;
 $("finalMoney").textContent=rupiah(state.money);$("finalRep").textContent=state.rep+"%";$("finalLevel").textContent=state.level;
 $("resultText").textContent=state.rep>=85?"Toko kamu makin dipercaya pelanggan. Pertahankan pelayanan yang ramah! 🌟":
 "Lumayan! Atur stok dan layani pesanan dengan lebih teliti supaya toko makin maju. 💪";
 show("result");
}
