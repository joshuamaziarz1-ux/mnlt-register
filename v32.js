// v32 hook now loads v33 so installed PWAs using the existing index pick up the Galaxy Tab A fit fix.
(function(){
  function loadV33(){
    if(document.getElementById('v33-loader'))return;
    const s=document.createElement('script');
    s.id='v33-loader';
    s.src='./v33.js?v=33';
    s.onload=function(){
      document.title='MNLT Market Smoked Chicken - Register v33';
      const tag=document.querySelector('.versionTag');
      if(tag)tag.textContent='v33';
    };
    document.head.appendChild(s);
  }
  loadV33();
})();
