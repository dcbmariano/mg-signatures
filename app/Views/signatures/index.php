<!doctype html>
<html lang="en" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mg Signatures in ribosomes</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="<?= base_url('assets/css/app.css') ?>" rel="stylesheet">
</head>
<body>

<?= view('signatures/_nav', ['modos' => $modos, 'modo' => $modo, 'resumo' => $resumo]) ?>

<div class="container-fluid px-4 py-3">

  <div class="row g-3">
    <div class="col-12">
      <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
        <span class="small fw-semibold">First shell</span>
        <button type="button" class="btn btn-sm btn-link p-0 lh-1 border-0
                text-body-secondary" id="ajudaModo" data-bs-toggle="popover"
                data-bs-html="true" data-bs-trigger="hover focus"
                data-bs-placement="bottom" title="Notation"
                aria-label="What the codes mean">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"
               aria-hidden="true"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0
               1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M5.3 6.2c.1-1.3 1.2-2.2
               2.8-2.2 1.6 0 2.7.9 2.7 2.1 0 .9-.5 1.5-1.3 2-.8.5-1 .8-1
               1.4v.4H7.2v-.5c0-.9.4-1.5 1.3-2 .7-.5 1-.8 1-1.3
               0-.6-.5-1-1.3-1-.8 0-1.3.4-1.4 1.1H5.3zm2.4 6.3a.9.9 0 1 1
               0-1.8.9.9 0 0 1 0 1.8z"/></svg>
        </button>
        <span class="small text-body-secondary" id="resumoN1"></span>
        <input type="search" class="form-control form-control-sm ms-auto"
               id="busca" placeholder="filter (e.g. Nb, 6Ow)"
               style="max-width:230px">
      </div>
      <div id="badges1" class="d-flex flex-wrap gap-2"></div>

      <div id="nivel2" hidden>
        <hr class="my-2">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
          <span class="small fw-semibold">Second shell</span>
          <span class="small text-body-secondary" id="rotuloN1"></span>
        </div>
        <div id="badges2" class="d-flex flex-wrap gap-2"></div>
      </div>
    </div>
  </div>

  <hr class="my-3">

  <div class="row g-3">
    <div class="col-xl-7">
      <div class="card h-100">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span id="tituloGrafo" class="fw-semibold text-body-secondary">Pick a first-shell profile above</span>
          <span class="text-body-secondary small d-none d-xxl-inline">
            darker edge = more contacts of that class · ring around a node = composition across the group
          </span>
        </div>
        <div class="card-body p-0">
          <svg id="grafo" role="img" aria-label="coordination graph"></svg>
        </div>
      </div>
    </div>

    <div class="col-xl-5">
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="fw-semibold">Representative site</span>
          <div class="d-flex align-items-center gap-3">
            <div class="form-check form-switch mb-0" id="caixaH" hidden>
              <input class="form-check-input" type="checkbox" id="chkH">
              <label class="form-check-label small" for="chkH"
                     title="Hydrogens are not in the deposit — they were placed
by ChimeraX addh, which orients them using the surrounding hydrogen bonds.">
                Hydrogens
              </label>
            </div>
          <button type="button" class="btn btn-sm btn-outline-secondary"
                  id="btnFull" title="Open in a larger window">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"
                 aria-hidden="true"><path d="M1 1h6v2H3v4H1V1zm14 0v6h-2V3H9V1h6zM1
                 9h2v4h4v2H1V9zm14 0v6H9v-2h4V9h2z"/></svg>
            Fullscreen
          </button>
          </div>
        </div>
        <div class="card-body p-2">
          <div id="viewer3d"></div>
          <p class="small text-body-secondary mt-2 mb-0" id="repSub"></p>
        </div>
      </div>
      <div class="card">
        <div class="card-header fw-semibold">Ligands per shell</div>
        <div class="card-body" id="painelComp">
          <p class="text-body-secondary small mb-0">
            Counts of each atom class in the first and second shell.
          </p>
        </div>
      </div>
    </div>
  </div>

<div class="modal fade" id="modal3d" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalTitulo">Representative site</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="small text-body-secondary" id="modalSub"></p>
        <div id="viewer3dFull"></div>
        <div class="mt-3">
          <div class="d-flex justify-content-between align-items-baseline">
            <span class="fw-semibold small">Sites in this cluster</span>
            <span class="small text-body-secondary" id="modalNMembros"></span>
          </div>
          <div class="d-flex flex-wrap gap-1 mt-2" id="modalMembros"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="tip" class="tip" role="tooltip" hidden></div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/3dmol@2.4.0/build/3Dmol-min.js"></script>
<?php // so o caminho, sem host: evita CORS quando o baseURL nao bate
      // com a porta em que o servidor foi realmente iniciado.
$basePath = rtrim(parse_url(base_url(), PHP_URL_PATH) ?? '', '/') . '/'; ?>
<script>
window.APP_BASE = <?= json_encode($basePath) ?>;
window.APP_MODO = <?= json_encode($modo) ?>;
</script>
<script src="<?= base_url('assets/js/app.js') ?>"></script>
</body>
</html>
