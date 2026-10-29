import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('./case-03',import.meta.url));
mkdirSync(dir,{recursive:true});
const catalog=JSON.parse(readFileSync(new URL('../../candidate/architecture-diagram/assets/catalog.json',import.meta.url),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
const nodes=new Map();
const textStyle='text;html=1;whiteSpace=wrap;fontSize=16;fontColor=#172B4D;align=center;verticalAlign=middle;';
function vertex(id,label,x,y,w,h,style,attrs={},parent='1'){
 const extra=Object.entries(attrs).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
 const annotation=Object.entries(attrs).filter(([k])=>k.startsWith('annotation')).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
 cells.push(`<object id="${id}" label="${esc(label)}" ${extra}><mxCell vertex="1" parent="${parent}" ${annotation} style="${esc(style)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
 const p=nodes.get(parent)||{x:0,y:0}; nodes.set(id,{x:x+p.x,y:y+p.y,w,h});
}
function domain(id,label,x,y,w,h,parent='1',type='Deployment node'){
 vertex(id,`<b>${label}</b><br>[${type}]`,x,y,w,h,'rounded=0;html=1;whiteSpace=wrap;verticalAlign=top;align=left;spacingLeft=14;spacingTop=12;fontSize=16;fontStyle=1;fillColor=none;strokeColor=#6B778C;strokeWidth=2;',{c4Type:type},parent);
}
function icon(id,label,x,y,key,parent,type='Container',tech=''){
 const e=catalog.entries.find(e=>e.id===key); if(!e?.usable)throw Error(key);
 const style=e.style+'fontSize=16;verticalLabelPosition=bottom;verticalAlign=top;labelPosition=center;align=center;spacingTop=8;labelWidth=230;';
 vertex(id,label+'<br>['+type+(tech?': '+tech:'')+']',x,y,72,72,style,{c4Type:type,technology:tech,iconKey:e.id,vendor:e.vendor},parent);
}
function edge(id,source,target,label,{exit=[1,.5],entry=[0,.5],via=[],center,dashed=false,bold=false}={}){
 const a=nodes.get(source),b=nodes.get(target);const points=[{x:a.x+a.w*exit[0],y:a.y+a.h*exit[1]},...via.map(([x,y])=>({x,y})),{x:b.x+b.w*entry[0],y:b.y+b.h*entry[1]}];
 let len=0,at=0; for(let i=1;i<points.length;i++){const p=points[i-1],q=points[i],seg=Math.abs(q.x-p.x)+Math.abs(q.y-p.y);if(center&&((p.x===q.x&&center[0]===p.x&&center[1]>=Math.min(p.y,q.y)&&center[1]<=Math.max(p.y,q.y))||(p.y===q.y&&center[1]===p.y&&center[0]>=Math.min(p.x,q.x)&&center[0]<=Math.max(p.x,q.x))))at=len+Math.abs(center[0]-p.x)+Math.abs(center[1]-p.y);len+=seg;}
 const rel=center?2*at/len-1:0;
 const style=`edgeStyle=none;noEdgeStyle=1;rounded=0;html=1;whiteSpace=nowrap;startArrow=none;endArrow=block;endFill=1;strokeColor=#172B4D;strokeWidth=1.5;fontSize=16;fontStyle=${bold?1:0};fontColor=#172B4D;labelBackgroundColor=#ffffff;align=center;verticalAlign=middle;dashed=${dashed?1:0};exitX=${exit[0]};exitY=${exit[1]};exitPerimeter=0;entryX=${entry[0]};entryY=${entry[1]};entryPerimeter=0;`;
 cells.push(`<mxCell id="${id}" value="${esc(label)}" edge="1" parent="1" source="${source}" target="${target}" style="${style}"><mxGeometry x="${rel}" y="0" relative="1" as="geometry">${via.length?'<Array as="points">'+via.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')+'</Array>':''}</mxGeometry></mxCell>`);
}
vertex('title','Dynamic diagram (deployment view): Partner amendment requests through SOAP to AWS validation',60,35,3650,35,textStyle+'align=left;fontStyle=1;');
vertex('purpose','Authenticate partner amendment requests, authorize the required user-profile role, validate in AWS and return XML through the originating SOAP API.',60,82,3650,40,textStyle+'align=left;');
domain('azure','Azure Cloud',500,180,2200,1360);
domain('aws','AWS Cloud',3000,720,720,600);
domain('apim','Azure API Management (APIM)',80,280,650,900,'azure');
domain('inbound','Inbound processing',820,260,1280,1040,'azure','Software system boundary');
domain('subflows','Sub-workflows',460,330,790,690,'inbound','Software system boundary');
domain('core','Core platform',420,60,270,400,'aws','Software system boundary');
vertex('existing','Existing partner integrators<br>[External software system]',60,640,250,100,'rounded=0;whiteSpace=wrap;html=1;fontSize=16;fillColor=#F4F5F7;strokeColor=#6B778C;',{c4Type:'External software system'});
vertex('new','New partner integrators<br>[External software system]',60,1100,250,100,'rounded=0;whiteSpace=wrap;html=1;fontSize=16;fillColor=#F4F5F7;strokeColor=#6B778C;',{c4Type:'External software system'});
vertex('legacy','Legacy SOAP API<br>[Container: SOAP API]',70,180,200,100,'rounded=0;html=1;whiteSpace=wrap;fontSize=16;fillColor=#EDF4FC;strokeColor=#0072B2;',{c4Type:'Container',technology:'SOAP API'},'apim');
vertex('partner','Partner SOAP API<br>[Container: SOAP API]',70,640,200,100,'rounded=0;html=1;whiteSpace=wrap;fontSize=16;fillColor=#EDF4FC;strokeColor=#0072B2;',{c4Type:'Container',technology:'SOAP API'},'apim');
icon('apimpolicy','APIM policy processing<br>Check system-account roles<br>Require user profile',470,420,'azure2-e2d660283e2b908d','apim','Container','Azure API Management');
icon('b2c','Azure AD B2C<br>Identity exchange: unspecified',930,110,'azure2-a75af2983736ff61','azure','Container','Identity provider');
icon('cosmos','Roles / permissions',1810,110,'azure2-9acb1e5f89e89ae6','azure','Container','Azure Cosmos DB');
icon('router','API-Route-Processor',200,440,'azure2-3fe3953b2562c37a','inbound','Container','Logic Apps workflow');
icon('auth','Common-Authx-Handler',460,170,'azure2-3fe3953b2562c37a','inbound','Container','Logic Apps workflow');
icon('orders','Amend-Order-Processor<br>Validate XML · method · base64<br>Wrap decoded XML in JSON<br>JSON → Liquid template → XML',570,110,'azure2-3fe3953b2562c37a','subflows','Container','Logic Apps workflow');
icon('documents','Amend-Document-Processor<br>Validate XML · method · base64<br>Wrap decoded XML in JSON<br>JSON → Liquid template → XML',570,450,'azure2-3fe3953b2562c37a','subflows','Container','Logic Apps workflow');
icon('vpn','Site-to-site VPN',2810,880,'aws4-6ca4060964fd5dbe','1','Container','Azure ↔ AWS connection');
icon('gateway','API Gateway<br>Operation / response schema:<br>unspecified',190,160,'aws4-dd11693e05989a1c','aws','Container','AWS API Gateway');
icon('validation','Validation engine<br>Business-rule validation',90,100,'aws4-c03eacaa5d134e9b','core','Container','AWS Lambda function');
edge('entrya','existing','legacy','1a SOAP / HTTPS<br>Basic | Bearer<br>XML response',{exit:[1,.25],entry:[0,.25],center:[400,665]});
edge('entryb','new','partner','1b SOAP / HTTPS<br>Basic | Bearer<br>XML response',{exit:[1,.25],entry:[0,.25],center:[400,1125]});
edge('policya','legacy','apimpolicy','2a Enter APIM policy<br>[XML]<br>XML response',{entry:[0,.25],via:[[950,690],[950,898]],center:[950,790]});
edge('policyb','partner','apimpolicy','2b Enter APIM policy<br>[XML]<br>XML response',{entry:[0,.75],via:[[930,1150],[930,934]],center:[930,1080]});
edge('authenticate','apimpolicy','b2c','3 Authenticate<br>[Identity]<br>Result',{exit:[1,.125],entry:[0,.5],via:[[1270,889],[1270,326]],center:[1350,326],dashed:true});
edge('forward','apimpolicy','router','4 After authentication<br>+ APIM controls<br>[XML]; XML response',{center:[1420,916]});
edge('authorize','router','auth','5 Delegate authorization<br>[Workflow call]; role decision',{exit:[.5,0],via:[[1556,646]],center:[1668,646]});
edge('roles','auth','cosmos','6 Query system account name<br>+ user profile name<br>Required user-profile role result<br>[Cosmos DB]',{via:[[2110,646],[2110,326]],center:[2110,540],dashed:true});
edge('routeorders','router','orders','7a amend_order<br>Requires ManageOrders<br>User profile mandatory<br>[Workflow call]; XML response',{center:[2080,916]});
edge('routedocuments','router','documents','7b amend_document<br>Requires ManageDocuments<br>User profile mandatory<br>[Workflow call]; XML response',{exit:[1,.75],via:[[1720,934],[1720,1256]],center:[2080,1256]});
edge('awsorders','orders','vpn','8a AWS amend API<br>[HTTPS/JSON]<br>JSON response',{exit:[1,.25],entry:[0,.25],center:[2495,898]});
edge('awsdocuments','documents','vpn','8b AWS amend API<br>[HTTPS/JSON]<br>JSON response',{entry:[0,.75],via:[[2705,1256],[2705,934]],center:[2495,1256]});
edge('vpnorders','vpn','gateway','9a Route [HTTPS/JSON]<br>JSON response',{exit:[1,.125],entry:[0,.125],center:[3095,889]});
edge('vpndocuments','vpn','gateway','9b Route [HTTPS/JSON]<br>JSON response',{exit:[1,.875],entry:[0,.875],center:[3095,943]});
edge('invoke','gateway','validation','10 Invoke<br>[Lambda invocation]',{center:[3335,916]});
edge('failurea','legacy','existing','On internal error<br>or timeout<br>Generic error only',{exit:[0,.9],entry:[1,.9],center:[400,730],bold:true});
edge('failureb','partner','new','On internal error<br>or timeout<br>Generic error only',{exit:[0,.9],entry:[1,.9],center:[400,1190],bold:true});
vertex('legend','Legend',60,1590,3660,100,'rounded=0;html=1;whiteSpace=wrap;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;fillColor=#F4F5F7;strokeColor=#6B778C;fontSize=16;fontStyle=1;',{annotationKind:'legend'});
vertex('legendtext','Solid → request / forwarding · Dashed → auxiliary authentication or role query · Bold return → generic failure (internal details hidden)<br>Normal responses are folded into request labels · a/b retain caller / method branches · Boundaries identify deployment and software-system domains',30,30,3550,60,textStyle+'align=left;','', 'legend');
writeFileSync(`${dir}/diagram.drawio`,`<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="candidate-03" name="Partner amendments"><mxGraphModel architectureFontSize="16" dx="3800" dy="1740" page="1" pageScale="1" pageWidth="3800" pageHeight="1740"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`);
