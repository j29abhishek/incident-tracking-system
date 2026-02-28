require("dotenv").config();

const express = require("express");
const connectDB=require('./src/config/db');

// routes 
const authRoutes=require('./src/routes/authRoutes');
const serviceRoutes=require('./src/routes/serviceRoutes');
const incidentRoutes=require('./src/routes/incidentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// connected database
connectDB();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/services',serviceRoutes);
app.use('/api/incidents',incidentRoutes);


// routes (add later)
// app.use("/api/auth", require("./routes/authRoutes"));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});