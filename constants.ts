/**
 * An array of Tailwind CSS background color classes for use in tag creation.
 */
export const tagColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];

/**
 * The key used to store the application's state in the browser's localStorage.
 * Versioned to facilitate easier state migration in the future.
 */
export const APP_STORAGE_KEY = 'spliceBoxAppState_v2';

/**
 * An array of hex color codes representing the standard TIA-598-C color code for optical fibers.
 * Used for visualizing fibers in the splicing diagram.
 */
export const FIBER_COLORS = [
  '#3b82f6', // 1. Blue
  '#f97316', // 2. Orange
  '#22c55e', // 3. Green
  '#a16207', // 4. Brown (yellow-700 for better visibility)
  '#64748b', // 5. Slate
  '#f8fafc', // 6. White (slate-50)
  '#ef4444', // 7. Red
  '#1e293b', // 8. Black (slate-800)
  '#eab308', // 9. Yellow
  '#8b5cf6', // 10. Violet
  '#ec4899', // 11. Rose (pink-500)
  '#22d3ee', // 12. Aqua (cyan-400)
];
