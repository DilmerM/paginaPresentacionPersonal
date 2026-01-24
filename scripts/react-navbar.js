const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

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

const MenuItem = ({ setActive, active, item, icon, children, onClick }) => {
  const isMobile = window.innerWidth <= 768;
  
  const toggleActive = (e) => {
    if (isMobile) {
      e.stopPropagation();
      setActive(active === item ? null : item);
      if (onClick) onClick();
    }
  };

  // Only apply hover for desktop
  const desktopEvents = !isMobile ? {
    onMouseEnter: () => setActive(item)
  } : {};

  return (
    <div className="relative" {...desktopEvents}>
      {/* Clickable area for the icon/label */}
      <motion.div
        onClick={toggleActive}
        transition={{ duration: 0.3 }}
        className={`cursor-pointer text-[#e7e9ee] hover:text-white transition-colors flex flex-col items-center justify-center relative z-[10005]
          ${isMobile ? 'px-2 py-2 min-w-[75px]' : 'px-4 py-0.5'}`}
      >
        {isMobile ? (
          <>
            <span className={`iconify text-2xl transition-all duration-300 ${active === item ? 'scale-110 text-primary-2' : ''}`} data-icon={icon}></span>
            <span className={`text-[11px] mt-1 font-semibold transition-all duration-300 ${active === item ? 'opacity-100 text-primary-2' : 'opacity-80'}`}>
              {item === 'Certificaciones' ? 'Diplomas' : item}
            </span>
          </>
        ) : (
          <p className="text-base font-medium whitespace-nowrap">{item}</p>
        )}
      </motion.div>

      <AnimatePresence>
        {active === item && children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: isMobile ? 10 : -10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: 10, x: "-50%" }}
            transition={transition}
            style={{ 
              left: "50%",
              position: isMobile ? 'fixed' : 'absolute',
              bottom: isMobile ? '88px' : 'auto',
              top: isMobile ? 'auto' : 'calc(100% + 0.2rem)',
              zIndex: 10001
            }}
            className={`${isMobile ? 'w-[94vw]' : 'w-max pt-4'}`}
          >
            <div
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the menu
              className={`${isMobile ? 'bg-[#0f1117] border-white/[0.15]' : 'bg-[#0f1117]/90 backdrop-blur-xl border-white/[0.1]'} rounded-[2rem] overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,0.4)] w-full`}
            >
              <motion.div layout className={`h-full ${isMobile ? 'p-5' : 'p-4'}`}>
                {children}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Menu = ({ setActive, children }) => {
  const isMobile = window.innerWidth <= 768;
  const desktopEvents = !isMobile ? {
    onMouseLeave: () => setActive(null)
  } : {};

  return (
    <nav
      {...desktopEvents}
      className={`relative border-white/[0.1] shadow-2xl flex justify-around md:justify-center z-[10002] 
        ${isMobile 
          ? 'w-full rounded-t-[3rem] border-t px-2 pb-3 pt-4 bg-[#0b0b10]' 
          : 'rounded-full border px-6 py-0.5 space-x-4 bg-[#0b0b10]/80 backdrop-blur-xl'}`}
    >
      {children}
    </nav>
  );
};

const ProductItem = ({ title, description, href, src }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <a href={href} className={`flex ${isMobile ? 'flex-row items-center space-x-4 space-y-0 py-2' : 'space-x-4'} group/product no-underline text-inherit`}>
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className={`flex-shrink-0 rounded-xl shadow-2xl group-hover/product:scale-105 transition-transform duration-200 ${isMobile ? 'w-20 h-14' : 'w-[140px]'}`}
      />
      <div>
        <h4 className="text-lg md:text-xl font-bold mb-1 text-white no-underline">
          {title}
        </h4>
        <p className="text-[#aab0bd] text-xs md:text-sm max-w-[12rem] md:max-w-[10rem] no-underline leading-tight">
          {description}
        </p>
      </div>
    </a>
  );
};

const HoveredLink = ({ children, ...rest }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <a
      {...rest}
      className={`text-[#aab0bd] hover:text-white transition-colors duration-200 font-semibold no-underline flex items-center ${isMobile ? 'py-4 text-base border-b border-white/5 last:border-0' : 'text-sm'}`}
    >
      {children}
      {isMobile && <span className="iconify ml-auto text-xl opacity-50" data-icon="solar:alt-arrow-right-linear"></span>}
    </a>
  );
};

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check if we are in a sub-page (inside 'pages/' directory)
  const isSubPage = window.location.pathname.includes('/pages/');
  const prefix = isSubPage ? '../' : './';
  const pagePrefix = isSubPage ? '' : 'pages/';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!isMobile && currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true); // Only hide on desktop when scrolling down
      } else {
        setHidden(false); // Always show on mobile or when scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    // Hide toast if player starts interacting with other menu items that have dropdowns
    if (active !== null && active !== 'Certificaciones') {
      setToastVisible(false);
    }
  }, [active]);

  const handleCertificationsClick = () => {
    setToastVisible(true);
  };

  return (
    <>
      <Toast message="Próximamente disponible" visible={toastVisible} setVisible={setToastVisible} />
      
      {/* Mobile Backdrop Overlay - Closes menu when tapping outside */}
      <AnimatePresence>
        {isMobile && active && active !== 'Certificaciones' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-black/40 z-[9990] backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: hidden ? (isMobile ? 150 : -100) : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed ${isMobile ? 'bottom-0 w-full' : 'top-4 inset-x-0 max-w-2xl mx-auto'} z-[9999] ${className}`}
      >
        <Menu setActive={setActive}>
          <MenuItem 
            setActive={setActive} 
            active={active} 
            item="Explorar" 
            icon="solar:magnifer-linear"
          >
            <div className={`flex flex-col ${isMobile ? 'space-y-0' : 'space-y-4 text-sm px-2'}`}>
              <HoveredLink href={`${prefix}index.html#about`}>Sobre mí</HoveredLink>
              <HoveredLink href={`${prefix}index.html#stack`}>Tecnologías</HoveredLink>
            </div>
          </MenuItem>
          
          <MenuItem 
            setActive={setActive} 
            active={active} 
            item="Proyectos" 
            icon="solar:rocket-2-linear"
          >
            <div className={`text-sm grid ${isMobile ? 'grid-cols-1 max-h-[60vh] overflow-y-auto space-y-4' : 'grid-cols-2 gap-10'} p-4`}>
              <ProductItem
                title="Skill Connect"
                href={`${prefix}${pagePrefix}project-skill-connect.html`}
                src={`${prefix}images/SkillConnect/LandingPage.png`}
                description="Habilidades profesionales."
              />
              <ProductItem
                title="Parque Forestal"
                href={`${prefix}${pagePrefix}project-1.html`}
                src={`${prefix}images/ParquesForestales/landing1.png`}
                description="Gestión natural."
              />
              <ProductItem
                title="Creative Apps"
                href={`${prefix}${pagePrefix}project-2.html`}
                src={`${prefix}images/ProyectosCreativos/parallax1.png`}
                description="Herramientas web."
              />
              <ProductItem
                title="Java System"
                href={`${prefix}${pagePrefix}project-3.html`}
                src={`${prefix}images/InventarioJava/inventarioJava1.png`}
                description="Control de inventario."
              />
            </div>
          </MenuItem>

          <MenuItem 
            setActive={setActive} 
            active={active} 
            item="Certificaciones"
            icon="solar:medal-ribbons-star-linear"
            onClick={handleCertificationsClick}
          >
            {/* Hidden content for now */}
          </MenuItem>

          <MenuItem 
            setActive={setActive} 
            active={active} 
            item="Contacto" 
            icon="solar:chat-round-dots-linear"
          >
            <div className={`flex flex-col ${isMobile ? 'space-y-0' : 'space-y-4 text-sm px-2'}`}>
              <HoveredLink href="https://wa.me/50498892081" target="_blank">WhatsApp</HoveredLink>
              <HoveredLink href="mailto:dilmerkj@gmail.com">Email</HoveredLink>
              <HoveredLink href="https://www.linkedin.com/in/dilmer-nu%C3%B1ez-3a34b2231/" target="_blank">LinkedIn</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </motion.div>
    </>
  );
}

const rootElement = document.getElementById("navbar-root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<Navbar />);
}
