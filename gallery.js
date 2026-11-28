(function(){
  var links=document.querySelectorAll('.x4-shots a[href$=".webp"]');
  if(!links.length||typeof HTMLDialogElement==='undefined')return;
  var d=document.createElement('dialog');d.className='x7-lb';d.setAttribute('aria-label','실제 화면 크게 보기');
  d.innerHTML='<form method="dialog"><button type="submit" aria-label="닫기">닫기 ✕</button></form><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(d);
  var im=d.querySelector('img'),cap=d.querySelector('figcaption');
  d.addEventListener('click',function(e){if(e.target===d||e.target===d.querySelector('figure'))d.close()});
  Array.prototype.forEach.call(links,function(a){
    var th=a.querySelector('img');
    a.setAttribute('role','button');a.setAttribute('aria-haspopup','dialog');
    a.addEventListener('click',function(e){
      e.preventDefault();
      im.src=a.getAttribute('href');im.alt=th?th.alt:'';cap.textContent=th?th.alt:'';
      d.showModal();
    });
    a.addEventListener('keydown',function(e){if(e.key===' '){e.preventDefault();a.click()}});
  });
})();
