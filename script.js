/* ==========================================================================
   Mehedi Hasan Portfolio - Interactive Navigation, Clipboard & Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current year dynamically in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Download the resume with the browser's Print / Save as PDF option.
  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) printResumeBtn.addEventListener('click', () => window.print());

  // 2. Mobile Navigation Drawer Toggle & Accessibility Controls
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenuBtn || !mobileMenu) return;

    const isCurrentlyOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    mobileMenuBtn.setAttribute('aria-expanded', String(shouldOpen));
    mobileMenu.classList.toggle('hidden', !shouldOpen);
    if (iconOpen) iconOpen.classList.toggle('hidden', shouldOpen);
    if (iconClose) iconClose.classList.toggle('hidden', !shouldOpen);
    document.body.classList.toggle('overflow-hidden', shouldOpen);
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    // Close mobile menu when clicking outside the drawer or toggle button
    document.addEventListener('click', (e) => {
      if (
        mobileMenuBtn.getAttribute('aria-expanded') === 'true' &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        toggleMobileMenu(true);
      }
    });

    // Close mobile menu when pressing Escape key and restore focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(true);
        mobileMenuBtn.focus();
      }
    });

    // Reset mobile drawer state if viewport widens to desktop breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(true);
      }
    });
  }

  // 3. Copy Email Address to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailText = document.getElementById('copy-email-text');
  const emailToCopy = 'mehedihasan10505@gmail.com';

  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener('click', () => {
      try {
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        copyEmailText.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
          copyEmailText.textContent = 'Copy Email Address';
        }, 2500);
      } catch (err) {
        copyEmailText.textContent = emailToCopy;
      }
    });
  }

  // 4. Accessible Client-Side Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  const fields = {
    name: {
      input: document.getElementById('sender-name'),
      error: document.getElementById('name-error'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter your full name.';
        if (val.trim().length < 2) return 'Name must be at least 2 characters long.';
        return '';
      }
    },
    email: {
      input: document.getElementById('sender-email'),
      error: document.getElementById('email-error'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) {
          return 'Please enter a valid email address (e.g., name@example.com).';
        }
        return '';
      }
    },
    subject: {
      input: document.getElementById('sender-subject'),
      error: document.getElementById('subject-error'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter a subject.';
        if (val.trim().length < 3) return 'Subject must be at least 3 characters long.';
        return '';
      }
    },
    message: {
      input: document.getElementById('sender-message'),
      error: document.getElementById('message-error'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter your message.';
        if (val.trim().length < 10) return 'Message must be at least 10 characters long.';
        return '';
      }
    }
  };

  function showFieldError(fieldKey, message) {
    const { input, error } = fields[fieldKey];
    if (!input || !error) return;

    if (message) {
      error.textContent = message;
      error.classList.remove('hidden');
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
      input.classList.remove('border-slate-300', 'focus:ring-brandGreen-600', 'focus:border-brandGreen-600');
    } else {
      error.textContent = '';
      error.classList.add('hidden');
      input.removeAttribute('aria-invalid');
      input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
      input.classList.add('border-slate-300', 'focus:ring-brandGreen-600', 'focus:border-brandGreen-600');
    }
  }

  // Validate fields on blur and clear errors dynamically as the user types
  Object.keys(fields).forEach((key) => {
    const { input, validate } = fields[key];
    if (!input) return;

    input.addEventListener('blur', () => {
      showFieldError(key, validate(input.value));
    });

    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        showFieldError(key, validate(input.value));
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalidInput = null;
      let isValid = true;

      Object.keys(fields).forEach((key) => {
        const { input, validate } = fields[key];
        const errorMsg = validate(input.value);
        showFieldError(key, errorMsg);
        if (errorMsg) {
          isValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = input;
          }
        }
      });

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = 'mt-4 p-4 rounded-xl text-sm font-medium bg-red-50 text-red-800 border border-red-200';
          formFeedback.textContent = 'Please correct the highlighted fields below before submitting.';
          formFeedback.classList.remove('hidden');
        }
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      const senderName = fields.name.input.value.trim();
      const senderEmail = fields.email.input.value.trim();
      const subject = fields.subject.input.value.trim();
      const message = fields.message.input.value.trim();

      if (formFeedback) {
        formFeedback.className = 'mt-4 p-4 rounded-xl text-sm font-medium bg-brandGreen-50 text-brandGreen-900 border border-brandGreen-200';
        // Use textContent for visitor input so it cannot be interpreted as HTML.
        formFeedback.replaceChildren();
        const heading = document.createElement('p');
        heading.className = 'font-semibold';
        heading.textContent = `Thank you, ${senderName}! Your message has been validated.`;

        const instructions = document.createElement('p');
        instructions.className = 'mt-1 text-xs text-brandGreen-800';
        instructions.append('You can also send it directly via your email client: ');
        const emailLink = document.createElement('a');
        emailLink.className = 'underline font-bold';
        emailLink.textContent = 'Open in Email App';
        emailLink.href = 'mailto:mehedihasan10505@gmail.com?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(`From: ${senderName} (${senderEmail})\n\n${message}`);
        instructions.appendChild(emailLink);
        formFeedback.append(heading, instructions);
        formFeedback.classList.remove('hidden');
      }

      contactForm.reset();
    });
  }
});