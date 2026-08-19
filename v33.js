// v33 compatibility hook — load current dual-orientation layout, then no-inventory update, multi-sauce support, then v37 backup/restore.
(function(){
  function loadV37(){
    if(document.getElementById('v37-loader')||window.__MNLT_V37_LOADED__)return;
    const s37=document.createElement('script');
    s37.id='v37-loader';
    s37.src='./v37.js?v=37';
    document.head.appendChild(s37);
  }

  function loadV36(){
    if(window.__MNLT_V36_LOADED__){loadV37();return;}
    const existing36=document.getElementById('v36-loader');
    if(existing36){existing36.addEventListener('load',loadV37,{once:true});return;}
    const s36=document.createElement('script');
    s36.id='v36-loader';
    s36.src='./v36.js?v=37';
    s36.onload=loadV37;
    document.head.appendChild(s36);
  }

  function loadV35(){
    if(window.__MNLT_V35_LOADED__){loadV36();return;}
    const existing35=document.getElementById('v35-loader');
    if(existing35){existing35.addEventListener('load',loadV36,{once:true});return;}
    const s35=document.createElement('script');
    s35.id='v35-loader';
    s35.src='./v35.js?v=37';
    s35.onload=loadV36;
    document.head.appendChild(s35);
  }

  if(window.__MNLT_V34_LOADED__){loadV35();return;}

  const existing34=document.getElementById('v34-loader');
  if(existing34){
    existing34.addEventListener('load',loadV35,{once:true});
    return;
  }

  const s34=document.createElement('script');
  s34.id='v34-loader';
  s34.src='./v34.js?v=37';
  s34.onload=loadV35;
  document.head.appendChild(s34);
})();
