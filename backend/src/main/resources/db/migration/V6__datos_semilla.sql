-- ============================================================================
-- V6  Datos semilla: usuario administrador + carta inicial del Chifa Wok
-- ============================================================================

-- admin@chifawok.pe  /  admin123     (hash BCrypt, coste 10)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
    ('Administrador Chifa Wok', 'admin@chifawok.pe',
     '$2a$10$t1zay8CKHN96gVVWGI5zGeJDe3uZaMqjDfg0tBLDNph2X30oFsQBC', 'ADMIN'),
    ('Operador Salon', 'operador@chifawok.pe',
     '$2a$10$t1zay8CKHN96gVVWGI5zGeJDe3uZaMqjDfg0tBLDNph2X30oFsQBC', 'OPERADOR');

INSERT INTO categorias (nombre, descripcion, icono, orden) VALUES
    ('Chaufas',    'Arroz frito al wok en distintas combinaciones', 'rice_bowl', 1),
    ('Tallarines', 'Tallarines saltados estilo chifa',              'ramen_dining', 2),
    ('Combinados', 'Aeropuertos y combos para compartir',           'restaurant', 3),
    ('Sopas',      'Sopa wantan, wantan frito y entradas',          'soup_kitchen', 4),
    ('Bebidas',    'Gaseosas, chicha y te',                         'local_bar', 5);

INSERT INTO platos (categoria_id, codigo, nombre, descripcion, precio, destacado, imagen_url, tiempo_preparacion_min) VALUES
    ((SELECT id FROM categorias WHERE nombre='Chaufas'),    'CHF-001', 'Arroz Chaufa Especial',
        'Arroz frito al wok con chancho asado, pollo, langostinos y cebollita china.', 32.00, TRUE, NULL, 15),
    ((SELECT id FROM categorias WHERE nombre='Chaufas'),    'CHF-002', 'Chaufa de Pollo',
        'Arroz frito al wok con trozos de pollo y verduras.', 22.00, FALSE, NULL, 12),
    ((SELECT id FROM categorias WHERE nombre='Tallarines'), 'TLL-001', 'Tallarin Saltado de Pollo',
        'Tallarines salteados con pollo, verduras y sillao.', 24.00, FALSE, NULL, 14),
    ((SELECT id FROM categorias WHERE nombre='Combinados'), 'CMB-001', 'Aeropuerto Familiar',
        'Arroz frito, fideos crujientes, carnes mixtas y glaseado de soja. Para compartir.', 55.00, TRUE, NULL, 20),
    ((SELECT id FROM categorias WHERE nombre='Combinados'), 'CMB-002', 'Pollo Tipa Kay',
        'Pechuga de pollo dorada crujiente en salsa agridulce de tamarindo.', 35.00, TRUE, NULL, 16),
    ((SELECT id FROM categorias WHERE nombre='Sopas'),      'SOP-001', 'Sopa Wantan',
        'Caldo de la casa con wantanes rellenos, verduras y trozos de pollo.', 18.00, FALSE, NULL, 10),
    ((SELECT id FROM categorias WHERE nombre='Sopas'),      'SOP-002', 'Wantan Frito (12 u.)',
        'Wantanes fritos crocantes con salsa tamarindo.', 15.00, FALSE, NULL, 8),
    ((SELECT id FROM categorias WHERE nombre='Bebidas'),    'BEB-001', 'Inka Kola 1.5 L',
        'Gaseosa Inka Kola de litro y medio.', 9.00, FALSE, NULL, 1),
    ((SELECT id FROM categorias WHERE nombre='Bebidas'),    'BEB-002', 'Chicha Morada Jarra 1 L',
        'Chicha morada de la casa, jarra de 1 litro.', 12.00, FALSE, NULL, 2);

-- Presentaciones para el chaufa especial y el tallarin
INSERT INTO plato_presentaciones (plato_id, nombre, precio, predeterminada) VALUES
    ((SELECT id FROM platos WHERE codigo='CHF-001'), 'Personal',  32.00, TRUE),
    ((SELECT id FROM platos WHERE codigo='CHF-001'), 'Mediano',   48.00, FALSE),
    ((SELECT id FROM platos WHERE codigo='CHF-001'), 'Familiar',  62.00, FALSE),
    ((SELECT id FROM platos WHERE codigo='TLL-001'), 'Personal',  24.00, TRUE),
    ((SELECT id FROM platos WHERE codigo='TLL-001'), 'Familiar',  46.00, FALSE);

-- Grupo de opciones de ejemplo
INSERT INTO grupos_opcion (nombre, seleccion_min, seleccion_max) VALUES
    ('Nivel de aji', 0, 1),
    ('Agregados',    0, 3);
INSERT INTO opciones (grupo_id, nombre, precio_extra) VALUES
    ((SELECT id FROM grupos_opcion WHERE nombre='Nivel de aji'), 'Sin aji',        0),
    ((SELECT id FROM grupos_opcion WHERE nombre='Nivel de aji'), 'Aji suave',      0),
    ((SELECT id FROM grupos_opcion WHERE nombre='Nivel de aji'), 'Bien picante',   0),
    ((SELECT id FROM grupos_opcion WHERE nombre='Agregados'),    'Extra chancho',  8),
    ((SELECT id FROM grupos_opcion WHERE nombre='Agregados'),    'Huevo frito',    3),
    ((SELECT id FROM grupos_opcion WHERE nombre='Agregados'),    'Porcion de tamarindo', 2);

INSERT INTO plato_grupo_opcion (plato_id, grupo_id)
SELECT p.id, g.id FROM platos p, grupos_opcion g
WHERE p.codigo IN ('CHF-001','TLL-001','CMB-001');

-- Inventario minimo
INSERT INTO insumos (nombre, unidad, stock_actual, stock_minimo) VALUES
    ('Arroz cocido',      'kg', 40.000, 10.000),
    ('Chancho asado',     'kg', 12.000, 4.000),
    ('Pollo',             'kg', 20.000, 6.000),
    ('Langostinos',       'kg',  5.000, 2.000),
    ('Cebollita china',   'kg',  3.000, 1.000),
    ('Inka Kola 1.5 L',   'unidad', 48.000, 12.000);
