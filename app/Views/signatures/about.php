<?php
$pt = $lang === 'pt';
$t = static fn(string $en, string $ptx): string => $GLOBALS['__pt'] ? $ptx : $en;
$GLOBALS['__pt'] = $pt;
?>
<!doctype html>
<html lang="<?= $pt ? 'pt-BR' : 'en' ?>" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= $t('About — Mg Signatures in ribosomes',
              'Sobre — Mg Signatures in ribosomes') ?></title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="<?= base_url('assets/css/app.css') ?>" rel="stylesheet">
<style>
  .doc { max-width: 62rem; }
  .doc h2 { font-size: 1.25rem; margin-top: 2rem; }
  .doc h3 { font-size: 1.02rem; margin-top: 1.4rem; font-weight: 600; }
  .doc p, .doc li { line-height: 1.6; }
  .doc code, .doc .sig { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .doc .sig { background: #f1f3f5; padding: .1rem .35rem; border-radius: .25rem; }
  .doc table { font-size: .9rem; }
  .swatch { display:inline-block; width:.8rem; height:.8rem; border-radius:.2rem;
            vertical-align:-1px; margin-right:.3rem; }
</style>
</head>
<body>

<?= view('signatures/_nav', ['modos' => $modos, 'modo' => $modo,
                             'resumo' => $resumo]) ?>

<div class="container-fluid px-4 py-4">
  <div class="doc">

    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
      <h1 class="h4 mb-0"><?= $t('About this site', 'Sobre este site') ?></h1>
      <div class="btn-group btn-group-sm" role="group"
           aria-label="<?= $t('Language', 'Idioma') ?>">
        <a class="btn btn-outline-secondary<?= $pt ? '' : ' active' ?>"
           href="<?= base_url('about') ?>">English</a>
        <a class="btn btn-outline-secondary<?= $pt ? ' active' : '' ?>"
           href="<?= base_url('about/pt') ?>">Português</a>
      </div>
    </div>

    <p class="text-body-secondary mt-2">
      <?= $t(
        'An interactive browser for the Mg<sup>2+</sup> coordination patterns of
         the <i>E. coli</i> 70S ribosome <b>9Q87</b>, solved at 1.55 Å. Every one
         of its 415 deposited Mg<sup>2+</sup> sites is reduced to a small graph,
         the graphs are grouped by a canonical signature, and the groups are
         explored here.',
        'Um navegador interativo dos padrões de coordenação de Mg<sup>2+</sup> do
         ribossomo 70S de <i>E. coli</i> <b>9Q87</b>, resolvido a 1,55 Å. Cada um
         dos seus 415 sítios de Mg<sup>2+</sup> depositados é reduzido a um
         pequeno grafo, os grafos são agrupados por uma assinatura canônica, e os
         grupos são explorados aqui.') ?>
    </p>

    <h2><?= $t('What a signature is', 'O que é uma assinatura') ?></h2>
    <p>
      <?= $t(
        'A magnesium ion in a ribosome is almost always <b>six-coordinate</b>: six
         ligands at about 2.07 Å, in a well-conserved octahedron. Most of those
         ligands are water molecules, and each water passes the interaction on to
         whatever it hydrogen-bonds to. So a site is naturally described by two
         shells.',
        'Um íon de magnésio num ribossomo é quase sempre <b>hexacoordenado</b>:
         seis ligantes a cerca de 2,07 Å, num octaedro bem conservado. A maior
         parte desses ligantes é água, e cada água repassa a interação para aquilo
         a que se liga por ponte de hidrogênio. Um sítio, portanto, se descreve
         naturalmente em duas camadas.') ?>
    </p>
    <ul>
      <li><b><?= $t('First shell', 'Primeira camada') ?></b> —
        <?= $t('every heavy atom within <b>2.6 Å</b> of the ion.',
               'todo átomo pesado a <b>2,6 Å</b> ou menos do íon.') ?></li>
      <li><b><?= $t('Second shell', 'Segunda camada') ?></b> —
        <?= $t('what the first-shell waters reach through a hydrogen bond, taken
                as O/N within <b>3.4 Å</b>.',
               'o que as águas da primeira camada alcançam por ponte de
                hidrogênio, tomada como O/N a até <b>3,4 Å</b>.') ?></li>
    </ul>
    <p>
      <?= $t('The signature writes the two shells with an arrow between them:',
             'A assinatura escreve as duas camadas com uma seta entre elas:') ?>
    </p>
    <p class="sig">5Ow+Oph  ⇒  Oph+Or</p>
    <p>
      <?= $t(
        'On the left, the coordination sphere with counts: five waters and one
         phosphate oxygen. On the right, the set of classes the waters reach.
         Two rules matter and are deliberate:',
        'À esquerda, a esfera de coordenação com contagem: cinco águas e um
         oxigênio de fosfato. À direita, o conjunto de classes que as águas
         alcançam. Duas regras importam e são deliberadas:') ?>
    </p>
    <ul>
      <li><?= $t(
        '<b>The second shell is a set, not a count.</b> A site reaching two
         phosphates and one reaching three fall in the same group. The count did
         not disappear — it became the <i>variation</i> shown in the table and
         encoded in how solid each edge is drawn.',
        '<b>A segunda camada é um conjunto, não uma contagem.</b> Um sítio que
         alcança dois fosfatos e outro que alcança três caem no mesmo grupo. A
         contagem não sumiu — virou a <i>variação</i> mostrada na tabela e
         codificada na intensidade de cada aresta.') ?></li>
      <li><?= $t(
        '<b>Water is not counted in the second shell.</b> How many solvent waters
         appear there depends on how many the depositor modelled, not on the
         chemistry of the site.',
        '<b>Água não conta na segunda camada.</b> Quantas águas de solvente
         aparecem ali depende de quantas o depositante modelou, não da química do
         sítio.') ?></li>
    </ul>

    <h2><?= $t('The five views', 'As cinco visões') ?></h2>
    <p>
      <?= $t('All five read the <b>same graph</b>; what changes is the vocabulary
              used to name a node, and therefore how coarse the grouping is.',
             'As cinco leem o <b>mesmo grafo</b>; o que muda é o vocabulário usado
              para nomear um nó, e portanto o quão grosso é o agrupamento.') ?>
    </p>
    <div class="table-responsive">
    <table class="table table-sm align-middle">
      <thead><tr>
        <th><?= $t('Page', 'Página') ?></th>
        <th><?= $t('A node is…', 'Um nó é…') ?></th>
        <th class="text-end"><?= $t('signatures', 'assinaturas') ?></th>
        <th><?= $t('Answers', 'Responde') ?></th>
      </tr></thead>
      <tbody>
        <tr><td><b>By atom class</b></td>
            <td><?= $t('a Cat_Wiz atom class', 'uma classe de átomo do Cat_Wiz') ?></td>
            <td class="text-end"><?= (int) $n['atoms'] ?></td>
            <td><?= $t('which chemical groups bind the ion',
                       'que grupos químicos ligam o íon') ?></td></tr>
        <tr><td><b>First shell only</b></td>
            <td><?= $t('the same, coordination sphere only',
                       'o mesmo, só a esfera de coordenação') ?></td>
            <td class="text-end"><?= (int) $n['shell1'] ?></td>
            <td><?= $t('what kind of site this is',
                       'que tipo de sítio é este') ?></td></tr>
        <tr><td><b>By nearby residue</b></td>
            <td><?= $t('the neighbouring residue', 'o resíduo vizinho') ?></td>
            <td class="text-end"><?= (int) $n['residues'] ?></td>
            <td><?= $t('which bases are involved', 'que bases estão envolvidas') ?></td></tr>
        <tr><td><b>By nucleotide part</b></td>
            <td><?= $t('residue + the moiety contacted',
                       'resíduo + a parte tocada') ?></td>
            <td class="text-end"><?= (int) $n['parts'] ?></td>
            <td><?= $t('phosphate, sugar or base?',
                       'fosfato, açúcar ou base?') ?></td></tr>
        <tr><td><b>By base type</b></td>
            <td><?= $t('purine or pyrimidine', 'purina ou pirimidina') ?></td>
            <td class="text-end"><?= (int) $n['bases'] ?></td>
            <td><?= $t('the broadest statistical picture',
                       'o quadro estatístico mais amplo') ?></td></tr>
      </tbody>
    </table>
    </div>
    <p class="small text-body-secondary">
      <?= $t('Finer vocabulary means more groups and fewer members each. <i>By
              base type</i> puts 95% of sites in a repeated pattern; <i>By
              nucleotide part</i> only 25%. Neither is more correct — they answer
              different questions.',
             'Vocabulário mais fino significa mais grupos e menos membros em cada.
              <i>By base type</i> põe 95% dos sítios num padrão repetido; <i>By
              nucleotide part</i> apenas 25%. Nenhuma é mais correta — respondem
              perguntas diferentes.') ?>
    </p>

    <h2><?= $t('Notation', 'Notação') ?></h2>
    <p class="small text-body-secondary">
      <?= $t('A number before a code is a count: <span class="sig">5Ow</span>
              means five waters.',
             'Um número antes do código é quantidade: <span class="sig">5Ow</span>
              são cinco águas.') ?>
    </p>

    <h3><?= $t('Atom classes (Cat_Wiz)', 'Classes de átomo (Cat_Wiz)') ?></h3>
    <div class="row row-cols-1 row-cols-md-2 g-1 small">
      <?php
      $cls = [
        ['#4da3e0', 'O<sub>w</sub>', 'water oxygen', 'oxigênio de água'],
        ['#c0392b', 'O<sub>ph</sub>', 'phosphate oxygen — OP1, OP2', 'oxigênio de fosfato — OP1, OP2'],
        ['#d08a1e', 'O<sub>r</sub>', "ribose oxygen — O2', O3', O4', O5'", "oxigênio de ribose — O2', O3', O4', O5'"],
        ['#8e44ad', 'O<sub>b</sub>', 'base oxygen — O2, O4, O6', 'oxigênio de base — O2, O4, O6'],
        ['#1f9e56', 'N<sub>b</sub>', 'base nitrogen — N1, N3, N7', 'nitrogênio de base — N1, N3, N7'],
        ['#5d6d7e', 'O<sub>bb</sub>', 'protein backbone carbonyl', 'carbonila do esqueleto proteico'],
        ['#b03a2e', 'O<sub>coo</sub>', 'carboxylate — Asp, Glu', 'carboxilato — Asp, Glu'],
        ['#af7ac5', 'O<sub>cno</sub>', 'amide — Asn, Gln', 'amida — Asn, Gln'],
        ['#d4ac0d', 'O<sub>coh</sub>', 'hydroxyl — Ser, Thr, Tyr', 'hidroxila — Ser, Thr, Tyr'],
        ['#148f77', 'N<sub>his</sub>', 'histidine nitrogen', 'nitrogênio de histidina'],
      ];
      foreach ($cls as [$c, $k, $en, $ptx]): ?>
        <div class="col"><span class="swatch" style="background:<?= $c ?>"></span>
          <code><?= $k ?></code> — <?= $t($en, $ptx) ?></div>
      <?php endforeach; ?>
    </div>

    <h3><?= $t('Residues and base types', 'Resíduos e tipos de base') ?></h3>
    <ul class="small mb-2">
      <li><code>A</code> <code>G</code> <code>C</code> <code>U</code> —
        <?= $t('nucleotides. Modified nucleotides fall back to the parent base
                (PSU → U, 2MG → G, OMC → C).',
               'nucleotídeos. Nucleotídeos modificados caem na base de origem
                (PSU → U, 2MG → G, OMC → C).') ?></li>
      <li><code>W</code> — <?= $t('water', 'água') ?></li>
      <li><code>AA</code> — <?= $t('amino acid (three-letter codes are used on the
                                    <i>By nearby residue</i> page)',
                                   'aminoácido (os códigos de três letras aparecem
                                    na página <i>By nearby residue</i>)') ?></li>
      <li><code>AG</code> — <?= $t('purine (adenine or guanine)',
                                   'purina (adenina ou guanina)') ?></li>
      <li><code>UC</code> — <?= $t('pyrimidine (cytosine or uracil)',
                                   'pirimidina (citosina ou uracila)') ?></li>
    </ul>

    <h3><?= $t('Nucleotide parts', 'Partes do nucleotídeo') ?></h3>
    <p class="small mb-1">
      <?= $t('On <i>By nucleotide part</i> the letter is the nucleotide and the
              suffix says where the contact happens. <span class="sig">G-B</span>
              is a contact with the base of a guanine.',
             'Em <i>By nucleotide part</i> a letra é o nucleotídeo e o sufixo diz
              onde o contato acontece. <span class="sig">G-B</span> é um contato
              com a base de uma guanina.') ?>
    </p>
    <ul class="small">
      <li><code>-P</code> — <?= $t('phosphate', 'fosfato') ?>: P, OP1, OP2, O5', O3'</li>
      <li><code>-S</code> — <?= $t('sugar (pentose)', 'açúcar (pentose)') ?>: C1'–C5', O2', O4'</li>
      <li><code>-B</code> — <?= $t('base — everything else',
                                   'base — todo o resto') ?></li>
    </ul>

    <h2><?= $t('Reading the graph', 'Lendo o grafo') ?></h2>
    <p>
      <?= $t('The graph shows <b>one real site</b> of the group — a
              representative, not an average. The Mg<sup>2+</sup> sits at the
              centre in green, the six first-shell ligands on the inner ring, and
              their second-shell partners on the outer one.',
             'O grafo mostra <b>um sítio real</b> do grupo — um representante, não
              uma média. O Mg<sup>2+</sup> fica no centro em verde, os seis
              ligantes da primeira camada no anel interno, e os parceiros de
              segunda camada no externo.') ?>
    </p>
    <ul>
      <li><b><?= $t('Dashed lines', 'Linhas tracejadas') ?></b> —
        <?= $t('every edge is an interaction: coordination from the ion, hydrogen
                bond from a water.',
               'toda aresta é uma interação: coordenação a partir do íon, ponte de
                hidrogênio a partir de uma água.') ?></li>
      <li><b><?= $t('Edge darkness and thickness', 'Intensidade e espessura da aresta') ?></b> —
        <?= $t('how common that contact is <i>in the group</i>. A solid, thick
                edge occurs in every member; a pale, thin one is rare. This is
                where the count dropped from the signature comes back.',
               'quão comum aquele contato é <i>no grupo</i>. Aresta sólida e grossa
                ocorre em todos os membros; pálida e fina é rara. É aqui que a
                contagem retirada da assinatura reaparece.') ?></li>
      <li><b><?= $t('The ring around a node', 'O anel em volta do nó') ?></b> —
        <?= $t('a donut with the composition of that node <i>across every site in
                the group</i>, in the vocabulary of the other reading: on the atom
                pages the ring is A/U/G/C, on the residue pages it is the atom
                classes. Water nodes have no ring.',
               'um donut com a composição daquele nó <i>em todos os sítios do
                grupo</i>, no vocabulário da outra leitura: nas páginas de átomo o
                anel é A/U/G/C, nas de resíduo são as classes de átomo. Nós de
                água não têm anel.') ?></li>
    </ul>

    <h3><?= $t('What hovering shows', 'O que o mouse mostra') ?></h3>
    <p><b><?= $t('On a node', 'Sobre um nó') ?></b> —
      <?= $t('the class and what it means, which residue it is <i>in the site on
              screen</i>, and the composition across the group with percentages
              and raw counts. On the Mg<sup>2+</sup>, the signature number and the
              group size.',
             'a classe e o que ela significa, qual resíduo é <i>no sítio em
              tela</i>, e a composição no grupo com percentuais e contagens brutas.
              No Mg<sup>2+</sup>, o número da assinatura e o tamanho do grupo.') ?>
    </p>
    <p><b><?= $t('On an edge', 'Sobre uma aresta') ?></b> —
      <?= $t('the distance of that contact type over the whole group: mean and
              range, plus how many sites have it. A second or third contact of the
              same class does not exist in every member, and the tooltip says in
              how many — <span class="sig">present in 10/22 sites (45%)</span>.',
             'a distância daquele tipo de contato em todo o grupo: média e faixa,
              mais em quantos sítios ele existe. Um segundo ou terceiro contato da
              mesma classe não existe em todos os membros, e o tooltip diz em
              quantos — <span class="sig">present in 10/22 sites (45%)</span>.') ?>
    </p>
    <p class="small text-body-secondary">
      <?= $t('If an edge reports a range of exactly 2.07–2.07 Å, those waters were
              <b>placed by the software</b>, not measured — the hydration routine
              puts them at the ideal Mg–O distance. Distances from the deposited
              model do vary.',
             'Se uma aresta reporta faixa de exatamente 2,07–2,07 Å, aquelas águas
              foram <b>colocadas pelo programa</b>, não medidas — a rotina de
              hidratação as põe na distância ideal Mg–O. As distâncias vindas do
              modelo depositado variam.') ?>
    </p>

    <h2><?= $t('The 3D panel', 'O painel 3D') ?></h2>
    <p>
      <?= $t('The right-hand panel shows the same representative site in 3D
              (3Dmol.js), cut down to the residues that take part. Dashed yellow
              lines carry the measured distance at their midpoint. The
              <i>Fullscreen</i> button opens a larger view that also lists every
              Mg<sup>2+</sup> of the cluster, with the representative highlighted.',
             'O painel da direita mostra o mesmo sítio representante em 3D
              (3Dmol.js), recortado aos resíduos que participam. As linhas amarelas
              tracejadas trazem a distância medida no ponto médio. O botão
              <i>Fullscreen</i> abre uma visão maior que também lista todos os
              Mg<sup>2+</sup> do cluster, com o representante destacado.') ?>
    </p>
    <p>
      <?= $t('The <b>Hydrogens</b> switch adds hydrogens. They are <b>not in the
              deposit</b> — at 1.55 Å they are not resolved. They were computed
              with ChimeraX <code>addh</code>, and the hydrogens of the
              Mg-coordinating waters were then reoriented by geometry, because
              <code>addh</code> optimises hydrogen bonds and left a third of them
              pointing at the cation, which is impossible. Treat them as
              illustrative, not as measurements.',
             'O interruptor <b>Hydrogens</b> acrescenta hidrogênios. Eles <b>não
              estão no depósito</b> — a 1,55 Å não são resolvidos. Foram calculados
              com o <code>addh</code> do ChimeraX, e os hidrogênios das águas
              coordenadas ao Mg foram depois reorientados por geometria, porque o
              <code>addh</code> otimiza pontes de hidrogênio e deixava um terço
              deles apontando para o cátion, o que é impossível. Trate-os como
              ilustração, não como medida.') ?>
    </p>

    <h2><?= $t('Limits worth knowing', 'Limites que vale conhecer') ?></h2>
    <ul>
      <li><?= $t('Hydrogen bonds are assigned by <b>heavy-atom distance only</b>
                  (O/N within 3.4 Å). There is no angular criterion.',
                 'Pontes de hidrogênio são atribuídas <b>só por distância entre
                  átomos pesados</b> (O/N a até 3,4 Å). Não há critério angular.') ?></li>
      <li><?= $t('Grouping is by <b>exact signature equality</b>. Two sites one
                  ligand apart end up in different groups; a similarity measure
                  would merge much of the long tail.',
                 'O agrupamento é por <b>igualdade exata de assinatura</b>. Dois
                  sítios separados por um ligante caem em grupos diferentes; uma
                  medida de similaridade fundiria boa parte da cauda longa.') ?></li>
      <li><?= $t('Everything here comes from <b>one structure</b>. The patterns
                  have not been checked for reproducibility in other ribosomes.',
                 'Tudo aqui vem de <b>uma única estrutura</b>. Os padrões não foram
                  checados quanto à reprodutibilidade em outros ribossomos.') ?></li>
    </ul>

    <p class="text-body-secondary small mt-4">
      <?= $t('Built with CodeIgniter 4, Bootstrap 5, D3 v7 and 3Dmol.js. The data
              are static files produced by a Python pipeline; there is no database.',
             'Construído com CodeIgniter 4, Bootstrap 5, D3 v7 e 3Dmol.js. Os dados
              são arquivos estáticos produzidos por um pipeline em Python; não há
              banco de dados.') ?>
    </p>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
