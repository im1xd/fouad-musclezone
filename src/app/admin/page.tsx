'use client'
import { useState, useEffect, useCallback } from 'react'
import { Package, ShoppingBag, TrendingUp, Bell, Settings, Plus, Search, LogOut, Eye, CheckCircle, Truck, X, ChevronDown, Edit2, Trash2, ToggleLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_AR: Record<string,string> = { new:'جديد', accepted:'مقبول', preparing:'قيد التحضير', shipped:'تم الإرسال', delivered:'تم التسليم', cancelled:'ملغي' }
const STATUS_CLASS: Record<string,string> = { new:'status-new', accepted:'status-accepted', preparing:'status-preparing', shipped:'status-shipped', delivered:'status-delivered', cancelled:'status-cancelled' }
const DELIVERY_COMPANIES = ['Yalidine','ZR Express','Maystro','Procolis','Noest Express']

const DEMO_ORDERS = [
  { id:'o1', order_number:'FF-20240501-A1B2C3', customer_name:'محمد أمين بلعباس', customer_phone:'0661234567', wilaya:'سطيف', commune:'سطيف', address:'حي 8 ماي', subtotal:4500, delivery_price:400, total:4900, status:'new', created_at: new Date(Date.now()-3600000).toISOString(), notes:'', order_items:[{product_name:'Whey Protein Gold Standard',quantity:1,unit_price:4500,total_price:4500,selected_flavor:'Chocolate',selected_size:'1kg'}] },
  { id:'o2', order_number:'FF-20240501-D4E5F6', customer_name:'خالد بن علي', customer_phone:'0772345678', wilaya:'الجزائر', commune:'باب الزوار', address:'شارع الاستقلال 15', subtotal:9000, delivery_price:0, total:9000, status:'accepted', created_at: new Date(Date.now()-86400000).toISOString(), notes:'اتصل قبل التوصيل', order_items:[{product_name:'Whey Protein',quantity:1,unit_price:4500,total_price:4500},{product_name:'Creatine',quantity:1,unit_price:2800,total_price:2800},{product_name:'BCAA',quantity:1,unit_price:2500,total_price:2500}] },
  { id:'o3', order_number:'FF-20240501-G7H8I9', customer_name:'يوسف مرابط', customer_phone:'0553456789', wilaya:'وهران', commune:'وهران', address:'حي الإخاء', subtotal:6500, delivery_price:400, total:6900, status:'shipped', tracking_number:'YLN987654321', created_at: new Date(Date.now()-172800000).toISOString(), notes:'', order_items:[{product_name:'Mass Gainer 3kg',quantity:1,unit_price:6500,total_price:6500,selected_flavor:'Chocolate'}] },
  { id:'o4', order_number:'FF-20240430-J1K2L3', customer_name:'فاطمة حسيني', customer_phone:'0664567890', wilaya:'قسنطينة', commune:'قسنطينة', address:'حي بولبية', subtotal:5600, delivery_price:0, total:5600, status:'delivered', created_at: new Date(Date.now()-259200000).toISOString(), notes:'', order_items:[{product_name:'Fat Burner Pro',quantity:1,unit_price:3800,total_price:3800},{product_name:'Vitamin D3',quantity:1,unit_price:1800,total_price:1800}] },
]

const DEMO_PRODUCTS = [
  { id:'p1', name:'Whey Protein Gold Standard', price:4500, compare_price:5500, quantity:25, is_available:true, is_featured:true, is_best_seller:true, is_hidden:false, product_images:[{url:'https://images.unsplash.com/photo-1617718956199-a1440a7d52b3?w=100',is_primary:true}], categories:{name:'Protein'} },
  { id:'p2', name:'Creatine Monohydrate 300g', price:2800, compare_price:null, quantity:18, is_available:true, is_featured:false, is_best_seller:true, is_hidden:false, product_images:[{url:'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=100',is_primary:true}], categories:{name:'Creatine'} },
  { id:'p3', name:'Mass Gainer Extreme 3kg', price:6500, compare_price:7500, quantity:12, is_available:true, is_featured:true, is_best_seller:false, is_hidden:false, product_images:[{url:'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=100',is_primary:true}], categories:{name:'Mass Gainer'} },
  { id:'p4', name:'Pre-Workout Extreme', price:3200, compare_price:3800, quantity:20, is_available:true, is_featured:false, is_best_seller:false, is_hidden:false, product_images:[{url:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=100',is_primary:true}], categories:{name:'Pre-Workout'} },
  { id:'p5', name:'BCAA 8000', price:2500, compare_price:null, quantity:0, is_available:false, is_featured:false, is_best_seller:false, is_hidden:false, product_images:[{url:'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=100',is_primary:true}], categories:{name:'BCAA'} },
  { id:'p6', name:'Fat Burner Pro 120 caps', price:3800, compare_price:4200, quantity:15, is_available:true, is_featured:true, is_best_seller:false, is_hidden:false, product_images:[{url:'https://images.unsplash.com/photo-1579722822693-d82ad16e9a64?w=100',is_primary:true}], categories:{name:'Fat Burner'} },
]

const CATS = ['Protein','Creatine','Vitamins','Mass Gainer','Fat Burner','Pre-Workout','BCAA','Accessories']

type Tab = 'dashboard'|'orders'|'products'|'add-product'|'notifications'|'settings'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [adminName, setAdminName] = useState('Fouad')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS)
  const [products, setProducts] = useState<any[]>(DEMO_PRODUCTS)
  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [prodSearch, setProdSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [notifCount, setNotifCount] = useState(2)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [orderStatus, setOrderStatus] = useState('')
  const [trackingNum, setTrackingNum] = useState('')
  const [deliveryCompany, setDeliveryCompany] = useState('')
  const [pf, setPf] = useState({ name:'', name_fr:'', category:'', price:'', compare_price:'', quantity:'', description:'', details:'', usage:'', flavors:'', sizes:'', images:'' as any, is_featured:false, is_bestseller:false, is_available:true })

  function login() {
    if ((email==='admin@fouadmusclezone.dz'&&pass==='FMZ@Admin2024')||(email==='demo@demo.com'&&pass==='demo123')) {
      setLoggedIn(true); setAdminName('Fouad')
      toast.success('مرحباً بك يا Fouad 👋')
    } else { toast.error('بيانات الدخول خاطئة') }
  }

  function updateOrderStatus(orderId: string) {
    setOrders(prev => prev.map(o => o.id===orderId ? {...o, status:orderStatus||o.status, tracking_number:trackingNum||o.tracking_number, delivery_company:deliveryCompany||o.delivery_company} : o))
    setSelectedOrder((prev: any) => prev ? {...prev, status:orderStatus||prev.status, tracking_number:trackingNum||prev.tracking_number} : prev)
    toast.success('تم تحديث الطلب ✅')
  }

  function toggleProductProp(id: string, prop: string) {
    setProducts(prev => prev.map(p => p.id===id ? {...p, [prop]: !p[prop]} : p))
    toast.success('تم التحديث')
  }

  function deleteProduct(id: string) {
    if (!confirm('حذف هذا المنتج؟')) return
    setProducts(prev => prev.filter(p => p.id!==id))
    toast.success('تم الحذف')
  }

  function editProduct(p: any) {
    setEditingProduct(p)
    setPf({ name:p.name, name_fr:p.name_fr||'', category:p.categories?.name||'', price:p.price+'', compare_price:p.compare_price||'', quantity:p.quantity+'', description:p.description||'', details:p.details||'', usage:p.usage_instructions||'', flavors:p.flavors?.join(', ')||'', sizes:p.sizes?.join(', ')||'', images:'', is_featured:p.is_featured, is_bestseller:p.is_best_seller, is_available:p.is_available })
    setTab('add-product')
  }

  function saveProduct() {
    if (!pf.name||!pf.price) { toast.error('الاسم والسعر مطلوبان'); return }
    const prod = { id: editingProduct?.id||'p'+Date.now(), name:pf.name, name_fr:pf.name_fr, price:parseFloat(pf.price), compare_price:pf.compare_price?parseFloat(pf.compare_price):null, quantity:parseInt(pf.quantity)||0, is_available:pf.is_available, is_featured:pf.is_featured, is_best_seller:pf.is_bestseller, is_hidden:false, description:pf.description, details:pf.details, usage_instructions:pf.usage, flavors:pf.flavors?pf.flavors.split(',').map((s:string)=>s.trim()).filter(Boolean):null, sizes:pf.sizes?pf.sizes.split(',').map((s:string)=>s.trim()).filter(Boolean):null, categories:{name:pf.category}, product_images: pf.images ? [{url:pf.images,is_primary:true}] : editingProduct?.product_images||[] }
    if (editingProduct) { setProducts(prev=>prev.map(p=>p.id===editingProduct.id?prod:p)); toast.success('تم تحديث المنتج ✅') }
    else { setProducts(prev=>[prod,...prev]); toast.success('تمت إضافة المنتج ✅') }
    setEditingProduct(null)
    setPf({ name:'',name_fr:'',category:'',price:'',compare_price:'',quantity:'',description:'',details:'',usage:'',flavors:'',sizes:'',images:'',is_featured:false,is_bestseller:false,is_available:true })
    setTab('products')
  }

  const filteredOrders = orders.filter(o => {
    if (orderFilter!=='all'&&o.status!==orderFilter) return false
    if (orderSearch) { const q=orderSearch.toLowerCase(); return o.customer_name.includes(q)||o.order_number.toLowerCase().includes(q)||o.customer_phone.includes(q) }
    return true
  })

  const filteredProducts = products.filter(p => !prodSearch || p.name.toLowerCase().includes(prodSearch.toLowerCase()))

  const stats = { total:orders.length, new:orders.filter(o=>o.status==='new').length, delivered:orders.filter(o=>o.status==='delivered').length, revenue:orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+o.total,0) }

  const inputCls: React.CSSProperties = { width:'100%',background:'var(--dark3)',border:'1px solid var(--gray1)',borderRadius:'8px',padding:'10px 12px',color:'var(--white)',fontFamily:'Cairo,sans-serif',fontSize:'13px',outline:'none',direction:'rtl' }

  // LOGIN SCREEN
  if (!loggedIn) return (
    <div style={{background:'var(--dark)',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'16px',padding:'36px 28px',width:'100%',maxWidth:'380px'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <div style={{width:70,height:70,borderRadius:'50%',border:'3px solid var(--orange)',overflow:'hidden',margin:'0 auto 14px',background:'var(--dark3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>
            <img src="/logo.jpg" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e:any)=>{e.target.style.display='none';e.target.parentElement.innerHTML='💪'}} />
          </div>
          <div style={{fontFamily:'Bebas Neue,Barlow Condensed,sans-serif',fontSize:'22px',letterSpacing:'2px',color:'#fff'}}>FOUAD MUSCLE ZONE</div>
          <div style={{fontSize:'13px',color:'var(--gray4)',marginTop:'4px'}}>لوحة التحكم</div>
        </div>
        <div style={{marginBottom:'14px'}}>
          <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>البريد الإلكتروني</label>
          <input style={{...inputCls,direction:'ltr'}} type="email" placeholder="admin@fouadmusclezone.dz" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} />
        </div>
        <div style={{marginBottom:'20px'}}>
          <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>كلمة المرور</label>
          <input style={{...inputCls,direction:'ltr'}} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} />
        </div>
        <button onClick={login} style={{width:'100%',padding:'13px',background:'var(--orange)',color:'#fff',border:'none',borderRadius:'10px',fontWeight:800,fontSize:'16px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>دخول</button>
        <div style={{textAlign:'center',marginTop:'14px',fontSize:'11px',color:'var(--gray4)'}}>
          تجربة: demo@demo.com / demo123
        </div>
      </div>
    </div>
  )

  return (
    <div style={{background:'var(--dark)',minHeight:'100vh',fontFamily:'Cairo,sans-serif'}}>
      {/* TOP BAR */}
      <div style={{background:'var(--black)',borderBottom:'1px solid var(--gray1)',padding:'0 16px',height:'54px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:34,height:34,borderRadius:'50%',border:'2px solid var(--orange)',overflow:'hidden',background:'var(--dark3)'}}>
            <img src="/logo.jpg" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e:any)=>{e.target.style.display='none'}} />
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:'13px',lineHeight:1}}>Fouad Muscle Zone</div>
            <div style={{fontSize:'11px',color:'var(--orange)'}}>Admin Dashboard</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <button onClick={()=>setTab('notifications')} style={{background:'none',border:'none',color:'var(--gray5)',cursor:'pointer',position:'relative',padding:'4px',display:'flex'}}>
            <Bell size={18}/>
            {notifCount>0&&<span style={{position:'absolute',top:0,right:0,background:'var(--orange)',color:'#fff',fontSize:'9px',fontWeight:800,width:14,height:14,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{notifCount}</span>}
          </button>
          <a href="/" target="_blank" style={{background:'none',border:'none',color:'var(--gray5)',cursor:'pointer',padding:'4px',display:'flex',textDecoration:'none'}}><Eye size={18}/></a>
          <button onClick={()=>{setLoggedIn(false);toast.success('تم تسجيل الخروج')}} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer',padding:'4px',display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',fontWeight:700}}>
            <LogOut size={15}/> خروج
          </button>
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{display:'flex',gap:'4px',overflowX:'auto',padding:'10px 12px',background:'var(--dark2)',borderBottom:'1px solid var(--gray1)',scrollbarWidth:'none'}}>
        {([
          ['dashboard','📊 الرئيسية'],['orders','📦 الطلبات'],
          ['products','🏋️ المنتجات'],['add-product','➕ إضافة منتج'],
          ['notifications','🔔 الإشعارات'],['settings','⚙️ الإعدادات']
        ] as [Tab,string][]).map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flexShrink:0,padding:'7px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:700,cursor:'pointer',transition:'all 0.2s',background:tab===t?'var(--orange)':'var(--dark3)',border:`1px solid ${tab===t?'var(--orange)':'var(--gray1)'}`,color:tab===t?'#fff':'var(--gray5)',whiteSpace:'nowrap'}}>
            {l}{t==='notifications'&&notifCount>0?` (${notifCount})`:''}
          </button>
        ))}
      </div>

      <div style={{padding:'12px',maxWidth:'1100px',margin:'0 auto'}}>

        {/* DASHBOARD */}
        {tab==='dashboard'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0 14px',flexWrap:'wrap',gap:'8px'}}>
              <div style={{fontSize:'16px',fontWeight:800}}>مرحباً، {adminName} 👋</div>
              <div style={{fontSize:'12px',color:'var(--gray4)'}}>{new Date().toLocaleDateString('ar-DZ',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px',marginBottom:'16px'}}>
              {[
                {label:'إجمالي الطلبات',val:stats.total,color:'var(--orange)',icon:'📦'},
                {label:'طلبات جديدة',val:stats.new,color:'var(--blue)',icon:'🆕'},
                {label:'تم التسليم',val:stats.delivered,color:'var(--green)',icon:'✅'},
                {label:'إجمالي المبيعات',val:stats.revenue.toLocaleString()+' دج',color:'var(--orange)',icon:'💰'},
              ].map((s,i)=>(
                <div key={i} style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'12px',padding:'16px',position:'relative',overflow:'hidden'}}>
                  <div style={{fontSize:'22px',position:'absolute',bottom:6,left:10,opacity:0.1}}>{s.icon}</div>
                  <div style={{fontSize:'12px',color:'var(--gray4)',marginBottom:'4px'}}>{s.label}</div>
                  <div style={{fontSize:'22px',fontWeight:900,color:s.color}}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={{fontWeight:800,fontSize:'14px',marginBottom:'10px',borderInlineStart:'3px solid var(--orange)',paddingInlineStart:'10px'}}>آخر الطلبات</div>
            {orders.slice(0,5).map(o=>(
              <div key={o.id} onClick={()=>{setSelectedOrder(o);setOrderStatus(o.status);setTrackingNum(o.tracking_number||'');setDeliveryCompany(o.delivery_company||'')}} style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'10px',padding:'12px',marginBottom:'8px',cursor:'pointer',transition:'border-color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--orange)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--gray1)')}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                  <span style={{fontWeight:700,fontSize:'13px',color:'var(--orange)'}}>{o.order_number}</span>
                  <span className={STATUS_CLASS[o.status]} style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'10px'}}>{STATUS_AR[o.status]}</span>
                </div>
                <div style={{fontSize:'13px',fontWeight:700,marginBottom:'2px'}}>👤 {o.customer_name}</div>
                <div style={{fontSize:'12px',color:'var(--gray4)',display:'flex',justifyContent:'space-between'}}>
                  <span>📍 {o.wilaya} | 📞 {o.customer_phone}</span>
                  <span style={{color:'var(--orange)',fontWeight:800}}>{o.total.toLocaleString()} دج</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS */}
        {tab==='orders'&&(
          <div>
            <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
              <input style={{...inputCls,flex:1}} placeholder="بحث بالاسم أو رقم الطلب أو الهاتف..." value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} />
            </div>
            <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'14px',scrollbarWidth:'none',paddingBottom:'4px'}}>
              {['all','new','accepted','preparing','shipped','delivered','cancelled'].map(s=>(
                <button key={s} onClick={()=>setOrderFilter(s)} style={{flexShrink:0,padding:'5px 12px',borderRadius:'16px',fontSize:'11px',fontWeight:700,cursor:'pointer',background:orderFilter===s?'var(--orange)':'var(--dark3)',border:`1px solid ${orderFilter===s?'var(--orange)':'var(--gray1)'}`,color:orderFilter===s?'#fff':'var(--gray5)',whiteSpace:'nowrap'}}>
                  {s==='all'?'الكل':STATUS_AR[s]} {s!=='all'?`(${orders.filter(o=>o.status===s).length})`:``}
                </button>
              ))}
            </div>
            {filteredOrders.length===0?<div style={{textAlign:'center',padding:'60px',color:'var(--gray4)'}}>لا توجد طلبات</div>:
            filteredOrders.map(o=>(
              <div key={o.id} onClick={()=>{setSelectedOrder(o);setOrderStatus(o.status);setTrackingNum(o.tracking_number||'');setDeliveryCompany(o.delivery_company||'')}} style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'10px',padding:'14px',marginBottom:'10px',cursor:'pointer',transition:'border-color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--orange)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--gray1)')}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',flexWrap:'wrap',gap:'6px'}}>
                  <span style={{fontWeight:700,fontSize:'13px',color:'var(--orange)'}}>{o.order_number}</span>
                  <span className={STATUS_CLASS[o.status]} style={{fontSize:'11px',fontWeight:700,padding:'3px 9px',borderRadius:'10px'}}>{STATUS_AR[o.status]}</span>
                </div>
                <div style={{fontSize:'14px',fontWeight:800,marginBottom:'4px'}}>👤 {o.customer_name}</div>
                <div style={{fontSize:'12px',color:'var(--gray4)',marginBottom:'4px'}}>📍 {o.wilaya}، {o.commune} &nbsp;·&nbsp; 📞 {o.customer_phone}</div>
                <div style={{display:'flex',justifyContent:'space-between',paddingTop:'8px',borderTop:'1px solid var(--gray1)',fontSize:'13px'}}>
                  <span style={{color:'var(--gray4)'}}>{o.order_items?.length||0} منتج • {new Date(o.created_at).toLocaleDateString('ar-DZ',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                  <span style={{color:'var(--orange)',fontWeight:800,fontSize:'15px'}}>{o.total.toLocaleString()} دج</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {tab==='products'&&(
          <div>
            <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
              <input style={{...inputCls,flex:1}} placeholder="بحث في المنتجات..." value={prodSearch} onChange={e=>setProdSearch(e.target.value)} />
              <button onClick={()=>{setEditingProduct(null);setPf({name:'',name_fr:'',category:'',price:'',compare_price:'',quantity:'',description:'',details:'',usage:'',flavors:'',sizes:'',images:'',is_featured:false,is_bestseller:false,is_available:true});setTab('add-product')}} style={{background:'var(--orange)',border:'none',color:'#fff',padding:'0 16px',borderRadius:'8px',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontFamily:'Cairo,sans-serif',flexShrink:0}}>
                <Plus size={15}/> إضافة
              </button>
            </div>
            {filteredProducts.map(p=>{
              const img=p.product_images?.[0]?.url
              const si=p.quantity<=0?'out':p.quantity<=5?'low':'in'
              return (
                <div key={p.id} style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'10px',padding:'12px',marginBottom:'8px',display:'flex',gap:'12px',alignItems:'flex-start'}}>
                  <div style={{width:60,height:60,borderRadius:'8px',background:'var(--dark3)',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>
                    {img?<img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'💪'}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'14px',fontWeight:700,marginBottom:'3px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                    <div style={{fontSize:'12px',color:'var(--gray4)',marginBottom:'5px'}}>{p.categories?.name} &nbsp;·&nbsp;
                      <span style={{color:si==='out'?'var(--red)':si==='low'?'var(--yellow)':'var(--green)',fontWeight:700}}>
                        {si==='out'?'نفذ':si==='low'?`⚠️ ${p.quantity} متبقية`:`✅ ${p.quantity} متوفر`}
                      </span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                      <span style={{fontSize:'16px',fontWeight:800,color:'var(--orange)'}}>{p.price.toLocaleString()} دج</span>
                      {p.compare_price&&<span style={{fontSize:'12px',color:'var(--gray4)',textDecoration:'line-through'}}>{p.compare_price.toLocaleString()}</span>}
                    </div>
                    <div style={{display:'flex',gap:'6px',marginTop:'8px',flexWrap:'wrap'}}>
                      <button onClick={()=>editProduct(p)} style={{padding:'4px 10px',borderRadius:'6px',border:'1px solid var(--blue)',color:'var(--blue)',background:'none',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>✏️ تعديل</button>
                      <button onClick={()=>toggleProductProp(p.id,'is_hidden')} style={{padding:'4px 10px',borderRadius:'6px',border:'1px solid var(--gray2)',color:'var(--gray5)',background:'none',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>{p.is_hidden?'👁 إظهار':'🙈 إخفاء'}</button>
                      <button onClick={()=>toggleProductProp(p.id,'is_available')} style={{padding:'4px 10px',borderRadius:'6px',border:`1px solid ${p.is_available?'var(--green)':'var(--red)'}`,color:p.is_available?'var(--green)':'var(--red)',background:'none',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>{p.is_available?'✅ متوفر':'❌ نفذ'}</button>
                      <button onClick={()=>deleteProduct(p.id)} style={{padding:'4px 10px',borderRadius:'6px',border:'1px solid var(--red)',color:'var(--red)',background:'none',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>🗑 حذف</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ADD / EDIT PRODUCT */}
        {tab==='add-product'&&(
          <div style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'12px',padding:'20px'}}>
            <h2 style={{fontWeight:800,fontSize:'17px',marginBottom:'20px'}}>{editingProduct?'✏️ تعديل المنتج':'➕ إضافة منتج جديد'}</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              {[['اسم المنتج *','name','Whey Protein...'],['الاسم بالفرنسية','name_fr','Whey Protéine...']].map(([l,k,ph])=>(
                <div key={k}><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>{l}</label><input style={inputCls} placeholder={ph} value={(pf as any)[k]} onChange={e=>setPf(f=>({...f,[k]:e.target.value}))}/></div>
              ))}
            </div>
            <div style={{marginBottom:'12px'}}>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>التصنيف</label>
              <select style={{...inputCls,cursor:'pointer'}} value={pf.category} onChange={e=>setPf(f=>({...f,category:e.target.value}))}>
                <option value="">اختر التصنيف</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              {[['السعر (دج) *','price','4500','ltr'],['السعر القديم (دج)','compare_price','5000','ltr'],['الكمية *','quantity','50','ltr'],['رابط صورة المنتج','images','https://...','ltr']].map(([l,k,ph,dir])=>(
                <div key={k}><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>{l}</label><input style={{...inputCls,direction:dir as any}} placeholder={ph} value={(pf as any)[k]} onChange={e=>setPf(f=>({...f,[k]:e.target.value}))}/></div>
              ))}
            </div>
            <div style={{marginBottom:'12px'}}><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>الوصف</label><textarea style={{...inputCls,minHeight:'70px',resize:'vertical'}} placeholder="وصف المنتج..." value={pf.description} onChange={e=>setPf(f=>({...f,description:e.target.value}))}/></div>
            <div style={{marginBottom:'12px'}}><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>التفاصيل</label><textarea style={{...inputCls,minHeight:'60px',resize:'vertical'}} placeholder="مواصفات تقنية، مكونات..." value={pf.details} onChange={e=>setPf(f=>({...f,details:e.target.value}))}/></div>
            <div style={{marginBottom:'12px'}}><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>طريقة الاستعمال</label><textarea style={{...inputCls,minHeight:'60px',resize:'vertical'}} placeholder="كيفية استخدام المنتج..." value={pf.usage} onChange={e=>setPf(f=>({...f,usage:e.target.value}))}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
              <div><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>النكهات (فصل بفاصلة)</label><input style={inputCls} placeholder="Chocolate, Vanilla, Strawberry" value={pf.flavors} onChange={e=>setPf(f=>({...f,flavors:e.target.value}))}/></div>
              <div><label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>الأحجام (فصل بفاصلة)</label><input style={inputCls} placeholder="1kg, 2kg, 5lbs" value={pf.sizes} onChange={e=>setPf(f=>({...f,sizes:e.target.value}))}/></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'20px'}}>
              {[['is_featured','منتج مميز ⭐'],['is_bestseller','الأكثر مبيعاً 🔥'],['is_available','متوفر للبيع ✅']].map(([k,l])=>(
                <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--gray1)'}}>
                  <span style={{fontSize:'13px',fontWeight:700}}>{l}</span>
                  <button className={`toggle${(pf as any)[k]?' on':''}`} onClick={()=>setPf(f=>({...f,[k]:!(f as any)[k]}))}/>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={saveProduct} style={{flex:1,padding:'13px',background:'var(--orange)',color:'#fff',border:'none',borderRadius:'10px',fontWeight:800,fontSize:'15px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>💾 حفظ المنتج</button>
              <button onClick={()=>{setTab('products');setEditingProduct(null)}} style={{padding:'13px 20px',background:'none',border:'1px solid var(--gray1)',color:'var(--gray5)',borderRadius:'10px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>إلغاء</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab==='notifications'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
              <span style={{fontWeight:800}}>الإشعارات</span>
              <button onClick={()=>setNotifCount(0)} style={{background:'none',border:'none',color:'var(--orange)',fontSize:'12px',cursor:'pointer',fontWeight:700}}>تعليم الكل مقروء</button>
            </div>
            {[
              {id:'n1',type:'new_order',title:'طلب جديد! 🔔',msg:'طلب جديد من محمد أمين — سطيف',time:new Date(Date.now()-3600000),read:false},
              {id:'n2',type:'low_stock',title:'مخزون منخفض ⚠️',msg:'Omega-3 Fish Oil — 3 وحدات متبقية فقط',time:new Date(Date.now()-7200000),read:false},
              {id:'n3',type:'new_order',title:'طلب جديد! 🔔',msg:'طلب جديد من خالد بن علي — الجزائر',time:new Date(Date.now()-86400000),read:true},
            ].map(n=>(
              <div key={n.id} style={{background:n.read?'var(--dark2)':'rgba(255,107,0,0.04)',border:`1px solid ${n.read?'var(--gray1)':'rgba(255,107,0,0.2)'}`,borderInlineStart:n.read?'1px solid var(--gray1)':'3px solid var(--orange)',borderRadius:'10px',padding:'14px',marginBottom:'8px',cursor:'pointer',display:'flex',gap:'12px',alignItems:'flex-start'}}>
                <div style={{width:36,height:36,borderRadius:'8px',background:'rgba(255,107,0,0.1)',color:'var(--orange)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>{n.type==='new_order'?'📦':'⚠️'}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',fontWeight:700,marginBottom:'3px'}}>{n.title}</div>
                  <div style={{fontSize:'12px',color:'var(--gray4)',marginBottom:'4px'}}>{n.msg}</div>
                  <div style={{fontSize:'11px',color:'var(--gray4)'}}>{n.time.toLocaleTimeString('ar-DZ',{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                {!n.read&&<div style={{width:8,height:8,borderRadius:'50%',background:'var(--orange)',flexShrink:0,marginTop:4}}/>}
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {tab==='settings'&&(
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {[
              {title:'🏪 معلومات المتجر', fields:[{l:'اسم المتجر',v:'Fouad Muscle Zone'},{l:'رقم الهاتف',v:'0660445532'},{l:'العنوان',v:'سطيف، الجزائر'}]},
              {title:'📱 منصات التواصل', fields:[{l:'Instagram',v:'https://www.instagram.com/fouad_fitness39'},{l:'Facebook',v:'https://www.facebook.com/share/1CLyvfRZRo/'},{l:'TikTok',v:'https://www.tiktok.com/@fouadfitness39'}]},
              {title:'🚚 التوصيل', fields:[{l:'سعر التوصيل للبيت (دج)',v:'400'},{l:'سعر التوصيل للمكتب (دج)',v:'350'},{l:'توصيل مجاني من (دج)',v:'5000'}]},
            ].map((sec,i)=>(
              <div key={i} style={{background:'var(--dark2)',border:'1px solid var(--gray1)',borderRadius:'12px',padding:'18px'}}>
                <div style={{fontWeight:800,fontSize:'14px',marginBottom:'14px',paddingBottom:'10px',borderBottom:'1px solid var(--gray1)'}}>{sec.title}</div>
                {sec.fields.map((f,j)=>(
                  <div key={j} style={{marginBottom:'12px'}}>
                    <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'5px'}}>{f.l}</label>
                    <input style={{...inputCls,direction:f.v.startsWith('http')||/^\d/.test(f.v)?'ltr':'rtl'}} defaultValue={f.v} />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={()=>toast.success('تم حفظ الإعدادات ✅')} style={{padding:'13px',background:'var(--orange)',color:'#fff',border:'none',borderRadius:'10px',fontWeight:800,fontSize:'15px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>💾 حفظ الإعدادات</button>
          </div>
        )}
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder&&(
        <div onClick={(e)=>{if(e.target===e.currentTarget)setSelectedOrder(null)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center',backdropFilter:'blur(4px)'}}>
          <div className="modal-slide-up" style={{background:'var(--dark2)',borderRadius:'16px 16px 0 0',width:'100%',maxWidth:'600px',maxHeight:'90vh',overflowY:'auto',padding:'20px 16px',borderTop:'1px solid var(--gray1)'}}>
            <div style={{width:40,height:4,background:'var(--gray2)',borderRadius:2,margin:'0 auto 16px'}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <div>
                <div style={{fontSize:'16px',fontWeight:800,color:'var(--orange)'}}>{selectedOrder.order_number}</div>
                <div style={{fontSize:'12px',color:'var(--gray4)'}}>{new Date(selectedOrder.created_at).toLocaleDateString('ar-DZ',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span className={STATUS_CLASS[selectedOrder.status]} style={{fontSize:'12px',fontWeight:700,padding:'4px 10px',borderRadius:'10px'}}>{STATUS_AR[selectedOrder.status]}</span>
                <button onClick={()=>setSelectedOrder(null)} style={{background:'var(--dark3)',border:'1px solid var(--gray1)',color:'var(--gray5)',width:30,height:30,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={14}/></button>
              </div>
            </div>
            {/* Customer Info */}
            <div style={{background:'var(--dark3)',borderRadius:'10px',padding:'14px',marginBottom:'12px'}}>
              <div style={{fontWeight:700,fontSize:'13px',marginBottom:'10px',color:'var(--gray5)'}}>👤 بيانات العميل</div>
              {[['الاسم',selectedOrder.customer_name],['الهاتف',selectedOrder.customer_phone],['الولاية',selectedOrder.wilaya],['البلدية',selectedOrder.commune],['العنوان',selectedOrder.address],selectedOrder.notes?['ملاحظات',selectedOrder.notes]:null].filter(Boolean).map((row:any,i:number)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--gray1)',fontSize:'13px'}}>
                  <span style={{color:'var(--gray4)'}}>{row[0]}</span>
                  <span style={{fontWeight:600}}>{row[1]}</span>
                </div>
              ))}
            </div>
            {/* Items */}
            <div style={{background:'var(--dark3)',borderRadius:'10px',padding:'14px',marginBottom:'12px'}}>
              <div style={{fontWeight:700,fontSize:'13px',marginBottom:'10px',color:'var(--gray5)'}}>📦 المنتجات</div>
              {(selectedOrder.order_items||[]).map((item:any,i:number)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid var(--gray1)',fontSize:'13px'}}>
                  <div><span style={{fontWeight:600}}>{item.product_name}</span>{(item.selected_flavor||item.selected_size)&&<span style={{fontSize:'11px',color:'var(--orange)',marginInlineStart:'6px'}}>{[item.selected_flavor,item.selected_size].filter(Boolean).join(' / ')}</span>}</div>
                  <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                    <span style={{color:'var(--gray4)'}}>×{item.quantity}</span>
                    <span style={{color:'var(--orange)',fontWeight:700}}>{item.total_price?.toLocaleString()} دج</span>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:'10px',fontSize:'16px',fontWeight:800}}>
                <span>الإجمالي</span><span style={{color:'var(--orange)'}}>{selectedOrder.total?.toLocaleString()} دج</span>
              </div>
            </div>
            {/* Update Status */}
            <div style={{marginBottom:'12px'}}>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'6px'}}>تغيير حالة الطلب</label>
              <select style={{...inputCls,cursor:'pointer',marginBottom:'10px'}} value={orderStatus} onChange={e=>setOrderStatus(e.target.value)}>
                {Object.entries(STATUS_AR).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'6px'}}>شركة التوصيل</label>
              <select style={{...inputCls,cursor:'pointer',marginBottom:'10px'}} value={deliveryCompany} onChange={e=>setDeliveryCompany(e.target.value)}>
                <option value="">اختر شركة التوصيل</option>
                {DELIVERY_COMPANIES.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
              <label style={{fontSize:'12px',fontWeight:700,color:'var(--gray4)',display:'block',marginBottom:'6px'}}>رقم التتبع</label>
              <input style={{...inputCls,direction:'ltr',letterSpacing:'1px'}} placeholder="YLDXXXXXXXX" value={trackingNum} onChange={e=>setTrackingNum(e.target.value)} />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              <button onClick={()=>updateOrderStatus(selectedOrder.id)} style={{padding:'12px',background:'var(--orange)',color:'#fff',border:'none',borderRadius:'10px',fontWeight:800,fontSize:'14px',cursor:'pointer',fontFamily:'Cairo,sans-serif'}}>💾 حفظ التغييرات</button>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                <a href={`tel:${selectedOrder.customer_phone}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',padding:'10px',background:'rgba(59,130,246,0.1)',border:'1px solid var(--blue)',color:'var(--blue)',borderRadius:'8px',textDecoration:'none',fontWeight:700,fontSize:'13px'}}>📞 اتصال</a>
                <a href={`https://wa.me/213${selectedOrder.customer_phone.replace(/^0/,'')}`} target="_blank" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',padding:'10px',background:'rgba(37,211,102,0.1)',border:'1px solid #25D366',color:'#25D366',borderRadius:'8px',textDecoration:'none',fontWeight:700,fontSize:'13px'}}>💬 واتساب</a>
              </div>
              {selectedOrder.status!=='cancelled'&&<button onClick={()=>{updateOrderStatus(selectedOrder.id);setOrderStatus('cancelled')}} style={{padding:'10px',background:'none',border:'1px solid var(--red)',color:'var(--red)',borderRadius:'8px',cursor:'pointer',fontWeight:700,fontSize:'13px',fontFamily:'Cairo,sans-serif'}}>❌ إلغاء الطلب</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
