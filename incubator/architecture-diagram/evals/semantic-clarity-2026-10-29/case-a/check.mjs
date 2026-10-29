import { readFileSync, writeFileSync } from 'node:fs';
import { validateDiagram, validateRender } from '../../../tools/validate.mjs';
const here = new URL('./', import.meta.url);
const read = name => readFileSync(new URL(name, here), 'utf8');
const report = JSON.parse(read('diagram.render.json'));
const catalog = JSON.parse(readFileSync(new URL('../../../candidate/architecture-diagram/assets/catalog.json', here)));
const staticErrors = validateDiagram(read('diagram.drawio'), catalog);
const renderErrors = validateRender(report);
const texts = report.metrics.filter(n => n.text);
const textOverlaps = texts.flatMap((a,i) => texts.slice(i+1).filter(b =>
  Math.min(a.text.x+a.text.w,b.text.x+b.text.w)>Math.max(a.text.x,b.text.x) &&
  Math.min(a.text.y+a.text.h,b.text.y+b.text.h)>Math.max(a.text.y,b.text.y)
).map(b => [a.id,b.id]));
const generation = JSON.parse(read('generation.json'));
generation.checks = { staticErrors, renderErrors, textOverlaps, browserRender: report.renderer, drawioVersion:report.drawio_version, desktopVerified:false, visualInspection:'Author inspected the final PNG at overview and readable detail.', sourceFidelity:'Author traced all eight source flow steps, six subnet CIDRs, two AZs, representative compute fleets and separate scaling groups. No independent review claimed.' };
writeFileSync(new URL('generation.json',here),JSON.stringify(generation,null,2)+'\n');
console.log(JSON.stringify(generation.checks,null,2));
process.exitCode = staticErrors.length || renderErrors.length || textOverlaps.length ? 1 : 0;
