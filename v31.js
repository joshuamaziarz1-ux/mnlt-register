// v31 additions — delete saved days safely while preserving receipt-number sequence.

// Keep receipt numbers moving forward even if an archived day is deleted.
data.lastReceiptId=Math.max(
  Number(data.lastReceiptId)||0,
  ...data.receipts.map(r=>Number(r.id)||0)
);
save();

// Override checkout only to use the permanent receipt-number counter.
completeSale=function(){
  const totalAmount=orderTotal(),cash=parseFloat(cashText)||0;
  if(!order.length){alert('There is nothing in the current order.');return}
  if(cash<totalAmount){alert('Cash received is less than the total.');return}
  const need=inventoryCounts(order);
  if(data.chicken<need.chicken||data.rice<need.rice){alert('Not enough inventory. Add inventory before completing this sale.');return}

  data.chicken-=need.chicken;
  data.rice-=need.rice;
  const receiptId=(Number(data.lastReceiptId)||0)+1;
  data.lastReceiptId=receiptId;
  const receipt={
    id:receiptId,
    dayId:data.dayId,
    time:new Date().toLocaleString(),
    order:JSON.parse(JSON.stringify(order)),
    total:totalAmount,
    cash,
    change:cash-totalAmount,
    voided:false
  };
  data.receipts.push(receipt);
  save();
  order=[];
  selectedPlate=0;
  cashText='';
  closeCash();
  render();
  showToast('SALE COMPLETE — '+receiptRef(receipt.id));
};

function deleteSavedDay(dayId){
  const day=(Array.isArray(data.closedDays)?data.closedDays:[]).find(d=>Number(d.dayId)===Number(dayId));
  if(!day)return;
  const ids=savedDayReceiptIds(day);
  const label='Day '+(Number(day.dayId)||'');
  const count=ids.length;
  if(!confirm('Delete '+label+'? This will permanently delete the saved day and '+count+' receipt'+(count===1?'':'s')+'. This cannot be undone.'))return;

  data.closedDays=data.closedDays.filter(d=>Number(d.dayId)!==Number(dayId));
  data.receipts=data.receipts.filter(r=>Number(r.dayId)!==Number(dayId));
  save();
  render();
  openSavedDays();
  showToast(label.toUpperCase()+' DELETED');
}

// Replace the Saved Days view with the same v30 layout plus a DELETE DAY control.
openSavedDays=function(){
  const list=document.getElementById('savedDaysList');
  if(!list)return;
  const days=(Array.isArray(data.closedDays)?data.closedDays:[]).slice().reverse();
  if(!days.length){
    list.innerHTML='<div class="noSavedDays">No saved days yet.</div>';
  }else{
    list.innerHTML=days.map(day=>{
      const s=day.summary||dayStats(day.dayId);
      const ids=savedDayReceiptIds(day);
      const sauces=(s&&s.sauces)||{};
      const ending=day.endingInventory||{};
      const receipts=ids.length?ids.map(id=>`<button class="savedReceiptBtn" onclick="showReceiptById(${id})">${receiptRef(id)}</button>`).join(''):'<span class="noReceipts">No receipts</span>';
      return `<div class="savedDayCard">
        <div class="savedDayTop"><div><b>DAY ${Number(day.dayId)||''}</b><div class="savedDayDate">${day.started||''}</div></div><div class="savedDaySales">${money(s&&s.sales||0)}</div></div>
        <div class="savedDayStats"><span>${Number(s&&s.orders)||0} orders</span><span>${Number(s&&s.chicken)||0} chicken</span><span>${Number(s&&s.rice)||0} rice</span></div>
        <div class="savedDaySauces">Hot ${Number(sauces.Hot)||0} • BBQ ${Number(sauces.BBQ)||0} • Ranch ${Number(sauces.Ranch)||0} • Teriyaki ${Number(sauces.Teriyaki)||0} • No Sauce ${Number(sauces.None)||0}</div>
        ${Number.isFinite(Number(ending.chicken))||Number.isFinite(Number(ending.rice))?`<div class="savedDayEnding">Ending inventory before reset: ${Number(ending.chicken)||0} chicken • ${Number(ending.rice)||0} rice</div>`:''}
        <div class="savedDayReceiptLabel">RECEIPTS</div><div class="savedReceiptGrid">${receipts}</div>
        <div class="savedDayDeleteRow"><button class="deleteSavedDayBtn" onclick="deleteSavedDay(${Number(day.dayId)||0})">DELETE DAY</button></div>
      </div>`;
    }).join('');
  }
  document.getElementById('savedDaysModal').classList.add('show');
};

if('serviceWorker'in navigator){
  window.addEventListener('load',async function(){
    try{
      const reg=await navigator.serviceWorker.register('./service-worker.js?v=31',{updateViaCache:'none'});
      await reg.update();
    }catch(err){console.log('v31 service worker registration failed:',err)}
  });
}
