import Stats from 'stats.js';

export const createStats = (container:HTMLElement) => {
  const stats = new Stats();
  stats.showPanel(0);
  container.appendChild(stats.dom);
  return stats;
}