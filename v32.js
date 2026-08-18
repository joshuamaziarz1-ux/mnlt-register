// v32 additions — Galaxy Tab A landscape fit + orientation assist.
(function(){
  const css=`
  @media (orientation:landscape) and (max-height:700px) and (min-width:701px){
    body{overflow:hidden!important}
    header{height:42px!important;padding:0 10px!important}
    header h1{font-size:16px!important}
    main{height:calc(100dvh - 42px)!important;padding:6px!important;grid-template-columns:minmax(0,1fr) 300px!important;gap:6px!important;max-width:none!important}
    .left{grid-template-rows:88px minmax(120px,1fr) 54px 174px!important;gap:5px!important;align-content:stretch!important}
    .menu{padding:5px!important}
    .menu button{font-size:10px!important;padding:3px!important}
    .menu button b{font-size:18px!important;margin-top:1px!important}
    .menu .meal{font-size:11px!important}.menu .meal b{font-size:22px!important}
    .alaGroup{padding-top:14px!important}.menuLabel{font-size:9px!important}
    .order{padding:5px!important;padding-right:5px!important}
    .order h2{font-size:11px!important;margin-bottom:3px!important}
    #orderList{height:calc(100% - 17px)!important}
    .plate,.item{padding:4px!important;margin-bottom:3px!important;gap:3px!important}
    .title,.itemTitle{font-size:10px!important}
    .detail,.extrasline,.itemDetail,.sauceLine{font-size:9px!important;margin-top:2px!important}
    .sauceLine span{font-size:8px!important}
    .sauceButtons{gap:2px!important;margin-top:2px!important}
    .sauceButtons button{font-size:8px!important;padding:3px 4px!important}
    .pbuttons{gap:2px!important}.pbuttons button{font-size:8px!important;padding:4px 5px!important;min-width:54px!important}
    .totalCard{min-height:0!important;padding:5px!important}.total{font-size:16px!important;width:100%}
    .checkoutCard{display:grid!important;grid-template-columns:minmax(0,1.2fr) minmax(170px,.8fr)!important;grid-template-rows:auto auto 1fr!important;gap:4px 8px!important;padding:5px!important;align-items:stretch!important}
    .checkoutCard .keyrow{grid-column:1;grid-row:1/4;max-width:none!important;width:100%!important;gap:4px!important;margin:0!important}
    .checkoutCard .keymini{height:36px!important;font-size:18px!important;border-radius:7px!important}
    .checkoutCard .cashline{grid-column:2;grid-row:1;font-size:15px!important;max-width:none!important;width:100%!important;padding:0!important}
    .checkoutCard .mainchange{grid-column:2;grid-row:2;font-size:17px!important;max-width:none!important;width:100%!important;padding:0!important}
    .checkoutCard .quickPay{grid-column:2;grid-row:3;display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:1fr 1fr!important;max-width:none!important;width:100%!important;height:auto!important;gap:4px!important;margin:0!important}
    .checkoutCard .quickPay button{font-size:13px!important;border-radius:7px!important;min-height:36px!important}
    .right{grid-template-rows:auto minmax(130px,1fr)!important;gap:5px!important;align-content:stretch!important}
    .right .card{padding:5px!important}
    .inventory h2,.recent h2{font-size:12px!important;margin-bottom:3px!important}
    .invgrid{gap:3px!important}.box{padding:4px!important}.box b{font-size:19px!important}.box small{font-size:9px!important}.box button{font-size:9px!important;padding:3px!important}
    .invgrid>.box:nth-child(3){min-height:38px!important;gap:5px!important}
    .dayActions{gap:2px!important}.dayActions button{font-size:8px!important;padding:4px 5px!important}
    .recent{min-height:0!important}.recentHeader{gap:3px!important;margin-bottom:3px!important}
    .receiptFind input{font-size:9px!important;padding:4px!important}.receiptFind button{font-size:8px!important;padding:4px!important}
    .receipt{font-size:9px!important;padding:4px 1px!important}.receipt button{font-size:9px!important;padding:4px 6px!important}
    .receiptSauce{font-size:8px!important;margin-top:2px!important}
  }

  @media (orientation:landscape) and (max-height:620px) and (min-width:701px){
    header{height:38px!important}header h1{font-size:15px!important}
    main{height:calc(100dvh - 38px)!important;padding:4px!important;gap:4px!important;grid-template-columns:minmax(0,1fr) 285px!important}
    .left{grid-template-rows:80px minmax(110px,1fr) 48px 164px!important;gap:4px!important}
    .checkoutCard .keymini{height:34px!important}
    .checkoutCard .quickPay button{min-height:32px!important}
  }

  @media (orientation:portrait){
    body{overflow:auto!important}
    main{height:auto!important;min-height:calc(100dvh - 50px)!important;padding-bottom:12px!important}
    .left{min-height:calc(100dvh - 62px)!important}
  }
  `;
  const style=document.createElement('style');
  style.id='v32-tablet-fit';
  style.textContent=css;
  document.head.appendChild(style);

  async function lockLandscape(){
    try{
      if(screen.orientation&&screen.orientation.lock){
        await screen.orientation.lock('landscape-primary');
      }
    }catch(e){
      // Some Android builds only allow orientation locking in installed/fullscreen mode.
    }
  }

  window.addEventListener('load',()=>setTimeout(lockLandscape,150));
  document.addEventListener('pointerdown',()=>{lockLandscape();},{once:true,passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(lockLandscape,200));
})();
