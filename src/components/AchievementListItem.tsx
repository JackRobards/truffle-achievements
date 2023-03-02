import { Achievement } from 'thin-backend';

interface Props {
  achievement: Achievement;
  isLastIndex?: boolean;
  isComplete?: boolean;
}

export function AchievementListItem({
  achievement,
  isLastIndex,
  isComplete,
}: Props) {
  const { title, description, points } = achievement;

  return (
    <li className={!isLastIndex ? 'pb-3' : ''}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {isComplete ? (
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : null}
        </div>
        <div className="ml-auto flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{title}</p>
          <p className="truncate text-sm italic text-gray-800">{description}</p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900">
          {points}
        </div>
      </div>
    </li>
  );
}

export default AchievementListItem;
