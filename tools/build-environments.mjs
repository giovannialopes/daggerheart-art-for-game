import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const write = (p, v) => fs.writeFileSync(path.join(root, p), JSON.stringify(v, null, 2) + '\n');
const catalog = read('generation/environments/catalog.json');
const partial = process.argv.includes('--preview');
if (catalog.length !== 47) throw new Error('Unexpected environment count');
const ready = catalog.filter(e => fs.existsSync(path.join(root, 'environments', e.filename)));
const missing = catalog.filter(e => !ready.includes(e)).map(e => e.name);
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cards = ready.map(e => `<article data-search="${escape((e.name+' '+e.localizedName).toLocaleLowerCase('pt-BR'))}"><a href="environments/${encodeURIComponent(e.filename)}"><img loading="lazy" src="environments/${encodeURIComponent(e.filename)}" alt="${escape(e.localizedName)}"></a><h2>${escape(e.localizedName)}</h2><p>${escape(e.name)} · Tier ${e.tier}</p></article>`).join('\n');
fs.writeFileSync(path.join(root, 'galeria-ambientes.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Art for Game — Ambientes</title><style>body{margin:36px auto;padding:0 24px;max-width:1500px;background:#202322;color:#eee;font:16px system-ui}h1{font-size:32px}input{box-sizing:border-box;width:100%;padding:14px;margin:10px 0 26px;font:inherit}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:28px}article{min-width:0}article[hidden]{display:none}img{width:100%;aspect-ratio:16/9;object-fit:contain;background:#151716}h2{font-size:19px;margin:10px 0 3px}p{color:#bac4be;margin-top:4px}a{color:inherit}</style><h1>Ambientes de Daggerheart</h1><p>${ready.length}/${catalog.length} paisagens · clique para abrir a imagem completa.</p><label for="search">Buscar pelo nome em português ou inglês</label><input id="search" type="search" placeholder="Ex.: Reino Lunar, taverna, deserto"><main>${cards}</main><script>const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();document.querySelector('#search').addEventListener('input',e=>{const q=normalize(e.target.value);document.querySelectorAll('article').forEach(card=>card.hidden=!normalize(card.dataset.search).includes(q));});</script></html>`);
if (partial) { console.log(`Preview: ${ready.length}/47`); process.exit(0); }
if (missing.length) throw new Error('Missing landscapes: '+missing.join(', '));
const entries = Object.fromEntries(catalog.map(e => [e.id, {
  actor: `modules/daggerheart-art-complete/environments/${e.filename}`,
  environmentArt: { name: e.name, localizedName: e.localizedName }
}]));
write('mappings/environments.json', { 'daggerheart.environments': entries });
const combined = read('mappings/adversaries.json');
combined['daggerheart.environments'] = entries;
write('mappings/adversaries.json', combined);
write('environments-coverage.json', { systemVersion: '2.10.7', expected: 47, mapped: ready.length, complete: true, missing: [], environments: catalog.map(({id,name,localizedName,filename})=>({id,name,localizedName,filename})) });
const manifest = read('module.json');
manifest.version = '1.3.0';
manifest.description = 'Retratos e tokens para 264 adversários e paisagens para os 47 ambientes do Daggerheart. Inclui as artes do Art for Daggerheart e ilustrações adicionais.';
write('module.json', manifest);
console.log('Integrated 47 environment portraits; no token mappings added.');
