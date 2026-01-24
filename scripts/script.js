// Utilidades
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

// 1) Loader
window.addEventListener('load', () => {
	const loader = qs('.loader');
	if (!loader) return;
	setTimeout(() => loader.classList.add('hidden'), 450);
});

// 2) Año dinámico
(() => { const y = qs('#year'); if (y) y.textContent = new Date().getFullYear(); })();

// Compensar nav fija: define --nav-h dinámicamente
(() => {
	const nav = qs('.nav');
	if (!nav) return;
	const setH = () => {
		const h = nav.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--nav-h', `${h}px`);
	};
	window.addEventListener('load', setH);
	window.addEventListener('resize', setH);
	setH();
})();

// 3) Parallax en layers del héroe (intensificado)
(() => {
	const layers = qsa('.layer');
	if (!layers.length) return;
	// Respetar preferencia de reducir movimiento
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Evitar parallax en dispositivos táctiles o pantallas pequeñas (mejora rendimiento móvil)
	const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
	if (isTouch || window.innerWidth <= 700) return;

	let mx = 0, my = 0, tx = 0, ty = 0; // mouse x/y y target suavizado
	const speed = 0.22; // easing más alto => respuesta más rápida
	const multiplier = 2.2; // multiplicador global para aumentar desplazamiento

	const onMove = (e) => {
		const { innerWidth: w, innerHeight: h } = window;
		const x = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) / w - 0.5;
		const y = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) / h - 0.5;
		mx = x; my = y;
	};

	let rafId = null;
	const raf = () => {
		tx += (mx - tx) * speed; ty += (my - ty) * speed;
		layers.forEach(l => {
			const s = parseFloat(l.dataset.speed || '0.05');
			const x = tx * (s * 100) * multiplier;
			const y = ty * (s * 100) * multiplier;
			l.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		});
		rafId = requestAnimationFrame(raf);
	};
	window.addEventListener('mousemove', onMove, { passive: true });
	// no bind touchmove to avoid expensive touch listeners on mobile
	rafId = requestAnimationFrame(raf);

	// Pause RAF when page hidden to reduce CPU
	document.addEventListener('visibilitychange', () => {
		if (document.hidden && rafId) { cancelAnimationFrame(rafId); rafId = null; }
		else if (!document.hidden && !rafId) rafId = requestAnimationFrame(raf);
	});
})();

// 3b) Toggle menú móvil
(() => {
	const toggle = qs('.nav__toggle');
	const menu = qs('#primary-menu');
	if (!toggle || !menu) return;
	const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
	const open = () => { menu.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); };
	toggle.addEventListener('click', () => {
		const isOpen = menu.classList.contains('is-open');
		isOpen ? close() : open();
	});
	menu.addEventListener('click', (e) => {
		if (e.target.matches('a')) close();
	});
	window.addEventListener('resize', () => { if (window.innerWidth > 860) close(); });
})();

// 4) Scroll reveal con IntersectionObserver
(() => {
	const els = qsa('[data-reveal]');
	if (!els.length || !('IntersectionObserver' in window)) {
		els.forEach(el => el.classList.add('is-visible'));
		return;
	}
	const io = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.2 });
	els.forEach(el => io.observe(el));
})();

// 5) Tilt suave en tarjetas (más marcado)
(() => {
	const cards = qsa('.card');
	if (!cards.length) return;
	const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
	if (isTouch || window.innerWidth <= 700) return; // disable tilt on touch / small screens
	const maxTilt = 18; // grados — aumentado para efecto más visible
	cards.forEach(card => {
		let rAF = null;
		let px = 0, py = 0, tx = 0, ty = 0;
		const ease = 0.15;

		const onMove = (e) => {
			const rect = card.getBoundingClientRect();
			const cx = (e.clientX - rect.left) / rect.width; // 0..1
			const cy = (e.clientY - rect.top) / rect.height; // 0..1
			const rx = (cy - 0.5) * -2 * maxTilt;
			const ry = (cx - 0.5) * 2 * maxTilt;
			px = rx; py = ry;
			if (!rAF) animate();
		};

		const animate = () => {
			tx += (px - tx) * ease; ty += (py - ty) * ease;
			card.style.transform = `perspective(800px) rotateX(${tx}deg) rotateY(${ty}deg)`;
			if (Math.abs(tx - px) > 0.01 || Math.abs(ty - py) > 0.01) {
				rAF = requestAnimationFrame(animate);
			} else {
				rAF = null;
			}
		};

		const reset = () => {
			px = py = tx = ty = 0;
			card.style.transform = 'perspective(800px)';
		};

		card.addEventListener('mousemove', onMove);
		card.addEventListener('mouseleave', reset);
		card.addEventListener('focus', () => { card.style.transform = 'perspective(800px) scale(1.01)'; });
		card.addEventListener('blur', reset);
	});
})();

// 6) Botón "magnético" (más fuerte)
(() => {
	const mags = qsa('.btn--magnetic');
	if (!mags.length) return;
	const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
	if (isTouch || window.innerWidth <= 700) return; // disable magnetic behavior on touch / small screens
	const strength = 34; // aumentado
	mags.forEach(btn => {
		let px = 0, py = 0, tx = 0, ty = 0, rAF = null;
		const ease = 0.22;

		const onMove = (e) => {
			const rect = btn.getBoundingClientRect();
			const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
			const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
			px = x * strength; py = y * strength;
			if (!rAF) animate();
		};
		const animate = () => {
			tx += (px - tx) * ease; ty += (py - ty) * ease;
			btn.style.transform = `translate(${tx}px, ${ty}px)`;
			if (Math.abs(tx - px) > 0.1 || Math.abs(ty - py) > 0.1) rAF = requestAnimationFrame(animate); else rAF = null;
		};
		const reset = () => {
			px = py = tx = ty = 0; btn.style.transform = 'translate(0,0)';
		};
		btn.addEventListener('mousemove', onMove);
		btn.addEventListener('mouseleave', reset);
	});
})();

// 7) Accesibilidad: cerrar foco fantasma en click
(() => {
	function handleMouseDown() { document.body.classList.add('using-mouse'); }
	function handleKeyDown(e) { if (e.key === 'Tab') document.body.classList.remove('using-mouse'); }
	window.addEventListener('mousedown', handleMouseDown);
	window.addEventListener('keydown', handleKeyDown);
})();

// 8) Hacer tarjetas clicables (reemplaza stretched-link para mayor compatibilidad)
(() => {
	const cards = qsa('.card');
	cards.forEach(card => {
		const link = card.querySelector('a.btn--primary');
		if (!link) return;
		card.style.cursor = 'pointer';
		card.addEventListener('click', (e) => {
			// Si el clic no fue directamente en un botón o link interno, activar el link principal
			if (!e.target.closest('a') && !e.target.closest('button')) {
				link.click();
			}
		});
	});
})();


// 9) Link Preview (Floating image on hover)
(() => {
    const cards = qsa('.card[data-preview]');
    if (!cards.length) return;

    // Create the preview element
    const preview = document.createElement('div');
    preview.className = 'link-preview';
    preview.style.cssText = `
        position: fixed;
        width: 280px;
        height: 160px;
        pointer-events: none;
        z-index: 10000;
        opacity: 0;
        transform: scale(0.8) translate(-50%, -110%);
        transition: opacity 0.3s ease, transform 0.3s ease;
        border-radius: 16px;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        background: #0f1117;
    `;
    const img = document.createElement('img');
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    preview.appendChild(img);
    document.body.appendChild(preview);

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const previewSrc = card.dataset.preview;
            if (previewSrc) {
                img.src = previewSrc;
                preview.style.opacity = '1';
                preview.style.transform = 'scale(1) translate(-50%, -110%)';
            }
        });

        card.addEventListener('mousemove', (e) => {
            preview.style.left = `${e.clientX}px`;
            preview.style.top = `${e.clientY}px`;
        });

        card.addEventListener('mouseleave', () => {
            preview.style.opacity = '0';
            preview.style.transform = 'scale(0.8) translate(-50%, -110%)';
        });
    });
})();


// 10) Hide mobile nav on scroll down, show on up
(() => {
	const nav = qs('.nav');
	if (!nav) return;
	let lastY = window.scrollY;
	window.addEventListener('scroll', () => {
		const currY = window.scrollY;
		if (currY > lastY && currY > 80) {
			nav.classList.add('nav--hidden');
		} else {
			nav.classList.remove('nav--hidden');
		}
		lastY = currY;
	}, { passive: true });
})();


// Geolocalización eliminada por petición del usuario
