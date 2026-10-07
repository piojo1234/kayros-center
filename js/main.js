/**
 * KAYROS CENTER - SCRIPTS DE INTERACCIÓN (JS)
 * Funcionalidades: Navegación móvil, reproductor dinámico de videos,
 * filtrado de grupos, acordeón FAQ y copiado de cuentas bancarias.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navegación Móvil (Toggle Menú)
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Cerrar al hacer clic en un enlace
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // 2. Efecto Header Scrolled
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Reproductor Interactivo de Prédicas / Videos
  const mainVideoFrame = document.getElementById('mainVideoFrame');
  const mainVideoTitle = document.getElementById('mainVideoTitle');
  const mainVideoSpeaker = document.getElementById('mainVideoSpeaker');
  const mainVideoExternalLink = document.getElementById('mainVideoExternalLink');
  const recentVideoCards = document.querySelectorAll('.recent-video-card');

  if (mainVideoFrame && recentVideoCards.length > 0) {
    recentVideoCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.getAttribute('data-video-id');
        const title = card.getAttribute('data-title');
        const speaker = card.getAttribute('data-speaker');

        if (videoId) {
          mainVideoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          if (mainVideoExternalLink) {
            mainVideoExternalLink.href = `https://www.youtube.com/watch?v=${videoId}`;
          }
        }
        if (title && mainVideoTitle) {
          mainVideoTitle.textContent = title;
        }
        if (speaker && mainVideoSpeaker) {
          mainVideoSpeaker.textContent = speaker;
        }

        recentVideoCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  // 4. Copiar al Portapapeles (Cuentas Bancarias / Donaciones)
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerText;
          btn.innerText = '✓ ¡Copiado!';
          btn.style.color = '#10B981';
          setTimeout(() => {
            btn.innerText = originalText;
            btn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Error al copiar:', err);
        });
      }
    });
  });

  // 5. Acordeón de Preguntas Frecuentes (FAQ)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Cerrar otros
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. Buscador y Filtro Dinámico de Grupos por Barrio y Comuna
  const searchInput = document.getElementById('groupSearchInput');
  const comunaSelect = document.getElementById('comunaSelect');
  const groupCards = document.querySelectorAll('.group-card-item');
  const noResultsMsg = document.getElementById('noResultsMessage');

  function filterGroups() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedComuna = comunaSelect ? comunaSelect.value : 'all';
    let visibleCount = 0;

    groupCards.forEach(card => {
      const barrio = (card.getAttribute('data-barrio') || '').toLowerCase();
      const comuna = card.getAttribute('data-comuna') || '';
      const text = card.textContent.toLowerCase();

      const matchesQuery = query === '' || barrio.includes(query) || text.includes(query);
      const matchesComuna = selectedComuna === 'all' || comuna === selectedComuna;

      if (matchesQuery && matchesComuna) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.style.display = 'block';
      } else {
        noResultsMsg.style.display = 'none';
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterGroups);
  }

  if (comunaSelect) {
    comunaSelect.addEventListener('change', filterGroups);
  }

  // 7. Formulario de Planificación de Visita a WhatsApp
  const visitForm = document.getElementById('visitForm');
  if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('visitorName')?.value || 'Amigo';
      const guests = document.getElementById('visitorCount')?.value || '1';
      const date = document.getElementById('visitDate')?.value || 'este domingo';
      const kids = document.getElementById('visitorKids')?.checked ? 'Sí, llevo niños' : 'No llevo niños';

      const message = `¡Hola Kayros Center! 👋 Mi nombre es ${name}. Planeo visitarlos ${date} con ${guests} acompañante(s). Niños para Kayros Kids: ${kids}. ¡Nos vemos allá!`;
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/573112819003?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // 7.1 Formulario de Pre-Inscripción Teosuperación a WhatsApp
  const teoForm = document.getElementById('teosuperacionForm');
  if (teoForm) {
    teoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('studentName')?.value || 'Estudiante';
      const level = document.getElementById('studentLevel')?.value || 'Nivel 1';
      const guide = document.getElementById('studentGuide')?.value || 'Guía oficial';

      const message = `¡Hola Kayros Center! 📖 Deseo realizar mi pre-inscripción en la Escuela de Estudio Teológico Teosuperación.\n\n👤 Nombre: ${name}\n🎯 Nivel de Interés: ${level}\n📘 Material: ${guide}\n\nQuedo atento a la confirmación de fechas y entrega de guía. ¡Muchas gracias!`;
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/573112819003?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // 8. Hero Banner Slider Principal (Escalable para 1 o más slides)
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-slider-dots');
    const prevBtn = document.querySelector('.hero-slider-arrow.prev');
    const nextBtn = document.querySelector('.hero-slider-arrow.next');
    let currentIndex = 0;
    let autoPlayTimer = null;

    if (slides.length > 0) {
      // Si hay más de un slide, generar los puntos indicadores y habilitar controles
      if (slides.length > 1) {
        if (dotsContainer) {
          dotsContainer.innerHTML = '';
          slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Ir al slide ${idx + 1}`);
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
              goToSlide(idx);
              resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
          });
        }

        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
      } else {
        // Si hay solo un slide en este momento, ocultar discretamente flechas y puntos
        if (dotsContainer) dotsContainer.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
      }

      function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoPlay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoPlay();
        });
      }

      function startAutoPlay() {
        if (slides.length > 1) {
          stopAutoPlay();
          autoPlayTimer = setInterval(nextSlide, 6500);
        }
      }

      function stopAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      }

      function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
      }

      heroSlider.addEventListener('mouseenter', stopAutoPlay);
      heroSlider.addEventListener('mouseleave', startAutoPlay);

      // Soporte táctil / swipe en móviles
      let touchStartX = 0;
      let touchEndX = 0;
      heroSlider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSlider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (slides.length > 1) {
          if (touchStartX - touchEndX > 50) {
            nextSlide();
            resetAutoPlay();
          } else if (touchEndX - touchStartX > 50) {
            prevSlide();
            resetAutoPlay();
          }
        }
      }, { passive: true });

      startAutoPlay();
    }
  }

  // =========================================================================
  // 8. TALLER INTERACTIVO DE FINANZAS BÍBLICAS & DETECTOR DE FUGAS
  // =========================================================================
  const financeApp = document.getElementById('financeWorkshopApp');
  if (financeApp) {
    let currentCurrency = 'COP'; // 'COP' o 'USD'

    const formatCurrency = (amount, currency = currentCurrency) => {
      if (currency === 'COP') {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0
        }).format(amount);
      } else {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
    };

    // --- A. CALCULADORA PAN VS SEMILLA ---
    const incomeInput = document.getElementById('monthlyIncomeInput');
    const currencyBtns = document.querySelectorAll('.curr-btn');
    const currencyPrefix = document.getElementById('currencyPrefix');
    const distSemillaBar = document.getElementById('distSemillaBar');
    const distPanBar = document.getElementById('distPanBar');
    const totalSemillaAmountEl = document.getElementById('totalSemillaAmount');
    const totalPanAmountEl = document.getElementById('totalPanAmount');
    const totalAllocatedAmountEl = document.getElementById('totalAllocatedAmount');

    // Categorías y Porcentajes del Excel
    const categoriesConfig = [
      { id: 'catDiezmo', rate: 0.10, type: 'semilla' },
      { id: 'catOfrenda', rate: 0.05, type: 'semilla' },
      { id: 'catInversion', rate: 0.15, type: 'semilla' },
      { id: 'catGastosFijos', rate: 0.50, type: 'pan' },
      { id: 'catEducacion', rate: 0.05, type: 'semilla' },
      { id: 'catReserva', rate: 0.05, type: 'semilla' },
      { id: 'catEstiloVida', rate: 0.10, type: 'pan' }
    ];

    function updatePanVsSemilla() {
      let rawVal = parseFloat(incomeInput.value) || 0;
      if (rawVal < 0) rawVal = 0;

      let sumSemilla = 0;
      let sumPan = 0;

      categoriesConfig.forEach(cat => {
        const amount = rawVal * cat.rate;
        const displayEl = document.getElementById(cat.id + 'Amount');
        if (displayEl) {
          displayEl.textContent = formatCurrency(amount);
        }
        if (cat.type === 'semilla') {
          sumSemilla += amount;
        } else {
          sumPan += amount;
        }
      });

      const totalAllocated = sumSemilla + sumPan;
      if (totalSemillaAmountEl) totalSemillaAmountEl.textContent = formatCurrency(sumSemilla);
      if (totalPanAmountEl) totalPanAmountEl.textContent = formatCurrency(sumPan);
      if (totalAllocatedAmountEl) totalAllocatedAmountEl.textContent = formatCurrency(totalAllocated);

      if (distSemillaBar) {
        distSemillaBar.textContent = `Semilla 40% (${formatCurrency(sumSemilla)})`;
      }
      if (distPanBar) {
        distPanBar.textContent = `Pan 60% (${formatCurrency(sumPan)})`;
      }
    }

    if (incomeInput) {
      incomeInput.addEventListener('input', updatePanVsSemilla);
    }

    currencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currencyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selected = btn.getAttribute('data-currency');
        if (selected && selected !== currentCurrency) {
          currentCurrency = selected;
          if (currencyPrefix) {
            currencyPrefix.textContent = currentCurrency === 'COP' ? '$' : 'US$';
          }
          if (incomeInput) {
            incomeInput.value = currentCurrency === 'COP' ? '2500000' : '1000';
          }
          // Actualizar costos en gastos hormiga según moneda
          repopulateDefaultLeaks();
          updatePanVsSemilla();
          calculateAllLeaks();
        }
      });
    });

    // --- B. AUTOEVALUACIÓN DE MAYORDOMÍA (1-5) ---
    const diagnosticItems = document.querySelectorAll('.diagnostic-item');
    const avgScoreEl = document.getElementById('diagnosticAvgScore');
    const overallBadgeEl = document.getElementById('diagnosticOverallBadge');
    const overallAdviceEl = document.getElementById('diagnosticAdvice');

    function updateDiagnostic() {
      let totalScore = 0;
      let count = 0;

      diagnosticItems.forEach(item => {
        const activeBtn = item.querySelector('.score-btn.active');
        const score = activeBtn ? parseInt(activeBtn.getAttribute('data-score')) : 3;
        totalScore += score;
        count++;

        const statusBadge = item.querySelector('.status-badge');
        if (statusBadge) {
          if (score >= 4) {
            statusBadge.textContent = 'Solidez';
            statusBadge.className = 'status-badge solidez';
          } else if (score === 3) {
            statusBadge.textContent = 'Aceptable';
            statusBadge.className = 'status-badge aceptable';
          } else {
            statusBadge.textContent = 'Atención Requerida';
            statusBadge.className = 'status-badge atencion';
          }
        }
      });

      const avg = count > 0 ? (totalScore / count).toFixed(1) : '3.0';
      if (avgScoreEl) avgScoreEl.textContent = avg;

      if (overallBadgeEl && overallAdviceEl) {
        const numAvg = parseFloat(avg);
        if (numAvg >= 4.5) {
          overallBadgeEl.textContent = 'Excelente Mayordomo';
          overallBadgeEl.className = 'status-badge solidez';
          overallAdviceEl.textContent = '¡Gloria a Dios! Tus finanzas reflejan orden, obediencia en el altar y visión de Reino. Estás preparado para administrar multiplicaciones mayores.';
        } else if (numAvg >= 3.5) {
          overallBadgeEl.textContent = 'Buen Camino';
          overallBadgeEl.className = 'status-badge aceptable';
          overallAdviceEl.textContent = 'Tienes fundamentos bíblicos claros. Ajusta las fugas y fortalece tu fondo de semilla para pasar de la protección a la expansión.';
        } else {
          overallBadgeEl.textContent = 'Necesita Ajuste Urgente';
          overallBadgeEl.className = 'status-badge atencion';
          overallAdviceEl.textContent = 'Es momento de detener deudas de apariencia, cerrar gastos hormiga y someter la economía a la dirección profética y al orden del Reino.';
        }
      }
    }

    diagnosticItems.forEach(item => {
      const btns = item.querySelectorAll('.score-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          updateDiagnostic();
        });
      });
    });

    // --- C. CACERÍA DE GASTOS HORMIGA & FUGAS ---
    const leakTableBody = document.getElementById('leakTableBody');
    const btnAddLeak = document.getElementById('btnAddLeak');
    const leakMonthTotalEl = document.getElementById('leakMonthTotal');
    const leakYearTotalEl = document.getElementById('leakYearTotal');
    const leak3YearsFundEl = document.getElementById('leak3YearsFund');

    const defaultLeaksData = {
      COP: [
        { desc: 'Cafés diarios comprados fuera', freq: 20, cost: 3500, action: 'Preparar en casa y llevar termo' },
        { desc: 'Suscripciones de streaming sin uso', freq: 1, cost: 45000, action: 'Cancelar 2 servicios activos' },
        { desc: 'Snacks / Golosinas en la calle', freq: 15, cost: 3000, action: 'Comprar en supermercado al por mayor' },
        { desc: 'Comida rápida por falta de tiempo', freq: 8, cost: 30000, action: 'Planificar menú semanal familiar' },
        { desc: 'Compras de impulso por antojo', freq: 4, cost: 60000, action: 'Aplicar regla de espera de 48 horas' }
      ],
      USD: [
        { desc: 'Cafés diarios comprados fuera', freq: 20, cost: 3.5, action: 'Preparar en casa y llevar termo' },
        { desc: 'Suscripciones de streaming sin uso', freq: 1, cost: 15, action: 'Cancelar 2 servicios activos' },
        { desc: 'Snacks / Golosinas en la calle', freq: 15, cost: 2.5, action: 'Comprar en supermercado al por mayor' },
        { desc: 'Comida rápida por falta de tiempo', freq: 8, cost: 12, action: 'Planificar menú semanal familiar' },
        { desc: 'Compras de impulso por antojo', freq: 4, cost: 25, action: 'Aplicar regla de espera de 48 horas' }
      ]
    };

    function renderLeakRow(item) {
      const tr = document.createElement('tr');
      tr.className = 'leak-row';
      tr.innerHTML = `
        <td><input type="text" class="leak-table-input leak-desc" value="${item.desc}"></td>
        <td style="max-width: 90px;"><input type="number" min="0" class="leak-table-input leak-freq" value="${item.freq}" style="text-align: center;"></td>
        <td style="max-width: 130px;"><input type="number" min="0" step="any" class="leak-table-input leak-cost" value="${item.cost}" style="text-align: right;"></td>
        <td class="amount-display leak-monthly" style="text-align: right; white-space: nowrap;">$ 0</td>
        <td class="amount-display leak-yearly" style="text-align: right; white-space: nowrap;">$ 0</td>
        <td><input type="text" class="leak-table-input leak-action" value="${item.action}"></td>
        <td style="text-align: center;"><button type="button" class="btn-delete-row" title="Eliminar este gasto">×</button></td>
      `;

      // Eventos
      tr.querySelector('.leak-freq').addEventListener('input', calculateAllLeaks);
      tr.querySelector('.leak-cost').addEventListener('input', calculateAllLeaks);
      tr.querySelector('.btn-delete-row').addEventListener('click', () => {
        tr.remove();
        calculateAllLeaks();
      });

      return tr;
    }

    function repopulateDefaultLeaks() {
      if (!leakTableBody) return;
      leakTableBody.innerHTML = '';
      const list = defaultLeaksData[currentCurrency] || defaultLeaksData.COP;
      list.forEach(item => {
        leakTableBody.appendChild(renderLeakRow(item));
      });
    }

    function calculateAllLeaks() {
      if (!leakTableBody) return;
      const rows = leakTableBody.querySelectorAll('.leak-row');
      let grandMonthly = 0;
      let grandYearly = 0;

      rows.forEach(row => {
        const freq = parseFloat(row.querySelector('.leak-freq')?.value) || 0;
        const cost = parseFloat(row.querySelector('.leak-cost')?.value) || 0;
        const monthly = freq * cost;
        const yearly = monthly * 12;

        grandMonthly += monthly;
        grandYearly += yearly;

        const mEl = row.querySelector('.leak-monthly');
        const yEl = row.querySelector('.leak-yearly');
        if (mEl) mEl.textContent = formatCurrency(monthly);
        if (yEl) yEl.textContent = formatCurrency(yearly);
      });

      if (leakMonthTotalEl) leakMonthTotalEl.textContent = formatCurrency(grandMonthly);
      if (leakYearTotalEl) leakYearTotalEl.textContent = formatCurrency(grandYearly);
      if (leak3YearsFundEl) {
        const threeYears = grandYearly * 3;
        leak3YearsFundEl.textContent = formatCurrency(threeYears);
      }
    }

    if (btnAddLeak) {
      btnAddLeak.addEventListener('click', () => {
        const newRow = renderLeakRow({
          desc: 'Nuevo gasto hormiga detectado',
          freq: 10,
          cost: currentCurrency === 'COP' ? 5000 : 2,
          action: 'Erradicar o sustituir'
        });
        leakTableBody.appendChild(newRow);
        calculateAllLeaks();
      });
    }

    // --- D. BOTONES DE ACCIÓN: IMPRIMIR & RESTABLECER ---
    const btnPrintPlan = document.getElementById('btnPrintPlan');
    const btnResetAll = document.getElementById('btnResetAll');
    const declarationDateInput = document.getElementById('declarationDate');

    if (declarationDateInput) {
      const today = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      declarationDateInput.value = today.toLocaleDateString('es-CO', options);
    }

    if (btnPrintPlan) {
      btnPrintPlan.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnResetAll) {
      btnResetAll.addEventListener('click', () => {
        if (confirm('¿Deseas restablecer todos los valores a la configuración inicial recomendada?')) {
          if (incomeInput) incomeInput.value = currentCurrency === 'COP' ? '2500000' : '1000';
          diagnosticItems.forEach(item => {
            const btns = item.querySelectorAll('.score-btn');
            btns.forEach(b => b.classList.remove('active'));
            // activar el 3 por defecto
            btns[2]?.classList.add('active');
          });
          repopulateDefaultLeaks();
          updateDiagnostic();
          updatePanVsSemilla();
          calculateAllLeaks();
        }
      });
    }

    // Inicialización al cargar la página
    repopulateDefaultLeaks();
    updateDiagnostic();
    updatePanVsSemilla();
    calculateAllLeaks();
  }
});


