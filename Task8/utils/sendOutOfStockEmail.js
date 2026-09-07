const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOutOfStockEmail = async (products) => {
  const rows = products
    .map(
      (product) => `
        <tr>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>${product.store?.name || "N/A"}</td>
        </tr>
      `,
    )
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: "Out-of-Stock Products",
    html: `
      <h2>Out-of-Stock Products</h2>

      <table border="1" cellpadding="8">
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Store</th>
        </tr>

        ${rows}
      </table>
    `,
  });
};

module.exports = sendOutOfStockEmail;
