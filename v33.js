// v33 — Galaxy Tab A landscape fit. No register logic changes.
(function(){
  const css=`
  html.galaxy-landscape,html.galaxy-landscape body{width:100%!important;height:100%!important;overflow:hidden!important}
  html.galaxy-landscape header{height:32px!important;min-height:32px!important;padding:0 8px!important;padding-top:0!important}
  html.galaxy-landscape header h1{font-size:14px!important;line-height:1!important;max-width:100%!important}
  html.galaxy-landscape main{height:calc(100dvh - 32px)!important;min-height:0!important;width:100%!important;max-width:none!important;margin:0!important;padding:4px!important;display:grid!important;grid-template-columns:minmax(0,1fr) clamp(220px,28vw,280px)!important;grid-template-rows:minmax(0,1fr)!important;gap:4px!important;overflow:hidden!important}
  html.galaxy-landscape .left{height:100%!important;min-height:0!important;display:grid!important;grid-template-rows:70px minmax(0,1fr) 40px 145px!important;gap:4px!important;align-content:stretch!important;overflow:hidden!important}
  html.galaxy-landscape .card{min-height:0!important;border-radius:7px!important;padding:4px!important}
  html.galaxy-landscape .menu{display:grid!important;grid-template-columns:1.55fr 1fr!important;grid-template-rows:1fr!important;gap:4px!important;padding:4px!important;overflow:hidden!important}
  html.galaxy-landscape .mealGroup{grid-template-columns:1.25fr .82fr .82fr!important;gap:4px!important;min-height:0!important}
  html.galaxy-landscape .alaGroup{grid-template-columns:1fr 1fr!important;gap:4px!important;padding-top:12px!important;min-height:0!important}
  html.galaxy-landscape .menuLabel{font-size:8px!important;top:0!important}
  html.galaxy-landscape .menu button{font-size:9px!important;padding:2px 3px!important;border-radius:6px!important;min-height:0!important}
  html.galaxy-landscape .menu button b{font-size:15px!important;margin-top:1px!important;line-height:1!important}
  html.galaxy-landscape .menu .meal{font-size:10px!important}
  html.galaxy-landscape .menu .meal b{font-size:19px!important}
  html.galaxy-landscape .order{padding:4px!important;overflow:hidden!important}
  html.galaxy-landscape .order h2{font-size:10px!important;margin:0 0 2px!important;line-height:1.1!important}
  html.galaxy-landscape #orderList{height:calc(100% - 14px)!important;min-height:0!important;overflow:auto!important}
  html.galaxy-landscape .plate,html.galaxy-landscape .item{padding:3px!important;margin-bottom:3px!important;gap:3px!important;border-width:1px!important;border-radius:6px!important}
  html.galaxy-landscape .plate{grid-template-columns:minmax(0,1fr) auto!important}
  html.galaxy-landscape .title,html.galaxy-landscape .itemTitle{font-size:9px!important;line-height:1.05!important}
  html.galaxy-landscape .detail,html.galaxy-landscape .extrasline,html.galaxy-landscape .itemDetail,html.galaxy-landscape .sauceLine{font-size:8px!important;line-height:1.05!important;margin-top:1px!important}
  html.galaxy-landscape .sauceLine span{font-size:7px!important}
  html.galaxy-landscape .sauceButtons{gap:2px!important;margin-top:2px!important;flex-wrap:nowrap!important}
  html.galaxy-landscape .sauceButtons button{font-size:7px!important;padding:2px 3px!important;border-radius:4px!important;white-space:nowrap!important}
  html.galaxy-landscape .pbuttons{gap:2px!important;flex-wrap:nowrap!important;align-items:center!important}
  html.galaxy-landscape .pbuttons button{font-size:7px!important;padding:3px 4px!important;min-width:46px!important;border-radius:5px!important}
  html.galaxy-landscape .totalCard{min-height:0!important;padding:4px 7px!important;display:flex!important;align-items:center!important}
  html.galaxy-landscape .total{width:100%!important;font-size:15px!important;line-height:1!important}
  html.galaxy-landscape .checkoutCard{min-height:0!important;height:100%!important;padding:4px!important;display:grid!important;grid-template-columns:minmax(0,1.2fr) minmax(150px,.8fr)!important;grid-template-rows:28px 30px minmax(0,1fr)!important;gap:3px 6px!important;align-items:stretch!important;overflow:hidden!important}
  html.galaxy-landscape .checkoutCard .keyrow{grid-column:1!important;grid-row:1/4!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:3px!important;min-height:0!important}
  html.galaxy-landscape .checkoutCard .keymini{height:auto!important;min-height:0!important;font-size:17px!important;line-height:1!important;border-radius:6px!important;padding:0!important}
  html.galaxy-landscape .checkoutCard .cashline{grid-column:2!important;grid-row:1!important;width:100%!important;max-width:none!important;font-size:13px!important;line-height:28px!important;padding:0!important;text-align:right!important}
  html.galaxy-landscape .checkoutCard .mainchange{grid-column:2!important;grid-row:2!important;width:100%!important;max-width:none!important;font-size:15px!important;line-height:30px!important;padding:0!important;text-align:right!important}
  html.galaxy-landscape .checkoutCard .quickPay{grid-column:2!important;grid-row:3!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:1fr 1fr!important;gap:3px!important;min-height:0!important}
  html.galaxy-landscape .checkoutCard .quickPay button{min-height:0!important;height:auto!important;font-size:12px!important;line-height:1!important;padding:2px!important;border-radius:6px!important}
  html.galaxy-landscape .right{position:static!important;width:auto!important;height:100%!important;min-height:0!important;display:grid!important;grid-template-rows:142px minmax(0,1fr)!important;gap:4px!important;overflow:hidden!important;pointer-events:auto!important}
  html.galaxy-landscape .right .card{min-height:0!important;padding:4px!important;overflow:hidden!important}
  html.galaxy-landscape .inventory h2,html.galaxy-landscape .recent h2{font-size:11px!important;margin:0 0 2px!important;line-height:1!important}
  html.galaxy-landscape .invgrid{grid-template-columns:1fr 1fr!important;gap:3px!important;min-height:0!important}
  html.galaxy-landscape .box{padding:3px!important;border-radius:6px!important;min-height:0!important}
  html.galaxy-landscape .box b{font-size:17px!important;line-height:1!important;margin:1px 0!important}
  html.galaxy-landscape .box small{font-size:8px!important;line-height:1!important}
  html.galaxy-landscape .box button{font-size:8px!important;padding:2px 3px!important;margin:1px!important;border-radius:4px!important}
  html.galaxy-landscape .invgrid>.box:nth-child(3){grid-column:1/-1!important;min-height:34px!important;display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:4px!important;padding:3px!important}
  html.galaxy-landscape .invgrid>.box:nth-child(3) b{font-size:16px!important;margin:0!important;text-align:center!important}
  html.galaxy-landscape .dayActions{gap:2px!important;align-items:flex-end!important}
  html.galaxy-landscape .dayActions button{font-size:7px!important;padding:3px 4px!important;border-radius:4px!important;line-height:1!important}
  html.galaxy-landscape .dayActions small{font-size:7px!important}
  html.galaxy-landscape .recent{min-height:0!important;max-height:none!important;display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;overflow:hidden!important}
  html.galaxy-landscape .recentHeader{gap:2px!important;margin-bottom:2px!important}
  html.galaxy-landscape .receiptFind{gap:2px!important}
  html.galaxy-landscape .receiptFind input{font-size:8px!important;padding:3px 4px!important;border-radius:4px!important}
  html.galaxy-landscape .receiptFind button{font-size:7px!important;padding:3px 4px!important;border-radius:4px!important}
  html.galaxy-landscape .receiptList{min-height:0!important;overflow:auto!important}
  html.galaxy-landscape .receipt{font-size:8px!important;padding:3px 1px!important;line-height:1.15!important}
  html.galaxy-landscape .receipt b{font-size:10px!important}
  html.galaxy-landscape .receipt button{font-size:7px!important;padding:3px 4px!important;border-radius:4px!important}
  html.galaxy-landscape .receiptSauce{font-size:7px!important;margin-top:1px!important}
  html.galaxy-landscape .versionTag{font-size:8px!important;padding:1px 4px!important;bottom:2px!important;left:4px!important}
  html.galaxy-landscape.galaxy-short header{height:28px!important;min-height:28px!important}
  html.galaxy-landscape.galaxy-short header h1{font-size:12px!important}
  html.galaxy-landscape.galaxy-short main{height:calc(100dvh - 28px)!important;padding:3px!important;gap:3px!important;grid-template-columns:minmax(0,1fr) clamp(205px,27vw,245px)!important}
  html.galaxy-landscape.galaxy-short .left{grid-template-rows:60px minmax(0,1fr) 34px 124px!important;gap:3px!important}
  html.galaxy-landscape.galaxy-short .right{grid-template-rows:124px minmax(0,1fr)!important;gap:3px!important}
  html.galaxy-landscape.galaxy-short .menu{padding:3px!important;gap:3px!important}
  html.galaxy-landscape.galaxy-short .menu button{font-size:8px!important}
  html.galaxy-landscape.galaxy-short .menu button b{font-size:13px!important}
  html.galaxy-landscape.galaxy-short .menu .meal b{font-size:17px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard{grid-template-rows:24px 26px minmax(0,1fr)!important;gap:2px 5px!important;padding:3px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard .cashline{font-size:11px!important;line-height:24px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard .mainchange{font-size:13px!important;line-height:26px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard .keyrow{gap:2px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard .keymini{font-size:15px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard .quickPay{gap:2px!important}
  html.galaxy-landscape.galaxy-short .checkoutCard .quickPay button{font-size:10px!important}
  `;
  const style=document.createElement('style');
  style.id='v33-galaxy-fit';
  style.textContent=css;
  document.head.appendChild(style);

  function applyFit(){
    const w=window.innerWidth||document.documentElement.clientWidth||0;
    const h=window.innerHeight||document.documentElement.clientHeight||0;
    const root=document.documentElement;
    const landscape=w>h;
    root.classList.toggle('galaxy-landscape',landscape);
    root.classList.toggle('galaxy-short',landscape&&h<=520);
    document.title='MNLT Market Smoked Chicken - Register v33';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v33';
  }

  applyFit();
  window.addEventListener('resize',()=>setTimeout(applyFit,50));
  window.addEventListener('orientationchange',()=>setTimeout(applyFit,180));
  window.addEventListener('load',()=>{
    applyFit();
    setTimeout(applyFit,250);
    setTimeout(async()=>{
      try{
        if('serviceWorker' in navigator){
          const reg=await navigator.serviceWorker.register('./service-worker.js?v=33',{updateViaCache:'none'});
          await reg.update();
        }
      }catch(e){console.log('v33 service worker update failed:',e)}
    },1200);
  });
})();
