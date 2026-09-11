/* Mg Signatures in ribosomes — badges, D3 graph, 3Dmol viewer. */
(() => {
  "use strict";

  const VERDE_MG = "#1e9e4a";
  const COR_CLASSE = {
    MG: VERDE_MG, Ow: "#7fb2e5", Oph: "#c0392b", Or: "#d08a1e",
    Ob: "#8e44ad", Nb: "#1f9e56", N: "#1f9e56", Obb: "#5d6d7e",
    Ocoo: "#b03a2e", Ocno: "#af7ac5", Ocoh: "#d4ac0d", Nhis: "#148f77",
  };
  const COR_RES = {
    G: "#d92b2b", A: "#1f4fd8", C: "#e0a11e", U: "#1f9e56",
    ASP: "#b03a2e", GLU: "#c0392b", HIS: "#148f77", ASN: "#af7ac5",
    SER: "#d4ac0d", THR: "#e0a11e", ARG: "#1f4fd8", LYS: "#2e86c1",
  };
  // O no e uma classe de atomo (pagina atoms) ou um residuo (pagina
  // residues); uma so tabela cobre as duas, com a agua igual nos dois nomes.
  const COR_EXTRA = {
    W: "#4da3e0", Ow: "#4da3e0",
    AG: "#8e3b8e",  // purina
    UC: "#1f8a70",  // pirimidina
    AA: "#7f8c8d",  // aminoacido
  };
  // Uma tabela so: o anel de uma pagina mostra o que a outra usa como no
  // (residuo na pagina de atomos, classe de atomo na de residuos), entao a
  // busca tem de cobrir os dois vocabularios.
  // "G-P", "A-B"... herdam a cor do nucleotideo; a parte fica no rotulo.
  const PARTE = /^([AUGC])-[PSB]$/;
  const cor = (k) => {
    const m = PARTE.exec(String(k));
    return COR_EXTRA[k] || COR_CLASSE[k] || COR_RES[k]
        || (m ? COR_RES[m[1]] : null) || "#8a9099";
  };
  const corClasse = cor, corRes = cor;
  const $ = (s) => document.querySelector(s);
  const escapa = (t) => String(t).replace(/[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const tip = $("#tip");
  let DADOS = null, atual = null;
  const VIS = {};            // visualizador 3D por container
  const temH = () => $("#chkH").checked;

  /* ---------------------------------------------------- legenda dos codigos */
  const NOME = {
    Ow: "water", Oph: "phosphate O", Or: "ribose O", Ob: "base O",
    Nb: "base N", N: "base N", Obb: "backbone C=O", Ocoo: "carboxylate O",
    Ocno: "amide O", Ocoh: "hydroxyl O", Nhis: "histidine N",
    W: "water", AA: "amino acid", AG: "purine (A or G)",
    UC: "pyrimidine (C or U)", A: "adenine", G: "guanine", C: "cytosine",
    U: "uracil",
  };
  const PARTE_N = { P: "phosphate", S: "sugar", B: "base" };

  /** "3Oph" -> "3 x phosphate O"; "G-B" -> "guanine, base". */
  function explica(tok) {
    const m = /^(\d*)(.+)$/.exec(tok);
    const n = m[1] ? `${m[1]} × ` : "";
    const k = m[2];
    const p = /^([AUGC])-([PSB])$/.exec(k);
    if (p) return `${n}${NOME[p[1]]}, ${PARTE_N[p[2]]}`;
    return n + (NOME[k] || k);
  }

  /** Frase inteira a partir de "5Ow+Oph ⇒ Oph+Or". */
  function explicaRotulo(txt) {
    return String(txt).split("⇒").map((lado) => lado.trim())
      .map((lado) => lado === "—" ? "nothing"
           : lado.split("+").map(explica).join(", "))
      .join("  ⇒  ");
  }

  const LEGENDA = {
    atoms: "<b>Cat_Wiz atom classes.</b> O<sub>w</sub> water · "
      + "O<sub>ph</sub> phosphate oxygen · O<sub>r</sub> ribose oxygen · "
      + "O<sub>b</sub> base oxygen · N<sub>b</sub> base nitrogen · "
      + "O<sub>bb</sub> backbone carbonyl · O<sub>coo</sub> carboxylate · "
      + "O<sub>cno</sub> amide · O<sub>coh</sub> hydroxyl · "
      + "N<sub>his</sub> histidine.",
    shell1: "<b>Cat_Wiz atom classes</b>, coordination sphere only. "
      + "O<sub>w</sub> water · O<sub>ph</sub> phosphate oxygen · "
      + "O<sub>r</sub> ribose oxygen · O<sub>b</sub> base oxygen · "
      + "N<sub>b</sub> base nitrogen.",
    residues: "<b>Neighbouring residues.</b> A, G, C, U nucleotides · "
      + "W water · three-letter codes are amino acids. Modified nucleotides "
      + "fall back to the parent base.",
    parts: "<b>Nucleotide + the moiety contacted.</b> The letter is the "
      + "nucleotide; the suffix is where the contact happens:<br>"
      + "<b>-P</b> phosphate (P, OP1, OP2, O5', O3')<br>"
      + "<b>-S</b> sugar (C1'–C5', O2', O4')<br>"
      + "<b>-B</b> base (everything else)<br>"
      + "So <b>G-B</b> is a contact with the base of a guanine. "
      + "W is water, AA an amino acid.",
    bases: "<b>Base type.</b> <b>AG</b> purine (adenine or guanine) · "
      + "<b>UC</b> pyrimidine (cytosine or uracil) · W water · "
      + "AA amino acid.",
  };

  function montaAjuda() {
    const b = $("#ajudaModo");
    if (!b) return;
    const txt = LEGENDA[window.APP_MODO];
    if (!txt) { b.hidden = true; return; }
    b.setAttribute("data-bs-content",
      txt + "<hr class='my-2'><span class='text-body-secondary'>A number "
          + "before a code is how many of that kind, e.g. 5O<sub>w</sub> "
          + "means five waters. ⇒ separates first from second shell.</span>");
    new bootstrap.Popover(b, { container: "body", customClass: "pop-legenda" });
  }

  /* ------------------------------------------------------------- badges */
  let GRUPOS = [], grupoAtual = null;

  /** Agrupa as assinaturas pelo perfil da PRIMEIRA camada. */
  function montaGrupos() {
    const m = new Map();
    for (const s of DADOS.signatures) {
      if (!m.has(s.shell1)) m.set(s.shell1, { shell1: s.shell1, itens: [], n: 0 });
      const g = m.get(s.shell1);
      g.itens.push(s); g.n += s.n;
    }
    GRUPOS = [...m.values()].sort((a, b) => b.n - a.n);
    GRUPOS.forEach((g, i) => { g.num = i + 1; g.id = "g" + i; });
  }

  function desenhaNivel1() {
    const termo = $("#busca").value.trim().toLowerCase();
    const box = $("#badges1");
    box.innerHTML = "";
    const lista = GRUPOS.filter((g) => !termo
      || g.shell1.toLowerCase().includes(termo)
      || g.itens.some((s) => s.label.toLowerCase().includes(termo)));
    for (const g of lista) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "badge-sig";
      b.dataset.id = g.id;
      b.title = `${explicaRotulo(g.shell1)} — ${g.n} site`
              + (g.n > 1 ? "s" : "");
      b.innerHTML = `<span class="lbl">${sub(g.shell1)}</span>`
        + `<span class="cnt${g.n >= 20 ? " hot" : ""}">${g.n}</span>`;
      b.addEventListener("click", () => selecionaGrupo(g.id));
      box.appendChild(b);
    }
    $("#resumoN1").textContent =
      `${lista.length} of ${GRUPOS.length} profiles · ${DADOS.n_sites} sites`;
    if (!lista.length) {
      box.innerHTML = '<span class="text-body-secondary small">'
        + "No first-shell profile matches.</span>";
    } else if (grupoAtual && lista.includes(grupoAtual)) {
      marca("#badges1", grupoAtual.id);
    } else {
      selecionaGrupo(lista[0].id);
    }
  }

  function selecionaGrupo(id) {
    grupoAtual = GRUPOS.find((g) => g.id === id);
    if (!grupoAtual) return;
    marca("#badges1", id);
    if (DADOS.single_shell) {
      // nesta pagina o perfil da primeira camada JA e a assinatura inteira
      $("#nivel2").hidden = true;
      seleciona(grupoAtual.itens[0].id);
      return;
    }
    $("#nivel2").hidden = false;
    desenhaNivel2();
  }

  function desenhaNivel2() {
    const g = grupoAtual;
    const box = $("#badges2");
    box.innerHTML = "";
    const lista = [...g.itens].sort((a, b) => b.n - a.n || a.num - b.num);
    $("#rotuloN1").textContent = `of ${g.shell1}`;
    for (const s of lista) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "badge-sig n2";
      b.dataset.id = s.id;
      b.title = `second shell: ${explicaRotulo(s.shell2)} — ${s.n} site`
              + (s.n > 1 ? "s" : "");
      b.innerHTML = `<span class="lbl">⇒ ${sub(s.shell2)}</span>`
        + `<span class="cnt${s.n >= 4 ? " hot" : ""}">${s.n}</span>`;
      b.addEventListener("click", () => seleciona(s.id));
      box.appendChild(b);
    }
    if (!atual || !lista.includes(atual)) seleciona(lista[0].id);
    else marca("#badges2", atual.id);
    $("#tituloGrafo").classList.remove("text-body-secondary");
  }

  const marca = (sel, id) => document.querySelectorAll(sel + " .badge-sig")
    .forEach((b) => b.classList.toggle("active", b.dataset.id === id));

  /* -------------------------------------------------------------- grafo */
  function seleciona(id) {
    atual = DADOS.signatures.find((s) => s.id === id);
    if (!atual) return;
    marca("#badges2", id);
    marca("#badges1", grupoAtual ? grupoAtual.id : "");
    $("#tituloGrafo").innerHTML =
      `<span class="font-monospace">${sub(DADOS.single_shell
          ? atual.shell1 : atual.label)}</span>`
      + ` <span class="badge rounded-pill ms-1" style="background:${VERDE_MG}">`
      + `${atual.n} site${atual.n > 1 ? "s" : ""}</span>`;
    desenhaGrafo(atual);
    desenhaComposicao(atual);
    render3D(atual, "viewer3d");
  }

  function desenhaGrafo(sig) {
    const svg = d3.select("#grafo");
    svg.selectAll("*").remove();
    const box = svg.node().getBoundingClientRect();
    const W = box.width || 700, H = box.height || 470;
    const cx = W / 2, cy = H / 2;
    const nodes = sig.graph.nodes.map((d) => ({ ...d }));
    const links = sig.graph.links.map((d) => ({ ...d }));

    // Layout radial fixo: o grafo e uma estrela de dois niveis, e um layout
    // deterministico le melhor que forca dirigida — alem de nao "pular" a
    // cada troca de assinatura.
    const prim = nodes.filter((n) => n.shell === 1);
    const R1 = Math.min(W, H) * 0.21, R2 = Math.min(W, H) * 0.40;
    prim.forEach((n, i) => {
      n.ang = -Math.PI / 2 + (2 * Math.PI * i) / prim.length;
      n.x = cx + R1 * Math.cos(n.ang);
      n.y = cy + R1 * Math.sin(n.ang);
    });
    for (const p of prim) {
      const filhos = nodes.filter((n) => n.shell === 2 &&
                                          n.id.startsWith(p.id + "_"));
      filhos.forEach((n, j) => {
        const sp = (j - (filhos.length - 1) / 2) * 0.30;
        n.x = cx + R2 * Math.cos(p.ang + sp);
        n.y = cy + R2 * Math.sin(p.ang + sp);
      });
    }
    const mg = nodes.find((n) => n.id === "mg");
    mg.x = cx; mg.y = cy;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const raio = (d) => d.id === "mg" ? 25 : d.shell === 1 ? 20 : 16;

    // Ordinal de cada no entre os da MESMA classe. O 2o contato de uma classe
    // nao existe em todos os sitios do grupo: e essa fracao que a aresta
    // desbota. Antes a opacidade vinha de `peso` — a contagem da classe no
    // representante — que e igual para todas as arestas da classe e portanto
    // nao distinguia a aresta de 22/22 da de 1/22.
    const vistos = {}, ordem = {}, presenca = {};
    for (const n2 of nodes) {
      if (n2.shell !== 2) continue;
      vistos[n2.cls] = (vistos[n2.cls] || 0) + 1;
      ordem[n2.id] = vistos[n2.cls];
      const p = ((sig.presence || {})[n2.cls] || [])[vistos[n2.cls] - 1];
      presenca[n2.id] = p === undefined ? null : p / sig.n;
    }

    const g = svg.append("g");
    const pos = (d, eixo, ponta) => byId[d[ponta]][eixo];
    g.selectAll("line.link").data(links).join("line")
      .attr("class", (d) => {
        const alvo = byId[d.target];
        const agua = alvo.shell === 2 && (alvo.cls === "Ow" || alvo.cls === "W");
        return "link hbond" + (agua ? " solvente" : "");
      })
      // Quanto mais raro o contato no grupo, mais clara e fina a aresta.
      .attr("stroke-opacity", (d) => {
        const f = presenca[d.target];
        return f == null ? null : (0.2 + 0.8 * f).toFixed(2);
      })
      .attr("stroke-width", (d) => {
        const f = presenca[d.target];
        return f == null ? null : (0.9 + 2.1 * f).toFixed(2);
      })
      .attr("x1", (d) => byId[d.source].x).attr("y1", (d) => byId[d.source].y)
      .attr("x2", (d) => byId[d.target].x).attr("y2", (d) => byId[d.target].y);

    g.selectAll("line.hit").data(links).join("line")
      .attr("class", "hit")
      .attr("x1", (d) => pos(d, "x", "source")).attr("y1", (d) => pos(d, "y", "source"))
      .attr("x2", (d) => pos(d, "x", "target")).attr("y2", (d) => pos(d, "y", "target"))
      .attr("stroke", "transparent").attr("stroke-width", 12)
      .style("cursor", "help")
      .on("mousemove", (ev, d) => tipAresta(ev, d, sig, byId, ordem))
      .on("mouseleave", escondeTip);

    const no = g.selectAll("g.node").data(nodes).join("g")
      .attr("class", (d) => "node" + (d.cls === "Ow" ? " water" : "")
                          + (d.id === "mg" ? " clickable" : ""))
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // anel de composicao A/U/G/C, so em no de RNA/proteina
    no.each(function (d) {
      const comp = sig.composition[d.cls];
      if (d.shell === 0 || d.cls === "Ow" || !comp) return;
      const total = Object.values(comp).reduce((a, b) => a + b, 0);
      if (!total) return;
      const r = raio(d);
      const arco = d3.arc().innerRadius(r + 1.5).outerRadius(r + 6);
      const pie = d3.pie().sort(null).value((x) => x[1])(Object.entries(comp));
      d3.select(this).selectAll("path.ring").data(pie).join("path")
        .attr("class", "ring").attr("d", arco)
        .attr("fill", (x) => corRes(x.data[0]));
    });

    no.append("circle").attr("r", raio)
      .attr("fill", (d) => corClasse(d.cls))
      .attr("stroke", (d) => presenca[d.id] != null ? "#212529" : "none")
      .attr("stroke-opacity", (d) => presenca[d.id] != null
        ? (0.05 + 0.35 * presenca[d.id]).toFixed(2) : 0)
      .attr("stroke-width", (d) => presenca[d.id] != null ? 1.4 : 0);
    // "Ow", "Oph", "Nb"... sao elemento + sufixo; o sufixo vai subscrito,
    // como na notacao do Cat_Wiz.
    no.append("text").attr("text-anchor", "middle").attr("dy", "0.34em")
      .style("font-size", (d) => d.id === "mg" ? "13px" : "11px")
      .each(function (d) {
        const t = d3.select(this);
        const m = CLASSE_AT.exec(d.label);
        if (d.id === "mg" || !m) { t.text(d.label); return; }
        t.append("tspan").text(m[1] + m[2]);
        t.append("tspan").attr("dy", "0.32em")
          .style("font-size", "0.72em").text(m[3]);
      });

    no.on("mousemove", (ev, d) => mostraTip(ev, d, sig))
      .on("mouseleave", escondeTip);
    no.filter((d) => d.id === "mg").on("click", abreFull);
  }

  const CAMADA = { 0: "ion", 1: "first shell", 2: "second shell" };
  const DESCR = {
    Ow: "water oxygen", Oph: "phosphate oxygen", Or: "ribose oxygen",
    Ob: "base oxygen", Nb: "base nitrogen", Obb: "backbone carbonyl",
    Ocoo: "carboxylate oxygen", Ocno: "amide oxygen", Ocoh: "hydroxyl oxygen",
    Nhis: "histidine nitrogen",
  };

  function mostraTip(ev, d, sig) {
    const rep = sig.representative;
    if (d.id === "mg") {
      tip.innerHTML = `<strong>Mg²⁺</strong> ${escapa(rep.chain)}:${rep.resno}`
        + `<br><span class="opacity-75">signature #${sig.num} · ${sig.n} `
        + `site${sig.n > 1 ? "s" : ""} in this cluster</span>`
        + '<br><span class="opacity-75">click for the 3D view</span>';
      posicionaTip(ev);
      return;
    }
    const comp = sig.composition[d.cls] || {};
    const total = Object.values(comp).reduce((a, b) => a + b, 0);
    let html = `<strong>${escapa(d.cls)}</strong>`
             + (DESCR[d.cls] ? ` <span class="opacity-75">${DESCR[d.cls]}`
                             + "</span>" : "")
             + `<br><span class="opacity-75">${CAMADA[d.shell]}`
             + (d.residue && d.residue !== "HOH"
                ? ` · ${escapa(d.residue)} ${escapa(d.chain)}:${d.resno}`
                : d.residue === "HOH" ? ` · water ${escapa(d.chain)}:${d.resno}`
                : "")
             + " <em>in this site</em></span><br>";
    if (!total) {
      html += '<span class="opacity-75">no residue composition — '
            + "water has none</span>";
    } else {
      html += `<span class="opacity-75">${total} contacts across `
            + `${sig.n} site${sig.n > 1 ? "s" : ""}</span><br>`;
      for (const [res, v] of Object.entries(comp)) {
        html += `<span class="k" style="background:${corRes(res)}"></span>`
              + `${escapa(res)} ${(100 * v / total).toFixed(0)}%`
              + ` <span class="opacity-50">(${v})</span><br>`;
      }
    }
    tip.innerHTML = html;
    posicionaTip(ev);
  }

  function posicionaTip(ev) {
    tip.hidden = false;
    tip.style.left = Math.min(ev.pageX + 14,
      scrollX + innerWidth - tip.offsetWidth - 8) + "px";
    tip.style.top = (ev.pageY + 14) + "px";
  }
  const escondeTip = () => { tip.hidden = true; };

  /** Tooltip da aresta: faixa de distancia daquele tipo de contato no grupo. */
  function tipAresta(ev, d, sig, byId, ordem) {
    const alvo = byId[d.target];
    const camada = alvo.shell === 1 ? "shell1" : "shell2";
    const f = ((sig.distances || {})[camada] || {})[alvo.cls];
    const de = alvo.shell === 1 ? "Mg²⁺" : "H₂O";
    let html = `<strong>${escapa(de)} — ${escapa(alvo.cls)}</strong>`
      + ` <span class="opacity-75">· ${alvo.shell === 1
          ? "coordination bond" : "hydrogen bond"}</span><br>`;
    if (!f) {
      html += '<span class="opacity-75">no distance data</span>';
    } else {
      html += `<span class="opacity-75">across ${sig.n} `
        + `site${sig.n > 1 ? "s" : ""} · ${f.n} contact`
        + `${f.n > 1 ? "s" : ""}</span><br>`
        + `mean <strong>${f.mean.toFixed(2)} Å</strong><br>`
        + `range ${f.min.toFixed(2)} – ${f.max.toFixed(2)} Å`;
      if (f.min === f.max) {
        html += '<br><span class="opacity-75">no variation — these waters '
              + "were placed by the plugin</span>";
      }
      const j = ordem ? ordem[d.target] : null;
      const pres = ((sig.presence || {})[alvo.cls] || [])[j - 1];
      if (alvo.shell === 2 && pres !== undefined) {
        const pct = (100 * pres / sig.n).toFixed(0);
        html += `<br>present in <strong>${pres}/${sig.n}</strong> sites `
              + `(${pct}%)`
              + (j > 1 ? ` <span class="opacity-75">— as the ${j}${
                  j === 2 ? "nd" : j === 3 ? "rd" : "th"} contact of this `
                  + "class</span>" : "");
      }
    }
    tip.innerHTML = html;
    posicionaTip(ev);
  }

  /* ------------------------------------------------- ligantes por camada */
  function desenhaComposicao(sig) {
    const box = $("#painelComp");
    const rep = sig.representative;
    // Contagem do SITIO MOSTRADO, nao media do grupo: numero inteiro, e bate
    // com o que esta desenhado no grafo e no 3D ao lado.
    // `key` e o rotulo DA PAGINA (classe de atomo ou residuo); sem ele a
    // tabela da pagina de residuos listaria Oph/Nb em vez de G/A/U.
    const conta = (lista) => lista.reduce(
      (a, l) => (a[l.key || l.cls] = (a[l.key || l.cls] || 0) + 1, a), {});
    const c1 = conta(rep.shell1);
    const c2 = conta(rep.shell2.filter((l) => l.residue !== "HOH"));
    const ordem = (x) => (c1[x] || 0);
    const classes = [...new Set([...Object.keys(c1), ...Object.keys(c2)])]
      .sort((a, b) => (c1[b] || 0) - (c1[a] || 0) || a.localeCompare(b));

    const so1 = DADOS.single_shell;
    let html = '<table class="table table-sm align-middle mb-2">'
      + '<thead><tr>'
      + '<th class="fw-normal small text-body-secondary">class</th>'
      + '<th class="fw-normal small text-body-secondary text-center">'
      + (so1 ? "ligands" : "1st shell") + "</th>"
      + (so1 ? "" : '<th class="fw-normal small text-body-secondary '
                  + 'text-center">2nd shell</th>')
      + "</tr></thead><tbody>";
    for (const c of classes) {
      const n1 = c1[c] || 0, n2 = c2[c] || 0;
      const f = (sig.counts && sig.counts.shell2) ? sig.counts.shell2[c] : null;
      const varia = f && f.min !== f.max
        ? ` <span class="text-body-secondary">(${f.min}–${f.max})</span>` : "";
      html += "<tr>"
        + '<td class="py-1"><span class="d-inline-block rounded-1 me-1" '
        + `style="width:.65rem;height:.65rem;background:${corClasse(c)}">`
        + `</span><span class="font-monospace small">${sub(c)}</span></td>`
        + '<td class="py-1 text-center small'+(n1 ? " fw-semibold" : "")+'">'
        + (n1 || '<span class="text-body-secondary">—</span>') + "</td>"
        + (so1 ? "" : '<td class="py-1 text-center small'
            + (n2 ? " fw-semibold" : "") + '">'
            + (n2 || '<span class="text-body-secondary">—</span>') + varia
            + "</td>")
        + "</tr>";
    }
    html += "</tbody></table>"
      + '<p class="small text-body-secondary mb-0">'
      + (so1
         ? `The coordination sphere is identical in all ${sig.n} `
           + `member${sig.n > 1 ? "s" : ""} — that is what defines the group.`
         : "Counts for the site shown. The first shell is identical in every "
           + "member; the grey range is how the second shell varies across the "
           + `${sig.n} member${sig.n > 1 ? "s" : ""}. Waters are not counted `
           + "in the second shell.")
      + "</p>";
    box.innerHTML = html;
  }

  // So classe de atomo leva subscrito: "5Ow" -> 5O_w, "Nb" -> N_b.
  // Rotulo de residuo ("A+G+U", "ASP", "3G") fica como esta — sem isto o
  // "+" virava separador subscrito e ASP virava A_SP.
  const CLASSE_AT = /^(\d*)([ON])([a-z]+)$/;

  /** Subscreve o sufixo Cat_Wiz de cada termo de um rotulo. */
  function sub(c) {
    return String(c).split("+").map((t) => {
      const m = CLASSE_AT.exec(t);
      return m ? `${escapa(m[1])}${m[2]}<sub>${escapa(m[3])}</sub>`
               : escapa(t);
    }).join("+");
  }

  /* ------------------------------------------------------------- 3Dmol */
  function render3D(sig, alvoId) {
    const alvo = document.getElementById(alvoId);
    if (!alvo) return;
    alvo.innerHTML = "";
    const rep = sig.representative;
    const sub = `<strong>MG ${escapa(rep.chain)}:${rep.resno}</strong> of `
      + `${escapa(DADOS.structure)} · ${sig.n} member`
      + `${sig.n > 1 ? "s" : ""} in this cluster · `
      + `${rep.shell1.length} first-shell, ${rep.shell2.length} second-shell`;
    const p = $(alvoId === "viewer3d" ? "#repSub" : "#modalSub");
    if (p) p.innerHTML = sub;

    // fundo levemente cinza: hidrogenio branco desaparece no branco puro
    const v = $3Dmol.createViewer(alvo, { backgroundColor: "0xeef0f4" });
    VIS[alvoId] = v;
    // O arquivo com H e opcional: se o passo do addh nao foi rodado, cai no
    // fragmento normal e o interruptor some.
    const arq = DADOS.has_hydrogens ? `${sig.id}_h.pdb` : `${sig.id}.pdb`;
    $("#caixaH").hidden = !DADOS.has_hydrogens;
    fetch(`${window.APP_BASE}data/${window.APP_MODO}/frag/${arq}`)
      .then((r) => {
        if (!r.ok) throw new Error(`fragment not found (HTTP ${r.status})`);
        return r.text();
      })
      .then((pdb) => {
        // keepH: o parser de PDB do 3Dmol DESCARTA hidrogenios por padrao.
        // Sem isto o arquivo com H carrega, mas o modelo vem sem nenhum.
        v.addModel(pdb, "pdb", { keepH: true });
        estilo(v);
        const c = rep.xyz, pos = (a) => ({ x: a[0], y: a[1], z: a[2] });
        const TRACO = "0xf0c020";   // uma cor so para toda linha tracejada
        const grande = alvoId !== "viewer3d";
        const meio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2,
                                (a[2] + b[2]) / 2];
        const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        const medida = (a, b) => v.addLabel(dist(a, b).toFixed(2), {
          position: pos(meio(a, b)), inFront: true,
          fontSize: grande ? 9 : 7, fontColor: "0xffd24d",
          backgroundColor: "0x000000", backgroundOpacity: 0.7,
          borderThickness: 0, alignment: "center",
        });

        for (const l of rep.shell1) {
          v.addCylinder({ start: pos(c), end: pos(l.xyz), radius: 0.09,
                          color: TRACO, dashed: true, fromCap: 1, toCap: 1 });
          medida(c, l.xyz);
        }
        for (const l of rep.shell2) {
          const via = rep.shell1[l.via];
          if (!via) continue;
          v.addCylinder({ start: pos(via.xyz), end: pos(l.xyz), radius: 0.08,
                          color: TRACO, dashed: true, fromCap: 1, toCap: 1 });
          medida(via.xyz, l.xyz);
        }
        // Os rotulos sao empurrados para FORA do ion: postos sobre o proprio
        // atomo, dezessete deles se empilham em cima do centro e nada se le.
        const afasta = (xyz, d) => {
          const v3 = [xyz[0] - c[0], xyz[1] - c[1], xyz[2] - c[2]];
          const n = Math.hypot(...v3) || 1;
          return [xyz[0] + v3[0] / n * d, xyz[1] + v3[1] / n * d,
                  xyz[2] + v3[2] / n * d];
        };
        const rotulo = (txt, xyz, d) => v.addLabel(txt, {
          position: pos(afasta(xyz, d)), inFront: true,
          fontSize: grande ? 10 : 8, fontColor: "white",
          backgroundColor: "0x000000", backgroundOpacity: 0.75,
          borderThickness: 0, alignment: "center",
        });
        // So o atomo no rotulo; o resto sai no hover, senao o sitio some
        // debaixo de dezessete caixas de texto.
        rotulo("Mg", c, 0);
        for (const l of rep.shell1) rotulo(l.short, l.xyz, 0);
        for (const l of rep.shell2) rotulo(l.short, l.xyz, 0);

        const detalhe = new Map();
        for (const l of [...rep.shell1, ...rep.shell2]) {
          detalhe.set(l.xyz.join(","), l.label);
        }
        v.setHoverable({}, true, (atom, viewer) => {
          if (atom.__lbl) return;
          const k = [atom.x, atom.y, atom.z].map((n) => n.toFixed(3)).join(",");
          const txt = detalhe.get(k)
            || `${atom.resn} ${atom.chain}:${atom.resi} · ${atom.atom}`;
          atom.__lbl = viewer.addLabel(txt, {
            position: atom, inFront: true, fontSize: 12, fontColor: "white",
            backgroundColor: "0x000000", backgroundOpacity: 0.85,
            borderThickness: 0,
          });
          viewer.render();
        }, (atom, viewer) => {
          if (!atom.__lbl) return;
          viewer.removeLabel(atom.__lbl);
          delete atom.__lbl;
          viewer.render();
        });

        // zoomTo numa selecao de UM atomo enquadra uma caixa de extensao zero
        // e nao desenha nada; o zoom < 1 depois afasta o suficiente.
        v.zoomTo({ resn: "MGX" });
        v.zoom(grande ? 1.2 : 1.0);
        v.render();
      })
      .catch((e) => {
        alvo.innerHTML = '<div class="alert alert-warning mb-0 small">'
          + "Could not load the 3D fragment: " + escapa(e.message) + "</div>";
      });
  }

  /** Aplica o estilo; os H so aparecem com o interruptor ligado. */
  function estilo(v) {
    const comH = temH();
    // Bastao mais grosso + esfera pequena em cada atomo: as juntas ficam
    // arredondadas em vez de tubos cortados em angulo.
    v.setStyle({}, { stick: { radius: 0.19, colorscheme: "default" },
                     sphere: { scale: 0.19, colorscheme: "default" } });
    // Bastao, nao esfera: o objetivo e ver a ligacao covalente O-H.
    v.setStyle({ elem: "H" }, comH
      ? { stick: { radius: 0.1, color: "0xffffff" },
          sphere: { radius: 0.13, color: "0xffffff" } }
      : { hidden: true });
    // A agua so pode mostrar a ligacao se ELA tambem tiver bastao: o 3Dmol so
    // desenha o vinculo quando os dois atomos estao em estilo de bastao.
    v.setStyle({ resn: "HOH", elem: "O" }, comH
      ? { sphere: { radius: 0.26, color: "0x4da3e0" },
          stick: { radius: 0.1, color: "0x4da3e0" } }
      : { sphere: { radius: 0.36, color: "0x4da3e0" } });
    v.setStyle({ resn: "MG" }, { sphere: { radius: 0.55, color: "0x7fc9a0" } });
    v.setStyle({ resn: "MGX" }, { sphere: { radius: 0.95, color: "0x00b140" } });
    v.addStyle({ resn: "K" }, { sphere: { radius: 0.7, color: "0x9b59b6" } });
  }

  function abreFull() {
    if (!atual) return;
    $("#modalTitulo").textContent = DADOS.single_shell ? atual.shell1
                                                       : atual.label;
    const rep = atual.representative;
    $("#modalNMembros").textContent =
      `${atual.members.length} Mg²⁺ · the representative is highlighted`;
    $("#modalMembros").innerHTML = atual.members.map((m) => {
      const eRep = m.chain === rep.chain && m.resno === rep.resno;
      return `<span class="badge rounded-pill font-monospace" style="`
        + (eRep ? "background:#00b140" : "background:#8a9099")
        + `">${escapa(m.chain)}:${m.resno}</span>`;
    }).join("");
    bootstrap.Modal.getOrCreateInstance($("#modal3d")).show();
  }
  // O 3Dmol precisa do container ja visivel para medir o tamanho.
  $("#modal3d").addEventListener("shown.bs.modal",
    () => render3D(atual, "viewer3dFull"));
  $("#btnFull").addEventListener("click", abreFull);
  $("#chkH").addEventListener("change", () => {
    for (const v of Object.values(VIS)) {
      if (!v) continue;
      estilo(v);
      v.render();
    }
  });

  /* --------------------------------------------------------------- init */
  fetch(`${window.APP_BASE}api/${window.APP_MODO}`)
    .then((r) => r.json())
    .then((d) => {
      if (d.error) throw new Error(d.error);
      DADOS = d;
      d.signatures.forEach((s, i) => { s.num = i + 1; });
      montaAjuda();
      montaGrupos();
      desenhaNivel1();
    })
    .catch((e) => {
      $("#badges1").innerHTML = '<div class="alert alert-danger mb-0">'
        + escapa(e.message) + "</div>";
    });

  $("#busca").addEventListener("input", desenhaNivel1);
  addEventListener("resize", () => { if (atual) desenhaGrafo(atual); });
})();
