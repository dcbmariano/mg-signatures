<?php

namespace App\Controllers;

/**
 * Assinaturas de coordenacao de Mg2+ no ribossomo 9Q87.
 *
 * Duas leituras do MESMO grafo de duas camadas:
 *   atoms     -- os nos sao classes de atomo do Cat_Wiz (Oph, Ow, Nb...)
 *   residues  -- os nos sao os residuos vizinhos (G, A, C, U, W, ASP...)
 *
 * Os dados sao estaticos (gerados pelo pipeline em Python) e ficam em
 * public/data/<modo>. Nao ha banco.
 */
class Signatures extends BaseController
{
    public const MODOS = [
        'atoms'    => ['titulo' => 'By atom class',
                       'sub'    => 'nodes are Cat_Wiz atom classes'],
        'shell1'   => ['titulo' => 'First shell only',
                       'sub'    => 'just the coordination sphere — '
                                 . 'no second-shell partners'],
        'residues' => ['titulo' => 'By nearby residue',
                       'sub'    => 'nodes are the neighbouring residues'],
        'parts'    => ['titulo' => 'By nucleotide part',
                       'sub'    => 'nucleotide + the moiety contacted: '
                                 . 'P phosphate, S sugar, B base'],
        'bases'    => ['titulo' => 'By base type',
                       'sub'    => 'purine (AG) / pyrimidine (UC) — fewer, '
                                 . 'broader clusters'],
    ];

    public function index(string $modo = 'atoms')
    {
        if (! isset(self::MODOS[$modo])) {
            return $this->response->setStatusCode(404)
                ->setBody('Unknown mode');
        }
        return view('signatures/index', [
            'modo'   => $modo,
            'modos'  => self::MODOS,
            'resumo' => $this->resumo($modo),
        ]);
    }

    /** Pagina explicativa. O idioma vive na URL: /about e /about/pt. */
    public function about(string $lang = 'en')
    {
        $lang = $lang === 'pt' ? 'pt' : 'en';
        $n = [];
        foreach (array_keys(self::MODOS) as $m) {
            $d = $this->carrega($m);
            $n[$m] = $d === null ? 0 : $d['n_signatures'];
        }
        return view('signatures/about', [
            'lang'   => $lang,
            'modos'  => self::MODOS,
            'modo'   => 'about',
            'n'      => $n,
            'resumo' => $this->resumo('atoms'),
        ]);
    }

    public function data(string $modo = 'atoms')
    {
        $d = $this->carrega($modo);
        if ($d === null) {
            return $this->response->setStatusCode(503)
                ->setJSON(['error' => "data for '{$modo}' not found — run the "
                                    . 'export step described in the README']);
        }
        return $this->response->setJSON($d);
    }

    /** Cabecalho: contagens sem esperar o JSON inteiro. */
    private function resumo(string $modo): array
    {
        $d = $this->carrega($modo);
        return $d === null
            ? ['structure' => '—', 'n_sites' => 0, 'n_signatures' => 0]
            : ['structure' => $d['structure'], 'n_sites' => $d['n_sites'],
               'n_signatures' => $d['n_signatures']];
    }

    private function carrega(string $modo): ?array
    {
        if (! isset(self::MODOS[$modo])) {
            return null;
        }
        $f = FCPATH . "data/{$modo}/signatures.json";
        if (! is_file($f)) {
            return null;
        }
        $j = json_decode(file_get_contents($f), true);
        return is_array($j) ? $j : null;
    }
}
