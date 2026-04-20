const { useState, useEffect, useCallback, memo } = React;
const { motion, AnimatePresence } = window.Motion;

// Optimized spring transition
const transition = { type: "spring", bounce: 0, duration: 0.4 };

const Toast = ({ message, visible, setVisible }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.3 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, x: "-50%", scale: 0.5, transition: { duration: 0.2 } }}
          style={{ left: "50%" }}
          className={`fixed ${isMobile ? 'bottom-32' : 'bottom-10'} z-[10000] px-6 py-3 rounded-full bg-white text-black font-bold shadow-2xl flex items-center space-x-2 whitespace-nowrap`}
        >
          <span className="iconify" data-icon="mdi:information-outline"></span>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Optimized Link Components
const HoveredLink = memo(({ children, isMobile, ...rest }) => (
  <a {...rest} className={`text-[#4b5563] hover:text-primary transition-all font-semibold flex items-center ${isMobile ? 'py-4 text-base border-b border-black/5 last:border-0' : 'text-sm py-1'}`}>
    {children}
    {isMobile && <span className="iconify ml-auto text-xl opacity-40" data-icon="solar:alt-arrow-right-linear"></span>}
  </a>
));

const ProductItem = memo(({ title, description, href, src, isMobile }) => (
  <a href={href} className="flex items-center space-x-4 py-2 group/item no-underline">
    <img src={src} className={`flex-shrink-0 rounded-xl shadow-lg transition-transform duration-300 group-hover/item:scale-105 ${isMobile ? 'w-16 h-12' : 'w-32 h-20'}`} alt={title} />
    <div>
      <h4 className="text-neutral-800 font-bold text-base md:text-lg m-0">{title}</h4>
      <p className="text-[#64748b] text-[11px] md:text-sm m-0 leading-tight max-w-[12rem]">{description}</p>
    </div>
  </a>
));

const MenuItem = ({ active, setActive, item, icon, isMobile, children, onClick, href }) => {
  const isOpen = active === item;
  
  const handleToggle = useCallback((e) => {
    if (isMobile) {
      if (href) return; // Let the anchor tag handle navigation
      e.stopPropagation();
      setActive(prev => (prev === item ? null : item));
      if (onClick) onClick();
    }
  }, [isMobile, item, setActive, onClick, href]);

  const content = (
    <>
      {isMobile ? (
        <>
          <span className="iconify text-2xl mb-1" data-icon={icon}></span>
          <span className="text-[10px] font-bold uppercase tracking-tight">{item === 'Certificaciones' ? 'Diplomas' : item}</span>
        </>
      ) : (
        <span style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'inherit', lineHeight: '1.2', letterSpacing: 'normal' }}>{item}</span>
      )}
    </>
  );

  const sharedClasses = `cursor-pointer transition-all duration-300 flex flex-col items-center justify-center py-2 relative z-[10005] shadow-none outline-none no-underline
    ${isMobile ? 'min-w-[70px] px-1' : 'px-4'}
    ${isOpen ? 'text-primary scale-105' : 'text-[#4b5563] opacity-80 hover:opacity-100'}`;

  return (
    <div onMouseEnter={() => !isMobile && setActive(item)} className="relative flex justify-center">
      {href && !children ? (
        <a
          href={href}
          onClick={() => setActive(item)}
          style={{ webkitTapHighlightColor: 'transparent' }}
          className={sharedClasses}
        >
          {content}
        </a>
      ) : isMobile && href ? (
        <a
          href={href}
          onClick={() => setActive(item)}
          style={{ webkitTapHighlightColor: 'transparent' }}
          className={sharedClasses}
        >
          {content}
        </a>
      ) : (
        <div
          onClick={handleToggle}
          style={{ webkitTapHighlightColor: 'transparent' }}
          className={sharedClasses}
        >
          {content}
        </div>
      )}

      <AnimatePresence>
        {!isMobile && isOpen && children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.98, y: 10, x: "-50%" }}
            transition={transition}
            style={{ left: "50%", zIndex: 10001, willChange: "transform, opacity" }}
            className={`absolute top-full w-max pt-4`}
          >
            <div className={`overflow-hidden border border-black/5 shadow-2xl rounded-[1.8rem] bg-white/90 backdrop-blur-xl p-4`}>
              {children}
            </div>
          </motion.div>
        )}
        {isMobile && isOpen && children && !href && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.98, y: 10, x: "-50%" }}
            transition={transition}
            style={{ left: "50%", zIndex: 10001, willChange: "transform, opacity" }}
            className={`fixed bottom-[85px] w-[94vw]`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`overflow-hidden border border-black/10 shadow-xl rounded-[2rem] bg-white p-5`}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const onScroll = () => {
      const y = window.scrollY;
      if (!isMobile) setHidden(y > lastScrollY && y > 100);
      setLastScrollY(y);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollY, isMobile]);

  useEffect(() => {
    if (active) setToastVisible(false);
  }, [active]);

  useEffect(() => {
    const handleOpenContact = () => setActive('Contacto');
    window.addEventListener('openContactMenu', handleOpenContact);
    return () => window.removeEventListener('openContactMenu', handleOpenContact);
  }, []);

  const onSubpage = window.location.pathname.includes('/pages/');
  const prefix = onSubpage ? '../' : './';
  const pagePrefix = onSubpage ? '' : 'pages/';
  const certHref = onSubpage ? '../index.html#certificates' : '#certificates';

  return (
    <>
      <Toast message="Próximamente disponible" visible={toastVisible} setVisible={setToastVisible} />
      
      <AnimatePresence>
        {isMobile && (active === 'Explorar' || active === 'Contacto') && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-black/60 z-[9990] backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: hidden ? (isMobile ? 0 : -100) : 0 }}
        className={`fixed z-[9999] ${isMobile ? 'bottom-0 w-full' : 'top-4 inset-x-0 mx-auto max-w-2xl px-4 md:px-0'} ${className}`}
      >
        <nav 
          onMouseLeave={() => !isMobile && setActive(null)}
          className={`flex border-t border-black/5 transition-all ${isMobile ? 'rounded-t-[2rem] bg-white/95 backdrop-blur-2xl px-3 pb-5 pt-3 justify-around' : 'rounded-full bg-white/70 backdrop-blur-xl px-8 py-2 justify-center space-x-6 border shadow-2xl'}`}
        >
          <MenuItem active={active} setActive={setActive} isMobile={isMobile} item="Explorar" icon="solar:magnifer-linear">
            <div className="flex flex-col">
              <HoveredLink isMobile={isMobile} href={`${prefix}index.html#about`}>Sobre mí</HoveredLink>
              <HoveredLink isMobile={isMobile} href={`${prefix}index.html#stack`}>Tecnologías</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem active={active} setActive={setActive} isMobile={isMobile} item="Proyectos" icon="solar:rocket-2-linear" href={`${prefix}index.html#projects`}>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 max-h-[50vh] overflow-y-auto pr-2' : 'grid-cols-2 w-max'}`}>
              <ProductItem isMobile={isMobile} title="Skill Connect" href={`${prefix}${pagePrefix}project-skill-connect.html`} src={`${prefix}images/SkillConnect/LandingPage.png`} description="Fomento de empleabilidad." />
              <ProductItem isMobile={isMobile} title="Parque Forestal" href={`${prefix}${pagePrefix}project-1.html`} src={`${prefix}images/ParquesForestales/landing1.png`} description="Gestión eco-turística." />
              <ProductItem isMobile={isMobile} title="Creative Apps" href={`${prefix}${pagePrefix}project-2.html`} src={`${prefix}images/ProyectosCreativos/parallax1.png`} description="Interfaces interactivas." />
              <ProductItem isMobile={isMobile} title="Java System" href={`${prefix}${pagePrefix}project-3.html`} src={`${prefix}images/InventarioJava/inventarioJava2.png`} description="Gestión de inventarios." />
            </div>
          </MenuItem>

          <MenuItem active={active} setActive={setActive} isMobile={isMobile} item="Certificados" icon="solar:medal-ribbons-star-linear" href={certHref} />

          <MenuItem active={active} setActive={setActive} isMobile={isMobile} item="Contacto" icon="solar:chat-round-dots-linear">
            <div className="flex flex-col">
              <HoveredLink isMobile={isMobile} href="https://wa.me/50498892081" target="_blank">WhatsApp</HoveredLink>
              <HoveredLink isMobile={isMobile} href="mailto:dilmerkj@gmail.com">Email</HoveredLink>
              <HoveredLink isMobile={isMobile} href="https://www.linkedin.com/in/dilmer-nu%C3%B1ez-3a34b2231/" target="_blank">LinkedIn</HoveredLink>
            </div>
          </MenuItem>
        </nav>
      </motion.div>
    </>
  );
}

const rootElement = document.getElementById("navbar-root");
if (rootElement) ReactDOM.createRoot(rootElement).render(<Navbar />);
