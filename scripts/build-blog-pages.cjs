// Regeneruje statyczny blog i artykuły z danych wspólnego skryptu. Nie dotyka poczty ani konfiguracji prywatnej.
function buildBlogPages(){
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
  const root=path.resolve(__dirname,'../deployment/jdm-public');
  if(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('data-runtime="static-v1"'))throw Error('Migracja statyczna została już wykonana. Nie regeneruj stron starym rendererem; zobacz docs/STATIC-RUNTIME-20261016.md.');
  const bin=path.join(process.env.LOCALAPPDATA,'OpenAI/Codex/bin');
  const executables=fs.readdirSync(bin).map(d=>path.join(bin,d,'codex.exe')).filter(p=>fs.existsSync(p)).sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs);
  if(!executables.length)throw Error('Brak lokalnego apply_patch');
  function apply(patch){const r=spawnSync(executables[0],['--codex-run-as-apply-patch',patch],{encoding:'utf8',cwd:path.resolve(__dirname,'..')});if(r.status!==0)throw Error(String(r.stderr)+String(r.stdout));}
  function write(file,text){const relative=path.relative(path.resolve(__dirname,'..'),file).replaceAll('\\','/');if(fs.existsSync(file)&&fs.readFileSync(file,'utf8')===text)return;const lines=text.replace(/></g,'>\n<').split('\n');if(fs.existsSync(file))apply('*** Begin Patch\n*** Delete File: '+relative+'\n*** End Patch');apply('*** Begin Patch\n*** Add File: '+relative+'\n+<!-- BLOG-BUILD-END -->\n*** End Patch');let group=[],size=0;function flush(){if(!group.length)return;apply('*** Begin Patch\n*** Update File: '+relative+'\n@@\n-<!-- BLOG-BUILD-END -->\n'+group.map(l=>'+'+l).join('\n')+'\n+<!-- BLOG-BUILD-END -->\n*** End Patch');group=[];size=0;}for(const line of lines){if(size+line.length>6000)flush();group.push(line);size+=line.length;}flush();apply('*** Begin Patch\n*** Update File: '+relative+'\n@@\n-<!-- BLOG-BUILD-END -->\n*** End Patch');}
  const source=fs.readFileSync(path.join(root,'studio-enhancements-20261004-price-contact.js'),'utf8');
  const begin=source.indexOf('  const articles=');const end=source.indexOf('function renderBlog()',begin);
  if(begin<0||end<0)throw Error('Nie znaleziono danych bloga');
  const sandbox={};vm.runInNewContext(source.slice(begin,end)+'\nglobalThis.catalog={articles,articlePaths,articleImages,articleDates,blogEscape,blogListMarkup,blogArticleMarkup,blogArticleSchema};',sandbox);
  const c=sandbox.catalog;if(c.articles.length!==16||c.articlePaths.length!==16)throw Error('Oczekiwano 16 artykułów');
  const baseFiles=['index.html','co-kupujemy.html','cennik.html','wycena.html','wykres.html','faq.html','blog.html','kontakt.html','regulamin.html'];
  const version='20261016-article-pages';
  function versioned(html){return html.replace(/(studio-pages-20261004\.js|studio-enhancements-20261004-price-contact\.js|studio-enhancements-20261004-price-contact\.css)\?v=[^"\s]+/g,'$1?v='+version);}
  const template=versioned(fs.readFileSync(path.join(root,'blog.html'),'utf8'));
  const sectionPattern=/<section\b[^>]*id="blog"[^>]*>[\s\S]*?<\/section>/;
  if(!sectionPattern.test(template))throw Error('Brak sekcji bloga w szablonie');
  const updatedList=template.replace(sectionPattern,'<section id="blog" class="section wrap blog-page">'+c.blogListMarkup()+'</section>');
  write(path.join(root,'blog.html'),updatedList);
  for(const f of baseFiles.filter(f=>f!=='blog.html'))write(path.join(root,f),versioned(fs.readFileSync(path.join(root,f),'utf8')));
  for(let i=0;i<c.articles.length;i++){
    const url='https://www.skupsrebragorzow.pl'+c.articlePaths[i];const title=c.articles[i][0]+' — Skup srebra Gorzów';const desc=c.articles[i][1].slice(0,155).replace(/\s+\S*$/,'')+'…';
    let html=template.replace(sectionPattern,'<section id="blog" class="section wrap blog-page">'+c.blogArticleMarkup(i)+'</section>');
    html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+c.blogEscape(title)+'</title>').replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="'+url+'">').replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+c.blogEscape(desc)+'">');
    html=html.replace(/<link rel="preload" as="image"[^>]*>/,'<link rel="preload" as="image" href="assets/'+c.articleImages[i]+'" fetchpriority="high">');
    const schema=JSON.stringify(c.blogArticleSchema(i)).replaceAll('<','\\u003c');
    html=html.replace('</head>','<meta property="og:type" content="article"><meta property="og:title" content="'+c.blogEscape(title)+'"><meta property="og:description" content="'+c.blogEscape(desc)+'"><meta property="og:url" content="'+url+'"><meta property="og:image" content="https://www.skupsrebragorzow.pl/assets/'+c.articleImages[i]+'"><script type="application/ld+json" data-blog-schema>'+schema+'</script></head>');
    write(path.join(root,c.articlePaths[i].slice(1)),html);console.log(c.articlePaths[i]);
  }
  const sitemap=path.join(root,'sitemap.xml');const existing=[...fs.readFileSync(sitemap,'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);const urls=[...new Set([...existing,...c.articlePaths.map(p=>'https://www.skupsrebragorzow.pl'+p)])];
  write(sitemap,'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+u+'</loc></url>').join('\n')+'\n</urlset>\n');console.log('Sitemap: '+urls.length+' adresów');
}
if(require.main===module)buildBlogPages();
module.exports=buildBlogPages;

