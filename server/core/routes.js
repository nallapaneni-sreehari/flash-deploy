const express = require("express");
const router = express.Router();
const { spawn, exec } = require("child_process");
const { randomUUID } = require("crypto");

const fs = require("fs");
const path = require("path");

router.post("/deploy", async (req, res) => {
  const { git_url, project_name } = req.body;

  if (!git_url || !project_name) {
    return res
      .status(400)
      .json({ error: "git_url and project_name are required" });
  }

  const imageTag = `flashdeploy-${project_name}-${randomUUID().slice(0, 6)}`;
  const outputDir = path.join(__dirname, "../../projects", project_name.replace('-', ''));

  // Ensure output folder exists
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Set headers for streaming logs
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  function log(msg) {
    console.log(msg);
    res.write(msg + "\n");
  }

  try {
    log(`🚀 Starting build for ${project_name}`);

    await dockerBuild(git_url, project_name, imageTag, log);
    const containerId = await dockerCreate(imageTag, log);
    await dockerCopy(containerId, project_name, outputDir, log);
    await dockerCleanup(containerId, imageTag, log);

    log(`✅ Deployment completed successfully for ${project_name}`);
    res.end();
  } catch (err) {
    log(`❌ Deployment failed: ${err.message}`);
    res.end();
  }
});

// Function to run docker commands with logging
function runDockerCommand(args, log) {
  return new Promise((resolve, reject) => {
    const proc = spawn("docker", args);
    let output = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
      log(data.toString());
    });

    proc.stderr.on("data", (data) => log("ERR: " + data.toString()));

    proc.on("close", (code) => {
      if (code !== 0)
        reject(new Error(`Command failed: docker ${args.join(" ")}`));
      else resolve(output.trim());
    });
  });
}

// Build docker image
async function dockerBuild(git_url, project_name, imageTag, log) {
  log("🔨 Building Docker image...");
  await runDockerCommand(
    [
      "build",
      "--build-arg",
      `git_url=${git_url}`,
      "--build-arg",
      `project_name=${project_name}`,
      "-t",
      imageTag,
      ".",
    ],
    log
  );
  log("✅ Docker image built successfully");
}

// Create temporary container
async function dockerCreate(imageTag, log) {
  log("📦 Creating temporary container...");
  const containerId = await runDockerCommand(["create", imageTag], log);
  log(`Container created: ${containerId}`);
  return containerId;
}

// Copy built files from container to host
async function dockerCopy(containerId, project_name, outputDir, log) {
  log("📂 Copying build files to host...");
  const buildFolder = "dist"; // or 'build' depending on framework
  await runDockerCommand(
    ["cp", `${containerId}:/app/${project_name}/${buildFolder}`, outputDir],
    log
  );
  log(`✅ Build files copied to ${outputDir}`);
}

// Remove container and image
async function dockerCleanup(containerId, imageTag, log) {
  log("🧹 Cleaning up container and image...");
  await runDockerCommand(["rm", containerId], log);
  await runDockerCommand(["rmi", "-f", imageTag], log);
  log(`✅ Container ${containerId} and image ${imageTag} removed`);
}

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
