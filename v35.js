// v35 — remove live inventory tracking while preserving register, receipts, saved days and dual orientation.
(function(){
  if(window.__MNLT_V35_LOADED__)return;
  window.__MNLT_V35_LOADED__=true;

  const css=`
    .inventory.todayOnly h2,#chBox,#riceBox{display:none!important}
    .inventory.todayOnly{padding:4px!important;min-height:0!important}
    .inventory.todayOnly .invgrid{display:block!important;min-height:0!important}
    .inventory.todayOnly .invgrid>.box{display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:6px!important;width:100%!important;min-height:48px!important;padding:6px!important}
    .inventory.todayOnly .invgrid>.box>b{text-align:center!important;margin:0!important}
    .inventory.todayOnly .dayActions{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;flex-wrap:wrap!important}
    .savedDayEnding{display:none!important}

    html.galaxy-landscape .right{grid-template-rows:62px minmax(0,1fr)!important}
    html.galaxy-landscape .inventory.todayOnly{height:62px!important}
    html.galaxy-landscape .inventory.todayOnly .invgrid>.box{min-height:52px!important;padding:4px 6px!important}
    html.galaxy-landscape .inventory.todayOnly .invgrid>.box small{font-size:8px!important}
    html.galaxy-landscape .inventory.todayOnly .invgrid>.box b{font-size:17px!important}
    html.galaxy-landscape .inventory.todayOnly .dayActions button{font-size:7px!important;padding:4px 5px!important}

    html.galaxy-portrait .right{grid-template-rows:72px minmax(0,1fr)!important}
    html.galaxy-portrait .inventory.todayOnly{height:72px!important}
    html.galaxy-portrait .inventory.todayOnly .invgrid>.box{min-height:60px!important;padding:5px 7px!important}
    html.galaxy-portrait .inventory.todayOnly .invgrid>.box small{font-size:9px!important}
    html.galaxy-portrait .inventory.todayOnly .invgrid>.box b{font-size:19px!important}
  `;
  const style=document.createElement('style');
  style.id='v35-no-inventory';
  style.textContent=css;
  document.head.appendChild(style);

  // Replace the old inventory updater with today-only totals.
  updateInventory=function(){
    const today=dayStats(data.dayId);
    const revenue=document.getElementById('revenue');
    const orders=document.getElementById('orders');
    if(revenue)revenue.textContent=money(today.sales);
    if(orders)orders.textContent=today.orders+' order'+(today.orders===1?'':'s');
  };

  // Checkout no longer checks, subtracts or depends on food inventory.
  completeSale=function(){
    const totalAmount=orderTotal(),cash=parseFloat(cashText)||0;
    if(!order.length){alert('There is nothing in the current order.');return}
    if(cash<totalAmount){alert('Cash received is less than the total.');return}

    const existingMax=data.receipts.reduce((max,r)=>Math.max(max,Number(r.id)||0),0);
    data.lastReceiptId=Math.max(Number(data.lastReceiptId)||0,existingMax);
    const receiptId=data.lastReceiptId+1;
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
    order=[];selectedPlate=0;cashText='';closeCash();render();
    showToast('SALE COMPLETE — '+receiptRef(receipt.id));
  };

  // Voiding affects sales totals only; there is no inventory to return.
  voidCurrentReceipt=function(){
    const r=data.receipts.find(x=>(Number(x.id)||0)===Number(currentReceiptId));
    if(!r||r.voided)return;
    if(!confirm('Void '+receiptRef(r.id)+'? This will remove the sale from the day total.'))return;
    r.voided=true;
    r.voidedAt=new Date().toLocaleString();
    const closed=data.closedDays.find(d=>Number(d.dayId)===Number(r.dayId));
    if(closed)closed.summary=dayStats(r.dayId);
    save();render();showReceipt(r);showToast('VOIDED — '+receiptRef(r.id));
  };

  // Closing the day saves receipts/day totals but no longer resets or mentions inventory.
  confirmCloseDay=function(){
    const oldDay=data.dayId;
    const summary=dayStats(oldDay);
    const dayReceipts=data.receipts.filter(r=>Number(r.dayId)===Number(oldDay));
    const receiptIds=dayReceipts.map(r=>Number(r.id)||0).filter(Boolean);
    data.closedDays.push({
      dayId:oldDay,
      started:data.dayStartedAt,
      closed:new Date().toLocaleString(),
      summary,
      receiptIds
    });
    data.dayId=oldDay+1;
    data.dayStartedAt=new Date().toLocaleString();
    const findBox=document.getElementById('receiptFind');
    if(findBox)findBox.value='';
    save();closeDayModal();render();showToast('DAY CLOSED — '+receiptIds.length+' RECEIPTS SAVED');
  };

  function removeInventoryUI(){
    const inventory=document.querySelector('.inventory');
    if(!inventory)return;
    inventory.classList.add('todayOnly');
    const heading=inventory.querySelector('h2');
    if(heading)heading.remove();
    const chicken=document.getElementById('chBox');
    const rice=document.getElementById('riceBox');
    if(chicken)chicken.remove();
    if(rice)rice.remove();
  }

  function applyV35(){
    removeInventoryUI();
    document.title='MNLT Market Smoked Chicken - Register v35';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v35';
    render();
  }

  applyV35();
  window.addEventListener('load',()=>{
    applyV35();
    setTimeout(applyV35,250);
    setTimeout(async()=>{
      try{
        if('serviceWorker' in navigator){
          const reg=await navigator.serviceWorker.register('./service-worker.js?v=35',{updateViaCache:'none'});
          await reg.update();
        }
      }catch(e){console.log('v35 service worker update failed:',e)}
    },900);
  });
})();
