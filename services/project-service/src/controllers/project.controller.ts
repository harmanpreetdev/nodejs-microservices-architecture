import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import archiver from "archiver";
import { promisify } from "util";
import Project from "../models/project.model";

const fsExists = promisify(fs.exists);
const fsUnlink = promisify(fs.unlink);
const fsMkdir = promisify(fs.mkdir);

const runCommand = (command: string, cwd?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
      }
      if (stderr && !stderr.includes("deprecated")) {
        console.warn(`Warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

const createProject = async (req: Request, res: Response): Promise<any> => {
  const { name, description, userId, config } = req.body;
  const projectsRoot = path.join(__dirname, "../projects");
  const projectDir = path.join(projectsRoot, name);

  try {
    const rootExists = await fsExists(projectsRoot);
    if (!rootExists) {
      await fsMkdir(projectsRoot, { recursive: true });
      console.log(`Projects root directory created at: ${projectsRoot}`);
    }

    const projectExists = await fsExists(projectDir);
    if (projectExists) {
      return res.status(400).json({ msg: "Project already exists." });
    }

    const createViteAppCommand = `npx create-vite@latest ${name} --template react-ts`;
    await runCommand(createViteAppCommand, projectsRoot);

    const newProject = new Project({
      name,
      description,
      userId,
      config,
    });
    await newProject.save();

    res.status(201).json({
      msg: "Project created successfully",
      project: {
        id: newProject._id,
        name: newProject.name,
        description: newProject.description,
        userId: newProject.userId,
        config: newProject.config,
      },
    });
  } catch (error: any) {
    console.error("Error handling project creation:", error);

    if (error.code === "EACCES") {
      res.status(500).json({ msg: "Permission denied to create directories." });
    } else {
      res
        .status(500)
        .json({ msg: `Failed to create project. Error: ${error.message}` });
    }
  }
};

const downloadProject = async (req: Request, res: Response): Promise<void> => {
  const { projectName } = req.params;
  const projectsRoot = path.resolve(__dirname, "../projects");
  const projectDir = path.join(projectsRoot, projectName);

  try {
    if (!(await fsExists(projectDir))) {
      res.status(404).json({ msg: "Project not found." });
      return;
    }

    const zipPath = path.join(projectsRoot, `${projectName}.zip`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      res.status(500).json({ msg: "Error creating zip file." });
    });

    output.on("close", async () => {
      console.log(`Archive finalized. Size: ${archive.pointer()} bytes`);

      res.download(zipPath, `${projectName}.zip`, async (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error downloading file.");
        }

        try {
          await fsUnlink(zipPath);
          console.log(`Temporary zip file removed: ${zipPath}`);
        } catch (cleanupError) {
          console.error("Error cleaning up zip file:", cleanupError);
        }
      });
    });

    archive.pipe(output);
    archive.directory(projectDir, false);

    await archive.finalize();
  } catch (error: any) {
    console.error("Error handling project download:", error);
    res.status(500).send(`Failed to download project. Error: ${error.message}`);
  }
};

export default { createProject, downloadProject };
