import { Request, Response } from "express";
import path from "path";
import Page from "../models/page.model";
import {
  pathExists,
  ensureDirectoryExists,
  readFile,
  writeFile,
} from "@shared/utils";
import {
  generateDefaultPageContent,
  generateNewRouteConfig,
} from "../util/pageUtils";

const PROJECTS_ROOT = path.join(__dirname, "../projects");

const createPage = async (req: Request, res: Response): Promise<any> => {
  const {
    projectId,
    projectName,
    pageName,
    route,
    content,
    title,
    description,
  } = req.body;

  const projectDir = path.join(PROJECTS_ROOT, projectName);
  const pagesDir = path.join(projectDir, "src/pages");
  const pagePath = path.join(pagesDir, `${pageName}.tsx`);
  const routesDir = path.join(projectDir, "src/routes");
  const routesConfigFilePath = path.join(routesDir, "routesConfig.tsx");

  try {
    const projectExists = await pathExists(projectDir);
    if (!projectExists) {
      return res.status(404).json({ msg: "Project not found." });
    }

    await ensureDirectoryExists(pagesDir);
    await ensureDirectoryExists(routesDir);

    const pageExists = await pathExists(pagePath);
    if (pageExists) {
      return res.status(400).json({ msg: "Page already exists." });
    }

    const defaultContent = content || generateDefaultPageContent(pageName);
    await writeFile(pagePath, defaultContent);

    const newRouteConfig = generateNewRouteConfig({
      pageName,
      route,
      title: title || pageName,
      description: description || `${pageName} page`,
    });

    const routesConfigExists = await pathExists(routesConfigFilePath);

    if (routesConfigExists) {
      let existingConfig = await readFile(routesConfigFilePath, "utf-8");

      const importStatement = `const ${pageName} = lazy(() => import('../pages/${pageName}'));`;

      // Regex for matching lazy imports
      const lazyImportRegex = /^const\s+\w+\s*=\s*lazy\(.*?\);\s*$/gm;
      const lazyImports = [...existingConfig.matchAll(lazyImportRegex)];
      const lastLazyImportIndex = lazyImports[lazyImports.length - 1]?.index;

      // Add the new lazy import after the last lazy import
      if (lastLazyImportIndex !== undefined) {
        const lastLazyImportMatch = lazyImports[lazyImports.length - 1];
        const insertPosition =
          lastLazyImportIndex + lastLazyImportMatch[0].length;

        if (!existingConfig.includes(importStatement)) {
          existingConfig =
            existingConfig.slice(0, insertPosition) +
            `\n${importStatement}` +
            existingConfig.slice(insertPosition);
        }
      }

      // Regex for matching the routes array
      const routesArrayRegex = /const routes = \[([\s\S]*?)\];/m;

      // Ensure the new route config is added to the routes array
      if (routesArrayRegex.test(existingConfig)) {
        existingConfig = existingConfig.replace(
          routesArrayRegex,
          (_, routes) => {
            // Check if the new route is already present
            const routeToAdd = newRouteConfig.trim();
            if (!routes.includes(routeToAdd)) {
              return `const routes = [${routes.trim()}, ${routeToAdd}];`;
            }
            return `const routes = [${routes.trim()}];`;
          }
        );
      } else {
        // If the routes array is not found, add it as a fallback
        existingConfig += `
const routes = [${newRouteConfig.trim()}];
export const router = createBrowserRouter(routes);
export default routes;
`;
      }

      // Write the updated config back to the file
      await writeFile(routesConfigFilePath, existingConfig, "utf-8");
    } else {
      // If the config file doesn't exist, create a new one
      const routesConfigContent = `
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

const ${pageName} = lazy(() => import('../pages/${pageName}'));

const routes = [${newRouteConfig.trim()}];

export const router = createBrowserRouter(routes);
export default routes;
`;

      await writeFile(routesConfigFilePath, routesConfigContent, "utf-8");
    }

    const newPage = new Page({
      projectId,
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
