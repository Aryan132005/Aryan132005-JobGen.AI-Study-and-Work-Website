/* ==========================================================================
   STUDY & WORK AUSTRALIA — 2026 MULTI-PAGE ROUTING & PRODUCTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initLogoMarquee();
  initModalHandlers();
  initRouter();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & SCROLL HANDLERS
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 35) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. VIDEO PLAYER BUILDER (HTML5 CONTROLS, UNRESTRICTED SEEKING)
   -------------------------------------------------------------------------- */
function renderVideoPlayer(src, title, duration) {
  return `
    <div class="video-player-box" style="position: relative; border-radius: 1.25rem; overflow: hidden; background: #000; box-shadow: var(--shadow-card); margin: 1.75rem 0;">
      ${duration ? `<div class="video-meta-badge" style="position: absolute; top: 1rem; right: 1rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; z-index: 5; pointer-events: none;">Duration: ${duration}</div>` : ''}
      <video controls preload="metadata" playsinline class="custom-html5-player" style="width: 100%; border-radius: 1.25rem; background: #000;">
        <source src="${src}" type="video/mp4">
        Your browser does not support HTML5 video playback. <a href="${src}" target="_blank" style="color: var(--color-accent-blue); text-decoration: underline;">Download video file (${title})</a>
      </video>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   3. CLIENT-SIDE ROUTER ENGINE
   -------------------------------------------------------------------------- */
function initRouter() {
  // Global click delegator for links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        e.preventDefault();
        navigateTo(href);
      }
    }
  });

  window.addEventListener('popstate', () => {
    renderCurrentRoute();
  });

  // Initial Route Render
  renderCurrentRoute();
}

function navigateTo(url, pushState = true) {
  if (pushState) {
    history.pushState(null, '', url);
  }
  renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getRoutePath() {
  let path = window.location.pathname.toLowerCase();
  // Strip trailing slashes or .html
  path = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  // Check hash fallback if accessed via file:// or hash
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '/');
    if (hash && hash !== '/') {
      path = '/' + hash.replace(/^\/\//, '');
    }
  }
  return path || '/';
}

function updateActiveNavLinks(routePath) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route') || link.getAttribute('href');
    if (!route) return;
    const normRoute = route.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const normCurrent = routePath.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    
    if (normRoute === normCurrent || (normRoute !== '/' && normCurrent.startsWith(normRoute))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderCurrentRoute() {
  const path = getRoutePath();
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  updateActiveNavLinks(path);

  if (path === '/' || path === '/explore') {
    renderHomeView(mainContent);
  } else if (path === '/candidates') {
    renderCandidatesView(mainContent);
  } else if (path === '/employers') {
    renderEmployersView(mainContent);
  } else if (path === '/education-providers') {
    renderEducationProvidersView(mainContent);
  } else if (path === '/resources') {
    renderResourcesView(mainContent);
  } else if (path === '/about') {
    renderAboutView(mainContent);
  } else if (path === '/contact') {
    renderContactView(mainContent);
  } else if (path === '/internship') {
    renderInternshipView(mainContent);
  } else if (path === '/job-placement') {
    renderJobPlacementView(mainContent);
  } else if (path === '/staffing') {
    renderStaffingView(mainContent);
  } else if (path === '/casual-jobs') {
    renderCasualJobsView(mainContent);
  } else if (path === '/casual-staffing') {
    renderCasualStaffingView(mainContent);
  } else if (path === '/apprenticeship') {
    renderApprenticeshipView(mainContent);
  } else if (path === '/know-your-rights') {
    renderKnowYourRightsView(mainContent);
  } else if (path === '/alumni') {
    renderAlumniView(mainContent);
  } else if (path === '/resources/skilled-migrants-deserve-a-fair-go') {
    renderArticleView(mainContent, 'skilled-migrants');
  } else if (path === '/resources/invest-in-emerging-talent-for-the-maximum-roi') {
    renderArticleView(mainContent, 'employer-roi');
  } else {
    // Default fallback to home if unknown route
    renderHomeView(mainContent);
  }

  // Re-initialize dynamic widgets for rendered view
  initLogoMarquee();
  initAlumniSearch();
  initCityTabs();
  initJourneyProgressStepper();
}

/* --------------------------------------------------------------------------
   4. DEDICATED ROUTE VIEW RENDERERS
   -------------------------------------------------------------------------- */

// --- 4.1 HOMEPAGE VIEW (OVERVIEW + ENTRY POINTS) ---
function renderHomeView(container) {
  container.innerHTML = `
    <!-- CINEMATIC BRAND HERO SECTION WITH BACKGROUND VIDEO -->
    <section id="explore" class="hero-section cinematic-hero">
      <!-- Background Video (Layer 1) -->
      <video class="hero-bg-video" autoplay loop muted playsinline preload="auto" poster="Student-friendlyJobs.png">
        <source src="Creating_Australian_career_video.mp4" type="video/mp4">
        <source src="/Creating_Australian_career_video.mp4" type="video/mp4">
        <source src="www.studyandwork.com.au/video/Creating_Australian_career_video.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <!-- Gradient Dark Readability Overlay (Layer 2) -->
      <div class="hero-gradient-overlay"></div>

      <!-- Hero Content Container (Layer 4) -->
      <div class="container hero-container">
        <div class="hero-grid">
          <!-- Left Side: Core Study & Work Hero Content + Stats Under CTAs -->
          <div class="hero-content">
            <span class="badge-tag hero-badge">AUSTRALIA'S PREMIER CAREER PLATFORM</span>
            <h1 class="display-hero hero-title">Turn Your Potential Into an Australian Career.</h1>
            <p class="lead-text hero-lead">
              Study. Gain experience. Connect with industry. Build a career that moves forward.
            </p>
            <div class="hero-cta-group">
              <a href="/candidates" data-link class="btn btn-primary btn-hero-primary">Explore Candidate Opportunities &rarr;</a>
              <a href="/employers" data-link class="btn btn-secondary btn-hero-secondary">I'm an Employer</a>
            </div>

            <!-- 3 STAT BADGES PLACED DIRECTLY UNDER THE 2 CTA BUTTONS -->
            <div class="hero-stats-under-cta">
              <div class="hero-stat-card">
                <div class="stat-icon">&#127891;</div>
                <div>
                  <div class="stat-number">8,000+</div>
                  <div class="stat-label">Candidates Placed</div>
                </div>
              </div>

              <div class="hero-stat-card">
                <div class="stat-icon">&#127970;</div>
                <div>
                  <div class="stat-number">3,000+</div>
                  <div class="stat-label">Host Businesses</div>
                </div>
              </div>

              <div class="hero-stat-card">
                <div class="stat-icon">&#128197;</div>
                <div>
                  <div class="stat-number">2007</div>
                  <div class="stat-label">Established in Australia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PATHWAYS OVERVIEW SECTION -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto;">
          <span class="badge-tag">Personalised Pathways</span>
          <h2 class="heading-1" style="margin-top: 0.75rem;">Where are you in your journey?</h2>
          <p class="lead-text">Explore dedicated entry points designed specifically for candidate aspirations and employer hiring demands.</p>
        </div>

        <div class="pathway-master-wrapper" style="margin-top: 2.5rem;">
          <!-- CANDIDATE OVERVIEW CARDS -->
          <div>
            <div class="journey-group-header">
              <span class="journey-group-title">Candidate Opportunities</span>
              <div style="flex: 1; height: 1px; background: var(--color-slate-200);"></div>
            </div>

            <div class="candidate-grid-3">
              <div class="path-card-candidate">
                <span class="badge-tag" style="width: fit-content;">01 Internship</span>
                <div>
                  <h3 class="heading-3">Professional Internship</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">12-week structured placement in Australian host companies aligned with your university qualification.</p>
                </div>
                <a href="/internship" data-link class="path-link">Explore Internship &rarr;</a>
              </div>

              <div class="path-card-candidate">
                <span class="badge-tag" style="width: fit-content; background: rgba(5, 150, 105, 0.08); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.2);">02 Job Placement</span>
                <div>
                  <h3 class="heading-3">Graduate Jobs</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">Direct recruitment and permanent career placement across IT, Accounting, Engineering, and Business.</p>
                </div>
                <a href="/job-placement" data-link class="path-link" style="color: var(--color-accent-emerald);">Graduate Opportunities &rarr;</a>
              </div>

              <div class="path-card-candidate">
                <span class="badge-tag" style="width: fit-content; background: rgba(217, 119, 6, 0.08); color: var(--color-accent-amber); border-color: rgba(217, 119, 6, 0.2);">03 Casual Jobs</span>
                <div>
                  <h3 class="heading-3">Casual Student Jobs</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">Flexible employment opportunities designed to support international student living expenses.</p>
                </div>
                <a href="/casual-jobs" data-link class="path-link" style="color: var(--color-accent-amber);">Explore Student Jobs &rarr;</a>
              </div>
            </div>
          </div>

          <!-- EMPLOYER OVERVIEW CARDS -->
          <div style="margin-top: 2.5rem;">
            <div class="journey-group-header">
              <span class="journey-group-title" style="color: var(--color-accent-blue);">Employer Solutions</span>
              <div style="flex: 1; height: 1px; background: var(--color-slate-200);"></div>
            </div>

            <div class="employer-grid-2">
              <div class="path-card-employer">
                <span class="badge-tag" style="width: fit-content; background: rgba(2, 132, 199, 0.1); color: var(--color-accent-blue);">Try Before You Hire</span>
                <div>
                  <h3 class="heading-3" style="color: var(--color-ink);">Host an Intern (12 Weeks Zero Cost)</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">Evaluate enthusiastic university graduates for 12 weeks at zero placement fee before extending a job offer.</p>
                </div>
                <a href="/employers" data-link class="path-link" style="color: var(--color-accent-blue);">Host an Intern &rarr;</a>
              </div>

              <div class="path-card-employer">
                <span class="badge-tag" style="width: fit-content; background: rgba(15, 23, 42, 0.08); color: var(--color-ink);">Direct Recruitment</span>
                <div>
                  <h3 class="heading-3" style="color: var(--color-ink);">Permanent & Casual Staffing</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">5%-10% permanent placement fee with 6-month replacement guarantee, or flexible 65% markup casual staffing.</p>
                </div>
                <a href="/staffing" data-link class="path-link" style="color: var(--color-ink);">Explore Staffing &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SIGNATURE CAREER JOURNEY STEPPER -->
    <section id="journey" class="section section-spider-dark">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">End-to-End Progression</span>
          <h2 class="heading-1" style="margin-top: 0.75rem;">Your Australian Career Pathway</h2>
          <p class="lead-text">A structured 7-stage framework guiding candidates from education to long-term career growth.</p>
        </div>

        <div style="position: relative;">
          <div style="height: 4px; background: var(--color-slate-200); position: absolute; top: 22px; left: 5%; right: 5%; z-index: 1;"></div>
          <div id="journeyLineFill" style="height: 4px; background: var(--color-accent-blue); position: absolute; top: 22px; left: 5%; width: 14%; z-index: 2; transition: width 0.3s ease;"></div>

          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; position: relative; z-index: 3;">
            <div class="journey-node-card active" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">1</div>
              <div style="font-weight: 700; font-size: 0.95rem;">DISCOVER</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">Skills Audit</div>
            </div>

            <div class="journey-node-card" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-slate-200); color: var(--color-ink); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">2</div>
              <div style="font-weight: 700; font-size: 0.95rem;">STUDY</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">University Degree</div>
            </div>

            <div class="journey-node-card" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-slate-200); color: var(--color-ink); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">3</div>
              <div style="font-weight: 700; font-size: 0.95rem;">PREPARE</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">Resume & Coaching</div>
            </div>

            <div class="journey-node-card" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-slate-200); color: var(--color-ink); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">4</div>
              <div style="font-weight: 700; font-size: 0.95rem;">EXPERIENCE</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">12-Wk Internship</div>
            </div>

            <div class="journey-node-card" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-slate-200); color: var(--color-ink); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">5</div>
              <div style="font-weight: 700; font-size: 0.95rem;">CONNECT</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">3,000+ Employers</div>
            </div>

            <div class="journey-node-card" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-slate-200); color: var(--color-ink); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">6</div>
              <div style="font-weight: 700; font-size: 0.95rem;">GET HIRED</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">Paid Job Offer</div>
            </div>

            <div class="journey-node-card" style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-slate-200); color: var(--color-ink); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.75rem;">7</div>
              <div style="font-weight: 700; font-size: 0.95rem;">GROW</div>
              <div style="font-size: 0.8rem; color: var(--color-slate-500); margin-top: 0.25rem;">Visa & Leadership</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT SECTION (LEFT VIDEO + RIGHT TEXT - IMAGE 4 LAYOUT) -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <!-- LEFT SIDE VIDEO -->
          <div>
            ${renderVideoPlayer('v1.mp4', 'Study & Work Australia Platform Overview', '2m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div>
            <span class="badge-tag" style="background: rgba(2, 132, 199, 0.2); color: var(--color-accent-blue); border-color: rgba(2, 132, 199, 0.4);">Featured Media</span>
            <h2 class="heading-1" style="color: #fff; margin-top: 0.75rem;">Turn Your Qualifications Into Workplace Success</h2>
            <p class="lead-text" style="color: var(--color-slate-400); margin-top: 1rem; margin-bottom: 1.5rem;">
              Watch how Study & Work Australia connects university talent with top tier corporate host companies across Australia.
            </p>
            <ul style="list-style: none; padding: 0; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem; color: var(--color-slate-300);">
              <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent-blue); font-weight: bold;">✓</span> 12-Week Structured Internships</li>
              <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent-blue); font-weight: bold;">✓</span> Direct Graduate Job Placements</li>
              <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent-blue); font-weight: bold;">✓</span> 3,000+ Verified Australian Host Businesses</li>
            </ul>
            <a href="/candidates" data-link class="btn btn-primary btn-hero-primary">Explore Candidate Pathways &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- PARTNER MARQUEE -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="text-align: center; margin-bottom: 2rem;">
          <span class="badge-tag">Industry Ecosystem</span>
          <h2 class="heading-2" style="margin-top: 0.5rem;">Trusted by 3,000+ Australian Businesses</h2>
        </div>
        <div class="logo-marquee-wrapper">
          <div id="logoMarqueeTrack" class="logo-marquee-track"></div>
        </div>
      </div>
    </section>

    <!-- ALUMNI PREVIEW -->
    <section id="alumni" class="section section-spider-light">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
          <div>
            <span class="badge-tag">Audited Outcomes</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">8,000+ Alumni Placements</h2>
          </div>
          <a href="/alumni" data-link class="btn btn-secondary">View Complete Alumni Directory &rarr;</a>
        </div>
        <div id="alumniGridContainer" class="alumni-grid-3"></div>
      </div>
    </section>

    <!-- OFFICE LOCATIONS TABS -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 2.5rem;">
          <span class="badge-tag">National Footprint</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Australian Offices & Operations</h2>
        </div>

        <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem;">
          <button class="city-chip-btn active" data-city="sydney">Sydney & Parramatta</button>
          <button class="city-chip-btn" data-city="melbourne">Melbourne</button>
          <button class="city-chip-btn" data-city="brisbane">Brisbane</button>
          <button class="city-chip-btn" data-city="perth">Perth</button>
          <button class="city-chip-btn" data-city="adelaide">Adelaide</button>
        </div>

        <div id="cityDetailContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;"></div>
      </div>
    </section>
  `;
}

// --- 4.2 CANDIDATES HUB VIEW ---
function renderCandidatesView(container) {
  container.innerHTML = `
    <!-- CANDIDATES HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="candidates_hero_bg.jpg" class="hero-bg-img" alt="Australian Candidates & Graduates">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(5, 150, 105, 0.25); color: #34d399; border-color: rgba(5, 150, 105, 0.4);">Candidates & Graduates</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Build Experience. Start Your Australian Career.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Australia's premier career entry platform connecting university students, graduates, and skilled migrants with 3,000+ host companies across Sydney, Melbourne, Brisbane, Perth, and Adelaide.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Register Candidate Profile &rarr;</button>
            <button onclick="openModal('consultation')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Book Career Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CANDIDATE PROGRAMS GRID -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Program Suite</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Dedicated Candidate Pathways</h2>
          <p class="lead-text">Choose the pathway that matches your current qualification, visa status, and career ambitions.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
          <!-- CARD 1: INTERNSHIP -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">12-Week Program</span>
              <h3 class="heading-2">Professional Internship Program</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                12-week structured workplace placement in Australian corporate host companies. Gain hands-on local experience in IT, Accounting, Engineering, Marketing, and Business Management.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Students & Graduates</span>
              <a href="/internship" data-link class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View Internship &rarr;</a>
            </div>
          </div>

          <!-- CARD 2: GRADUATE JOBS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="background: rgba(5, 150, 105, 0.1); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.2); margin-bottom: 1rem;">Direct Career Placement</span>
              <h3 class="heading-2">Graduate Job Placement</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Direct paid placement for graduates with Australian host employers. 5%-10% employer placement fee structure with a 6-month satisfaction replacement guarantee.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Recent Graduates</span>
              <a href="/job-placement" data-link class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); padding: 0.5rem 1rem; font-size: 0.875rem;">Graduate Jobs &rarr;</a>
            </div>
          </div>

          <!-- CARD 3: APPRENTICESHIPS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="background: rgba(217, 119, 6, 0.1); color: var(--color-accent-amber); border-color: rgba(217, 119, 6, 0.2); margin-bottom: 1rem;">Earn & Learn</span>
              <h3 class="heading-2">Apprenticeships & Traineeships</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Structured vocational training and paid workplace placements for trade, technical, and commercial operations supported by Australian government subsidies.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Vocational & Trade</span>
              <a href="/apprenticeship" data-link class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); padding: 0.5rem 1rem; font-size: 0.875rem;">Explore Traineeships &rarr;</a>
            </div>
          </div>

          <!-- CARD 4: CASUAL JOBS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">Student Visa Friendly</span>
              <h3 class="heading-2">Casual Jobs for Students</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Flexible student jobs in hospitality, retail, customer service, and events matching Australian student visa work limitations (48 hours per fortnight during study terms).
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: International Students</span>
              <a href="/casual-jobs" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Casual Jobs &rarr;</a>
            </div>
          </div>

          <!-- CARD 5: KNOW YOUR RIGHTS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">Fair Work Compliance</span>
              <h3 class="heading-2">Know Your Rights</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Understand your legal protections under the Australian Fair Work Act 2009. Rules governing vocational placements, paid vs unpaid internships, and worker safety.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: All Candidates</span>
              <a href="/know-your-rights" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Legal Rights &rarr;</a>
            </div>
          </div>

          <!-- CARD 6: ALUMNI -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">Success Stories</span>
              <h3 class="heading-2">Alumni Directory</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Explore verified success stories of over 8,000 graduates placed into leading Australian enterprises across 145+ Australian and global universities.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Prospective Candidates</span>
              <a href="/alumni" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Alumni Directory &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT TEXT + RIGHT VIDEO - IMAGE 3 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <!-- LEFT SIDE TEXT -->
          <div>
            <span class="badge-tag">Candidate Experiences</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">Hear From Real Interns & Graduates</h2>
            <p class="lead-text" style="margin-top: 1rem; margin-bottom: 1.5rem;">
              Watch candidate testimonial journeys and workplace placement experiences across Australian host companies.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button onclick="openModal('work')" class="btn btn-primary">Register Candidate Profile &rarr;</button>
              <button onclick="openModal('consultation')" class="btn btn-secondary">Book Consultation</button>
            </div>
          </div>
          <!-- RIGHT SIDE VIDEO -->
          <div>
            ${renderVideoPlayer('interns1.mp4', 'Candidate & Graduate Placement Journeys', '3m 15s')}
          </div>
        </div>
      </div>
    </section>

    <!-- STEP-BY-STEP APPLICATION PATHWAY -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Application Workflow</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">How Candidate Placement Works</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">01</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Register Profile</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Submit your resume, academic transcripts, and target placement sector.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">02</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Skills Assessment</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Undergo career consultation and Australian workplace cultural readiness coaching.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">03</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Host Matching</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Interview with vetted host companies matching your technical qualifications.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">04</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Workplace Placement</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Complete your 12-week structured internship or direct graduate placement.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <button onclick="openModal('work')" class="btn btn-primary" style="padding: 0.85rem 2rem; font-size: 1rem;">Apply Now via JobAdder Candidate Portal &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// --- 4.3 EMPLOYERS HUB VIEW ---
function renderEmployersView(container) {
  container.innerHTML = `
    <!-- EMPLOYERS HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="employers_hero_bg.jpg" class="hero-bg-img" alt="Australian Employer Talent Solutions">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #7dd3fc; border-color: rgba(2, 132, 199, 0.4);">Employer Talent Solutions</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Find Talent That Moves Your Business Forward.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Flexible staffing and recruitment solutions for Australian enterprises since 2007. Evaluate interns over 12 weeks at zero cost, direct-hire with a 6-month satisfaction guarantee, or hire casual staff with 65% markup.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-blue); border-color: var(--color-accent-blue);">Submit Talent Request &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Call Hotline 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- EMPLOYER SERVICES BREAKDOWN -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Staffing Models</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Cost-Effective Talent Acquisition</h2>
          <p class="lead-text">Choose from zero-cost intern evaluations, direct permanent hires, or flexible temporary staffing models.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 2rem;">
          <!-- SERVICE 1: HOST AN INTERN -->
          <div style="background: var(--color-surface); border: 2px solid var(--color-accent-blue); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-card); position: relative;">
            <span class="badge-tag" style="background: var(--color-accent-blue); color: #fff; margin-bottom: 1rem;">Flagship Program</span>
            <h3 class="heading-2">Host an Intern (Try Before You Hire)</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Evaluate enthusiastic university graduates for 12 weeks at <strong>zero placement fee</strong>. Assess candidate performance, technical skills, and culture fit in your business before making a permanent job offer.
            </p>
            <ul style="margin: 1.5rem 0; padding-left: 1.25rem; color: var(--color-slate-700); font-size: 0.9375rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Zero Placement Fee:</strong> No upfront or ongoing cost during 12 weeks</li>
              <li><strong>Insurance Covered:</strong> Study & Work covers personal accident & liability</li>
              <li><strong>Fair Work Compliant:</strong> Structured vocational placement under Section 12</li>
              <li><strong>High Retention:</strong> 85%+ of host interns receive permanent job offers</li>
            </ul>
            <button onclick="openModal('hire')" class="btn btn-primary" style="width: 100%; text-align: center;">Host an Intern at Zero Cost &rarr;</button>
          </div>

          <!-- SERVICE 2: DIRECT RECRUITMENT -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="margin-bottom: 1rem;">Permanent Placement</span>
            <h3 class="heading-2">Direct-Hire Permanent Recruitment</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Full end-to-end recruitment for junior to senior professionals across IT, Accounting, Engineering, and Business.
            </p>
            <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1rem; border-radius: var(--radius-md); margin: 1.25rem 0; font-size: 0.9rem;">
              <div style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.25rem;">Transparent Pricing:</div>
              <div>• <strong>5% Fee:</strong> Candidates with &lt;2 years experience</div>
              <div>• <strong>10% Fee:</strong> Candidates with &ge;2 years experience</div>
              <div>• <strong>6-Month Replacement Guarantee:</strong> Zero risk replacement</div>
            </div>
            <button onclick="openModal('hire')" class="btn btn-secondary" style="width: 100%; text-align: center;">Request Direct Recruitment &rarr;</button>
          </div>

          <!-- SERVICE 3: CASUAL & TEMP STAFFING -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="margin-bottom: 1rem;">Flexible Workforce</span>
            <h3 class="heading-2">On-Hire Temporary & Casual Staffing</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Flexible casual workforce solutions for hospitality, retail, customer service, warehousing, and admin.
            </p>
            <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1rem; border-radius: var(--radius-md); margin: 1.25rem 0; font-size: 0.9rem;">
              <div style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.25rem;">65% On-Hire Markup Covers:</div>
              <div>• Base salary payment & superannuation</div>
              <div>• Payroll tax & Workers Compensation insurance</div>
              <div>• Full employer administrative burden</div>
            </div>
            <a href="/staffing" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Explore Staffing Solutions &rarr;</a>
          </div>

          <!-- SERVICE 4: VISA SPONSORSHIP SOURCING -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="margin-bottom: 1rem;">Skilled Migration</span>
            <h3 class="heading-2">Employer Visa Sponsorship Sourcing</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Access qualified international candidates for employer visa sponsorship under Australian Department of Home Affairs guidelines.
            </p>
            <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1rem; border-radius: var(--radius-md); margin: 1.25rem 0; font-size: 0.9rem;">
              <div>• <strong>Subclass 407 Training Visa:</strong> Structured occupational training ($60,000 + super threshold)</div>
              <div>• <strong>Subclass 482 Skills in Demand:</strong> Skilled worker sponsorship ($80,000 + super threshold)</div>
            </div>
            <button onclick="openModal('consultation')" class="btn btn-secondary" style="width: 100%; text-align: center;">Discuss Visa Sponsorship &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- EMPLOYER VIDEO SECTION (LEFT VIDEO + RIGHT TEXT - IMAGE 4 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <!-- LEFT SIDE VIDEO -->
          <div>
            ${renderVideoPlayer('employerVideo.mp4', 'Recruitment Cost Optimization Video', '4m 10s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div>
            <span class="badge-tag">Employer Insights</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">Recruitment Doesn't Have to Be Expensive</h2>
            <p class="lead-text" style="margin-top: 1rem; margin-bottom: 1.5rem;">
              Learn how Australian SMEs and corporate enterprises save up to 70% in recruitment costs using Study & Work's host placement models.
            </p>
            <button onclick="openModal('hire')" class="btn btn-primary">Host an Intern Zero Cost &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CLIENT LOGO TRACK -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; margin-bottom: 2rem;">
          <span class="badge-tag">Partner Employers</span>
          <h2 class="heading-2" style="margin-top: 0.5rem;">Join 3,000+ Host Employers Across Australia</h2>
        </div>
        <div class="logo-marquee-wrapper">
          <div id="logoMarqueeTrack" class="logo-marquee-track"></div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.4 EDUCATION PROVIDERS VIEW ---
function renderEducationProvidersView(container) {
  container.innerHTML = `
    <!-- EDUCATION HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="education_hero_bg.jpg" class="hero-bg-img" alt="Education Partnerships Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(16, 185, 129, 0.25); color: #6ee7b7; border-color: rgba(16, 185, 129, 0.4);">Education Partnerships</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Turn Education Into Real Industry Experience.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Partnering with 145+ Australian and international universities to integrate Work Integrated Learning (WIL) and boost graduate employability outcomes.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('contact')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Partner With Us &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Call Education Desk 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- WIL PARTNERSHIPS OVERVIEW -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">WIL Framework</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Work Integrated Learning Solutions</h2>
          <p class="lead-text">Study & Work bridges the gap between university academic theory and practical workplace performance.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">&#127891;</div>
            <h3 class="heading-3">Curriculum Placement Integration</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              We embed 12-week professional internships directly into university degree credit requirements, ensuring 100% compliance with Australian higher education standards.
            </p>
          </div>

          <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">&#9878;</div>
            <h3 class="heading-3">Fair Work & Legal Compliance</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              All host company placements strictly comply with Section 12 of the Australian Fair Work Act 2009 regarding vocational placements and international student visa conditions.
            </p>
          </div>

          <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">&#128200;</div>
            <h3 class="heading-3">Graduate Employability Uplift</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Over 85% of placed interns receive permanent employment offers within 3 months of program completion, significantly boosting university QILT graduate outcome metrics.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT - IMAGE 4 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <!-- LEFT SIDE VIDEO -->
          <div>
            ${renderVideoPlayer('PIPE.mp4', 'Work Integrated Learning Video', '5m 20s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div>
            <span class="badge-tag">University Partnerships</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">Work Integrated Learning (PIPE) Overview</h2>
            <p class="lead-text" style="margin-top: 1rem; margin-bottom: 1.5rem;">
              Watch how Study & Work collaborates with university faculties to deliver hands-on industry placements for Australian and international students.
            </p>
            <button onclick="openModal('contact')" class="btn btn-primary">Request Faculty Proposal &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.5 RESOURCES HUB VIEW ---
function renderResourcesView(container) {
  container.innerHTML = `
    <!-- RESOURCES HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="resources_hero_bg.jpg" class="hero-bg-img" alt="Knowledge and Insights Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(217, 119, 6, 0.25); color: #fbbf24; border-color: rgba(217, 119, 6, 0.4);">Knowledge & Insights</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Knowledge for Your Next Career Move.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Articles, legal guides under the Fair Work Act 2009, employer ROI research, and career advocacy for students and skilled migrants in Australia.
          </p>
        </div>
      </div>
    </section>

    <!-- ARTICLES GRID -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Featured Publications</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Latest News & Insights</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
          <!-- ARTICLE 1 -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="margin-bottom: 0.75rem;">Advocacy & Diversity</span>
              <h3 class="heading-2">Skilled Migrants Deserve a Fair Go</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                How Australian businesses can unlock immense talent by providing fair employment opportunities to skilled migrants and overseas-qualified professionals.
              </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-slate-100);">
              <a href="/resources/skilled-migrants-deserve-a-fair-go" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Read Full Article &rarr;</a>
            </div>
          </div>

          <!-- ARTICLE 2 -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-space-between;">
            <div>
              <span class="badge-tag" style="margin-bottom: 0.75rem;">Employer ROI</span>
              <h3 class="heading-2">Invest in Emerging Talent for Maximum ROI</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Why hiring university graduates and hosting interns yields superior productivity, long-term employee retention, and cultural vitality for Australian SMEs.
              </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-slate-100);">
              <a href="/resources/invest-in-emerging-talent-for-the-maximum-roi" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Read Full Article &rarr;</a>
            </div>
          </div>

          <!-- ARTICLE 3 -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-space-between;">
            <div>
              <span class="badge-tag" style="margin-bottom: 0.75rem;">Fair Work Compliance</span>
              <h3 class="heading-2">Know Your Legal Rights Under Fair Work Act</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Essential guidelines for international students and interns covering minimum award wages, vocational placement exceptions, and workplace safety.
              </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-slate-100);">
              <a href="/know-your-rights" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Explore Rights Guide &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.6 ABOUT US VIEW ---
function renderAboutView(container) {
  container.innerHTML = `
    <!-- ABOUT HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="about_hero_bg.jpg" class="hero-bg-img" alt="Study & Work Corporate Profile">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Corporate Profile</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Connecting Potential With Opportunity Since 2007.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Budding Talents Recruitment Pty Ltd trading as <strong>STUDYANDWORK</strong> (ABN: 42 129 512 474). Operating for over 19 years as Australia's premier career bridge for university graduates, international students, and skilled migrants.
          </p>
        </div>
      </div>
    </section>

    <!-- COMPANY BACKGROUND & METRICS -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <div>
            <span class="badge-tag">Our History</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">19+ Years of Career Excellence in Australia</h2>
            <p style="color: var(--color-slate-600); margin-top: 1rem; line-height: 1.7; font-size: 1.05rem;">
              Established in 2007, Study & Work Australia was founded with a singular mission: to eliminate the "no local experience, no job" barrier faced by thousands of qualified university graduates and skilled migrants across Australia.
            </p>
            <p style="color: var(--color-slate-600); margin-top: 1rem; line-height: 1.7; font-size: 1.05rem;">
              Over nearly two decades, we have successfully placed over <strong>8,000 candidates</strong> into structured internships, traineeships, and direct permanent roles across <strong>3,000+ host businesses</strong> nationwide.
            </p>
          </div>

          <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="border-bottom: 1px solid var(--color-slate-200); padding-bottom: 1rem;">
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent-blue); font-family: var(--font-display);">8,000+</div>
              <div style="font-weight: 600; color: var(--color-slate-700);">Candidates Placed Into Professional Careers</div>
            </div>

            <div style="border-bottom: 1px solid var(--color-slate-200); padding-bottom: 1rem;">
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent-emerald); font-family: var(--font-display);">3,000+</div>
              <div style="font-weight: 600; color: var(--color-slate-700);">Host Business Partners Across Australia</div>
            </div>

            <div>
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent-amber); font-family: var(--font-display);">2007</div>
              <div style="font-weight: 600; color: var(--color-slate-700);">Established & Continuously Operating (19+ Years)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CORPORATE VIDEO PLAYER (LEFT VIDEO + RIGHT TEXT - IMAGE 3 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <!-- LEFT SIDE VIDEO -->
          <div>
            ${renderVideoPlayer('STUDYANDWORKABOUTUS.mp4', 'Study & Work Corporate Story', '6m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div>
            <span class="badge-tag">Corporate Story</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">Study & Work Corporate Story</h2>
            <p class="lead-text" style="margin-top: 1rem; margin-bottom: 1.5rem;">
              Watch the corporate background and vision behind Budding Talents Recruitment trading as Study & Work Australia.
            </p>
            <button onclick="openModal('consultation')" class="btn btn-primary">Book Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.7 CONTACT US VIEW ---
function renderContactView(container) {
  container.innerHTML = `
    <!-- CONTACT HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="contact_hero_bg.jpg" class="hero-bg-img" alt="Study & Work Contact Desk">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Contact Desk</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Get in Touch with Our Australian Teams.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Our national headquarters and regional offices are ready to assist candidates, host employers, and university partners across Sydney, Parramatta, and Melbourne.
          </p>
        </div>
      </div>
    </section>

    <!-- CONTACT DETAILS & FORM (LEFT: FORM + HOTLINES, RIGHT: VIDEO - IMAGE 5 LAYOUT) -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: start;">
          <!-- LEFT COLUMN: TOP FORM, BOTTOM HOTLINES -->
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            <!-- TOP: SEND US A MESSAGE FORM -->
            <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); padding: 2.25rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-card);">
              <span class="badge-tag" style="margin-bottom: 0.5rem;">Direct Messaging</span>
              <h3 class="heading-2" style="margin-bottom: 1rem;">Send Us a Message</h3>
              <form onsubmit="alert('Thank you for contacting Study & Work Australia. Our team will get back to you within 24 hours!'); return false;" style="display: flex; flex-direction: column; gap: 1rem;">
                <input type="text" placeholder="Your Full Name *" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
                <input type="email" placeholder="Your Email Address *" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
                <input type="tel" placeholder="Phone Number" style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
                <textarea rows="4" placeholder="How can we assist you?" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;"></textarea>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message &rarr;</button>
              </form>
            </div>

            <!-- BOTTOM: OFFICE LOCATIONS & HOTLINES -->
            <div>
              <span class="badge-tag">National Footprint</span>
              <h2 class="heading-2" style="margin-top: 0.5rem;">Office Locations & Hotlines</h2>

              <div style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem;">
                <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-weight: 700; color: var(--color-ink); font-size: 1rem; margin-bottom: 0.25rem;">Parramatta Head Office</div>
                  <div style="color: var(--color-slate-600); font-size: 0.9rem;">Level 15, 60 Station Street East, Parramatta NSW 2150</div>
                </div>

                <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-weight: 700; color: var(--color-ink); font-size: 1rem; margin-bottom: 0.25rem;">Sydney City Office</div>
                  <div style="color: var(--color-slate-600); font-size: 0.9rem;">Level 10, 66 Clarence Street, Sydney NSW 2000</div>
                </div>

                <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-weight: 700; color: var(--color-ink); font-size: 1rem; margin-bottom: 0.25rem;">Melbourne City Office</div>
                  <div style="color: var(--color-slate-600); font-size: 0.9rem;">330 Collins Street, Melbourne VIC 3000 (By Appointment)</div>
                </div>

                <div style="background: var(--color-surface); border: 2px solid var(--color-accent-blue); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-weight: 700; color: var(--color-accent-blue); font-size: 1rem; margin-bottom: 0.25rem;">Contact Hotlines</div>
                  <div style="font-size: 0.9rem; color: var(--color-slate-700);">• Freecall Hotline: <strong>1300 79 80 69</strong></div>
                  <div style="font-size: 0.9rem; color: var(--color-slate-700);">• Sydney Desk: <strong>02 8233 6138</strong></div>
                  <div style="font-size: 0.9rem; color: var(--color-slate-700);">• Mobile: <strong>0421 338 592 | 0466 110 995</strong></div>
                  <div style="font-size: 0.9rem; color: var(--color-slate-700);">• Email: <strong>service@studyandwork.com.au</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: CONTACT VIDEO -->
          <div>
            <div style="position: sticky; top: calc(var(--nav-height) + 2rem);">
              <span class="badge-tag">Virtual Office Tour</span>
              <h2 class="heading-2" style="margin-top: 0.5rem; margin-bottom: 1rem;">Experience Our Headquarters</h2>
              ${renderVideoPlayer('contact1.mp4', 'Contact & Office Tour Video', '2m 10s')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.8 INTERNSHIP PROGRAM VIEW ---
function renderInternshipView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-accent-blue-hover) 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(2, 132, 199, 0.2); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Structured 12-Week Placement</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">12-Week Professional Internship Program.</h1>
          <p class="lead-text" style="color: var(--color-slate-200); margin-top: 1.25rem;">
            Gain vital local Australian workplace experience with leading host companies across IT, Accounting, Engineering, Marketing, and Business Management.
          </p>
          <button onclick="openModal('work')" class="btn btn-primary" style="margin-top: 2rem;">Apply for Internship &rarr;</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width: 860px;">
        <div style="text-align: center;">
          <span class="badge-tag">Program Video</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Professional Internship Overview</h2>

          ${renderVideoPlayer('www.studyandwork.com.au/video/v1.mp4', 'Professional Internship Program Video', '2m 45s')}
        </div>
      </div>
    </section>
  `;
}

// --- 4.9 GRADUATE JOB PLACEMENT VIEW ---
function renderJobPlacementView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, #047857 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(5, 150, 105, 0.2); color: #34d399; border-color: rgba(5, 150, 105, 0.4);">Direct Career Placement</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">Graduate Job Placement Services.</h1>
          <p class="lead-text" style="color: var(--color-slate-200); margin-top: 1.25rem;">
            Direct paid placement for university graduates with Australian host employers. 5%-10% employer placement fee structure backed by a 6-month replacement guarantee.
          </p>
          <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); margin-top: 2rem;">Register Graduate Profile &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// --- 4.10 PROFESSIONAL STAFFING VIEW ---
function renderStaffingView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-ink-soft) 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(2, 132, 199, 0.2); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Corporate Staffing</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">Professional & Casual Staffing Solutions.</h1>
          <p class="lead-text" style="color: var(--color-slate-300); margin-top: 1.25rem;">
            End-to-end recruitment, payroll, superannuation, and candidate management for Australian enterprises.
          </p>
          <button onclick="openModal('hire')" class="btn btn-primary" style="margin-top: 2rem;">Request Staffing &rarr;</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width: 860px;">
        <div style="text-align: center;">
          <span class="badge-tag">Staffing Video</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Corporate Staffing Overview</h2>

          ${renderVideoPlayer('www.studyandwork.com.au/video/staffing.mp4', 'Professional Staffing Solution Video', '3m 50s')}
        </div>
      </div>
    </section>
  `;
}

// --- 4.11 CASUAL JOBS VIEW ---
function renderCasualJobsView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, #b45309 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(217, 119, 6, 0.2); color: #fcd34d; border-color: rgba(217, 119, 6, 0.4);">Student Jobs</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">Casual Jobs for Students in Australia.</h1>
          <p class="lead-text" style="color: var(--color-slate-200); margin-top: 1.25rem;">
            Flexible casual work opportunities matching Australian student visa work limits (48 hours per fortnight during semester terms).
          </p>
          <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); margin-top: 2rem;">Explore Casual Jobs &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// --- 4.12 CASUAL STAFFING VIEW ---
function renderCasualStaffingView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-ink-soft) 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(2, 132, 199, 0.2); color: #38bdf8;">Employer Casual Staffing</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">On-Demand Casual Workforce Solutions.</h1>
          <p class="lead-text" style="color: var(--color-slate-300); margin-top: 1.25rem;">
            Rapid response casual staffing for hospitality, retail, customer service, and events with a 65% markup covering salary, super, tax, and insurance.
          </p>
          <button onclick="openModal('hire')" class="btn btn-primary" style="margin-top: 2rem;">Hire Casual Staff &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// --- 4.13 APPRENTICESHIP VIEW ---
function renderApprenticeshipView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, #b45309 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(217, 119, 6, 0.2); color: #fcd34d;">Trade & Vocational</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">Apprenticeship & Traineeship Programs.</h1>
          <p class="lead-text" style="color: var(--color-slate-200); margin-top: 1.25rem;">
            Earn while learning in trade, technical, and commercial operations supported by Australian government subsidies.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width: 860px;">
        <div style="text-align: center;">
          <span class="badge-tag">Program Video</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Apprenticeships Overview</h2>

          ${renderVideoPlayer('www.studyandwork.com.au/video/apprentice.mp4', 'Apprenticeship & Traineeship Video', '3m 30s')}
        </div>
      </div>
    </section>
  `;
}

// --- 4.14 KNOW YOUR RIGHTS VIEW ---
function renderKnowYourRightsView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-ink-soft) 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(5, 150, 105, 0.2); color: #34d399;">Fair Work Compliance</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">Know Your Rights Under the Fair Work Act.</h1>
          <p class="lead-text" style="color: var(--color-slate-300); margin-top: 1.25rem;">
            Essential legal protections for international students, university interns, and Australian workers under the Fair Work Act 2009.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width: 800px;">
        <div style="background: var(--color-surface); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
          <h2 class="heading-2" style="margin-bottom: 1rem;">Vocational Placement Legal Boundaries</h2>
          <p style="color: var(--color-slate-600); line-height: 1.7; margin-bottom: 1rem;">
            Under Section 12 of the Australian Fair Work Act 2009, an internship is a lawful unpaid vocational placement ONLY if it is a mandatory requirement of an Australian education or training course.
          </p>
          <p style="color: var(--color-slate-600); line-height: 1.7; margin-bottom: 1rem;">
            If an internship falls outside an approved educational course, the individual is classified as an employee and is legally entitled to minimum award wages, superannuation, and national employment standards.
          </p>
          <div style="background: var(--color-paper); padding: 1.5rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-accent-blue); margin-top: 1.5rem;">
            <div style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.25rem;">Study & Work Guarantee:</div>
            <div style="font-size: 0.95rem; color: var(--color-slate-700);">
              All host company placements organized through Study & Work Australia are 100% compliant with Fair Work Act 2009 legal guidelines and include full personal accident and public liability insurance.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.15 ALUMNI DIRECTORY VIEW ---
function renderAlumniView(container) {
  container.innerHTML = `
    <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-ink-soft) 100%); color: #fff;">
      <div class="container">
        <div style="max-width: 800px;">
          <span class="badge-tag" style="background: rgba(5, 150, 105, 0.2); color: #34d399;">Audited Outcomes</span>
          <h1 class="display-hero" style="color: #fff; margin-top: 0.75rem;">8,000+ Graduate Success Stories.</h1>
          <p class="lead-text" style="color: var(--color-slate-300); margin-top: 1.25rem;">
            Search and explore verified career outcomes from candidates placed into over 3,000 Australian host businesses.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div style="max-width: 600px; margin: 0 auto 2.5rem;">
          <input type="text" id="alumniSearchInput" placeholder="Search by name, university, degree, or job role..." style="width: 100%; padding: 1rem 1.5rem; border-radius: var(--radius-full); border: 1px solid var(--color-slate-200); font-size: 1rem; outline: none; box-shadow: var(--shadow-subtle);">
        </div>

        <div id="alumniGridContainer" class="alumni-grid-3"></div>
      </div>
    </section>

    <section class="section" style="background: var(--color-paper); border-top: 1px solid var(--color-slate-200);">
      <div class="container" style="max-width: 860px;">
        <div style="text-align: center;">
          <span class="badge-tag">Alumni Video</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Our Alumni Network</h2>

          ${renderVideoPlayer('www.studyandwork.com.au/video/our_alumni.mp4', 'Alumni Placement Video', '3m 10s')}
        </div>
      </div>
    </section>
  `;
}

// --- 4.16 ARTICLE VIEW ---
function renderArticleView(container, slug) {
  if (slug === 'skilled-migrants') {
    container.innerHTML = `
      <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-ink-soft) 100%); color: #fff;">
        <div class="container">
          <div style="max-width: 800px;">
            <a href="/resources" data-link style="color: var(--color-accent-blue); font-weight: 600;">&larr; Back to Resources Hub</a>
            <h1 class="display-hero" style="color: #fff; margin-top: 1rem;">Skilled Migrants Deserve a Fair Go</h1>
            <p style="color: var(--color-slate-400); margin-top: 0.5rem;">Published by Study & Work Australia Advocacy</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container" style="max-width: 800px; line-height: 1.8; font-size: 1.05rem; color: var(--color-slate-700);">
          <p style="margin-bottom: 1.5rem;">
            Australia has long benefited from the drive, intelligence, and ambition of overseas-qualified professionals. However, many skilled migrants face significant barriers when attempting to enter the Australian workforce in their field of expertise.
          </p>
          <h2 class="heading-2" style="margin: 2rem 0 1rem; color: var(--color-ink);">Overcoming the "Local Experience" Barrier</h2>
          <p style="margin-bottom: 1.5rem;">
            A common obstacle encountered by newly arrived migrants is the insistence on "Australian workplace experience." Without a first opportunity, gaining local experience is impossible. Study & Work Australia was founded to break this cycle by providing structured internship pathways and host company placements.
          </p>
          <div style="margin-top: 2rem;">
            <button onclick="openModal('work')" class="btn btn-primary">Apply as a Skilled Migrant Candidate &rarr;</button>
          </div>
        </div>
      </section>
    `;
  } else {
    container.innerHTML = `
      <section class="hero-section" style="background: linear-gradient(135deg, var(--color-ink-deep) 0%, var(--color-ink-soft) 100%); color: #fff;">
        <div class="container">
          <div style="max-width: 800px;">
            <a href="/resources" data-link style="color: var(--color-accent-blue); font-weight: 600;">&larr; Back to Resources Hub</a>
            <h1 class="display-hero" style="color: #fff; margin-top: 1rem;">Invest in Emerging Talent for Maximum ROI</h1>
            <p style="color: var(--color-slate-400); margin-top: 0.5rem;">Published by Study & Work Employer Research</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container" style="max-width: 800px; line-height: 1.8; font-size: 1.05rem; color: var(--color-slate-700);">
          <p style="margin-bottom: 1.5rem;">
            For Australian small-to-medium enterprises and corporate departments, hiring senior talent is increasingly costly. Research demonstrates that investing in enthusiastic university graduates yields significantly higher long-term return on investment (ROI).
          </p>
          <h2 class="heading-2" style="margin: 2rem 0 1rem; color: var(--color-ink);">Why Internships Deliver Superior Results</h2>
          <p style="margin-bottom: 1.5rem;">
            Hosting an intern over a 12-week period allows managers to evaluate technical skills, adaptability, and cultural alignment with zero upfront financial risk.
          </p>
          <div style="margin-top: 2rem;">
            <button onclick="openModal('hire')" class="btn btn-primary">Host an Intern at Zero Cost &rarr;</button>
          </div>
        </div>
      </section>
    `;
  }
}

/* --------------------------------------------------------------------------
   5. ALUMNI SEARCH & DIRECTORY ENGINE
   -------------------------------------------------------------------------- */
const ALUMNI_DATA = [
  {
    name: "Ms Thyaga Keerthipala",
    degree: "Bachelor of Science in Information Technology",
    uni: "Manchester Metropolitan University, UK",
    role: "Database Developer",
    quote: "Within a short period of time Study & Work lined up an interview. They gave me tips and guidance. My first interview was successful and I was offered the job!"
  },
  {
    name: "Mr Devesh Soni",
    degree: "Master of Professional Accounting",
    uni: "University of Wollongong",
    role: "Senior Fund Accountant",
    quote: "Study & Work sets you up with interviews with prospective employers who have an open mind regarding hiring international students. Highly recommended!"
  },
  {
    name: "Ms Rebecca Zeng",
    degree: "Bachelor of Accounting",
    uni: "University of Newcastle",
    role: "Company Accountant",
    quote: "After finishing university I sent out hundreds of resumes without response. Once I started with Study & Work, I had two interviews in two weeks and got my accounting job!"
  },
  {
    name: "Mr George Hong",
    degree: "Master of Accounting",
    uni: "Macquarie University",
    role: "Assistant Relationship Manager (Westpac)",
    quote: "Study & Work helped me get my first job in accounting. After 3 years I moved to banking at Westpac as Credit Analyst and was promoted within 4 months with 100% salary growth!"
  },
  {
    name: "Mr Jeffery Hong",
    degree: "Master of Commerce",
    uni: "The University of Sydney",
    role: "Finance Manager",
    quote: "Thanks to Study & Work, I started my first full-time job after graduation, which provided the growth foundation to achieve my current position as Finance Manager."
  },
  {
    name: "Ms Lili Dong",
    degree: "Master of Professional Accounting",
    uni: "The University of Sydney",
    role: "Company Accountant",
    quote: "As a new graduate I didn't expect to find my first job in such an easy, hassle-free manner! Great people, great business, great way of thinking!"
  },
  {
    name: "Mr Nirmaljeet Sandhu",
    degree: "Master of Professional Accounting",
    uni: "Central Queensland University",
    role: "Financial Controller",
    quote: "As an international student it was impossible to get an accounting job without local experience. Study & Work made it happen!"
  },
  {
    name: "Ms Julie Zhu",
    degree: "Master of Commerce in Accounting",
    uni: "The University of Sydney",
    role: "Company Accountant",
    quote: "Study & Work provided an interview opportunity in two weeks' time and I got the job soon after. Professional and warm-hearted staff members!"
  },
  {
    name: "Mr Prashant Arora",
    degree: "Master of Professional Accounting",
    uni: "University of Wollongong",
    role: "Financial Controller",
    quote: "Placed into an accounting role in construction. Within 3 months I received a 30%+ jump in salary with incentives. Perfect destination for graduates!"
  }
];

function initAlumniSearch() {
  const searchInput = document.getElementById('alumniSearchInput');
  const alumniGrid = document.getElementById('alumniGridContainer');

  if (!alumniGrid) return;

  function renderAlumni(list) {
    if (!list.length) {
      alumniGrid.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 3rem; color: var(--color-slate-500);">No verified alumni records match your query.</div>`;
      return;
    }

    alumniGrid.innerHTML = list.map(item => `
      <div class="alumni-card-editorial">
        <div class="alumni-quote-text">"${item.quote}"</div>
        <div class="alumni-meta-profile">
          <div class="alumni-avatar-circle">${item.name.split(' ').pop().charAt(0)}</div>
          <div>
            <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem;">${item.name}</div>
            <div style="font-size: 0.8125rem; color: var(--color-slate-500);">${item.degree} — ${item.uni}</div>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-accent-emerald); margin-top: 0.2rem;">Currently: ${item.role}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  renderAlumni(ALUMNI_DATA);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = ALUMNI_DATA.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.degree.toLowerCase().includes(query) ||
        item.uni.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      );
      renderAlumni(filtered);
    });
  }
}

/* --------------------------------------------------------------------------
   6. INFINITE LOGO MARQUEE
   -------------------------------------------------------------------------- */
const LOGO_FILES = [
  "AAPC-Limited.jpg", "Accor-Advantage-Plus.jpg", "Atkore-International.jpg", "BH-Worldwide.jpg",
  "BigAir-Group.jpg", "Cater-Care-Australia.jpg", "Citigold-Corporation.jpg", "Daily-Fresh-Food-Service.jpg",
  "Demonz-Media.jpg", "Drake-International.jpg", "Eaton-Industries.jpg", "Glencore-Technology.jpg",
  "Global-Red-Australia.jpg", "Hilton-Hotel-Australia.jpg", "Impact-Minerals.jpg", "LG-Electronics.jpg",
  "LS-Travel-Retail-Pacific.jpg", "Medicraft-Hill-Rom.jpg", "Metcash.jpg", "Opus-Group-Australia.jpg",
  "Pacific-Restaurant-Group.jpg", "Peoplebank-Australia.jpg", "Publicis-Mojo-Australia.jpg", "SGS-Australia.jpg",
  "Santos.jpg", "The-Lido-Group.jpg", "Toll-Dnata.jpg", "aviation.jpg", "csc.jpg", "eulara.jpg",
  "holiday-inn.jpg", "tcg-group.jpg", "wh_smith.jpg"
];

function initLogoMarquee() {
  const track = document.getElementById('logoMarqueeTrack');
  if (!track) return;

  const doubleLogos = [...LOGO_FILES, ...LOGO_FILES];
  track.innerHTML = doubleLogos.map(filename => `
    <div class="logo-marquee-item">
      <img src="www.studyandwork.com.au/images/clients/${filename}" alt="Corporate Partner Logo" loading="lazy">
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   7. AUSTRALIAN LOCATIONS IMAGE TABS
   -------------------------------------------------------------------------- */
const CITY_DATA = {
  sydney: {
    title: "Sydney City & Parramatta Metropolitan Hub",
    address: "Level 15, 60 Station Street East, Parramatta NSW 2150 & Level 10, 66 Clarence Street, Sydney NSW 2000",
    desc: "Our primary Australian headquarters connects candidates directly with Australia's largest corporate, tech, financial, and engineering hubs across Sydney and Parramatta.",
    study: "University of Sydney, UNSW, UTS, Macquarie University, Western Sydney University, ICMS",
    jobs: "Corporate Accounting, AI Integration, Software Engineering, Civil Engineering, Finance, Hospitality"
  },
  melbourne: {
    title: "Melbourne Financial & Tech District",
    address: "330 Collins Street, Melbourne VIC 3000 (By Appointment)",
    desc: "Connecting international students and university graduates with Melbourne's premier commerce, digital technology, healthcare, and retail enterprises.",
    study: "University of Melbourne, Monash University, RMIT, Swinburne, Deakin, La Trobe",
    jobs: "Database Development, Logistics & Supply Chain, IT Support, Business Analysis, Accounting"
  },
  brisbane: {
    title: "Brisbane & Queensland Growth Region",
    address: "Queensland Metropolitan Operations",
    desc: "Facilitating engineering, IT automation, mining, and trade placements across Brisbane, Gold Coast, and regional Queensland.",
    study: "University of Queensland, QUT, Griffith University, James Cook University",
    jobs: "Project Engineering, Construction Management, Digital Marketing, Hotel Management"
  },
  perth: {
    title: "Perth & Western Australia",
    address: "WA Corporate Network Operations",
    desc: "Specialized engineering, energy, resources, and IT staffing connections for skilled migrants and university graduates across Western Australia.",
    study: "University of Western Australia, Curtin University, Murdoch University, Edith Cowan",
    jobs: "Mechanical & Mining Engineering, Environmental Science, Accounting, Systems Admin"
  },
  adelaide: {
    title: "Adelaide & South Australia",
    address: "South Australia Regional Operations",
    desc: "Dedicated traineeship, professional internship, and casual staffing solutions across South Australia's defense, tech, and agricultural sectors.",
    study: "University of Adelaide, University of South Australia, Flinders University",
    jobs: "Cyber Security, Agriculture Management, NDIS & Social Work, Finance"
  }
};

function initCityTabs() {
  const cityChips = document.querySelectorAll('.city-chip-btn');
  const cityDisplay = document.getElementById('cityDetailContainer');

  if (!cityChips.length || !cityDisplay) return;

  cityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      cityChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const key = chip.getAttribute('data-city');
      const data = CITY_DATA[key] || CITY_DATA.sydney;

      cityDisplay.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <span class="badge-tag">Australian Operations</span>
          <h3 class="heading-2">${data.title}</h3>
          <p class="lead-text" style="font-size: 1rem;">${data.desc}</p>
          
          <div style="background: var(--color-paper); border: 1px solid var(--color-slate-200); padding: 1.25rem; border-radius: var(--radius-md);">
            <div style="font-size: 0.875rem; color: var(--color-slate-700); margin-bottom: 0.5rem;">
              <strong>Key Partner Universities:</strong> ${data.study}
            </div>
            <div style="font-size: 0.875rem; color: var(--color-slate-700);">
              <strong>Key Placement Sectors:</strong> ${data.jobs}
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: center;">
            <a href="tel:1300798069" class="btn btn-primary" style="padding: 0.65rem 1.35rem; font-size: 0.875rem;">Call 1300 79 80 69</a>
            <button onclick="openModal('contact')" class="btn btn-secondary" style="padding: 0.65rem 1.35rem; font-size: 0.875rem;">Contact Office</button>
          </div>
        </div>

        <div style="border-radius: var(--radius-lg); overflow: hidden; height: 320px; background: var(--color-slate-100); box-shadow: var(--shadow-card);">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.882496826258!2d151.2053006!3d-33.86691899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12af9674be1273%3A0xd9378a799b4965c5!2s66%20Clarence%20St%2C%20Sydney%20NSW%202000!5e0!3m2!1sen!2sau!4v1750910160218" 
            width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
      `;
    });
  });

  // Trigger initial city view render
  if (cityChips[0]) cityChips[0].click();
}

/* --------------------------------------------------------------------------
   8. SIGNATURE CAREER JOURNEY STEPPER
   -------------------------------------------------------------------------- */
function initJourneyProgressStepper() {
  const nodeCards = document.querySelectorAll('.journey-node-card');
  const progressFill = document.getElementById('journeyLineFill');

  if (!nodeCards.length) return;

  function setActiveStage(index) {
    nodeCards.forEach((c, idx) => {
      if (idx === index) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    if (progressFill) {
      const percentage = ((index + 1) / nodeCards.length) * 100;
      progressFill.style.width = percentage + '%';
    }
  }

  nodeCards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => setActiveStage(idx));
    card.addEventListener('click', () => setActiveStage(idx));
  });
}

/* --------------------------------------------------------------------------
   9. MODAL MANAGER SYSTEM
   -------------------------------------------------------------------------- */
function initModalHandlers() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalCardBody');

  if (!overlay || !modalBody) return;

  window.openModal = function(type) {
    overlay.classList.add('active');
    
    if (type === 'hire') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Employer Staffing Request</span>
        <h3 class="heading-2">Request Qualified Talent</h3>
        <p class="lead-text" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Tell us about your hiring requirements. Evaluate candidates over 12 weeks with zero cost through an internship, or direct-hire with a 6-month satisfaction guarantee.
        </p>
        <div style="background: var(--color-slate-100); padding: 1.75rem; border-radius: var(--radius-md); text-align: center;">
          <p style="font-weight: 600; margin-bottom: 1.25rem;">Redirecting to Official JobAdder Staff Portal...</p>
          <a href="https://v2.forms.jobadder.com/f/LMxoE9RDy6g86zblKY5VrJ7AQ" target="_blank" class="btn btn-accent" style="width: 100%;">
            Open JobAdder Hire Request Form &rarr;
          </a>
        </div>
      `;
    } else if (type === 'work') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Candidate Registration</span>
        <h3 class="heading-2">Start Your Australian Career</h3>
        <p class="lead-text" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Register your profile to access 12-week professional internships, graduate jobs, traineeships, and employer visa sponsorship opportunities.
        </p>
        <div style="background: var(--color-slate-100); padding: 1.75rem; border-radius: var(--radius-md); text-align: center;">
          <p style="font-weight: 600; margin-bottom: 1.25rem;">Redirecting to Official JobAdder Candidate Portal...</p>
          <a href="https://v2.forms.jobadder.com/f/e8lxMELGRrgjrpgQV26WkPDnN" target="_blank" class="btn btn-accent" style="width: 100%;">
            Open JobAdder Candidate Application Form &rarr;
          </a>
        </div>
      `;
    } else if (type === 'consultation') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Free Career Consultation</span>
        <h3 class="heading-2">Book a Session with Our Team</h3>
        <p class="lead-text" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Discuss your Australian career goals, internship options, and visa pathways with a senior career consultant.
        </p>
        <div style="background: var(--color-slate-100); padding: 1.75rem; border-radius: var(--radius-md); text-align: center;">
          <a href="https://calendly.com/ryanshrestha" target="_blank" class="btn btn-primary" style="width: 100%;">
            Schedule on Calendly &rarr;
          </a>
        </div>
      `;
    } else if (type === 'contact') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Contact Us</span>
        <h3 class="heading-2">Get in Touch with Study & Work</h3>
        <p style="font-size: 0.9375rem; color: var(--color-slate-600); margin-bottom: 1.5rem;">
          Freecall Hotline: <strong>1300 79 80 69</strong> | Email: <strong>service@studyandwork.com.au</strong>
        </p>
        <form onsubmit="alert('Thank you for contacting Study & Work Australia. Our team will get back to you within 24 hours!'); closeModal(); return false;" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="text" placeholder="Your Full Name *" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
          <input type="email" placeholder="Your Email Address *" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
          <input type="tel" placeholder="Phone Number" style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
          <textarea rows="4" placeholder="How can we assist you?" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;"></textarea>
          <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
      `;
    } else if (type === 'search') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Global Search</span>
        <h3 class="heading-2">Search Study & Work Australia</h3>
        <input type="text" placeholder="Search internships, jobs, legal rights, or employers..." style="width: 100%; padding: 1rem; border-radius: var(--radius-full); border: 1px solid var(--color-slate-200); font-size: 1rem; outline: none; margin: 1.5rem 0;" oninput="this.nextElementSibling.style.display = this.value ? 'block' : 'none'">
        <div style="display: none; background: var(--color-slate-100); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-size: 0.875rem; color: var(--color-slate-600); margin-bottom: 0.5rem;">Quick Links:</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9375rem;">
            <li><a href="/candidates" data-link onclick="closeModal()">Candidate Opportunities &rarr;</a></li>
            <li><a href="/employers" data-link onclick="closeModal()">Employer Staffing Solutions &rarr;</a></li>
            <li><a href="/alumni" data-link onclick="closeModal()">8,000+ Alumni Directory &rarr;</a></li>
            <li><a href="/know-your-rights" data-link onclick="closeModal()">Fair Work Act Legal Rights &rarr;</a></li>
          </ul>
        </div>
      `;
    }
  };

  window.closeModal = function() {
    overlay.classList.remove('active');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}
