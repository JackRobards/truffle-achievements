import { useMemo } from 'react';
import { Achievement, query } from 'thin-backend';
import { useCurrentUser, useQuery } from 'thin-backend-react';
import AchievementListItem from './AchievementListItem';

export function CompletedUserAchievementList() {
  const { id: userId = '' } = useCurrentUser() ?? {};
  const userAchievements = useQuery(
    query('user_achievments').where('userId', userId).orderByDesc('updatedAt')
  );

  const allAchievements = useQuery(query('achievements'));

  const allAchievementsById = useMemo<Record<string, Achievement>>(() => {
    return (
      allAchievements?.reduce((achievementsById, achievement) => {
        return { ...achievementsById, [achievement.id]: achievement };
      }, {}) ?? {}
    );
  }, [allAchievements]);

  return (
    <ul className="divide-y divide-gray-200">
      {userAchievements?.map(({ achievementId }, index) => {
        const achievement = allAchievementsById[achievementId];
        return (
          <AchievementListItem
            achievement={achievement}
            key={achievement.id}
            isLastIndex={userAchievements.length - 1 === index}
            isComplete
          />
        );
      })}
    </ul>
  );
}

export default CompletedUserAchievementList;
