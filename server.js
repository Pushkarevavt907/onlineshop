const express = require('express');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prodd',
  password: '88888',
  port: 5432,
});


const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'ivan160720011@mail.ru', 
    pass: 'XZZzDqnpT3qjGJQgS0LV' 
  }
});

// Функция для отправки электронной почты
app.post('/send-email', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT prod_info.title2, prod_info.color, prod_info.size, prod_info.maxquantity, prod_info.id, products.name FROM prod_info INNER JOIN products ON prod_info.product_id = products.id');
    const data = rows;

    await sendEmail(data);
    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    res.sendStatus(500);
  }
});

// Функция для отправки электронной почты с данными из таблицы prod_info
async function sendEmail(data) {
  const mailOptions = {
    from: 'ivan160720011@mail.ru', // Отправитель
    to: 'ivan160720011@mail.ru', // Получатель
    subject: 'Данные из таблицы prod_info', // Тема письма
    text: `Данные из таблицы prod_info:\n${JSON.stringify(data, null, 2)}` // Текст письма с данными из таблицы
  };

  await transporter.sendMail(mailOptions);
}








app.get('/allorders', async (req, res) => {

  const query = `
    SELECT orders.id, orders.order_date, orders.total_price, orders.status,
      order_items.prod_id, order_items.quantity, order_items.price, order_items.image,
      prod_info.size, prod_info.title2, brands.brand
    FROM orders
    JOIN order_items ON orders.id = order_items.order_id
    JOIN prod_info ON order_items.prod_id = prod_info.id
    JOIN brands ON prod_info.brandid = brands.id
  `;

  try {
    const { rows } = await pool.query(query);
    const orders = {};

    for (const row of rows) {
      const orderId = row.id;

      if (!orders[orderId]) {
        orders[orderId] = {
          id: orderId,
          order_date: row.order_date,
          total_price: row.total_price,
          status: row.status, 
          items: []
        };
      }

      const item = {
        prod_id: row.prod_id,
        quantity: row.quantity,
        price: row.price,
        image: row.image,
        size: row.size,
        title2: row.title2,
        brand_info: row.brand
      };

      orders[orderId].items.push(item);
    }

    const ordersArray = Object.values(orders);
    res.json(ordersArray);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/orders', async (req, res) => {
  const { email } = req.query; 

  const query = `
    SELECT orders.id, orders.order_date, orders.total_price, orders.status,
      order_items.prod_id, order_items.quantity, order_items.price, order_items.image,
      prod_info.size, prod_info.title2, brands.brand, users.email
    FROM orders
    JOIN order_items ON orders.id = order_items.order_id
    JOIN prod_info ON order_items.prod_id = prod_info.id
    JOIN brands ON prod_info.brandid = brands.id
    JOIN users ON orders.id_user = users.id
    WHERE users.email = $1
  `;

  try {
    const { rows } = await pool.query(query, [email]);
    const orders = {};

    for (const row of rows) {
      const orderId = row.id;

      if (!orders[orderId]) {
        orders[orderId] = {
          id: orderId,
          order_date: row.order_date,
          total_price: row.total_price,
          status: row.status,
          email: row.email,
          items: []
        };
      }

      const item = {
        prod_id: row.prod_id,
        quantity: row.quantity,
        price: row.price,
        image: row.image,
        size: row.size,
        title2: row.title2,
        brand_info: row.brand
      };

      orders[orderId].items.push(item);
    }

    const ordersArray = Object.values(orders);
    res.json(ordersArray);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/order_items', async (req, res) => {
  const orderId = req.query.order_id;
  const query = `
    SELECT order_items.prod_id, prod_info.size, prod_info.title2, brands.brand AS brand_info
    FROM order_items
    JOIN prod_info ON order_items.prod_id = prod_info.id
    JOIN brands ON prod_info.brandid = brands.id
    WHERE order_items.order_id = $1
  `;
  const values = [orderId];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:id/prod_info', async (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT prod_info.size, prod_info.title2, brands.brand AS brand_info
    FROM prod_info
    JOIN brands ON prod_info.brandid = brands.id
    WHERE prod_info.id = $1
  `;
  const values = [productId];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/brands/:id', async (req, res) => {
  const brandId = req.params.id;
  const query = 'SELECT brand FROM brands WHERE id = $1';
  const values = [brandId];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching brand info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/base', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products');
  res.json(rows);
});

app.get('/basket1', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM basket ORDER BY id ASC');
  res.json(rows);
});
app.get('/basket', async(req, res) => {
  const email = req.query.email;
  pool.query(
    'SELECT * FROM basket WHERE id_user = (SELECT id FROM users WHERE email = $1)',[email],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
});


app.get('/category', async(req, res) => {
  const category = req.query.category;
  pool.query(
    'SELECT * FROM products WHERE catid = (SELECT id FROM categ WHERE categor = $1)',[category],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
});


app.post('/orders', async (req, res) => {
  const { email, total_price } = req.body;

  try {
    // Получаем ID пользователя на основе email
    const { rows: users } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    const id_user = users[0].id;

    const result = await pool.query('INSERT INTO orders (product_id, id_user, total_price, status) VALUES ($1, $2, $3, $4) RETURNING id', [1, id_user, total_price, 'Принят в обработку']);
    const orderId = result.rows[0].id;
    res.status(200).json({ id: orderId });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/order_items', async (req, res) => {
  const { order_id, prod_id, quantity, color, image, price } = req.body;

  try {
    await pool.query('INSERT INTO order_items (order_id, prod_id, quantity, color, image, price) VALUES ($1, $2, $3, $4, $5, $6)', [order_id, prod_id, quantity, color, image, price]);
    res.status(200).end();
  } catch (error) {
    console.error('Failed to add order item:', error);
    res.status(500).json({ error: 'Failed to add order item' });
  }
});


app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.get('/reg', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows);
});


app.post('/reg', async (req, res) => {
  const { name, email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length > 0) {
    return res.status(409).json({ message: 'Пользователь с таким логином уже зарегистрирован' });
  }
  await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
  res.status(201).end();
});

app.post('/users', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length === 0) {
    return res.status(401).json({ message: 'Ошибка' });
  }
  const user = rows[0];
  if (user.password !== password) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }
  const token = jwt.sign({ email }, 'secret_key');
  res.json({ token });
});

app.get('/bas', async (req, res) => {
  const email = req.query.email;
  const { rows } = await pool.query(`
    SELECT basket.*, prod_info.price1 
    FROM basket 
    JOIN users ON basket.id_user = users.id 
    JOIN prod_info ON basket.prod_id = prod_info.id 
    WHERE users.email = $1`,
    [email]
  );
  res.json(rows);
});


app.post('/reviews', async (req, res) => {
  try {
    const { product_id, email, rating, comment } = req.body;
    const query = `
      INSERT INTO reviews (product_id, user_name, rating, comment, created_at)
      SELECT $1, users.name, $3, $4, NOW()
      FROM users
      LEFT JOIN reviews ON reviews.product_id = $1
      WHERE users.email = $2 
    `;
    const values = [product_id, email, rating, comment];
    await pool.query(query, values);
    res.status(201).json({ message: 'Отзыв успешно добавлен' });
  } catch (error) {
    console.error('Произошла ошибка при добавлении отзыва:', error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});


app.get('/reviews', async (req, res) => {
  try {
    const product_id = req.query.product_id; // Получение product_id из запроса
    const query = 'SELECT * FROM reviews WHERE product_id = $1';
    const values = [product_id];
    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Произошла ошибка при получении отзывов:', error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
});

app.delete('/basket', async (req, res) => {
  const email = req.query.email;

  const { rows } = await pool.query(`
    DELETE FROM basket 
    WHERE id_user IN (
      SELECT id 
      FROM users 
      WHERE email = $1
    )`,
    [email]
  );

  res.json({ message: 'Товары успешно удалены из корзины' });
});



app.get('/products/:id/price1', async (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT prod_info.price1
    FROM basket
    JOIN prod_info ON basket.prod_id = prod_info.id
    WHERE basket.prod_id = $1
  `;
  const values = [productId];

  try {
    const result = await pool.query(query, values);
    const price = result.rows[0].price1;
    res.json(price);
  } catch (error) {
    console.error('Error fetching product price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/bas', async (req, res) => {
  const { id, color, img, quantity, login } = req.body;

  try {
    const userQuery = await pool.query('SELECT id FROM users WHERE email = $1', [login]);
    const userId = userQuery.rows[0].id;


    await pool.query('INSERT INTO basket (prod_id, quantity, id_user, color, image) VALUES ($1, $2, $3, $4, $5)', [id, quantity, userId, color, img]);

    res.status(200).end();
  } catch (error) {
    console.error('Failed to add product to basket:', error);
    res.status(500).json({ message: 'Failed to add product to basket' });
  }
});

app.delete('/bas/:idd', async (req, res) => {
  const idd = req.params.idd;

  try {
    await pool.query('DELETE FROM basket WHERE id = $1', [idd]);
    res.status(200).end();
  } catch (error) {
    console.error('Failed to delete item from basket:', error);
    res.status(500).json({ message: 'Failed to delete item from basket' });
  }
});


app.post('/orders/:orderId/cancel', async (req, res) => {
  const orderId = req.params.orderId;
  const query = 'UPDATE orders SET status = $1 WHERE id = $2';
  const values = ['Заказ в процессе отмены', orderId];

  try {
    await pool.query(query, values);
    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders/:orderId/poluch', async (req, res) => {
  const orderId = req.params.orderId;
  const query = 'UPDATE orders SET status = $1 WHERE id = $2';
  const values = [' Получен', orderId];

  try {
    await pool.query(query, values);
    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/orders/:orderId/dost', async (req, res) => {
  const orderId = req.params.orderId;
  const query = 'UPDATE orders SET status = $1 WHERE id = $2';
  const values = ['Доставлен в пункт выдачи', orderId];

  try {
    await pool.query(query, values);
    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders/:orderId/put', async (req, res) => {
  const orderId = req.params.orderId;
  const query = 'UPDATE orders SET status = $1 WHERE id = $2';
  const values = ['В пути', orderId];

  try {
    await pool.query(query, values);
    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.delete('/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const query = 'DELETE FROM orders WHERE id = $1';
  const values = [orderId];

  try {
    await pool.query(query, values);
    res.sendStatus(204); // Успешное удаление заказа
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/order_items', async (req, res) => {
  const orderId = req.query.order_id;
  const query = 'DELETE FROM order_items WHERE order_id = $1';
  const values = [orderId];

  try {
    await pool.query(query, values);
    res.sendStatus(204); // Успешное удаление элементов заказа
  } catch (error) {
    console.error('Error deleting order items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.listen(4030, () => {
  console.log('Server is running on port 4030');
});