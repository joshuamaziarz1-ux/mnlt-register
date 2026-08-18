// v34 — dual-orientation Galaxy Tab A fit. Keeps v33 landscape and adds portrait tablet fit.
(function(){
  if(window.__MNLT_V34_LOADED__)return;
  window.__MNLT_V34_LOADED__=true;

  const css=`
  /* LANDSCAPE — preserve the v33 layout the tablet already fits well. */
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

  /* PORTRAIT TABLET — same register, re-sized to fit the Tab A vertically. */
  html.galaxy-portrait,html.galaxy-portrait body{width:100%!important;height:100%!important;overflow:hidden!important}
  html.galaxy-portrait header{height:36px!important;min-height:36px!important;padding:0 9px!important}
  html.galaxy-portrait header h1{font-size:15px!important;line-height:1!important}
  html.galaxy-portrait main{width:100%!important;height:calc(100dvh - 36px)!important;min-height:0!important;max-width:none!important;margin:0!important;padding:5px!important;display:grid!important;grid-template-columns:minmax(0,1.75fr) minmax(215px,.95fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:5px!important;overflow:hidden!important}
  html.galaxy-portrait .left{height:100%!important;min-height:0!important;display:grid!important;grid-template-rows:100px minmax(150px,1fr) 52px 355px!important;gap:5px!important;overflow:hidden!important}
  html.galaxy-portrait .right{position:static!important;width:auto!important;height:100%!important;min-height:0!important;display:grid!important;grid-template-rows:172px minmax(0,1fr)!important;gap:5px!important;overflow:hidden!important;pointer-events:auto!important}
  html.galaxy-portrait .card{min-height:0!important;border-radius:8px!important;padding:5px!important;overflow:hidden!important}
  html.galaxy-portrait .menu{display:grid!important;grid-template-columns:1.6fr 1fr!important;gap:5px!important;padding:5px!important}
  html.galaxy-portrait .mealGroup{grid-template-columns:1.25fr .85fr .85fr!important;gap:4px!important}
  html.galaxy-portrait .alaGroup{grid-template-columns:1fr 1fr!important;gap:4px!important;padding-top:15px!important}
  html.galaxy-portrait .menuLabel{font-size:8px!important;top:1px!important}
  html.galaxy-portrait .menu button{font-size:9px!important;padding:3px!important;border-radius:6px!important}
  html.galaxy-portrait .menu button b{font-size:17px!important;margin-top:2px!important;line-height:1!important}
  html.galaxy-portrait .menu .meal{font-size:10px!important}
  html.galaxy-portrait .menu .meal b{font-size:21px!important}
  html.galaxy-portrait .order{padding:5px!important;overflow:hidden!important}
  html.galaxy-portrait .order h2{font-size:11px!important;margin:0 0 3px!important}
  html.galaxy-portrait #orderList{height:calc(100% - 16px)!important;min-height:0!important;overflow:auto!important}
  html.galaxy-portrait .plate,html.galaxy-portrait .item{padding:4px!important;margin-bottom:3px!important;gap:3px!important;border-radius:6px!important}
  html.galaxy-portrait .title,html.galaxy-portrait .itemTitle{font-size:10px!important}
  html.galaxy-portrait .detail,html.galaxy-portrait .extrasline,html.galaxy-portrait .itemDetail,html.galaxy-portrait .sauceLine{font-size:8px!important;margin-top:2px!important;line-height:1.12!important}
  html.galaxy-portrait .sauceLine span{font-size:7px!important}
  html.galaxy-portrait .sauceButtons{gap:2px!important;margin-top:2px!important;flex-wrap:nowrap!important}
  html.galaxy-portrait .sauceButtons button{font-size:7px!important;padding:2px 3px!important;white-space:nowrap!important}
  html.galaxy-portrait .pbuttons{gap:2px!important;flex-wrap:nowrap!important}
  html.galaxy-portrait .pbuttons button{font-size:7px!important;padding:3px 4px!important;min-width:46px!important}
  html.galaxy-portrait .totalCard{padding:5px 8px!important;display:flex!important;align-items:center!important}
  html.galaxy-portrait .total{width:100%!important;font-size:17px!important;line-height:1!important}
  html.galaxy-portrait .checkoutCard{height:100%!important;min-height:0!important;padding:5px!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) 28px 31px 45px!important;gap:4px!important;overflow:hidden!important}
  html.galaxy-portrait .checkoutCard .keyrow{grid-row:1!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:5px!important;min-height:0!important}
  html.galaxy-portrait .checkoutCard .keymini{height:auto!important;min-height:0!important;font-size:20px!important;line-height:1!important;padding:0!important;border-radius:7px!important}
  html.galaxy-portrait .checkoutCard .cashline{grid-row:2!important;width:100%!important;max-width:none!important;font-size:15px!important;line-height:28px!important;padding:0!important;text-align:right!important}
  html.galaxy-portrait .checkoutCard .mainchange{grid-row:3!important;width:100%!important;max-width:none!important;font-size:18px!important;line-height:31px!important;padding:0!important;text-align:right!important}
  html.galaxy-portrait .checkoutCard .quickPay{grid-row:4!important;width:100%!important;height:45px!important;max-width:none!important;margin:0!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:4px!important}
  html.galaxy-portrait .checkoutCard .quickPay button{height:45px!important;min-height:0!important;font-size:13px!important;padding:2px!important;border-radius:7px!important}
  html.galaxy-portrait .inventory h2,html.galaxy-portrait .recent h2{font-size:12px!important;margin:0 0 3px!important}
  html.galaxy-portrait .invgrid{grid-template-columns:1fr 1fr!important;gap:4px!important}
  html.galaxy-portrait .box{padding:4px!important;border-radius:6px!important}
  html.galaxy-portrait .box b{font-size:19px!important;line-height:1!important;margin:2px 0!important}
  html.galaxy-portrait .box small{font-size:8px!important}
  html.galaxy-portrait .box button{font-size:8px!important;padding:3px!important;margin:1px!important}
  html.galaxy-portrait .invgrid>.box:nth-child(3){grid-column:1/-1!important;min-height:42px!important;display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:4px!important}
  html.galaxy-portrait .invgrid>.box:nth-child(3) b{font-size:18px!important;text-align:center!important;margin:0!important}
  html.galaxy-portrait .dayActions{gap:2px!important}
  html.galaxy-portrait .dayActions small{font-size:7px!important}
  html.galaxy-portrait .dayActions button{font-size:7px!important;padding:3px 4px!important}
  html.galaxy-portrait .recent{display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;min-height:0!important;overflow:hidden!important}
  html.galaxy-portrait .recentHeader{gap:3px!important;margin-bottom:3px!important}
  html.galaxy-portrait .receiptFind{gap:3px!important}
  html.galaxy-portrait .receiptFind input{font-size:9px!important;padding:4px!important}
  html.galaxy-portrait .receiptFind button{font-size:8px!important;padding:4px!important}
  html.galaxy-portrait .receiptList{min-height:0!important;overflow:auto!important}
  html.galaxy-portrait .receipt{font-size:8px!important;padding:4px 1px!important;line-height:1.15!important}
  html.galaxy-portrait .receipt b{font-size:10px!important}
  html.galaxy-portrait .receipt button{font-size:8px!important;padding:3px 5px!important}
  html.galaxy-portrait .receiptSauce{font-size:7px!important;margin-top:1px!important}
  html.galaxy-portrait .versionTag{font-size:8px!important;padding:1px 4px!important;left:4px!important;bottom:3px!important}

  @media(max-height:900px) and (orientation:portrait) and (min-width:600px){
    html.galaxy-portrait .left{grid-template-rows:88px minmax(120px,1fr) 46px 300px!important}
    html.galaxy-portrait .right{grid-template-rows:155px minmax(0,1fr)!important}
    html.galaxy-portrait .checkoutCard .keymini{font-size:17px!important}
    html.galaxy-portrait .checkoutCard .quickPay{height:40px!important}
    html.galaxy-portrait .checkoutCard .quickPay button{height:40px!important;font-size:11px!important}
  }
  `;
  const style=document.createElement('style');
  style.id='v34-dual-orientation-fit';
  style.textContent=css;
  document.head.appendChild(style);

  function unlockOrientation(){
    try{
      if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();
    }catch(e){}
  }

  function applyFit(){
    const w=window.innerWidth||document.documentElement.clientWidth||0;
    const h=window.innerHeight||document.documentElement.clientHeight||0;
    const root=document.documentElement;
    const landscape=w>h;
    const portraitTablet=!landscape&&w>=600;
    root.classList.toggle('galaxy-landscape',landscape);
    root.classList.toggle('galaxy-portrait',portraitTablet);
    root.classList.remove('galaxy-short');
    document.title='MNLT Market Smoked Chicken - Register v34';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v34';
  }

  unlockOrientation();
  applyFit();
  window.addEventListener('resize',()=>setTimeout(applyFit,60));
  window.addEventListener('orientationchange',()=>{unlockOrientation();setTimeout(applyFit,180)});
  window.addEventListener('load',()=>{unlockOrientation();applyFit();setTimeout(applyFit,250)});
})();
