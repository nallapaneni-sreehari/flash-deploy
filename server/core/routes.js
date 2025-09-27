const express = require("express");
const router = express.Router();
const { spawn, exec } = require("child_process");
const { randomUUID } = require("crypto");

const fs = require("fs");
const path = require("path");

router.post("/deploy", (req, res) => {
  const { git_url, project_name } = req.body;

  if (!git_url || !project_name) {
    return res
      .status(400)
      .json({ error: "git_url and project_name are required" });
  }

  const imageTag = `flashdeploy-${project_name}-${randomUUID().slice(0, 6)}`;
  const outputDir = path.join(__dirname, "../", "../", "projects", project_name);

  // Ensure output folder exists
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Set headers for streaming logs
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  function log(msg) {
    console.log(msg);
    res.write(msg + "\n");
  }

  log(`🚀 Starting build for ${project_name}`);

  // Spawn Docker build
  const build = spawn("docker", [
    "build",
    "--build-arg",
    `git_url=${git_url}`,
    "--build-arg",
    `project_name=${project_name}`,
    "-t",
    imageTag,
    ".",
  ]);

  build.stdout.on("data", (data) => log(data.toString()));
  build.stderr.on("data", (data) => log("ERR: " + data.toString()));

  build.on("close", (code) => {
    if (code !== 0) {
      log(`❌ Build failed with code ${code}`);
      return res.end();
    }

    log("✅ Build finished, creating temporary container...");

    // Create container
    const create = spawn("docker", ["create", imageTag]);

    let containerId = "";
    create.stdout.on("data", (data) => (containerId += data.toString()));
    create.stderr.on("data", (data) => log("ERR: " + data.toString()));

    create.on("close", (code) => {
      if (code !== 0 || !containerId.trim()) {
        log(`❌ Failed to create container`);
        return res.end();
      }

      containerId = containerId.trim();
      log(`Container created: ${containerId}`);

      // Determine build folder inside container
      const buildFolder = "dist"; // or 'build' depending on framework

      // Copy to host
      try {
        spawn("docker", [
          "cp",
          `${containerId}:/app/${project_name}/${buildFolder}`,
          outputDir,
        ]);
      } catch (e) {
        log(
          `Failed to copy files from ${containerId} and image ${imageTag}. Error: ${e.message}`
        );
      }

      log(`🧹 Cleaned up container ${containerId} and image ${imageTag}`);
      res.end();
    });
  });
});

// Stop a container
router.post("/stop", (req, res) => {
  const { containerId } = req.body;

  if (!containerId) {
    return res.status(400).json({ error: "containerId is required" });
  }

  const stopCmd = `docker stop ${containerId} && docker rm ${containerId}`;

  exec(stopCmd, (err, stdout, stderr) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to stop container", details: stderr });
    }
    res.json({ message: `Container ${containerId} stopped and removed` });
  });
});

// List running deployments
router.get("/deployments", (req, res) => {
  exec(
    "docker ps --format '{{.ID}} {{.Image}} {{.Ports}}'",
    (err, stdout, stderr) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to list containers", details: stderr });
      }
      const deployments = stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [id, image, ...ports] = line.split(" ");
          return { id, image, ports: ports.join(" ") };
        });
      res.json(deployments);
    }
  );
});

module.exports = {
  coreRouter: router,
};
