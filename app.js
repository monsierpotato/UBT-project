"use strict";

const REQUEST_CONTEXT = {
  tenantId: "T01",
  requesterId: "P000010",
  allowedAcl: ["EMPLOYEE", "APAC"],
};

const ABBREVIATIONS = {
  vp: { canonical: "vice president", entity: "title:VICE_PRESIDENT", confidence: "high" },
  "v.p.": { canonical: "vice president", entity: "title:VICE_PRESIDENT", confidence: "high" },
  svp: { canonical: "senior vice president", entity: "title:SENIOR_VICE_PRESIDENT", confidence: "high" },
  jp: { canonical: "japan", entity: "country:JP", confidence: "high" },
  vn: { canonical: "vietnam", entity: "country:VN", confidence: "high" },
  semi: { canonical: "semiconductor", entity: "industry:SEMICONDUCTOR", confidence: "medium" },
  ai: { canonical: "artificial intelligence", entity: "skill:AI", confidence: "high" },
  pm: {
    canonical: "product manager project manager",
    entity: "title:PRODUCT_MANAGER | PROJECT_MANAGER",
    confidence: "ambiguous",
  },
};

const PROFILES = [
  {
    id: "P000184",
    name: "Kenji Sato",
    aliases: ["K Sato", "Sato Kenji"],
    title: "Vice President",
    department: "Semiconductor Operations",
    skills: ["semiconductor", "chip manufacturing", "fab operations", "supply chain", "leadership"],
    projects: ["Japan Fab Expansion", "APAC Chip Supply"],
    city: "Tokyo",
    country: "JP",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000512",
    name: "Emi Tanaka",
    aliases: ["E Tanaka"],
    title: "Senior Director",
    department: "Microelectronics Strategy",
    skills: ["microelectronics", "semiconductor", "market strategy", "leadership"],
    projects: ["Tokyo Advanced Packaging"],
    city: "Tokyo",
    country: "JP",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000734",
    name: "Alex Mercer",
    aliases: ["A Mercer"],
    title: "Chief Technology Officer",
    department: "AI Platforms",
    skills: ["artificial intelligence", "automotive", "computer vision", "technical leadership"],
    projects: ["Autonomous Mobility Platform", "AI Factory"],
    city: "Singapore",
    country: "SG",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000338",
    name: "Yuki Nakamura",
    aliases: ["Y Nakamura"],
    title: "Product Manager",
    department: "AI Products",
    skills: ["artificial intelligence", "product strategy", "automotive", "roadmapping"],
    projects: ["Japan Mobility AI"],
    city: "Yokohama",
    country: "JP",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000341",
    name: "Hiro Ito",
    aliases: ["H Ito"],
    title: "Project Manager",
    department: "Enterprise Delivery",
    skills: ["project management", "artificial intelligence", "delivery", "risk management"],
    projects: ["Japan AI Modernization"],
    city: "Osaka",
    country: "JP",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000420",
    name: "Linh Nguyen",
    aliases: ["Nguyen Linh"],
    title: "Product Manager",
    department: "Applied AI",
    skills: ["artificial intelligence", "product discovery", "recommendation systems"],
    projects: ["Talent Intelligence"],
    city: "Ho Chi Minh City",
    country: "VN",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000611",
    name: "Sophie Martin",
    aliases: ["S Martin"],
    title: "Vice President Engineering",
    department: "Automotive Systems",
    skills: ["automotive", "embedded systems", "leadership", "machine learning"],
    projects: ["Connected Vehicle Platform"],
    city: "Paris",
    country: "FR",
    tenant: "T01",
    acl: ["EMPLOYEE", "EU"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000809",
    name: "Ravi Patel",
    aliases: ["R Patel"],
    title: "Director of Engineering",
    department: "Semiconductor Systems",
    skills: ["semiconductor", "verification", "chip design", "engineering management"],
    projects: ["Silicon Validation Program"],
    city: "Bengaluru",
    country: "IN",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000920",
    name: "Mai Tran",
    aliases: ["Tran Mai"],
    title: "AI Program Lead",
    department: "Automotive Innovation",
    skills: ["artificial intelligence", "automotive", "program leadership", "machine learning"],
    projects: ["Smart Factory Vision"],
    city: "Hanoi",
    country: "VN",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000010",
    name: "Demo Requester",
    aliases: [],
    title: "Strategy Manager",
    department: "Corporate Strategy",
    skills: ["strategy"],
    projects: [],
    city: "Tokyo",
    country: "JP",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P009999",
    name: "Private Executive",
    aliases: [],
    title: "Vice President",
    department: "Semiconductor Investments",
    skills: ["semiconductor", "leadership"],
    projects: ["Confidential Fab Acquisition"],
    city: "Tokyo",
    country: "JP",
    tenant: "T02",
    acl: ["EXECUTIVE"],
    active: true,
    type: "HUMAN",
  },
  {
    id: "P000777",
    name: "Former VP Japan",
    aliases: [],
    title: "Vice President",
    department: "Semiconductor Operations",
    skills: ["semiconductor", "fab operations"],
    projects: ["Japan Fab Expansion"],
    city: "Tokyo",
    country: "JP",
    tenant: "T01",
    acl: ["EMPLOYEE", "APAC"],
    active: false,
    type: "HUMAN",
  },
];

const SEMANTIC_GROUPS = [
  ["semiconductor", "chip", "silicon", "microelectronics", "fab"],
  ["artificial intelligence", "ai", "machine learning", "computer vision"],
  ["automotive", "mobility", "vehicle", "car"],
  ["lead", "leadership", "manager", "director", "vice president", "chief"],
  ["japan", "jp", "tokyo", "osaka", "yokohama"],
  ["product manager", "product strategy", "roadmapping", "product discovery"],
  ["project manager", "project management", "delivery", "program leadership"],
];

const els = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#search-input"),
  canonical: document.querySelector("#canonical-query"),
  route: document.querySelector("#query-route"),
  strategy: document.querySelector("#query-strategy"),
  resolutions: document.querySelector("#resolution-row"),
  results: document.querySelector("#results-list"),
  count: document.querySelector("#result-count"),
  trace: document.querySelector("#trace-list"),
  traceId: document.querySelector("#trace-id"),
  total: document.querySelector("#total-latency"),
  filterCount: document.querySelector("#filter-count"),
};

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalize(value).split(" ").filter(Boolean);
}

function resolveQuery(rawQuery) {
  const tokens = tokenize(rawQuery);
  const canonicalTokens = [];
  const resolutions = [];

  tokens.forEach((token) => {
    const mapping = ABBREVIATIONS[token];
    if (!mapping) {
      canonicalTokens.push(token);
      return;
    }
    canonicalTokens.push(mapping.canonical);
    resolutions.push({ raw: token.toUpperCase(), ...mapping });
  });

  return {
    raw: rawQuery,
    normalized: tokens.join(" "),
    canonical: canonicalTokens.join(" "),
    resolutions,
  };
}

function isProbableName(query) {
  const q = normalize(query);
  const tokens = tokenize(q);
  if (tokens.length < 2 || tokens.length > 4) return false;
  return PROFILES.some((profile) => {
    const names = [profile.name, ...profile.aliases].map(normalize);
    return names.some((name) => name === q || name.includes(q) || q.includes(name));
  });
}

function routeQuery(resolved) {
  if (isProbableName(resolved.raw)) {
    return { queryClass: "NAME_LOOKUP", label: "NAME", strategy: "LEXICAL_ONLY" };
  }
  if (resolved.resolutions.length > 0 || tokenize(resolved.canonical).length <= 5) {
    return { queryClass: "STRUCTURED_LOOKUP", label: "STRUCTURED", strategy: "HYBRID" };
  }
  return { queryClass: "SEMANTIC_DISCOVERY", label: "SEMANTIC", strategy: "HYBRID" };
}

function filterProfiles() {
  const eligible = [];
  let removed = 0;
  PROFILES.forEach((profile) => {
    const aclMatch = profile.acl.some((tag) => REQUEST_CONTEXT.allowedAcl.includes(tag));
    const allowed =
      profile.tenant === REQUEST_CONTEXT.tenantId &&
      profile.active &&
      profile.type === "HUMAN" &&
      profile.id !== REQUEST_CONTEXT.requesterId &&
      aclMatch;
    if (allowed) eligible.push(profile);
    else removed += 1;
  });
  return { eligible, removed };
}

function profileText(profile) {
  return normalize(
    [
      profile.name,
      ...profile.aliases,
      profile.title,
      profile.department,
      ...profile.skills,
      ...profile.projects,
      profile.city,
      profile.country === "JP" ? "Japan JP" : profile.country === "VN" ? "Vietnam VN" : profile.country,
    ].join(" "),
  );
}

function lexicalScore(profile, resolved) {
  const raw = normalize(resolved.raw);
  const canonical = normalize(resolved.canonical);
  const text = profileText(profile);
  const name = normalize(profile.name);
  const aliases = profile.aliases.map(normalize);
  const tokens = [...new Set([...tokenize(raw), ...tokenize(canonical)])];
  let score = 0;

  if (name === raw) score += 24;
  else if (name.includes(raw) || raw.includes(name)) score += 14;
  if (aliases.some((alias) => alias === raw)) score += 18;
  if (normalize(profile.title).includes(canonical) || canonical.includes(normalize(profile.title))) score += 7;

  tokens.forEach((token) => {
    if (token.length < 2) return;
    if (name.includes(token)) score += 4;
    if (normalize(profile.title).includes(token)) score += 3.5;
    if (normalize(profile.department).includes(token)) score += 2.5;
    if (profile.skills.some((skill) => normalize(skill).includes(token))) score += 2.2;
    if (profile.projects.some((project) => normalize(project).includes(token))) score += 1.6;
    if (text.includes(token)) score += 0.35;
  });

  return Number(score.toFixed(4));
}

function expandSemanticTerms(query) {
  const normalized = normalize(query);
  const expanded = new Set(tokenize(normalized));
  SEMANTIC_GROUPS.forEach((group) => {
    if (group.some((term) => normalized.includes(normalize(term)))) {
      group.forEach((term) => tokenize(term).forEach((token) => expanded.add(token)));
    }
  });
  return expanded;
}

function denseScore(profile, resolved) {
  const queryTerms = expandSemanticTerms(resolved.canonical);
  const documentTerms = expandSemanticTerms(profileText(profile));
  let overlap = 0;
  queryTerms.forEach((term) => {
    if (documentTerms.has(term)) overlap += 1;
  });
  const denominator = Math.max(4, Math.sqrt(queryTerms.size * documentTerms.size));
  return Number(Math.min(0.99, overlap / denominator).toFixed(4));
}

function rankBranch(items, scoreKey) {
  return [...items]
    .filter((item) => item[scoreKey] > 0)
    .sort((a, b) => b[scoreKey] - a[scoreKey] || a.profile.id.localeCompare(b.profile.id));
}

function applyRrf(items, lexicalRanked, denseRanked, strategy) {
  const rankConstant = 60;
  const lexicalRanks = new Map(lexicalRanked.map((item, index) => [item.profile.id, index + 1]));
  const denseRanks = new Map(denseRanked.map((item, index) => [item.profile.id, index + 1]));

  return items
    .map((item) => {
      const lexicalRank = lexicalRanks.get(item.profile.id);
      const denseRank = denseRanks.get(item.profile.id);
      let rrf = lexicalRank ? 1 / (rankConstant + lexicalRank) : 0;
      if (strategy === "HYBRID" && denseRank) rrf += 1 / (rankConstant + denseRank);
      return { ...item, lexicalRank, denseRank, rrf };
    })
    .filter((item) => item.rrf > 0)
    .sort((a, b) => b.rrf - a.rrf || a.profile.id.localeCompare(b.profile.id));
}

function createTrace(resolved, strategy) {
  const tokenCount = Math.max(1, tokenize(resolved.canonical).length);
  const understand = 0.45 + tokenCount * 0.07;
  const lexical = 2.1 + tokenCount * 0.18;
  const embedding = strategy === "HYBRID" ? 3.4 + tokenCount * 0.16 : 0;
  const dense = strategy === "HYBRID" ? 4.2 + tokenCount * 0.12 : 0;
  const fusion = strategy === "HYBRID" ? 0.72 : 0.18;
  const serialize = 0.34;
  const rows = [
    ["understanding", understand],
    ["lexical_search", lexical],
    ...(strategy === "HYBRID" ? [["query_embedding", embedding], ["dense_hnsw", dense]] : []),
    ["fusion", fusion],
    ["serialization", serialize],
  ];
  const total = rows.reduce((sum, [, value]) => sum + value, 0);
  return { rows, total };
}

function safeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderResolutions(resolutions) {
  els.resolutions.innerHTML = resolutions.length
    ? resolutions
        .map(
          (item) =>
            `<span class="resolution-chip ${item.confidence === "ambiguous" ? "ambiguous" : ""}">${safeText(
              item.raw,
            )} → ${safeText(item.entity)} · ${safeText(item.confidence)}</span>`,
        )
        .join("")
    : '<span class="resolution-chip">No abbreviation expansion</span>';
}

function renderResults(results, strategy) {
  const visible = results.slice(0, 8);
  if (!visible.length) {
    els.results.innerHTML = '<div class="empty-state"><p>Không tìm thấy candidate phù hợp trong phạm vi ACL hiện tại.</p></div>';
    return;
  }

  els.results.innerHTML = visible
    .map(({ profile, lexicalRank, denseRank, rrf }, index) => {
      const denseActive = strategy === "HYBRID" && denseRank;
      return `<article class="candidate">
        <span class="rank">#${String(index + 1).padStart(2, "0")}</span>
        <div class="candidate-name">
          <strong>${safeText(profile.name)}</strong>
          <span>${safeText(profile.title)} · ${safeText(profile.department)}</span>
          <div class="candidate-signals">
            <i class="${lexicalRank ? "active" : ""}">lex ${lexicalRank ?? "-"}</i>
            <i class="${denseActive ? "active" : ""}">dense ${denseRank ?? "-"}</i>
          </div>
        </div>
        <div class="candidate-meta">${safeText(profile.city)}, ${safeText(profile.country)} · ${safeText(
          profile.skills.slice(0, 2).join(" · "),
        )}</div>
        <div class="candidate-score">
          <strong>${rrf.toFixed(5)}</strong>
          <small>RRF score</small>
        </div>
      </article>`;
    })
    .join("");
}

function renderTrace(trace) {
  const maximum = Math.max(...trace.rows.map(([, value]) => value));
  els.trace.innerHTML = trace.rows
    .map(
      ([name, value]) => `<div class="trace-row">
        <div><span>${name}</span><span>${value.toFixed(2)} ms</span></div>
        <div class="trace-bar"><i style="width:${Math.max(5, (value / maximum) * 100)}%"></i></div>
      </div>`,
    )
    .join("");
  els.total.textContent = trace.total.toFixed(1);
}

function hashQuery(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).slice(0, 4).padStart(4, "0");
}

function runSearch(rawQuery) {
  const query = rawQuery.trim();
  if (!query) {
    els.input.focus();
    return;
  }

  const resolved = resolveQuery(query);
  const route = routeQuery(resolved);
  const { eligible, removed } = filterProfiles();
  const scored = eligible.map((profile) => ({
    profile,
    lexical: lexicalScore(profile, resolved),
    dense: route.strategy === "HYBRID" ? denseScore(profile, resolved) : 0,
  }));
  const lexicalRanked = rankBranch(scored, "lexical");
  const denseRanked = route.strategy === "HYBRID" ? rankBranch(scored, "dense") : [];
  const fused = applyRrf(scored, lexicalRanked, denseRanked, route.strategy);
  const trace = createTrace(resolved, route.strategy);

  els.canonical.textContent = resolved.canonical;
  els.route.textContent = route.label;
  els.strategy.textContent = route.strategy;
  els.count.textContent = `${Math.min(8, fused.length)} shown · ${eligible.length} eligible`;
  els.filterCount.textContent = `${removed} removed`;
  els.traceId.textContent = `q-${hashQuery(query)}`;
  renderResolutions(resolved.resolutions);
  renderResults(fused, route.strategy);
  renderTrace(trace);
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch(els.input.value);
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    els.input.value = button.dataset.query;
    runSearch(button.dataset.query);
  });
});

runSearch(els.input.value);
