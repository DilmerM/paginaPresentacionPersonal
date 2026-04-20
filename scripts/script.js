// Utilidades
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

// 1) Loader & Return To Section Logic
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto'; // Let the browser handle back/forward scroll natively
}

window.addEventListener('load', () => {
    const loader = qs('.loader');

    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        document.documentElement.classList.remove('is-loading');

        requestAnimationFrame(() => {
            const targetSection = sessionStorage.getItem('returnToSection');
            if (targetSection) {
                sessionStorage.removeItem('returnToSection');
                const targetEl = document.querySelector(targetSection);
                if (targetEl) {
                    const offset = 80;
                    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'instant' });
                }
            }
        });
    }, 450);
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
	let rafId = null;
    let isMoving = false;

	const raf = () => {
        // Detener animación si el movimiento ya se estabilizó
        if (Math.abs(mx - tx) < 0.001 && Math.abs(my - ty) < 0.001) {
            tx = mx; ty = my;
            isMoving = false;
            return;
        }
		tx += (mx - tx) * speed; ty += (my - ty) * speed;
		layers.forEach(l => {
			const s = parseFloat(l.dataset.speed || '0.05');
			const x = tx * (s * 100) * multiplier;
			const y = ty * (s * 100) * multiplier;
			l.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		});
		rafId = requestAnimationFrame(raf);
	};

	const onMove = (e) => {
		const { innerWidth: w, innerHeight: h } = window;
		const x = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) / w - 0.5;
		const y = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) / h - 0.5;
		mx = x; my = y;
        
        if (!isMoving) {
            isMoving = true;
            rafId = requestAnimationFrame(raf);
        }
	};

	window.addEventListener('mousemove', onMove, { passive: true });

	// Pause RAF when page hidden to reduce CPU
	document.addEventListener('visibilitychange', () => {
		if (document.hidden && rafId) { cancelAnimationFrame(rafId); rafId = null; isMoving = false; }
		else if (!document.hidden && !isMoving) { isMoving = true; rafId = requestAnimationFrame(raf); }
	});
})();

// 4) Protección de proyectos por contraseña
(() => {
	const PROJECT_PASS = '@@@@';

	function showProjectAuthModal(onSuccess) {
		if (document.getElementById('project-auth-modal')) return;

		const modal = document.createElement('div');
		modal.id = 'project-auth-modal';
		modal.className = 'cert-modal';
		modal.innerHTML = `
			<div class="cert-modal__backdrop"></div>
			<div class="cert-modal__dialog" style="max-width: 400px; border-radius: 12px;">
				<button class="cert-modal__close" aria-label="Cerrar">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				</button>
				<div class="cert-modal__header" style="margin-bottom: 20px;">
					<h3 style="margin-bottom: 8px;">Proyecto Protegido</h3>
					<p>Debe ingresar una contraseña proporcionada por el desarrollador:</p>
				</div>
				<form id="project-auth-form" class="cert-modal__form">
					<div class="cert-form__group">
						<input type="password" id="project-pass-input" class="cert-form__input" placeholder="••••••••" required autofocus />
					</div>
					<p id="project-auth-error" style="color: #ef4444; font-size: 0.8rem; margin-top: 8px; display: none; text-align: center;">Contraseña incorrecta</p>
					<div class="cert-form__actions" style="margin-top: 24px;">
						<button type="submit" class="btn btn--primary" style="width: 100%;">Acceder al proyecto</button>
					</div>
				</form>
			</div>
		`;

		document.body.appendChild(modal);
		requestAnimationFrame(() => modal.classList.add('is-open'));

		const input = modal.querySelector('#project-pass-input');
		const errorMsg = modal.querySelector('#project-auth-error');
		
		const closeModal = () => {
			modal.classList.remove('is-open');
			setTimeout(() => modal.remove(), 350);
		};

		modal.querySelector('.cert-modal__close').addEventListener('click', closeModal);
		modal.querySelector('.cert-modal__backdrop').addEventListener('click', closeModal);

		modal.querySelector('#project-auth-form').addEventListener('submit', (e) => {
			e.preventDefault();
			if (input.value === PROJECT_PASS) {
				sessionStorage.setItem('project_auth', 'true');
				closeModal();
				onSuccess();
			} else {
				errorMsg.style.display = 'block';
				input.value = '';
				input.focus();
				// Shake effect
				const dialog = modal.querySelector('.cert-modal__dialog');
				dialog.style.animation = 'cert-shake 0.4s ease';
				setTimeout(() => dialog.style.animation = '', 400);
			}
		});

		setTimeout(() => input.focus(), 400);
	}
	
	// Interceptar clicks en enlaces de proyectos
	document.addEventListener('click', (e) => {
		const projectLink = e.target.closest('a[href*="project-"]');
		if (projectLink) {
			if (sessionStorage.getItem('project_auth') === 'true') return;

			e.preventDefault();
			showProjectAuthModal(() => {
				window.location.href = projectLink.href;
			});
		}
	});

	// Manejo de grupos de tecnologías (Details/Summary)
	const techDetails = qsa('.tech-group-details');
	const updateTechGroups = () => {
		const isDesktop = window.innerWidth > 768;
		techDetails.forEach(d => {
			if (isDesktop) {
				d.open = true;
			}
		});
	};

	window.addEventListener('resize', updateTechGroups);
	updateTechGroups();
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

    // Disabilitar en móviles/táctiles
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
    if (isTouch || window.innerWidth <= 700) return;

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


// 12) Auto-carousel para proyectos en móvil
(() => {
    const grids = qsa('#projects .grid');
    if (!grids.length) return;

    const duration = 3500;

    grids.forEach(grid => {
        let interval = null;

        const startAutoScroll = () => {
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                // Solo actuar si estamos en el ancho de móvil definido en CSS (<= 768px)
                if (window.innerWidth > 768) return; 

                const cards = qsa('.card', grid);
                if (!cards.length) return;

                const cardWidth = cards[0].offsetWidth + 24; // ancho tarjeta + gap (1.5rem aprox 24px)
                const maxScroll = grid.scrollWidth - grid.clientWidth;

                if (grid.scrollLeft >= maxScroll - 50) {
                    // Volver al inicio si llegamos al final
                    grid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Avanzar una tarjeta
                    grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, duration);
        };

        // Pausar el auto-scroll cuando el usuario toca el carrusel manualmente
        grid.addEventListener('touchstart', () => {
            if (interval) clearInterval(interval);
        }, { passive: true });

        // Reanudar después de que el usuario deja de tocar
        grid.addEventListener('touchend', () => {
            startAutoScroll();
        }, { passive: true });

        // Iniciar el ciclo
        startAutoScroll();
    });
})();

// 13) Manejo de tecnologías en móvil (expandir info al tocar)
(() => {
    const techCards = qsa('.tech');
    if (!techCards.length) return;

    techCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 700) {
                // Cerrar otros expandidos para que solo uno esté abierto a la vez
                techCards.forEach(c => {
                    if (c !== card) c.classList.remove('is-expanded');
                });
                // Alternar el estado de la tarjeta actual
                card.classList.toggle('is-expanded');
            }
        });
    });

    // Cerrar al tocar fuera de las tarjetas
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.tech') && window.innerWidth <= 700) {
            techCards.forEach(c => c.classList.remove('is-expanded'));
        }
    });
})();

