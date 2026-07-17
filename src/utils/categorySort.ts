import { sortByNewest } from './sortByNewest';

export type CategorySortOption = 'default' | 'oldest' | 'mostViewed' | 'alphabetical';

type SortableCategoryItem = {
  id: string;
  title?: string;
  question?: string;
  views?: number;
  date?: string;
  created_at?: string;
};

const getAlphabeticalValue = (item: SortableCategoryItem) =>
  String(item.title || item.question || '').trim();

export const applyCategorySort = <T extends SortableCategoryItem>(
  items: T[],
  option: CategorySortOption
): T[] => {
  const defaultSorted = sortByNewest(items);

  if (option === 'oldest') {
    return [...defaultSorted].reverse();
  }

  if (option === 'mostViewed') {
    return [...defaultSorted].sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  if (option === 'alphabetical') {
    return [...defaultSorted].sort((a, b) =>
      getAlphabeticalValue(a).localeCompare(getAlphabeticalValue(b), 'tr', {
        sensitivity: 'base'
      })
    );
  }

  return defaultSorted;
};
