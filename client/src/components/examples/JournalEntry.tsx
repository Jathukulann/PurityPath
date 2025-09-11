import JournalEntry from '../JournalEntry'

export default function JournalEntryExample() {
  //todo: remove mock functionality
  const mockEntries = [
    {
      id: '1',
      date: '2024-01-15',
      content: 'Had a challenging day today but managed to resist urges by going for a walk instead. Feeling proud of this small victory.',
      mood: 'good' as const,
      isPrivate: true
    },
    {
      id: '2', 
      date: '2024-01-14',
      content: 'Feeling a bit overwhelmed with work stress. Used the breathing exercises and they really helped center me.',
      mood: 'neutral' as const,
      isPrivate: true
    }
  ];

  return (
    <JournalEntry 
      entries={mockEntries}
      onAddEntry={(entry) => console.log('New entry:', entry)}
    />
  )
}