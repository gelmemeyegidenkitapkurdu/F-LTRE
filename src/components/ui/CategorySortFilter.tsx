import { ReactNode } from 'react';
import { ArrowUpAZ, CalendarDays, Eye } from 'lucide-react';
import { CategorySortOption } from '../../utils/categorySort';

interface CategorySortFilterProps {
  value: CategorySortOption;
  onChange: (value: CategorySortOption) => void;
  darkMode: boolean;
  children?: ReactNode;
}

const sortOptions: Array<{ value: CategorySortOption; label: string; icon: typeof CalendarDays }> = [
  { value: 'default', label: 'Yeniden eskiye', icon: CalendarDays },
  { value: 'oldest', label: 'Eskiden yeniye', icon: CalendarDays },
  { value: 'mostViewed', label: 'En çok görüntülenen', icon: Eye },
  { value: 'alphabetical', label: "A'dan-Z'ye", icon: ArrowUpAZ }
];

export const CategorySortFilter = ({ value, onChange, darkMode, children }: CategorySortFilterProps) => {
  return (
    <div className="mb-6 rounded-2xl border border-pink-300/70 p-3 shadow-sm dark:border-pink-500/40">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`mr-2 text-sm font-semibold ${darkMode ? 'text-pink-300' : 'text-pink-600'}`}>
          Sıralama:
        </span>

        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? darkMode
                    ? 'border-pink-400 bg-pink-500/20 text-pink-200'
                    : 'border-pink-500 bg-pink-100 text-pink-700'
                  : darkMode
                    ? 'border-gray-600 bg-gray-800 text-gray-300 hover:border-pink-400 hover:text-pink-200'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-pink-600'
              }`}
              aria-pressed={isActive}
            >
              <Icon size={15} />
              {option.label}
            </button>
          );
        })}
      </div>

      {children ? (
        <div className={`mt-3 border-t pt-3 ${darkMode ? 'border-gray-700' : 'border-pink-100'}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
};
