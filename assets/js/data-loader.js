// Data Loader — fetch JSON and populate DOM
(function () {
  'use strict';

  async function fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // ===== STATS =====
  async function loadStats() {
    const data = await fetchJSON('/data/stats.json');
    if (!data) return;

    // Summary counters
    const counters = {
      'stat-findings': data.summary.totalFindings,
      'stat-critical': data.summary.criticalFindings,
      'stat-engagements': data.summary.engagements,
      'stat-tools': data.summary.toolsUsed
    };

    Object.entries(counters).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('data-target', value);
    });

    // Severity bar
    const total = data.severityBreakdown.reduce((s, d) => s + d.count, 0);
    const barEl = document.getElementById('severity-bar');
    if (barEl) {
      barEl.innerHTML = data.severityBreakdown.map(s =>
        `<div class="severity-segment" style="flex-basis:${(s.count / total * 100).toFixed(1)}%;background:${s.color}">${s.count}</div>`
      ).join('');
    }

    const legendEl = document.getElementById('severity-legend');
    if (legendEl) {
      legendEl.innerHTML = data.severityBreakdown.map(s =>
        `<div class="severity-legend-item"><span class="severity-dot" style="background:${s.color}"></span>${s.label}: ${s.count}</div>`
      ).join('');
    }

    // Vuln categories
    const vulnEl = document.getElementById('vuln-categories');
    if (vulnEl) {
      vulnEl.innerHTML = data.vulnCategories.map(v =>
        `<div class="vuln-item"><span class="vuln-name">${v.name}</span><span class="vuln-count">${v.count}</span></div>`
      ).join('');
    }

    // Skills
    const skillsEl = document.getElementById('skills-list');
    if (skillsEl) {
      skillsEl.innerHTML = data.skills.map(s =>
        `<div class="skill-item fade-in">
          <div class="skill-header">
            <span class="skill-name">${s.name}</span>
            <span class="skill-percent">${s.level}%</span>
          </div>
          <div class="skill-track">
            <div class="skill-fill" data-width="${s.level}"></div>
          </div>
        </div>`
      ).join('');
    }
  }

  // ===== ENGAGEMENTS =====
  async function loadEngagements() {
    const data = await fetchJSON('/data/engagements.json');
    if (!data) return;

    const listEl = document.getElementById('engagement-list');
    if (listEl) {
      listEl.innerHTML = data.engagements.map(e =>
        `<div class="engagement-card fade-in">
          <div class="engagement-meta">
            <span class="badge badge-green">${e.status}</span>
            <span class="badge badge-cyan">${e.type}</span>
          </div>
          <h3 class="engagement-title">${e.name}</h3>
          <p class="engagement-desc">${e.description}</p>
          <div class="severity-mini">
            <span style="background:rgba(239,68,68,0.2);color:#ef4444">C:${e.severity.critical}</span>
            <span style="background:rgba(249,115,22,0.2);color:#f97316">H:${e.severity.high}</span>
            <span style="background:rgba(245,158,11,0.2);color:#f59e0b">M:${e.severity.medium}</span>
            <span style="background:rgba(34,197,94,0.2);color:#22c55e">L:${e.severity.low}</span>
          </div>
          <ul class="engagement-highlights">
            ${e.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
          <div class="engagement-tags">
            ${e.tags.map(t => `<span class="badge badge-purple">${t}</span>`).join('')}
          </div>
        </div>`
      ).join('');
    }

    // Bug bounty platforms
    const platformEl = document.getElementById('platform-list');
    if (platformEl) {
      platformEl.innerHTML = data.bugBountyPlatforms.map(p =>
        `<div class="platform-card">
          <div class="platform-name">${p.platform}</div>
          <div class="platform-status">${p.status}</div>
          <div class="platform-stats">Reports: ${p.stats.reports} | Bounties: ${p.stats.bounties}</div>
        </div>`
      ).join('');
    }
  }

  // ===== CASE STUDIES =====
  async function loadCaseStudies() {
    const data = await fetchJSON('/data/case-studies.json');
    if (!data) return;

    const listEl = document.getElementById('case-study-list');
    if (listEl) {
      listEl.innerHTML = data.caseStudies.map(cs =>
        `<div class="engagement-card fade-in">
          <div class="engagement-meta">
            <span class="badge badge-green">${cs.status}</span>
            <span class="badge badge-cyan">${cs.type}</span>
          </div>
          <h3 class="engagement-title">${cs.title}</h3>
          <p class="engagement-desc">${cs.summary}</p>
          <ul class="engagement-highlights">
            ${cs.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
          <div class="engagement-tags">
            ${cs.tags.map(t => `<span class="badge badge-purple">${t}</span>`).join('')}
          </div>
        </div>`
      ).join('');
    }
  }

  // ===== ACTIVITY =====
  async function loadActivity() {
    const data = await fetchJSON('/data/activity.json');
    if (!data) return;

    const typeColors = {
      assessment: 'green',
      investigation: 'red',
      hardening: 'cyan',
      infrastructure: 'purple',
      setup: 'yellow'
    };

    const timelineEl = document.getElementById('activity-timeline');
    if (timelineEl) {
      timelineEl.innerHTML = data.activity.map(a =>
        `<div class="timeline-item fade-in">
          <div class="timeline-date">${a.date}<span class="timeline-type badge badge-${typeColors[a.type] || 'cyan'}">${a.type}</span></div>
          <div class="timeline-title">${a.title}</div>
          <div class="timeline-desc">${a.description}</div>
        </div>`
      ).join('');
    }
  }

  // ===== SERVICES =====
  async function loadServices() {
    const data = await fetchJSON('/data/services.json');
    if (!data) return;

    const iconMap = {
      'shield-check': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5.25-3.5 10-7 11-3.5-1-7-5.75-7-11V6l7-4z"/><path d="M9 12l2 2 4-4"/></svg>',
      'search': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
      'radar': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4"/></svg>',
      'lock': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>'
    };

    const colors = ['green', 'cyan', 'purple', 'green'];

    const listEl = document.getElementById('services-list');
    if (listEl) {
      listEl.innerHTML = data.services.map((s, i) =>
        `<div class="card fade-in">
          <div class="card-icon ${colors[i % colors.length]}">${iconMap[s.icon] || ''}</div>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          <ul class="card-list">
            ${s.capabilities.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>`
      ).join('');
    }
  }

  // ===== TOOLS =====
  async function loadTools() {
    const data = await fetchJSON('/data/tools.json');
    if (!data) return;

    const toolsEl = document.getElementById('tools-list');
    if (toolsEl) {
      toolsEl.innerHTML = data.toolCategories.map(cat =>
        `<div class="tool-category fade-in">
          <div class="tool-category-name">${cat.category}</div>
          <div class="tool-tags">
            ${cat.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}
          </div>
        </div>`
      ).join('');
    }
  }

  // ===== BLOG PREVIEW =====
  async function loadBlogPreview() {
    const data = await fetchJSON('/data/blog-posts.json');
    if (!data) return;

    const el = document.getElementById('blog-preview-list');
    if (!el) return;

    const latest = data.posts.slice().reverse().slice(0, 3);
    el.innerHTML = latest.map(function(p) {
      return '<a href="/blog/' + p.slug + '" class="blog-card fade-in">' +
        '<span class="blog-card-date">' + p.date + ' &middot; ' + p.readTime + '</span>' +
        '<h3 class="blog-card-title">' + p.title + '</h3>' +
        '<p class="blog-card-excerpt">' + p.excerpt + '</p>' +
        '<div class="blog-card-tags">' +
          p.tags.map(function(t) { return '<span class="blog-tag">' + t + '</span>'; }).join('') +
        '</div>' +
      '</a>';
    }).join('');
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadEngagements();
    loadCaseStudies();
    loadActivity();
    loadServices();
    loadTools();
    loadBlogPreview();
  });
})();
