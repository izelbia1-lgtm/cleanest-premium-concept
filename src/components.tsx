import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function Brand(){return <a className="brand" href="#home" aria-label="Cleanest home"><img src="/images/cleanest-logo.png" width="237" height="150" alt="Cleanest — windows, carpets and gardens"/><span>CLEANING &<br/>GARDEN CARE</span></a>;}
export function QuoteLink({children='Request a Quote',onClick,className=''}:{children?:ReactNode;onClick?:()=>void;className?:string}){return <a href="#contact" className={`cta ${className}`} onClick={onClick}>{children}<ArrowUpRight size={18}/></a>;}
export function Heading({label,title,children}:{label:string;title:string;children?:ReactNode}){return <div className="section-heading"><div><p className="eyebrow">{label}</p><h2>{title}</h2></div>{children&&<p className="heading-note">{children}</p>}</div>;}
const dimensions:Record<string,[number,number]>={'newgarden1.webp':[1280,960],'newgarden2.webp':[960,1280],'newcarpet1.webp':[960,1280],'winc1.webp':[800,800],'carpetteam.webp':[1600,1065],'newuph1.webp':[1280,960]};
export function Photo({file,alt,className='',priority=false}:{file:string;alt:string;className?:string;priority?:boolean}){const size=dimensions[file];return <img className={className} src={`/images/${file}`} alt={alt} width={size?.[0]} height={size?.[1]} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async"/>;}
