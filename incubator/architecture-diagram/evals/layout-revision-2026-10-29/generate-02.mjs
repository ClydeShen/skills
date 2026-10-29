import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {validateDiagram,validateRender} from '../../tools/validate.mjs';
const out=fileURLToPath(new URL('./case-02',import.meta.url));
mkdirSync(out,{recursive:true});
const catalog=JSON.parse(readFileSync(new URL('../../prototype/catalog.json',import.meta.url),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
const boxes=new Map();
const attrs=o=>Object.entries(o).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
function node(id,label,x,y,w,h,parent='1',style='',meta={}){
 const pb=boxes.get(parent)||{x:0,y:0}; boxes.set(id,{x,y,w,h});
 const value=label.replaceAll('\n','<br>');
 cells.push(`<object ${attrs({id,label:value,...meta})}><mxCell vertex="1" parent="${parent}" style="${esc(style)}"><mxGeometry x="${x-pb.x}" y="${y-pb.y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
const base='html=1;fontSize=12;fontFamily=Arial;whiteSpace=wrap;';
function text(id,label,x,y,w,h,parent='1',bold=false){node(id,label,x,y,w,h,parent,base+`text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=${bold?1:0};`);}
function boundary(id,name,x,y,w,h,parent='1',color='#6b7280',kind='Deployment node'){
 node(id,`${name}\n[${kind}]`,x,y,w,h,parent,base+`rounded=0;fillColor=none;strokeColor=${color};strokeWidth=1.5;verticalAlign=top;align=left;spacingTop=8;spacingLeft=10;fontStyle=1;`,{c4Type:kind});
}
function icon(id,name,tech,key,x,y,parent,type='Infrastructure node',width=210){
 const entry=catalog.entries.find(e=>e.id===key);if(!entry?.usable)throw Error('Unusable catalog key '+key);
 node(id,`${name}\n[${type}: ${tech}]`,x,y,72,72,parent,entry.style+`fontFamily=Arial;verticalLabelPosition=bottom;verticalAlign=top;labelPosition=center;align=center;spacingTop=8;labelWidth=${width};whiteSpace=wrap;`,{c4Type:type,technology:tech,iconKey:key,vendor:entry.vendor});
}
const noteStyle='shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;autosizeText=1;fontColor=#000000;darkOpacity=0.05;fillColor=#FFF9B2;strokeColor=none;fillStyle=solid;fontSize=20;direction=west;gradientDirection=north;gradientColor=#FFF2A1;shadow=1;size=20;pointerEvents=1;';
function note(id,label,x,y,w,h,subject,parent='1'){node(id,label,x,y,w,h,parent,noteStyle,{annotationKind:'comment',annotationFor:subject});}
function edge(id,from,to,label,color,dashed,exit,entry,points=[],host=null){
 const a=boxes.get(from),b=boxes.get(to);const route=[{x:a.x+a.w*exit[0],y:a.y+a.h*exit[1]},...points.map(([x,y])=>({x,y})),{x:b.x+b.w*entry[0],y:b.y+b.h*entry[1]}];
 const lengths=route.slice(1).map((p,i)=>Math.abs(p.x-route[i].x)+Math.abs(p.y-route[i].y));
 const total=lengths.reduce((a,b)=>a+b,0);let best=Array.isArray(host)?host[0]:host??lengths.indexOf(Math.max(...lengths));
 const ratio=Array.isArray(host)?host[1]:.5;
 const distance=lengths.slice(0,best).reduce((a,b)=>a+b,0)+lengths[best]*ratio;
 const gx=2*distance/total-1;
 cells.push(`<mxCell ${attrs({id,value:label,edge:'1',parent:'1',source:from,target:to,style:`html=1;fontSize=12;fontFamily=Arial;startArrow=none;endArrow=block;endFill=1;strokeColor=${color};fontColor=${color};strokeWidth=2;dashed=${dashed?1:0};dashPattern=7 5;labelBackgroundColor=#ffffff;exitX=${exit[0]};exitY=${exit[1]};entryX=${entry[0]};entryY=${entry[1]};exitPerimeter=0;entryPerimeter=0;rounded=0;`})}><mxGeometry relative="1" x="${gx}" y="0" as="geometry">${points.length?`<Array as="points">${points.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`:''}</mxGeometry></mxCell>`);
}
const A='#0072B2', B='#D55E00';
text('title','Dynamic diagram (deployment view): Private cross-cloud API access from Azure to AWS',40,20,3700,35,'1',true);
text('purpose','Azure integration workloads privately call internal AWS API Gateway REST APIs. Flow A resolves DNS; flow B carries the corresponding environment’s API request.',40,65,3700,35);
boundary('azure','Azure Cloud',40,150,1440,1650,'1','#0078d4');
boundary('aws','AWS Cloud',1600,150,2160,1650,'1','#965000');
boundary('region','Region: {region}',1630,220,2100,1550,'aws');
boundary('network','Network services account',1680,290,1300,1450,'region');
boundary('dns-vnet','DNS extension VNet',500,330,870,470,'azure','#0078d4');
boundary('hub','Hub VNet',700,850,720,420,'azure','#0078d4');
boundary('dev-spoke','dev spoke VNet — representative',80,350,320,430,'azure','#0078d4');
boundary('test-spoke','test spoke VNet',80,1310,360,180,'azure','#0078d4');
boundary('prod-spoke','prod spoke VNet',80,1530,360,180,'azure','#0078d4');
text('test-pattern','Integration workload: Function Apps or Logic Apps\nSame representative A/B flow',110,1380,300,80,'test-spoke');
text('prod-pattern','Integration workload: Function Apps or Logic Apps\nSame representative A/B flow',110,1600,300,80,'prod-spoke');
icon('caller','Representative integration caller','Azure Function Apps','azure2-dcd8189c36a60111',180,470,'dev-spoke','Container',230);
note('caller-alt','Logic Apps is the alternative caller. One representative flow applies to dev, test and prod.',100,660,280,95,'caller','dev-spoke');
icon('dns-in','Private Resolver inbound endpoint','Azure DNS Private Resolver','azure2-b740dc920d722f25',600,470,'dns-vnet');
icon('dns-out','Private Resolver outbound endpoint','Azure DNS Private Resolver','azure2-b740dc920d722f25',1000,470,'dns-vnet');
note('forward-rule','Forwarding ruleset associated with Private Resolver outbound endpoint:\n*.execute-api.{region}.amazonaws.com\nTarget: {Route 53 inbound endpoint IPs}:53\nResolver IPs are parameters.',920,610,430,170,'dns-out','dns-vnet');
icon('azfw','Azure Firewall','Azure Firewall','azure2-231580e7577535ab',850,900,'hub');
icon('azvpn','Azure VPN Gateway','Azure VPN Gateway','azure2-ab2268bd53147644',1210,900,'hub');
note('az-connect','All three spoke VNets (dev, test, prod) connect to the hub VNet and the separate DNS extension VNet.',750,1130,620,105,'hub','hub');
note('env-note','Environments: dev / test / prod.\nA single caller represents the environment-specific integration workload and selects its corresponding AWS workload account.',530,1380,850,220,'caller','azure');
icon('awsvpn','Site-to-Site VPN attachment','AWS Site-to-Site VPN','aws4-6ca4060964fd5dbe',1740,900,'network');
icon('tgw','Transit Gateway','AWS Transit Gateway','aws4-e7a179333303ec33',2040,900,'network');
boundary('ingress','Ingress VPC — 10.1.0.0/20',2380,350,570,360,'network');
boundary('inspection','Inspection VPC — 10.2.0.0/24',2320,810,300,390,'network');
boundary('egress','Egress VPC — 10.3.0.0/20',2680,810,280,390,'network');
icon('r53','Route 53 inbound endpoint','Amazon Route 53 Resolver','aws4-be4956b51f5601ac',2460,450,'ingress', 'Infrastructure node',210);
icon('phz','Private hosted zone','Amazon Route 53','aws4-a8bc396a73d3cad9',2780,450,'ingress','Infrastructure node',210);
text('zone-name','execute-api.{region}.amazonaws.com\nAssociated with ingress VPC',2410,620,510,60,'ingress');
icon('nfw','AWS Network Firewall — IDPS','AWS Network Firewall','aws4-25e43cde95bf1271',2440,900,'inspection','Infrastructure node',235);
icon('vpce','execute-api interface VPC endpoint','AWS VPC endpoint','aws4-152bd5c913fcfe72',2780,900,'egress','Infrastructure node',240);
note('tgw-attachments','Transit Gateway attachments: ingress VPC, inspection VPC, egress VPC.\nTransit Gateway / VPC routing details beyond the depicted forwarding path are unspecified.',1940,1350,970,160,'tgw','network');
note('private-entry','The interface VPC endpoint is the private entry to the API Gateway APIs.\nRoute 53 does DNS resolution; no Route 53 outbound endpoint is retained.',1940,1560,970,125,'vpce','network');
for(const [i,env] of ['dev','test','prod'].entries()){
 const y=350+440*i;
 boundary(`${env}-account`,`${env} workload account`,3050,y,640,370,'region');
 boundary(`${env}-system`,'Internal API',3080,y+50,580,290,`${env}-account`,'#6b7280','Software system boundary');
 icon(`${env}-api`,`${env}: private REST API\nResource policy protected`,'Amazon API Gateway','aws4-dd11693e05989a1c',3150,y+110,`${env}-system`,'Container',220);
 icon(`${env}-lambda`,`${env}: API backend`,'AWS Lambda','aws4-7590b3d50ef7fcb4',3500,y+110,`${env}-system`,'Container',200);
 edge(`B8${String.fromCharCode(97+i)}`,`${env}-api`,`${env}-lambda`,`B8${String.fromCharCode(97+i)} invoke [AWS Lambda]`,B,false,[1,.5],[0,.5]);
}
// DNS request and infrastructure forwarding legs: the transit elements route traffic.
edge('A1','caller','dns-in','A1 query [DNS 53]<br>Reply: private<br>endpoint IP',A,true,[1,.5],[0,.5],[],[0,78/348]);
edge('A2','dns-in','dns-out','A2 execute-api query [DNS 53]',A,true,[1,.5],[0,.5]);
edge('A3','dns-out','azfw','A3 DNS routing [53]',A,true,[0,.75],[.5,0],[[886,524]],[1,.55]);
edge('A4','azfw','azvpn','A4 DNS routing [53]',A,true,[1,.25],[0,.25]);
edge('A5','azvpn','awsvpn','A5 DNS routing<br>[53 / IPsec VPN]',A,true,[1,.25],[0,.25],[],[0,258/458]);
edge('A6','awsvpn','tgw','A6 DNS routing<br>[53]',A,true,[1,.25],[0,.25],[],[0,158/228]);
edge('A7','tgw','nfw','A7 DNS routing [53 / IDPS]',A,true,[1,.25],[0,.25],[],[0,.3]);
edge('A8','nfw','r53','A8 DNS routing [53]',A,true,[1,.25],[1,.5],[[2650,918],[2650,486]],[1,.4]);
// The upper route avoids crossing the incoming DNS leg.
edge('A9','r53','phz','A9 resolve [DNS]; endpoint private IP',A,true,[.5,0],[.5,0],[[2496,420],[2816,420]],1);
// HTTPS request and forwarding use independent, solid routes.
edge('B1','caller','azfw','B1 HTTPS request [443]',B,false,[1,1],[0,.75],[[460,542],[460,954]],[2,.38]);
edge('B2','azfw','azvpn','B2 HTTPS routing [443]',B,false,[1,.75],[0,.75]);
edge('B3','azvpn','awsvpn','B3 HTTPS routing<br>[443 / IPsec VPN]',B,false,[1,.75],[0,.75],[],[0,258/458]);
edge('B4','awsvpn','tgw','B4 HTTPS routing<br>[443]',B,false,[1,.75],[0,.75],[],[0,158/228]);
edge('B5','tgw','nfw','B5 HTTPS routing [443 / IDPS]',B,false,[1,.75],[0,.75],[],[0,.3]);
edge('B6','nfw','vpce','B6 routing<br>[HTTPS 443]',B,false,[1,.75],[0,.75],[],[0,54/268]);
edge('B7a','vpce','dev-api','B7a<br>HTTPS 443',B,false,[1,.25],[0,.5],[[3000,918],[3000,496]],[2,115/150]);
edge('B7b','vpce','test-api','B7b<br>HTTPS 443',B,false,[1,.5],[0,.5],[],[0,263/298]);
edge('B7c','vpce','prod-api','B7c<br>HTTPS 443',B,false,[1,.75],[0,.5],[[3020,954],[3020,1376]],[2,95/130]);
text('vpn-link','IPsec\nsite-to-site VPN',1485,1020,110,70);
node('legend','Legend\nA: blue dashed — DNS queries and DNS traffic routing, port 53.\nB: orange solid — HTTPS requests / routing, port 443, then API invocation.\nNumbers are independent per flow; a/b/c selects dev/test/prod (one environment per request).\nFilled arrow: caller → callee, or explicitly labeled infrastructure traffic routing.\nNormal responses are folded into request labels. Boundaries identify architectural domains.',40,1870,900,290,'1',base+'rounded=0;fillColor=#f4f6f8;strokeColor=#9ca3af;align=left;verticalAlign=top;spacing=15;', {annotationKind:'legend'});
note('allowances','Firewall allowances — apply to Azure Firewall AND AWS Network Firewall\nEnvironment | Source | Destination | Port\ndev | dev spoke subnet | Route 53 inbound endpoint IPs | 53\ntest | test spoke subnet | Route 53 inbound endpoint IPs | 53\nprod | prod spoke subnet | Route 53 inbound endpoint IPs | 53\ndev / test / prod | corresponding spoke subnet | *.execute-api.{region}.amazonaws.com | 443',1000,1870,1500,290,'azfw');
note('parameters','Architecture parameters and routing roles\n{region} and {Route 53 inbound endpoint IPs} are supplied parameters.\nLambda runtime is unspecified; technology: AWS Lambda.\nDNS queries pass AWS Network Firewall in this fixture.\nRoute 53 resolver endpoints do not forward HTTPS.\nAPI access remains subject to each API resource policy.',2570,1870,1150,290,'network');
const xml=`<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="revision-02" name="Private cross-cloud API access"><mxGraphModel dx="3800" dy="2300" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="3800" pageHeight="2300"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>`;
writeFileSync(`${out}/diagram.drawio`,xml+'\n');
const errors=validateDiagram(xml,catalog);console.log(JSON.stringify({staticErrors:errors},null,2));
if(process.argv.includes('--render-check'))console.log(JSON.stringify({renderErrors:validateRender(JSON.parse(readFileSync(`${out}/diagram.render.json`,'utf8')))},null,2));
