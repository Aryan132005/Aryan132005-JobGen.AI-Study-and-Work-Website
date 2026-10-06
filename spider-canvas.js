/**
 * STUDY & WORK AUSTRALIA — INTERACTIVE SPIDER PLEXUS CANVAS SYSTEM
 * Features:
 * - Geometric node network with delicate connecting spider-web lines
 * - Mouse attraction physics ("pointer pass me aaya tho kheche aas pass walo ko")
 * - Non-colorful, elegant aesthetic matching reference screenshot:
 *     * Dark sections: Subtle champagne gold & muted silver/white
 *     * Light sections: Clean white with subtle corporate deep blue
 * - IntersectionObserver to animate only sections currently visible (60fps performance)
 */

(function () {
  'use strict';

  class SpiderCanvas {
    constructor(section, isDark) {
      this.section = section;
      this.isDark = isDark;
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'spider-canvas';
      this.ctx = this.canvas.getContext('2d');

      // Theme colors: Non-colorful, classy, matching reference screenshot
      if (this.isDark) {
        // Dark section (matches Daylo Build reference): champagne gold & soft silver
        this.lineRgb = '212, 175, 55'; // #d4af37 champagne gold
        this.dotColor = '#c5a059';      // gold node
        this.ringColor = '#c5a059';
        this.mouseLineRgb = '225, 185, 85';
      } else {
        // Light section: subtle clean corporate deep blue
        this.lineRgb = '2, 132, 199';   // #0284c7 blue
        this.dotColor = '#0284c7';
        this.ringColor = '#0284c7';
        this.mouseLineRgb = '2, 132, 199';
      }

      this.particles = [];
      this.mouse = { x: null, y: null, radius: 175 };
      this.isVisible = false;
      this.animId = null;

      this.init();
    }

    init() {
      this.section.style.position = 'relative';

      // Insert canvas behind content
      const existing = this.section.querySelector('.spider-canvas');
      if (existing) existing.remove();
      this.section.prepend(this.canvas);

      this.resize();
      this.createParticles();
      this.bindEvents();
      this.setupObserver();
    }

    resize() {
      this.width = this.canvas.width = this.section.offsetWidth;
      this.height = this.canvas.height = this.section.offsetHeight;
    }

    createParticles() {
      // Scale particle count based on section area (typically 40 to 65 nodes)
      const count = Math.max(35, Math.min(65, Math.floor((this.width * this.height) / 22000)));
      this.particles = [];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: i % 7 === 0 ? 2.8 : (i % 3 === 0 ? 2.0 : 1.4),
          hasRing: i % 11 === 0 // Highlighted node with outer halo ring
        });
      }
    }

    bindEvents() {
      // Track mouse position over section
      this.section.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.section.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });

      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });
    }

    setupObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            if (!this.animId) {
              this.animId = requestAnimationFrame(() => this.updateAndDraw());
            }
          } else {
            this.isVisible = false;
            if (this.animId) {
              cancelAnimationFrame(this.animId);
              this.animId = null;
            }
          }
        });
      }, { threshold: 0.05 });

      observer.observe(this.section);
    }

    updateAndDraw() {
      if (!this.isVisible) return;

      const { ctx, width, height, mouse, particles, isDark } = this;
      ctx.clearRect(0, 0, width, height);

      const maxConnDist = 120;

      // 1. Draw web lines between neighboring particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnDist) {
            const alpha = (1 - dist / maxConnDist) * (isDark ? 0.22 : 0.16);
            ctx.strokeStyle = `rgba(${this.lineRgb}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Update particle positions and apply Mouse Attraction ("Pointer Kheenchega")
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Standard gentle drift
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently at canvas boundaries
        if (p.x < 5) { p.x = 5; p.vx *= -1; }
        if (p.x > width - 5) { p.x = width - 5; p.vx *= -1; }
        if (p.y < 5) { p.y = 5; p.vy *= -1; }
        if (p.y > height - 5) { p.y = height - 5; p.vy *= -1; }

        // Interactive mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius && mdist > 2) {
            // Draw spider web line directly to cursor
            const mAlpha = (1 - mdist / mouse.radius) * (isDark ? 0.6 : 0.45);
            ctx.strokeStyle = `rgba(${this.mouseLineRgb}, ${mAlpha})`;
            ctx.lineWidth = 1.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Magnetic Attraction force: pull node towards mouse
            const force = (mouse.radius - mdist) / mouse.radius;
            p.x += (mdx / mdist) * force * 1.6;
            p.y += (mdy / mdist) * force * 1.6;
          }
        }

        // 3. Draw particle node
        ctx.fillStyle = this.dotColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4. Draw outer halo ring if designated
        if (p.hasRing) {
          ctx.strokeStyle = this.ringColor;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 5.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      this.animId = requestAnimationFrame(() => this.updateAndDraw());
    }
  }

  // Global initializer called on page load and SPA view transitions
  window.initSpiderCanvases = function () {
    const lightSections = document.querySelectorAll('.section-spider-light');
    const darkSections = document.querySelectorAll('.section-spider-dark');

    lightSections.forEach((sec) => {
      if (!sec._spiderCanvasAttached) {
        new SpiderCanvas(sec, false);
        sec._spiderCanvasAttached = true;
      }
    });

    darkSections.forEach((sec) => {
      if (!sec._spiderCanvasAttached) {
        new SpiderCanvas(sec, true);
        sec._spiderCanvasAttached = true;
      }
    });
  };

  // Run on initial DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initSpiderCanvases);
  } else {
    window.initSpiderCanvases();
  }
})();
