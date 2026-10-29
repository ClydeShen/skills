import { readFileSync, writeFileSync } from 'node:fs';

// Reference-informed re-generation in the existing conversation, not a blind run.
const catalog = JSON.parse(readFileSync(new URL('../../../candidate/architecture-diagram/assets/catalog.json', import.meta.url)));
const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
const boxes = new Map([['1', {x:0,y:0}]]);
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base = 'fontFamily=Helvetica;fontSize=16;fontColor=#263445;';
function entry(id) {
  const item = catalog.entries.find(e=>e.id===id && e.usable && e.vendor==='AWS');
  if (!item) throw new Error(`No exact AWS catalog match: ${id}`);
  return item;
}
function node(id,parent,x,y,w,h,label,style='',metadata={}) {
  const origin=boxes.get(parent);
  boxes.set(id,{x,y,w,h});
  const attributes=Object.entries({id,label,...metadata}).map(([k,v])=>`${k}="${escape(v)}"`).join(' ');
  cells.push(`<object ${attributes}><mxCell vertex="1" parent="${parent}" style="${escape(base+style)}"><mxGeometry x="${x-origin.x}" y="${y-origin.y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
function text(id,parent,x,y,w,h,label,style='') {
  node(id,parent,x,y,w,h,label,'text;html=1;whiteSpace=wrap;fillColor=none;strokeColor=none;verticalAlign=middle;align=left;'+style);
}
function boundary(id,parent,x,y,w,h,label,iconId,style='') {
  const e=iconId?entry(iconId):null;
  node(id,parent,x,y,w,h,label,
    (e?.style||'html=1;whiteSpace=wrap;fillColor=none;strokeColor=#CBD5E1;')+
    'fontSize=16;fontColor=#263445;fontStyle=1;align=left;verticalAlign=top;spacingTop=10;spacingLeft='+(e?.style.includes('grIcon=')?38:14)+';'+style,
    {c4Type:'Deployment node',...(e?{iconKey:e.id,vendor:'AWS'}:{})});
}
function symbol(id,parent,cx,y,label,iconId,{height=104,type='Container',technology='AWS managed service',width=180}={}) {
  node(id,parent,cx-width/2,y,width,height,label,
    'html=1;whiteSpace=wrap;fillColor=none;strokeColor=none;align=center;verticalAlign=bottom;spacingBottom=2;',
    {c4Type:type,technology});
  const e=entry(iconId);
  node(id+'-icon',id,cx-36,y,72,72,'',e.style+'fontSize=16;', {iconKey:e.id,vendor:'AWS'});
}
function group(id,y,label,members) {
  const e=entry('aws4-96f425eb6ab3902b');
  node(id,'vpc',230,y,820,135,label,e.style+'fontSize=16;fontColor=#8C531F;labelWidth=210;',
    {iconKey:e.id,vendor:'AWS',groupingKind:'Auto Scaling membership',members:members.join(' ')});
}
function edge(id,source,target,exit,enter,points=[],label='',{at=0,width=200,dashed=false}={}) {
  const style=base+`edgeStyle=none;rounded=0;html=1;whiteSpace=wrap;labelWidth=${width};labelBackgroundColor=#ffffff;startArrow=none;endArrow=block;endFill=1;endSize=7;strokeWidth=1.3;strokeColor=#5D6873;dashed=${dashed?1:0};exitX=${exit[0]};exitY=${exit[1]};exitPerimeter=0;entryX=${enter[0]};entryY=${enter[1]};entryPerimeter=0;`;
  const via=points.length?`<Array as="points">${points.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`:'';
  cells.push(`<mxCell id="${id}" edge="1" parent="1" source="${source}" target="${target}" value="${escape(label)}" style="${style}"><mxGeometry x="${at}" y="0" relative="1" as="geometry">${via}</mxGeometry></mxCell>`);
}

text('title','1',40,20,1200,36,'AWS three-tier web application','fontSize=24;fontStyle=1;');
boundary('aws','1',30,205,1220,1120,'AWS Cloud','aws4-61258b1e47d472ca');
boundary('vpc','aws',60,430,1160,870,'VPC · 10.0.0.0/16','aws4-62078cb511c97067');
boundary('az-a','vpc',100,470,420,800,'Availability Zone A','aws4-29f0ed3584241a7b','align=center;spacingLeft=0;spacingTop=8;');
boundary('az-b','vpc',760,470,420,800,'Availability Zone B','aws4-29f0ed3584241a7b','align=center;spacingLeft=0;spacingTop=8;');
for(const [az,x,web,app,db] of [['a',120,'10.0.0.0/24','10.0.2.0/24','10.0.4.0/24'],['b',780,'10.0.1.0/24','10.0.3.0/24','10.0.5.0/24']]) {
  const number=az==='a'?1:2;
  boundary(`web-subnet-${az}`,`az-${az}`,x,565,380,190,`Web Subnet ${number}<br>${web}`,null,'strokeColor=none;fillColor=#EAF2E7;fontSize=14;');
  boundary(`app-subnet-${az}`,`az-${az}`,x,835,380,190,`App Subnet ${number}<br>${app}`,null,'strokeColor=none;fillColor=#EAF2E7;fontSize=14;');
  boundary(`rds-subnet-${az}`,`az-${az}`,x,1080,380,170,`RDS Subnet ${number}<br>${db}`,null,'strokeColor=none;fillColor=#E7F0F7;fontSize=14;');
}
group('web-asg',615,'Web Auto Scaling',['web-a','web-b']);
group('app-asg',885,'App Auto Scaling',['app-a','app-b']);

symbol('users','1',640,85,'Users','aws4-b0455dcf7d6ab7f3',{type:'Person',technology:'Web client'});
symbol('route53','aws',340,260,'Route 53 DNS<br>Domain → CloudFront','aws4-bd28863047f4dd8d',{height:120,technology:'Amazon Route 53'});
symbol('cloudfront','aws',640,260,'CloudFront CDN','aws4-e51c75c7037f2414',{technology:'Amazon CloudFront'});
symbol('s3','aws',1040,260,'S3 bucket','aws4-7d0e996c99148efe',{technology:'Amazon S3'});
symbol('web-elb','vpc',640,480,'Web ELB','aws4-7bc374c95b5f5aaa',{technology:'Elastic Load Balancing; type unspecified'});
symbol('app-elb','vpc',640,770,'App ELB','aws4-7bc374c95b5f5aaa',{technology:'Elastic Load Balancing; type unspecified'});
for(const [az,cx] of [['a',340],['b',940]]) {
  symbol(`web-${az}`,`web-subnet-${az}`,cx,625,'Web servers','aws4-d2efe117d40ef9f3',{technology:'Amazon EC2 instances; illustrative multiplicity'});
  symbol(`app-${az}`,`app-subnet-${az}`,cx,895,'App servers','aws4-d2efe117d40ef9f3',{technology:'Amazon EC2 instances; illustrative multiplicity'});
}
symbol('rds-primary','rds-subnet-a',340,1130,'RDS primary','aws4-6958f9ce7fdf9067',{technology:'Amazon RDS; engine unspecified'});
symbol('rds-standby','rds-subnet-b',940,1130,'RDS standby · failover only','aws4-6958f9ce7fdf9067',{technology:'Amazon RDS Multi-AZ standby; no application read traffic',width:240});

const left=[.3,36/104],right=[.7,36/104],top=[.5,0],bottom=[.5,1];
edge('dns','users','route53',left,top,[[340,121]],'DNS resolution',{dashed:true,at:-.35,width:150});
edge('entry','users','cloudfront',bottom,top);
edge('static','cloudfront','s3',right,left,[],'Static content',{width:150});
edge('dynamic','cloudfront','web-elb',bottom,top,[],'Dynamic requests',{at:.6,width:160});
edge('web-select-a','web-elb','web-a',left,top,[[340,516]]);
edge('web-select-b','web-elb','web-b',right,top,[[940,516]]);
edge('web-to-app-a','web-a','app-elb',bottom,[75/180,0],[[340,760],[625,760]]);
edge('web-to-app-b','web-b','app-elb',bottom,[105/180,0],[[940,760],[655,760]]);
edge('app-select-a','app-elb','app-a',left,top,[[340,806]]);
edge('app-select-b','app-elb','app-b',right,top,[[940,806]]);
edge('db-a','app-a','rds-primary',bottom,top);
edge('db-b','app-b','rds-primary',bottom,[110/180,0],[[940,1060],[360,1060]]);
edge('replication','rds-primary','rds-standby',right,[84/240,36/104],[],'Synchronous replication',{dashed:true,width:210});

text('scope','1',40,1342,1200,38,'Instance groups are illustrative; capacity is unspecified. Orange dashed groups show shared Auto Scaling membership.','fontSize=14;');
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="three-tier-revised" name="AWS three-tier"><mxGraphModel architectureFontSize="14" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="1280" pageHeight="1390"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(new URL('./diagram.drawio',import.meta.url),xml);
console.log('Wrote reference-informed diagram; baseline files are unchanged.');
