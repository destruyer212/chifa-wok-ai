-- ============================================================================
-- V7  Actualizar URLs de imágenes de los platos hacia los recursos locales
-- ============================================================================

UPDATE platos SET imagen_url = '/assets/images/platos/chaufa-especial.jpg' WHERE codigo = 'CHF-001';
UPDATE platos SET imagen_url = '/assets/images/platos/chaufa-pollo.jpg' WHERE codigo = 'CHF-002';
UPDATE platos SET imagen_url = '/assets/images/platos/tallarin-saltado.jpg' WHERE codigo = 'TLL-001';
UPDATE platos SET imagen_url = '/assets/images/platos/aeropuerto.jpg' WHERE codigo = 'CMB-001';
UPDATE platos SET imagen_url = '/assets/images/platos/pollo-tipakay.jpg' WHERE codigo = 'CMB-002';
UPDATE platos SET imagen_url = '/assets/images/platos/sopa-wantan.jpg' WHERE codigo = 'SOP-001';
UPDATE platos SET imagen_url = '/assets/images/platos/wantan-frito.jpg' WHERE codigo = 'SOP-002';
UPDATE platos SET imagen_url = '/assets/images/platos/inka-kola.jpg' WHERE codigo = 'BEB-001';
UPDATE platos SET imagen_url = '/assets/images/platos/chicha-morada.jpg' WHERE codigo = 'BEB-002';
