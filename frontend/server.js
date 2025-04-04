const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "build")));

// Redirect all routes to index.html (Fix for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});
