// סיבוב הטלפון והחלפת צדדים
const scene = document.getElementById('scene');
const phone = document.getElementById('phone');
const socialLinks = document.querySelector('.social-links');
const faces = document.querySelectorAll('.phone-face');
let currentRotation = 0;
let currentFace = 0;

if (phone) {
  phone.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      // במובייל, פשוט החלף בין הצדדים
      faces.forEach(face => face.classList.toggle('active'));
    } else {
      // במחשב, המשך עם הסיבוב הרגיל
      currentFace = (currentFace + 1) % faces.length;
      currentRotation -= 180;
      updatePhoneRotation(0, 0);
      updateActiveFace();
    }
  });
}

function updatePhoneRotation(rotateX, rotateY) {
  if (window.innerWidth <= 768) {
    // אין סיבוב במובייל
    return;
  }
  if (phone) {
    phone.style.transform = `rotateY(${currentRotation + rotateY}deg) rotateX(${rotateX}deg) translateZ(50px)`;
  }
  if (socialLinks) {
    socialLinks.style.transform = `translateX(-50%) translateZ(80px) rotateY(${currentRotation + rotateY}deg) rotateX(${rotateX}deg)`;
  }
}

function updateActiveFace() {
  faces.forEach((face, index) => {
    if (index === currentFace) {
      face.classList.add('active');
    } else {
      face.classList.remove('active');
    }
  });
}

function handleTouchMove(event) {
  if (window.innerWidth <= 1080) {
    // מבטל את הסיבוב במסכים קטנים
    return;
  }
  const touch = event.touches[0];
  const { clientX, clientY } = touch;
  const { innerWidth, innerHeight } = window;
  
  const rotateY = ((clientX - innerWidth / 2) / (innerWidth / 2)) * 20;
  const rotateX = ((clientY - innerHeight / 2) / (innerHeight / 2)) * -20;
  
  updatePhoneRotation(rotateX, rotateY);
}

if ('ontouchstart' in window) {
  document.addEventListener('touchmove', handleTouchMove);
} else {
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const rotateY = ((clientX - innerWidth / 2) / (innerWidth / 2)) * 20;
    const rotateX = ((clientY - innerHeight / 2) / (innerHeight / 2)) * -20;
    
    updatePhoneRotation(rotateX, rotateY);
  });
}

updateActiveFace();

// טופס יצירת קשר
const contactFormHeader = document.getElementById('contact-form-header');
const toggleForm = document.getElementById('toggle-form');
const contactForm = document.getElementById('contact-form');

// פונקציה לפתיחת/סגירת טופס יצירת הקשר
function toggleContactForm() {
  contactForm.classList.toggle('minimized');
  toggleForm.textContent = contactForm.classList.contains('minimized') ? '+' : '-';
  updateContactFormStyle();
}

// הוספת אירועי לחיצה לכפתור הטוגל
contactFormHeader.addEventListener('click', function(event) {
  if (event.target !== toggleForm) {
    toggleContactForm();
  }
});

toggleForm.addEventListener('click', function(event) {
  event.stopPropagation();
  toggleContactForm();
});

// פונקציה לעדכון סגנון טופס יצירת הקשר
function updateContactFormStyle() {
  if (contactForm.classList.contains('minimized')) {
    contactFormHeader.style.justifyContent = 'space-between'; /* שמירה על מיקום הכפתור לצד הטקסט */
    toggleForm.style.position = 'relative';
    toggleForm.style.marginLeft = '10px';
  } else {
    contactFormHeader.style.justifyContent = 'space-between';
    toggleForm.style.position = 'relative';
    toggleForm.style.marginLeft = '10px';
  }
}

updateContactFormStyle();

// פתיחת טופס יצירת הקשר מתוך כפתור "צור קשר" בתמונת ה-Hero ומקטע המידע
const heroCtaButton = document.querySelector('.hero .cta-button');
const infoCtaButton = document.querySelector('.info-section .cta-button');

function openContactForm() {
  if (contactForm.classList.contains('minimized')) {
    toggleContactForm();
  }
}

// הוספת אירועי לחיצה לכפתורי ה-CTA
if (heroCtaButton) {
  heroCtaButton.addEventListener('click', openContactForm);
}

if (infoCtaButton) {
  infoCtaButton.addEventListener('click', openContactForm);
}

// טיפול בשליחת הטופס
const contactFormElement = document.getElementById('contactForm');
const thankYouMessage = document.createElement('div');
thankYouMessage.id = 'thankYouMessage';
thankYouMessage.textContent = 'תודה רבה על פנייתך, ניצור קשר בהקדם!';
thankYouMessage.style.color = 'white';
thankYouMessage.style.textAlign = 'center';
thankYouMessage.style.padding = '10px';

contactFormElement.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  fetch(event.target.action, {
    method: 'POST',
    body: new FormData(event.target),
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      showThankYouMessage();
      setTimeout(() => {
        resetForm();
      }, 5000);
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          showErrors(data.errors);
        } else {
          showErrorMessage('שגיאה בשליחת הטופס');
        }
      });
    }
  })
  .catch(error => {
    showErrorMessage('שגיאה בשליחת הטופס');
  });
}

function showThankYouMessage() {
  contactFormElement.style.display = 'none';
  contactFormElement.parentNode.insertBefore(thankYouMessage, contactFormElement);
}

function resetForm() {
  thankYouMessage.remove();
  contactFormElement.style.display = 'block';
  contactFormElement.reset();
  contactForm.classList.add('minimized');
  toggleForm.textContent = '+';
}

function showErrorMessage(message) {
  alert(message);
}

function showErrors(errors) {
  let errorMessage = 'שגיאות בטופס:\n';
  errors.forEach(error => {
    errorMessage += `- ${error.field}: ${error.message}\n`;
  });
  alert(errorMessage);
}

// הוספת פונקציונליות להגדלת תמונות
const backImages = document.querySelectorAll('.back-image');

backImages.forEach(image => {
  image.addEventListener('click', () => {
    image.classList.toggle('enlarged');
  });
});

// סגירת התמונה המוגדלת בלחיצה מחוץ לתמונה
document.addEventListener('click', (event) => {
  if (!event.target.closest('.back-image')) {
    backImages.forEach(image => {
      image.classList.remove('enlarged');
    });
  }
});

// אפקט תלת-ממד ותנועה בציר ה-Z לכרטיסיות
const galleryContainer = document.querySelector('.gallery-container');
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryContainer && galleryItems.length > 0) {
    galleryContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = galleryContainer.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        galleryItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemX = itemRect.left - left + itemRect.width / 2;
            const itemY = itemRect.top - top + itemRect.height / 2;

            const diffX = mouseX - itemX;
            const diffY = mouseY - itemY;

            const radians = Math.atan2(diffY, diffX);
            const angle = radians * (180 / Math.PI) - 90;

            const distance = Math.sqrt(diffX * diffX + diffY * diffY);
            const maxDistance = Math.sqrt(width * width + height * height) / 2;
            const intensity = Math.min(distance / maxDistance, 1);

            const translateZ = intensity * 50; // מקסימום 50px תזוזה בציר ה-Z
            const rotateX = intensity * -10; // מקסימום 10 מעלות סיבוב ב-X
            const rotateY = intensity * 10; // מקסימום 10 מעלות סיבוב ב-Y

            item.style.transform = `perspective(1000px) 
                                    rotateX(${rotateX}deg) 
                                    rotateY(${rotateY}deg) 
                                    translateZ(${translateZ}px)`;
        });
    });

    galleryContainer.addEventListener('mouseleave', () => {
        galleryItems.forEach((item) => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// מחיקת או ביטול האפקט הפרלקס לתמונת ה-Hero
// window.addEventListener('scroll', () => {
//   const hero = document.querySelector('.hero');
//   const scrollPosition = window.pageYOffset;
//   hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
// });

// אנימציית הופעה לפרויקטים
const projectCards = document.querySelectorAll('.project-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

projectCards.forEach(card => {
  observer.observe(card);
});

// אפט סיבוב לכרטיסיות הפרויקטים
document.addEventListener('DOMContentLoaded', (event) => {
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    const inner = item.querySelector('.portfolio-item-inner');
    
    item.addEventListener('click', () => {
      inner.style.transform = inner.style.transform === 'rotateY(180deg)' 
        ? 'rotateY(0deg)' 
        : 'rotateY(180deg)';
    });
  });
});

// הוספת פונקציונליות לתפריט המובייל
const navToggle = document.createElement('button');
navToggle.classList.add('nav-toggle');
navToggle.innerHTML = '<i class="fas fa-bars"></i>';
navToggle.setAttribute('aria-label', 'Toggle navigation');

const nav = document.querySelector('nav');
nav.insertBefore(navToggle, nav.firstChild);

navToggle.addEventListener('click', () => {
  nav.classList.toggle('nav-open');
});

// ביטול אפקט הסיבוב של הטלפון במובייל
function handlePhoneRotation(event) {
  if (window.innerWidth <= 768) {
    // ביטול הסיבוב במסכים קטנים
    if (phone) {
      phone.style.transform = 'none';
    }
    if (socialLinks) {
      socialLinks.style.transform = 'none';
    }
    return;
  }
  // הקוד הקיים לסיבוב הטלפון במסכים גדולים
  const { clientX, clientY } = event;
  const { innerWidth, innerHeight } = window;
  
  const rotateY = ((clientX - innerWidth / 2) / (innerWidth / 2)) * 20;
  const rotateX = ((clientY - innerHeight / 2) / (innerHeight / 2)) * -20;
  
  updatePhoneRotation(rotateX, rotateY);
}

// החלפת אירועי המאוס הקיימים באירוע זה
document.addEventListener('mousemove', handlePhoneRotation);

// התאמת הגלילה החלקה לקישורים בתפריט
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
      // סגירת התפריט במובייל לאחר לחיצה על קישור
      nav.classList.remove('nav-open');
    }
  });
});

// הוספת אירוע resize כדי לטפל בשינויי גודל המסך
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    // איפוס הטרנספורמציות במובייל
    if (phone) {
      phone.style.transform = 'none';
    }
    if (socialLinks) {
      socialLinks.style.transform = 'none';
    }
  } else {
    // החזרת הטרנספורמציות במחשב
    updatePhoneRotation(0, 0);
  }
  updateActiveFace();
});
