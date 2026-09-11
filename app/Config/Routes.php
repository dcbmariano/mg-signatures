<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Signatures::index/atoms');
$routes->get('m/(:segment)', 'Signatures::index/$1');
// 'api/' e nao 'data/': public/data existe em disco e o servidor
// tenta servir o diretorio antes de chegar ao roteador.
$routes->get('about', 'Signatures::about');
$routes->get('about/(:segment)', 'Signatures::about/$1');
$routes->get('api/(:segment)', 'Signatures::data/$1');
