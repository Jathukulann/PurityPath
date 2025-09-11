import StreakCounter from '../StreakCounter'

export default function StreakCounterExample() {
  return (
    <StreakCounter 
      currentStreak={23} 
      longestStreak={47} 
      onReset={() => console.log('Streak reset')}
    />
  )
}