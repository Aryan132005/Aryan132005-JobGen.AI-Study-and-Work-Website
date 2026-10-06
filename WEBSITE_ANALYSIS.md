# Study & Work Australia — Complete Website Audit, Strategy & Re-Architecture Analysis

## Executive Summary
This document provides a comprehensive analysis of the local clone/export of the **Study & Work Australia** website (`www.studyandwork.com.au`), detailing the complete business content, existing functionality, digital assets, new information architecture, design system, and technical implementation strategy for the 2026 platform overhaul.

---

## 1. PHASE 1 — LOCAL CLONE INSPECTION & CONTENT INVENTORY

### 1.1 Page & Route Mapping
| Existing Page | URL Route | Core Content & Business Purpose | Key Assets & Data |
| :--- | :--- | :--- | :--- |
| **Homepage** | `/index.html` | Hero positioning, candidate/employer role split, featured services, logotape of partners, client testimonials, alumni CTA. | Slider banner images (`1111.png`, `2222.png`, `3333.png`), video ad (`STUDYANDWORK DIGITAL AD 2021.mp4`), 33 partner logos. |
| **Professional Internship Program** | `/internship.html` | 12-week structured internship overview, career/migration pathway flow, step-by-step application process, target industries, AI Automation internship spotlight. | Videos (`v1.mp4`, `interns1.mp4`), partner logo track (`aap-1.png`, `eha.png`, etc.). |
| **Employers** | `/employers.html` | Employer talent solutions ("PHDs" - Poor, Hungry, Driven), pricing breakdown (5-10% direct hire, 65% temp markup), visa sponsorship options (Subclass 407 & 482). | Employer video (`employerVideo.mp4`), link to JobAdder Staff Request form. |
| **Jobseekers** | `/jobseeker.html` | Jobseeker navigation hub, internship vs placement choices, career entry options. | Topline banner (`job-seeker-topline.png`), candidate application form links. |
| **Professional Staffing Solution** | `/staffing.html` | In-depth professional recruitment & staffing services for corporate clients across IT, Finance, Engineering, and Management. | Detailed service copy, contact hotlines. |
| **Education Providers** | `/pages/education-providers.html` | Work Integrated Learning (WIL) partnerships, university employability enhancement, list of 145+ Australian & International university partners. | University partnership video (`PIPE.mp4`), partner institution directory. |
| **Hire an Apprentice** | `/pages/hire-an-apprentice.html` | Traineeship and apprenticeship hiring for Australian businesses with government incentives. | Service specs, apprentice intake forms. |
| **Casual Staffing Solution** | `/pages/casual-staffing-solution.html` | On-demand, flexible casual workforce for hospitality, retail, customer service, and events. | Flexible staffing models, hourly charge structures. |
| **Casual Jobs** | `/pages/casual-jobs.html` | Flexible student jobs to support living expenses while studying in Australia. | Student job guide, application pathways. |
| **Apprenticeship Program** | `/pages/apprenticeship-program.html` | Structured vocational training and workplace placement for trade and technical careers. | Program duration, qualification criteria. |
| **Know Your Rights** | `/pages/know-your-rights.html` | Australian Fair Work Act compliance, legalities of un-paid vs paid internships, worker protections for international students and migrants. | Legal references, Fair Work Act guidelines. |
| **Our Alumni** | `/pages/our-alumni.html` | Directory of 8,000+ candidates placed in 3,000+ businesses, searchable/filterable by 145+ universities. | Structured JSON data of alumni names, degrees, and LinkedIn profiles. |
| **About Us** | `/pages/about-us.html` | Corporate background (Operating since 2007), mission statement, leadership values, performance stats. | Corporate story, accreditation badges. |
| **Privacy Policy** | `/pages/privacy-policy.html` | Data privacy guidelines, candidate data protection, cookie policy. | Legal privacy terms. |
| **Contact Us** | `/contact.html` | Physical office locations (Parramatta, Sydney City, Melbourne City), telephone hotlines, email, contact form, Google Maps. | Contact videos (`contact1.mp4`, `paramatta.mp4`), maps embeds, reCAPTCHA. |
| **Application Form** | `/applicationform.html` | Candidate application portal. | JobAdder form integration (`e8lxMELGRrgjrpgQV26WkPDnN`). |
| **News & Articles** | `/news_articles.html` & 18 Articles | Industry insights, COVID-19 advocacy for international students, press mentions (Buzzfeed, News.com.au, Talent agency rankings). | Article HTML files, media coverage text. |

---

### 1.2 Business Content & Verified Metrics
- **Legal Entity**: Budding Talents Recruitment Pty Ltd trading as **STUDYANDWORK** (ABN: 42 129 512 474)
- **Verified Metrics**:
  - **8,000+** Candidates placed in professional roles and internships.
  - **3,000+** Partner host companies across Australia.
  - **19+ Years** of continuous operation (Established in 2007).
- **Employer Pricing Models**:
  - **Direct-Hire Permanent Recruitment**: 5% of annual salary package for candidates with <2 years experience; 10% fee for candidates with &ge;2 years experience. Includes a **6-month replacement guarantee** at no extra cost.
  - **On-Hire Temporary Staffing**: 65% markup on base hourly salary (covers recruitment, salary, superannuation, payroll tax, workers compensation).
  - **Try Before You Hire (Host an Intern)**: No-cost 12-week evaluation period to assess candidate performance before making a permanent offer.
  - **Visa Sponsorship Sourcing**: Subclass 407 Training Visa ($60,000 + super); Subclass 482 Skills in Demand Visa ($80,000 + super).
- **Contact Details**:
  - **Freecall Hotline**: 1300 79 80 69
  - **Sydney Telephone**: 02 8233 6138
  - **Mobile Contact**: 0421 338 592 | 0466 110 995
  - **Email**: service@studyandwork.com.au
  - **Parramatta Head Office**: Level 15, 60 Station Street East, Parramatta NSW 2150
  - **Sydney City Office**: Level 10, 66 Clarence Street, Sydney NSW 2000
  - **Melbourne City Office**: 330 Collins Street, Melbourne VIC 3000 (By Appointment)

---

### 1.3 Verified Testimonials & Real Alumni
1. **Ms Thyaga Keerthipala**: BSc in Information Technology (Manchester Metropolitan Univ, UK) &rarr; *Database Developer*
2. **Mr Devesh Soni**: Master of Professional Accounting (Univ of Wollongong) &rarr; *Senior Fund Accountant*
3. **Ms Rebecca Zeng**: Bachelor of Accounting (Univ of Newcastle) &rarr; *Company Accountant*
4. **Mr George Hong**: Master of Accounting (Macquarie Univ) &rarr; *Assistant Relationship Manager (Westpac)*
5. **Mr Jeffery Hong**: Master of Commerce (Univ of Sydney) &rarr; *Finance Manager*
6. **Ms Lili Dong**: Master of Professional Accounting (Univ of Sydney) &rarr; *Company Accountant*
7. **Mr Nirmaljeet Sandhu**: Master of Professional Accounting (Central Queensland Univ) &rarr; *Financial Controller*
8. **Ms Julie Zhu**: Master of Commerce in Accounting (Univ of Sydney) &rarr; *Company Accountant*
9. **Mr Prashant Arora**: Master of Professional Accounting (Univ of Wollongong) &rarr; *Financial Controller*

---

## 2. EXISTING FUNCTIONALITY INVENTORY

1. **JobAdder Integration**:
   - Employer Staff Request Form: `https://v2.forms.jobadder.com/f/LMxoE9RDy6g86zblKY5VrJ7AQ`
   - Candidate Work Application Form: `https://v2.forms.jobadder.com/f/e8lxMELGRrgjrpgQV26WkPDnN`
   - Live Job Board / Opportunities: `https://clientapps.jobadder.com/93051/study-and-work`
2. **Consultation Booking**:
   - Calendly Integration: `https://calendly.com/ryanshrestha`
3. **Widgets & Trackers**:
   - Zendesk Live Chat Widget (`v2.zopim.com/?4JbsX5pvNRPJhRzxzEYTRHT0Firwvesn`)
   - Constant Contact Inline Form (`29f23bf9-8029-4d08-a352-2e4eeec21ab9`)
   - Google ReCAPTCHA v2 (`6Ld5xhITAAAAACVeJwLh-HmY_VGRZgeSyrA4egeu`)
   - Google Analytics (GTAG `G-ZWZP1HCDM4` & GA `UA-74818213-1`)
4. **Media Playback**:
   - HTML5 video streaming for 7 local MP4 files (`v1.mp4`, `PIPE.mp4`, `employerVideo.mp4`, `contact1.mp4`, `paramatta.mp4`, `interns1.mp4`, `STUDYANDWORK DIGITAL AD 2021.mp4`).

---

## 3. ASSET INVENTORY

- **Logo**: `www.studyandwork.com.au/images/StudyandWorkLogo.png`
- **33 Corporate Client Logos** (`www.studyandwork.com.au/images/clients/`):
  `AAPC-Limited.jpg`, `Accor-Advantage-Plus.jpg`, `Atkore-International.jpg`, `BH-Worldwide.jpg`, `BigAir-Group.jpg`, `Cater-Care-Australia.jpg`, `Citigold-Corporation.jpg`, `Daily-Fresh-Food-Service.jpg`, `Demonz-Media.jpg`, `Drake-International.jpg`, `Eaton-Industries.jpg`, `Glencore-Technology.jpg`, `Global-Red-Australia.jpg`, `Hilton-Hotel-Australia.jpg`, `Impact-Minerals.jpg`, `LG-Electronics.jpg`, `LS-Travel-Retail-Pacific.jpg`, `Medicraft-Hill-Rom.jpg`, `Metcash.jpg`, `Opus-Group-Australia.jpg`, `Pacific-Restaurant-Group.jpg`, `Peoplebank-Australia.jpg`, `Publicis-Mojo-Australia.jpg`, `SGS-Australia.jpg`, `Santos.jpg`, `The-Lido-Group.jpg`, `Toll-Dnata.jpg`, `aviation.jpg`, `csc.jpg`, `eulara.jpg`, `holiday-inn.jpg`, `tcg-group.jpg`, `wh_smith.jpg`.
- **Feature Photography**: `1111.png`, `2222.png`, `3333.png`, `Student-friendlyJobs.png`, `job-seeker.jpg`, `google-review.png`.

---

## 4. PHASE 2 — NEW INFORMATION ARCHITECTURE & SITEMAP

### User Journey Progression
`DISCOVER` &rarr; `STUDY` &rarr; `PREPARE` &rarr; `EXPERIENCE` &rarr; `CONNECT` &rarr; `GET HIRED` &rarr; `GROW`

### New Site Navigation Hierarchy
```
[Logo: Study & Work Australia]
├── Explore (Overview, Hero, Floating Stats, 4 Journey Portals)
├── For Candidates
│   ├── Professional Internship Program (12-Week Curriculum)
│   ├── Professional Job Placement
│   ├── Apprenticeship & Traineeship Pathways
│   ├── Casual Jobs
│   ├── Know Your Rights (Fair Work Act Compliance)
│   └── Alumni Success Stories
├── For Employers
│   ├── Host an Intern (Try Before You Hire - No Cost)
│   ├── Direct-Hire Permanent Recruitment (5%-10% Fee)
│   ├── Temporary Staffing Solutions (65% Markup)
│   ├── Hire an Apprentice / Trainee
│   └── Visa Sponsorship Talent (Subclass 407 / 482)
├── Education Providers (WIL & University Employability Support)
├── Resources & Insights (Fair Work Rights, AI Automation Trends, Articles)
├── About Us (History Since 2007, Offices, ABN)
└── [PRIMARY ACTION CTAs: "I WANT TO WORK" | "I WANT TO HIRE"]
```

---

## 5. PHASE 3 & 4 — NEW BRAND EXPERIENCE & DESIGN SYSTEM

### Color Tokens
- `--color-ink`: `#0B192C` (Deep Navy / Ink)
- `--color-ink-soft`: `#1E293B` (Elevated Charcoal Ink)
- `--color-paper`: `#FAFBFD` (Warm Premium Off-White)
- `--color-surface`: `#FFFFFF` (Pure Crisp White)
- `--color-slate-200`: `#E2E8F0` (Soft Divider Rule)
- `--color-slate-600`: `#475569` (Muted Slate Grey)
- `--color-accent-blue`: `#0284C7` (Australian Ocean Blue)
- `--color-accent-emerald`: `#059669` (Career Growth Emerald)
- `--color-accent-amber`: `#D97706` (Aspirational Gold)

### Typography
- **Headings & Display**: `Outfit` (Sans-serif, 600–800 weight)
- **Body & Controls**: `Inter` (Sans-serif, 400–600 weight)

### Visual Characteristics
- Editorial, human, confident, modern Australian brand identity.
- Asymmetric grid compositions, generous whitespace, floating data badges.
- High-contrast dark statistic blocks & subtle backdrop-filter glassmorphism navbar.

---

## 6. PHASE 5 — HOMEPAGE STRUCTURE & IMPLEMENTATION

1. **Hero Section**:
   - Headline: *"Turn Your Potential Into an Australian Career."*
   - Subtitle: *"Study. Gain experience. Connect with industry. Build a career that moves forward."*
   - Live Stat Floating Cards: `8,000+` Candidates Placed | `3,000+` Host Businesses | `Since 2007`.
2. **Find Your Path (4 Role Portals)**:
   - Student, Graduate, Professional, Employer interactive cards.
3. **Signature Stepper ("From Study &rarr; To Career")**:
   - `01 Discover` &rarr; `02 Prepare` &rarr; `03 Experience` &rarr; `04 Connect` &rarr; `05 Get Hired` &rarr; `06 Grow`.
4. **Internship Spotlight**:
   - *"Your degree opens the door. Experience gets you through it."*
   - HTML5 Video Player (`v1.mp4`).
5. **Employer Talent Solutions**:
   - *"Meet the people behind the potential."*
   - Try Before You Hire, Direct Recruitment (5-10% Fee), Temporary Staffing (65% Markup), Subclass 407/482 Visa Talent.
6. **Dark Statistic & Corporate Partner Showcase**:
   - Dark section with live animated counters and 33 verified client logos.
7. **Filterable Alumni Directory**:
   - Search bar for instant filtering across real alumni testimonials.
8. **Australian Locations Hub**:
   - Interactive tabs for Sydney, Parramatta, Melbourne, Brisbane, Perth, Adelaide.
9. **Resources & Fair Work Compliance**:
   - Fair Work Act guidelines and AI Automation Internship spotlight.
10. **High-Impact Final CTA**:
    - *"Your Australian career starts with one decision."* with direct telephone hotline `1300 79 80 69`.

---

## 7. TECHNICAL ARCHITECTURE & DEPLOYMENT

The re-built website is deployed in the workspace root:
- `index.html`: Main single-page web application.
- `styles.css`: Complete design system, utility classes, keyframe animations, dark mode rules.
- `app.js`: Interactive navigation, scroll-triggered animated counters, alumni search engine, city tab switcher, and modal form manager.

**Local Server URL**: `http://localhost:3000`
