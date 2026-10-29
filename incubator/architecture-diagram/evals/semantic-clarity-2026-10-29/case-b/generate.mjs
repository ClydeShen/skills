import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = new URL('.', import.meta.url);
const pkg = new URL('../../../candidate/architecture-diagram/', base);
const catalog = JSON.parse(readFileSync(new URL('assets/catalog.json', pkg)));
const cells = [], bounds = new Map();
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function node(id,label,x,y,w,h,parent='1',type='Container',style='',meta='') {
 const p = bounds.get(parent) || {x:0,y:0}; bounds.set(id,{x:p.x+x,y:p.y+y,w,h});
 cells.push(`<object id="${id}" label="${esc(label)}" c4Type="${type}" technology="AWS" ${meta}><mxCell vertex="1" parent="${parent}" style="${esc(style)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
const box='rounded=0;html=1;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#aab2bb;fontColor=#243446;fontSize=16;';
function region(id,label,x,y,w,h,parent='1',logical=false) { node(id,label,x,y,w,h,parent,logical?'Software system boundary':'Deployment node',`${box}fillColor=${logical?'none':'#f7f9fc'};align=left;verticalAlign=top;spacingLeft=14;spacingTop=12;fontStyle=1;dashed=${logical?1:0};`); }
function icon(id,label,key,x,y,parent) { const e=catalog.entries.find(e=>e.id===key); if(!e?.usable)throw Error(key); node(id,label,x,y,72,72,parent,'Container',e.style+'fontSize=16;labelWidth=160;spacingTop=8;',`vendor="AWS" iconKey="${key}"`); }
function text(id,label,x,y,w,h,size=16){ cells.push(`<mxCell id="${id}" value="${esc(label)}" vertex="1" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=${size};fontColor=#243446;"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`); }
function edge(id,s,t,label,sp,tp,pts=[],dashed=false,rel=0){cells.push(`<mxCell id="${id}" value="${esc(label)}" edge="1" parent="1" source="${s}" target="${t}" style="edgeStyle=none;html=1;rounded=0;startArrow=none;endArrow=block;endFill=1;strokeColor=#53677e;strokeWidth=1.5;fontSize=16;labelBackgroundColor=#ffffff;exitX=${sp[0]};exitY=${sp[1]};entryX=${tp[0]};entryY=${tp[1]};exitPerimeter=0;entryPerimeter=0;dashed=${dashed?1:0};"><mxGeometry relative="1" x="${rel}" y="0" as="geometry">${pts.length?`<Array as="points">${pts.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`:''}</mxGeometry></mxCell>`);}
text('title','AWS three-tier web application',30,20,1000,42,28);
text('scope','High-level view · Two EC2 instances illustrated per compute tier · Unresolved paths and implementation details: assumptions.md',30,65,1640,30);
region('region','AWS Region',230,125,1190,880);
region('deployment','Application deployment',30,55,1090,615,'region',true);
region('az1','AZ-1',160,55,650,515,'deployment');
region('az2','AZ-2',850,365,220,205,'deployment');
region('web','Web tier · Auto Scaling Group',40,55,280,165,'az1',true);
region('app','Application tier',40,285,280,180,'az1',true);
icon('web1','Web 1','aws4-dcf10dde6f3a8c0e',35,50,'web');
icon('web2','Web 2','aws4-dcf10dde6f3a8c0e',170,50,'web');
icon('app1','App 1','aws4-dcf10dde6f3a8c0e',35,55,'app');
icon('app2','App 2','aws4-dcf10dde6f3a8c0e',170,55,'app');
icon('elb','ELB','aws4-7bc374c95b5f5aaa',40,145,'deployment');
icon('cache','ElastiCache','aws4-5903a64a34810675',500,285,'az1');
icon('primary','RDS primary','aws4-6958f9ce7fdf9067',500,405,'az1');
icon('standby','RDS standby','aws4-6958f9ce7fdf9067',100,95,'az2');
icon('s3','S3 bucket','aws4-7d0e996c99148efe',920,145,'deployment');
icon('dns','Route 53','aws4-bd28863047f4dd8d',75,325,'1');
node('access','Application requests<br>www.yourApp.com',25,210,180,70,'1','External software system',box);
icon('cdn','CloudFront','aws4-e51c75c7037f2414',1510,325,'1');
node('media','media.yourApp.com',1450,150,195,55,'1','External software system',box);
icon('ddb','DynamoDB table','aws4-35d1821eb6a19e22',180,735,'region');
icon('ses','SES<br>Email delivery','aws4-2573a358c515958e',445,735,'region');
icon('sns','SNS<br>Email notifications','aws4-9758db46c424c589',710,735,'region');
icon('alarm','CloudWatch Alarms','aws4-8d2e34c3511b5f4a',975,735,'region');
edge('dns-elb','dns','elb','DNS',[1,.5],[0,.5],[],true,-.45);
edge('requests','access','elb','',[1,.5],[.5,0],[[336,245]]);
edge('lookup','access','dns','Resolve',[86/180,1],[.5,0],[],true);
edge('elb-web','elb','web','',[1,.5],[.01,.43],[[390,361],[390,360.95]]);
edge('web-s3','web','s3','Object storage',[.99,.20],[0,.5],[[800,323],[800,361]]);
edge('app-cache','app','cache','Cache access',[.99,.20],[0,.5]);
edge('app-rds','app','primary','Database access',[.99,.99],[0,58.2/72]);
edge('replication','primary','standby','Replication',[1,.5],[0,.5],[],true,.54);
edge('origin','cdn','s3','Get origin',[0,.5],[1,.5],[],false,.60);
edge('delivery','cdn','media','Static delivery',[.5,0],[96/195,1]);
for(const [id,target,x,label,dash] of [['data','ddb',446,'Read / write',false],['email','ses',711,'Email',false],['notify','sns',976,'Publish',false],['monitor','alarm',1241,'Monitoring',true]]) {
 edge(id,'deployment',target,label,[(x-260)/1090,.99],[.5,0],[],dash);
}
edge('data-results','ddb','deployment','Results',[1,.5],[(520-260)/1090,.99],[[520,896]],false,-.15);
const xml=`<mxfile version="32.6.1"><diagram name="AWS three-tier application"><mxGraphModel pageWidth="1700" pageHeight="1040" architectureFontSize="16"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(new URL('diagram.drawio',base),xml);
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
writeFileSync(new URL('generation.json',base),JSON.stringify({date:'2026-10-29',mode:'independent text-only regeneration',source:'../../three-tier-supporting-2026-10-29/source.md',source_sha256:hash(new URL('../../three-tier-supporting-2026-10-29/source.md',base)),skill_sha256:hash(new URL('SKILL.md',pkg)),reference_image_used:false,previous_outputs_read:false,external_model_calls:false,drawio_version:'32.6.1',scope:'Supported high-level deployment and service relationships; unresolved paths preserved in assumptions.md',workflow_exception:'Disjoint delegated output directory; parent owns branch, git setup, aggregate checks and integration.'},null,2)+'\n');
