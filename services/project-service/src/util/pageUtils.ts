export interface RouteConfig {
  pageName: string;
  route: string;
  title: string;
  description: string;
}

/**
 * Generates default content for a new page file.
 * @param pageName - The name of the page.
 * @returns Default content for the page.
 */
export const generateDefaultPageContent = (pageName: string): string => `
import React from 'react';

const ${pageName} = () => {
  return <div>Welcome to the ${pageName} page!</div>;
};

export default ${pageName};
`;

/**
 * Generates a new route configuration.
 * @param config - Route configuration object.
 * @returns Route configuration string.
 */
export const generateNewRouteConfig = (config: RouteConfig): string => `
  {
    path: '${config.route}',
    element: <${config.pageName} />,
    meta: {
      title: '${config.title}',
      description: '${config.description}',
    },
  }
`;
