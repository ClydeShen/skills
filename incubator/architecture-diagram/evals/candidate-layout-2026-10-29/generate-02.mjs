import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {validateDiagram,validateRender} from '../../tools/validate.mjs';
const out=fileURLToPath(new URL('./case-02',import.meta.url));
mkdirSync(out,{recursive:true});
const catalog=JSON.parse(readFileSync(new URL('../../candidate/architecture-diagram/assets/catalog.json',import.meta.url),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
const boxes=new Map();
const attrs=o=>Object.entries(o).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
function node(id,label,x,y,w,h,parent='1',style='',meta={}){
 const pb=boxes.get(parent)||{x:0,y:0}; boxes.set(id,{x,y,w,h});
 const value=label.replaceAll('\n','<br>');
 cells.push(`<object ${attrs({id,label:value,...meta})}><mxCell vertex="1" parent="${parent}" style="${esc(style)}"><mxGeometry x="${x-pb.x}" y="${y-pb.y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
const base='html=1;fontSize=16;fontFamily=Arial;whiteSpace=wrap;';
function text(id,label,x,y,w,h,parent='1',bold=false){node(id,label,x,y,w,h,parent,base+`text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=${bold?1:0};`);}
function boundary(id,name,x,y,w,h,parent='1',color='#6b7280',kind='Deployment node'){
 node(id,`${name}\n[${kind}]`,x,y,w,h,parent,base+`rounded=0;fillColor=none;strokeColor=${color};strokeWidth=1.5;verticalAlign=top;align=left;spacingTop=8;spacingLeft=10;fontStyle=1;`,{c4Type:kind});
}
function icon(id,name,tech,key,x,y,parent,type='Infrastructure node',width=210){
 const entry=catalog.entries.find(e=>e.id===key);if(!entry?.usable)throw Error('Unusable catalog key '+key);
 node(id,`${name}\n[${type}: ${tech}]`,x,y,72,72,parent,entry.style+`fontSize=16;fontFamily=Arial;verticalLabelPosition=bottom;verticalAlign=top;labelPosition=center;align=center;spacingTop=8;labelWidth=${width};whiteSpace=wrap;`,{c4Type:type,technology:tech,iconKey:key,vendor:entry.vendor});
}
function edge(id,from,to,label,color,dashed,exit,entry,points=[],host=null){
 const a=boxes.get(from),b=boxes.get(to);const route=[{x:a.x+a.w*exit[0],y:a.y+a.h*exit[1]},...points.map(([x,y])=>({x,y})),{x:b.x+b.w*entry[0],y:b.y+b.h*entry[1]}];
 const lengths=route.slice(1).map((p,i)=>Math.abs(p.x-route[i].x)+Math.abs(p.y-route[i].y));
 const total=lengths.reduce((a,b)=>a+b,0);let best=Array.isArray(host)?host[0]:host??lengths.indexOf(Math.max(...lengths));
 const ratio=Array.isArray(host)?host[1]:.5;
 const distance=lengths.slice(0,best).reduce((a,b)=>a+b,0)+lengths[best]*ratio;
 const gx=2*distance/total-1;
 cells.push(`<mxCell ${attrs({id,value:label,edge:'1',parent:'1',source:from,target:to,style:`html=1;fontSize=16;fontFamily=Arial;startArrow=none;endArrow=block;endFill=1;strokeColor=${color};fontColor=${color};strokeWidth=2;dashed=${dashed?1:0};dashPattern=7 5;labelBackgroundColor=#ffffff;exitX=${exit[0]};exitY=${exit[1]};entryX=${entry[0]};entryY=${entry[1]};exitPerimeter=0;entryPerimeter=0;rounded=0;`})}><mxGeometry relative="1" x="${gx}" y="0" as="geometry">${points.length?`<Array as="points">${points.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`:''}</mxGeometry></mxCell>`);
}
// Matrices encode repeated relations; cells are editable and are not services.
function matrix(id,title,headers,rows,x,y,widths,rowHeight,parent='1') {
 const w=widths.reduce((a,b)=>a+b,0), h=40+rowHeight*(rows.length+1);
 node(id,title,x,y,w,h,parent,base+'rounded=0;fillColor=#ffffff;strokeColor=#9ca3af;align=left;verticalAlign=top;spacingTop=8;spacingLeft=10;fontStyle=1;', {annotationKind:'matrix'});
 for(const [r,row] of [headers,...rows].entries()) {
  let dx=x;
  row.forEach((value,c)=>{
   node(id+'-'+r+'-'+c,value,dx,y+40+r*rowHeight,widths[c],rowHeight,id,base+'rounded=0;fillColor='+(r===0?'#eef2f6':'#ffffff')+';strokeColor=#cbd5e1;align=center;verticalAlign=middle;'+(r===0?'fontStyle=1;':''));
   dx+=widths[c];
  });
 }
}
const A='#0072B2', B='#D55E00';
text('title','Dynamic diagram (deployment view): Private cross-cloud API access from Azure to AWS',40,20,3700,35,'1',true);
text('purpose','Azure integration workloads privately call internal AWS API Gateway REST APIs. Flow A resolves DNS; flow B carries the corresponding environment’s API request.',40,65,3700,35);
boundary('azure','Azure Cloud',40,150,1440,1500,'1','#0078d4');
boundary('aws','AWS Cloud',1600,150,2160,1500,'1','#965000');
boundary('region','Region: {region}',1630,220,2100,1400,'aws');
boundary('network','Network services account',1680,290,1300,1240,'region');
boundary('dns-vnet','DNS extension VNet',500,330,870,470,'azure','#0078d4');
boundary('hub','Hub VNet',700,850,720,420,'azure','#0078d4');
boundary('dev-spoke','dev spoke VNet',80,350,320,370,'azure','#0078d4');
boundary('test-spoke','test spoke VNet',80,790,320,370,'azure','#0078d4');
boundary('prod-spoke','prod spoke VNet',80,1230,320,370,'azure','#0078d4');
icon('caller','Representative integration caller\nLogic Apps alternative','Azure Function Apps','azure2-dcd8189c36a60111',180,470,'dev-spoke','Container',230);
icon('test-caller','Representative integration caller\nLogic Apps alternative','Azure Function Apps','azure2-dcd8189c36a60111',180,900,'test-spoke','Container',230);
icon('prod-caller','Representative integration caller\nLogic Apps alternative','Azure Function Apps','azure2-dcd8189c36a60111',180,1350,'prod-spoke','Container',230);
icon('dns-in','Private Resolver inbound endpoint','Azure DNS Private Resolver','azure2-b740dc920d722f25',700,470,'dns-vnet');
icon('dns-out','Private Resolver outbound endpoint','Azure DNS Private Resolver','azure2-b740dc920d722f25',1000,470,'dns-vnet');
icon('azfw','Azure Firewall','Azure Firewall','azure2-231580e7577535ab',850,900,'hub');
icon('azvpn','Azure VPN Gateway','Azure VPN Gateway','azure2-ab2268bd53147644',1210,900,'hub');
icon('awsvpn','Site-to-Site VPN attachment','AWS Site-to-Site VPN','aws4-6ca4060964fd5dbe',1740,900,'network');
icon('tgw','Transit Gateway\nVPC routing details: unspecified','AWS Transit Gateway','aws4-e7a179333303ec33',2040,900,'network');
boundary('ingress','Ingress VPC — 10.1.0.0/20',2380,350,570,360,'network');
boundary('inspection','Inspection VPC — 10.2.0.0/24',2320,810,300,390,'network');
boundary('egress','Egress VPC — 10.3.0.0/20',2680,810,280,390,'network');
icon('r53','Route 53 inbound endpoint\nDNS only','Amazon Route 53 Resolver','aws4-be4956b51f5601ac',2460,450,'ingress', 'Infrastructure node',210);
icon('phz','Private hosted zone\nexecute-api.{region}.amazonaws.com\nAssociated with ingress VPC','Amazon Route 53','aws4-a8bc396a73d3cad9',2780,450,'ingress','Infrastructure node',210);
icon('nfw','AWS Network Firewall — IDPS','AWS Network Firewall','aws4-25e43cde95bf1271',2440,900,'inspection','Infrastructure node',235);
icon('vpce','execute-api interface VPC endpoint\nPrivate API entry','AWS VPC endpoint','aws4-152bd5c913fcfe72',2780,900,'egress','Infrastructure node',240);
for(const [i,env] of ['dev','test','prod'].entries()){
 const y=350+440*i;
 boundary(`${env}-account`,`${env} workload account`,3050,y,640,370,'region');
 boundary(`${env}-system`,'Internal API',3080,y+50,580,290,`${env}-account`,'#6b7280','Software system boundary');
 icon(`${env}-api`,`${env}: private REST API\nResource policy protected`,'Amazon API Gateway','aws4-dd11693e05989a1c',3240,y+110,`${env}-system`,'Container',220);
 icon(`${env}-lambda`,`${env}: API backend\nRuntime: unspecified`,'AWS Lambda','aws4-7590b3d50ef7fcb4',3500,y+110,`${env}-system`,'Container',200);
 edge(`B8${String.fromCharCode(97+i)}`,`${env}-api`,`${env}-lambda`,`B8${String.fromCharCode(97+i)} invoke<br>[AWS Lambda]`,B,false,[1,.5],[0,.5]);
}
// DNS request and infrastructure forwarding legs: the transit elements route traffic.
edge('A1','caller','dns-in','A1a query [DNS 53]<br>Private endpoint<br>IP reply',A,true,[1,.25],[0,.25],[],[0,368/448]);
edge('A1b','test-caller','dns-in','A1b query [DNS 53]<br>Private IP reply',A,true,[1,.25],[0,.5],[[420,918],[420,506]],[1,168/412]);
edge('A1c','prod-caller','dns-in','A1c query [DNS 53]<br>Private IP reply',A,true,[1,.25],[0,.75],[[440,1368],[440,524]],[1,178/844]);
edge('A2','dns-in','dns-out','A2 execute-api query [DNS 53]',A,true,[1,.5],[0,.5]);
edge('A3','dns-out','azfw','A3 outbound ruleset [DNS 53]<br>*.execute-api.{region}.amazonaws.com<br>→ {Route 53 inbound endpoint IPs}:53',A,true,[0,.75],[.5,0],[[886,524]],[1,.55]);
edge('A4','azfw','azvpn','A4 DNS routing [53]',A,true,[1,.25],[0,.25]);
edge('A5','azvpn','awsvpn','A5 DNS routing<br>[53 / IPsec VPN]',A,true,[1,.25],[0,.25],[],[0,68/458]);
edge('A6','awsvpn','tgw','A6 DNS routing [53]',A,true,[1,.25],[0,.25],[],[0,.5]);
edge('A7','tgw','nfw','A7 DNS routing [53 / IDPS]',A,true,[1,.25],[0,.25],[],[0,.3]);
edge('A8','nfw','r53','A8 DNS routing [53]',A,true,[1,.25],[1,.5],[[2650,918],[2650,486]],[1,.4]);
// The upper route avoids crossing the incoming DNS leg.
edge('A9','r53','phz','A9 resolve [DNS]; endpoint private IP',A,true,[.5,0],[.5,0],[[2496,420],[2816,420]],1);
// HTTPS request and forwarding use independent, solid routes.
edge('B1','caller','azfw','B1a HTTPS [443]',B,false,[1,1],[0,.25],[[460,542],[460,918]],[2,.3]);
edge('B1b','test-caller','azfw','B1b HTTPS [443]',B,false,[1,.5],[0,.5],[],[0,320/598]);
edge('B1c','prod-caller','azfw','B1c HTTPS [443]',B,false,[1,.5],[0,.75],[[470,1386],[470,954]],[2,.3]);
edge('B2','azfw','azvpn','B2 HTTPS routing [443]',B,false,[1,.75],[0,.75]);
edge('B3','azvpn','awsvpn','B3 HTTPS [443]<br>IPsec VPN',B,false,[1,.75],[0,.75],[],[0,258/458]);
edge('B4','awsvpn','tgw','B4 HTTPS routing<br>[443]',B,false,[1,.75],[0,.75],[],[0,158/228]);
edge('B5','tgw','nfw','B5 HTTPS routing<br>[443 / IDPS]',B,false,[1,.75],[0,.75],[],[0,.3]);
edge('B6','nfw','vpce','B6 routing<br>[HTTPS 443]',B,false,[1,.75],[0,.75],[],[0,54/268]);
edge('B7a','vpce','dev-api','B7a<br>dev only<br>HTTPS 443',B,false,[1,.25],[0,.5],[[3000,918],[3000,496]],[2,155/240]);
edge('B7b','vpce','test-api','B7b<br>test only<br>HTTPS 443',B,false,[1,.5],[0,.5],[],[0,303/388]);
edge('B7c','vpce','prod-api','B7c<br>prod only<br>HTTPS 443',B,false,[1,.75],[0,.5],[[3020,954],[3020,1376]],[2,135/220]);
text('vpn-link','IPsec\nsite-to-site VPN',1485,1020,110,70);
node('legend','Legend\nA: blue dashed — DNS queries and DNS traffic routing, port 53.\nB: orange solid — HTTPS requests / routing, port 443, then API invocation.\nNumbers are independent per flow; a/b/c selects dev/test/prod (one environment per request).\nFilled arrow: caller → callee, or explicitly labeled infrastructure traffic routing.\nCrossings are not junctions; distinct routes do not share segments.\nNormal responses are folded into request labels. Boundaries identify architectural domains.\n✓ = connected / allowed in the labeled matrix; unlisted rules are unspecified.',40,1710,900,200,'1',base+'rounded=0;fillColor=#f4f6f8;strokeColor=#9ca3af;align=left;verticalAlign=top;spacing=15;', {annotationKind:'legend'});
matrix('tgw-bindings','Transit Gateway — VPC attachments',
 ['VPC','CIDR'],[['Ingress','10.1.0.0/20'],['Inspection','10.2.0.0/24'],['Egress','10.3.0.0/20']],
 1940,1270,[480,490],40,'network');
matrix('firewall-allowances','Firewall allowances: Azure Firewall + AWS Network Firewall',
 ['Source','DNS 53 → Route 53 inbound endpoint IPs','HTTPS 443 → *.execute-api.{region}.amazonaws.com'],
 [['dev spoke subnet','✓','✓'],['test spoke subnet','✓','✓'],['prod spoke subnet','✓','✓']],
 1000,1710,[500,900,1320],35);
const xml=`<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="candidate-02" name="Private cross-cloud API access"><mxGraphModel architectureFontSize="16" dx="3800" dy="1940" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="3800" pageHeight="1940"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>`;
writeFileSync(`${out}/diagram.drawio`,xml+'\n');
const errors=validateDiagram(xml,catalog);console.log(JSON.stringify({staticErrors:errors},null,2));
if(process.argv.includes('--render-check'))console.log(JSON.stringify({renderErrors:validateRender(JSON.parse(readFileSync(`${out}/diagram.render.json`,'utf8')))},null,2));
