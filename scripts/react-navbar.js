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
          className="fixed bottom-10 z-[10000] px-6 py-3 rounded-full bg-white text-black font-bold shadow-2xl flex items-center space-x-2 whitespace-nowrap"
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
  return (
    <div 
      onMouseEnter={() => setActive(item)} 
      onClick={onClick}
      className="relative "
    >
      <motion.div
        transition={{ duration: 0.3 }}
        className={`cursor-pointer text-[#e7e9ee] hover:text-white transition-colors flex flex-col items-center justify-center 
          ${isMobile ? 'px-4 py-1' : 'px-4 py-0.5'}`}
      >
        {isMobile ? (
          <>
            <span className="iconify text-xl" data-icon={icon}></span>
            <span className="text-[10px] mt-0.5 font-medium opacity-80">
              {item === 'Certificaciones' ? 'Diplomas' : item}
            </span>
          </>
        ) : (
          <p className="text-base font-medium whitespace-nowrap">{item}</p>
        )}
      </motion.div>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: isMobile ? -10 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div className={`absolute ${isMobile ? 'bottom-[calc(100%_+_0.2rem)]' : 'top-[calc(100%_+_0.2rem)]'} left-1/2 transform -translate-x-1/2 ${isMobile ? 'pb-4' : 'pt-4'}`}>
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-[#0f1117] backdrop-blur-md rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl"
              >
                <motion.div layout className={`w-max h-full ${isMobile ? 'p-2' : 'p-4'}`}>
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const Menu = ({ setActive, children }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={`relative border-white/[0.1] bg-[#0b0b10]/95 backdrop-blur-md shadow-xl flex justify-around md:justify-center 
        ${isMobile 
          ? 'w-full rounded-t-[2rem] border-t px-2 pb-8 pt-3 space-x-0' 
          : 'rounded-full border px-6 py-0.5 space-x-4'}`}
    >
      {children}
    </nav>
  );
};

const ProductItem = ({ title, description, href, src }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <a href={href} className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-4'} group/product no-underline text-inherit`}>
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl group-hover/product:scale-105 transition-transform duration-200 w-full md:w-[140px]"
      />
      <div>
        <h4 className="text-lg md:text-xl font-bold mb-1 text-white no-underline">
          {title}
        </h4>
        <p className="text-[#aab0bd] text-xs md:text-sm max-w-[10rem] no-underline">
          {description}
        </p>
      </div>
    </a>
  );
};

const HoveredLink = ({ children, ...rest }) => {
  return (
    <a
      {...rest}
      className="text-[#aab0bd] hover:text-white transition-colors duration-200 font-medium no-underline"
    >
      {children}
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
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true); // Scrolling down
      } else {
        setHidden(false); // Scrolling up
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

  const handleCertificationsClick = () => {
    setToastVisible(true);
  };

  return (
    <>
      <Toast message="Próximamente disponible" visible={toastVisible} setVisible={setToastVisible} />
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
            <div className="flex flex-col space-y-4 text-sm px-2">
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
            <div className={`text-sm grid ${isMobile ? 'grid-cols-1 max-h-[60vh] overflow-y-auto' : 'grid-cols-2'} gap-6 md:gap-10 p-4`}>
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
            <div className="flex flex-col space-y-4 text-sm px-2">
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
