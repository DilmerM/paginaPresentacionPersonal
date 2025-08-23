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

// 3) Parallax en layers del héroe
(() => {
	const layers = qsa('.layer');
	if (!layers.length) return;
	let mx = 0, my = 0, tx = 0, ty = 0; // mouse x/y y target suavizado
	const speed = 0.08; // easing

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
			const x = tx * (s * 100);
			const y = ty * (s * 100);
			l.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		});
		requestAnimationFrame(raf);
	};
	window.addEventListener('mousemove', onMove, { passive: true });
	window.addEventListener('touchmove', onMove, { passive: true });
	requestAnimationFrame(raf);
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

// 5) Tilt suave en tarjetas
(() => {
	const cards = qsa('.card');
	const maxTilt = 10; // grados
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

// 6) Botón "magnético"
(() => {
	const mags = qsa('.btn--magnetic');
	const strength = 18;
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

