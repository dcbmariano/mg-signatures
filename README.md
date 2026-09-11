# Mg Signatures in ribosomes

Interactive browser for the Mg²⁺ coordination signatures of the *E. coli* 70S
ribosome **9Q87** (1.55 Å). Each of the 415 deposited Mg²⁺ sites is reduced to a
two-shell graph, the graphs are grouped by a canonical signature, and the groups
are explored here.

CodeIgniter 4 · Bootstrap 5 · D3 v7 · 3Dmol.js 2.4

## What a signature is

    5Ow+Oph  ⇒  Oph+Or
    └ first shell ┘  └ second shell ┘

**First shell** — the six ligands within 2.6 Å of the ion, labelled by Cat_Wiz
class: `Ow` water, `Oph` phosphate oxygen, `Or` ribose oxygen, `Ob` base oxygen,
`Nb` base nitrogen, `Ocoo`/`Ocno`/`Ocoh`/`Obb` protein groups.

**Second shell** — the set of classes reached by the first-shell waters through
a hydrogen bond (O/N within 3.4 Å). It is a *set*, not a multiset: which
particular water reaches which partner varies from site to site and, if kept,
makes every one of the 415 sites unique. Water–water contacts are drawn but do
not enter the signature, for the same reason.

Result: **136 signatures over 415 sites**; 55 of them occur more than once and
cover 80 % of all sites.

## Using it

- **Badges** list every signature with its group size. The slider filters by
  minimum size; the search box filters by text (`Nb`, `6Ow`, …).
- **Graph** shows one real site of the group — solid edges are Mg–ligand bonds,
  dashed edges are hydrogen bonds. The ring around each RNA/protein node is the
  A/U/G/C (or amino-acid) composition of that atom class **across the whole
  group**, not the site on screen.
- **Hover** an RNA or protein node for the per-residue percentages.
- **Click the Mg** for the 3D view of the representative site (3Dmol), with the
  coordination bonds drawn and the group size stated.

## Layout

    app/Controllers/Signatures.php   serves the page and the JSON
    app/Views/signatures/index.php   markup
    public/assets/js/app.js          badges, D3 graph, 3Dmol modal
    public/assets/css/app.css
    public/data/signatures.json      the dataset (~480 KB)
    public/data/frag/sigNNN.pdb      9 Å cut-out around each representative

## Running

    cp env .env                    # set CI_ENVIRONMENT = development
    php spark serve --port 8081    # any port works

There is no database — the data files are static.

`app.baseURL` is left **commented out** in `.env` on purpose: `Config\App`
derives it from the request host in development, so the app works on whatever
port you pass to `spark serve`. With a hard-coded `http://localhost:8080/`,
serving on another port makes `base_url()` emit 8080 while the page lives on
8081 — every `fetch()` becomes cross-origin and the browser blocks it with
`No 'Access-Control-Allow-Origin' header`. In production set the value
explicitly; `HTTP_HOST` comes from the client and is not to be trusted there.

Note that `pkill -f "spark serve"` kills only the wrapper — the `php -S` child
survives and keeps serving stale code. Use `pkill -f "php -S"` as well.

## Regenerating the data

`public/data` is produced by the Python pipeline in the sibling projects
(`kurwenal` for the Cat_Wiz classifier, `mg_k_predict` for the structures).
The exporter reads `9Q87.cif`, builds the graphs and writes both the JSON and
the PDB fragments. Two details that cost time and are easy to get wrong:

- Fragments must be written with **gemmi**, not by hand-formatting PDB columns.
  The residue name lives in columns 18–20; an off-by-one puts `MGX` where 3Dmol
  reads `GX`, the selection silently matches nothing and the viewer shows an
  empty frame with no error.
- `zoomTo()` on a single-atom selection frames a zero-extent box. Follow it with
  `zoom(< 1)` to pull back, or nothing is visible.

## Caveats

Hydrogen bonds are assigned by heavy-atom distance only — no angular criterion.
Grouping is by exact signature equality, so `⇒ Oph` and `⇒ Oph+Or` are separate
groups even though they are one ligand apart; a similarity measure would merge
much of the 81-signature tail.
