const { motion } = window.Motion;

const LampContainer = ({ children, className }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent w-full z-0 ${className}`}
    >
      <div className="relative flex w-full flex-1 md:scale-y-125 items-start justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0, width: "8rem" }}
          whileInView={{ opacity: 1, width: "15rem" }}
          className="md:hidden absolute inset-auto right-1/2 h-56 w-[15rem] bg-gradient-conic from-[#ffd700] via-transparent to-transparent text-[#161624] [--conic-position:from_70deg_at_center_top] transform-gpu backface-hidden [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
        />

        <motion.div
          initial={{ opacity: 0, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="hidden md:block absolute inset-auto right-1/2 h-56 w-[30rem] bg-gradient-conic from-[#ffd700] via-transparent to-transparent text-[#161624] [--conic-position:from_70deg_at_center_top] transform-gpu backface-hidden [mask-image:linear-gradient(to_bottom,white_30%,transparent_100%)]"
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
        />

        <motion.div
          initial={{ opacity: 0, width: "8rem" }}
          whileInView={{ opacity: 1, width: "15rem" }}
          className="md:hidden absolute inset-auto left-1/2 h-56 w-[15rem] bg-gradient-conic from-transparent via-transparent to-[#ffd700] text-[#161624] [--conic-position:from_290deg_at_center_top] transform-gpu backface-hidden [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
        />

        <motion.div
          initial={{ opacity: 0, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="hidden md:block absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#ffd700] text-[#161624] [--conic-position:from_290deg_at_center_top] transform-gpu backface-hidden [mask-image:linear-gradient(to_bottom,white_30%,transparent_100%)]"
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
        />

        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#ffaa00] opacity-20 blur-[80px] hidden md:block transform-gpu backface-hidden"></div>
        
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ width: "16rem", opacity: 0.4 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[#ffdd00] blur-2xl md:block transform-gpu backface-hidden"
        ></motion.div>
        
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-[#ffdd00] hidden md:block"
        ></motion.div>
      </div>


      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-5 w-full">
        {children}
      </div>
    </div>
  );
};

const LampDemo = () => {
    return (
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Build lamps <br /> the right way
          </motion.h1>
        </LampContainer>
    );
}

// In this specific setup, we want to integrate it with the existing Hero content in index.html.
// Instead of just rendering LampDemo, we'll create a component that takes the hero content.

const HeroLamp = () => {
    const [index, setIndex] = React.useState(0);
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % 2);
        }, 5000); // Rota cada 5 segundos
        return () => clearInterval(interval);
    }, []);

    return (
        <LampContainer>
            <AnimatePresence mode="wait">
                {index === 0 ? (
                    <motion.div
                        key="title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center w-full max-w-4xl"
                    >
                        <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-slate-800 font-semibold mb-4 w-full text-center">
                            Especialista en Datos
                        </p>
                        <h1 className="flex flex-col items-center justify-center text-center text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#161624] mb-4 leading-tight w-full">
                            <span>Desarrollador Backend &</span>
                            <span className="bg-gradient-to-r from-[#ff5e00] to-[#e11d48] bg-clip-text text-transparent drop-shadow-sm mt-1 md:mt-2">
                                Analista de Procesos
                            </span>
                        </h1>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-6 md:px-0 mt-6">
                            <a href="#about" className="px-8 py-3 bg-[#161624] text-white rounded-full font-semibold hover:bg-slate-800 transition-colors text-center">Explorar</a>
                            <a href="#contact" className="px-8 py-3 border-2 border-[#161624] text-[#161624] rounded-full font-semibold hover:bg-[#161624] hover:text-white transition-all text-center">Contacto</a>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center w-full max-w-5xl"
                    >
                        <h2 className="flex flex-col items-center justify-center text-center text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 leading-snug px-4 w-full">
                            <span>Especialista en optimizar procesos y resolver problemas complejos mediante tecnología.</span>
                            <span className="text-[#ff5e00] mt-4">
                                Apasionado por el desarrollo backend, el diseño de datos eficientes y la creación de soluciones que impulsan el crecimiento.
                            </span>
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-6 md:px-0 mt-8">
                            <a href="#projects" className="px-8 py-3 bg-[#ff5e00] text-white rounded-full font-semibold hover:shadow-lg transition-all text-center">Ver Proyectos</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LampContainer>
    );
};

const domContainer = document.getElementById("lamp-root");
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(<HeroLamp />);
}


