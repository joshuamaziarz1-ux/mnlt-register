// v36 — allow one or more sauces per chicken order. No Sauce remains the default.
(function(){
  if(window.__MNLT_V36_LOADED__)return;
  window.__MNLT_V36_LOADED__=true;

  const V36_SAUCES=['None','Hot','BBQ','Ranch','Teriyaki'];

  function v36SaucesFor(x){
    if(!x)return ['None'];
    let sauces=[];
    if(Array.isArray(x.sauces))sauces=x.sauces.filter(s=>V36_SAUCES.includes(s));
    if(!sauces.length&&x.sauce&&V36_SAUCES.includes(x.sauce))sauces=[x.sauce];
    sauces=sauces.filter((s,i,a)=>a.indexOf(s)===i);
    const real=sauces.filter(s=>s!=='None');
    return real.length?real:['None'];
  }

  function v36StoreSauces(x,sauces){
    const clean=(Array.isArray(sauces)?sauces:[]).filter(s=>V36_SAUCES.includes(s)&&s!=='None');
    const final=clean.length?V36_SAUCES.filter(s=>clean.includes(s)&&s!=='None'):['None'];
    x.sauces=final.slice();
    // Keep legacy field for backward compatibility with older saved data/code.
    x.sauce=final[0]||'None';
  }

  function v36SauceLabel(x){
    const sauces=v36SaucesFor(x);
    return sauces[0]==='None'?'No Sauce':sauces.join(' + ');
  }

  function v36ReceiptSauceLabel(x){
    const sauces=v36SaucesFor(x);
    return sauces[0]==='None'?'None':sauces.join(' + ');
  }

  function v36SauceButtons(i,x,handler){
    const current=v36SaucesFor(x);
    return V36_SAUCES.map(s=>{
      const active=current.includes(s);
      return `<button class="${active?'active':''}" onclick="event.stopPropagation();${handler}(${i},'${s}')">${s==='None'?'NO SAUCE':s.toUpperCase()}</button>`;
    }).join('');
  }

  function v36ToggleSauce(x,sauce){
    if(!x||!V36_SAUCES.includes(sauce))return;
    if(sauce==='None'){
      v36StoreSauces(x,[]);
      return;
    }
    let current=v36SaucesFor(x).filter(s=>s!=='None');
    if(current.includes(sauce))current=current.filter(s=>s!==sauce);
    else current.push(sauce);
    v36StoreSauces(x,current);
  }

  addPlate=function(){
    order.push({type:'plate',extraChicken:0,doubleRice:0,sauce:'None',sauces:['None']});
    selectedPlate=order.length-1;
    render();
  };

  addAla=function(type){
    const existing=order.find(x=>x.type==='ala'&&x.item===type);
    if(existing){
      existing.qty=(Number(existing.qty)||0)+1;
    }else{
      order.push({type:'ala',item:type,price:type==='chicken'?4:2,qty:1,sauce:type==='chicken'?'None':null,sauces:type==='chicken'?['None']:null});
    }
    render();
  };

  setPlateSauce=function(i,sauce){
    if(order[i]&&order[i].type==='plate'){
      v36ToggleSauce(order[i],sauce);
      render();
    }
  };

  setAlaSauce=function(i,sauce){
    if(order[i]&&order[i].type==='ala'&&order[i].item==='chicken'){
      v36ToggleSauce(order[i],sauce);
      render();
    }
  };

  render=function(){
    let html='';
    order.forEach((x,i)=>{
      if(x.type==='plate'){
        const sauce=v36SauceLabel(x);
        html+=`<div class="plate ${i===selectedPlate?'selected':''}" onclick="selectPlate(${i})">
          <div>
            <div class="title">PLATE #${plateNumber(i)} — ${money(plateTotal(x))}</div>
            <div class="detail">Includes: 1 chicken + 1 rice</div>
            <div class="extrasline">Extras: ${x.extraChicken?(x.extraChicken+' extra chicken'):''}${x.extraChicken&&x.doubleRice?' • ':''}${x.doubleRice?'Double Rice':(!x.extraChicken?'none':'')}</div>
            <div class="sauceLine">Sauce: <b>${sauce}</b> <span>FREE</span></div>
            <div class="sauceButtons">${v36SauceButtons(i,x,'setPlateSauce')}</div>
          </div>
          <div class="pbuttons">
            <button class="add" onclick="event.stopPropagation();selectPlate(${i});addExtraItem('chicken')">+CHICKEN</button>
            <button class="add" onclick="event.stopPropagation();selectPlate(${i});addExtraItem('rice')">+RICE</button>
            <button onclick="event.stopPropagation();removePlate(${i})">✕</button>
          </div>
        </div>`;
      }else{
        const itemName=x.item==='chicken'?'CHICKEN':'RICE';
        const sauce=x.item==='chicken'?v36SauceLabel(x):null;
        html+=`<div class="item">
          <div>
            <div class="itemTitle">À LA CARTE ${itemName} — ${money((Number(x.price)||0)*(Number(x.qty)||0))}</div>
            <div class="itemDetail">Includes: ${Number(x.qty)||0} ${x.item}${(Number(x.qty)||0)===1?'':' portions'}</div>
            ${x.item==='chicken'?`<div class="sauceLine">Sauce: <b>${sauce}</b> <span>FREE</span></div><div class="sauceButtons">${v36SauceButtons(i,x,'setAlaSauce')}</div>`:''}
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
  };

  receiptSauceCounts=function(r){
    const counts={Hot:0,BBQ:0,Ranch:0,Teriyaki:0,None:0};
    (Array.isArray(r.order)?r.order:[]).forEach(x=>{
      if(x.type==='plate'){
        const qty=1+(Number(x.extraChicken)||0);
        v36SaucesFor(x).forEach(s=>{counts[s]=(counts[s]||0)+qty;});
      }else if(x.type==='ala'&&x.item==='chicken'){
        const qty=Number(x.qty)||0;
        v36SaucesFor(x).forEach(s=>{counts[s]=(counts[s]||0)+qty;});
      }
    });
    return counts;
  };

  receiptSauceSummary=function(r){
    const counts=receiptSauceCounts(r);
    const labels=[];
    ['Hot','BBQ','Ranch','Teriyaki','None'].forEach(s=>{
      if(counts[s])labels.push((s==='None'?'No Sauce':s)+(counts[s]>1?' x'+counts[s]:''));
    });
    return labels.join(' • ')||'No chicken sauce';
  };

  dayStats=function(dayId){
    const receipts=data.receipts.filter(r=>Number(r.dayId)===Number(dayId)&&!r.voided);
    let sales=0,chicken=0,rice=0;
    const sauces={Hot:0,BBQ:0,Ranch:0,Teriyaki:0,None:0};
    receipts.forEach(r=>{
      sales+=Number(r.total)||0;
      const used=inventoryCounts(r.order);chicken+=used.chicken;rice+=used.rice;
      const sc=receiptSauceCounts(r);
      Object.keys(sauces).forEach(k=>sauces[k]+=Number(sc[k])||0);
    });
    return{orders:receipts.length,sales,chicken,rice,sauces};
  };

  showReceipt=function(r){
    let body='';
    let plateNo=0;
    const items=Array.isArray(r.order)?r.order:[];
    items.forEach(x=>{
      if(x.type==='plate'){
        plateNo++;
        body+=`<div><b>Plate #${plateNo}</b><span style="float:right">${money(plateTotal(x))}</span><br><span style="font-weight:700">Includes:</span> 1 chicken + 1 rice<br><span style="font-weight:700">Extras:</span> ${x.extraChicken?(x.extraChicken+' extra chicken'):''}${x.extraChicken&&x.doubleRice?' • ':''}${x.doubleRice?'Double Rice':(!x.extraChicken?'none':'')}<br><span style="font-weight:700">Sauce:</span> ${v36ReceiptSauceLabel(x)}</div><br>`;
      }else{
        const itemName=x.item==='chicken'?'CHICKEN':'RICE';
        body+=`<div><b>À LA CARTE ${itemName}</b><span style="float:right">${money((Number(x.price)||0)*(Number(x.qty)||0))}</span><br>Qty: ${Number(x.qty)||0}${x.item==='chicken'?'<br><span style="font-weight:700">Sauce:</span> '+v36ReceiptSauceLabel(x):''}</div><br>`;
      }
    });
    const ref=receiptRef(r.id);
    const voidMark=r.voided?'<div style="text-align:center;background:#b52b22;color:#fff;font-weight:900;padding:6px;border-radius:6px;margin:6px 0">VOIDED</div>':'';
    document.getElementById('receiptPaper').innerHTML='<h3>MNLT MARKET<br>SMOKED CHICKEN</h3><div style="text-align:center;font-size:20px;font-weight:900;margin:7px 0">RECEIPT '+ref+'</div>'+voidMark+'<div style="text-align:center">'+r.time+'</div><hr>'+body+'<hr><div class="rline"><b>TOTAL</b><b>'+money(r.total)+'</b></div><div class="rline">Cash <span>'+money(r.cash)+'</span></div><div class="rline">Change <span>'+money(r.change)+'</span></div><hr><div style="text-align:center;font-weight:900">REFERENCE: '+ref+'</div>';
    currentReceiptId=Number(r.id)||0;
    const voidBtn=document.getElementById('voidReceiptButton');
    if(voidBtn)voidBtn.style.display=(r.voided||Number(r.dayId)!==Number(data.dayId))?'none':'block';
    const receiptModal=document.getElementById('receiptModal');
    if(receiptModal){receiptModal.style.zIndex='30';receiptModal.classList.add('show');}
  };

  function v36Version(){
    document.title='MNLT Market Smoked Chicken - Register v36';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v36';
  }

  v36Version();
  render();
  window.addEventListener('resize',()=>setTimeout(v36Version,80));
  window.addEventListener('orientationchange',()=>setTimeout(v36Version,220));
  window.addEventListener('load',()=>{
    v36Version();
    setTimeout(v36Version,300);
    setTimeout(async()=>{
      try{
        if('serviceWorker' in navigator){
          const reg=await navigator.serviceWorker.register('./service-worker.js?v=36',{updateViaCache:'none'});
          await reg.update();
        }
      }catch(e){console.log('v36 service worker update failed:',e)}
    },1000);
  });
})();
