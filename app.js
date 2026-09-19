/**
 * ============================================================================
 * UNAD - Escuela de Ciencias de la Educacion (ECEDU)
 * Curso: Infancias: Historias y Perspectivas (514517)
 * Recurso Digital: Construccion Historica de las Infancias
 * Application Script (app.js) - Navigation, Timeline and Interactivity
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Element Selectors and Global State
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNavigation');
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const eraPanels = document.querySelectorAll('.era-panel');
  const timelineProgressBar = document.getElementById('timelineProgressBar');
  const btnExploreTimeline = document.getElementById('btnExploreTimeline');
  const journeyEraButtons = document.querySelectorAll('[data-jump-era]');
  const jumpTabButtons = document.querySelectorAll('[data-jump-tab]');
  const backToTopLink = document.getElementById('backToTop');
  const readingProgressBar = document.getElementById('readingProgressBar');

  // Quick Action Buttons
  const btnToggleTheme = document.getElementById('btnToggleTheme');
  const btnToggleSound = document.getElementById('btnToggleSound');
  const btnOpenSearch = document.getElementById('btnOpenSearch');
  const btnHeroTrivia = document.getElementById('btnHeroTrivia');
  const btnHeroFlashcards = document.getElementById('btnHeroFlashcards');

  const validTabs = [
    'inicio',
    'construccion-historica',
    'infancias-perspectiva',
    'realidades-desafios',
    'voces-transformacion',
    'referencias'
  ];

  // --------------------------------------------------------------------------
  // 1.1 Sound Effects Engine (Web Audio API - Zero External Dependencies)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('unad_sound') !== 'false';

  const getAudioContext = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  const playTone = (freq, type, duration, gainValue = 0.07) => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const soundFX = {
    click: () => playTone(600, 'sine', 0.05, 0.04),
    flip: () => {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.09);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}
    },
    correct: () => {
      if (!isSoundEnabled) return;
      playTone(523.25, 'triangle', 0.1, 0.07);
      setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.07), 80);
      setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.09), 160);
    },
    wrong: () => {
      if (!isSoundEnabled) return;
      playTone(280, 'sawtooth', 0.12, 0.05);
      setTimeout(() => playTone(240, 'sawtooth', 0.2, 0.05), 100);
    },
    fanfare: () => {
      if (!isSoundEnabled) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.2, 0.08), i * 110);
      });
    },
    boing: () => {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch (e) {}
    },
    magic: () => {
      if (!isSoundEnabled) return;
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.12, 0.05), i * 65);
      });
    },
    giggle: () => {
      if (!isSoundEnabled) return;
      playTone(600, 'sine', 0.06, 0.05);
      setTimeout(() => playTone(780, 'sine', 0.07, 0.06), 70);
      setTimeout(() => playTone(950, 'sine', 0.09, 0.05), 150);
    }
  };

  const updateSoundButtonUI = () => {
    if (!btnToggleSound) return;
    const onIcon = btnToggleSound.querySelector('.sound-on-icon');
    const offIcon = btnToggleSound.querySelector('.sound-off-icon');
    if (isSoundEnabled) {
      if (onIcon) onIcon.style.display = 'block';
      if (offIcon) offIcon.style.display = 'none';
      btnToggleSound.setAttribute('aria-label', 'Sonido activado');
      btnToggleSound.title = 'Efectos sonoros: Activados';
    } else {
      if (onIcon) onIcon.style.display = 'none';
      if (offIcon) offIcon.style.display = 'block';
      btnToggleSound.setAttribute('aria-label', 'Sonido silenciado');
      btnToggleSound.title = 'Efectos sonoros: Silenciados';
    }
  };

  if (btnToggleSound) {
    updateSoundButtonUI();
    btnToggleSound.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('unad_sound', isSoundEnabled ? 'true' : 'false');
      updateSoundButtonUI();
      if (isSoundEnabled) soundFX.click();
    });
  }

  // --------------------------------------------------------------------------
  // 1.2 Theme Switcher (Dark / Light Academic Mode)
  // --------------------------------------------------------------------------
  const getInitialTheme = () => {
    // Ensure the website defaults to the bright, high-contrast UNAD academic light palette
    const saved = localStorage.getItem('unad_theme_v3');
    if (saved) return saved;
    // Clear legacy unad_theme to prevent unwanted dark mode
    try { localStorage.removeItem('unad_theme'); } catch (e) {}
    return 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('unad_theme_v3', theme);
    if (!btnToggleTheme) return;
    const moonIcon = btnToggleTheme.querySelector('.theme-moon-icon');
    const sunIcon = btnToggleTheme.querySelector('.theme-sun-icon');
    if (theme === 'dark') {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
      btnToggleTheme.setAttribute('aria-label', 'Cambiar a modo claro');
      btnToggleTheme.title = 'Modo actual: Oscuro (clic para claro)';
    } else {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
      btnToggleTheme.setAttribute('aria-label', 'Cambiar a modo oscuro');
      btnToggleTheme.title = 'Modo actual: Claro (clic para oscuro)';
    }
  };

  applyTheme(getInitialTheme());

  if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      soundFX.click();
      applyTheme(next);
    });
  }

  // --------------------------------------------------------------------------
  // 1.3 Global Reading Progress Bar
  // --------------------------------------------------------------------------
  const updateReadingProgressBar = () => {
    if (!readingProgressBar) return;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      readingProgressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }
  };

  window.addEventListener('scroll', updateReadingProgressBar, { passive: true });

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Handling
  // --------------------------------------------------------------------------
  const toggleMobileMenu = (forceClose = false) => {
    if (!menuToggle || !primaryNav) return;
    const isCurrentlyOpen = primaryNav.classList.contains('is-open');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    if (shouldOpen) {
      primaryNav.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      primaryNav.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (primaryNav && primaryNav.classList.contains('is-open')) {
      if (!primaryNav.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav && primaryNav.classList.contains('is-open')) {
      toggleMobileMenu(true);
    }
  });

  // --------------------------------------------------------------------------
  // 3. Tab Switching Mechanism
  // --------------------------------------------------------------------------
  const switchTab = (targetTabId, updateHash = true) => {
    if (!validTabs.includes(targetTabId)) {
      targetTabId = 'inicio';
    }

    // Update nav links active state
    navLinks.forEach((link) => {
      const linkTab = link.getAttribute('data-tab');
      if (linkTab === targetTabId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Update tab panels
    tabPanels.forEach((panel) => {
      const panelId = panel.id.replace('tab-', '');
      if (panelId === targetTabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (updateHash && window.location.hash !== `#${targetTabId}`) {
      history.pushState(null, '', `#${targetTabId}`);
    }

    // Always close mobile navigation upon tab change
    toggleMobileMenu(true);
  };

  // Listen to clicks on navigation links
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      switchTab(targetTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Listen to hash changes (browser back/forward or manual hash entry)
  window.addEventListener('hashchange', () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (rawHash) {
      switchTab(rawHash, false);
    } else {
      switchTab('inicio', false);
    }
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Timeline Handling (Reto 2)
  // --------------------------------------------------------------------------
  const updateTimelineProgress = (era) => {
    if (!timelineProgressBar) return;
    if (era === 'antigua') {
      timelineProgressBar.style.width = '0%';
    } else if (era === 'media') {
      timelineProgressBar.style.width = '33.33%';
    } else if (era === 'moderna') {
      timelineProgressBar.style.width = '66.66%';
    } else if (era === 'contemporanea') {
      timelineProgressBar.style.width = '100%';
    }
  };

  const selectTimelineEra = (targetEra, shouldScroll = false) => {
    timelineSteps.forEach((step) => {
      const stepEra = step.getAttribute('data-era');
      if (stepEra === targetEra) {
        step.classList.add('active');
        step.setAttribute('aria-selected', 'true');
      } else {
        step.classList.remove('active');
        step.setAttribute('aria-selected', 'false');
      }
    });

    eraPanels.forEach((panel) => {
      const panelEra = panel.id.replace('panel-', '');
      if (panelEra === targetEra) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    updateTimelineProgress(targetEra);

    if (shouldScroll) {
      const targetPanel = document.getElementById(`panel-${targetEra}`);
      if (targetPanel) {
        const headerOffset = 90;
        const panelPosition = targetPanel.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: panelPosition - headerOffset,
          behavior: 'smooth'
        });
      }
    }
  };

  timelineSteps.forEach((step) => {
    step.addEventListener('click', () => {
      const era = step.getAttribute('data-era');
      selectTimelineEra(era);
    });

    // Support keyboard activation with Enter or Space
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const era = step.getAttribute('data-era');
        selectTimelineEra(era);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Subtabs Inside Each Era Panel
  // --------------------------------------------------------------------------
  const initSubtabs = () => {
    const subtabButtons = document.querySelectorAll('.subtab-btn');

    subtabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const subtabTargetId = btn.getAttribute('data-subtab');
        const parentEraPanel = btn.closest('.era-panel');
        if (!parentEraPanel) return;

        // Reset buttons inside this era panel
        const siblingButtons = parentEraPanel.querySelectorAll('.subtab-btn');
        siblingButtons.forEach((sibling) => {
          sibling.classList.remove('active');
          sibling.setAttribute('aria-selected', 'false');
        });

        // Activate current button
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Reset panels inside this era panel
        const siblingPanels = parentEraPanel.querySelectorAll('.subtab-panel');
        siblingPanels.forEach((panel) => {
          panel.classList.remove('active');
        });

        // Activate targeted subtab panel
        const targetPanel = parentEraPanel.querySelector(`#subtab-${subtabTargetId}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  };

  initSubtabs();

  // --------------------------------------------------------------------------
  // 5.1 Animated Stats Counter (Intersection Observer)
  // --------------------------------------------------------------------------
  const statsCounters = document.querySelectorAll('.counter[data-target]');
  let statsCounted = false;

  const runCounterAnimation = () => {
    if (statsCounted) return;
    statsCounted = true;

    statsCounters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1400;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * target);
        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.hero-stats-banner');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounterAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(statsSection);
  } else {
    runCounterAnimation();
  }

  // --------------------------------------------------------------------------
  // 5.2 3D Flashcards Laboratorio Conceptual
  // --------------------------------------------------------------------------
  const flashcardCards = document.querySelectorAll('.flashcard-card');
  const btnFlipAllFlashcards = document.getElementById('btnFlipAllFlashcards');

  flashcardCards.forEach((card) => {
    const toggleFlip = () => {
      soundFX.flip();
      card.classList.toggle('is-flipped');
    };

    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  if (btnFlipAllFlashcards) {
    let allFlipped = false;
    btnFlipAllFlashcards.addEventListener('click', () => {
      allFlipped = !allFlipped;
      soundFX.flip();
      flashcardCards.forEach((card) => {
        if (allFlipped) {
          card.classList.add('is-flipped');
        } else {
          card.classList.remove('is-flipped');
        }
      });
      const span = btnFlipAllFlashcards.querySelector('span');
      if (span) {
        span.textContent = allFlipped ? 'Regresar todas las fichas' : 'Voltear todas las fichas';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5.3 Audio Narrator (Web Speech API Text-to-Speech)
  // --------------------------------------------------------------------------
  const ttsData = {
    antigua: "En la Edad Antigua, marcada por Grecia y Roma, la infancia estaba subordinada a la patria potestad del padre de familia y a los requerimientos de la polis. El niño era visto como posesión del clan familiar y futuro guerrero o continuador del linaje, sin valor intrínseco. Pensadores como Platón, Aristóteles y Quintiliano sentaron las bases de la paideia y los primeros debates sobre la educación infantil.",
    media: "En la Edad Media, el niño fue concebido como un homúnculo, es decir, un adulto en miniatura. Tan pronto superaba la primera infancia a los siete años, era introducido directamente al trabajo y a la vida de los mayores. La doctrina del pecado original exigía una disciplina severa para salvar su alma. El historiador Philippe Ariès demostró que en este periodo no existía aún una conciencia o sentimiento de infancia.",
    moderna: "En la Edad Moderna nace la pedagogía y se forja el sentimiento de infancia. La familia burguesa nuclear y la escuela se consolidan como espacios protectores y formativos. Se reconoce que los niños tienen formas propias de pensar y sentir. Figuras como Juan Amós Comenio con la didáctica universal, John Locke con la tabula rasa, y Rousseau con Emilio revolucionaron para siempre la mirada sobre la niñez.",
    contemporanea: "En la época contemporánea, la concepción de infancia se transforma radicalmente hacia el paradigma de derechos humanos consagrado en la Convención Internacional sobre los Derechos del Niño de 1989. Se transita de ver al niño como objeto de tutela a reconocerlo como sujeto activo de derechos con agencia participativa. Autores como Satriano y Chica y Rasero destacan la necesidad de hablar de infancias en plural, reconociendo su contingencia histórica y su diversidad territorial y cultural.",
    reflexion: "En nuestra reflexión para la UNAD, evidenciamos cómo el adultocentrismo pervive hoy cuando se desestima la voz de los niños. En Colombia, la Ley 2089 de 2021 prohíbe el castigo físico y nos convoca a una crianza respetuosa. Como pedagogos de la UNAD, debemos construir una pedagogía situada que dignifique la diversidad territorial y étnica de las infancias."
  };

  const audioButtons = document.querySelectorAll('.btn-audio-narrate');
  let currentSpeechEra = null;

  const stopAllSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentSpeechEra = null;
    audioButtons.forEach((btn) => {
      btn.classList.remove('is-playing');
    });
  };

  const speakEraText = (eraKey, btnElement) => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en este navegador. Te invitamos a leer el texto en pantalla.');
      return;
    }

    if (currentSpeechEra === eraKey) {
      stopAllSpeech();
      return;
    }

    stopAllSpeech();

    const textToRead = ttsData[eraKey];
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang && v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    btnElement.classList.add('is-playing');
    currentSpeechEra = eraKey;

    utterance.onend = () => {
      btnElement.classList.remove('is-playing');
      currentSpeechEra = null;
    };

    utterance.onerror = () => {
      btnElement.classList.remove('is-playing');
      currentSpeechEra = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  audioButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundFX.click();
      const eraKey = btn.getAttribute('data-tts-era');
      if (eraKey) {
        speakEraText(eraKey, btn);
      }
    });
  });

  navLinks.forEach((l) => l.addEventListener('click', stopAllSpeech));

  // --------------------------------------------------------------------------
  // 5.4 Comparison Table Interactive Filter & Highlight
  // --------------------------------------------------------------------------
  const tableFilterButtons = document.querySelectorAll('.table-filter-btn');
  const tableHighlightButtons = document.querySelectorAll('.table-highlight-btn');
  const tableRows = document.querySelectorAll('.comparison-table tbody tr');
  const tableCells = document.querySelectorAll('.comparison-table th, .comparison-table td');

  tableFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundFX.click();
      tableFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter-row');

      tableRows.forEach((row) => {
        const rowKey = row.getAttribute('data-row-key');
        if (filterValue === 'all' || rowKey === filterValue) {
          row.classList.remove('row-hidden');
        } else {
          row.classList.add('row-hidden');
        }
      });
    });
  });

  tableHighlightButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundFX.click();
      tableHighlightButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const colClass = btn.getAttribute('data-highlight-col');

      tableCells.forEach((cell) => {
        cell.classList.remove('col-highlighted');
      });

      if (colClass && colClass !== 'none') {
        const targetCells = document.querySelectorAll(`.comparison-table .${colClass}`);
        targetCells.forEach(cell => cell.classList.add('col-highlighted'));
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5.5 Trivia Gamificada (Quiz Reto 2)
  // --------------------------------------------------------------------------
  const triviaQuestions = [
    {
      era: "Edad Media",
      question: "¿Cuál es la tesis central de Philippe Ariès (1960) respecto a la infancia medieval?",
      options: [
        "Los niños gozaban de derechos jurídicos superiores a los adultos en los feudos.",
        "En la Edad Media no existía el 'sentimiento de infancia': el niño era concebido como un homúnculo o adulto en miniatura.",
        "La escolarización formal era universal, obligatoria y supervisada por los gremios.",
        "El infanticidio era promovido legalmente por la Iglesia en toda Europa."
      ],
      correctIndex: 1,
      explanation: "Ariès demostró que la categoría 'infancia' es una construcción histórica moderna. En el medioevo, tras dejar el amamantamiento (~7 años), el infante compartía el vestido, faenas laborales y penalidad adulta."
    },
    {
      era: "Edad Moderna",
      question: "¿Cómo conceptualizó John Locke la mente del infante en sus 'Pensamientos sobre la educación' (1693)?",
      options: [
        "Como un ser intrínsecamente perverso cargado con el pecado de origen.",
        "Como un sabio innato con nociones éticas ya impresas por naturaleza.",
        "Como una 'tabula rasa' (papel en blanco) moldeada por la experiencia sensorial, los hábitos y el raciocinio.",
        "Como una posesión patrimonial exclusiva de los jueces del Estado."
      ],
      correctIndex: 2,
      explanation: "Locke desechó las ideas innatas y defendió que la mente del infante es como cera blanda o papel blanco que el entorno formativo escribe, rechazando el castigo físico."
    },
    {
      era: "Edad Moderna",
      question: "En su obra cumbre 'Emilio o De la educación' (1762), ¿qué postulado revolucionario formuló Jean-Jacques Rousseau?",
      options: [
        "Que la naturaleza quiere que los niños sean niños antes de ser hombres, reconociendo el valor y bondad propia de la niñez.",
        "Que la educación debe acelerar el razonamiento abstracto antes de los cinco años.",
        "Que los niños deben ser aislados en cuarteles militares para la defensa de la patria.",
        "Que el castigo físico es la única herramienta eficaz para domar los impulsos."
      ],
      correctIndex: 0,
      explanation: "Rousseau inauguró el puerocentrismo: proclamó que el niño nace naturalmente bueno y que la pedagogía debe respetar sus tiempos evolutivos en lugar de imponerle moralinas adultas."
    },
    {
      era: "Edad Moderna",
      question: "¿Cuál fue el aporte fundacional de Juan Amós Comenio en su 'Didáctica Magna' (1632)?",
      options: [
        "La defensa del fajamiento estricto de los recién nacidos para que no gatearan.",
        "El principio de la Pansofía ('enseñar todo a todos'), escuelas graduadas y el primer libro infantil ilustrado (Orbis Pictus).",
        "La prohibición de la educación para las niñas en todas las provincias europeas.",
        "El confinamiento obligatorio de los infantes en monasterios benedictinos."
      ],
      correctIndex: 1,
      explanation: "Comenio es el padre de la didáctica moderna: propuso una educación universal sin distinciones de género o clase, estructurada según las etapas biológicas del desarrollo."
    },
    {
      era: "Contemporaneidad & Colombia",
      question: "En el marco de la CDN (1989) y la Ley 2089 de 2021 en Colombia, ¿cómo se concibe formalmente a los niños y niñas?",
      options: [
        "Como objetos de tutela y propiedad exclusiva de sus padres.",
        "Como sujetos plenos de derechos, ciudadanos activos y con prohibición legal taxativa de todo castigo físico o trato humillante.",
        "Como aprendices en deuda moral constante frente al poder estatal.",
        "Como mano de obra auxiliar transitoria en la economía comunitaria."
      ],
      correctIndex: 1,
      explanation: "La Convención Internacional y la Ley 2089 de 2021 consagran la dignidad inviolable de las infancias, proscribiendo el golpe y reconociendo su derecho a opinar y participar."
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;
  let hasAnsweredCurrent = false;

  const triviaGameView = document.getElementById('triviaGameView');
  const triviaResultsView = document.getElementById('triviaResultsView');
  const triviaCurrentNum = document.getElementById('triviaCurrentNum');
  const triviaTotalNum = document.getElementById('triviaTotalNum');
  const triviaProgressBarFill = document.getElementById('triviaProgressBarFill');
  const triviaLiveScore = document.getElementById('triviaLiveScore');
  const triviaEraBadge = document.getElementById('triviaEraBadge');
  const triviaQuestionText = document.getElementById('triviaQuestionText');
  const triviaOptionsContainer = document.getElementById('triviaOptionsContainer');
  const triviaFeedbackBox = document.getElementById('triviaFeedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackExplanation = document.getElementById('feedbackExplanation');
  const btnNextQuestion = document.getElementById('btnNextQuestion');
  const btnRestartTrivia = document.getElementById('btnRestartTrivia');
  const resultsFinalScore = document.getElementById('resultsFinalScore');
  const resultsFeedbackComment = document.getElementById('resultsFeedbackComment');
  const resultsRankBadge = document.getElementById('resultsRankBadge');

  if (triviaTotalNum) {
    triviaTotalNum.textContent = triviaQuestions.length;
  }

  const renderTriviaQuestion = (index) => {
    hasAnsweredCurrent = false;
    const qData = triviaQuestions[index];
    if (!qData) return;

    if (triviaCurrentNum) triviaCurrentNum.textContent = index + 1;
    if (triviaEraBadge) triviaEraBadge.textContent = qData.era;
    if (triviaQuestionText) triviaQuestionText.textContent = qData.question;
    if (triviaProgressBarFill) {
      const progressPercent = ((index + 1) / triviaQuestions.length) * 100;
      triviaProgressBarFill.style.width = `${progressPercent}%`;
    }
    if (triviaFeedbackBox) triviaFeedbackBox.style.display = 'none';

    if (triviaOptionsContainer) {
      triviaOptionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      qData.options.forEach((optText, optIdx) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'trivia-option-btn';
        optBtn.setAttribute('data-index', optIdx);
        optBtn.setAttribute('role', 'radio');
        optBtn.setAttribute('aria-checked', 'false');

        optBtn.innerHTML = `
          <span class="option-letter">${letters[optIdx]}</span>
          <span class="option-text">${optText}</span>
        `;

        optBtn.addEventListener('click', () => handleSelectOption(optIdx, optBtn));
        triviaOptionsContainer.appendChild(optBtn);
      });
    }
  };

  const handleSelectOption = (selectedIdx, clickedBtn) => {
    if (hasAnsweredCurrent) return;
    hasAnsweredCurrent = true;

    const qData = triviaQuestions[currentQuestionIndex];
    const isCorrect = selectedIdx === qData.correctIndex;

    const allButtons = triviaOptionsContainer.querySelectorAll('.trivia-option-btn');
    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.correctIndex) {
        btn.classList.add('is-correct');
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('is-wrong');
      }
    });

    if (isCorrect) {
      userScore += 100;
      soundFX.correct();
      if (triviaFeedbackBox) {
        triviaFeedbackBox.className = 'trivia-feedback-box feedback-correct';
        if (feedbackTitle) feedbackTitle.textContent = '¡Correcto! Excelente análisis histórico.';
        if (feedbackIcon) feedbackIcon.innerHTML = '✅';
      }
    } else {
      soundFX.wrong();
      if (triviaFeedbackBox) {
        triviaFeedbackBox.className = 'trivia-feedback-box feedback-wrong';
        if (feedbackTitle) feedbackTitle.textContent = 'Respuesta incorrecta.';
        if (feedbackIcon) feedbackIcon.innerHTML = '❌';
      }
    }

    if (feedbackExplanation) feedbackExplanation.textContent = qData.explanation;
    if (triviaLiveScore) triviaLiveScore.textContent = `${userScore} pts`;
    if (triviaFeedbackBox) triviaFeedbackBox.style.display = 'block';
  };

  if (btnNextQuestion) {
    btnNextQuestion.addEventListener('click', () => {
      soundFX.click();
      currentQuestionIndex++;
      if (currentQuestionIndex < triviaQuestions.length) {
        renderTriviaQuestion(currentQuestionIndex);
      } else {
        showTriviaResults();
      }
    });
  }

  const showTriviaResults = () => {
    if (triviaGameView) triviaGameView.style.display = 'none';
    if (triviaResultsView) triviaResultsView.style.display = 'block';

    const correctCount = userScore / 100;
    if (resultsFinalScore) resultsFinalScore.textContent = `${correctCount}/${triviaQuestions.length}`;

    if (resultsRankBadge) {
      if (correctCount === 5) {
        resultsRankBadge.textContent = '🏆 Maestro de la Historiografía Infantil';
        if (resultsFeedbackComment) resultsFeedbackComment.textContent = '¡Rendimiento perfecto! Dominas con rigor epistemológico todos los paradigmas del Reto 2 de la UNAD.';
      } else if (correctCount >= 3) {
        resultsRankBadge.textContent = '🎓 Investigador Pedagógico Destacado';
        if (resultsFeedbackComment) resultsFeedbackComment.textContent = '¡Muy buen trabajo! Tienes bases sólidas sobre las transformaciones históricas de la niñez.';
      } else {
        resultsRankBadge.textContent = '🌱 Estudiante en Formación';
        if (resultsFeedbackComment) resultsFeedbackComment.textContent = 'Buen intento. Te sugerimos repasar las fichas 3D y la matriz comparativa para afianzar los conceptos.';
      }
    }

    soundFX.fanfare();
    launchConfetti();
  };

  if (btnRestartTrivia) {
    btnRestartTrivia.addEventListener('click', () => {
      soundFX.click();
      currentQuestionIndex = 0;
      userScore = 0;
      if (triviaLiveScore) triviaLiveScore.textContent = '0 pts';
      if (triviaResultsView) triviaResultsView.style.display = 'none';
      if (triviaGameView) triviaGameView.style.display = 'block';
      renderTriviaQuestion(0);
    });
  }

  renderTriviaQuestion(0);

  // --------------------------------------------------------------------------
  // 5.6 Confetti Celebration System (Canvas - Zero Dependency)
  // --------------------------------------------------------------------------
  const confettiCanvas = document.getElementById('confettiCanvas');

  const launchConfetti = () => {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#003366', '#1D70B8', '#E67E22', '#F39C12', '#10B981', '#F43F5E'];
    const particles = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: confettiCanvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: confettiCanvas.height * 0.4 + (Math.random() - 0.5) * 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.28,
        opacity: 1
      });
    }

    let animationFrameId;
    const startTime = performance.now();

    const animateConfetti = (currentTime) => {
      const elapsed = currentTime - startTime;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      let aliveCount = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.vx *= 0.98;

        if (elapsed > 1800) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0 && p.y < confettiCanvas.height + 50) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (aliveCount > 0 && elapsed < 4000) {
        animationFrameId = requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        cancelAnimationFrame(animationFrameId);
      }
    };

    animationFrameId = requestAnimationFrame(animateConfetti);
  };

  // --------------------------------------------------------------------------
  // 5.7 Quick Search Modal (Ctrl + K / Search Bar)
  // --------------------------------------------------------------------------
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResultsList = document.getElementById('searchResultsList');
  const btnSearchClose = document.getElementById('btnSearchClose');
  const btnSearchClear = document.getElementById('btnSearchClear');
  const quickTagChips = document.querySelectorAll('.quick-tag-chip');

  const searchIndex = [
    { title: "Philippe Ariès", type: "Autor Clave", era: "Edad Media", tab: "construccion-historica", eraPanel: "media", subtab: "media-autores", desc: "Historiador pionero que demostró la inexistencia del sentimiento de infancia en el medievo." },
    { title: "Jean-Jacques Rousseau", type: "Autor Clave", era: "Edad Moderna", tab: "construccion-historica", eraPanel: "moderna", subtab: "moderna-autores", desc: "Autor de Emilio (1762). Proclamó la bondad innata del niño y la educación negativa." },
    { title: "John Locke", type: "Autor Clave", era: "Edad Moderna", tab: "construccion-historica", eraPanel: "moderna", subtab: "moderna-autores", desc: "Pensamientos sobre la educación (1693). Postuló la mente como Tabula Rasa y rechazó el castigo físico." },
    { title: "Juan Amós Comenio", type: "Autor Clave", era: "Edad Moderna", tab: "construccion-historica", eraPanel: "moderna", subtab: "moderna-autores", desc: "Padre de la pedagogía moderna, autor de la Didáctica Magna y creador del Orbis Pictus." },
    { title: "Platón", type: "Autor Clave", era: "Edad Antigua", tab: "construccion-historica", eraPanel: "antigua", subtab: "antigua-autores", desc: "La República y Las Leyes. Propuso la educación asumida por el Estado desde la primera infancia." },
    { title: "Aristóteles", type: "Autor Clave", era: "Edad Antigua", tab: "construccion-historica", eraPanel: "antigua", subtab: "antigua-autores", desc: "Dividió el desarrollo en periodos septenarios; desaconsejó fatiga física hasta los 5 años." },
    { title: "Marco Fabio Quintiliano", type: "Autor Clave", era: "Edad Antigua", tab: "construccion-historica", eraPanel: "antigua", subtab: "antigua-autores", desc: "Institutio Oratoria. Rechazó los castigos corporales porque envilecen el espíritu infantil." },
    { title: "San Agustín de Hipona", type: "Autor Clave", era: "Edad Media", tab: "construccion-historica", eraPanel: "media", subtab: "media-autores", desc: "Confesiones. Fundamentó la doctrina de la fragilidad moral por el pecado original." },
    { title: "Santo Tomás de Aquino", type: "Autor Clave", era: "Edad Media", tab: "construccion-historica", eraPanel: "media", subtab: "media-autores", desc: "Suma Teológica. Planteó que la razón infantil se actualiza paulatinamente con la edad." },
    { title: "Adultocentrismo", type: "Categoría Teórica", era: "Transversal", tab: "construccion-historica", targetId: "fichas-conceptuales", desc: "Imposición del modelo y criterio adulto como medida universal de todas las cosas." },
    { title: "El niño Homúnculo", type: "Categoría Teórica", era: "Edad Media", tab: "construccion-historica", targetId: "fichas-conceptuales", desc: "Representación del infante como adulto en miniatura sin especificidad lúdica." },
    { title: "Tabula Rasa", type: "Categoría Teórica", era: "Edad Moderna", tab: "construccion-historica", targetId: "fichas-conceptuales", desc: "Metáfora del papel en blanco moldeado por la experiencia sensible y el hábito." },
    { title: "Pansofía", type: "Categoría Teórica", era: "Edad Moderna", tab: "construccion-historica", targetId: "fichas-conceptuales", desc: "Principio de Comenio: Enseñar todo a todos de forma natural y gradual." },
    { title: "Educación Negativa", type: "Categoría Teórica", era: "Edad Moderna", tab: "construccion-historica", targetId: "fichas-conceptuales", desc: "Preservar la naturaleza y sentidos del niño antes de imponer conceptos abstractos." },
    { title: "Satriano (2008)", type: "Autor Clave", era: "Contemporánea", tab: "construccion-historica", eraPanel: "contemporanea", subtab: "contemporanea-autores", desc: "Plantea la contingencia sociohistórica de las infancias y la necesidad de pensar las infancias en plural." },
    { title: "Chica & Rasero", type: "Autor Clave", era: "Contemporánea", tab: "construccion-historica", eraPanel: "contemporanea", subtab: "contemporanea-autores", desc: "Enfoque crítico decolonial sobre las infancias situadas y el protagonismo infantil." },
    { title: "Sujeto de Derechos", type: "Categoría Teórica", era: "Contemporánea", tab: "construccion-historica", eraPanel: "contemporanea", subtab: "contemporanea-crianza", desc: "Paradigma de la CDN de 1989: el niño como ciudadano activo con voz vinculante." },
    { title: "Ley 2089 de 2021", type: "Normativa Colombiana", era: "Contemporánea", tab: "construccion-historica", targetId: "reflexion-critica", desc: "Ley que prohíbe el castigo físico, los tratos crueles, humillantes o degradantes en Colombia." },
    { title: "Matriz Comparativa", type: "Herramienta", era: "Comparativa", tab: "construccion-historica", targetId: "fichas-conceptuales", desc: "Cuadro comparativo entre Edad Antigua, Media y Moderna." },
    { title: "Trivia del Reto 2", type: "Evaluación Lúdica", era: "Gamificación", tab: "construccion-historica", targetId: "trivia-reto2", desc: "Cuestionario interactivo de 5 preguntas para evaluar el conocimiento del Reto 2." }
  ];

  const openSearchModal = () => {
    if (!searchModal) return;
    soundFX.click();
    searchModal.style.display = 'flex';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    renderSearchResults('');
  };

  const closeSearchModal = () => {
    if (!searchModal) return;
    searchModal.style.display = 'none';
  };

  if (btnOpenSearch) {
    btnOpenSearch.addEventListener('click', openSearchModal);
  }

  if (btnSearchClose) {
    btnSearchClose.addEventListener('click', closeSearchModal);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape' && searchModal && searchModal.style.display !== 'none') {
      closeSearchModal();
    }
  });

  const renderSearchResults = (query) => {
    if (!searchResultsList) return;
    const cleanQuery = query.toLowerCase().trim();

    const filtered = searchIndex.filter(item => {
      if (!cleanQuery) return true;
      return (
        item.title.toLowerCase().includes(cleanQuery) ||
        item.type.toLowerCase().includes(cleanQuery) ||
        item.era.toLowerCase().includes(cleanQuery) ||
        item.desc.toLowerCase().includes(cleanQuery)
      );
    });

    if (btnSearchClear) {
      btnSearchClear.style.display = cleanQuery ? 'block' : 'none';
    }

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--color-text-muted);">
          No se encontraron resultados para "${query}". Prueba con autores como Locke, Rousseau, Comenio o Ariès.
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = '';
    filtered.slice(0, 6).forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'search-result-item';
      itemEl.setAttribute('role', 'option');
      itemEl.innerHTML = `
        <div>
          <div class="result-main-text">${item.title}</div>
          <div class="result-context-text">${item.desc}</div>
        </div>
        <span class="result-era-badge badge-antigua">${item.era}</span>
      `;

      itemEl.addEventListener('click', () => {
        soundFX.click();
        closeSearchModal();
        navigateToSearchResult(item);
      });

      searchResultsList.appendChild(itemEl);
    });
  };

  const navigateToSearchResult = (item) => {
    switchTab(item.tab);

    setTimeout(() => {
      if (item.eraPanel) {
        selectTimelineEra(item.eraPanel, false);
      }

      if (item.subtab) {
        const subtabBtn = document.querySelector(`.subtab-btn[data-subtab="${item.subtab}"]`);
        if (subtabBtn) subtabBtn.click();
      }

      let targetEl = null;
      if (item.targetId) {
        targetEl = document.getElementById(item.targetId);
      } else if (item.subtab) {
        targetEl = document.getElementById(`subtab-${item.subtab}`);
      } else if (item.eraPanel) {
        targetEl = document.getElementById(`panel-${item.eraPanel}`);
      }

      if (targetEl) {
        const headerOffset = 100;
        const elemPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elemPos - headerOffset, behavior: 'smooth' });
        targetEl.classList.remove('highlight-pulse');
        void targetEl.offsetWidth;
        targetEl.classList.add('highlight-pulse');
      }
    }, 150);
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  if (btnSearchClear) {
    btnSearchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults('');
      }
    });
  }

  quickTagChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query') || '';
      if (searchInput) {
        searchInput.value = q;
        searchInput.focus();
        renderSearchResults(q);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Direct Navigation Shortcuts & Hero Jump Buttons
  // --------------------------------------------------------------------------
  if (btnExploreTimeline) {
    btnExploreTimeline.addEventListener('click', () => {
      soundFX.click();
      switchTab('construccion-historica');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (btnHeroTrivia) {
    btnHeroTrivia.addEventListener('click', () => {
      soundFX.click();
      switchTab('construccion-historica');
      setTimeout(() => {
        const target = document.getElementById('trivia-reto2');
        if (target) {
          const headerOffset = 100;
          const pos = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: pos - headerOffset, behavior: 'smooth' });
        }
      }, 150);
    });
  }

  if (btnHeroFlashcards) {
    btnHeroFlashcards.addEventListener('click', () => {
      soundFX.click();
      switchTab('construccion-historica');
      setTimeout(() => {
        const target = document.getElementById('fichas-conceptuales');
        if (target) {
          const headerOffset = 100;
          const pos = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: pos - headerOffset, behavior: 'smooth' });
        }
      }, 150);
    });
  }

  journeyEraButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundFX.click();
      const targetEra = btn.getAttribute('data-jump-era');
      switchTab('construccion-historica');
      selectTimelineEra(targetEra, true);
    });
  });

  jumpTabButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      soundFX.click();
      const targetTab = btn.getAttribute('data-jump-tab');
      switchTab(targetTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (backToTopLink) {
    backToTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      soundFX.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Initial State Initialization from URL Hash
  // --------------------------------------------------------------------------
  const initialHash = window.location.hash.replace('#', '').trim();
  if (initialHash && validTabs.includes(initialHash)) {
    switchTab(initialHash, false);
  } else {
    switchTab('inicio', false);
  }

  // ==========================================================================
  // 8. "El Probador del Tiempo" (Vestidor Interactivo de Muñequito)
  // ==========================================================================
  const wardrobeData = {
    antigua: {
      speaker: 'Tomi en la Edad Antigua (Grecia y Roma)',
      speech: '«¡Por los dioses del Olimpo! En la Antigua Roma dependemos por completo del pater familias. Si el padre no nos levantaba en el ritual del tollere liberum, podíamos ser abandonados. ¡Tócame o cámbiame de época para ver cómo me transformo!»',
      clothing: 'Túnica ligera de lino blanco (quitón) y sandalias de tiras de cuero. No existía ropa infantil diferenciada.',
      games: 'A las tabas (huesecillos), muñecas de terracota, peonzas y aros de bronce.',
      perception: 'Propiedad de la familia y el Estado. La infancia era una etapa frágil de sumisión sin derechos civiles propios.',
      milestone: 'Platón y Quintiliano: formación moral e inicio del debate sobre la disciplina del futuro ciudadano.',
      audio: 'En la Edad Antigua, los niños dependíamos de la patria potestad del padre y del Estado. Jugábamos con tabas y peonzas.'
    },
    media: {
      speaker: 'Tomi como el Pequeño Homúnculo (Edad Media)',
      speech: '«¡Uf, este jubón medieval me aprieta! Philippe Ariès descubrió que en el arte medieval nos representaban como adultos en miniatura. Desde los 7 años nos enviaban a talleres gremiales o al campo como aprendices.»',
      clothing: 'Jubón rígido, calzas gruesas, cofia de tela y cinto de trabajo. Nos vestían exactamente como adultos en pequeño.',
      games: 'Casi no había juegos propios para niños. Compartíamos el espacio colectivo sin una etapa de inocencia reservada.',
      perception: 'El niño como adulto en miniatura (homúnculo), marcado por el dogma del pecado original que requería severa disciplina.',
      milestone: 'San Agustín y la doctrina de redención; Santo Tomás y la formación escolástica gremial.',
      audio: 'En la Edad Media éramos vistos como adultos pequeños u homúnculos. Nos vestían como adultos y trabajábamos desde niños.'
    },
    moderna: {
      speaker: 'Tomi con Rousseau y Comenio (Edad Moderna)',
      speech: '«¡Qué alegría! En los siglos XVII y XVIII, Juan Amós Comenio creó el Orbis Pictus con hermosos dibujos para aprender jugando, y Jean-Jacques Rousseau proclamó: ¡Dejad que los niños maduren en los niños!»',
      clothing: 'Camisa blanca holgada, pantalón corto cómodo y sombrero de paja. Nace la ropa diseñada específicamente para la niñez.',
      games: 'Cometas de colores, trompos, paseos por la naturaleza, exploración científica y cuentos ilustrados.',
      perception: 'Se descubre la infancia como una etapa sagrada y pura. John Locke plantea la mente como una tabula rasa lista para aprender.',
      milestone: 'Rousseau publica Emilio (1762) y Comenio funda la didáctica moderna con el Orbis Sensualium Pictus.',
      audio: 'En la Edad Moderna nace el sentimiento de infancia. Rousseau defendió nuestro derecho a jugar y aprender en la naturaleza.'
    },
    contemporanea: {
      speaker: 'Tomi: Sujeto Pleno de Derechos (Siglo XXI)',
      speech: '«¡Hoy celebramos la gran conquista histórica! Ya no somos propiedad de nadie ni adultos incompletos: somos sujetos plenos de derechos. La Convención de 1989 y la Ley 1098 de Colombia nos garantizan voz, protección y libertad para soñar.»',
      clothing: 'Ropa colorida moderna, zapatillas deportivas, gorra y mochila escolar. Libertad y comodidad para expresarse.',
      games: 'Juegos cooperativos, deportes, arte, lectura libre, robótica y recreación comunitaria.',
      perception: 'Sujetos titulares de derechos prevalentes (Art. 44 Constitución de Colombia). Principio rector del Interés Superior del Niño.',
      milestone: 'Convención de los Derechos del Niño (1989), Ley 1098 de 2006 (Código de Infancia) y Ley 2089 de 2021 (Cero Castigo Físico).',
      audio: 'Hoy somos reconocidos como sujetos de derechos. La ley nos protege para opinar, estudiar, jugar y vivir en paz y sin violencia.'
    }
  };

  const characterDoll = document.getElementById('characterDoll');
  const btnTickleDoll = document.getElementById('btnTickleDoll');
  const wardrobeButtons = document.querySelectorAll('.wardrobe-era-btn');
  const wardrobeSpeaker = document.getElementById('wardrobeSpeaker');
  const wardrobeSpeechText = document.getElementById('wardrobeSpeechText');
  const factClothing = document.getElementById('factClothing');
  const factGames = document.getElementById('factGames');
  const factPerception = document.getElementById('factPerception');
  const factMilestone = document.getElementById('factMilestone');
  const btnMagicWardrobeTour = document.getElementById('btnMagicWardrobeTour');
  const btnSpeakWardrobe = document.getElementById('btnSpeakWardrobe');

  let currentWardrobeEra = 'antigua';

  const setWardrobeEra = (eraKey, playSound = true) => {
    if (!wardrobeData[eraKey]) return;
    currentWardrobeEra = eraKey;

    if (playSound) soundFX.magic();

    // Update buttons
    wardrobeButtons.forEach((btn) => {
      if (btn.getAttribute('data-era') === eraKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Costume Layers in SVG
    const costumeLayers = {
      antigua: document.getElementById('costumeAntigua'),
      media: document.getElementById('costumeMedia'),
      moderna: document.getElementById('costumeModerna'),
      contemporanea: document.getElementById('costumeContemporanea')
    };

    Object.keys(costumeLayers).forEach((key) => {
      const layer = costumeLayers[key];
      if (layer) {
        layer.style.display = key === eraKey ? 'inline' : 'none';
      }
    });

    // Jump doll animation
    if (characterDoll) {
      characterDoll.classList.remove('jumping');
      void characterDoll.offsetWidth;
      characterDoll.classList.add('jumping');
    }

    // Update details card and speech bubble
    const data = wardrobeData[eraKey];
    if (wardrobeSpeaker) wardrobeSpeaker.textContent = data.speaker;
    if (wardrobeSpeechText) wardrobeSpeechText.textContent = data.speech;
    if (factClothing) factClothing.textContent = data.clothing;
    if (factGames) factGames.textContent = data.games;
    if (factPerception) factPerception.innerHTML = data.perception;
    if (factMilestone) factMilestone.textContent = data.milestone;
  };

  wardrobeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const era = btn.getAttribute('data-era');
      setWardrobeEra(era, true);
    });
  });

  const tickleDoll = () => {
    soundFX.boing();
    if (characterDoll) {
      characterDoll.classList.remove('jumping');
      void characterDoll.offsetWidth;
      characterDoll.classList.add('jumping');
    }

    const tickleQuotes = [
      '«¡Jajajaja, eso hace cosquillas! ¡Me encanta viajar en el tiempo contigo!»',
      '«¡Boing! ¡Listo para aprender más sobre la historia de los niños y niñas!»',
      '«¡Yupi! ¡Cada época nos enseña algo nuevo para valorar nuestros derechos!»',
      '«¡Jajaja! ¿Probaste cambiarme de atuendo? ¡Mira cómo vestía en la Edad Media!»'
    ];
    const randomQuote = tickleQuotes[Math.floor(Math.random() * tickleQuotes.length)];
    if (wardrobeSpeechText) {
      wardrobeSpeechText.textContent = randomQuote;
    }
  };

  if (characterDoll) characterDoll.addEventListener('click', tickleDoll);
  if (btnTickleDoll) btnTickleDoll.addEventListener('click', tickleDoll);

  // Auto magic tour through eras
  let magicTourInterval = null;
  if (btnMagicWardrobeTour) {
    btnMagicWardrobeTour.addEventListener('click', () => {
      soundFX.magic();
      if (magicTourInterval) {
        clearInterval(magicTourInterval);
        magicTourInterval = null;
        btnMagicWardrobeTour.querySelector('span').textContent = '✨ Viaje Mágico por el Tiempo';
        return;
      }

      btnMagicWardrobeTour.querySelector('span').textContent = '⏸ Pausar Viaje Mágico';
      const eras = ['antigua', 'media', 'moderna', 'contemporanea'];
      let idx = eras.indexOf(currentWardrobeEra);

      magicTourInterval = setInterval(() => {
        idx = (idx + 1) % eras.length;
        setWardrobeEra(eras[idx], true);
      }, 3200);
    });
  }

  // Voice narration for wardrobe
  if (btnSpeakWardrobe) {
    btnSpeakWardrobe.addEventListener('click', () => {
      soundFX.click();
      if (!window.speechSynthesis) return;

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btnSpeakWardrobe.querySelector('span').textContent = '🎙️ Escuchar a Tomi hablar';
        return;
      }

      const text = wardrobeData[currentWardrobeEra].audio;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.96;
      utterance.pitch = 1.15;

      utterance.onstart = () => {
        btnSpeakWardrobe.querySelector('span').textContent = '⏹ Detener voz';
        if (characterDoll) characterDoll.classList.add('jumping');
      };
      utterance.onend = () => {
        btnSpeakWardrobe.querySelector('span').textContent = '🎙️ Escuchar a Tomi hablar';
        if (characterDoll) characterDoll.classList.remove('jumping');
      };
      utterance.onerror = () => {
        btnSpeakWardrobe.querySelector('span').textContent = '🎙️ Escuchar a Tomi hablar';
        if (characterDoll) characterDoll.classList.remove('jumping');
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // ==========================================================================
  // 9. Mascota Flotante Guía "Tomi"
  // ==========================================================================
  const tomiTips = [
    {
      badge: '💡 ¿Sabías esto?',
      text: '¡En la Edad Antigua, los juguetes como pelotas y muñecas de terracota se ofrendaban a los dioses antes de casarse para simbolizar el fin de la niñez!',
      audio: '¿Sabías que en la Edad Antigua los juguetes como muñecas de terracota se ofrendaban a los dioses para despedir la niñez?'
    },
    {
      badge: '📜 Dato Curioso',
      text: 'Philippe Ariès demostró que en el siglo XII no había palabras para diferenciar a un niño de 8 años de un joven de 16: ¡todos eran clasificados como adultos jóvenes!',
      audio: 'Philippe Ariès demostró que en el siglo doce no existían términos claros para distinguir a un niño de un adulto joven.'
    },
    {
      badge: '🎨 ¡Gran Invento!',
      text: 'El libro "Orbis Sensualium Pictus" de Comenio (1658) fue la primera enciclopedia infantil ilustrada con dibujos para aprender jugando y mirando.',
      audio: 'El libro Orbis Pictus de Comenio en 1658 fue la primera enciclopedia infantil con dibujos para aprender jugando.'
    },
    {
      badge: '🌿 Pensamiento Clave',
      text: 'John Locke propuso que la mente del niño es una "tabula rasa" (papel en blanco). ¡Todo lo que aprendemos viene de las experiencias y el amor con que nos enseñan!',
      audio: 'John Locke propuso que la mente del niño es una tabula rasa, un papel en blanco que aprende de la experiencia.'
    },
    {
      badge: '🇨🇴 Orgullo Colombiano',
      text: 'En Colombia, la Ley 2089 de 2021 prohibió definitivamente el uso del castigo físico y tratos humillantes. ¡La educación debe ser con ternura y respeto!',
      audio: 'En Colombia, la Ley 2089 de 2021 prohibió el uso del castigo físico. La educación debe ser con ternura y respeto.'
    }
  ];

  let currentTomiTipIndex = 0;
  const mascotBubble = document.getElementById('mascotBubble');
  const mascotBadge = document.getElementById('mascotBadge');
  const mascotBubbleText = document.getElementById('mascotBubbleText');
  const btnMascotAvatar = document.getElementById('btnMascotAvatar');
  const btnMascotClose = document.getElementById('btnMascotClose');
  const btnMascotSpeak = document.getElementById('btnMascotSpeak');
  const btnMascotNext = document.getElementById('btnMascotNext');

  const showTomiTip = (index) => {
    currentTomiTipIndex = index % tomiTips.length;
    const tip = tomiTips[currentTomiTipIndex];

    if (mascotBadge) mascotBadge.textContent = tip.badge;
    if (mascotBubbleText) mascotBubbleText.innerHTML = tip.text;

    if (mascotBubble) {
      mascotBubble.classList.add('active');
    }

    if (btnMascotAvatar) {
      btnMascotAvatar.classList.remove('jumping');
      void btnMascotAvatar.offsetWidth;
      btnMascotAvatar.classList.add('jumping');
    }
  };

  if (btnMascotAvatar) {
    btnMascotAvatar.addEventListener('click', () => {
      soundFX.boing();
      if (!mascotBubble.classList.contains('active')) {
        mascotBubble.classList.add('active');
      } else {
        showTomiTip(currentTomiTipIndex + 1);
      }
    });
  }

  if (btnMascotClose) {
    btnMascotClose.addEventListener('click', (e) => {
      e.stopPropagation();
      soundFX.click();
      if (mascotBubble) mascotBubble.classList.remove('active');
    });
  }

  if (btnMascotNext) {
    btnMascotNext.addEventListener('click', (e) => {
      e.stopPropagation();
      soundFX.giggle();
      showTomiTip(currentTomiTipIndex + 1);
    });
  }

  if (btnMascotSpeak) {
    btnMascotSpeak.addEventListener('click', (e) => {
      e.stopPropagation();
      soundFX.click();
      if (!window.speechSynthesis) return;

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btnMascotSpeak.querySelector('span').textContent = '🔊 Escuchar';
        return;
      }

      const text = tomiTips[currentTomiTipIndex].audio;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.2;

      utterance.onstart = () => {
        btnMascotSpeak.querySelector('span').textContent = '⏹ Detener';
        if (btnMascotAvatar) btnMascotAvatar.classList.add('jumping');
      };
      utterance.onend = () => {
        btnMascotSpeak.querySelector('span').textContent = '🔊 Escuchar';
        if (btnMascotAvatar) btnMascotAvatar.classList.remove('jumping');
      };
      utterance.onerror = () => {
        btnMascotSpeak.querySelector('span').textContent = '🔊 Escuchar';
        if (btnMascotAvatar) btnMascotAvatar.classList.remove('jumping');
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // ==========================================================================
  // 10. Coro de Niños Sujetos de Derechos
  // ==========================================================================
  const chorusCards = document.querySelectorAll('.chorus-kid-card');
  chorusCards.forEach((card) => {
    card.addEventListener('click', () => {
      soundFX.boing();
      card.classList.remove('jumping');
      void card.offsetWidth;
      card.classList.add('jumping');

      const audioText = card.getAttribute('data-kid-audio');
      if (audioText && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(audioText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.98;
        utterance.pitch = 1.25;
        window.speechSynthesis.speak(utterance);
      }
    });
  });

  // ==========================================================================
  // 11. Viñetas de Historieta Cómic Interactivas
  // ==========================================================================
  const comicButtons = document.querySelectorAll('.comic-interactive-btn');
  comicButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundFX.giggle();
      const quote = btn.getAttribute('data-quote');
      if (quote && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        const cleanText = quote.replace(/[«»]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    });
  });

  // ==========================================================================
  // 12. Cápsulas Epistémicas de Debate Historiográfico (Audio Narrado)
  // ==========================================================================
  const capsuleAudioButtons = document.querySelectorAll('.capsule-audio-btn');
  capsuleAudioButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundFX.click();
      const capsule = btn.closest('.epistemic-capsule-card');
      if (!capsule) return;
      const title = capsule.querySelector('.capsule-title')?.textContent || '';
      const question = capsule.querySelector('.capsule-question')?.textContent || '';
      const textToRead = `${title}. ${question}`;
      if (window.speechSynthesis) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          return;
        }
        const cleanText = textToRead.replace(/[🏛️🏰]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    });
  });

  // ==========================================================================
  // 13. Lightbox Modal para Infografía de Línea de Tiempo
  // ==========================================================================
  const timelineLightboxModal = document.getElementById('timelineLightboxModal');
  const btnZoomTimeline = document.getElementById('btnZoomTimeline');
  const timelineMediaClickable = document.getElementById('timelineMediaClickable');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  const openTimelineLightbox = () => {
    if (!timelineLightboxModal) return;
    soundFX.click();
    timelineLightboxModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeTimelineLightbox = () => {
    if (!timelineLightboxModal) return;
    timelineLightboxModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  if (btnZoomTimeline) btnZoomTimeline.addEventListener('click', openTimelineLightbox);
  if (timelineMediaClickable) timelineMediaClickable.addEventListener('click', openTimelineLightbox);
  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeTimelineLightbox);

  if (timelineLightboxModal) {
    timelineLightboxModal.addEventListener('click', (e) => {
      if (e.target === timelineLightboxModal) {
        closeTimelineLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && timelineLightboxModal && timelineLightboxModal.style.display === 'flex') {
      closeTimelineLightbox();
    }
  });

  // Delegated handler for all data-jump-era buttons (including 4 flow cards)
  document.addEventListener('click', (e) => {
    const jumpEraBtn = e.target.closest('[data-jump-era]');
    if (jumpEraBtn) {
      soundFX.click();
      const targetEra = jumpEraBtn.getAttribute('data-jump-era');
      switchTab('construccion-historica');
      selectTimelineEra(targetEra, true);
    }
  });

  updateTimelineProgress('antigua');
  updateReadingProgressBar();
});
