'use client'
import { useState, use } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/shop/CartSidebar'
import WhatsappFloat from '@/components/ui/WhatsappFloat'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import { useCartStore } from '@/store/cart'
import { demoProducts, demoCategories } from '@/lib/demo-data'
import { ShoppingBag, ChevronRight, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { lang, addItem, toggleCart } = useCartStore()
  const product = demoProducts.find(p => p.slug === slug)
  const [qty, setQty] = useState(1)
  const [flavor, setFlavor] = useState<string|undefined>(product?.flavors?.[0])
  const [size, setSize] = useState<string|undefined>(product?.sizes?.[0])
  const [activeImg, setActiveImg] = useState(0)

  if (!product) return (
    <div style={{textAlign:'center',padding:'80px 20px',color:'var(--gray4)'}}>
      <div style={{fontSize:'60px',marginBottom:'16px'}}>🔍</div>
      <h2 style={{color:'#fff',marginBottom:'8px'}}>المنتج غير موجود</h2>
      <Link href="/" style={{color:'var(--orange)'}}>العودة للمتجر</Link>
    </div>
  )

  const images = product.product_images ?? []
  const mainImg = images[activeImg]?.url ?? images[0]?.url
  const category = demoCategories.find(c => c.id === product.category_id)
  const inStock = product.is_available && product.quantity > 0
  const disc = product.compare_price && product.compare_price > product.price ? Math.round((1 - product.price / product.compare_price) * 100) : 0

  function handleAdd() {
    addItem(product!, qty, flavor, size)
    toast.success(lang === 'ar' ? 'تمت الإضافة للسلة 🛒' : 'Ajouté au panier 🛒')
    toggleCart()
  }

  return (
    <div style={{background:'var(--dark)',minHeight:'100vh'}}>
      <AnnouncementBar /><Navbar /><CartSidebar /><WhatsappFloat />
      <div style={{background:'var(--dark2)',borderBottom:'1px solid var(--gray1)',padding:'10px 16px'}}>
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm" style={{color:'var(--gray4)'}}>
          <Link href="/" style={{color:'var(--gray4)',textDecoration:'none'}}>{lang==='ar'?'الرئيسية':'Accueil'}</Link>
          <ChevronRight size={14}/><Link href="/#products" style={{color:'var(--gray4)',textDecoration:'none'}}>{lang==='ar'?'المنتجات':'Produits'}</Link>
          <ChevronRight size={14}/><span style={{color:'var(--orange)'}}>{lang==='fr'&&product.name_fr?product.name_fr:product.name}</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div style={{background:'var(--dark2)',borderRadius:'16px',border:'1px solid var(--gray1)',overflow:'hidden',aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px'}}>
              {mainImg?<img src={mainImg} alt={product.name} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<span style={{fontSize:'80px'}}>💪</span>}
            </div>
            {images.length>1&&(<div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {images.map((img,i)=>(<button key={i} onClick={()=>setActiveImg(i)} style={{width:64,height:64,borderRadius:'8px',overflow:'hidden',border:`2px solid ${i===activeImg?'var(--orange)':'var(--gray1)'}`,background:'var(--dark3)',padding:0,cursor:'pointer'}}><img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></button>))}
            </div>)}
          </div>
          <div>
            {category&&<div style={{display:'inline-block',background:'rgba(255,107,0,0.1)',border:'1px solid rgba(255,107,0,0.2)',color:'var(--orange)',fontSize:'12px',fontWeight:700,padding:'3px 12px',borderRadius:'20px',marginBottom:'10px'}}>{lang==='fr'?category.name_fr:category.name}</div>}
            <h1 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:900,color:'#fff',marginBottom:'10px',lineHeight:1.2}}>{lang==='fr'&&product.name_fr?product.name_fr:product.name}</h1>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px',flexWrap:'wrap'}}>
              <span style={{fontSize:'30px',fontWeight:900,color:'var(--orange)'}}>{product.price.toLocaleString()} دج</span>
              {product.compare_price&&<span style={{fontSize:'18px',color:'var(--gray4)',textDecoration:'line-through'}}>{product.compare_price.toLocaleString()} دج</span>}
              {disc>0&&<span style={{background:'var(--green)',color:'#fff',fontSize:'13px',fontWeight:700,padding:'3px 10px',borderRadius:'10px'}}>-{disc}%</span>}
            </div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'6px 14px',borderRadius:'20px',marginBottom:'16px',fontSize:'13px',fontWeight:700,background:inStock?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',color:inStock?'var(--green)':'var(--red)',border:`1px solid ${inStock?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`}}>
              {inStock?`✅ ${lang==='ar'?`متوفر (${product.quantity} وحدة)`:`En stock (${product.quantity} unités)`}`:`❌ ${lang==='ar'?'نفذت الكمية':'Rupture de stock'}`}
            </div>
            {product.flavors&&product.flavors.length>0&&(<div style={{marginBottom:'14px'}}><div style={{fontSize:'13px',fontWeight:700,marginBottom:'8px',color:'var(--gray5)'}}>{lang==='ar'?'النكهة':'Parfum'}</div><div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>{product.flavors.map(f=>(<button key={f} onClick={()=>setFlavor(f)} style={{padding:'6px 14px',borderRadius:'8px',border:`1.5px solid ${flavor===f?'var(--orange)':'var(--gray1)'}`,background:flavor===f?'rgba(255,107,0,0.1)':'var(--dark3)',color:flavor===f?'var(--orange)':'var(--gray5)',fontWeight:600,fontSize:'13px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>{f}</button>))}</div></div>)}
            {product.sizes&&product.sizes.length>0&&(<div style={{marginBottom:'14px'}}><div style={{fontSize:'13px',fontWeight:700,marginBottom:'8px',color:'var(--gray5)'}}>{lang==='ar'?'الحجم':'Taille'}</div><div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>{product.sizes.map(s=>(<button key={s} onClick={()=>setSize(s)} style={{padding:'6px 14px',borderRadius:'8px',border:`1.5px solid ${size===s?'var(--orange)':'var(--gray1)'}`,background:size===s?'rgba(255,107,0,0.1)':'var(--dark3)',color:size===s?'var(--orange)':'var(--gray5)',fontWeight:600,fontSize:'13px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>{s}</button>))}</div></div>)}
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
              <span style={{fontSize:'13px',fontWeight:700,color:'var(--gray5)'}}>{lang==='ar'?'الكمية':'Quantité'}</span>
              <div style={{display:'flex',alignItems:'center',gap:'10px',background:'var(--dark3)',borderRadius:'8px',padding:'4px 8px',border:'1px solid var(--gray1)'}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:'none',border:'none',color:'var(--white)',cursor:'pointer',display:'flex',alignItems:'center'}}><Minus size={15}/></button>
                <span style={{fontWeight:800,fontSize:'16px',minWidth:'24px',textAlign:'center'}}>{qty}</span>
                <button onClick={()=>setQty(q=>Math.min(product.quantity,q+1))} style={{background:'none',border:'none',color:'var(--white)',cursor:'pointer',display:'flex',alignItems:'center'}}><Plus size={15}/></button>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
              <button onClick={handleAdd} disabled={!inStock} style={{flex:1,minWidth:'180px',padding:'14px',background:inStock?'var(--orange)':'var(--gray2)',color:inStock?'#fff':'var(--gray4)',border:'none',borderRadius:'10px',fontWeight:800,fontSize:'16px',cursor:inStock?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',fontFamily:'Cairo,sans-serif'}}><ShoppingBag size={18}/>{inStock?(lang==='ar'?'أضف للسلة':'Ajouter au panier'):(lang==='ar'?'نفذت الكمية':'Rupture de stock')}</button>
              <a href={`https://wa.me/213660445532?text=أريد الاستفسار عن ${encodeURIComponent(product.name)}`} target="_blank" style={{padding:'14px 20px',background:'#25D366',color:'#fff',borderRadius:'10px',fontWeight:700,fontSize:'14px',textDecoration:'none',display:'flex',alignItems:'center',gap:'6px'}}>💬</a>
            </div>
            {product.description&&(<div style={{marginBottom:'12px',padding:'14px',background:'var(--dark2)',borderRadius:'10px',border:'1px solid var(--gray1)'}}><div style={{fontWeight:800,fontSize:'14px',marginBottom:'8px',color:'#fff'}}>{lang==='ar'?'الوصف':'Description'}</div><p style={{fontSize:'14px',color:'var(--gray5)',lineHeight:1.7}}>{product.description}</p></div>)}
            {product.usage_instructions&&(<div style={{padding:'14px',background:'rgba(255,107,0,0.06)',borderRadius:'10px',border:'1px solid rgba(255,107,0,0.15)'}}><div style={{fontWeight:800,fontSize:'14px',marginBottom:'8px',color:'var(--orange)'}}>💡 {lang==='ar'?'طريقة الاستعمال':"Mode d'emploi"}</div><p style={{fontSize:'14px',color:'var(--gray5)',lineHeight:1.7}}>{product.usage_instructions}</p></div>)}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
