// סיבוב הטלפון והחלפת צדדים
const scene = document.getElementById('scene');
const phone = document.getElementById('phone');
const socialLinks = document.querySelector('.social-links');
const faces = document.querySelectorAll('.phone-face');
let currentRotation = 0;
let currentFace = 0;

phone.addEventListener('click', () => {
  currentFace = (currentFace + 1) % faces.length;
  currentRotation -= 180; // עדכון ל-180 מעלות כדי להציג את הצד האחורי
  updatePhoneRotation(0, 0);
  updateActiveFace();
});

function updatePhoneRotation(rotateX, rotateY) {
  phone.style.transform = `rotateY(${currentRotation + rotateY}deg) rotateX(${rotateX}deg) translateZ(50px)`;
  socialLinks.style.transform = `translateX(-50%) translateZ(80px) rotateY(${currentRotation + rotateY}deg) rotateX(${rotateX}deg)`; /* הגדלת translateZ */
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
