// v33 compatibility hook — load current dual-orientation layout, then v35 no-inventory register update.
(function(){
  function loadV35(){
    if(document.getElementById('v35-loader')||window.__MNLT_V35_LOADED__)return;
    const s35=document.createElement('script');
    s35.id='v35-loader';
    s35.src='./v35.js?v=35';
    document.head.appendChild(s35);
  }

  if(window.__MNLT_V34_LOADED__){loadV35();return;}

  const existing=document.getElementById('v34-loader');
  if(existing){
    existing.addEventListener('load',loadV35,{once:true});
    return;
  }

  const s=document.createElement('script');
  s.id='v34-loader';
  s.src='./v34.js?v=35';
  s.onload=loadV35;
  document.head.appendChild(s);
})();
