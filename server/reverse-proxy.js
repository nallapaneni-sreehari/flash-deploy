const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

const BASE_PATH = path.join(__dirname, "../", "projects");

// Middleware to serve static files per subdomain
app.use((req, res, next) => {
  const hostname = req.hostname; // e.g., project1-flashdeploy.iamsreehari.in
  const subdomain = hostname.split(".")[0];

  const projectPath = path.join(BASE_PATH, subdomain, "dist");

  console.log(`projectPath ::: `, projectPath);
  if (!fs.existsSync(projectPath)) {
    return res.status(404).send("Project not found");
  }

  // Serve static files with SPA fallback
  const indexFile = path.join(projectPath, "index.html");
  const requestedFile = path.join(projectPath, req.path);

  if (req.path === "/" || !fs.existsSync(requestedFile)) {
    return res.sendFile(indexFile);
  } else {
    return res.sendFile(requestedFile);
  }
});

// Optional: main domain fallback
app.get("/", (req, res) => {
  res.send("Welcome to iamsreehari.in main site");
});

app.listen(PORT, () => console.log(`Reverse Proxy running on port ${PORT}`));


// E:\Projects\flash-deploy\server\server\core\flashdeploy\react-project-template
// E:\Projects\flash-deploy\server\core\flashdeploy\react-project-template