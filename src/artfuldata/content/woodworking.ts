import projects from './woodworking.json' with { type: 'json' };

export const woodworkingProjects = projects;
export const featuredWoodworking = projects.slice(0, 3);
export type WoodworkingProject = (typeof projects)[number];
