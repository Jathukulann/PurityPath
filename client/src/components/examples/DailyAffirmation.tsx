import DailyAffirmation from '../DailyAffirmation'

export default function DailyAffirmationExample() {
  return (
    <DailyAffirmation onRefresh={() => console.log('Affirmation refreshed')} />
  )
}