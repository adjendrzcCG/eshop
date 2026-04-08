-- V2__seed_data.sql
-- Seed data for ModelShop eShop

-- Create admin user (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, role, enabled)
VALUES ('admin@modelshop.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Admin@123
        'Admin', 'User', 'ROLE_ADMIN', TRUE);

-- Create test user (password: User@123)
INSERT INTO users (email, password, first_name, last_name, role, enabled)
VALUES ('john@example.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: User@123
        'John', 'Modeller', 'ROLE_USER', TRUE);

-- Root Categories
INSERT INTO categories (name, description, slug, active) VALUES
('Scale Models', 'Plastic and metal scale models for all skill levels', 'scale-models', TRUE),
('Paints & Painting Tools', 'Acrylic, enamel and lacquer paints plus brushes and airbrushes', 'paints-tools', TRUE),
('RC Cars & Parts', 'Radio-controlled cars, trucks, buggies and replacement parts', 'rc-cars-parts', TRUE),
('Tools & Accessories', 'Modelling tools, glues and accessories', 'tools-accessories', TRUE);

-- Subcategories for Scale Models
INSERT INTO categories (name, description, slug, parent_id, active) VALUES
('Military Vehicles', '1:35, 1:72 and 1:76 scale military tanks and vehicles', 'military-vehicles',
    (SELECT id FROM categories WHERE slug='scale-models'), TRUE),
('Aircraft', '1:48 and 1:72 scale aircraft kits', 'aircraft',
    (SELECT id FROM categories WHERE slug='scale-models'), TRUE),
('Ships', '1:350 and 1:700 scale warships and civilian vessels', 'ships',
    (SELECT id FROM categories WHERE slug='scale-models'), TRUE),
('Cars & Motorcycles', '1:24 and 1:12 scale car and motorcycle models', 'model-cars',
    (SELECT id FROM categories WHERE slug='scale-models'), TRUE);

-- Subcategories for Paints & Tools
INSERT INTO categories (name, description, slug, parent_id, active) VALUES
('Acrylic Paints', 'Water-based acrylic paints for models', 'acrylic-paints',
    (SELECT id FROM categories WHERE slug='paints-tools'), TRUE),
('Enamel Paints', 'Solvent-based enamel paints for models', 'enamel-paints',
    (SELECT id FROM categories WHERE slug='paints-tools'), TRUE),
('Airbrushes & Compressors', 'Airbrush kits, compressors and accessories', 'airbrushes',
    (SELECT id FROM categories WHERE slug='paints-tools'), TRUE),
('Brushes', 'Fine detail brushes and brush sets', 'brushes',
    (SELECT id FROM categories WHERE slug='paints-tools'), TRUE);

-- Subcategories for RC Cars
INSERT INTO categories (name, description, slug, parent_id, active) VALUES
('On-Road RC Cars', 'Electric and nitro on-road RC racing cars', 'on-road-rc',
    (SELECT id FROM categories WHERE slug='rc-cars-parts'), TRUE),
('Off-Road RC Buggies', 'Tough off-road RC buggies and monster trucks', 'off-road-rc',
    (SELECT id FROM categories WHERE slug='rc-cars-parts'), TRUE),
('RC Car Parts', 'Replacement parts, motors, batteries and electronics', 'rc-parts',
    (SELECT id FROM categories WHERE slug='rc-cars-parts'), TRUE);

-- Sample Products - Military Models
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, scale, featured, active)
VALUES
('Tiger I Early Production',
 'Detailed 1:35 scale model of the legendary WWII German Tiger I tank. Includes photo-etched details and full interior.',
 'TAM-35227', 49.99, 25,
 (SELECT id FROM categories WHERE slug='military-vehicles'),
 'Tamiya', '1:35', TRUE, TRUE),

('M1A2 Abrams',
 'Modern US main battle tank in 1:35 scale. Highly detailed with individual track links and crew figures.',
 'MNG-TS-003', 59.99, 18,
 (SELECT id FROM categories WHERE slug='military-vehicles'),
 'Meng Model', '1:35', TRUE, TRUE),

('Sd.Kfz. 251/1 Ausf.B',
 'Classic German WWII halftrack in 1:35 scale. Suitable for intermediate modellers.',
 'DRA-6228', 34.99, 30,
 (SELECT id FROM categories WHERE slug='military-vehicles'),
 'Dragon', '1:35', FALSE, TRUE);

-- Sample Products - Aircraft
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, scale, featured, active)
VALUES
('Spitfire Mk.IXc',
 'Iconic British WWII fighter in 1:48 scale. Weekend warrior kit with clear canopy and pilot figure.',
 'TAM-61032', 29.99, 40,
 (SELECT id FROM categories WHERE slug='aircraft'),
 'Tamiya', '1:48', TRUE, TRUE),

('F-14A Tomcat',
 'Legendary US Navy carrier-based fighter. Variable-sweep wings, detailed cockpit and weapons set.',
 'HAS-07267', 44.99, 22,
 (SELECT id FROM categories WHERE slug='aircraft'),
 'Hasegawa', '1:72', FALSE, TRUE);

-- Sample Products - Paints
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, featured, active)
VALUES
('Vallejo Model Color Set - WWII German',
 'Set of 8 acrylic paints in authentic WWII German colours. Includes Panzer Grey, Dunkelgelb and more.',
 'VAL-70123', 24.99, 50,
 (SELECT id FROM categories WHERE slug='acrylic-paints'),
 'Vallejo', TRUE, TRUE),

('Citadel Base Paints Set',
 'Foundation paint set of 11 Citadel Base paints. Perfect starting point for any miniature project.',
 'GW-60-12-99', 39.99, 35,
 (SELECT id FROM categories WHERE slug='acrylic-paints'),
 'Citadel', FALSE, TRUE),

('Tamiya Flat White (XF-2)',
 'High-quality flat white acrylic paint, 23ml pot. Ideal for base coats and snow effects.',
 'TAM-XF2', 3.99, 100,
 (SELECT id FROM categories WHERE slug='acrylic-paints'),
 'Tamiya', FALSE, TRUE),

('Humbrol Enamel 63 Sand Matt',
 'Classic enamel paint in sand/desert colour. 14ml tinlet. Perfect for desert camouflage schemes.',
 'HMB-AA0963', 2.99, 80,
 (SELECT id FROM categories WHERE slug='enamel-paints'),
 'Humbrol', FALSE, TRUE);

-- Sample Products - Airbrushes
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, featured, active)
VALUES
('Iwata Eclipse HP-CS Airbrush',
 'Professional dual-action gravity-feed airbrush. 0.35mm needle, 1/3oz cup. Industry standard for modellers.',
 'IWT-ECL-CS', 129.99, 12,
 (SELECT id FROM categories WHERE slug='airbrushes'),
 'Iwata', TRUE, TRUE),

('Badger Patriot 105 Airbrush',
 'Versatile dual-action airbrush for beginners to advanced modellers. Gravity and siphon capable.',
 'BDG-105', 79.99, 20,
 (SELECT id FROM categories WHERE slug='airbrushes'),
 'Badger', FALSE, TRUE);

-- Sample Products - RC Cars
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, scale, featured, active)
VALUES
('Tamiya TT-02 Chassis Kit',
 'Versatile 1:10 touring car chassis. Belt-driven 4WD, suitable for many body styles. Great for beginners.',
 'TAM-58613', 119.99, 15,
 (SELECT id FROM categories WHERE slug='on-road-rc'),
 'Tamiya', '1:10', TRUE, TRUE),

('HPI Sprint 2 Sport',
 '1:10 scale on-road RC car. RTR (Ready to Run) with 2.4GHz radio and waterproof electronics.',
 'HPI-117372', 199.99, 8,
 (SELECT id FROM categories WHERE slug='on-road-rc'),
 'HPI Racing', '1:10', FALSE, TRUE),

('Traxxas Rustler 4x4 VXL',
 'Brushless 1:10 stadium truck. VXL-3s ESC, Velineon motor. Waterproof electronics, top speed 65mph+.',
 'TRX-67076-4', 329.99, 10,
 (SELECT id FROM categories WHERE slug='off-road-rc'),
 'Traxxas', '1:10', TRUE, TRUE),

('Arrma Granite 4x4 Mega Monster Truck',
 '1:10 4WD monster truck. Ready-to-run with 2S LiPo compatible motor. Durable BLX design.',
 'ARA-102721T1', 249.99, 14,
 (SELECT id FROM categories WHERE slug='off-road-rc'),
 'Arrma', '1:10', FALSE, TRUE);

-- RC Parts
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, featured, active)
VALUES
('Hobbywing QuicRun 10BL120 Sensored ESC',
 '120A sensored brushless ESC for 1:10 RC cars. Smooth power delivery, programmable via card.',
 'HW-10BL120-S', 54.99, 25,
 (SELECT id FROM categories WHERE slug='rc-parts'),
 'Hobbywing', FALSE, TRUE),

('Traxxas 3S LiPo Battery 5000mAh',
 '11.1V 3S LiPo battery pack, 5000mAh 25C. Traxxas iD connector, high-current discharge.',
 'TRX-2872X', 69.99, 20,
 (SELECT id FROM categories WHERE slug='rc-parts'),
 'Traxxas', FALSE, TRUE);

-- Tools
INSERT INTO products (name, description, sku, price, stock_quantity, category_id, brand, featured, active)
VALUES
('Tamiya Master Tools Basic Set',
 'Essential modelling tool set: side cutters, tweezers, files, and panel line scribing tool.',
 'TAM-74016', 34.99, 30,
 (SELECT id FROM categories WHERE slug='tools-accessories'),
 'Tamiya', FALSE, TRUE),

('Gunze Mr. Cement Limonene',
 'Limonene-based plastic cement with citrus odour. Slower drying for careful assembly work.',
 'GNZ-B5510', 7.99, 60,
 (SELECT id FROM categories WHERE slug='tools-accessories'),
 'Mr. Hobby', FALSE, TRUE);
