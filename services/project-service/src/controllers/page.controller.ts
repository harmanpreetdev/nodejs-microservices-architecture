import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import Page from "../models/page.model";

const createPage = async (req: Request, res: Response): Promise<any> => {
  const { projectName, pageName, route, content, title, description } =
    req.body;

  const projectsRoot = path.join(__dirname, "../projects");
  const projectDir = path.join(projectsRoot, projectName);

  const pagesDir = path.join(projectDir, "src/pages");
  const pagePath = path.join(pagesDir, `${pageName}.tsx`);

  const routesDir = path.join(projectDir, "src/routes");
  const routesConfigFilePath = path.join(routesDir, "routesConfig.tsx");

  try {
    const projectExists = await fs
      .access(projectDir)
      .then(() => true)
      .catch(() => false);

    if (!projectExists) {
      return res.status(404).json({ msg: "Project not found." });
    }

    await fs.mkdir(pagesDir, { recursive: true });
    await fs.mkdir(routesDir, { recursive: true });

    const pageExists = await fs
      .access(pagePath)
      .then(() => true)
      .catch(() => false);

    if (pageExists) {
      return res.status(400).json({ msg: "Page already exists." });
    }

    const defaultContent =
      content ||
      `import React from 'react';

const ${pageName} = () => {
  return <div>Welcome to the ${pageName} page!</div>;
};

export default ${pageName};
`;

    await fs.writeFile(pagePath, defaultContent, "utf-8");

    const newRoute = `
  {
    path: '${route}',
    element: <${pageName} />,
    meta: {
      title: '${title || pageName}',
      description: '${description || `${pageName} page`}',
    },
  }
`;

    const routesConfigExists = await fs
      .access(routesConfigFilePath)
      .then(() => true)
      .catch(() => false);

    if (routesConfigExists) {
      let existingConfig = await fs.readFile(routesConfigFilePath, "utf-8");

      const importStatement = `const ${pageName} = lazy(() => import('../pages/${pageName}'));`;
      if (!existingConfig.includes(importStatement)) {
        existingConfig = existingConfig.replace(
          /(import { lazy } from 'react';\n)/,
          `$1${importStatement}\n`
        );
      }

      const updatedConfig = existingConfig.replace(
        /const routes = \[([\s\S]*?)\];/,
        (_, routes) => `const routes = [${routes.trim()}, ${newRoute.trim()}];`
      );
      await fs.writeFile(routesConfigFilePath, updatedConfig, "utf-8");
    } else {
      const routesConfigContent = `
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

const ${pageName} = lazy(() => import('../pages/${pageName}'));

const routes = [${newRoute.trim()}];

export const router = createBrowserRouter(routes);
export default routes;
`;

      await fs.writeFile(routesConfigFilePath, routesConfigContent, "utf-8");
    }

    const newPage = new Page({
      name: pageName,
      route,
      title: title || pageName,
      description: description || `${pageName} page`,
    });

    await newPage.save();

    res.status(201).json({
      msg: "Page created and route updated successfully.",
      page: {
        name: newPage.name,
        route: newPage.route,
        title: newPage.title,
        description: newPage.description,
      },
    });
  } catch (error: any) {
    console.error("Error creating page:", error);

    if (error.code === "EACCES") {
      res
        .status(500)
        .json({ msg: "Permission denied while creating the page." });
    } else if (error.code === "ENOENT") {
      res.status(500).json({
        msg: "Invalid path specified for project or pages directory.",
      });
    } else {
      res
        .status(500)
        .json({ msg: `Failed to create page. Error: ${error.message}` });
    }
  }
};

export default { createPage };
