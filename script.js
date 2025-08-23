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
	let mx = 0, my = 0, tx = 0, ty = 0; // mouse x/y y target suavizado
	const speed = 0.22; // easing más alto => respuesta más rápida
	const multiplier = 2.2; // multiplicador global para aumentar desplazamiento

	const onMove = (e) => {
		const { innerWidth: w, innerHeight: h } = window;
		const x = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) / w - 0.5;
		const y = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) / h - 0.5;
		mx = x; my = y;
	};

	const raf = () => {
		tx += (mx - tx) * speed; ty += (my - ty) * speed;
		layers.forEach(l => {
			const s = parseFloat(l.dataset.speed || '0.05');
			const x = tx * (s * 100) * multiplier;
			const y = ty * (s * 100) * multiplier;
			l.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		});
		requestAnimationFrame(raf);
	};
	window.addEventListener('mousemove', onMove, { passive: true });
	window.addEventListener('touchmove', onMove, { passive: true });
	requestAnimationFrame(raf);
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

// 8) Reproductor: autoplay + mini-player en popover
(() => {
	const audio = qs('#site-audio');
	const discBtn = qs('#player-disc');
	const popover = qs('#player-popover');
	if (!audio || !discBtn || !popover) return;

	const playBtn = qs('[data-action="play"]', popover);
	const closeBtn = qs('.player-card__close', popover);
	const bar = qs('.player-card__bar', popover);

	let isOpen = false;
		let fadedIn = false;

	// Iniciar música al entrar (con fallback por políticas de autoplay)
		const tryAutoplay = async () => {
			try {
				audio.muted = false;
				await audio.play();
				updatePlayIcon();
			} catch {
				// Si falla, reproducir en mute (esto suele permitirse) y luego fade-in en primer gesto
				try {
					audio.muted = true;
					await audio.play();
					updatePlayIcon();
				} catch {}
			}
		};
		window.addEventListener('load', () => {
			// intentar de inmediato y reintentar tras un breve delay
			tryAutoplay();
			setTimeout(tryAutoplay, 800);
		});

	// Posicionar popover cerca del botón
		const placePopover = () => {
			const r = discBtn.getBoundingClientRect();
			const top = window.scrollY + r.bottom + 8; // debajo del disco
			const left = window.scrollX + r.left - 140; // alineado a la izquierda del disco
			popover.style.top = `${top}px`;
			popover.style.left = `${Math.max(12, left)}px`;
		};

	const open = () => {
		popover.hidden = false;
		discBtn.setAttribute('aria-expanded', 'true');
		isOpen = true; placePopover();
	};
	const close = () => {
		popover.hidden = true;
		discBtn.setAttribute('aria-expanded', 'false');
		isOpen = false;
	};

	// Toggle al pulsar el disco
		discBtn.addEventListener('click', async () => {
			if (audio.paused) { try { await audio.play(); } catch {} }
			isOpen ? close() : open();
		});
	closeBtn.addEventListener('click', close);
	window.addEventListener('resize', () => { if (isOpen) placePopover(); });
	window.addEventListener('scroll', () => { if (isOpen) placePopover(); }, { passive: true });

	// Play/Pause
	function updatePlayIcon() { playBtn.textContent = audio.paused ? '▶' : '⏸'; }
	playBtn.addEventListener('click', async () => {
		try {
		if (audio.paused) { await audio.play(); } else { audio.pause(); }
			updatePlayIcon();
		} catch {}
	});
	audio.addEventListener('play', updatePlayIcon);
	audio.addEventListener('pause', updatePlayIcon);

	// Progreso
	audio.addEventListener('timeupdate', () => {
		if (!audio.duration) return;
		const p = (audio.currentTime / audio.duration) * 100;
		bar.style.width = `${p}%`;
	});

		// En el primer gesto del usuario, si está muted por fallback, hacemos fade-in
		const onFirstInteract = () => {
			if (!fadedIn && audio && !audio.paused && audio.muted) {
				audio.volume = 0;
				audio.muted = false;
				let v = 0;
				const step = () => {
					v = Math.min(1, v + 0.1);
					audio.volume = v;
					if (v < 1) requestAnimationFrame(step); else fadedIn = true;
				};
				requestAnimationFrame(step);
			}
			window.removeEventListener('click', onFirstInteract);
			window.removeEventListener('keydown', onFirstInteract);
		};
		window.addEventListener('click', onFirstInteract, { once: false });
		window.addEventListener('keydown', onFirstInteract, { once: false });

		// Cerrar popover al hacer clic fuera o presionar Escape
		document.addEventListener('click', (e) => {
			if (!isOpen) return;
			const t = e.target;
			if (t === popover || popover.contains(t) || t === discBtn || discBtn.contains(t)) return;
			close();
		});
		window.addEventListener('keydown', (e) => { if (isOpen && e.key === 'Escape') close(); });
})();

	// 9) Hint del disco (mostrar solo 1 vez)
	(() => {
		const disc = qs('#player-disc');
		const hint = qs('#disc-hint');
		if (!disc || !hint) return;
		const KEY = 'disc-hint-shown';
		const place = () => {
			const r = disc.getBoundingClientRect();
			const top = window.scrollY + r.bottom + 10; // debajo del disco
			const left = window.scrollX + r.left + r.width/2 + 12; // a la derecha del disco
			hint.style.top = `${top}px`;
			hint.style.left = `${left}px`;
			const arrow = qs('.disc-hint__arrow', hint);
			if (arrow) {
				arrow.style.top = `-6px`;
				arrow.style.left = `-6px`;
			}
		};
		const show = () => { hint.hidden = false; place(); };
		const hide = () => { hint.hidden = true; localStorage.setItem(KEY, '1'); };
		const onClose = () => hide();

		if (!localStorage.getItem(KEY)) {
			window.addEventListener('load', () => setTimeout(show, 900));
		}
		window.addEventListener('resize', () => { if (!hint.hidden) place(); });
		window.addEventListener('scroll', () => { if (!hint.hidden) place(); }, { passive: true });
		hint.addEventListener('click', (e) => { if (e.target.closest('.disc-hint__close')) onClose(); });
		disc.addEventListener('click', hide);
	})();

