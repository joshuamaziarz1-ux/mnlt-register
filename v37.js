// v37 — local backup / restore for register data.
(function(){
  if(window.__MNLT_V37_LOADED__)return;
  window.__MNLT_V37_LOADED__=true;

  const STORAGE_KEY='mnltRegisterV11';

  const css=`
    .backupBtn,.restoreBtn{border:0;border-radius:6px;font-weight:900;padding:5px 7px;font-size:9px;line-height:1!important}
    .backupBtn{background:#e8e4da!important;color:#1f5d38!important;border:1px solid #cfc7b8!important}
    .restoreBtn{background:#e8e4da!important;color:#222!important;border:1px solid #cfc7b8!important}
    html.galaxy-landscape .backupBtn,html.galaxy-landscape .restoreBtn{font-size:7px!important;padding:4px 5px!important}
    html.galaxy-portrait .backupBtn,html.galaxy-portrait .restoreBtn{font-size:8px!important;padding:5px 6px!important}
  `;
  const style=document.createElement('style');
  style.id='v37-backup-style';
  style.textContent=css;
  document.head.appendChild(style);

  function pad(n){return String(n).padStart(2,'0');}
  function backupStamp(){
    const d=new Date();
    return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'_'+pad(d.getHours())+'-'+pad(d.getMinutes());
  }

  function normalizeImported(raw){
    let imported=raw&&raw.data&&typeof raw.data==='object'?raw.data:raw;
    if(!imported||typeof imported!=='object'||Array.isArray(imported))throw new Error('Invalid backup file.');

    const out=JSON.parse(JSON.stringify(imported));
    out.receipts=Array.isArray(out.receipts)?out.receipts:[];
    out.closedDays=Array.isArray(out.closedDays)?out.closedDays:[];
    out.dayId=Number.isFinite(Number(out.dayId))&&Number(out.dayId)>0?Number(out.dayId):1;
    out.dayStartedAt=out.dayStartedAt||new Date().toLocaleString();
    out.chicken=Number.isFinite(Number(out.chicken))?Number(out.chicken):0;
    out.rice=Number.isFinite(Number(out.rice))?Number(out.rice):0;

    let maxReceipt=0;
    out.receipts.forEach(r=>{
      r.id=Number(r.id)||0;
      maxReceipt=Math.max(maxReceipt,r.id);
      if(!Number.isFinite(Number(r.dayId)))r.dayId=out.dayId;
      if(typeof r.voided!=='boolean')r.voided=false;
    });
    out.lastReceiptId=Math.max(Number(out.lastReceiptId)||0,maxReceipt);
    return out;
  }

  window.backupRegisterData=function(){
    try{
      save();
      const payload={
        app:'MNLT Smoked Chicken Register',
        backupVersion:1,
        appVersion:'v37',
        exportedAt:new Date().toISOString(),
        storageKey:STORAGE_KEY,
        data:JSON.parse(JSON.stringify(data))
      };
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download='MNLT_Register_Backup_'+backupStamp()+'.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      showToast('BACKUP SAVED');
    }catch(e){
      alert('Backup could not be created.');
      console.log('Backup error:',e);
    }
  };

  window.chooseRestoreFile=function(){
    const input=document.getElementById('restoreBackupFile');
    if(input){input.value='';input.click();}
  };

  window.restoreRegisterData=async function(input){
    const file=input&&input.files&&input.files[0];
    if(!file)return;
    try{
      const text=await file.text();
      const parsed=JSON.parse(text);
      const restored=normalizeImported(parsed);
      const receiptCount=restored.receipts.length;
      const dayCount=restored.closedDays.length;
      const ok=confirm('Restore this MNLT Register backup?\n\n'+receiptCount+' receipts\n'+dayCount+' saved days\n\nThis will replace the register data currently stored on this device.');
      if(!ok)return;

      data=restored;
      localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
      order=[];
      selectedPlate=0;
      cashText='';
      currentReceiptId=0;
      closeCash();
      closeReceipt();
      if(typeof closeSavedDays==='function')closeSavedDays();
      if(typeof closeDayModal==='function')closeDayModal();
      render();
      showToast('BACKUP RESTORED');
    }catch(e){
      alert('That file is not a valid MNLT Register backup.');
      console.log('Restore error:',e);
    }finally{
      if(input)input.value='';
    }
  };

  function addBackupControls(){
    if(document.getElementById('backupRegisterBtn'))return;
    const actions=document.querySelector('.dayActions');
    if(!actions)return;

    const backup=document.createElement('button');
    backup.id='backupRegisterBtn';
    backup.className='backupBtn';
    backup.textContent='BACKUP';
    backup.onclick=backupRegisterData;

    const restore=document.createElement('button');
    restore.id='restoreRegisterBtn';
    restore.className='restoreBtn';
    restore.textContent='RESTORE';
    restore.onclick=chooseRestoreFile;

    const closeDay=Array.from(actions.querySelectorAll('button')).find(b=>b.textContent.trim()==='CLOSE DAY');
    if(closeDay){actions.insertBefore(backup,closeDay);actions.insertBefore(restore,closeDay);}
    else{actions.appendChild(backup);actions.appendChild(restore);}

    let input=document.getElementById('restoreBackupFile');
    if(!input){
      input=document.createElement('input');
      input.id='restoreBackupFile';
      input.type='file';
      input.accept='.json,application/json';
      input.style.display='none';
      input.onchange=function(){restoreRegisterData(this);};
      document.body.appendChild(input);
    }
  }

  function v37Version(){
    document.title='MNLT Market Smoked Chicken - Register v37';
    const tag=document.querySelector('.versionTag');
    if(tag)tag.textContent='v37';
    addBackupControls();
  }

  v37Version();
  window.addEventListener('resize',()=>setTimeout(v37Version,80));
  window.addEventListener('orientationchange',()=>setTimeout(v37Version,220));
  window.addEventListener('load',()=>{
    v37Version();
    setTimeout(v37Version,300);
    setTimeout(async()=>{
      try{
        if('serviceWorker' in navigator){
          const reg=await navigator.serviceWorker.register('./service-worker.js?v=37',{updateViaCache:'none'});
          await reg.update();
        }
      }catch(e){console.log('v37 service worker update failed:',e)}
    },1000);
  });
})();
