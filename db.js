const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'prodd',
    password: '88888',
    port: 5432,
});

function getDataFromDatabase(callback) {
  const query = `
    SELECT products.id, products.price, products.title, products.name, brands.brand, categ.categor, products.image, products.quantity,
           prod_info.id AS prod_info_id,
           prod_info.title2, prod_info.img, prod_info.color, prod_info.size, prod_info.price1,
           brands.brand AS brandid, categ.categor AS catid, prod_info.maxquantity
    FROM products
    LEFT JOIN prod_info ON products.id = prod_info.product_id
    LEFT JOIN brands ON products.brandid = brands.id
    LEFT JOIN categ ON products.catid = categ.id
  `;

  pool.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
      callback(err);
    } else {
      const products = {};
      
      res.rows.forEach(row => {
        const productId = row.id;
        const product = products[productId] || {
          id: productId,
          price: row.price,
          title: row.title,
          name: row.name,
          catid: row.catid,
          brandid: row.brandid,
          image: row.image,
          quantity: row.quantity,
          prodInfo: []
        };
        
        if (row.prod_info_id && row.price1) {
          const prodInfo = {
            id: row.prod_info_id,
            title2: row.title2,
            img: row.img,
            price1: row.price1,
            color: row.color,
            size: row.size,
            brandid: row.brandid,
            maxquantity: row.maxquantity
          };
          
          product.prodInfo.push(prodInfo);
        }
        
        products[productId] = product;
      });
      
      const data = {
        products: Object.values(products),
        basket: [], // добавляем пустой массив basket
      };
      
      fs.writeFile('db.json', JSON.stringify(data, null, 2).replace(/}\n/g, '}\n\n'), (error) => {
        if (error) {
          console.error(error);
          callback(error);
        } else {
          callback(null, data);
        }
      });
    }

    pool.end();
  });
}

module.exports = { getDataFromDatabase };