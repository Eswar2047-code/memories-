export const SCENE_COUNT = 11;

export type CamKey = {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

export const cameraKeys: CamKey[] = [
  { pos: [0, 1.65, 11], look: [0, 1.6, -4], fov: 42 }, // 0 intro
  { pos: [0, 1.7, 5.4], look: [0, 1.7, -4], fov: 48 }, // 1 classroom
  { pos: [0, 1.85, 2.2], look: [0, 1.9, -4], fov: 40 }, // 2 reveal
  { pos: [0, 3.4, 3.2], look: [0, 4.5, -4], fov: 55 }, // 3 dissolve
  { pos: [0, 0, 9], look: [0, 0, 0], fov: 50 }, // 4 constellation
  { pos: [1.6, 0.4, 8], look: [0, 0, 0], fov: 52 }, // 5 lesson
  { pos: [-1.6, -0.4, 8.4], look: [0, 0, 0], fov: 52 }, // 6 memory
  { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 58 }, // 7 terminal
  { pos: [0, 0.6, 9], look: [0, 0, 0], fov: 48 }, // 8 gratitude
  { pos: [0, 0, 8.6], look: [0, 0, 0], fov: 50 }, // 9 message
  { pos: [0, 0, 9.4], look: [0, 0, 0], fov: 46 }, // 10 finale
];

export const GALAXY_FROM = 3;
