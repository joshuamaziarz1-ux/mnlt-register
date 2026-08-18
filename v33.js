// v33 additions — true fit-to-landscape layout for Galaxy Tab A and other short Android tablets.
(function(){
  const css=`
  @media (orientation:landscape){
    html,body{width:100%!important;height:100%!important;overflow:hidden!important}
    header{height:34px!important;min-height:34px!important;padding:0 8px!important;padding-top:0!important}
    header h1{font-size:14px!important;line-height:1!important;max-width:100%!important}
    main{
      width:100%!important;
      height:calc(100dvh - 34px)!important;
      min-height:0!important;
      margin:0!important;
      padding:4px!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr) clamp(190px,30vw,300px)!important;
      grid-template-rows:minmax(0,1fr)!important;
      gap:4px!important;
      max-width:none!important;
      overflow:hidden!important;
    }
    .left{
      min-width:0!important;min-height:0!important;height:100%!important;
      display:grid!important;
      grid-template-rows:clamp(64px,13vh,80px) minmax(80px,1fr) 40px clamp(148px,29vh,174px)!important;
      gap:4px!important;
      align-content:stretch!important;
      overflow:hidden!important;
    }
    .card{border-radius:7px!important;padding:4px!important;min-height:0!important;overflow:hidden!important}

    .menu{display:grid!important;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr)!important;grid-template-rows:1fr!important;gap:4px!important;padding:4px!important}
    .mealGroup{display:grid!important;grid-template-columns:1.35fr .9fr .9fr!important;gap:4px!important;min-width:0!important}
    .alaGroup{display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:1fr!important;gap:4px!important;padding-top:13px!important;min-width:0!important}
    .menuLabel{font-size:8px!important;top:1px!important}
    .menu button{font-size:9px!important;padding:2px!important;border-radius:6px!important;min-width:0!important;line-height:1.05!important}
    .menu button b{font-size:16px!important;margin-top:1px!important}
    .menu .meal{font-size:10px!important}.menu .meal b{font-size:19px!important}

    .order{padding:4px!important;padding-right:4px!important;overflow:hidden!important}
    .order h2{font-size:10px!important;margin:0 0 2px!important;line-height:1.1!important}
    #orderList{height:calc(100% - 14px)!important;min-height:0!important;overflow:auto!important}
    .plate,.item{padding:3px!important;margin-bottom:3px!important;gap:2px!important;border-width:1px!important;border-radius:6px!important}
    .plate{grid-template-columns:minmax(0,1fr) auto!important}
    .title,.itemTitle{font-size:9px!important;line-height:1.1!important}
    .detail,.extrasline,.itemDetail,.sauceLine{font-size:8px!important;margin-top:1px!important;line-height:1.15!important}
    .sauceLine span{font-size:7px!important}
    .sauceButtons{gap:2px!important;margin-top:2px!important}
    .sauceButtons button{font-size:7px!important;padding:2px 4px!important;border-radius:5px!important}
    .pbuttons{gap:2px!important;flex-wrap:nowrap!important}.pbuttons button{font-size:7px!important;padding:3px 4px!important;min-width:48px!important;border-radius:5px!important}

    .totalCard{min-height:0!important;padding:4px 6px!important;display:flex!important;align-items:center!important}
    .total{font-size:15px!important;width:100%!important;line-height:1!important}

    .checkoutCard{
      display:grid!important;
      grid-template-columns:minmax(0,1.25fr) minmax(145px,.75fr)!important;
      grid-template-rows:auto auto minmax(0,1fr)!important;
      gap:3px 6px!important;
      padding:4px!important;
      align-items:stretch!important;
      overflow:hidden!important;
    }
    .checkoutCard .keyrow{
      grid-column:1!important;grid-row:1/4!important;
      width:100%!important;height:100%!important;max-width:none!important;margin:0!important;
      display:grid!important;grid-template-columns:repeat(3,1fr)!important;grid-template-rows:repeat(4,1fr)!important;
      gap:4px!important;min-height:0!important;
    }
    .checkoutCard .keymini{height:100%!important;min-height:0!important;font-size:17px!important;border-radius:6px!important;padding:0!important}
    .checkoutCard .cashline{grid-column:2!important;grid-row:1!important;width:100%!important;max-width:none!important;font-size:13px!important;padding:0!important;line-height:1.05!important}
    .checkoutCard .mainchange{grid-column:2!important;grid-row:2!important;width:100%!important;max-width:none!important;font-size:15px!important;padding:0!important;line-height:1.05!important}
    .checkoutCard .quickPay{
      grid-column:2!important;grid-row:3!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;
      display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:1fr 1fr!important;gap:3px!important;min-height:0!important;
    }
    .checkoutCard .quickPay button{font-size:12px!important;border-radius:6px!important;min-height:0!important;height:100%!important;padding:2px!important}

    .right{
      position:static!important;right:auto!important;bottom:auto!important;width:auto!important;height:100%!important;min-width:0!important;min-height:0!important;
      display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;gap:4px!important;z-index:auto!important;pointer-events:auto!important;align-content:stretch!important;overflow:hidden!important;
    }
    .right .card{pointer-events:auto!important;padding:4px!important}
    .inventory{overflow:hidden!important}.inventory h2,.recent h2{font-size:11px!important;margin:0 0 2px!important;line-height:1.1!important}
    .invgrid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:3px!important}
    .box{padding:3px!important;border-radius:6px!important}.box b{font-size:17px!important;margin:0!important;line-height:1.05!important}.box small{font-size:8px!important}.box button{font-size:8px!important;padding:2px 3px!important;margin:1px!important;border-radius:5px!important}
    .invgrid>.box:nth-child(3){grid-column:1/-1!important;display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:4px!important;min-height:32px!important}
    .invgrid>.box:nth-child(3) b{text-align:center!important}
    .dayActions{display:flex!important;flex-direction:row!important;align-items:center!important;gap:2px!important;flex-wrap:wrap!important;justify-content:flex-end!important}
    .dayActions small{font-size:8px!important}.dayActions button{font-size:7px!important;padding:3px 4px!important;border-radius:5px!important}

    .recent{min-height:0!important;max-height:none!important;display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;overflow:hidden!important}
    .recentHeader{gap:2px!important;margin-bottom:2px!important}.recentHeader h2{font-size:11px!important}
    .receiptFind{gap:2px!important}.receiptFind input{font-size:8px!important;padding:3px 4px!important;border-radius:5px!important}.receiptFind button{font-size:7px!important;padding:3px 4px!important;border-radius:5px!important}
    .receiptList{min-height:0!important;overflow:auto!important}
    .receipt{font-size:8px!important;padding:3px 1px!important;line-height:1.15!important;gap:3px!important}.receipt b[style]{font-size:11px!important}.receipt button{font-size:8px!important;padding:3px 5px!important;border-radius:5px!important}.receiptSauce{font-size:7px!important;margin-top:1px!important}

    .versionTag{left:4px!important;bottom:3px!important;font-size:8px!important;padding:1px 4px!important}
  }

  @media (orientation:landscape) and (max-height:520px){
    header{height:30px!important;min-height:30px!important}header h1{font-size:12px!important}
    main{height:calc(100dvh - 30px)!important;padding:3px!important;gap:3px!important;grid-template-columns:minmax(0,1fr) clamp(180px,29vw,270px)!important}
    .left{grid-template-rows:58px minmax(70px,1fr) 34px 136px!important;gap:3px!important}
    .menu button{font-size:8px!important}.menu button b{font-size:14px!important}.menu .meal{font-size:9px!important}.menu .meal b{font-size:17px!important}
    .checkoutCard .keyrow{gap:3px!important}.checkoutCard .keymini{font-size:15px!important}
    .checkoutCard .cashline{font-size:11px!important}.checkoutCard .mainchange{font-size:13px!important}.checkoutCard .quickPay button{font-size:10px!important}
  }
  `;
  const style=document.createElement('style');
  style.id='v33-landscape-fit';
  style.textContent=css;
  document.head.appendChild(style);

  if('serviceWorker' in navigator){
    window.addEventListener('load',async()=>{
      try{
        const reg=await navigator.serviceWorker.register('./service-worker.js?v=33',{updateViaCache:'none'});
        await reg.update();
      }catch(e){console.log('v33 service worker registration failed:',e)}
    });
  }
})();
