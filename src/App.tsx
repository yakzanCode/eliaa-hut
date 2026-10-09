import {createContext,useContext,useEffect,useState} from 'react'
import {BrowserRouter,Routes,Route,NavLink,Link,useLocation} from 'react-router-dom'
import {Menu as Burger,X,Phone,MapPin,Leaf} from 'lucide-react'
import tr from './data/translations.json'
import brand from './data/brand.json'
import menu from './data/menu.json'
import hours from './data/hours.json'
import gallery from './data/gallery.json'

type L='ar'|'en'
const Ctx=createContext<{l:L,setL:(l:L)=>void,t:(k:string)=>string}>(null as any)
const useL=()=>useContext(Ctx)
const jd=(p:number)=>`${p.toFixed(2)} JD`
const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(brand.mapsQuery)

function Img({src,alt,cls=''}:{src?:string,alt:string,cls?:string}){
  return src?<img className={'img '+cls} src={src} alt={alt} loading="lazy"/>:<div className={'img ph '+cls} role="img" aria-label={alt}><Leaf/></div>
}
function Head({title}:{title:string}){return <h2 className="head">{title}<i/></h2>}
function Hours(){const{l}=useL();return <table className="hours"><tbody>{hours.map(d=><tr key={d.en}><td>{d[l]}</td><td dir="ltr">{d.h}</td></tr>)}</tbody></table>}
function Actions(){const{t}=useL();return <div className="row"><a className="btn" href={maps} target="_blank" rel="noreferrer"><MapPin size={16}/>{t('dir')}</a><a className="btn ghost" href={'tel:'+brand.tel}><Phone size={16}/>{t('call')}</a></div>}

function Navbar(){
  const{l,setL,t}=useL();const[o,setO]=useState(false);const loc=useLocation()
  useEffect(()=>setO(false),[loc.pathname])
  const links:[string,string][]=[['/','home'],['/menu','menu'],['/about','about'],['/gallery','gallery'],['/contact','contact']]
  return <header className="nav"><div className="wrap bar">
    <Link to="/" className="logo">{brand.name.ar}<small>{brand.name.en}</small></Link>
    <nav className={o?'open':''} aria-label="Main">{links.map(([p,k])=><NavLink key={p} to={p} end>{t(k)}</NavLink>)}
      <Link className="btn sm" to="/menu">{t('explore')}</Link></nav>
    <button className="lang" onClick={()=>setL(l==='ar'?'en':'ar')}>{l==='ar'?'EN':'ع'}</button>
    <button className="burger" aria-label="Menu" onClick={()=>setO(!o)}>{o?<X/>:<Burger/>}</button></div></header>
}
function Footer(){const{t,l}=useL();return <footer className="foot"><div className="wrap cols">
  <div><b className="logo">{brand.name[l]}</b><p>{t('footer')}</p>{brand.instagram&&<a href={brand.instagram}>Instagram</a>}</div>
  <div><h4>{t('contact')}</h4><p>{brand.address[l]}</p><a href={'tel:'+brand.tel} dir="ltr">{brand.phone}</a></div>
  <div><h4>{t('hours')}</h4><Hours/></div></div>
  <p className="wrap copy">© {new Date().getFullYear()} {brand.name[l]} · {t('rights')} · {t('note')}</p></footer>}

function Item({i}:{i:typeof menu.items[0]}){const{l}=useL();const o=l==='ar'?'en':'ar'
  return <li className="item"><Img src={i.image} alt={i[l]} cls="thumb"/><div><b>{i[l]}</b><span>{i[o]}</span></div><em dir="ltr">{jd(i.price)}</em></li>}

function Home(){const{t,l}=useL()
  const feat=brand.featured.map(id=>menu.items.find(i=>i.id===id)!).filter(Boolean)
  return <>
  <section className="hero"><div className="wrap split"><div className="rise"><p className="tag"><Leaf size={14}/>{t('label')}</p><h1>{t('hero')}</h1><p>{t('sub')}</p>
    <div className="row"><Link className="btn" to="/menu">{t('explore')}</Link><Link className="btn ghost" to="/contact">{t('find')}</Link></div></div>
    <Img src={brand.heroImage} alt={brand.name[l]} cls="heroimg"/></div></section>
  <section className="wrap sec"><Head title={t('featured')}/><ul className="feat">{feat.map(i=><Item key={i.id} i={i}/>)}</ul>
    <Link className="btn" to="/menu">{t('all')}</Link></section>
  <section className="olive"><div className="wrap sec"><h2>{t('introT')}</h2><p>{t('introB')}</p></div></section>
  <section className="wrap sec"><Head title={t('cats')}/><div className="cats">{menu.categories.map(c=><Link key={c.id} to={'/menu#'+c.id} className="cat"><Img alt={c[l]}/><span>{c[l]}</span></Link>)}</div></section>
  <section className="wrap sec"><Head title={t('atmos')}/><div className="gal">{gallery.slice(0,3).map(g=><Img key={g.en} src={g.src} alt={g[l]}/>)}</div><Link className="btn ghost" to="/gallery">{t('gallery')}</Link></section>
  <section className="olive"><div className="wrap sec"><h2>{t('visit')}</h2><p>{brand.address[l]}</p><Actions/></div></section></>}

function Menu(){const{l}=useL();const[c,setC]=useState('all');const{hash}=useLocation()
  useEffect(()=>{const h=hash.slice(1);if(menu.categories.some(x=>x.id===h))setC(h)},[hash])
  return <div className="wrap sec"><nav className="tabs" aria-label="Categories">{[{id:'all',ar:'الكل',en:'All'},...menu.categories].map(x=>
    <button key={x.id} className={c===x.id?'on':''} onClick={()=>setC(x.id)}>{x[l]}</button>)}</nav>
    {menu.categories.filter(x=>c==='all'||x.id===c).map(x=><section key={x.id} id={x.id} className="rise"><Head title={x[l]}/>
      <ul className="list">{menu.items.filter(i=>i.category===x.id).map(i=><Item key={i.id} i={i}/>)}</ul></section>)}</div>}

function About(){const{t}=useL();return <div className="wrap sec narrow"><h1 className="big">{t('aboutT')}</h1><p>{t('aboutB')}</p>
  <Img alt="" cls="wide"/><h2>{t('aboutA')}</h2><p>{t('aboutAB')}</p><h2>{t('aboutM')}</h2><p>{t('aboutMB')}</p></div>}

function Gallery(){const{t,l}=useL();const[n,setN]=useState<number|null>(null);const k=gallery.length
  useEffect(()=>{const f=(e:KeyboardEvent)=>{if(n===null)return;if(e.key==='Escape')setN(null);if(e.key==='ArrowRight')setN((n+1)%k);if(e.key==='ArrowLeft')setN((n+k-1)%k)};addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[n])
  return <div className="wrap sec"><h1 className="big">{t('galT')}</h1><p>{t('galN')}</p>
    <div className="gal">{gallery.map((g,i)=><button key={g.en} onClick={()=>setN(i)} aria-label={g[l]}><Img src={g.src} alt={g[l]}/><span>{g[l]}</span></button>)}</div>
    {n!==null&&<div className="lb" role="dialog" onClick={()=>setN(null)}><button aria-label={t('close')}><X/></button><Img src={gallery[n].src} alt={gallery[n][l]} cls="lbimg"/><p>{gallery[n][l]}</p></div>}</div>}

function Contact(){const{t,l}=useL();return <div className="wrap sec narrow"><h1 className="big">{t('contact')}</h1>
  <h3>{t('addr')}</h3><p>{brand.address[l]}</p><h3>{t('phone')}</h3><p dir="ltr"><a href={'tel:'+brand.tel}>{brand.phone}</a></p>
  <h3>{t('hours')}</h3><Hours/><p className="note">{t('note')}</p><Actions/></div>}
function NotFound(){const{t}=useL();return <div className="wrap sec narrow"><h1 className="big">404</h1><p>{t('nf')}</p><Link className="btn" to="/">{t('back')}</Link></div>}

export default function App(){
  const[l,setL]=useState<L>((localStorage.getItem('lang') as L)||'ar')
  useEffect(()=>{document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';localStorage.setItem('lang',l)
    document.title=brand.name[l==='ar'?'ar':'en']+' | '+(l==='ar'?'Eliaa Hut':'كوخ إيلياء')},[l])
  const t=(k:string)=>(tr[l] as Record<string,string>)[k]||k
  return <Ctx.Provider value={{l,setL,t}}><BrowserRouter><Navbar/><main><Routes>
    <Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/about" element={<About/>}/>
    <Route path="/gallery" element={<Gallery/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer/></BrowserRouter></Ctx.Provider>}
