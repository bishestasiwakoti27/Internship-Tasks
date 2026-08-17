const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Shopping API",
      version: "1.0.0",
      description:
        "Shopping API with MongoDB, Basic Authentication and JWT Authentication",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },

        basicAuth: {
          type: "http",
          scheme: "basic",
        },
      },
    },
  },

  apis: ["./task4/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
