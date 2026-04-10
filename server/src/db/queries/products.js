import pool from '../../config/db.js';

export async function listProducts({ category, featured, isNew, sort } = {}) {
  let where = [];
  let params = [];
  let idx = 1;

  if (category) {
    where.push(`c.slug = $${idx++}`);
    params.push(category);
  }
  if (featured !== undefined) {
    where.push(`p.featured = $${idx++}`);
    params.push(featured);
  }
  if (isNew !== undefined) {
    where.push(`p.is_new = $${idx++}`);
    params.push(isNew);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  let orderBy = 'p.sort_order ASC, p.created_at DESC';
  if (sort === 'price_asc') orderBy = 'p.price ASC';
  else if (sort === 'price_desc') orderBy = 'p.price DESC';
  else if (sort === 'name') orderBy = 'p.name ASC';

  const { rows } = await pool.query(`
    SELECT
      p.id, p.name, p.name_bg, p.slug, p.price, p.description, p.description_bg,
      p.featured, p.is_new AS "isNew", p.gradient,
      p.created_at, p.updated_at,
      c.name AS category, c.id AS category_id, c.slug AS category_slug,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name))
        FILTER (WHERE s.id IS NOT NULL), '[]'
      ) AS sizes,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', cl.id, 'name', cl.name))
        FILTER (WHERE cl.id IS NOT NULL), '[]'
      ) AS colors,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', pi.id, 'path', pi.path, 'sort_order', pi.sort_order)
        ) FILTER (WHERE pi.id IS NOT NULL), '[]'
      ) AS images,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', pp.id, 'name', pp.name, 'price', pp.price, 'sort_order', pp.sort_order)
        ) FILTER (WHERE pp.id IS NOT NULL), '[]'
      ) AS pieces
    FROM products p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    LEFT JOIN sizes s ON s.id = ps.size_id
    LEFT JOIN product_colors pc ON pc.product_id = p.id
    LEFT JOIN colors cl ON cl.id = pc.color_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_pieces pp ON pp.product_id = p.id
    ${whereClause}
    GROUP BY p.id, c.id
    ORDER BY ${orderBy}
  `, params);

  return rows.map(formatProduct);
}

export async function getProductByIdOrSlug(idOrSlug) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
  const field = isUuid ? 'p.id' : 'p.slug';

  const { rows } = await pool.query(`
    SELECT
      p.id, p.name, p.name_bg, p.slug, p.price, p.description, p.description_bg,
      p.featured, p.is_new AS "isNew", p.gradient,
      p.created_at, p.updated_at,
      c.name AS category, c.id AS category_id, c.slug AS category_slug,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'sort_order', s.sort_order))
        FILTER (WHERE s.id IS NOT NULL), '[]'
      ) AS sizes,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', cl.id, 'name', cl.name))
        FILTER (WHERE cl.id IS NOT NULL), '[]'
      ) AS colors,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', pi.id, 'path', pi.path, 'sort_order', pi.sort_order)
        ) FILTER (WHERE pi.id IS NOT NULL), '[]'
      ) AS images,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', pp.id, 'name', pp.name, 'price', pp.price, 'sort_order', pp.sort_order)
        ) FILTER (WHERE pp.id IS NOT NULL), '[]'
      ) AS pieces
    FROM products p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    LEFT JOIN sizes s ON s.id = ps.size_id
    LEFT JOIN product_colors pc ON pc.product_id = p.id
    LEFT JOIN colors cl ON cl.id = pc.color_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_pieces pp ON pp.product_id = p.id
    WHERE ${field} = $1
    GROUP BY p.id, c.id
  `, [idOrSlug]);

  return rows.length > 0 ? formatProduct(rows[0]) : null;
}

export async function createProduct(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const slug = slugify(data.name);

    const { rows } = await client.query(`
      INSERT INTO products (name, name_bg, slug, price, category_id, description, description_bg, featured, is_new, gradient)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      data.name, data.name_bg || null, slug, data.price, data.category_id,
      data.description || null, data.description_bg || null,
      data.featured || false,
      data.is_new ?? true,
      data.gradient || null,
    ]);

    const productId = rows[0].id;

    if (data.sizes?.length > 0) {
      const sizeValues = data.sizes.map((sid, i) => `($1, $${i + 2})`).join(', ');
      await client.query(
        `INSERT INTO product_sizes (product_id, size_id) VALUES ${sizeValues}`,
        [productId, ...data.sizes]
      );
    }

    if (data.colors?.length > 0) {
      const colorValues = data.colors.map((cid, i) => `($1, $${i + 2})`).join(', ');
      await client.query(
        `INSERT INTO product_colors (product_id, color_id) VALUES ${colorValues}`,
        [productId, ...data.colors]
      );
    }

    if (data.pieces?.length > 0) {
      for (let i = 0; i < data.pieces.length; i++) {
        const piece = data.pieces[i];
        await client.query(
          `INSERT INTO product_pieces (product_id, name, price, sort_order) VALUES ($1, $2, $3, $4)`,
          [productId, piece.name, piece.price, i]
        );
      }
    }

    await client.query('COMMIT');
    return productId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateProduct(id, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fields = [];
    const values = [];
    let idx = 1;

    for (const key of ['name', 'name_bg', 'price', 'category_id', 'description', 'description_bg', 'featured', 'is_new', 'gradient']) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(data[key]);
      }
    }

    if (data.name) {
      fields.push(`slug = $${idx++}`);
      values.push(slugify(data.name));
    }

    if (fields.length > 0) {
      values.push(id);
      await client.query(
        `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx}`,
        values
      );
    }

    if (data.sizes !== undefined) {
      await client.query('DELETE FROM product_sizes WHERE product_id = $1', [id]);
      if (data.sizes.length > 0) {
        const sizeValues = data.sizes.map((sid, i) => `($1, $${i + 2})`).join(', ');
        await client.query(
          `INSERT INTO product_sizes (product_id, size_id) VALUES ${sizeValues}`,
          [id, ...data.sizes]
        );
      }
    }

    if (data.colors !== undefined) {
      await client.query('DELETE FROM product_colors WHERE product_id = $1', [id]);
      if (data.colors.length > 0) {
        const colorValues = data.colors.map((cid, i) => `($1, $${i + 2})`).join(', ');
        await client.query(
          `INSERT INTO product_colors (product_id, color_id) VALUES ${colorValues}`,
          [id, ...data.colors]
        );
      }
    }

    if (data.pieces !== undefined) {
      await client.query('DELETE FROM product_pieces WHERE product_id = $1', [id]);
      for (let i = 0; i < data.pieces.length; i++) {
        const piece = data.pieces[i];
        await client.query(
          `INSERT INTO product_pieces (product_id, name, price, sort_order) VALUES ($1, $2, $3, $4)`,
          [id, piece.name, piece.price, i]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteProduct(id) {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return rowCount > 0;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatProduct(row) {
  return {
    id: row.id,
    name: row.name,
    name_bg: row.name_bg || null,
    slug: row.slug,
    price: parseFloat(row.price),
    category: row.category,
    category_id: row.category_id,
    category_slug: row.category_slug,
    description: row.description,
    description_bg: row.description_bg || null,
    featured: row.featured,
    isNew: row.isNew,
    gradient: row.gradient,
    sizes: row.sizes
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map(s => s.name),
    colors: row.colors.map(c => c.name),
    images: row.images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => img.path),
    pieces: (row.pieces || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(p => ({ id: p.id, name: p.name, price: parseFloat(p.price) })),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
