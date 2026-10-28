/**
 * Utilitaires fiables pour manipuler les dates au format YYYY-MM-DD
 * en respectant scrupuleusement le fuseau horaire local de l'utilisateur.
 */

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (dateStr?: string): number => {
  if (!dateStr || !dateStr.includes('-')) return 0;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return 0;
  return new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
};

export const getRelativeDateInfo = (dateStr?: string) => {
  if (!dateStr) return { text: 'Sans date', isOverdue: false, isToday: false };

  const todayStr = getLocalDateString();
  if (dateStr === todayStr) {
    return { text: "Aujourd'hui", isOverdue: false, isToday: true };
  }

  const todayMidnight = parseLocalDate(todayStr);
  const targetMidnight = parseLocalDate(dateStr);

  const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 3600 * 24));

  if (diffDays === 0) return { text: "Aujourd'hui", isOverdue: false, isToday: true };
  if (diffDays === 1) return { text: 'Demain', isOverdue: false, isToday: false };
  if (diffDays === 2) return { text: 'Après-demain', isOverdue: false, isToday: false };
  if (diffDays < 0) return { text: `En retard (${Math.abs(diffDays)} j)`, isOverdue: true, isToday: false };
  return { text: `Dans ${diffDays} jours`, isOverdue: false, isToday: false };
};
