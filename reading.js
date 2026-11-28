(function(){var h=document.documentElement,bs=document.querySelectorAll('.x6-seg button');
function set(v,save){h.dataset.len=v;[].forEach.call(bs,function(b){b.setAttribute('aria-pressed',b.dataset.v===v?'true':'false')});if(save){try{localStorage.setItem('wino-detail-length',v)}catch(e){}}}
var saved;try{saved=localStorage.getItem('wino-detail-length')}catch(e){}
set(saved==='long'?'long':'short',false);
[].forEach.call(bs,function(b){b.addEventListener('click',function(){set(b.dataset.v,true)})});})();
