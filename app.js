document.documentElement.setAttribute('data-js','on');
window.addEventListener('error', function(e){
  console.log('Register error:', e.message);
});
let order=[],selectedPlate=0,cashText='';
let data;
try{data=JSON.parse(localStorage.getItem('mnltRegisterV11')||'null')}catch(e){data=null}
if(!data||typeof data!=='object')data={chicken:0,rice:0,receipts:[]};
data.chicken=Number.isFinite(Number(data.chicken))?Number(data.chicken):0;
data.rice=Number.isFinite(Number(data.rice))?Number(data.rice):0;
data.receipts=Array.isArray(data.receipts)?data.receipts:[];

const money=n=>'$'+(Number.isFinite(Number(n))?Number(n):0).toFixed(2);
const plateTotal=p=>7+(Number(p.extraChicken)||0)*2+(Number(p.doubleRice)||0);
const orderTotal=()=>order.reduce((sum,x)=>sum+(x.type==='plate'?plateTotal(x):(Number(x.price)||0)*(Number(x.qty)||0)),0);
const receiptRef=id=>'R-'+String(Number(id)||0).padStart(4,'0');
const nextReceiptId=()=>data.receipts.reduce((max,r)=>Math.max(max,Number(r.id)||0),0)+1;

function save(){localStorage.setItem('mnltRegisterV11',JSON.stringify(data))}
function addPlate(){order.push({type:'plate',extraChicken:0,doubleRice:0});selectedPlate=order.length-1;render()}
function addExtraItem(type){
 if(!order.length){addPlate();return}
 if(type==='chicken')order[selectedPlate].extraChicken++;
 else order[selectedPlate].doubleRice++;
 render();
}
function addAla(type){
 const existing = order.find(x=>x.type==='ala' && x.item===type);
 if(existing){
   existing.qty = (Number(existing.qty)||0) + 1;
 }else{
   order.push({type:'ala',item:type,price:type==='chicken'?4:2,qty:1});
 }
 render();
}
function removePlate(i){order.splice(i,1);selectedPlate=Math.min(selectedPlate,Math.max(0,order.length-1));render()}
function removeAla(i){
 if(order[i] && order[i].type==='ala'){
   order[i].qty = (Number(order[i].qty)||0) - 1;
   if(order[i].qty<=0) order.splice(i,1);
 }
 render();
}
function selectPlate(i){selectedPlate=i;render()}

function render(){
 let html='';
 order.forEach((x,i)=>{
   if(x.type==='plate'){
     html+=`<div class="plate ${i===selectedPlate?'selected':''}" onclick="selectPlate(${i})">
       <div>
         <div class="title">PLATE #${plateNumber(i)} — ${money(plateTotal(x))}</div>
         <div class="detail">Includes: 1 chicken + 1 rice</div>
         <div class="extrasline">Extras: ${x.extraChicken ? (x.extraChicken+' extra chicken') : ''}${x.extraChicken && x.doubleRice ? ' • ' : ''}${x.doubleRice ? 'Double Rice' : (!x.extraChicken ? 'none' : '')}</div>
       </div>
       <div class="pbuttons">
         <button class="add" onclick="event.stopPropagation();selectPlate(${i});addExtraItem('chicken')">+CHICKEN</button>
         <button class="add" onclick="event.stopPropagation();selectPlate(${i});addExtraItem('rice')">+RICE</button>
         <button onclick="event.stopPropagation();removePlate(${i})">✕</button>
       </div>
     </div>`;
   }else{
     const itemName = x.item==='chicken'?'CHICKEN':'RICE';
     html+=`<div class="item">
       <div>
         <div class="itemTitle">À LA CARTE ${itemName} — ${money((Number(x.price)||0)*(Number(x.qty)||0))}</div>
         <div class="itemDetail">Includes: ${Number(x.qty)||0} ${x.item}${(Number(x.qty)||0)===1?'':' portions'}</div>
       </div>
       <div class="pbuttons">
         <button onclick="removeAla(${i})">−1</button>
       </div>
     </div>`;
   }
 });
 document.getElementById('orderList').innerHTML=html||'<div style="text-align:center;color:#777;padding:35px">Tap an item to start an order.</div>';
 document.getElementById('selectedText').textContent=order.some(x=>x.type==='plate')?'• Plate '+plateNumber(selectedPlate)+' selected':'';
 document.getElementById('total').textContent=money(orderTotal());
 updateCash();
 updateInventory();updateReceipts();
}
function plateNumber(index){
 let n=0;for(let i=0;i<=index;i++)if(order[i].type==='plate')n++;
 return n;
}
function updateInventory(){
 document.getElementById('chCount').textContent=data.chicken;
 document.getElementById('riceCount').textContent=data.rice;
 [['chBox',data.chicken],['riceBox',data.rice]].forEach(([id,n])=>{
   document.getElementById(id).className='box stock '+(n<=0?'out':n<=10?'low':'');
 });
 const revenue=data.receipts.reduce((s,r)=>s+(Number(r.total)||0),0);
 document.getElementById('revenue').textContent=money(revenue);
 document.getElementById('orders').textContent=data.receipts.length+' orders';
}
function adjust(type,n){data[type]=Math.max(0,data[type]+n);save();render()}

function quickCash(amount){if(!order.length)return;cashText=String(amount);updateCash()}
function exactCash(){if(order.length){cashText=orderTotal().toFixed(2);updateCash()}}
function openCash(){if(!order.length)return;cashText='';document.getElementById('cashModal').classList.add('show');updateCash()}
function closeCash(){document.getElementById('cashModal').classList.remove('show')}
function key(k){
 if(k==='C')cashText='';
 else if(k==='B')cashText=cashText.slice(0,-1);
 else if(k==='.'&&!cashText.includes('.'))cashText=cashText||'0';
 else if(k!=='.'||(cashText.split('.')[1]||'').length<2)cashText+=k;
 updateCash();
}
function updateCash(){
 const c=parseFloat(cashText)||0;
 document.getElementById('cashDisplay').textContent=money(c);
 if(document.getElementById('mainCashDisplay')) document.getElementById('mainCashDisplay').textContent=money(c)+' Received';
 const changeAmount=Math.max(0,c-orderTotal());
 if(document.getElementById('mainChangeDisplay')) document.getElementById('mainChangeDisplay').textContent='CHANGE: '+money(changeAmount);
 document.getElementById('changeDisplay').textContent='Change: '+money(changeAmount);
}

function completeSale(){
 const totalAmount=orderTotal(),cash=parseFloat(cashText)||0;
 if(!order.length){alert('There is nothing in the current order.');return}
 if(cash<totalAmount){alert('Cash received is less than the total.');return}

 let needChicken=0,needRice=0;
 order.forEach(x=>{
   if(x.type==='plate'){
     needChicken+=1+x.extraChicken;
     needRice+=1+(x.doubleRice?1:0);
   }else if(x.type==='ala'){
     if(x.item==='chicken')needChicken+=x.qty;
     else needRice+=x.qty;
   }
 });
 if(data.chicken<needChicken||data.rice<needRice){alert('Not enough inventory. Add inventory before completing this sale.');return}

 data.chicken-=needChicken;data.rice-=needRice;
 const receipt={
   id:nextReceiptId(),
   time:new Date().toLocaleString(),
   order:JSON.parse(JSON.stringify(order)),
   total:totalAmount,cash,change:cash-totalAmount
 };
 data.receipts.push(receipt);
 save();
 order=[];selectedPlate=0;cashText='';closeCash();render();
 showReceipt(receipt);
}

function receiptSummary(r){
 const items=Array.isArray(r.order)?r.order:[];
 const plates=items.filter(x=>x.type==='plate').length;
 const chicken=items.filter(x=>x.type==='ala'&&x.item==='chicken').reduce((s,x)=>s+(Number(x.qty)||0),0);
 const rice=items.filter(x=>x.type==='ala'&&x.item==='rice').reduce((s,x)=>s+(Number(x.qty)||0),0);
 const parts=[];
 if(plates)parts.push(plates+' plate'+(plates===1?'':'s'));
 if(chicken)parts.push(chicken+' chicken');
 if(rice)parts.push(rice+' rice');
 return parts.join(' • ')||'Order';
}

function showReceiptById(id){
 const r=data.receipts.find(x=>(Number(x.id)||0)===(Number(id)||0));
 if(r)showReceipt(r);
}

function showReceipt(r){
 let body='';
 let plateNo=0;
 const items=Array.isArray(r.order)?r.order:[];
 items.forEach(x=>{
   if(x.type==='plate'){
     plateNo++;
     body+=`<div><b>Plate #${plateNo}</b><span style="float:right">${money(plateTotal(x))}</span><br><span style="font-weight:700">Includes:</span> 1 chicken + 1 rice<br><span style="font-weight:700">Extras:</span> ${x.extraChicken ? (x.extraChicken+' extra chicken') : ''}${x.extraChicken && x.doubleRice ? ' • ' : ''}${x.doubleRice ? 'Double Rice' : (!x.extraChicken ? 'none' : '')}</div><br>`;
   }else{
     const itemName = x.item==='chicken'?'CHICKEN':'RICE';
     body+=`<div><b>À LA CARTE ${itemName}</b><span style="float:right">${money((Number(x.price)||0)*(Number(x.qty)||0))}</span><br>Qty: ${Number(x.qty)||0}</div><br>`;
   }
 });
 const ref=receiptRef(r.id);
 document.getElementById('receiptPaper').innerHTML='<h3>MNLT MARKET<br>SMOKED CHICKEN</h3><div style="text-align:center;font-size:20px;font-weight:900;margin:7px 0">RECEIPT '+ref+'</div><div style="text-align:center">'+r.time+'</div><hr>'+body+'<hr><div class="rline"><b>TOTAL</b><b>'+money(r.total)+'</b></div><div class="rline">Cash <span>'+money(r.cash)+'</span></div><div class="rline">Change <span>'+money(r.change)+'</span></div><hr><div style="text-align:center;font-weight:900">REFERENCE: '+ref+'</div>';
 document.getElementById('receiptModal').classList.add('show');
}
function closeReceipt(){document.getElementById('receiptModal').classList.remove('show')}
function showLastReceipt(){if(data.receipts.length)showReceipt(data.receipts[data.receipts.length-1]);else alert('No receipts yet.')}
function updateReceipts(){
 document.getElementById('receiptList').innerHTML=data.receipts.slice().reverse().slice(0,30).map(r=>`
 <div class="receipt"><div><b style="font-size:15px">${receiptRef(r.id)}</b><br><span>${r.time}</span><br><span>${receiptSummary(r)}</span></div>
 <div><b>${money(r.total)}</b><br><button onclick="showReceiptById(${Number(r.id)||0})">VIEW</button></div></div>`).join('')
 ||'<div style="text-align:center;color:#777;padding:30px">No receipts yet.</div>';
}
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function () {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js?v=23', { updateViaCache: 'none' });
      await reg.update();
    } catch (err) {
      console.log('Service worker registration failed:', err);
    }
  });
}