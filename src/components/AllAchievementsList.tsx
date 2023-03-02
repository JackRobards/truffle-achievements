import { query } from 'thin-backend';
import { useQuery } from 'thin-backend-react';
import { AchievementListItem } from './AchievementListItem';

export function AllAchievementsList() {
  const allAchievements = useQuery(query('achievements'));
  console.log(allAchievements);

  return (
    <ul className="divide-y divide-gray-200">
      {allAchievements?.map((achievement, index) => {
        return (
          <AchievementListItem
            key={achievement.id}
            achievement={achievement}
            isLastIndex={index === allAchievements.length - 1}
          />
        );
      })}
    </ul>
  );
}

export default AllAchievementsList;
