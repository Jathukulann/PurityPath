import ProgressChart from '../ProgressChart'

export default function ProgressChartExample() {
  //todo: remove mock functionality
  const mockWeeklyData = [
    { week: 'Week 1', cleanDays: 5, totalDays: 7 },
    { week: 'Week 2', cleanDays: 7, totalDays: 7 },
    { week: 'Week 3', cleanDays: 6, totalDays: 7 },
    { week: 'Week 4', cleanDays: 7, totalDays: 7 }
  ];

  const mockMilestones = [
    { days: 1, title: 'First Day Clean', achieved: true, date: 'Jan 1' },
    { days: 7, title: 'One Week Strong', achieved: true, date: 'Jan 7' },
    { days: 30, title: 'One Month Milestone', achieved: false },
    { days: 90, title: 'Three Months Clean', achieved: false }
  ];

  return (
    <ProgressChart 
      weeklyData={mockWeeklyData}
      milestones={mockMilestones}
    />
  )
}