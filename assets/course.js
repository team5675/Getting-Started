/* Progressive enhancement for the static course. Lessons and links remain
 * usable without this file. Demos illustrate ideas; they never run Java or
 * connect to robot hardware. Motion is opt-in and pauses off-screen. */
'use strict';
(() => {
  document.documentElement.classList.add('js-ready');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const pauses=[];
  function watchVisibility(element,pause){
    pauses.push(pause);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting)pause();
    },{threshold:.05}).observe(element);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauses.forEach(fn=>fn());});
  reduced.addEventListener('change',()=>pauses.forEach(fn=>fn()));
  // A small page-position indicator is not a completion score. No account,
  // cookies or local storage are needed, and no reading activity is transmitted.
  const main=document.querySelector('main');
  if(main&&!document.body.classList.contains('course-home')){
    const headings=[...main.querySelectorAll('h2')];
    if(headings.length>3){
      const toc=document.createElement('details');toc.className='section-index';
      const title=document.createElement('summary');title.textContent='On this page';toc.append(title);
      const list=document.createElement('ul');
      headings.forEach((heading,i)=>{if(!heading.id)heading.id=`course-section-${i+1}`;const li=document.createElement('li'),a=document.createElement('a');a.href='#'+heading.id;a.textContent=heading.textContent;li.append(a);list.append(li);});
      toc.append(list);const hero=main.querySelector('header.hero');if(hero)hero.after(toc);
    }
    const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
    let pending=false;const update=()=>{pending=false;const available=document.documentElement.scrollHeight-innerHeight;progress.style.width=(available>0?Math.min(100,Math.max(0,scrollY/available*100)):0)+'%';};
    addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
  }
  document.querySelector('[data-hello-run]')?.addEventListener('click',()=>{
    document.querySelector('[data-hello-output]').textContent='OUTPUT\nHello, robot!\n\nProgram finished.';
  });
  const pathDemo=document.querySelector('[data-path-demo]');
  if(pathDemo){
    const path=pathDemo.querySelector('#learning-route'),robot=pathDemo.querySelector('#learning-robot'),slider=pathDemo.querySelector('[data-path-position]'),button=pathDemo.querySelector('[data-path-play]'),status=pathDemo.querySelector('[data-path-state]');
    const length=path.getTotalLength();let position=0,playing=false,previous=0;
    function render(){
      const d=length*position/100,p=path.getPointAtLength(d),a=path.getPointAtLength(Math.max(0,d-.4)),b=path.getPointAtLength(Math.min(length,d+.4));
      const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
      robot.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle})`);
      // SVG y increases downward. Our illustrative coordinate y increases up.
      pathDemo.querySelector('#learning-coordinates').textContent=`x ${((p.x-48)/60).toFixed(2)} · y ${((390-p.y)/60).toFixed(2)}`;
      pathDemo.querySelector('#learning-heading').textContent=`heading ${(-angle).toFixed(0)}°`;
      slider.value=String(position);status.textContent=playing?'Playing · slowed illustration':position>=100?'Path complete · explore again':reduced.matches?'Paused · reduced motion preference':'Paused · explore at your pace';
    }
    function pause(){playing=false;previous=0;button.textContent='Animate robot path';render();}
    function tick(now){if(!playing)return;if(previous)position=Math.min(100,position+(now-previous)/100);previous=now;render();if(position>=100)pause();else requestAnimationFrame(tick);}
    button.onclick=()=>{if(playing){pause();return;}if(position>=100)position=0;playing=true;previous=0;button.textContent='Pause animation';render();requestAnimationFrame(tick);};
    pathDemo.querySelector('[data-path-step]').onclick=()=>{pause();position=position>=100?0:Math.min(100,position+10);render();};
    slider.oninput=()=>{const chosen=Number(slider.value);pause();position=chosen;render();};
    watchVisibility(pathDemo,pause);render();
  }
  const decision=document.querySelector('[data-decision-demo]');
  if(decision){const input=decision.querySelector('[data-distance]'),status=decision.querySelector('[data-decision-status]');
    const check=()=>{const distance=input.valueAsNumber;if(!Number.isFinite(distance)||distance<0||distance>100){status.textContent='Enter a distance between 0 and 100 meters for this exercise.';input.setAttribute('aria-invalid','true');return;}
      input.removeAttribute('aria-invalid');const result=distance<1;
      decision.querySelectorAll('[data-branch]').forEach(branch=>branch.dataset.active=String(branch.dataset.branch===String(result)));
      status.textContent=`At ${distance} m, ${distance} < 1.0 is ${result}. The ${result?'if':'else'} branch runs: “${result?'Too close':'Clear'}”.`;
    };decision.querySelector('[data-decision-check]').onclick=check;input.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
  }
  const loop=document.querySelector('[data-loop-demo]');
  if(loop){let phase='init',count=null,output=[],finished=false,timer=null;const button=loop.querySelector('[data-loop-play]'),status=loop.querySelector('[data-loop-status]');
    const pause=()=>{clearInterval(timer);timer=null;button.textContent='Play slowly';};
    const draw=(line,message)=>{loop.querySelectorAll('[data-line]').forEach(el=>el.classList.toggle('active',el.dataset.line===line));loop.querySelector('[data-loop-value]').textContent=count===null?'—':String(count);loop.querySelector('[data-loop-output]').textContent=output.join('\n')||'No output yet.';status.textContent=message;};
    const step=()=>{if(finished)return;
      if(phase==='init'){count=1;phase='check';draw('init','Set count to 1. Next, test the condition.');}
      else if(phase==='check'){if(count<=3){phase='print';draw('check',`${count} <= 3 is true. Enter the loop body.`);}else{finished=true;pause();draw('check',`${count} <= 3 is false. Stop; Count: 4 is never printed.`);loop.querySelector('[data-loop-step]').disabled=true;button.disabled=true;}}
      else if(phase==='print'){output.push('Count: '+count);phase='increment';draw('print',`Print Count: ${count}. The value has not increased yet.`);}
      else{count++;phase='check';draw('increment',`Increase count to ${count}. Go back to the comparison.`);}
    };
    loop.querySelector('[data-loop-step]').onclick=()=>{pause();step();};button.onclick=()=>{if(timer){pause();return;}button.textContent='Pause';step();if(!finished)timer=setInterval(step,1100);};
    loop.querySelector('[data-loop-reset]').onclick=()=>{pause();phase='init';count=null;output=[];finished=false;loop.querySelector('[data-loop-step]').disabled=false;button.disabled=false;draw(null,'Ready. First, give count its starting value.');};watchVisibility(loop,pause);
  }
  const heart=document.querySelector('[data-heartbeat-demo]');
  if(heart){let stage=-1,passes=0,timer=null;const button=heart.querySelector('[data-heart-play]'),status=heart.querySelector('[data-heart-status]');
    const descriptions=['Read the latest available sensor and controller information.','Choose what to request based on the current state and commands.','Send a request. This does not prove the mechanism has reached its target.','Finish and return. The framework schedules another pass.'];
    const pause=()=>{clearInterval(timer);timer=null;button.textContent='Play slowly';};
    const step=()=>{if(passes>=10)return;stage=(stage+1)%4;if(stage===3)passes++;
      heart.querySelectorAll('[data-heart-stage]').forEach(el=>el.classList.toggle('active',Number(el.dataset.heartStage)===stage));
      heart.querySelectorAll('.pulse-strip span').forEach((el,i)=>{el.classList.toggle('past',i<passes);el.classList.toggle('current',i===passes&&passes<10);});
      status.textContent=`${passes} complete illustrated pass${passes===1?'':'es'}. ${descriptions[stage]} ${passes===10?'Ten passes would target 200 ms at a 20 ms period; this animation was much slower.':''}`;
      if(passes===10){pause();button.disabled=true;heart.querySelector('[data-heart-step]').disabled=true;}
    };
    heart.querySelector('[data-heart-step]').onclick=()=>{pause();step();};button.onclick=()=>{if(timer){pause();return;}button.textContent='Pause';step();if(passes<10)timer=setInterval(step,900);};
    heart.querySelector('[data-heart-reset]').onclick=()=>{pause();stage=-1;passes=0;button.disabled=false;heart.querySelector('[data-heart-step]').disabled=false;heart.querySelectorAll('.active,.past,.current').forEach(el=>el.classList.remove('active','past','current'));status.textContent='Ready. The usual 20 ms target means about 50 passes per second.';};watchVisibility(heart,pause);
  }
})();
