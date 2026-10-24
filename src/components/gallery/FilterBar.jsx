import './FilterBar.css';

export const CATEGORIES = [
  { id: 'all',       label: 'All Moments' },
  { id: 'events',    label: 'TEDx Events' },
  { id: 'speakers',  label: 'Speakers' },
  { id: 'audience',  label: 'Audience' },
  { id: 'bts',       label: 'Behind The Scenes' },
  { id: 'team',      label: 'Team & Community' },
];

/**
 * Horizontally-scrollable category filter chips.
 * Active chip uses TEDx red as the sole accent.
 */
export default function FilterBar({ activeCategory, onCategoryChange }) {
  return (
    <div className="filter-bar" role="navigation" aria-label="Gallery categories">
      <div className="filter-bar__scroll" role="list">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              role="listitem"
              className={`filter-chip${isActive ? ' filter-chip--active' : ''}`}
              aria-pressed={isActive}
              aria-label={`Filter by ${cat.label}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
