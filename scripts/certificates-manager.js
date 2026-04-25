/**
 * Certificate Manager – Gestión de certificados personalizados
 * Almacena certificados en localStorage con soporte de imágenes base64.
 * Los certificados se renderizan dinámicamente en la sección #certificates.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_certificates';
  const AUTH_SESSION_KEY = 'cert_manager_auth';
  // SHA-256 hash of the admin password: '@@@@'
  const PASSWORD_HASH = 'e8151b2c92fd188cec72b573a289fefc9d06d3116ba4eb2c8a8719ebf15c1270';

  // ── Hashing utility (SHA-256) ───────────────────────────────
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  }

  function setAuthenticated() {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
  }

  // ── Utilidades ──────────────────────────────────────────────
  function loadCertificates() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCertificates(certs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  }

  function generateId() {
    return 'cert_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  // ── Crear tarjeta HTML para un certificado ──────────────────
  function createCertCard(cert) {
    const article = document.createElement('article');
    article.className = 'cert-card cert-card--custom';
    article.tabIndex = 0;
    article.dataset.certId = cert.id;

    const hasImage = cert.image && cert.image.length > 0;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'cert-card__img-wrap';

    if (hasImage) {
      const img = document.createElement('img');
      img.src = cert.image;
      img.alt = `Certificado ${cert.title}`;
      img.className = 'cert-card__img';
      img.loading = 'lazy';
      imgWrap.appendChild(img);
    } else {
      // Placeholder sin imagen
      const placeholder = document.createElement('div');
      placeholder.className = 'cert-card__placeholder';
      placeholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M12 18v-6"/>
          <path d="M9 15l3-3 3 3"/>
        </svg>
        <span class="cert-card__placeholder-title">${escapeHtml(cert.title)}</span>
        <span class="cert-card__placeholder-label">Imagen pendiente</span>
      `;
      imgWrap.appendChild(placeholder);
    }

    // Overlay con botones
    const overlay = document.createElement('div');
    overlay.className = 'cert-card__overlay';

    if (cert.link) {
      const a = document.createElement('a');
      a.className = 'btn btn--primary';
      a.href = cert.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', `Ver certificado ${cert.title}`);
      a.textContent = 'Ver certificado';
      overlay.appendChild(a);
    }

    if (hasImage) {
      const viewImgBtn = document.createElement('button');
      viewImgBtn.className = 'btn btn--view-img';
      viewImgBtn.type = 'button';
      viewImgBtn.dataset.img = cert.image;
      viewImgBtn.dataset.title = cert.title;
      viewImgBtn.textContent = 'Ver en grande';
      overlay.appendChild(viewImgBtn);

      // Botón Descargar (requiere contraseña @@)
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'btn btn--primary btn--download-cert';
      downloadBtn.type = 'button';
      downloadBtn.dataset.img = cert.image;
      downloadBtn.dataset.title = cert.title;
      downloadBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Descargar
      `;
      overlay.appendChild(downloadBtn);
    }

    if (cert.link || hasImage) {
      imgWrap.appendChild(overlay);
    }

    article.appendChild(imgWrap);

    // Body
    const body = document.createElement('div');
    body.className = 'cert-card__body';

    const platform = document.createElement('span');
    platform.className = 'cert-card__platform';
    platform.innerHTML = `
      <span class="iconify" data-icon="${getPlatformIcon(cert.platform)}" aria-hidden="true"></span>
      ${escapeHtml(cert.platform || 'Otro')}
    `;

    const title = document.createElement('h3');
    title.className = 'cert-card__title';
    title.textContent = cert.title;

    // Botón eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'cert-card__delete';
    deleteBtn.setAttribute('aria-label', 'Eliminar certificado');
    deleteBtn.title = 'Eliminar certificado';
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      requireAuth(() => showDeleteConfirm(cert, article));
    });

    body.appendChild(platform);
    body.appendChild(title);
    body.appendChild(deleteBtn);
    article.appendChild(body);

    // Entrada con animación
    requestAnimationFrame(() => {
      article.classList.add('cert-card--enter');
    });

    return article;
  }

  function getPlatformIcon(platform) {
    if (!platform) return 'mdi:certificate';
    const p = platform.toLowerCase();
    if (p.includes('udemy')) return 'simple-icons:udemy';
    if (p.includes('coursera')) return 'simple-icons:coursera';
    if (p.includes('platzi')) return 'simple-icons:platzi';
    if (p.includes('linkedin')) return 'simple-icons:linkedin';
    if (p.includes('google')) return 'simple-icons:google';
    if (p.includes('microsoft')) return 'simple-icons:microsoft';
    if (p.includes('edx') || p.includes('ed x')) return 'simple-icons:edx';
    if (p.includes('amazon') || p.includes('aws')) return 'simple-icons:amazonaws';
    return 'mdi:certificate';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // ── Renderizar certificados desde localStorage ──────────────
  function renderCustomCertificates() {
    const grid = document.querySelector('.cert-grid');
    if (!grid) return;

    // Limpiar certificados custom previos
    grid.querySelectorAll('.cert-card--custom').forEach(el => el.remove());

    const certs = loadCertificates();
    certs.forEach(cert => {
      const card = createCertCard(cert);
      grid.appendChild(card);
    });

    // Re-inicializar iconify para los nuevos iconos
    if (window.Iconify) {
      window.Iconify.scan();
    }
  }

  // ── Confirmación de eliminación ─────────────────────────────
  function showDeleteConfirm(cert, cardEl) {
    // Crear overlay de confirmación
    const overlay = document.createElement('div');
    overlay.className = 'cert-delete-overlay';
    overlay.innerHTML = `
      <div class="cert-delete-dialog">
        <div class="cert-delete-dialog__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h4>¿Eliminar certificado?</h4>
        <p>Se eliminará "<strong>${escapeHtml(cert.title)}</strong>" permanentemente.</p>
        <div class="cert-delete-dialog__actions">
          <button class="btn btn--ghost cert-delete-cancel">Cancelar</button>
          <button class="btn btn--danger cert-delete-confirm">Eliminar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));

    overlay.querySelector('.cert-delete-cancel').addEventListener('click', () => {
      overlay.classList.remove('is-visible');
      setTimeout(() => overlay.remove(), 300);
    });

    overlay.querySelector('.cert-delete-confirm').addEventListener('click', () => {
      // Animar salida de la tarjeta
      cardEl.style.transform = 'scale(0.8)';
      cardEl.style.opacity = '0';
      cardEl.style.transition = 'all 0.4s ease';

      setTimeout(() => {
        // Eliminar del storage
        const certs = loadCertificates().filter(c => c.id !== cert.id);
        saveCertificates(certs);
        cardEl.remove();
      }, 400);

      overlay.classList.remove('is-visible');
      setTimeout(() => overlay.remove(), 300);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('is-visible');
        setTimeout(() => overlay.remove(), 300);
      }
    });
  }

  // ── Crear el botón flotante Centralizado (Desbloquear todo) ─────────────────────────────
  function createFloatingButton() {
    const btn = document.createElement('button');
    btn.id = 'unlock-all-fab';
    btn.className = 'cert-fab';
    btn.setAttribute('aria-label', 'Desbloquear contenido');
    btn.title = 'Desbloquear todo';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    `;
    
    // Al hacer clic, usa el modal global de script.js para desbloquear todo
    btn.addEventListener('click', () => {
      if (window.showProjectAuthModal) {
        window.showProjectAuthModal(() => {
          console.log('Todo el contenido desbloqueado');
        });
      }
    });
    
    document.body.appendChild(btn);

    // Mostrar a partir de la sección de proyectos y mantenerlo visible mientras estemos abajo
    const projectsSection = document.getElementById('projects');
    const contactSection = document.getElementById('contact');

    if (projectsSection) {
      const ioProjects = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Visible si estamos viendo proyectos O si ya los pasamos hacia abajo
          const isAbove = entry.boundingClientRect.top < 0;
          const isVisible = entry.isIntersecting || isAbove;
          
          // Pero ocultar si el contacto ya está en pantalla
          const contactInView = contactSection && contactSection.getBoundingClientRect().top < window.innerHeight;
          
          btn.classList.toggle('is-visible', isVisible && !contactInView);
        });
      }, { threshold: 0 });
      ioProjects.observe(projectsSection);
    }

    // Observador específico para el contacto para asegurar que se oculte al final
    if (contactSection) {
      const ioContact = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            btn.classList.remove('is-visible');
          } else {
            // Re-evaluar visibilidad al salir del contacto (subiendo)
            const projTop = projectsSection.getBoundingClientRect().top;
            if (projTop < window.innerHeight) {
              btn.classList.add('is-visible');
            }
          }
        });
      }, { threshold: 0 });
      ioContact.observe(contactSection);
    } else {
      btn.classList.add('is-visible');
    }
  }

  // ── Modal de agregar certificado ────────────────────────────
  function openModal() {
    if (document.getElementById('cert-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'cert-modal';
    modal.className = 'cert-modal';
    modal.innerHTML = `
      <div class="cert-modal__backdrop"></div>
      <div class="cert-modal__dialog">
        <button class="cert-modal__close" aria-label="Cerrar modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="cert-modal__header">
          <h3>Nuevo Certificado</h3>
          <p>Agrega un certificado a tu portafolio</p>
        </div>

        <form id="cert-form" class="cert-modal__form" autocomplete="off">
          <div class="cert-form__group">
            <label for="cert-title" class="cert-form__label">Título del certificado <span class="required">*</span></label>
            <input type="text" id="cert-title" class="cert-form__input" placeholder="Ej: React Avanzado" required maxlength="100" />
          </div>

          <div class="cert-form__group">
            <label for="cert-platform" class="cert-form__label">Plataforma</label>
            <input type="text" id="cert-platform" list="platforms-list" class="cert-form__input" placeholder="Ej: Udemy, INFOP, etc..." required />
            <datalist id="platforms-list">
              <option value="Udemy">
              <option value="Coursera">
              <option value="Platzi">
              <option value="LinkedIn Learning">
              <option value="Google">
              <option value="Microsoft">
              <option value="edX">
              <option value="AWS">
              <option value="INFOP">
            </datalist>
          </div>

          <div class="cert-form__group">
            <label for="cert-link" class="cert-form__label">Enlace al certificado</label>
            <input type="url" id="cert-link" class="cert-form__input" placeholder="https://..." />
          </div>

          <div class="cert-form__group">
            <label class="cert-form__label">Imagen del certificado</label>
            <div class="cert-form__dropzone" id="cert-dropzone">
              <input type="file" id="cert-image" accept="image/*" class="cert-form__file-input" />
              <div class="cert-form__dropzone-content" id="dropzone-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Arrastra una imagen o <strong>haz clic</strong> para seleccionar</span>
                <small>PNG, JPG, WEBP — Máx. 5 MB</small>
              </div>
              <div class="cert-form__preview" id="cert-preview" style="display:none;">
                <img id="cert-preview-img" alt="Vista previa" />
                <button type="button" class="cert-form__preview-remove" id="cert-remove-img" title="Quitar imagen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <p class="cert-form__hint">Si no agregas imagen, se mostrará un placeholder con el título.</p>
          </div>

          <div class="cert-form__actions">
            <button type="button" class="btn btn--ghost cert-modal__cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn--primary cert-modal__save-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Guardar certificado
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Animación de entrada
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });

    // ── Variables del modal ──
    const form = modal.querySelector('#cert-form');
    const fileInput = modal.querySelector('#cert-image');
    const dropzone = modal.querySelector('#cert-dropzone');
    const dropzoneContent = modal.querySelector('#dropzone-content');
    const previewContainer = modal.querySelector('#cert-preview');
    const previewImg = modal.querySelector('#cert-preview-img');
    const removeImgBtn = modal.querySelector('#cert-remove-img');
    let uploadedImageBase64 = null;

    // ── Drag & Drop & Click ──
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('is-dragover');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) handleImageFile(file);
    });

    function handleImageFile(file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('La imagen no debe superar 5 MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImageBase64 = e.target.result;
        previewImg.src = uploadedImageBase64;
        dropzoneContent.style.display = 'none';
        previewContainer.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }

    removeImgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedImageBase64 = null;
      fileInput.value = '';
      dropzoneContent.style.display = 'flex';
      previewContainer.style.display = 'none';
    });

    // ── Cerrar modal ──
    function closeModal() {
      modal.classList.remove('is-open');
      setTimeout(() => modal.remove(), 350);
    }

    modal.querySelector('.cert-modal__close').addEventListener('click', closeModal);
    modal.querySelector('.cert-modal__cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.cert-modal__backdrop').addEventListener('click', closeModal);

    // Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);

    // ── Guardar ──
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = modal.querySelector('#cert-title').value.trim();
      const platform = modal.querySelector('#cert-platform').value;
      const link = modal.querySelector('#cert-link').value.trim();

      if (!title) {
        showToast('El título es obligatorio', 'error');
        return;
      }

      const newCert = {
        id: generateId(),
        title,
        platform,
        link: link || null,
        image: uploadedImageBase64 || null,
        createdAt: new Date().toISOString()
      };

      const certs = loadCertificates();
      certs.push(newCert);
      saveCertificates(certs);

      // Agregar tarjeta al DOM
      const grid = document.querySelector('.cert-grid');
      if (grid) {
        const card = createCertCard(newCert);
        grid.appendChild(card);
        if (window.Iconify) window.Iconify.scan();
      }

      showToast(`"${title}" agregado exitosamente`, 'success');
      closeModal();
    });

    // Focus en el primer input
    setTimeout(() => modal.querySelector('#cert-title').focus(), 350);
  }

  // ── Toast notifications ─────────────────────────────────────
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `cert-toast cert-toast--${type}`;
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
        }
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* Comentado temporalmente: Funcionalidad de agregar certificados
  function showPasswordModal(onSuccess) {
    ...
  }
*/
  // ── Password Authentication Modal ───────────────────────────
  function requireAuth(callback) {
    if (isAuthenticated()) {
      callback();
      return;
    }
    showPasswordModal(callback);
  }

  function showPasswordModal(onSuccess) {
    if (document.getElementById('cert-auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'cert-auth-modal';
    modal.className = 'cert-modal';
    modal.innerHTML = `
      <div class="cert-modal__backdrop"></div>
      <div class="cert-modal__dialog" style="max-width: 400px;">
        <button class="cert-modal__close" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="cert-modal__header">
          <div class="cert-modal__icon-wrap" style="background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.12)); color: #ef4444;">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3>Acceso requerido</h3>
          <p>Ingresa la contraseña de administrador</p>
        </div>
        <form id="cert-auth-form" class="cert-modal__form" autocomplete="off">
          <div class="cert-form__group">
            <label for="cert-password" class="cert-form__label">Contraseña</label>
            <div style="position: relative; display: flex; align-items: center;">
              <input type="password" id="cert-password" class="cert-form__input" placeholder="••••••••" required autofocus style="padding-right: 40px;" />
              <button type="button" id="toggle-password" title="Mostrar/Ocultar" style="position: absolute; right: 12px; background: transparent; border: none; padding: 0; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer;">
                <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg class="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <p class="cert-form__hint cert-auth-error" id="cert-auth-error" style="color: #ef4444; display: none;">Contraseña incorrecta</p>
          </div>
          <div class="cert-form__actions">
            <button type="button" class="btn btn--ghost cert-auth-cancel">Cancelar</button>
            <button type="submit" class="btn btn--primary cert-auth-submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Acceder
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('is-open'));

    function closeAuth() {
      modal.classList.remove('is-open');
      setTimeout(() => modal.remove(), 350);
    }

    modal.querySelector('.cert-modal__close').addEventListener('click', closeAuth);
    modal.querySelector('.cert-auth-cancel').addEventListener('click', closeAuth);
    modal.querySelector('.cert-modal__backdrop').addEventListener('click', closeAuth);

    const escHandler = (e) => {
      if (e.key === 'Escape') { closeAuth(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);

    modal.querySelector('#cert-auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = modal.querySelector('#cert-password').value;
      const hash = await sha256(pwd);

      if (hash === PASSWORD_HASH) {
        setAuthenticated();
        closeAuth();
        setTimeout(() => onSuccess(), 380);
      } else {
        const errorEl = modal.querySelector('#cert-auth-error');
        errorEl.style.display = 'block';
        const input = modal.querySelector('#cert-password');
        input.value = '';
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.12)';
        input.focus();
        // Shake animation
        const dialog = modal.querySelector('.cert-modal__dialog');
        dialog.style.animation = 'none';
        dialog.offsetHeight; // trigger reflow
        dialog.style.animation = 'cert-shake 0.4s ease';
      }
    });

    // Toggle password visibility
    const toggleBtn = modal.querySelector('#toggle-password');
    const pwdInput = modal.querySelector('#cert-password');
    const eyeIcon = modal.querySelector('.eye-icon');
    const eyeOffIcon = modal.querySelector('.eye-off-icon');

    toggleBtn.addEventListener('click', () => {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
      } else {
        pwdInput.type = 'password';
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
      }
    });

    setTimeout(() => pwdInput.focus(), 350);
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    renderCustomCertificates();
    createFloatingButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
