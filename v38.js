// v38 — automatic current-day recovery. Removes file backup/restore.
(function(){
  if(window.__MNLT_V38_LOADED__)return;
  window.__MNLT_V38_LOADED__=true;

  const AUTOSAVE_KEY='mnltRegisterAutoSaveV38';
  let recoverySnapshot=null;
  let autosaveArmed=false;
  let autosaveTimer=null;

  const css=`
    .loadSavedDayBtn{border:0;border-radius:6px;background:#e8e4da!important;color:#1f5d38!important;border:1px solid #cfc7b8!important;font-weight:900;padding:5px 7px;font-size:9px;line-height:1!important}
    .loadSavedDayBtn:disabled{opacity:.45!important;color:#777!important}
    html.galaxy-landscape .loadSavedDayBtn{font-size:7px!important;padding:4px 5px!important}
    html.galaxy-portrait .loadSavedDayBtn{font-size:8px!important;padding:5px 6px!important}
  `;
  const style=document.createElement('style');
  style.id='v38-autosave-style';
  style.textContent=css;
  document.head.appendChild(style);

  function clone(v){return JSON.parse(JSON.stringify(v));}

  function readAutosave(){
    try{
      const raw=JSON.parse(localStorage.getItem(AUTOSAVE_KEY)||'null');
      if(!raw||typeof raw!=='object')return null;
      if(!Array.isArray(raw.order))raw.order=[];
      raw.dayId=Number(raw.dayId)||0;
      raw.selectedPlate=Number(raw.selectedPlate)||0;
      raw.cashText=typeof raw.cashText==='string'?raw.cashText:'';
      return raw;
    }catch(e){return null;}
  }

  function snapshotIsLoadable(snap){
    return !!(snap && Number(snap.dayId)===Number(data.dayId) && (snap.order.length || snap.cashText));
  }

  function formatSavedTime(iso){
    try{return new Date(iso).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}catch(e){return '';}
  }

  function updateLoadButton(){
    const btn=document.getElementById('loadSavedDayBtn');
    if(!btn)return;
    const ok=snapshotIsLoadable(recoverySnapshot);
    btn.disabled=!ok;
    btn.textContent=ok?'LOAD SAVED DAY':'NO SAVED ORDER';
    btn.title=ok?('Auto-saved '+formatSavedTime(recoverySnapshot.savedAt)):'';
  }

  function writeAutosave(){
    if(!autosaveArmed)return;
    try{
      const snap={
        version:1,
        dayId:Number(data.dayId)||1,
        dayStartedAt:data.dayStartedAt||'',
        savedAt:new Date().toISOString(),
        order:clone(Array.isArray(order)?order:[]),
        selectedPlate:Number(selectedPlate)||0,
        cashText:typeof cashText==='string'?cashText:''
      };
      localStorage.setItem(AUTOSAVE_KEY,JSON.stringify(snap));
      recoverySnapshot=snap;
      updateLoadButton();
    }catch(e){console.log('Autosave error:',e);}
  }

  function scheduleAutosave(){
    if(!autosaveArmed)return;
    clearTimeout(autosaveTimer);
    autosaveTimer=setTimeout(writeAutosave,40);
  }

  window.loadSavedDay=function(){
    const snap=recoverySnapshot||readAutosave();
    if(!snapshotIsLoadable(snap)){
      showToast('NO SAVED ORDER TO LOAD');
      updateLoadButton();
      return;
    }
    const when=formatSavedTime(snap.savedAt);
    const count=snap.order.length;
    const ok=confirm('Load the auto-saved order'+(when?' from '+when:'')+'?\n\n'+count+' item'+(count===1?'':'s')+' will be restored. Completed receipts and saved days will not be changed.');
    if(!ok)return;

    order=clone(snap.order);
    selectedPlate=Math.min(Number(snap.selectedPlate)||0,Math.max(0,order.length-1));
    cashText=typeof snap.cashText==='string'?snap.cashText:'';
    autosaveArmed=true;
    render();
    updateCash();
    writeAutosave();
    showToast('SAVED ORDER LOADED');
  };

  function removeOldBackupRestore(){
    ['backupRegisterBtn','restoreRegisterBtn','restoreBackupFile'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.remove();
    });
  }

  function addLoadControl(){
    removeOldBackupRestore();
    if(document.getElementById('loadSavedDayBtn')){updateLoadButton();return;}
    const actions=document.querySelector('.dayActions');
    if(!actions)return;
    const btn=document.createElement('button');
    btn.id='loadSavedDayBtn';
    btn.className='loadSavedDayBtn';
    btn.type='button';
    btn.onclick=function(e){e.stopPropagation();loadSavedDay();};
    const closeDay=Array.from(actions.querySelectorAll('button')).find(b=>b.textContent.trim()==='CLOSE DAY');
    if(closeDay)actions.insertBefore(btn,closeDay);
    else actions.appendChild(btn);
    updateLoadButton();
  }

  // Capture the previous session before anything in this new session can overwrite it.
  recoverySnapshot=readAutosave();
  autosaveArmed=!snapshotIsLoadable(recoverySnapshot);

  // Autosave after every register redraw and cash entry once the user starts working.
  const renderV37=render;
  render=function(){
    renderV37();
    addLoadControl();
    scheduleAutosave();
  };

  const updateCashV37=updateCash;
  updateCash=function(){
    updateCashV37();
    scheduleAutosave();
  };

  // Do not overwrite a recoverable previous order merely by opening the app.
  // The first real interaction arms autosave; tapping LOAD SAVED DAY is excluded.
  document.addEventListener('pointerdown',function(e){
    if(e.target&&e.target.closest&&e.target.closest('#loadSavedDayBtn'))return;
    autosaveArmed=true;
    setTimeout(scheduleAutosave,80);
  },{capture:true,passive:true});
  document.addEventListener('keydown',function(e){
    if(e.target&&e.target.id==='receiptFind')return;
    autosaveArmed=true;
    setTimeout(scheduleAutosave,80);
  },true);

  window.addEventListener('pagehide',writeAutosave);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')writeAutosave();});

  function v38Version(){
    removeOldBackupRestore();
    addLoadControl();
    document.title='MNLT Market Smoked Chicken - Register v38';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v38';
  }

  v38Version();
  renderV37();
  addLoadControl();
  updateLoadButton();
  if(autosaveArmed)writeAutosave();

  window.addEventListener('resize',()=>setTimeout(v38Version,80));
  window.addEventListener('orientationchange',()=>setTimeout(v38Version,220));
  window.addEventListener('load',()=>{
    v38Version();
    setTimeout(v38Version,300);
    setTimeout(async()=>{
      try{
        if('serviceWorker' in navigator){
          const reg=await navigator.serviceWorker.register('./service-worker.js?v=38',{updateViaCache:'none'});
          await reg.update();
        }
      }catch(e){console.log('v38 service worker update failed:',e)}
    },1000);
  });
})();
