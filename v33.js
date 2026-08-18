// v33 compatibility hook — load the current v34 dual-orientation tablet layout.
(function(){
  if(document.getElementById('v34-loader')||window.__MNLT_V34_LOADED__)return;
  const s=document.createElement('script');
  s.id='v34-loader';
  s.src='./v34.js?v=34';
  s.onload=function(){
    document.title='MNLT Market Smoked Chicken - Register v34';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v34';
  };
  document.head.appendChild(s);
})();
