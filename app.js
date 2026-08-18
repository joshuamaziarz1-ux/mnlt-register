document.documentElement.setAttribute('data-js','on');
window.addEventListener('error', function(e){
  console.log('Register error:', e.message);
});
let order=[],selectedPlate=0,cashText='',currentReceiptId=0,toastTimer=null;
let data;
try{data=JSON.parse(localStorage.getItem('mnltRegisterV11')||'null')}catch(e){data=null}
if(!data||typeof data!=='object')data={chicken:0,rice:0,receipts:[]};
data.chicken=Number.isFinite(Number(data.chicken))?Number(data.chicken):0;
data.rice=Number.isFinite(Number(data.rice))?Number(data.rice):0;
data.receipts=Array.isArray(data.receipts)?data.receipts:[];
data.dayId=Number.isFinite(Number(data.dayId))&&Number(data.dayId)>0?Number(data.dayId):1;
data.dayStartedAt=data.dayStartedAt||new Date().toLocaleString();
data.closedDays=Array.isArray(data.closedDays)?data.closedDays:[];
data.receipts.forEach(r=>{
  if(!Number.isFinite(Number(r.dayId)))r.dayId=data.dayId;
  if(typeof r.voided!=='boolean')r.voided=false;
});

const money=n=>'$'+(Number.isFinite(Number(n))?Number(n):0).toFixed(2);
const plateTotal=p=>7+(Number(p.extraChicken)||0)*2+(Number(p.doubleRice)||0);
const orderTotal=()=>order.reduce((sum,x)=>sum+(x.type==='plate'?plateTotal(x):(Number(x.price)||0)*(Number(x.qty)||0)),0);
const receiptRef=id=>'R-'+String(Number(id)||0).padStart(4,'0');
const nextReceiptId=()=>data.receipts.reduce((max,r)=>Math.max(max,Number(r.id)||0),0)+1;
const sauceName=x=>(x&&x.sauce)?(x.sauce==='None'?'No Sauce':x.sauce):'No Sauce';
const receiptSauceName=x=>(x&&x.sauce)?x.sauce:'None';
const sauceButtons=(i,current,handler)=>['None','Hot','BBQ','Ranch','Teriyaki'].map(s=>`<button class="${current===s?'active':''}" onclick="event.stopPropagation();${handler}(${i},'${s}')">${s==='None'?'NO SAUCE':s.toUpperCase()}</button>`).join('');

function save(){localStorage.setItem('mnltRegisterV11',JSON.stringify(data))}
function showToast(message){
 const el=document.getElementById('toast');
 if(!el)return;
 el.textContent=message;
 el.classList.add('show');
 clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>el.classList.remove('show'),1900);
}
function addPlate(){order.push({type:'plate',extraChicken:0,doubleRice:0,sauce:'None'});selectedPlate=order.length-1;render()}
function addExtraItem(type){
 if(!order.length){addPlate();return}
 if(type==='chicken')order[selectedPlate].extraChicken++;
 else order[selectedPlate].doubleRice++;
 render();
}
function addAla(type){
 const existing=order.find(x=>x.type==='ala'&&x.item===type);
 if(existing){
   existing.qty=(Number(existing.qty)||0)+1;
 }else{
   order.push({type:'ala',item:type,price:type==='chicken'?4:2,qty:1,sauce:type==='chicken'?'None':null});
 }
 render();
}
function removePlate(i){order.splice(i,1);selectedPlate=Math.min(selectedPlate,Math.max(0,order.length-1));render()}
function removeAla(i){
 if(order[i]&&order[i].type==='ala'){
   order[i].qty=(Number(order[i].qty)||0)-1;
   if(order[i].qty<=0)order.splice(i,1);
 }
 render();
}
function selectPlate(i){selectedPlate=i;render()}
function setPlateSauce(i,sauce){if(order[i]&&order[i].type==='plate'){order[i].sauce=sauce;render()}}
function setAlaSauce(i,sauce){if(order[i]&&order[i].type==='ala'&&order[i].item==='chicken'){order[i].sauce=sauce;render()}}

function render(){
 let html='';
 order.forEach((x,i)=>{
   if(x.type==='plate'){
     const sauce=sauceName(x);
     html+=`<div class="plate ${i===selectedPlate?'selected':''}" onclick="selectPlate(${i})">
       <div>
         <div class="title">PLATE #${plateNumber(i)} — ${money(plateTotal(x))}</div>
         <div class="detail">Includes: 1 chicken + 1 rice</div>
         <div class="extrasline">Extras: ${x.extraChicken?(x.extraChicken+' extra chicken'):''}${x.extraChicken&&x.doubleRice?' • ':''}${x.doubleRice?'Double Rice':(!x.extraChicken?'none':'')}</div>
         <div class="sauceLine">Sauce: <b>${sauce}</b> <span>FREE</span></div>
         <div class="sauceButtons">${sauceButtons(i,x.sauce,'setPlateSauce')}</div>
       </div>
       <div class="pbuttons">
         <button class="add" onclick="event.stopPropagation();selectPlate(${i});addExtraItem('chicken')">+CHICKEN</button>
         <button class="add" onclick="event.stopPropagation();selectPlate(${i});addExtraItem('rice')">+RICE</button>
         <button onclick="event.stopPropagation();removePlate(${i})">✕</button>
       </div>
     </div>`;
   }else{
     const itemName=x.item==='chicken'?'CHICKEN':'RICE';
     const sauce=x.item==='chicken'?sauceName(x):null;
     html+=`<div class="item">
       <div>
         <div class="itemTitle">À LA CARTE ${itemName} — ${money((Number(x.price)||0)*(Number(x.qty)||0))}</div>
         <div class="itemDetail">Includes: ${Number(x.qty)||0} ${x.item}${(Number(x.qty)||0)===1?'':' portions'}</div>
         ${x.item==='chicken'?`<div class="sauceLine">Sauce: <b>${sauce}</b> <span>FREE</span></div><div class="sauceButtons">${sauceButtons(i,x.sauce,'setAlaSauce')}</div>`:''}
       </div>
       <div class="pbuttons"><button onclick="removeAla(${i})">−1</button></div>
     </div>`;
   }
 });
 document.getElementById('orderList').innerHTML=html||'<div style="text-align:center;color:#777;padding:35px">Tap an item to start an order.</div>';
 document.getElementById('selectedText').textContent=order.some(x=>x.type==='plate')?'• Plate '+plateNumber(selectedPlate)+' selected':'';
 document.getElementById('total').textContent=money(orderTotal());
 updateCash();
 updateInventory();
 updateReceipts();
}
function plateNumber(index){
 let n=0;for(let i=0;i<=index;i++)if(order[i].type==='plate')n++;
 return n;
}
function inventoryCounts(items){
 let chicken=0,rice=0;
 (Array.isArray(items)?items:[]).forEach(x=>{
   if(x.type==='plate'){
     chicken+=1+(Number(x.extraChicken)||0);
     rice+=1+(x.doubleRice?1:0);
   }else if(x.type==='ala'){
     if(x.item==='chicken')chicken+=Number(x.qty)||0;
     else if(x.item==='rice')rice+=Number(x.qty)||0;
   }
 });
 return{chicken,rice};
}
function receiptSauceCounts(r){
 const counts={Hot:0,BBQ:0,Ranch:0,Teriyaki:0,None:0};
 (Array.isArray(r.order)?r.order:[]).forEach(x=>{
   if(x.type==='plate'){
     const s=receiptSauceName(x);
     const qty=1+(Number(x.extraChicken)||0);
     counts[s]=(counts[s]||0)+qty;
   }else if(x.type==='ala'&&x.item==='chicken'){
     const s=receiptSauceName(x);
     counts[s]=(counts[s]||0)+(Number(x.qty)||0);
   }
 });
 return counts;
}
function receiptSauceSummary(r){
 const counts=receiptSauceCounts(r);
 const labels=[];
 ['Hot','BBQ','Ranch','Teriyaki','None'].forEach(s=>{
   if(counts[s])labels.push((s==='None'?'No Sauce':s)+(counts[s]>1?' x'+counts[s]:''));
 });
 return labels.join(' • ')||'No chicken sauce';
}
function dayStats(dayId){
 const receipts=data.receipts.filter(r=>Number(r.dayId)===Number(dayId)&&!r.voided);
 let sales=0,chicken=0,rice=0;
 const sauces={Hot:0,BBQ:0,Ranch:0,Teriyaki:0,None:0};
 receipts.forEach(r=>{
   sales+=Number(r.total)||0;
   const used=inventoryCounts(r.order);chicken+=used.chicken;rice+=used.rice;
   const sc=receiptSauceCounts(r);Object.keys(sauces).forEach(k=>sauces[k]+=Number(sc[k])||0);
 });
 return{orders:receipts.length,sales,chicken,rice,sauces};
}
function updateInventory(){
 document.getElementById('chCount').textContent=data.chicken;
 document.getElementById('riceCount').textContent=data.rice;
 [['chBox',data.chicken],['riceBox',data.rice]].forEach(([id,n])=>{
   document.getElementById(id).className='box stock '+(n<=0?'out':n<=10?'low':'');
 });
 const today=dayStats(data.dayId);
 document.getElementById('revenue').textContent=money(today.sales);
 document.getElementById('orders').textContent=today.orders+' order'+(today.orders===1?'':'s');
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
 if(document.getElementById('mainCashDisplay'))document.getElementById('mainCashDisplay').textContent=money(c)+' Received';
 const changeAmount=Math.max(0,c-orderTotal());
 if(document.getElementById('mainChangeDisplay'))document.getElementById('mainChangeDisplay').textContent='CHANGE: '+money(changeAmount);
 document.getElementById('changeDisplay').textContent='Change: '+money(changeAmount);
}
function completeSale(){
 const totalAmount=orderTotal(),cash=parseFloat(cashText)||0;
 if(!order.length){alert('There is nothing in the current order.');return}
 if(cash<totalAmount){alert('Cash received is less than the total.');return}
 const need=inventoryCounts(order);
 if(data.chicken<need.chicken||data.rice<need.rice){alert('Not enough inventory. Add inventory before completing this sale.');return}
 data.chicken-=need.chicken;data.rice-=need.rice;
 const receipt={
   id:nextReceiptId(),dayId:data.dayId,time:new Date().toLocaleString(),
   order:JSON.parse(JSON.stringify(order)),total:totalAmount,cash,change:cash-totalAmount,voided:false
 };
 data.receipts.push(receipt);
 save();
 order=[];selectedPlate=0;cashText='';closeCash();render();
 showToast('SALE COMPLETE — '+receiptRef(receipt.id));
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
function findReceipt(){
 const input=document.getElementById('receiptFind');
 const digits=(input&&input.value?input.value:'').replace(/\D/g,'');
 if(!digits){alert('Enter a receipt number.');return}
 const id=Number(digits);
 const r=data.receipts.find(x=>(Number(x.id)||0)===id);
 if(!r){alert('Receipt '+receiptRef(id)+' was not found.');return}
 showReceipt(r);
}
function showReceipt(r){
 let body='';
 let plateNo=0;
 const items=Array.isArray(r.order)?r.order:[];
 items.forEach(x=>{
   if(x.type==='plate'){
     plateNo++;
     body+=`<div><b>Plate #${plateNo}</b><span style="float:right">${money(plateTotal(x))}</span><br><span style="font-weight:700">Includes:</span> 1 chicken + 1 rice<br><span style="font-weight:700">Extras:</span> ${x.extraChicken?(x.extraChicken+' extra chicken'):''}${x.extraChicken&&x.doubleRice?' • ':''}${x.doubleRice?'Double Rice':(!x.extraChicken?'none':'')}<br><span style="font-weight:700">Sauce:</span> ${receiptSauceName(x)}</div><br>`;
   }else{
     const itemName=x.item==='chicken'?'CHICKEN':'RICE';
     body+=`<div><b>À LA CARTE ${itemName}</b><span style="float:right">${money((Number(x.price)||0)*(Number(x.qty)||0))}</span><br>Qty: ${Number(x.qty)||0}${x.item==='chicken'?'<br><span style="font-weight:700">Sauce:</span> '+receiptSauceName(x):''}</div><br>`;
   }
 });
 const ref=receiptRef(r.id);
 const voidMark=r.voided?'<div style="text-align:center;background:#b52b22;color:#fff;font-weight:900;padding:6px;border-radius:6px;margin:6px 0">VOIDED</div>':'';
 document.getElementById('receiptPaper').innerHTML='<h3>MNLT MARKET<br>SMOKED CHICKEN</h3><div style="text-align:center;font-size:20px;font-weight:900;margin:7px 0">RECEIPT '+ref+'</div>'+voidMark+'<div style="text-align:center">'+r.time+'</div><hr>'+body+'<hr><div class="rline"><b>TOTAL</b><b>'+money(r.total)+'</b></div><div class="rline">Cash <span>'+money(r.cash)+'</span></div><div class="rline">Change <span>'+money(r.change)+'</span></div><hr><div style="text-align:center;font-weight:900">REFERENCE: '+ref+'</div>';
 currentReceiptId=Number(r.id)||0;
 const voidBtn=document.getElementById('voidReceiptButton');
 if(voidBtn)voidBtn.style.display=r.voided?'none':'block';
 document.getElementById('receiptModal').classList.add('show');
}
function closeReceipt(){document.getElementById('receiptModal').classList.remove('show');currentReceiptId=0}
function voidCurrentReceipt(){
 const r=data.receipts.find(x=>(Number(x.id)||0)===Number(currentReceiptId));
 if(!r||r.voided)return;
 if(!confirm('Void '+receiptRef(r.id)+'? This will return its chicken and rice to inventory and remove the sale from the day total.'))return;
 const used=inventoryCounts(r.order);
 data.chicken+=used.chicken;data.rice+=used.rice;
 r.voided=true;r.voidedAt=new Date().toLocaleString();
 const closed=data.closedDays.find(d=>Number(d.dayId)===Number(r.dayId));
 if(closed)closed.summary=dayStats(r.dayId);
 save();render();showReceipt(r);showToast('VOIDED — '+receiptRef(r.id));
}
function showLastReceipt(){if(data.receipts.length)showReceipt(data.receipts[data.receipts.length-1]);else alert('No receipts yet.')}
function updateReceipts(){
 const currentDayReceipts=data.receipts.filter(r=>Number(r.dayId)===Number(data.dayId));
 document.getElementById('receiptList').innerHTML=currentDayReceipts.slice().reverse().slice(0,40).map(r=>`
 <div class="receipt ${r.voided?'voided':''}"><div><b style="font-size:15px">${receiptRef(r.id)}</b>${r.voided?'<span class="voidBadge">VOID</span>':''}<br><span>${r.time}</span><br><span>${receiptSummary(r)}</span><div class="receiptSauce">${receiptSauceSummary(r)}</div></div>
 <div><b>${money(r.total)}</b><br><button onclick="showReceiptById(${Number(r.id)||0})">VIEW</button></div></div>`).join('')
 ||'<div style="text-align:center;color:#777;padding:30px">No receipts for this day yet.</div>';
}

function openDayClose(){
 if(order.length){alert('Finish or remove the current order before closing the day.');return}
 const s=dayStats(data.dayId);
 const sauceParts=[];
 [['Hot','Hot'],['BBQ','BBQ'],['Ranch','Ranch'],['Teriyaki','Teriyaki'],['None','No Sauce']].forEach(([key,label])=>sauceParts.push(`<div class="row"><span>${label}</span><b>${s.sauces[key]||0}</b></div>`));
 document.getElementById('daySummary').innerHTML=`<h3>END OF DAY</h3><div style="text-align:center;font-size:11px;margin-bottom:8px">Started: ${data.dayStartedAt}</div><div class="row"><span>Total Orders</span><b>${s.orders}</b></div><div class="row"><span>Sales</span><b>${money(s.sales)}</b></div><div class="row"><span>Chicken Used</span><b>${s.chicken}</b></div><div class="row"><span>Rice Used</span><b>${s.rice}</b></div><div style="font-weight:900;margin-top:9px">SAUCES</div>${sauceParts.join('')}`;
 document.getElementById('dayModal').classList.add('show');
}
function closeDayModal(){document.getElementById('dayModal').classList.remove('show')}
function confirmCloseDay(){
 const oldDay=data.dayId;
 const summary=dayStats(oldDay);
 const dayReceipts=data.receipts.filter(r=>Number(r.dayId)===Number(oldDay));
 const receiptIds=dayReceipts.map(r=>Number(r.id)||0).filter(Boolean);
 data.closedDays.push({dayId:oldDay,started:data.dayStartedAt,closed:new Date().toLocaleString(),summary,receiptIds});
 data.dayId=oldDay+1;
 data.dayStartedAt=new Date().toLocaleString();
 const findBox=document.getElementById('receiptFind');
 if(findBox)findBox.value='';
 save();closeDayModal();render();showToast('DAY CLOSED — '+receiptIds.length+' RECEIPTS SAVED');
}

save();
render();

if('serviceWorker'in navigator){
 window.addEventListener('load',async function(){
   try{
     const reg=await navigator.serviceWorker.register('./service-worker.js?v=29',{updateViaCache:'none'});
     await reg.update();
   }catch(err){console.log('Service worker registration failed:',err)}
 });
}