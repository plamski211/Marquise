-- Migration 002: Seed default categories, sizes, colors, and 12 products

-- Categories
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Dresses',     'dresses',     1),
  ('Tops',        'tops',        2),
  ('Bottoms',     'bottoms',     3),
  ('Outerwear',   'outerwear',   4),
  ('Accessories', 'accessories', 5);

-- Sizes
INSERT INTO sizes (name, sort_order) VALUES
  ('XS',       1),
  ('S',        2),
  ('M',        3),
  ('L',        4),
  ('XL',       5),
  ('XXL',      6),
  ('One Size', 7);

-- Colors (all unique colors from default products)
INSERT INTO colors (name) VALUES
  ('Noir'), ('Midnight'), ('Ivory'), ('Camel'), ('Navy'), ('Charcoal'),
  ('White'), ('Sand'), ('Cognac'), ('Gold'), ('Cream'), ('Blush'),
  ('Champagne'), ('Taupe'), ('Black'), ('Stone'), ('Tan');

-- Products
-- p1: Silk Noir Evening Gown
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Silk Noir Evening Gown',
  'silk-noir-evening-gown',
  289.00,
  (SELECT id FROM categories WHERE slug = 'dresses'),
  'An exquisite floor-length silk gown with a sculpted bodice and fluid draping. Crafted from pure mulberry silk with a subtle lustrous finish that catches light with every movement.',
  true, true,
  'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'silk-noir-evening-gown' AND s.name IN ('XS', 'S', 'M', 'L');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'silk-noir-evening-gown' AND c.name IN ('Noir', 'Midnight');

-- p2: Cashmere Cloud Overcoat
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Cashmere Cloud Overcoat',
  'cashmere-cloud-overcoat',
  445.00,
  (SELECT id FROM categories WHERE slug = 'outerwear'),
  'Sumptuous double-faced cashmere coat with clean, architectural lines. Features a concealed button placket and hand-stitched lapels. An investment piece for every season.',
  true, false,
  'linear-gradient(145deg, #F5F0EB 0%, #E8DFD4 40%, #DDD3C5 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'cashmere-cloud-overcoat' AND s.name IN ('S', 'M', 'L', 'XL');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'cashmere-cloud-overcoat' AND c.name IN ('Ivory', 'Camel');

-- p3: Tailored Wool Blazer
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Tailored Wool Blazer',
  'tailored-wool-blazer',
  320.00,
  (SELECT id FROM categories WHERE slug = 'outerwear'),
  'Impeccably structured blazer in Italian virgin wool. Slim silhouette with peak lapels, functional cuff buttons, and a single-breast closure. The cornerstone of modern elegance.',
  true, true,
  'linear-gradient(145deg, #1B2838 0%, #243447 40%, #1B2838 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'tailored-wool-blazer' AND s.name IN ('XS', 'S', 'M', 'L', 'XL');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'tailored-wool-blazer' AND c.name IN ('Navy', 'Charcoal');

-- p4: Linen Atelier Shirt
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Linen Atelier Shirt',
  'linen-atelier-shirt',
  178.00,
  (SELECT id FROM categories WHERE slug = 'tops'),
  'Relaxed-fit shirt in washed European linen. Mother-of-pearl buttons, French seams throughout, and a gently curved hem. Effortless refinement for warmer days.',
  false, false,
  'linear-gradient(145deg, #FAFAFA 0%, #F0EDEA 40%, #E8E4DF 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'linen-atelier-shirt' AND s.name IN ('XS', 'S', 'M', 'L');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'linen-atelier-shirt' AND c.name IN ('White', 'Sand');

-- p5: Artisan Leather Tote
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Artisan Leather Tote',
  'artisan-leather-tote',
  395.00,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Hand-crafted from vegetable-tanned Italian calfskin. Unlined interior with suede-finished pocket. Solid brass hardware with an antique patina. Each bag develops a unique character over time.',
  true, false,
  'linear-gradient(145deg, #8B6914 0%, #A67B2E 40%, #7A5C10 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'artisan-leather-tote' AND s.name = 'One Size';
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'artisan-leather-tote' AND c.name IN ('Cognac', 'Noir');

-- p6: Gilded Arc Earrings
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Gilded Arc Earrings',
  'gilded-arc-earrings',
  145.00,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '18K gold-plated sculptural earrings with a sweeping arc silhouette. Handmade by artisan jewellers using traditional lost-wax casting. Lightweight and effortlessly statement-making.',
  false, true,
  'linear-gradient(145deg, #C5A97C 0%, #D4BA8A 30%, #B8956A 70%, #C5A97C 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'gilded-arc-earrings' AND s.name = 'One Size';
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'gilded-arc-earrings' AND c.name = 'Gold';

-- p7: High-Waist Wool Trousers
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'High-Waist Wool Trousers',
  'high-waist-wool-trousers',
  225.00,
  (SELECT id FROM categories WHERE slug = 'bottoms'),
  'Clean-lined trousers in medium-weight Italian wool with a natural stretch. High-rise waist, pressed front crease, and a slightly tapered leg. Impeccable tailoring meets everyday comfort.',
  false, false,
  'linear-gradient(145deg, #3A3A3A 0%, #4A4A4A 40%, #363636 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'high-waist-wool-trousers' AND s.name IN ('XS', 'S', 'M', 'L', 'XL');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'high-waist-wool-trousers' AND c.name IN ('Charcoal', 'Cream');

-- p8: Draped Satin Blouse
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Draped Satin Blouse',
  'draped-satin-blouse',
  198.00,
  (SELECT id FROM categories WHERE slug = 'tops'),
  'Fluid satin blouse with an asymmetric draped neckline. The lustrous fabric cascades beautifully, creating a sculptural effect. A piece that transitions seamlessly from day to evening.',
  true, true,
  'linear-gradient(145deg, #E8D5D0 0%, #F0DDD6 40%, #E2CFC8 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'draped-satin-blouse' AND s.name IN ('XS', 'S', 'M', 'L');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'draped-satin-blouse' AND c.name IN ('Blush', 'Champagne');

-- p9: Merino Knit Dress
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Merino Knit Dress',
  'merino-knit-dress',
  265.00,
  (SELECT id FROM categories WHERE slug = 'dresses'),
  'Body-skimming midi dress in extra-fine merino wool. Ribbed texture with a subtle sheen, boat neckline, and bracelet-length sleeves. Refined simplicity at its finest.',
  false, false,
  'linear-gradient(145deg, #9C9489 0%, #ADA69D 40%, #8E8780 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'merino-knit-dress' AND s.name IN ('XS', 'S', 'M', 'L');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'merino-knit-dress' AND c.name IN ('Taupe', 'Black');

-- p10: Belted Trench Coat
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Belted Trench Coat',
  'belted-trench-coat',
  485.00,
  (SELECT id FROM categories WHERE slug = 'outerwear'),
  'A modern reinterpretation of the classic trench in water-resistant cotton gabardine. Storm shield, gun flaps, and a detachable belt with antiqued-brass buckle. Timeless authority.',
  true, true,
  'linear-gradient(145deg, #B5A999 0%, #C4B8AB 40%, #A99D91 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'belted-trench-coat' AND s.name IN ('S', 'M', 'L', 'XL');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'belted-trench-coat' AND c.name IN ('Stone', 'Black');

-- p11: Pleated Midi Skirt
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Pleated Midi Skirt',
  'pleated-midi-skirt',
  195.00,
  (SELECT id FROM categories WHERE slug = 'bottoms'),
  'Sunburst-pleated midi skirt in fluid crepe. The knife pleats hold their shape beautifully while allowing graceful movement. Side-zip closure with an elasticized back waist.',
  false, true,
  'linear-gradient(145deg, #D4CCC0 0%, #E0D8CD 40%, #C8C0B4 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'pleated-midi-skirt' AND s.name IN ('XS', 'S', 'M', 'L');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'pleated-midi-skirt' AND c.name IN ('Champagne', 'Noir');

-- p12: Woven Leather Belt
INSERT INTO products (name, slug, price, category_id, description, featured, is_new, gradient)
VALUES (
  'Woven Leather Belt',
  'woven-leather-belt',
  125.00,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Hand-woven leather belt in a herringbone pattern. Crafted from strips of butter-soft nappa leather with a polished gold-tone pin buckle. A finishing detail that elevates any ensemble.',
  false, false,
  'linear-gradient(145deg, #6B4226 0%, #7D5233 40%, #5E3A20 100%)'
);
INSERT INTO product_sizes (product_id, size_id)
  SELECT p.id, s.id FROM products p, sizes s
  WHERE p.slug = 'woven-leather-belt' AND s.name IN ('S', 'M', 'L');
INSERT INTO product_colors (product_id, color_id)
  SELECT p.id, c.id FROM products p, colors c
  WHERE p.slug = 'woven-leather-belt' AND c.name IN ('Tan', 'Black');
