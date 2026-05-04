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
 // ========== БЕСКОНЕЧНЫЙ СЛАЙДЕР ==========
const track = document.getElementById('sliderTrack');
const dotsContainer = document.getElementById('dotsContainer');
const slides = document.querySelectorAll('.review-card');
let currentIndex = 0;
let autoPlayInterval;

if (track && slides.length > 0) {
  // Клонируем первый и последний слайды для бесконечности
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  
  // Добавляем клоны в начало и конец
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);
  
  // Обновляем коллекцию слайдов
  const allSlides = document.querySelectorAll('.review-card');
  const totalSlides = allSlides.length;
  const realSlidesCount = slides.length;
  
  // Сдвигаем позицию на 1 (из-за клона в начале)
  track.style.transform = `translateX(-100%)`;
  currentIndex = 1;
  
  // Функция переключения без рывков
  function goToSlide(index, animate = true) {
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s ease-out';
    }
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Обновляем активную точку
    let activeDotIndex = index - 1;
    if (activeDotIndex < 0) activeDotIndex = realSlidesCount - 1;
    if (activeDotIndex >= realSlidesCount) activeDotIndex = 0;
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });
  }
  
  // Обработчик перехода для бесконечности
  function handleTransitionEnd() {
    track.style.transition = 'transform 0.5s ease-out';
    if (currentIndex === 0) {
      // Перепрыгиваем на настоящий последний слайд
      track.style.transition = 'none';
      currentIndex = realSlidesCount;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else if (currentIndex === totalSlides - 1) {
      // Перепрыгиваем на настоящий первый слайд
      track.style.transition = 'none';
      currentIndex = 1;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }
  
  function nextSlide() {
    if (currentIndex >= totalSlides - 1) {
      currentIndex = totalSlides - 1;
      goToSlide(currentIndex);
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease-out';
        }, 50);
      }, 500);
    } else {
      currentIndex++;
      goToSlide(currentIndex);
    }
  }
  
  function prevSlide() {
    if (currentIndex <= 0) {
      currentIndex = 0;
      goToSlide(currentIndex);
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = realSlidesCount;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease-out';
        }, 50);
      }, 500);
    } else {
      currentIndex--;
      goToSlide(currentIndex);
    }
  }
  
  track.addEventListener('transitionend', handleTransitionEnd);
  
  // Создание точек (только для реальных слайдов)
  dotsContainer.innerHTML = '';
  for (let i = 0; i < realSlidesCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      currentIndex = i + 1;
      goToSlide(currentIndex);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  }
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 4000);
  }
  
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  
  // Кнопки
  document.getElementById('nextBtn').addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
  document.getElementById('prevBtn').addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
  
  startAutoPlay();
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

// ========== ИНТЕРАКТИВНАЯ КАРТА С МАРКЕРАМИ (исправленные координаты) ==========
function initMap() {
  const mapContainer = document.getElementById('interactiveMap');
  if (!mapContainer) {
    console.error('Контейнер карты не найден!');
    return;
  }
  
  // ПРАВИЛЬНЫЕ координаты достопримечательностей Астрахани
  const attractions = [
    { 
      coords: [46.349740, 48.031002], 
      name: 'Астраханский Кремль', 
      desc: 'Белокаменная крепость XVI века. Главная достопримечательность города.',
      icon: 'islands#redCircleIcon'
    },
    { 
      
      coords: [46.348969, 48.042704], 
      name: 'Дом Карягина', 
      desc: 'Старинный купеческий дом XIX века с уникальной архитектурой.',
      icon: 'islands#blueCircleIcon'
    },
    { 
      coords: [46.349312, 48.038742], 
      name: 'Улица Советская', 
      desc: 'Центральная улица Астрахани, сердце города.',
      icon: 'islands#purpleCircleIcon'
    },
    { 
      coords: [46.349118, 48.039168], 
      name: 'Персидское торговое подворье', 
      desc: 'Персидское торговое подворье — это историческое здание, расположенное в центре Астрахани. Оно было построено в 1852-1863 годах персидским купцом Аджи Усейновым',
      icon: 'islands#greenCircleIcon'
    },
    { 
      coords: [46.349783, 48.041751], 
      name: 'Историко-архитектурный музей-заповедник', 
      desc: 'Астраханский историко-архитектурный музей-заповедник — это старейший из региональных музеев России. Он был открыт в 1837 году как «Губернский музеум».',
      icon: 'islands#yellowCircleIcon'
    },
    { 
      coords: [46.348573, 48.044364], 
      name: 'Астраханский драматический театр', 
      desc: 'Один из старейших театров России, основан в 1810 году.',
      icon: 'islands#orangeCircleIcon'
    },
    { 
      coords: [46.349051, 48.040568], 
      name: 'Губернское правление', 
      desc: 'Аминистративное здание XIX века, располагавшееся на Советской улице (ранее — Московская улица), где размещалась высшая исполнительная власть Астраханской губернии.',
      icon: 'islands#pinkCircleIcon'
    },


  ];
  
  // Создание карты с центром на Советской улице
  const map = new ymaps.Map('interactiveMap', {
    center: [46.349366, 48.037836],
    zoom: 16,
    controls: ['zoomControl', 'fullscreenControl', 'typeSelector']
  });
  
  // Добавляем маркеры
  attractions.forEach(attraction => {
    const marker = new ymaps.Placemark(
      attraction.coords,
      {
        balloonContentHeader: `<b>${attraction.name}</b>`,
        balloonContentBody: attraction.desc,
        balloonContentFooter: '<i>📍 Астрахань, улица Советская</i>',
        hintContent: attraction.name
      },
      { 
        preset: attraction.icon,
        balloonMaxWidth: 250
      }
    );
    map.geoObjects.add(marker);
  });
  
  // Добавляем масштабирование
  map.behaviors.enable('scrollZoom');
  
  console.log('Карта загружена, добавлено маркеров:', attractions.length);
}

// Ждём загрузки API
if (typeof ymaps !== 'undefined') {
  ymaps.ready(initMap);
} else {
  console.error('API Яндекс.Карт не загрузился. Проверьте ключ.');
  const mapContainer = document.getElementById('interactiveMap');
  if (mapContainer) {
    mapContainer.innerHTML = '<iframe src="https://yandex.ru/map-widget/v1/?ll=48.0395%2C46.3493&z=16&pt=48.0395,46.3493,pm2rdl&l=map&lang=ru_RU" style="width:100%;height:100%;border:none;"></iframe>';
  }
}

// ========== ЛЕНИВАЯ ЗАГРУЗКА ФОНОВЫХ ИЗОБРАЖЕНИЙ ==========
(function lazyBackgrounds() {
  // Все элементы с фоновыми изображениями, которые нужно загружать лениво
  const lazyBackgrounds = document.querySelectorAll('.sov-card, .pricing-hero');
  
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          // Фон уже есть в style, просто наблюдаем
          bgObserver.unobserve(element);
        }
      });
    }, { threshold: 0.1, rootMargin: '100px' });
    
    lazyBackgrounds.forEach(el => bgObserver.observe(el));
    console.log('✅ Ленивая загрузка фонов включена, элементов:', lazyBackgrounds.length);
  }
})();

// Ленивая загрузка карточек с фоновыми изображениями
(function lazyCards() {
  const cards = document.querySelectorAll('.card-img');
  
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          // Фон уже задан в style, просто отмечаем как загруженный
          cardObserver.unobserve(card);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });
    
    cards.forEach(card => cardObserver.observe(card));
    console.log('✅ Ленивая загрузка карточек включена, элементов:', cards.length);
  }
})();
