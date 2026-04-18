const { useState, useRef, useMemo } = React;
const { motion, useMotionValue, useSpring, useTransform, AnimatePresence } = window.Motion;

const FloatingDock = ({ items, desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({ items, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative block md:hidden ${className}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  className="h-10 w-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-neutral-800 shadow-lg"
                >
                  <div className="h-4 w-4">{React.cloneElement(item.icon, { style: { width: '100%', height: '100%', color: 'inherit' } })}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-lg"
      >
          <span className="iconify" data-icon="mdi:dots-vertical" style={{fontSize: '20px', color: '#161624'}}></span>
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`mx-auto hidden md:flex h-16 gap-4 items-end rounded-2xl bg-white/40 backdrop-blur-md border border-black/5 px-4 pb-3 shadow-xl ${className}`}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({ mouseX, title, icon, href }) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthIconTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightIconTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthIconTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightIconTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-white/80 border border-black/5 flex items-center justify-center relative shadow-sm"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-white border border-black/10 text-neutral-800 font-medium absolute left-1/2 -top-8 w-fit text-xs shadow-md"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-[#161624]"
        >
          {React.cloneElement(icon, { style: { width: '100%', height: '100%', color: 'inherit' } })}
        </motion.div>
      </motion.div>
    </a>
  );
}

// Initialize
const DockRoot = () => {
    const links = [
        {
            title: "Email",
            icon: <span className="iconify" data-icon="mdi:email-outline" style={{width: '100%', height: '100%'}}></span>,
            href: "mailto:dilmerkj@gmail.com",
        },
        {
            title: "WhatsApp",
            icon: <span className="iconify" data-icon="mdi:whatsapp" style={{width: '100%', height: '100%'}}></span>,
            href: "https://wa.me/50498892081",
        },
        {
            title: "GitHub",
            icon: <span className="iconify" data-icon="mdi:github" style={{width: '100%', height: '100%'}}></span>,
            href: "https://github.com/DilmerM",
        },
        {
            title: "X",
            icon: <span className="iconify" data-icon="simple-icons:x" style={{width: '100%', height: '100%'}}></span>,
            href: "https://x.com/DILMERNUEZ3",
        },
        {
            title: "Instagram",
            icon: <span className="iconify" data-icon="mdi:instagram" style={{width: '100%', height: '100%'}}></span>,
            href: "https://www.instagram.com/dilmer.moreira/",
        },
        {
            title: "LinkedIn",
            icon: <span className="iconify" data-icon="mdi:linkedin" style={{width: '100%', height: '100%'}}></span>,
            href: "https://www.linkedin.com/in/dilmer-nu%C3%B1ez-3a34b2231/",
        },
        {
            title: "Certificados",
            icon: <span className="iconify" data-icon="solar:medal-ribbons-star-linear" style={{width: '100%', height: '100%'}}></span>,
            href: "#certificates",
        }
    ];

    return (
        <div className="flex items-center justify-center w-full">
            <FloatingDock items={links} />
        </div>
    );
};

const domContainer = document.getElementById("floating-dock-root");
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(<DockRoot />);
}
