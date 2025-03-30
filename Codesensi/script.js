// Animation for pixel text
const createPixelText = (word) => {
  // Define pixelized patterns for each letter
  const pixelPatterns = {
    'C': [
      [0,1,1,1,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [0,1,1,1,0]
    ],
    'O': [
      [0,1,1,1,0],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [0,1,1,1,0]
    ],
    'D': [
      [1,1,1,0,0],
      [1,0,0,1,0],
      [1,0,0,0,1],
      [1,0,0,1,0],
      [1,1,1,0,0]
    ],
    '-': [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [0,0,0,0,0]
    ],
    


    'S': [
      [0,1,1,1,0],
      [1,0,0,0,0],
      [0,1,1,0,0],
      [0,0,0,1,0],
      [1,1,1,0,0]
    ],
    'E': [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,1,1,0,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ],
    'N': [
      [1,0,0,0,1],
      [1,1,0,0,1],
      [1,0,1,0,1],
      [1,0,0,1,1],
      [1,0,0,0,1]
    ],
    'I': [
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [1,1,1,1,1]
    ],
    ' ': [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ]
  };

  const pixelTextContainer = document.getElementById('pixelTitle');
  pixelTextContainer.innerHTML = '';
  
  // Center the pixel text container
  pixelTextContainer.style.display = 'flex';
  pixelTextContainer.style.justifyContent = 'center';
  pixelTextContainer.style.width = '100%';
  pixelTextContainer.style.margin = '0 auto';

  // Process each character of the word
  [...word].forEach((char, charIndex) => {
    const upperChar = char.toUpperCase();
    if (pixelPatterns[upperChar]) {
      const charContainer = document.createElement('div');
      charContainer.style.display = 'inline-block';
      charContainer.style.verticalAlign = 'middle';

      // Create pixel grid for the character
      const grid = document.createElement('div');
      grid.className = 'pixel-grid';
      grid.style.setProperty('--cols', '5');
      grid.style.setProperty('--rows', '5');
      grid.style.setProperty('--size', '35px');
      grid.style.display = 'inline-grid';

      // Add cell elements to the grid
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const cell = document.createElement('div');
          cell.className = 'pixel-cell';
          if (pixelPatterns[upperChar][r][c]) {
            setTimeout(() => {
              cell.classList.add('active');
            }, (charIndex * 200) + (r * 40) + (c * 20));
          }
          grid.appendChild(cell);
        }
      }

      charContainer.appendChild(grid);
      pixelTextContainer.appendChild(charContainer);
    }
  });
};

// Smooth Scroll & Navigation
const initNavigation = () => {
  document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      
      // For downloads link
      if (this.id === 'downloadsLink') {
        toggleDownloadHistory();
        return;
      }
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
      });
      this.classList.add('active');
      
      // Hide all pages
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      
      // Show target page
      const targetPage = document.getElementById(targetId);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
};

// Name Input Handling
const handleNameInput = () => {
  const nameForm = document.getElementById('nameForm');
  const nameModal = document.getElementById('nameModal');
  const nameInput = document.getElementById('nameInput');
  const userGreeting = document.getElementById('userGreeting');
  const mainContent = document.getElementById('mainContent');
  
  // Check if name is stored in localStorage
  const storedName = localStorage.getItem('userName');
  
  if (storedName) {
    // Hide the modal and show content
    nameModal.style.display = 'none';
    mainContent.classList.remove('hidden');
    userGreeting.innerHTML = `<span>Welcome, </span><span style="color: var(--purple); font-weight: 500;">${storedName}</span>`;
    initAnimations();
  }
  
  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    
    if (name === '') {
      // Add shake animation for invalid input
      nameInput.classList.add('invalid');
      setTimeout(() => {
        nameInput.classList.remove('invalid');
      }, 500);
      return;
    }
    
    // Store name and update UI
    localStorage.setItem('userName', name);
    userGreeting.innerHTML = `<span>Welcome, </span><span style="color: var(--purple); font-weight: 500;">${name}</span>`;
    
    // Hide modal with animation
    nameModal.style.opacity = '0';
    nameModal.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      nameModal.style.display = 'none';
      mainContent.classList.remove('hidden');
      initAnimations();
    }, 500);
  });
};

// Header scroll effect
const initHeaderScroll = () => {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
};

// Random coder quotes
const initRandomQuote = () => {
  const quotes = [
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Programming isn't about what you know; it's about what you can figure out.",
    "The best way to predict the future is to implement it.",
    "Clean code always looks like it was written by someone who cares.",
    "In a world of technology, the possibilities are limited only by your imagination.",
    "CODE SENSEI is all you need for your coding journey.",
  ];
  
  const randomQuote = document.getElementById('randomQuote');
  randomQuote.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
  
  // Center the random quote
  randomQuote.style.textAlign = 'center';
  randomQuote.style.display = 'block';
  randomQuote.style.width = '100%';
};

// Initialize all animations
const initAnimations = () => {
  createPixelText("CODE SENSEI");
  initRandomQuote();
  
  // Add more animation initializations here
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.feature-card, .pdf-card').forEach(element => {
    observer.observe(element);
  });
};

// Mobile detection
const checkMobile = () => {
  const isMobile = /Android|webOS|iPhone|iPad||/i.test(navigator.userAgent) || window.innerWidth < 768;
  if (isMobile) {
    document.getElementById('mobileAlert').classList.add('show');
  }
};

// Mobile alert handlers
const initMobileAlert = () => {
  document.getElementById('continueBtn').addEventListener('click', () => {
    document.getElementById('mobileAlert').classList.remove('show');
  });
  
  document.getElementById('dismissBtn').addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
};

// Download history management
let downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]');

const updateDownloadCount = () => {
  const downloadCount = document.getElementById('downloadCount');
  downloadCount.textContent = downloadHistory.length;
};

const renderDownloadHistory = () => {
  const content = document.getElementById('downloadHistoryContent');
  
  if (downloadHistory.length === 0) {
    content.innerHTML = `
      <div class="empty-downloads">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <p>Your download history will appear here</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  
  downloadHistory.forEach((item) => {
    html += `
      <div class="download-item">
        <div class="download-item__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        <div class="download-item__details">
          <div class="download-item__name">${item.filename}</div>
          <div class="download-item__time">${item.date}</div>
        </div>
      </div>
    `;
  });
  
  content.innerHTML = html;
};

const toggleDownloadHistory = () => {
  const panel = document.getElementById('downloadHistoryPanel');
  panel.classList.toggle('show');
};

const clearDownloadHistory = () => {
  downloadHistory = [];
  localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
  renderDownloadHistory();
  updateDownloadCount();
};

const initDownloadTracking = () => {
  // Show download history button if there are downloads
  if (downloadHistory.length > 0) {
    document.getElementById('downloadHistoryBtn').style.display = 'flex';
    updateDownloadCount();
  }
  
  // Track download clicks
  document.querySelectorAll('.pdf-card__download-link').forEach(link => {
    link.addEventListener('click', function() {
      const filename = this.getAttribute('href').split('/').pop();
      
      const now = new Date();
      const dateFormatted = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
      
      const download = {
        filename: filename,
        date: dateFormatted
      };
      
      downloadHistory.push(download);
      localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
      
      // Show downloads button
      document.getElementById('downloadHistoryBtn').style.display = 'flex';
      updateDownloadCount();
      renderDownloadHistory();
      
      // Show toast-like notification
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.padding = '10px 20px';
      toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      toast.style.color = 'white';
      toast.style.borderRadius = '4px';
      toast.style.zIndex = '9999';
      toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      toast.style.backdropFilter = 'blur(10px)';
      toast.textContent = `Downloading ${filename}`;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 500);
      }, 3000);
    });
  });
  
  // Download history panel controls
  document.getElementById('downloadHistoryBtn').addEventListener('click', toggleDownloadHistory);
  document.getElementById('closeDownloadsBtn').addEventListener('click', toggleDownloadHistory);
  document.getElementById('clearDownloadsBtn').addEventListener('click', clearDownloadHistory);
};

// Loader
const hideLoader = () => {
  const loader = document.getElementById('loader');
  loader.classList.add('hidden');
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader after a minimum display time
  setTimeout(hideLoader, 1500);
  
  checkMobile();
  initMobileAlert();
  handleNameInput();
  initHeaderScroll();
  initNavigation();
  initDownloadTracking();
  renderDownloadHistory();
  
  // Initialize animations if user has already provided name
  if (localStorage.getItem('userName')) {
    initAnimations();
  }
  
  // Ensure the pixel title container is centered on the page
  const pixelTitleContainer = document.getElementById('pixelTitle');
  if (pixelTitleContainer) {
    pixelTitleContainer.style.display = 'flex';
    pixelTitleContainer.style.justifyContent = 'center';
    pixelTitleContainer.style.width = '100%';
    pixelTitleContainer.style.margin = '0 auto';
  }
});

// Dynamic input animation
document.getElementById('nameInput').addEventListener('focus', function() {
  this.style.borderColor = 'var(--purple)';
  this.style.boxShadow = '0 0 10px rgba(155, 135, 245, 0.3)';
});

document.getElementById('nameInput').addEventListener('blur', function() {
  this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  this.style.boxShadow = 'none';
});

// Dynamic elements on mouse move
document.addEventListener('mousemove', (e) => {
  const elements = document.querySelectorAll('.floating');
  
  elements.forEach(element => {
    const htmlElement = element;
    const speed = parseFloat(element.getAttribute('data-speed') || '0.05');
    
    const x = (window.innerWidth / 2 - e.clientX) * speed;
    const y = (window.innerHeight / 2 - e.clientY) * speed;
    
    htmlElement.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
});

// Handle download links (they would normally point to real files)
document.querySelectorAll('.pdf-card__download-link').forEach(link => {
  link.addEventListener('click', function(e) {
    // In a real site, you would actually have files to download
    // This prevents default to avoid navigation errors with non-existent files
    e.preventDefault();
    
    // Show a toast notification explaining that this is a demo
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    toast.style.backdropFilter = 'blur(10px)';
    toast.textContent = `This is a demo! Download simulation for: ${this.getAttribute('href').split('/').pop()}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  });
});
