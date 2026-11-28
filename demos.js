/* 눌러 보기 — 서버 없이 이 화면 안에서만 움직인다. 자료는 모두 지어낸 예시. */
(function(){
  var root=document.getElementById('try'); if(!root) return;
  function I(id){return document.getElementById(id)}
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function btn(x,fn,c){var b=el('button',c||'',x);b.type='button';b.addEventListener('click',fn);return b}
  function seg(box,items,cur,fn){
    box.textContent='';
    items.forEach(function(it){
      var b=btn(it[1],function(){fn(it[0]);var p=box.querySelector('[aria-pressed=true]');if(p)p.focus({preventScroll:true})});
      b.setAttribute('aria-pressed',String(it[0]===cur));box.appendChild(b);
    });
  }

  /* 탭 */
  var FOOT=['실제 시스템은 메뉴 177개를 그룹 권한에 따라 이렇게 나눠 보여 줍니다.','실제 홈 빌더도 끌어 놓아 차례를 바꾸고, 저장한 것과 발행한 것을 나눕니다.','실제 시스템도 답안지를 읽은 뒤 검수를 거쳐 성적표로 잇습니다.','실제 앱도 뜻 고르기와 철자 쓰기를 섞어 내고, 틀린 단어를 다시 묻습니다.'];
  var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
  function pick(i,focus){
    tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;I(t.getAttribute('aria-controls')).hidden=!on});
    I('t-foot').textContent=FOOT[i];
    if(focus)tabs[i].focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(i)});
    t.addEventListener('keydown',function(e){var d={ArrowRight:1,ArrowLeft:-1}[e.key];if(d){e.preventDefault();pick((i+d+tabs.length)%tabs.length,true)}});
  });
  function openLinkedTab(){
    var linked = tabs.findIndex(function(tab){return '#' + tab.id === location.hash});
    if(linked >= 0) pick(linked);
  }
  pick(0);
  openLinkedTab();
  window.addEventListener('hashchange', openLinkedTab);
  document.addEventListener('click',function(event){
    var link = event.target.closest('a[href^="#tt"]');
    if(link && link.hash === location.hash) openLinkedTab();
  });

  /* 1. 원생 현황 */
  var B={
    hb:['한빛관',142,[9,14,6,21,8,7,10,5,6,12,8,9],[4,3,5,6,4,3,2,6,4,3,5,2]],
    sb:['새봄관',96,[5,9,4,16,6,5,7,4,3,8,6,7],[2,4,3,3,2,4,3,3,2,2,3,1]],
    nr:['누리관',71,[3,6,5,12,4,6,5,3,4,7,5,6],[1,2,2,3,3,1,2,2,3,1,2,2]]
  };
  var MON=['12월','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월'];
  var ALLM=['대시보드','수업관리','학생관리','시험 · 출제','성적관리','교재 관리','수납관리','문자관리','홈페이지','그룹권한관리'];
  var ROLE={
    hq:{n:'본사 관리자',br:['all','hb','sb','nr'],menu:ALLM,full:true,t:'본사 관리자는 모든 관을 보고 메뉴 열 개를 씁니다. 달을 누르면 그 달 숫자로 바뀝니다.'},
    pr:{n:'한빛관 원장',br:['hb'],menu:ALLM.slice(0,8),full:true,t:'원장은 자기 관만 봅니다. 홈페이지와 그룹권한관리 메뉴, 다른 관 자료는 나오지 않습니다.'},
    tc:{n:'한빛관 선생님',br:['hb'],menu:ALLM.slice(0,5),full:false,t:'선생님은 자기 관의 신규와 재원만 봅니다. 교재 · 수납 · 문자 메뉴와 퇴원 숫자는 나오지 않습니다.'}
  };
  var S={role:'hq',br:'all',range:window.matchMedia&&matchMedia('(max-width:640px)').matches?6:12,m:11},SW=0;
  function ser(k){
    if(k==='all'){var a=['hb','sb','nr'].map(ser);return a[0].map(function(_,i){return a.reduce(function(p,s){return{n:p.n+s[i].n,o:p.o+s[i].o,c:p.c+s[i].c}},{n:0,o:0,c:0})})}
    var d=B[k],c=d[1];return d[2].map(function(n,i){c+=n-d[3][i];return{n:n,o:d[3][i],c:c}});
  }
  function pct(a,b){return (a/b*100).toFixed(1)}
  function kpi(box,t,v,u){var d=el('div'),dd=el('dd',null,String(v));dd.appendChild(el('small',null,u));d.appendChild(el('dt',null,t));d.appendChild(dd);box.appendChild(d)}
  function drawS(){
    var R=ROLE[S.role]; if(R.br.indexOf(S.br)<0)S.br=R.br[0]; if(S.m<12-S.range)S.m=11;
    seg(I('s-role'),Object.keys(ROLE).map(function(k){return[k,ROLE[k].n]}),S.role,function(k){S.role=k;drawS()});
    seg(I('s-range'),[[3,'3개월'],[6,'6개월'],[12,'12개월']],S.range,function(k){S.range=k;drawS()});
    seg(I('s-br'),R.br.length<2?[]:R.br.map(function(k){return[k,k==='all'?'전체':B[k][0]]}),S.br,function(k){S.br=k;drawS()});
    I('s-br').hidden=R.br.length<2;I('s-title').textContent=(S.br==='all'?'':B[S.br][0]+' ')+'원생 현황';
    var mn=I('s-menu');mn.textContent='';R.menu.forEach(function(x){mn.appendChild(el('li',x==='학생관리'?'on':'',x))});
    var D=ser(S.br),v=D[S.m],kb=I('s-kpi');kb.textContent='';
    kpi(kb,MON[S.m]+' 신규',v.n,'명');
    if(R.full)kpi(kb,MON[S.m]+' 퇴원',v.o,'명');
    kpi(kb,'재원',v.c,'명');
    if(R.full)kpi(kb,'등록률',pct(v.n,v.c),'%');
    var lg=I('s-leg');lg.textContent='';
    [['#0C3778','재원'],['#2563EB','신규']].concat(R.full?[['#93A5C2','퇴원']]:[]).forEach(function(x){var s=el('span'),i=el('i');i.style.background=x[0];s.appendChild(i);s.appendChild(document.createTextNode(x[1]));lg.appendChild(s)});
    var sv=I('s-svg'),two=I('s-two'),show=S.role==='hq'&&S.br==='all';I('s-tbl').hidden=!show;two.classList.toggle('one',!show);
    var st=12-S.range,n=S.range,W=Math.max(260,Math.round(sv.clientWidth)||480),bw=(W-8)/n,X=function(i){return 4+bw*(i-st)+bw/2},h='';
    SW=W;sv.setAttribute('viewBox','0 0 '+W+' 280');
    var cs=D.slice(st).map(function(d){return d.c}),lo=Math.min.apply(0,cs),hi=Math.max.apply(0,cs),sp=Math.max(hi-lo,1);
    var LY=function(c){return 112-(c-lo)/sp*76},mx=Math.max.apply(0,D.map(function(d){return Math.max(d.n,d.o)})),BY=function(q){return q/mx*96};
    h+='<rect x="'+(X(S.m)-bw/2)+'" y="2" width="'+bw+'" height="276" rx="10" fill="#EAF1FC"/><line x1="4" x2="'+(W-4)+'" y1="246" y2="246" stroke="#C9D5E6"/>';
    var p=[];for(var i=st;i<12;i++)p.push(X(i).toFixed(1)+','+LY(D[i].c).toFixed(1));
    h+='<polyline points="'+p.join(' ')+'" fill="none" stroke="#0C3778" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    for(i=st;i<12;i++){
      var x=X(i),on=i===S.m,w=Math.min(bw*(R.full?.32:.5),26),g=R.full?2:-w/2;
      h+='<circle cx="'+x+'" cy="'+LY(D[i].c)+'" r="'+(on?6.5:4)+'" fill="'+(on?'#fff':'#0C3778')+'" stroke="#0C3778" stroke-width="3"/>';
      h+='<rect x="'+(R.full?x-w-g:x+g)+'" y="'+(246-BY(D[i].n))+'" width="'+w+'" height="'+BY(D[i].n)+'" rx="3" fill="#2563EB"/>';
      if(R.full)h+='<rect x="'+(x+g)+'" y="'+(246-BY(D[i].o))+'" width="'+w+'" height="'+BY(D[i].o)+'" rx="3" fill="#93A5C2"/>';
      if(on||bw>52){h+='<text x="'+Math.max(16,Math.min(W-16,x))+'" y="'+(LY(D[i].c)-13)+'" text-anchor="middle" font-size="15" font-weight="700" fill="#0C3778">'+D[i].c+'</text>'}
      h+='<text x="'+x+'" y="267" text-anchor="middle" font-size="13.5" font-weight="'+(on?700:500)+'" fill="'+(on?'#0C3778':'#526079')+'">'+(bw<33?MON[i].replace('월',''):MON[i])+'</text>';
      h+='<rect class="hit" data-i="'+i+'" x="'+(x-bw/2)+'" y="2" width="'+bw+'" height="276" rx="10" fill="#2563EB00" tabindex="0" role="button" aria-pressed="'+on+'" aria-label="'+MON[i]+' 신규 '+D[i].n+'명'+(R.full?', 퇴원 '+D[i].o+'명':'')+', 재원 '+D[i].c+'명"/>';
    }
    sv.innerHTML=h;
    var tb=I('s-tbl');tb.textContent='';
    if(show){
      var t=el('table'),cp=el('caption',null,MON[S.m]+' 관별 현황'),th=el('thead'),tr=el('tr'),bd=el('tbody');
      ['관','신규','퇴원','재원'].forEach(function(q){var c=el('th',null,q);c.scope='col';tr.appendChild(c)});th.appendChild(tr);
      ['hb','sb','nr','all'].forEach(function(k){var q=ser(k)[S.m],r=el('tr',k==='all'?'sum':'');[k==='all'?'합계':B[k][0],q.n,q.o,q.c].forEach(function(c){r.appendChild(el('td',null,String(c)))});bd.appendChild(r)});
      t.appendChild(cp);t.appendChild(th);t.appendChild(bd);tb.appendChild(t);
    }
    I('s-note').textContent=R.t;
  }
  function hit(e){var r=e.target.closest&&e.target.closest('.hit');if(!r)return;if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;e.preventDefault();S.m=+r.getAttribute('data-i');drawS();var q=I('s-svg').querySelector('.hit[data-i="'+S.m+'"]');if(q&&e.type==='keydown')q.focus({preventScroll:true})}
  I('s-svg').addEventListener('click',hit);I('s-svg').addEventListener('keydown',hit);
  drawS();
  if(window.ResizeObserver)new ResizeObserver(function(){var w=Math.round(I('s-svg').clientWidth);if(w&&Math.abs(w-SW)>3&&w>=260)drawS()}).observe(I('s-svg').parentNode);

  /* 2. 홈페이지 만들기 */
  var SEC={hero:'첫 화면',about:'학원 소개',cls:'수업 안내',tea:'선생님',map:'오시는 길',ask:'상담 신청'};
  var O=Object.keys(SEC).map(function(k){return{k:k,on:true}}),COL=[['#0C3778','남색'],['#0F766E','청록'],['#6D28D9','보라'],['#B4234A','자주']],P={c:COL[0][0],d:'pc'};
  var SV={grip:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.8"/><circle cx="15" cy="6" r="1.8"/><circle cx="9" cy="12" r="1.8"/><circle cx="15" cy="12" r="1.8"/><circle cx="9" cy="18" r="1.8"/><circle cx="15" cy="18" r="1.8"/></svg>',up:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',dn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',no:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M6.5 7.6C3.6 9.4 2 12 2 12s3.6 6.5 10 6.5c1.8 0 3.4-.5 4.7-1.2M10 5.7c.6-.1 1.3-.2 2-.2 6.4 0 10 6.5 10 6.5s-.8 1.500-2.400 3.100"/></svg>'};
  function ib(svg,label,fn,c){var b=btn('',fn,c);b.innerHTML=svg;b.setAttribute('aria-label',label);b.title=label;return b}
  function dirty(){I('b-note').textContent='발행 전 바뀐 내용이 있어요';I('b-pub').disabled=false}
  function page(){
    var pg=I('b-page'),nm=I('b-name').value.trim()||'학원 이름',cp=I('b-copy').value.trim()||'첫 화면 문구';
    pg.className='t-page'+(P.d==='ph'?' phone':'');pg.style.setProperty('--k',P.c);pg.textContent='';
    var hd=el('header');hd.appendChild(el('b',null,nm));hd.appendChild(el('span',null,'소개 · 수업 · 상담'));pg.appendChild(hd);
    O.forEach(function(o){
      if(!o.on)return;
      var s=el('div','s k-'+o.k),b;
      if(o.k==='hero'){s.appendChild(el('b',null,cp));s.appendChild(el('i',null,'상담 신청'))}
      else{
        s.appendChild(el('b',null,SEC[o.k]));
        if(o.k==='about')s.appendChild(el('p',null,nm+'은 학생마다 다른 속도를 먼저 봅니다.'));
        if(o.k==='cls'){b=el('div','g');[['초등','읽기와 단어'],['중등','내신과 문법'],['고등','독해와 듣기']].forEach(function(x){var d=el('div');d.appendChild(el('b',null,x[0]));d.appendChild(document.createTextNode(x[1]));b.appendChild(d)});s.appendChild(b)}
        if(o.k==='tea'){b=el('div','t');['가 선생님','나 선생님','다 선생님'].forEach(function(x){var d=el('div');d.innerHTML='<svg viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="27" fill="'+P.c+'" opacity=".14"/><circle cx="27" cy="22" r="9" fill="'+P.c+'"/><path d="M10 46c2-10 9-14 17-14s15 4 17 14" fill="'+P.c+'"/></svg>';d.appendChild(el('span',null,x));b.appendChild(d)});s.appendChild(b)}
        if(o.k==='map')s.appendChild(el('div','spot'));
        if(o.k==='ask'){s.appendChild(el('i',null,'상담 신청하기'))}
      }
      pg.appendChild(s);
    });
    if(!O.some(function(o){return o.on})){var e=el('div','s');e.appendChild(el('p',null,'보이는 구역이 없어요. 왼쪽에서 눈 단추를 눌러 켜 주세요.'));pg.appendChild(e)}
  }
  function mv(a,b,f){if(b<0||b>=O.length)return;O.splice(b,0,O.splice(a,1)[0]);list();page();dirty();var q=I('b-list').children[b].querySelector(f);if(q&&!q.disabled)q.focus({preventScroll:true})}
  function list(){
    var L=I('b-list');L.textContent='';
    O.forEach(function(o,i){
      var li=el('li',o.on?'':'off'),n=SEC[o.k];
      var g=ib(SV.grip,n+' 끌어서 옮기기',function(){},'grip');g.tabIndex=-1;
      g.addEventListener('pointerdown',function(e){
        e.preventDefault();li.classList.add('drag');try{g.setPointerCapture(e.pointerId)}catch(x){}
        function go(ev){
          var sib=[].slice.call(L.children),a=sib.indexOf(li),b=-1,k;
          sib.forEach(function(x,j){var r=x.getBoundingClientRect();if(ev.clientY>=r.top&&ev.clientY<=r.bottom)b=j});
          if(b<0||b===a)return;
          if(a<b){for(k=a+1;k<=b;k++)L.insertBefore(sib[k],li)}else{for(k=a-1;k>=b;k--)L.insertBefore(sib[k],li.nextSibling)}
          O.splice(b,0,O.splice(a,1)[0]);page();dirty();
        }
        function end(){g.removeEventListener('pointermove',go);g.removeEventListener('pointerup',end);g.removeEventListener('pointercancel',end);list()}
        g.addEventListener('pointermove',go);g.addEventListener('pointerup',end);g.addEventListener('pointercancel',end);
      });
      li.appendChild(g);li.appendChild(el('span',null,n));
      var u=ib(SV.up,n+' 위로',function(){mv(i,i-1,'.u')},'u'),d=ib(SV.dn,n+' 아래로',function(){mv(i,i+1,'.d')},'d');
      u.disabled=i===0;d.disabled=i===O.length-1;
      var y=ib(o.on?SV.eye:SV.no,n+(o.on?' 숨기기':' 보이기'),function(){o.on=!o.on;list();page();dirty();I('b-list').children[i].querySelector('.y').focus({preventScroll:true})},'y');
      li.appendChild(u);li.appendChild(d);li.appendChild(y);L.appendChild(li);
    });
  }
  function sw(){var s=I('b-sw');s.textContent='';COL.forEach(function(c){var b=btn('',function(){P.c=c[0];sw();page();dirty();s.querySelector('[aria-pressed=true]').focus({preventScroll:true})});b.style.setProperty('--k',c[0]);b.setAttribute('aria-label',c[1]);b.title=c[1];b.setAttribute('aria-pressed',String(P.c===c[0]));s.appendChild(b)})}
  function dev(){seg(I('b-dev'),[['pc','컴퓨터'],['ph','휴대폰']],P.d,function(k){P.d=k;dev();page()})}
  ['b-name','b-copy'].forEach(function(id){I(id).addEventListener('input',function(){page();dirty()})});
  I('b-pub').addEventListener('click',function(){I('b-note').textContent='발행했어요. 체험 화면이라 저장되지는 않아요.';I('b-pub').disabled=true});
  sw();dev();list();page();

  /* 3. 답안 채점 */
  var A=[['시작하다','begin','begin',98],['빌리다','borrow','borrow',96],['용감한','brave','brave',97],['여행','jorney','journey',95],['조용한','quiet','quiet',61,['quiet','quite']],['이웃','neighbar','neighbor',57,['neighbor','neighbar']],['가져왔다','brought','brought',94],['아름다운','beautiful','beautiful',93]];
  var G={step:0,read:0,pickd:{}},tm=[];
  function hand(w,i){var e=el('em');e.setAttribute('aria-label','손글씨 답 '+(i+1)+'번');w.split('').forEach(function(ch,j){var s=el('i',null,ch),r=((i*7+j*13)%9-4),y=((i*5+j*11)%5-2);s.style.transform='translateY('+y*.7+'px) rotate('+r+'deg)';e.appendChild(s)});return e}
  function rd(i){return A[i][4]?G.pickd[i]:A[i][1]}
  function left(){return A.filter(function(a,i){return a[4]&&!G.pickd[i]}).length}
  function drawG(){
    var L=I('g-in');L.textContent='';
    A.forEach(function(a,i){
      var c='';if(i<G.read){var r=rd(i);c=a[4]&&!r?'warn':(G.step===2?(r===a[2]?'good':'bad'):'read')}
      var li=el('li',c);li.appendChild(el('span',null,String(i+1)));li.appendChild(el('span',null,a[0]));li.appendChild(hand(a[1],i));L.appendChild(li);
    });
    [].forEach.call(I('g-st').children,function(x,k){x.className=k<=G.step?'on':''});
    var R=I('g-rd');R.textContent='';
    for(var i=0;i<G.read;i++)(function(i){
      var a=A[i],r=rd(i),li=el('li',a[4]&&!r?'w':'');
      li.appendChild(el('span',null,String(i+1)));li.appendChild(el('b',null,r||'확인 필요'));
      if(a[4]&&r)li.appendChild(el('span','hc','사람이 확인'));else{var m=el('span','m'),f=el('i');f.style.width=a[3]+'%';m.appendChild(f);li.appendChild(m)}
      if(G.step===2){var ok=r===a[2];li.appendChild(el('span','ox '+(ok?'o':'x'),ok?'맞음':'틀림'))}else li.appendChild(el('u',null,a[4]&&r?'':a[3]+'%'));
      if(a[4]&&!r){var q=el('span','q');q.appendChild(el('span',null,'어떻게 썼나요?'));a[4].forEach(function(w){q.appendChild(btn(w,function(){G.pickd[i]=w;if(!left()){G.step=2}drawG()}))});li.appendChild(q)}
      R.appendChild(li);
    })(i);
    var sc=I('g-sc'),go=I('g-go');sc.textContent='';
    if(G.step===0&&!G.read){I('g-t').textContent='손글씨 답안 여덟 개';I('g-n').textContent='[AI로 읽기]를 누르면 답을 글자로 바꾸고, 얼마나 자신 있는지도 함께 적습니다.';go.textContent='AI로 읽기';go.disabled=false}
    else if(G.read<A.length){I('g-t').textContent='읽는 중';I('g-n').textContent=G.read+' / '+A.length;go.textContent='읽는 중';go.disabled=true}
    else if(left()){I('g-t').textContent='두 칸은 사람이 봅니다';I('g-n').textContent='자신 있는 여섯 칸은 그대로 두고, 헷갈리는 칸만 물어봅니다. 남은 칸 '+left()+'개';go.textContent='처음부터';go.disabled=false}
    else{
      var ok=A.filter(function(a,i){return rd(i)===a[2]}).length,bad=A.filter(function(a,i){return rd(i)!==a[2]}).map(function(a){return a[2]});
      I('g-t').textContent='채점이 끝났어요';I('g-n').textContent='';
      var bx=el('div','t-score');bx.appendChild(el('b',null,Math.round(ok/A.length*100)+'점'));
      bx.appendChild(el('p',null,'여덟 개 가운데 '+ok+'개를 맞혔어요. '+(bad.length?'다시 볼 단어는 '+bad.join(', ')+'입니다.':'다시 볼 단어가 없습니다.')));
      sc.appendChild(bx);go.textContent='처음부터';go.disabled=false;
    }
  }
  I('g-go').addEventListener('click',function(){
    tm.forEach(clearTimeout);tm=[];
    if(G.read){G={step:0,read:0,pickd:{}};I('g-sheet').classList.remove('run');drawG();return}
    var sh=I('g-sheet');sh.classList.remove('run');void sh.offsetWidth;sh.classList.add('run');
    for(var k=1;k<=A.length;k++)(function(k){tm.push(setTimeout(function(){G.read=k;if(k===A.length){G.step=1;sh.classList.remove('run')}drawG()},k*290))})(k);
    G.read=0;I('g-go').disabled=true;I('g-go').textContent='읽는 중';I('g-t').textContent='읽는 중';I('g-n').textContent='0 / '+A.length;
  });
  drawG();

  /* 4. 더푼다 */
  var Q0=[{t:'m',w:'begin',a:'시작하다',o:['빌리다','시작하다','이웃','조용한']},{t:'s',w:'brave',a:'용감한'},{t:'m',w:'borrow',a:'빌리다',o:['빌리다','가져오다','여행','용감한']},{t:'s',w:'cloud',a:'구름'},{t:'m',w:'quiet',a:'조용한',o:['빠른','시끄러운','조용한','아름다운']}];
  var q;
  function mix(w){var a=(w+'eo').split('');for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
  function reset(){q={l:Q0.map(function(x){return{t:x.t,w:x.w,a:x.a,o:x.o,again:false}}),i:0,xp:0,done:false,first:0};drawQ()}
  function top(box){
    var t=el('div','t-top'),l=el('span',null,'연속 6일'),r=el('span',null,'경험치 '+q.xp);t.appendChild(l);t.appendChild(r);box.appendChild(t);
    var p=el('div','t-prog'),f=el('i');f.style.width=(q.i/q.l.length*100)+'%';p.appendChild(f);box.appendChild(p);
  }
  function after(ok,c,say,nx){
    say.textContent=ok?'딩동댕! 경험치 10을 받았어요.':'정답은 '+(c.t==='m'?c.a:c.w)+'예요.'+(c.again?'':' 마지막에 다시 나와요.');
    say.className=ok?'ok':'no';
    if(ok){q.xp+=10;if(!c.again)q.first++}else if(!c.again)q.l.push({t:c.t,w:c.w,a:c.a,o:c.o,again:true});
    nx.disabled=false;nx.focus({preventScroll:true});
  }
  function drawQ(){
    var bx=I('q');bx.textContent='';
    if(q.i>=q.l.length){
      top(bx);var e=el('div','t-end'),im=el('img');im.src='img/punda-face.png';im.alt='';im.width=320;im.height=320;im.style.borderRadius='34px';
      e.appendChild(im);e.appendChild(el('b',null,'오늘 단어를 다 풀었어요!'));e.appendChild(el('span','t-xp','경험치 +'+q.xp));e.appendChild(el('p',null,'한 번에 맞힌 단어 '+q.first+'개'));bx.appendChild(e);
      var s0=el('div','t-say2');s0.appendChild(btn('다시 풀기',reset,'t-vb'));bx.appendChild(s0);return;
    }
    var c=q.l[q.i];top(bx);
    var card=el('div','t-q'),say=el('p'),nx=btn('다음',function(){q.i++;drawQ()},'t-vb'),foot=el('div','t-say2');
    say.setAttribute('aria-live','polite');nx.disabled=true;
    card.appendChild(el('small',null,c.again?'다시 나온 단어예요':(c.t==='m'?'뜻을 고르세요':'철자를 차례로 누르세요')));
    card.appendChild(el('b',null,c.t==='m'?c.w:c.a));bx.appendChild(card);
    if(c.t==='m'){
      var an=el('div','t-ans');c.o.forEach(function(x){an.appendChild(btn(x,function(){
        var ok=x===c.a;[].forEach.call(an.children,function(b){b.disabled=true;if(b.textContent===c.a)b.className='ok';else if(b.textContent===x)b.className='no'});after(ok,c,say,nx);
      }))});bx.appendChild(an);
    }else{
      var bl=el('p','blank'),got=[],lt=el('div','t-let');
      function sh(){bl.textContent=c.w.split('').map(function(_,k){return got[k]?got[k].textContent:'_'}).join(' ')}
      card.appendChild(bl);sh();
      mix(c.w).forEach(function(ch){var b=btn(ch,function(){
        if(got.length>=c.w.length)return;got.push(b);b.disabled=true;sh();
        if(got.length===c.w.length){var w=got.map(function(z){return z.textContent}).join('');[].forEach.call(lt.children,function(z){z.disabled=true});er.hidden=true;after(w===c.w,c,say,nx)}
      });lt.appendChild(b)});
      var er=btn('한 글자 지우기',function(){var z=got.pop();if(z){z.disabled=false;sh();z.focus({preventScroll:true})}});er.style.cssText='appearance:none;border:0;background:none;font:600 15px/1 var(--text);color:#5A22B8;min-height:44px;cursor:pointer';
      bx.appendChild(lt);bx.appendChild(er);
    }
    foot.appendChild(say);foot.appendChild(nx);bx.appendChild(foot);
  }
  reset();
})();
