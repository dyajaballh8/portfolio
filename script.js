document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- Dynamic Particle Canvas Background ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  let particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // Adaptive count
  const connectionDistance = 110;
  const mouse = { x: null, y: null, radius: 150 };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      ctx.fillStyle = theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(124, 58, 237, 0.2)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.strokeStyle = theme === 'dark' 
            ? `rgba(6, 182, 212, ${alpha})` 
            : `rgba(8, 145, 178, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  initParticles();
  animateParticles();


  // --- Theme Toggle Control ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // Load saved theme or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });


  // --- Sticky Header Scroll Styling ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // --- Hero Section Typing Animation ---
  const typingText = document.getElementById('typing-text');
  const words = ["Neural Networks", "Custom LLMs", "MLOps Pipelines", "AI Applications"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 120;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 60; // Faster deleting
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 120;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingDelay = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 500; // Pause before typing next word
    }

    setTimeout(type, typingDelay);
  }

  if (typingText) {
    setTimeout(type, 1000);
  }


  // --- Mobile Navigation Menu Toggle ---
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  navToggleBtn.addEventListener('click', () => {
    navToggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a nav link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // --- Intersection Observers for Scroll Animation & Skill Bars ---
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger skill bars animation if this is the skills section
        if (entry.target.id === 'skills') {
          animateSkills();
        }
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  function animateSkills() {
    // Standard progress bars
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach(bar => {
      const percentage = bar.getAttribute('data-percentage');
      bar.style.width = percentage;
    });

    // Circular progress bars
    const radialFills = document.querySelectorAll('.radial-fill');
    radialFills.forEach(fill => {
      const offset = fill.getAttribute('data-offset');
      fill.style.strokeDashoffset = offset;
    });
  }


  // --- Intersection Observer for Active Nav Link Tracking ---
  const sections = document.querySelectorAll('section');
  const navObserverOptions = {
    root: null,
    threshold: 0.4, // Trigger when 40% of the section is visible
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));


  // --- Projects Grid Filtration Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // --- Project Modal Popup Engine ---
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-project-img');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTechContainer = document.getElementById('modal-project-tech');
  const modalDemoBtn = document.getElementById('modal-project-demo-btn');
  const modalGithubBtn = document.getElementById('modal-project-github-btn');

  // AI & ML focused projects data
  const projectsData = {
    1: {
      title: 'AetherNet',
      desc: 'AetherNet is a state-of-the-art deep learning model built for real-time video super-resolution and frame interpolation. Utilizing Generative Adversarial Networks (GANs), U-Net backbones, and spatial-temporal attention mechanisms, AetherNet achieves high-fidelity 4x video upscaling on streaming media with minimal GPU latency. Integrated with TensorRT for edge deployment optimizations.',
      image: 'assets/project1.png',
      tech: ['PyTorch', 'CUDA', 'GANs', 'OpenCV', 'TensorRT', 'FastAPI'],
      demo: 'https://aethernet-ai.demo',
      github: 'https://github.com/dyajaballh8/aethernet-super-resolution'
    },
    2: {
      title: 'Synapse LLM',
      desc: 'Synapse LLM is a customized, fine-tuned large language model (7 Billion parameters) trained and optimized specifically for secure, offline code generation, refactoring, and automated security vulnerability detection. Pre-trained on custom secure-coding benchmarks and fine-tuned using Parameter-Efficient Fine-Tuning (PEFT/LoRA) and RLHF (Reinforcement Learning from Human Feedback) to ensure highly secure code outputs.',
      image: 'assets/project2.png',
      tech: ['Transformers', 'Hugging Face', 'DeepSpeed', 'LoRA', 'Python', 'FastAPI'],
      demo: 'https://synapse-llm.demo',
      github: 'https://github.com/dyajaballh8/synapse-llm'
    },
    3: {
      title: 'NeuroFlow',
      desc: 'NeuroFlow is a robust, end-to-end MLOps platform designed for automated training pipeline orchestration, model tracking, dataset version control, and model drift detection. It establishes automated continuous training triggers, connects seamlessly with cloud databases, and utilizes MLflow/DVC to manage model registries. Provides developers with a clean visual representation of DAG workflows and deploys model weights onto Kubernetes clusters in one click.',
      image: 'assets/project3.png',
      tech: ['Docker', 'Kubernetes', 'MLflow', 'DVC', 'Python', 'AWS S3'],
      demo: 'https://neuroflow-mlops.demo',
      github: 'https://github.com/dyajaballh8/neuroflow-mlops'
    },
    4: {
      title: 'Data Science Salaries Analysis',
      desc: 'An in-depth statistical analysis of global salaries in data-related roles. Utilizing a dataset containing salary parameters from thousands of professionals worldwide, this project analyzes salary variations by experience level, remote work ratios, company size, and job titles. Leverages advanced visual statistical methods to isolate clean salary clusters and trends.',
      image: 'assets/project4.png',
      tech: ['Python', 'Jupyter Notebook', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
      demo: 'https://github.com/dyajaballh8/data-jobs-salary-analysis',
      github: 'https://github.com/dyajaballh8/data-jobs-salary-analysis'
    },
    5: {
      title: 'SuperStore Sales & Profit Analysis',
      desc: 'A comprehensive retail analytics dashboard investigating sales, profits, shipping times, and customer segmentation patterns. Cleanses and parses large transaction datasets to reveal high-margin product sub-categories, peak seasonal sales periods, geographic distribution performance, and delivery bottlenecks.',
      image: 'assets/project5.png',
      tech: ['Python', 'Jupyter Notebook', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      demo: 'https://github.com/dyajaballh8/superstore-sales-analysis',
      github: 'https://github.com/dyajaballh8/superstore-sales-analysis'
    },
    6: {
      title: 'Udemy Courses Market Analysis',
      desc: 'An explanatory data visualization report exploring Udemy\'s course catalog. Analyzes the correlation between course pricing structures, subscriber counts, review ratios, and course durations. Uncovers insights on which subject areas draw the most subscribers, the relationship between paid vs. free courses, and content trends over time.',
      image: 'assets/project6.png',
      tech: ['Python', 'Jupyter Notebook', 'Pandas', 'Matplotlib', 'Seaborn', 'Scipy'],
      demo: 'https://github.com/dyajaballh8/udemy-courses-analysis',
      github: 'https://github.com/dyajaballh8/udemy-courses-analysis'
    }
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const data = projectsData[projectId];
      
      if (!data) return;

      // Populate details
      modalImg.src = data.image;
      modalImg.alt = `${data.title} Mockup`;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalDemoBtn.href = data.demo;
      modalGithubBtn.href = data.github;

      // Clear and populate tech tags
      modalTechContainer.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'modal-tech';
        span.textContent = t;
        modalTechContainer.appendChild(span);
      });

      // Show modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scrolling
  }

  modalCloseBtn.addEventListener('click', closeModal);
  
  // Close modal clicking outside the card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal via Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });


  // --- Contact Form Submission & Validation ---
  const contactForm = document.getElementById('contact-form');
  const inputName = document.getElementById('form-name');
  const inputEmail = document.getElementById('form-email');
  const inputMessage = document.getElementById('form-message');
  const successContainer = document.getElementById('form-success-container');
  const submitBtn = document.getElementById('form-submit-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    const errors = document.querySelectorAll('.form-error');
    errors.forEach(err => err.style.display = 'none');
    
    const controls = document.querySelectorAll('.form-control');
    controls.forEach(ctrl => ctrl.classList.remove('invalid'));
    
    let isValid = true;

    // Validate Name
    if (inputName.value.trim() === '') {
      document.getElementById('error-name').style.display = 'block';
      inputName.classList.add('invalid');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value.trim())) {
      document.getElementById('error-email').style.display = 'block';
      inputEmail.classList.add('invalid');
      isValid = false;
    }

    // Validate Message
    if (inputMessage.value.trim() === '') {
      document.getElementById('error-message').style.display = 'block';
      inputMessage.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate server submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i data-lucide="loader" class="animate-spin" style="margin-left: 8px; width: 18px; height: 18px;"></i>`;
    lucide.createIcons();

    setTimeout(() => {
      // Success response state
      successContainer.innerHTML = `
        <div class="form-success-banner">
          <i data-lucide="check-circle" style="width: 24px; height: 24px; flex-shrink: 0;"></i>
          <div>
            <strong>Thank you!</strong> Your message has been sent successfully. I will get back to you shortly.
          </div>
        </div>
      `;
      lucide.createIcons();

      // Reset Form fields
      contactForm.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message <i data-lucide="send" style="margin-left: 8px; width: 18px; height: 18px;"></i>`;
      lucide.createIcons();

      // Scroll to success banner smoothly
      successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Clear success notification after 7 seconds
      setTimeout(() => {
        successContainer.innerHTML = '';
      }, 7000);
      
    }, 1500);
  });
});
