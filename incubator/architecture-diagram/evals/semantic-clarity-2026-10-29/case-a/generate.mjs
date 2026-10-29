import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const out = new URL('./', import.meta.url);
const pkg = new URL('../../../candidate/architecture-diagram/', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('assets/catalog.json', pkg)));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cells = ['<mxCell id="0"/><mxCell id="1" parent="0"/>'];
function node(id,label,x,y,w,h,parent='1',style='',meta={}) {
  cells.push(`<object id="${id}" label="${esc(label)}" ${Object.entries(meta).map(([k,v])=>`${k}="${esc(v)}"`).join(' ')}><mxCell vertex="1" parent="${parent}" style="${esc('fontSize=16;fontFamily=Helvetica;'+style)} "><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
const text = (id,label,x,y,w,h,size=16) => node(id,label,x,y,w,h,'1',`text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;fontSize=${size};`,{});
function region(id,label,x,y,w,h,parent,fill) { node(id,label,x,y,w,h,parent,`rounded=0;html=1;verticalAlign=top;align=left;spacingTop=10;spacingLeft=12;fillColor=${fill};strokeColor=#A7B1BC;`,{c4Type:'Deployment node'}); }
function icon(id,label,key,x,y,parent='1',back=false) {
 const entry=catalog.entries.find(e=>e.id===key);
 node(id,label,x,y,72,72,parent,entry.style+'fontSize=16;labelWidth=180;spacingTop=8;', {vendor:'AWS',iconKey:key,...(back?{}:{c4Type:'Container',technology:entry.title})});
}
const keys={ec2:'aws4-dcf10dde6f3a8c0e',elb:'aws4-7bc374c95b5f5aaa',rds:'aws4-6958f9ce7fdf9067',dns:'aws4-bd28863047f4dd8d',cdn:'aws4-e51c75c7037f2414'};
function edge(id,source,target,label,exit,entry,points=[],dashed=false,pos=0) {
 cells.push(`<mxCell id="${id}" value="${esc(label)}" edge="1" parent="1" source="${source}" target="${target}" style="edgeStyle=none;html=1;rounded=0;startArrow=none;endArrow=block;endFill=1;strokeColor=#4B5968;strokeWidth=1.6;fontSize=16;labelBackgroundColor=#ffffff;${dashed?'dashed=1;':''}exitX=${exit[0]};exitY=${exit[1]};entryX=${entry[0]};entryY=${entry[1]};"><mxGeometry x="${pos}" y="0" relative="1" as="geometry">${points.length?'<Array as="points">'+points.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')+'</Array>':''}</mxGeometry></mxCell>`);
}
text('title','AWS three-tier web application',50,20,1100,40,26);
text('scope','Deployment overview · fleet symbols are representative · implementation details remain unspecified',50,62,1180,30);
region('vpc','VPC · 10.0.0.0/16',380,290,900,1000,'1','#FAFBFC');
region('aza','Availability Zone A',40,60,310,890,'vpc','#F4F7FA');
region('azb','Availability Zone B',550,60,310,890,'vpc','#F4F7FA');
for (const [az,base] of [['a',0],['b',1]]) {
 region('websub'+az,`Web Subnet ${base+1}<br>10.0.${base}.0/24`,20,70,270,180,'az'+az,'#EEF5FC');
 region('appsub'+az,`App Subnet ${base+1}<br>10.0.${base+2}.0/24`,20,390,270,180,'az'+az,'#EEF5FC');
 region('dbsub'+az,`RDS Subnet ${base+1}<br>10.0.${base+4}.0/24`,20,710,270,170,'az'+az,'#F3F0F7');
 icon('webback'+az,'',keys.ec2,104,62,'websub'+az,true);
 icon('web'+az,'Web servers',keys.ec2,90,76,'websub'+az);
 icon('appback'+az,'',keys.ec2,104,62,'appsub'+az,true);
 icon('app'+az,'Application servers',keys.ec2,90,76,'appsub'+az);
 icon('db'+az,az==='a'?'RDS primary':'RDS standby',keys.rds,90,52,'dbsub'+az);
}
// Dashed overlays indicate logical capacity management, not deployment domains.
text('web-asg','Shared Web Auto Scaling group',440,385,300,30);
text('app-asg','Shared App Auto Scaling group',680,945,280,30);
for (const [tier,y,join] of [['web',480,470],['app',800,940]]) {
 for (const [az,x] of [['a',500],['b',1010]]) {
  node(`${tier}-members-${az}`,'',x,y,120,140,'1','rounded=0;fillColor=none;strokeColor=#D99A3E;dashed=1;', {groupingKind:'Auto Scaling membership',groupId:tier+'-asg',members:tier+az});
 }
 // Management association joins member markers outside the ELB symbol area.
 node(tier+'-membership-link','',560,join,510,1,'1','shape=line;strokeColor=#D99A3E;dashed=1;');
}
icon('webelb','Shared Web ELB',keys.elb,414,206,'vpc');
icon('appelb','Shared App ELB',keys.elb,414,526,'vpc');
node('users','Users',90,150,100,62,'1','rounded=0;fillColor=#ffffff;strokeColor=#A7B1BC;',{c4Type:'Person'});
icon('dns','Route 53',keys.dns,400,130);
icon('cdn','CloudFront',keys.cdn,794,150);
icon('s3','S3 bucket<br>Static content origin','aws4-7d0e996c99148efe',1134,150);
edge('dns-query','users','dns','DNS → CloudFront',[1,16/62],[0,0.5],[],true);
edge('entry','users','cdn','Application requests',[1,0.75],[0,0.5],[[260,196.5],[260,260],[740,260],[740,186]],false,0.2);
edge('static','cdn','s3','Static retrieval',[1,0.5],[0,0.5]);
edge('dynamic','cdn','webelb','Dynamic requests',[1,0.75],[0.5,0],[[970,204],[970,270],[830,270]],false,0.85);
edge('web-a','webelb','weba','',[0,0.5],[1,0.5]);
edge('web-b','webelb','webb','',[1,0.5],[0,0.5]);
edge('web-app-a','weba','appelb','',[1,0.8],[0.25,0],[[720,553.6],[720,770],[812,770]]);
edge('web-app-b','webb','appelb','',[0,0.8],[0.75,0],[[940,553.6],[940,770],[848,770]]);
edge('app-a','appelb','appa','',[0,0.5],[1,0.5]);
edge('app-b','appelb','appb','',[1,0.5],[0,0.5]);
edge('db-from-a','appa','dba','',[0,0.5],[0,0.5],[[430,852],[430,1148]]);
edge('db-from-b','appb','dba','',[1,0.5],[0.5,0],[[1210,852],[1210,1000],[566,1000]]);
edge('replication','dba','dbb','Synchronous replication',[1,0.5],[0,0.5],[],true);
writeFileSync(new URL('diagram.drawio',out),`<mxfile version="32.6.1"><diagram name="AWS three-tier application"><mxGraphModel page="1" pageWidth="1330" pageHeight="1340" architectureFontSize="16"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`);
const hash = url=>createHash('sha256').update(readFileSync(url)).digest('hex');
writeFileSync(new URL('generation.json',out),JSON.stringify({date:'2026-10-29',mode:'independent text-only regeneration',source:'../../three-tier-2026-10-29/source.md',source_sha256:hash(new URL('../../three-tier-2026-10-29/source.md',out)),skill_sha256:hash(new URL('SKILL.md',pkg)),reference_image:false,external_model_calls:false,scope:'Only case-a artifacts; parent integrates.',workflow_exception:'No branch switch or git setup: delegated shared workspace, parent owns Git integration. npm run git:check failed with spawnSync git EPERM.',checks:'Pending render and inspection'},null,2)+'\n');
