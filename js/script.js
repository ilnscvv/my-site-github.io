(function() {
  // Тёмная тема
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#themeToggleMenu i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
  
  setTheme(savedTheme);
  
  const themeToggleBtn = document.getElementById('themeToggleMenu');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  }

  // Бургер-меню
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  function openMenu() {
    navMenu.classList.add('active');
    menuOverlay.classList.add('active');
  }
  
  function closeMenu() {
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(el => {
    el.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Hero — плавное появление
  const hero = document.getElementById('hero');
  setTimeout(() => {
    if (hero) hero.classList.add('visible');
  }, 100);

  // Параллакс
  const bg = document.getElementById('parallaxBg');
  window.addEventListener('scroll', () => {
    if (bg) {
      bg.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
    }
  });

  // ⭐ ИСПРАВЛЕНО: плавность при скролле в обе стороны (с задержкой и плавным переходом)
  const fadeElements = document.querySelectorAll('.fade-up');
  
  // Функция для проверки видимости элемента с учётом порога
  function isElementInViewport(el, threshold = 0.15) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const elementHeight = rect.height;
    const visiblePart = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleRatio = visiblePart / elementHeight;
    return visibleRatio >= threshold;
  }

  // Функция обновления классов с плавностью
  function updateFadeVisibility() {
    fadeElements.forEach(el => {
      const isVisible = isElementInViewport(el, 0.15);
      if (isVisible) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  // Используем requestAnimationFrame для плавности
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateFadeVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Также проверяем при загрузке и при ресайзе
  window.addEventListener('resize', () => {
    updateFadeVisibility();
  });
  
  // Запускаем первую проверку
  setTimeout(updateFadeVisibility, 100);

  // Слайдер отзывов
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('dotsContainer');
  const slides = document.querySelectorAll('.review-card');
  let currentIndex = 0;

  function updateSlider(index) {
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  if (dotsContainer && slides.length > 0) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider(currentIndex);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function nextSlide() {
    if (slides.length === 0) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider(currentIndex);
  }

  function prevSlide() {
    if (slides.length === 0) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider(currentIndex);
  }

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
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

  let autoPlayInterval = setInterval(nextSlide, 4000);

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  // Валидация формы
  const submitBtn = document.getElementById('submitFormBtn');
  const successMsg = document.getElementById('successMessage');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function hideAllErrors() {
    if (nameError) nameError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (messageError) messageError.style.display = 'none';
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllErrors();
      if (successMsg) successMsg.style.display = 'none';
      
      let isValid = true;

      if (nameInput && nameInput.value.trim().length < 2) {
        if (nameError) nameError.style.display = 'block';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value.trim())) {
        if (emailError) emailError.style.display = 'block';
        isValid = false;
      }

      if (messageInput && messageInput.value.trim() === '') {
        if (messageError) messageError.style.display = 'block';
        isValid = false;
      }

      if (isValid && successMsg) {
        successMsg.style.display = 'block';
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';
        
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
          if (successMsg) successMsg.style.display = 'none';
        }, 5000);
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2 && nameError) {
        nameError.style.display = 'none';
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailInput.value.trim()) && emailError) {
        emailError.style.display = 'none';
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim() !== '' && messageError) {
        messageError.style.display = 'none';
      }
    });
  }
})();

// Плавный скролл ко всем якорным ссылкам
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Пульсация главной кнопки при загрузке
const mainBtn = document.querySelector('.btn');
if (mainBtn) {
  mainBtn.style.animation = 'pulse 2s ease-in-out 1s 2';
}

// Эффект печатной машинки для подзаголовка
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
  const text = subtitle.textContent;
  subtitle.textContent = '';
  subtitle.style.borderRight = '2px solid white';
  let i = 0;
  
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        subtitle.textContent += text[i];
        i++;
      } else {
        clearInterval(typeInterval);
        subtitle.style.borderRight = 'none';
      }
    }, 40);
  }, 800);
}

// Анимация при наведении на контакты в футере
document.querySelectorAll('.footer-col p i').forEach(icon => {
  icon.style.transition = 'transform 0.3s';
  icon.addEventListener('mouseenter', () => {
    icon.style.transform = 'scale(1.3) rotate(10deg)';
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Гироскопический эффект для hero-изображения (на мобилках)
if (window.DeviceOrientationEvent && window.innerWidth <= 768) {
  window.addEventListener('deviceorientation', (e) => {
    const bg = document.getElementById('parallaxBg');
    if (bg) {
      const x = e.gamma / 30;
      const y = e.beta / 30;
      bg.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(1.05)`;
    }
  });
}

// Подсветка активного пункта меню при скролле
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.fontWeight = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--accent)';
      link.style.fontWeight = '700';
    }
  });
});

// Ripple-эффект на кнопках
document.querySelectorAll('.btn, .submit-btn, .sov-card-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      width: 20px;
      height: 20px;
      left: ${e.clientX - rect.left - 10}px;
      top: ${e.clientY - rect.top - 10}px;
      animation: rippleEffect 0.6s linear;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});