// v37 compatibility shim — v38 replaced file backup/restore with automatic current-day recovery.
(function(){
  if(window.__MNLT_V38_LOADED__||document.getElementById('v38-loader'))return;
  const s=document.createElement('script');
  s.id='v38-loader';
  s.src='./v38.js?v=38';
  document.head.appendChild(s);
})();
