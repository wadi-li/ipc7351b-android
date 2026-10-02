const LIB={
R:{name:"Резистор",pfx:"RESC",items:[
["0402","1005",1.00,0.05,0.50,0.05,0.25,0.10,0.40,"Yageo RC0402"],
["0603","1608",1.60,0.10,0.80,0.10,0.25,0.15,0.55,"Yageo RC0603"],
["0805","2012",2.00,0.10,1.25,0.10,0.35,0.20,0.60,"Yageo RC0805"],
["0612","1632",1.60,0.15,3.10,0.15,0.30,0.15,0.50,"Vishay MCW 0612 AT (выводы по длинной стороне)"],
["1206","3216",3.10,0.10,1.60,0.10,0.45,0.20,0.65,"Yageo RC1206"],
["1210","3225",3.10,0.10,2.60,0.15,0.50,0.20,0.65,"Yageo RC1210"],
["2010","5025",5.00,0.10,2.50,0.15,0.55,0.20,0.65,"Yageo RC2010"],
["2512","6332",6.35,0.10,3.10,0.15,0.60,0.20,0.65,"Yageo RC2512"]]},
C:{name:"Конденсатор",pfx:"CAPC",items:[
["0402","1005",1.00,0.05,0.50,0.05,0.30,0.10,0.55,"KEMET"],
["0603","1608",1.60,0.15,0.80,0.15,0.35,0.15,0.95,"KEMET"],
["0805","2012",2.00,0.20,1.25,0.20,0.50,0.25,1.45,"KEMET"],
["1206","3216",3.20,0.20,1.60,0.20,0.50,0.25,1.80,"KEMET"],
["1210","3225",3.20,0.20,2.50,0.20,0.50,0.25,2.75,"KEMET"],
["1808","4520",4.70,0.50,2.00,0.20,0.60,0.35,2.20,"KEMET"],
["1810","4525",4.50,0.30,2.50,0.20,0.60,0.35,2.50,"размеры приняты (нет данных производителя)"],
["1812","4532",4.50,0.30,3.20,0.30,0.60,0.35,2.80,"KEMET"],
["2010","5025",5.00,0.30,2.50,0.20,0.60,0.35,2.50,"размеры приняты (нет данных производителя)"],
["2220","5750",5.70,0.40,5.00,0.40,0.60,0.35,2.80,"KEMET"]]},
L:{name:"Дроссель",pfx:"INDC",items:[
["0402","1005",1.00,0.05,0.50,0.05,0.25,0.10,0.55,"TDK MLZ1005"],
["0603","1608",1.60,0.15,0.80,0.15,0.30,0.20,0.95,"TDK MLZ1608"],
["0805","2012",2.00,0.20,1.25,0.20,0.50,0.30,1.35,"TDK MLZ2012 (вывод принят)"],
["1008","2520",2.50,0.20,2.00,0.20,0.50,0.25,2.05,"типовые размеры (Coilcraft 1008 — сверить с даташитом)"],
["1206","3216",3.20,0.20,1.60,0.20,0.50,0.30,1.20,"типовые размеры — сверить с даташитом"],
["1210","3225",3.20,0.20,2.50,0.20,0.50,0.30,2.00,"типовые размеры — сверить с даташитом"],
["1812","4532",4.50,0.30,3.20,0.20,0.60,0.30,3.20,"типовые размеры — сверить с даташитом"]]}
};
const J={
big:{A:{t:0.55,h:0.00,s:0.05,c:0.50},B:{t:0.35,h:0.00,s:0.00,c:0.25},C:{t:0.15,h:0.00,s:-0.05,c:0.10}},
small:{A:{t:0.20,h:0.00,s:0.05,c:0.20},B:{t:0.10,h:0.00,s:0.00,c:0.15},C:{t:0.00,h:0.00,s:-0.05,c:0.10}}
};
const LV=[["A","Level A — Most","ручной монтаж, макс. галтели"],["B","Level B — Nominal","стандартный автоматический монтаж"],["C","Level C — Least","сверхплотный автоматический монтаж"]];
const SUF={A:"M",B:"N",C:"L"};
const NOTE="* — размер изменён относительно расчётного в бо́льшую сторону: площадка увеличена так, чтобы корпус элемента не выступал за её пределы (В ≥ Wmax, Z ≥ Lmax).";
const E=1e-9;
const r05=v=>Math.round((v+E)/0.05)*0.05;
const c05=v=>Math.ceil((v-E)/0.05)*0.05;
const f2=v=>(Math.abs(v)<5e-4?0:v).toFixed(2);
const f3=v=>{let s=(Math.abs(v)<5e-4?0:v).toFixed(3);return s.endsWith("0")?s.slice(0,-1):s};
const fc=v=>f3(v).replace(".",",");
let type="R";
const $=id=>document.getElementById(id);
function calc(d,lv,F,P){
  const jj=(d.L<1.5?J.small:J.big)[lv];
  const Lmin=d.L-d.Lt,Lmax=d.L+d.Lt,Wmin=d.W-d.Wt,Wmax=d.W+d.Wt,Tmin=d.T-d.Tt,Tmax=d.T+d.Tt;
  const CL=2*d.Lt,CW=2*d.Wt,CT=2*d.Tt;
  const Smin=Lmin-2*Tmax,Smax=Lmax-2*Tmin,CS=Smax-Smin;
  const CSr=Math.sqrt(CL*CL+2*CT*CT),SmaxR=Smax-(CS-CSr)/2;
  const Z=Lmin+2*jj.t+Math.sqrt(CL*CL+F*F+P*P);
  const G=SmaxR-2*jj.h-Math.sqrt(CSr*CSr+F*F+P*P);
  const X=Wmin+2*jj.s+Math.sqrt(CW*CW+F*F+P*P);
  let Y=r05((Z-G)/2),Xr=r05(X),h=r05((Z+G)/4);
  let gap=2*h-Y,Zt=2*h+Y;
  const raw={Y,X:Xr,h,gap,Z:Zt,Zc:Z,Gc:G,Xc:X};
  const fl={X:false,Y:false,h:false,Z:false};
  if(Xr<Wmax-E){Xr=c05(Wmax);fl.X=true;}
  if(Zt<Lmax-E){Y=c05((Lmax-gap)/2);h=(gap+Y)/2;Zt=gap+2*Y;fl.Y=fl.h=fl.Z=true;}
  const cx=c05(Math.max(Zt,Lmax)+2*jj.c),cy=c05(Math.max(Xr,Wmax)+2*jj.c);
  return {Y,X:Xr,h,gap,Z:Zt,cx,cy,fl,raw,jj,Lmax,Wmax,Smin,Smax};
}
function ipcName(pfx,d,lv){const p2=n=>String(n).padStart(2,"0");return pfx+p2(Math.round(d.L*10))+p2(Math.round(d.W*10))+"X"+p2(Math.round(d.H*100))+SUF[lv];}
function itemToD(it){return {L:it[2],Lt:it[3],W:it[4],Wt:it[5],T:it[6],Tt:it[7],H:it[8]};}
function svg(d,r){
  const Wd=330,Hd=200;
  const ext=Math.max(r.cx,d.L+d.Lt)+0.2,eyt=Math.max(r.cy,d.W+d.Wt)+0.2;
  const s=Math.min(Wd/ext,Hd/eyt),cx=Wd/2+10,cy=Hd/2+10;
  const R=(x,y,w,h,st)=>`<rect x="${(cx+x*s).toFixed(1)}" y="${(cy+y*s).toFixed(1)}" width="${(w*s).toFixed(1)}" height="${(h*s).toFixed(1)}" ${st}/>`;
  let o=`<svg class="fp" viewBox="0 0 ${Wd+20} ${Hd+20}" xmlns="http://www.w3.org/2000/svg">`;
  o+=R(-r.cx/2,-r.cy/2,r.cx,r.cy,'fill="none" style="stroke:var(--cys)" stroke-dasharray="4 3" stroke-width="1"');
  const ps='style="fill:var(--padf);stroke:var(--pads)" fill-opacity="0.85"';
  o+=R(-r.h-r.Y/2,-r.X/2,r.Y,r.X,ps);o+=R(r.h-r.Y/2,-r.X/2,r.Y,r.X,ps);
  const Lm=d.L+d.Lt,Wm=d.W+d.Wt,Tm=d.T;
  o+=R(-Lm/2,-Wm/2,Lm,Wm,'fill="none" style="stroke:var(--bodys)" stroke-width="1.6"');
  o+=R(-Lm/2,-Wm/2,Tm,Wm,'style="fill:var(--bodys)" fill-opacity="0.25"');
  o+=R(Lm/2-Tm,-Wm/2,Tm,Wm,'style="fill:var(--bodys)" fill-opacity="0.25"');
  o+=`<line x1="${cx-4}" y1="${cy}" x2="${cx+4}" y2="${cy}" style="stroke:var(--cross)"/><line x1="${cx}" y1="${cy-4}" x2="${cx}" y2="${cy+4}" style="stroke:var(--cross)"/>`;
  o+=`<text x="6" y="${Hd+15}" font-size="10" style="fill:var(--mut)">площадки • корпус Lmax×Wmax • courtyard (пунктир)</text></svg>`;
  return o;
}
function readD(){return {L:+$("L").value,Lt:+$("Lt").value,W:+$("W").value,Wt:+$("Wt").value,T:+$("T").value,Tt:+$("Tt").value,H:+$("H").value};}
function FP(){return [+$("F").value,+$("P").value];}
function curItem(){return LIB[type].items[+$("size").value];}
function fillSizes(){const sel=$("size");sel.innerHTML="";LIB[type].items.forEach((it,i)=>{const o=document.createElement("option");o.value=i;o.textContent=it[0]+" ("+it[1]+")";sel.appendChild(o);});}
function loadItem(){
  const it=curItem();
  [["L",2],["Lt",3],["W",4],["Wt",5],["T",6],["Tt",7],["H",8]].forEach(([k,i])=>$(k).value=it[i].toFixed(2));
  $("src").innerHTML="Источник размеров: <b>"+it[9]+"</b>. Поля можно редактировать под конкретный партномер — расчёт обновится.";
  render();
}
function edited(){const it=curItem(),d=readD();return ["L","Lt","W","Wt","T","Tt","H"].some((k,i)=>Math.abs(d[k]-it[i+2])>1e-6);}
const st=f=>f?"*":"";
function cell(v,flag,dig){return (dig===3?f3(v):f2(v))+(flag?'<span class="corr">*</span>':'');}
function render(){
  const d=readD(),[F,P]=FP();
  $("Lmin").textContent=f2(d.L-d.Lt);$("Lmax").textContent=f2(d.L+d.Lt);
  $("Wmin").textContent=f2(d.W-d.Wt);$("Wmax").textContent=f2(d.W+d.Wt);
  $("Tmin").textContent=f2(d.T-d.Tt);$("Tmax").textContent=f2(d.T+d.Tt);
  $("Hmax").textContent=f2(d.H);
  $("Smin").textContent=f2(d.L-d.Lt-2*(d.T+d.Tt));$("Smax").textContent=f2(d.L+d.Lt-2*(d.T-d.Tt));
  let html="",anyC=false;
  LV.forEach(([lv,title,sub])=>{
    const r=calc(d,lv,F,P);const fl=r.fl;if(fl.X||fl.Y)anyC=true;
    const warn=r.gap<0.2?'<div class="warn">Зазор между площадками &lt; 0,20 мм — проверьте технологические нормы производителя ПП.</div>':'';
    html+=`<div class="lvl"><h3>${title}</h3><div class="sub">${sub} • J<sub>T</sub>=${f2(r.jj.t)}, J<sub>H</sub>=${f2(r.jj.h)}, J<sub>S</sub>=${f2(r.jj.s)}, courtyard ${f2(r.jj.c)}</div>
    <div style="margin-bottom:6px">Имя: <span class="name">${ipcName(LIB[type].pfx,d,lv)}</span></div>
    <table>
    <tr><th>Параметр</th><th>Итог</th><th>Расчёт</th></tr>
    <tr><td class="l">Площадка Ш × В</td><td>${cell(r.Y,fl.Y)} × ${cell(r.X,fl.X)}</td><td>${f2(r.raw.Y)} × ${f2(r.raw.X)}</td></tr>
    <tr><td class="l">±X центра</td><td>${cell(r.h,fl.h,3)}</td><td>${f2(r.raw.h)}</td></tr>
    <tr><td class="l">Расстояние между центрами</td><td>${cell(2*r.h,fl.h,3)}</td><td>${f2(2*r.raw.h)}</td></tr>
    <tr><td class="l">Зазор G</td><td>${f2(r.gap)}</td><td>${f2(r.raw.gap)}</td></tr>
    <tr><td class="l">Общая длина Z</td><td>${cell(r.Z,fl.Z)}</td><td>${f2(r.raw.Z)}</td></tr>
    <tr><td class="l">Courtyard</td><td>${f2(r.cx)} × ${f2(r.cy)}</td><td>—</td></tr>
    <tr><td class="l small">Z / G / X до округл.</td><td colspan="2" class="small">${f3(r.raw.Zc)} / ${f3(r.raw.Gc)} / ${f3(r.raw.Xc)}</td></tr>
    </table>${warn}${svg(d,r)}</div>`;
  });
  $("levels").innerHTML=html;
  $("footnote").innerHTML=anyC?'<p class="corr" style="font-weight:600">* Размер изменён относительно расчётного в бо́льшую сторону: площадка увеличена так, чтобы корпус элемента не выступал за её пределы (ширина площадки ≥ Wmax, общая длина Z ≥ Lmax). Удлинение выполнено наружу, зазор между площадками сохранён.</p>':'<p>Для выбранного элемента коррекция не потребовалась.</p>';
  renderSummary(F,P);
}
function renderSummary(F,P){
  let h='<tr><th rowspan="2">Типоразмер</th><th rowspan="2">Корпус L×W</th>';
  LV.forEach(([lv])=>h+=`<th colspan="3">Level ${lv}</th>`);
  h+='</tr><tr>';LV.forEach(()=>h+='<th>Площадка Ш×В</th><th>±X</th><th>Зазор</th>');h+='</tr>';
  LIB[type].items.forEach(it=>{
    const d=itemToD(it);
    h+=`<tr><td>${it[0]} (${it[1]})</td><td>${f2(d.L)}±${f2(d.Lt)} × ${f2(d.W)}±${f2(d.Wt)}</td>`;
    LV.forEach(([lv])=>{const r=calc(d,lv,F,P);h+=`<td>${cell(r.Y,r.fl.Y)} × ${cell(r.X,r.fl.X)}</td><td>${cell(r.h,r.fl.h,3)}</td><td>${f2(r.gap)}</td>`;});
    h+='</tr>';
  });
  $("summary").innerHTML=h;
}
function renderJ(){
  let h='<tr><th>Группа</th><th>Level</th><th>J<sub>T</sub> (носок)</th><th>J<sub>H</sub> (пятка)</th><th>J<sub>S</sub> (бок)</th><th>Courtyard</th></tr>';
  [["big","≥ 0603 (1608)"],["small","< 0603 (1608)"]].forEach(([g,n])=>["A","B","C"].forEach(lv=>{
    h+=`<tr><td>${n}</td><td>${lv}</td>`+["t","h","s","c"].map(k=>`<td><input type="number" step="0.01" data-g="${g}" data-l="${lv}" data-k="${k}" value="${J[g][lv][k].toFixed(2)}"></td>`).join("")+'</tr>';
  }));
  $("jtab").innerHTML=h;
  $("jtab").querySelectorAll("input").forEach(i=>i.addEventListener("input",e=>{const t=e.target;J[t.dataset.g][t.dataset.l][t.dataset.k]=+t.value;render();}));
}
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),1800);}
function copyText(t,msg){
  if(window.AndroidBridge){try{AndroidBridge.copy(t);toast(msg);}catch(e){toast("Ошибка копирования");}return;}
  const fb=()=>{const ta=document.createElement("textarea");ta.value=t;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();
    let ok=false;try{ok=document.execCommand("copy");}catch(e){}document.body.removeChild(ta);toast(ok?msg:"Не удалось скопировать — браузер запретил доступ к буферу");};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(()=>toast(msg),fb);}else fb();
}
function download(name,text,mime){
  if(window.AndroidBridge){AndroidBridge.saveFile(name,(mime||"text/plain").split(";")[0],text);return;}
  const b=new Blob([text],{type:mime||"text/plain;charset=utf-8"});const a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);toast("Файл сохранён: "+name);
}
const stamp=()=>{const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"_"+p(d.getHours())+p(d.getMinutes());};
function curLabel(){const it=curItem();return LIB[type].name+" "+it[0]+" ("+it[1]+")";}
function mdCurrent(){
  const d=readD(),[F,P]=FP();let any=false;
  let s=`## ${curLabel()} — IPC-7351B\n\n`;
  s+=`Корпус: L = ${f2(d.L)} ± ${f2(d.Lt)}, W = ${f2(d.W)} ± ${f2(d.Wt)}, T = ${f2(d.T)} ± ${f2(d.Tt)}, Hmax = ${f2(d.H)} мм${edited()?" (изменено пользователем)":""}. F = ${F}, P = ${P}.\n\n`;
  s+="| Параметр | Level A | Level B | Level C |\n|---|---|---|---|\n";
  const R={};["A","B","C"].forEach(l=>{R[l]=calc(d,l,F,P);if(R[l].fl.X||R[l].fl.Y)any=true;});
  const row=(n,fn)=>s+=`| ${n} | ${["A","B","C"].map(l=>fn(R[l],l)).join(" | ")} |\n`;
  row("Имя IPC",(r,l)=>ipcName(LIB[type].pfx,d,l));
  row("Площадка Ш × В, мм",r=>f2(r.Y)+st(r.fl.Y)+" × "+f2(r.X)+st(r.fl.X));
  row("±X центра, мм",r=>f3(r.h)+st(r.fl.h));
  row("Между центрами, мм",r=>f3(2*r.h)+st(r.fl.h));
  row("Зазор G, мм",r=>f2(r.gap));
  row("Общая длина Z, мм",r=>f2(r.Z)+st(r.fl.Z));
  row("Courtyard, мм",r=>f2(r.cx)+" × "+f2(r.cy));
  if(any)s+="\n"+NOTE.replace("*","\\*")+"\n";
  return s;
}
function rowsFor(t,F,P){const out=[];LIB[t].items.forEach(it=>{const d=itemToD(it);["A","B","C"].forEach(l=>{out.push({t,it,d,l,r:calc(d,l,F,P)});});});return out;}
const HDR=["Тип","Типоразмер EIA","Метрич.","L","±L","W","±W","T","±T","Hmax","Level","Имя IPC","Площадка Ш","Площадка В","±X центра","Между центрами","Зазор G","Z","Courtyard X","Courtyard Y","Коррекция","Источник"];
function rowArr(o){
  const {t,it,d,l,r}=o,n=fc;
  return [LIB[t].name,it[0],it[1],n(d.L),n(d.Lt),n(d.W),n(d.Wt),n(d.T),n(d.Tt),n(d.H),l,ipcName(LIB[t].pfx,d,l),
    n(r.Y)+st(r.fl.Y),n(r.X)+st(r.fl.X),n(r.h)+st(r.fl.h),n(2*r.h)+st(r.fl.h),n(r.gap),n(r.Z)+st(r.fl.Z),n(r.cx),n(r.cy),(r.fl.X||r.fl.Y)?"да":"",it[9]];
}
function csv(types){
  const [F,P]=FP();const q=v=>/[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;
  let s=HDR.join(";")+"\n";
  types.forEach(t=>rowsFor(t,F,P).forEach(o=>s+=rowArr(o).map(q).join(";")+"\n"));
  s+="\n"+q(NOTE)+"\n"+q(`F = ${F}; P = ${P}; размеры в мм; IPC-7351B`)+"\n";
  return "\ufeff"+s;
}
function tsvSummary(){const [F,P]=FP();let s=HDR.join("\t")+"\n";rowsFor(type,F,P).forEach(o=>s+=rowArr(o).join("\t")+"\n");return s+"\n"+NOTE+"\n";}
function jsonCur(){
  const d=readD(),[F,P]=FP(),it=curItem();
  const lv={};["A","B","C"].forEach(l=>{const r=calc(d,l,F,P);lv[l]={name:ipcName(LIB[type].pfx,d,l),J:r.jj,pad_length:+f3(r.Y),pad_width:+f3(r.X),center_x:+f3(r.h),pitch:+f3(2*r.h),gap:+f3(r.gap),Z:+f3(r.Z),courtyard:[+f3(r.cx),+f3(r.cy)],corrected:r.fl,calculated:{Z:+r.raw.Zc.toFixed(4),G:+r.raw.Gc.toFixed(4),X:+r.raw.Xc.toFixed(4),pad_length:+f3(r.raw.Y),pad_width:+f3(r.raw.X),center_x:+f3(r.raw.h)}};});
  return JSON.stringify({standard:"IPC-7351B",units:"mm",type:LIB[type].name,size:it[0],metric:it[1],source:it[9],edited:edited(),body:d,F,P,levels:lv,note:NOTE},null,2);
}
function kicad(l){
  const d=readD(),[F,P]=FP(),r=calc(d,l,F,P),nm=ipcName(LIB[type].pfx,d,l),it=curItem();
  const n=v=>(+v.toFixed(4)).toString();
  const fy=Math.max(r.cy/2,(d.W+d.Wt)/2)+0.6;
  const corr=(r.fl.X||r.fl.Y)?" Pads enlarged vs calculated (no body overhang).":"";
  const ref={R:"R**",C:"C**",L:"L**"}[type],kind={R:"Resistor",C:"Capacitor",L:"Inductor"}[type];
  return `(footprint "${nm}"
  (version 20221018)
  (generator "ipc7351b_reference")
  (layer "F.Cu")
  (descr "${kind} SMD ${it[0]} (${it[1]} Metric), IPC-7351B Level ${l}, body ${n(d.L)}x${n(d.W)} mm.${corr}")
  (tags "${it[0]} ${it[1]} IPC-7351B Level${l}")
  (attr smd)
  (fp_text reference "${ref}" (at 0 ${n(-fy)}) (layer "F.SilkS")
    (effects (font (size 1 1) (thickness 0.15))))
  (fp_text value "${nm}" (at 0 ${n(fy)}) (layer "F.Fab")
    (effects (font (size 1 1) (thickness 0.15))))
  (fp_rect (start ${n(-d.L/2)} ${n(-d.W/2)}) (end ${n(d.L/2)} ${n(d.W/2)})
    (stroke (width 0.1) (type solid)) (fill none) (layer "F.Fab"))
  (fp_rect (start ${n(-r.cx/2)} ${n(-r.cy/2)}) (end ${n(r.cx/2)} ${n(r.cy/2)})
    (stroke (width 0.05) (type solid)) (fill none) (layer "F.CrtYd"))
  (pad "1" smd rect (at ${n(-r.h)} 0) (size ${n(r.Y)} ${n(r.X)}) (layers "F.Cu" "F.Paste" "F.Mask"))
  (pad "2" smd rect (at ${n(r.h)} 0) (size ${n(r.Y)} ${n(r.X)}) (layers "F.Cu" "F.Paste" "F.Mask"))
)
`;
}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function inl(s){
  s=esc(s);const codes=[];
  s=s.replace(/`([^`]+)`/g,(m,c)=>{codes.push(c);return "\u0000"+(codes.length-1)+"\u0000";});
  s=s.replace(/\\\*/g,"&#42;").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>");
  return s.replace(/\u0000(\d+)\u0000/g,(m,i)=>"<code>"+codes[i]+"</code>");
}
function mdToHtml(md){
  const L=md.replace(/\r/g,"").split("\n");let o="",i=0;
  while(i<L.length){
    let ln=L[i];
    if(/^```/.test(ln)){let b=[];i++;while(i<L.length&&!/^```/.test(L[i]))b.push(L[i++]);i++;o+="<pre><code>"+esc(b.join("\n"))+"</code></pre>";continue;}
    let m=ln.match(/^(#{1,6})\s+(.*)$/);if(m){o+=`<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`;i++;continue;}
    if(/^\s*\|/.test(ln)){let rows=[];while(i<L.length&&/^\s*\|/.test(L[i]))rows.push(L[i++]);
      const cells=r=>r.trim().replace(/^\||\|$/g,"").split("|").map(c=>c.trim());
      o+="<table><tr>"+cells(rows[0]).map(c=>"<th>"+inl(c)+"</th>").join("")+"</tr>";
      rows.slice(2).forEach(r=>o+="<tr>"+cells(r).map(c=>"<td>"+inl(c)+"</td>").join("")+"</tr>");o+="</table>";continue;}
    if(/^\s*-\s+/.test(ln)){o+="<ul>";while(i<L.length&&/^\s*-\s+/.test(L[i]))o+="<li>"+inl(L[i++].replace(/^\s*-\s+/,""))+"</li>";o+="</ul>";continue;}
    if(/^\s*\d+\.\s+/.test(ln)){o+="<ol>";while(i<L.length&&/^\s*\d+\.\s+/.test(L[i]))o+="<li>"+inl(L[i++].replace(/^\s*\d+\.\s+/,""))+"</li>";o+="</ol>";continue;}
    if(!ln.trim()){i++;continue;}
    let p=[];while(i<L.length&&L[i].trim()&&!/^(#|```|\s*\||\s*-\s|\s*\d+\.\s)/.test(L[i]))p.push(L[i++]);
    o+="<p>"+inl(p.join(" "))+"</p>";
  }
  return o;
}
const MD=()=>(window.MD_SRC||"# Инструкция не загружена").trim()+"\n";
function setTheme(t){document.documentElement.setAttribute("data-theme",t);$("themeBtn").textContent=t==="dark"?"☀ Светлая":"☾ Тёмная";if(window.AndroidBridge&&AndroidBridge.setDark)AndroidBridge.setDark(t==="dark");}
window.androidBack=function(){const m=$("modal");if(m.classList.contains("open")){m.classList.remove("open");return true;}return false;};
setTheme("light");
$("themeBtn").onclick=()=>setTheme(document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark");
document.querySelectorAll("#typeSeg button").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("#typeSeg button").forEach(x=>x.classList.remove("on"));b.classList.add("on");type=b.dataset.t;fillSizes();loadItem();}));
$("size").addEventListener("change",loadItem);
["L","Lt","W","Wt","T","Tt","H","F","P"].forEach(k=>$(k).addEventListener("input",render));
$("reset").addEventListener("click",()=>{$("F").value="0.05";$("P").value="0.025";loadItem();});
$("cpCur").onclick=()=>copyText(mdCurrent(),"Текущий элемент скопирован (Markdown)");
$("cpSum").onclick=()=>copyText(tsvSummary(),"Сводная таблица скопирована (TSV)");
$("dlCsvType").onclick=()=>download(`IPC7351B_${LIB[type].pfx}_${stamp()}.csv`,csv([type]),"text/csv;charset=utf-8");
$("dlCsvAll").onclick=()=>download(`IPC7351B_all_${stamp()}.csv`,csv(["R","C","L"]),"text/csv;charset=utf-8");
$("dlJson").onclick=()=>download(`${ipcName(LIB[type].pfx,readD(),"B").slice(0,-1)}_${stamp()}.json`,jsonCur(),"application/json");
$("dlKicad").onclick=()=>{const l=$("kLvl").value;download(ipcName(LIB[type].pfx,readD(),l)+".kicad_mod",kicad(l),"application/octet-stream");};
const dlmd=()=>download("IPC7351B_instruction.md",MD(),"text/markdown;charset=utf-8");
$("dlMd").onclick=dlmd;$("mdDl").onclick=dlmd;
$("mdCopy").onclick=()=>copyText(MD(),"Инструкция скопирована (Markdown)");
$("helpBtn").onclick=()=>{$("mdView").innerHTML=mdToHtml(MD());$("modal").classList.add("open");};
$("mClose").onclick=()=>$("modal").classList.remove("open");
$("modal").addEventListener("click",e=>{if(e.target.id==="modal")$("modal").classList.remove("open");});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("modal").classList.remove("open");});
renderJ();fillSizes();loadItem();
if("serviceWorker" in navigator&&/^https?:/.test(location.protocol)&&!window.AndroidBridge){navigator.serviceWorker.register("sw.js").catch(()=>{});}
