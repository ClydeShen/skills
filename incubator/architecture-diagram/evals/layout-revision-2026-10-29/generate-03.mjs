import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('./case-03',import.meta.url));
mkdirSync(dir,{recursive:true});
const catalog=JSON.parse(readFileSync(new URL('../../prototype/catalog.json',import.meta.url),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
const nodes=new Map();
const textStyle='text;html=1;whiteSpace=wrap;fontSize=12;fontColor=#172B4D;align=center;verticalAlign=middle;';
function vertex(id,label,x,y,w,h,style,attrs={},parent='1'){
 const extra=Object.entries(attrs).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
 const annotation=Object.entries(attrs).filter(([k])=>k.startsWith('annotation')).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
 cells.push(`<object id="${id}" label="${esc(label)}" ${extra}><mxCell vertex="1" parent="${parent}" ${annotation} style="${esc(style)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
 const p=nodes.get(parent)||{x:0,y:0}; nodes.set(id,{x:x+p.x,y:y+p.y,w,h});
}
function domain(id,label,x,y,w,h,parent='1',type='Deployment node'){
 vertex(id,`<b>${label}</b><br>[${type}]`,x,y,w,h,'rounded=0;html=1;whiteSpace=wrap;verticalAlign=top;align=left;spacingLeft=14;spacingTop=12;fontSize=12;fontStyle=1;fillColor=none;strokeColor=#6B778C;strokeWidth=2;',{c4Type:type},parent);
}
function icon(id,label,x,y,key,parent,type='Container',tech=''){
 const e=catalog.entries.find(e=>e.id===key); if(!e?.usable)throw Error(key);
 const style=e.style+'fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;labelPosition=center;align=center;spacingTop=8;labelWidth=230;';
 vertex(id,label+'<br>['+type+(tech?': '+tech:'')+']',x,y,72,72,style,{c4Type:type,technology:tech,iconKey:e.id,vendor:e.vendor},parent);
}
const noteStyle='shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;autosizeText=1;fontColor=#000000;darkOpacity=0.05;fillColor=#FFF9B2;strokeColor=none;fillStyle=solid;fontSize=20;direction=west;gradientDirection=north;gradientColor=#FFF2A1;shadow=1;size=20;pointerEvents=1;';
function note(id,label,x,y,w,h,target,parent='1'){vertex(id,label,x,y,w,h,noteStyle,{annotationKind:'comment',annotationFor:target},parent);}
function edge(id,source,target,label,{exit=[1,.5],entry=[0,.5],via=[],center,dashed=false}={}){
 const a=nodes.get(source),b=nodes.get(target);const points=[{x:a.x+a.w*exit[0],y:a.y+a.h*exit[1]},...via.map(([x,y])=>({x,y})),{x:b.x+b.w*entry[0],y:b.y+b.h*entry[1]}];
 let len=0,at=0; for(let i=1;i<points.length;i++){const p=points[i-1],q=points[i],seg=Math.abs(q.x-p.x)+Math.abs(q.y-p.y);if(center&&((p.x===q.x&&center[0]===p.x&&center[1]>=Math.min(p.y,q.y)&&center[1]<=Math.max(p.y,q.y))||(p.y===q.y&&center[1]===p.y&&center[0]>=Math.min(p.x,q.x)&&center[0]<=Math.max(p.x,q.x))))at=len+Math.abs(center[0]-p.x)+Math.abs(center[1]-p.y);len+=seg;}
 const rel=center?2*at/len-1:0;
 const style=`edgeStyle=none;noEdgeStyle=1;rounded=0;html=1;whiteSpace=nowrap;startArrow=none;endArrow=block;endFill=1;strokeColor=#172B4D;strokeWidth=1.5;fontSize=12;fontColor=#172B4D;labelBackgroundColor=#ffffff;align=center;verticalAlign=middle;dashed=${dashed?1:0};exitX=${exit[0]};exitY=${exit[1]};exitPerimeter=0;entryX=${entry[0]};entryY=${entry[1]};entryPerimeter=0;`;
 cells.push(`<mxCell id="${id}" value="${esc(label)}" edge="1" parent="1" source="${source}" target="${target}" style="${style}"><mxGeometry x="${rel}" y="0" relative="1" as="geometry">${via.length?'<Array as="points">'+via.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')+'</Array>':''}</mxGeometry></mxCell>`);
}
vertex('title','Dynamic diagram (deployment view): Partner amendment requests through SOAP to AWS validation',60,35,3650,35,textStyle+'align=left;fontStyle=1;');
vertex('purpose','Authenticate partner amendment requests, authorize the required user-profile role, validate in AWS and return XML through the originating SOAP API.',60,82,3650,40,textStyle+'align=left;');
domain('azure','Azure Cloud',500,180,2200,1560);
domain('aws','AWS Cloud',3000,180,720,1560);
domain('apim','Azure API Management (APIM)',80,280,650,1060,'azure');
domain('inbound','Inbound processing',820,260,1280,1160,'azure','Software system boundary');
domain('subflows','Sub-workflows',460,330,790,690,'inbound','Software system boundary');
domain('core','Core platform',420,550,270,650,'aws','Software system boundary');
vertex('existing','Existing partner integrators<br>[External software system]',60,640,250,100,'rounded=0;whiteSpace=wrap;html=1;fontSize=12;fillColor=#F4F5F7;strokeColor=#6B778C;',{c4Type:'External software system'});
vertex('new','New partner integrators<br>[External software system]',60,1100,250,100,'rounded=0;whiteSpace=wrap;html=1;fontSize=12;fillColor=#F4F5F7;strokeColor=#6B778C;',{c4Type:'External software system'});
vertex('legacy','Legacy SOAP API<br>[Container: SOAP API]',70,180,200,100,'rounded=0;html=1;whiteSpace=wrap;fontSize=12;fillColor=#EDF4FC;strokeColor=#0072B2;',{c4Type:'Container',technology:'SOAP API'},'apim');
vertex('partner','Partner SOAP API<br>[Container: SOAP API]',70,640,200,100,'rounded=0;html=1;whiteSpace=wrap;fontSize=12;fillColor=#EDF4FC;strokeColor=#0072B2;',{c4Type:'Container',technology:'SOAP API'},'apim');
icon('apimpolicy','APIM policy processing',470,420,'azure2-e2d660283e2b908d','apim','Container','Azure API Management');
icon('b2c','Azure AD B2C',850,110,'azure2-a75af2983736ff61','azure','Container','Identity provider');
icon('cosmos','Roles / permissions',1810,110,'azure2-9acb1e5f89e89ae6','azure','Container','Azure Cosmos DB');
icon('router','API-Route-Processor',150,440,'azure2-3fe3953b2562c37a','inbound','Container','Logic Apps workflow');
icon('auth','Common-Authx-Handler',460,210,'azure2-3fe3953b2562c37a','inbound','Container','Logic Apps workflow');
icon('orders','Amend-Order-Processor',570,110,'azure2-3fe3953b2562c37a','subflows','Container','Logic Apps workflow');
icon('documents','Amend-Document-Processor',570,450,'azure2-3fe3953b2562c37a','subflows','Container','Logic Apps workflow');
icon('vpn','Site-to-site VPN',2810,880,'aws4-6ca4060964fd5dbe','1','Container','Azure ↔ AWS connection');
icon('gateway','API Gateway',190,700,'aws4-dd11693e05989a1c','aws','Container','AWS API Gateway');
icon('validation','Validation engine',90,150,'aws4-c03eacaa5d134e9b','core','Container','AWS Lambda function');
note('apimcontrols','<b>APIM request controls</b><br>After authentication:<br>check system-account roles;<br>require a user profile for both amendment methods.',620,810,330,190,'apimpolicy');
note('identityinput','Basic or bearer authentication input.<br>APIM authenticates against Azure AD B2C.<br>Identity exchange implementation is unspecified.',1570,250,480,150,'b2c');
note('conversion','<b>Both sub-workflows</b><br>Validate XML, method and malformed base64.<br>Wrap decoded XML in JSON.<br>JSON response → Liquid template → XML.<br>Return XML through the originating SOAP API.',1840,1080,430,160,'orders');
note('errors','<b>Failure handling</b><br>Hide internal errors, e.g. AWS-call timeout.<br>Return only a generic error response through the originating SOAP entry:<br>Legacy → existing integrators;<br>Partner → new integrators.',620,1560,570,160,'apimpolicy');
note('awsunknown','AWS amend operation and response schema are unspecified.<br>Validation engine applies business-rule validation.',3050,1510,600,150,'validation');
edge('entrya','existing','legacy','1a SOAP over HTTPS<br>XML response',{center:[400,690]});
edge('entryb','new','partner','1b SOAP over HTTPS<br>XML response',{center:[400,1150]});
edge('policya','legacy','apimpolicy','2a Enter APIM policy<br>[XML]<br>XML response',{entry:[0,.25],via:[[950,690],[950,898]],center:[950,790]});
edge('policyb','partner','apimpolicy','2b Enter APIM policy<br>[XML]<br>XML response',{entry:[0,.75],via:[[960,1150],[960,934]],center:[960,1080]});
edge('authenticate','apimpolicy','b2c','3 Authenticate<br>[Identity]<br>Result',{exit:[1,.125],entry:[0,.5],via:[[1270,889],[1270,326]],center:[1270,435],dashed:true});
edge('forward','apimpolicy','router','4 Authenticated<br>request after controls<br>[XML]; XML response',{center:[1390,916]});
edge('authorize','router','auth','5 Delegate authorization<br>[Workflow call]; role decision',{exit:[.5,0],via:[[1506,686]],center:[1640,686]});
edge('roles','auth','cosmos','6 Query system account name<br>+ user profile name<br>Required user-profile role result<br>[Cosmos DB]',{via:[[2110,686],[2110,326]],center:[2110,540],dashed:true});
edge('routeorders','router','orders','7a amend_order<br>Requires ManageOrders<br>[Workflow call]; XML response',{center:[2080,916]});
edge('routedocuments','router','documents','7b amend_document<br>Requires ManageDocuments<br>[Workflow call]; XML response',{exit:[1,.75],via:[[1660,934],[1660,1256]],center:[2080,1256]});
edge('awsorders','orders','vpn','8a AWS amend API<br>[HTTPS/JSON]<br>JSON response',{exit:[1,.25],entry:[0,.25],center:[2495,898]});
edge('awsdocuments','documents','vpn','8b AWS amend API<br>[HTTPS/JSON]<br>JSON response',{entry:[0,.75],via:[[2720,1256],[2720,934]],center:[2495,1256]});
edge('vpnorders','vpn','gateway','9a Traffic routing<br>[HTTPS/JSON]<br>JSON response',{exit:[1,.125],entry:[0,.125],center:[3085,889]});
edge('vpndocuments','vpn','gateway','9b Traffic routing<br>[HTTPS/JSON]<br>JSON response',{exit:[1,.875],entry:[0,.875],center:[3085,943]});
edge('invoke','gateway','validation','10 Invoke<br>[Lambda invocation]',{center:[3335,916]});
vertex('legend','Legend and method authorization',60,1810,3660,260,'rounded=0;html=1;whiteSpace=wrap;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;fillColor=#F4F5F7;strokeColor=#6B778C;fontSize=12;fontStyle=1;',{annotationKind:'legend'});
vertex('legendtext','Solid single arrow: request / forwarding; normal response is folded into its label.<br>Dashed single arrow: auxiliary authentication or role query.<br>Numbered steps; a / b preserve the caller or method branches.<br>Service icons: official Azure2 / AWS4 catalog entries. Boundaries show deployment or software-system domains.',30,45,1150,170,textStyle+'align=left;','', 'legend');
vertex('table','<b>Method authorization</b><br><br><b>Method　　　　　　　　　Required user-profile role　　　　User profile</b><br>amend_order　　　　　　 ManageOrders　　　　　　　　 Mandatory<br>amend_document　　　　 ManageDocuments　　　　　　 Mandatory<br><br>APIM system-account role checks and Common-Authx-Handler user-profile role checks are distinct controls.',1250,40,2270,180,textStyle+'align=left;',{},'legend');
writeFileSync(`${dir}/diagram.drawio`,`<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="revision-03" name="Partner amendments"><mxGraphModel dx="3800" dy="2160" page="1" pageScale="1" pageWidth="3800" pageHeight="2160"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`);
