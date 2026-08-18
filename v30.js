// v30 additions — keep the v29 register intact and add saved-day browsing + daily inventory reset.

const showReceiptV29=showReceipt;
showReceipt=function(r){
  showReceiptV29(r);
  const receiptModal=document.getElementById('receiptModal');
  if(receiptModal)receiptModal.style.zIndex='30';
  const voidBtn=document.getElementById('voidReceiptButton');
  if(voidBtn&&Number(r.dayId)!==Number(data.dayId))voidBtn.style.display='none';
};

function savedDayReceiptIds(day){
  if(Array.isArray(day.receiptIds)&&day.receiptIds.length)return day.receiptIds.map(Number).filter(Boolean);
  return data.receipts.filter(r=>Number(r.dayId)===Number(day.dayId)).map(r=>Number(r.id)||0).filter(Boolean);
}

function openSavedDays(){
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
      </div>`;
    }).join('');
  }
  document.getElementById('savedDaysModal').classList.add('show');
}

function closeSavedDays(){
  document.getElementById('savedDaysModal').classList.remove('show');
}

confirmCloseDay=function(){
  const oldDay=data.dayId;
  const summary=dayStats(oldDay);
  const dayReceipts=data.receipts.filter(r=>Number(r.dayId)===Number(oldDay));
  const receiptIds=dayReceipts.map(r=>Number(r.id)||0).filter(Boolean);
  const endingInventory={chicken:Number(data.chicken)||0,rice:Number(data.rice)||0};
  data.closedDays.push({
    dayId:oldDay,
    started:data.dayStartedAt,
    closed:new Date().toLocaleString(),
    summary,
    receiptIds,
    endingInventory
  });
  data.dayId=oldDay+1;
  data.dayStartedAt=new Date().toLocaleString();
  data.chicken=0;
  data.rice=0;
  const findBox=document.getElementById('receiptFind');
  if(findBox)findBox.value='';
  save();
  closeDayModal();
  render();
  showToast('DAY CLOSED — RECEIPTS SAVED — INVENTORY RESET');
};

if('serviceWorker'in navigator){
  window.addEventListener('load',async function(){
    try{
      const reg=await navigator.serviceWorker.register('./service-worker.js?v=30',{updateViaCache:'none'});
      await reg.update();
    }catch(err){console.log('v30 service worker registration failed:',err)}
  });
}
