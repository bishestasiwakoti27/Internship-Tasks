const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendInvoiceEmail = async ({
  email,
  customer_name,
  products,
  totalPrice,
}) => {
  if (!email) {
    throw new Error("Customer email is required");
  }

  const productRows = products
    .map(
      (product) => `
        <tr>
          <td>${product.name || product.productId}</td>
          <td>${product.quantity}</td>
        </tr>
      `,
    )
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Shopping API Invoice",
    html: `
      <h2>Order Invoice</h2>

      <p>Hello ${customer_name || "Customer"},</p>

      <table border="1" cellpadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          ${productRows}
        </tbody>
      </table>

      <h3>Total: ${totalPrice}</h3>
    `,
  });
};

module.exports = sendInvoiceEmail;
