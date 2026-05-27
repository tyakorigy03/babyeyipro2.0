require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
const { verifyMailer } = require('./config/mailer');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await verifyMailer();
    app.listen(PORT, () => {
      console.log(`🚀  Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
