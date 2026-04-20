const { useState } = React;
const { motion, AnimatePresence } = window.Motion;

const AboutSlider = () => {
    const [isLeft, setIsLeft] = useState(true);
    const toggleSide = () => setIsLeft(!isLeft);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative z-10 w-full max-w-5xl mx-auto md:mt-12 md:mb-20"
        >
            {/* ── MOBILE LAYOUT ─────────────────────────────────────── */}
            <div className="flex md:hidden flex-col items-center gap-6 px-4">

                {/* Foto de perfil tipo tarjeta */}
                <div
                    onClick={toggleSide}
                    className="relative w-full h-96 rounded-3xl overflow-hidden cursor-pointer shadow-xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLeft ? 'img2' : 'img3'}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-cover bg-center bg-top"
                            style={{ backgroundImage: `url(${isLeft ? './images/IMG2.png' : './images/IMG3.jpg'})` }}
                        />
                    </AnimatePresence>
                    {/* Hint de tap */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
                            <span className="iconify text-sm" data-icon="solar:alt-arrow-right-linear"></span>
                            Toca para cambiar
                        </span>
                    </div>
                </div>

                {/* Contenido de texto móvil */}
                <AnimatePresence mode="wait">
                    {isLeft ? (
                        <motion.div
                            key="about-mobile"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-[#161624] mb-3 leading-tight">
                                Mucho gusto,<br/><span className="text-[#ff5e00]">soy Dilmer Moreira</span>
                            </h2>
                            <p className="text-[#64748b] text-sm leading-relaxed mb-3">
                                Soy estudiante de Informática Administrativa, dedicado a aprender por curiosidad y diversión.
                            </p>
                            <p className="text-[#64748b] text-sm leading-relaxed">
                                Disfruto resolver problemas y ayudar a las personas, implementar tecnologías nuevas para seguir creciendo.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="vision-mobile"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-[#161624] mb-4">Frase Favorita</h2>
                            <blockquote className="text-[#4b5563] text-sm italic leading-relaxed mb-3">
                                "Si tus acciones inspiran a otros a soñar más, aprender más, hacer más y ser más, eres un líder."
                            </blockquote>
                            <figcaption className="text-[10px] uppercase tracking-widest font-bold text-[#94a3b8]">— John Quincy Adams</figcaption>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── DESKTOP LAYOUT ────────────────────────────────────── */}
            <div className="hidden md:flex relative rounded-3xl overflow-hidden h-[600px] shadow-none border-none bg-transparent">
                
                {/* Left Content Side: About Me */}
                <div className={`w-1/2 p-14 flex flex-col justify-center transition-all duration-700 h-full bg-transparent z-10 ${!isLeft ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
                    <h2 className="text-4xl font-bold text-[#161624] mb-6 leading-tight">Mucho gusto,<br/><span className="text-[#ff5e00]">soy Dilmer Moreira</span></h2>
                    <p className="text-[#64748b] text-base leading-relaxed mb-4 font-medium">
                        Soy estudiante de Informática Administrativa, dedicado a aprender por curiosidad y diversión. Me gusta explorar conocimientos diversos y, sobre todo, entender cómo funcionan los sistemas.
                    </p>
                    <p className="text-[#64748b] text-base leading-relaxed">
                        Disfruto resolver problemas y ayudar a las personas, buscar mejoras continuas e implementar tecnologías nuevas o desconocidas para seguir creciendo profesional y personalmente.
                    </p>
                </div>

                {/* Right Content Side: Quote / Vision */}
                <div className={`w-1/2 p-14 flex flex-col justify-center transition-all duration-700 h-full bg-transparent z-10 ${isLeft ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
                    <h2 className="text-4xl font-bold text-[#161624] mb-6">Frase Favorita</h2>
                    <figure className="relative bg-transparent p-8 rounded-3xl border-none mt-2">
                        <span className="iconify absolute -top-5 -left-3 text-5xl text-[#ff5e00] opacity-30" data-icon="bx:bxs-quote-alt-left"></span>
                        <blockquote className="text-[#4b5563] font-medium italic text-lg leading-relaxed mb-6 relative z-10">
                            "Si tus acciones inspiran a otros a soñar más, aprender más, hacer más y ser más, eres un líder."
                        </blockquote>
                        <figcaption className="text-right text-xs uppercase tracking-widest font-bold text-[#94a3b8]">
                            — John Quincy Adams
                        </figcaption>
                    </figure>
                </div>

                {/* The Sliding Overlay Panel (Image) */}
                <motion.div
                    initial={false}
                    animate={{ x: isLeft ? '100%' : '0%' }}
                    transition={{ type: "spring", damping: 35, stiffness: 150 }}
                    className="absolute inset-y-0 left-0 w-1/2 z-30 overflow-hidden shadow-none rounded-3xl bg-[#0f172a]"
                >
                    <motion.div
                        initial={false}
                        animate={{ x: isLeft ? '-50%' : '0%' }}
                        transition={{ type: "spring", damping: 35, stiffness: 150 }}
                        className="absolute inset-y-0 w-[200%] flex"
                    >
                        {/* Slide A — IMG3.jpg (primera, visible al inicio) */}
                        <div onClick={toggleSide} className="w-1/2 h-full relative overflow-hidden pointer-events-auto flex items-center justify-center bg-[#070b14] cursor-pointer">
                           <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('./images/IMG3.jpg')" }}></div>
                           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>
                           <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-10 text-white z-10 w-full">
                                <h3 className="text-3xl font-bold mb-4 drop-shadow-md">Conóceme más</h3>
                                <div className="w-full text-center px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    <span>Ver Visión y Frase</span>
                                    <span className="iconify text-base" data-icon="solar:alt-arrow-right-linear"></span>
                                </div>
                           </div>
                        </div>

                        {/* Slide B — IMG2.png (segunda, aparece al hacer clic) */}
                        <div onClick={toggleSide} className="w-1/2 h-full relative overflow-hidden pointer-events-auto flex items-center justify-center bg-[#070b14] cursor-pointer">
                           <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('./images/IMG2.png')" }}></div>
                           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>
                           <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-10 text-white z-10 w-full">
                                <h3 className="text-3xl font-bold mb-4 drop-shadow-md">Regresar</h3>
                                <div className="w-full text-center px-8 py-3 bg-[#ff5e00]/80 backdrop-blur-sm border border-[#ff5e00] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    <span className="iconify text-base" data-icon="solar:alt-arrow-left-linear"></span>
                                    <span>Ver Sobre Mí</span>
                                </div>
                           </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const aboutContainer = document.getElementById("about-slider-root");
if (aboutContainer) {
    const aboutRoot = ReactDOM.createRoot(aboutContainer);
    aboutRoot.render(<AboutSlider />);
}
