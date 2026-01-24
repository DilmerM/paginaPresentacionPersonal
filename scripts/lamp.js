const { motion } = window.Motion;

const LampContainer = ({ children, className }) => {
  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b0b10] w-full z-0 ${className}`}
    >
      <div className="relative flex w-full flex-1 md:scale-y-125 items-start justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "15rem" }}
          className="md:hidden absolute inset-auto right-1/2 h-56 w-[15rem] bg-gradient-conic from-primary via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
        >
            <div className="absolute w-[100%] left-0 bg-[#0b0b10] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="hidden md:block absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-primary via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-[#0b0b10] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-[#0b0b10]  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "15rem" }}
          className="md:hidden absolute inset-auto left-1/2 h-56 w-[15rem] bg-gradient-conic from-transparent via-transparent to-primary text-white [--conic-position:from_290deg_at_center_top]"
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
        >
            <div className="absolute w-[100%] right-0 bg-[#0b0b10] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="hidden md:block absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-[#0b0b10]  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-[#0b0b10] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <div className="absolute top-1/2 h-48 w-full translate-y-12 bg-[#0b0b10] blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-primary opacity-50 blur-[80px] hidden md:block"></div>
        
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-primary-2 blur-2xl md:block"
        ></motion.div>
        
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-primary-2 hidden md:block"
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#0b0b10] "></div>
      </div>

      <div className="relative z-50 flex -translate-y-44 md:-translate-y-40 flex-col items-center px-5">
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
    return (
        <LampContainer>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="flex flex-col items-center w-full max-w-4xl"
            >
                <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-[#aab0bd] mb-4">Desarrollador Back-End</p>
                <h1 className="text-center text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 leading-tight">
                    Desarrollador de estructuras de sistemas: <br className="hidden md:block"/>
                    <span className="bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] bg-clip-text text-transparent">
                        backend en proceso
                    </span>
                </h1>
                <p className="max-w-xl text-center text-[#aab0bd] text-base md:text-lg mb-10 px-6">
                    Me apasiona el desarrollo back‑end y diseñar bases de datos eficientes; también disfruto del
                    front‑end creando interfaces.
                </p>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-6 md:px-0">
                    <a href="#projects" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] text-[#05060a] font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/25 text-center">
                        Ver proyectos
                    </a>
                    <a href="#about" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-center">
                        Conocer más
                    </a>
                </div>
            </motion.div>
        </LampContainer>
    );
}

const domContainer = document.getElementById("lamp-root");
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(<HeroLamp />);
}
