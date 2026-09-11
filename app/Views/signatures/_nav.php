<nav class="navbar navbar-expand-lg border-bottom bg-body-tertiary">
  <div class="container-fluid px-4">
    <div class="d-flex align-items-baseline gap-3 flex-wrap">
      <a class="navbar-brand mb-0 h1 text-decoration-none text-body"
         href="<?= base_url() ?>">Mg Signatures in ribosomes</a>
      <ul class="nav nav-pills nav-sm">
        <?php foreach ($modos as $k => $m): ?>
          <li class="nav-item">
            <a class="nav-link py-1 px-2 small<?= $k === $modo ? ' active' : '' ?>"
               href="<?= base_url('m/' . $k) ?>"
               title="<?= esc($m['sub']) ?>"><?= esc($m['titulo']) ?></a>
          </li>
        <?php endforeach; ?>
        <li class="nav-item">
          <a class="nav-link py-1 px-2 small<?= $modo === 'about' ? ' active' : '' ?>"
             href="<?= base_url('about') ?>">About</a>
        </li>
      </ul>
    </div>
    <span class="text-body-secondary small">
      <?= esc($resumo['structure']) ?> ·
      <?= esc($resumo['n_sites']) ?> Mg<sup>2+</sup> sites
    </span>
  </div>
</nav>
