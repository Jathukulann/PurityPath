import PanicButton from '../PanicButton'

export default function PanicButtonExample() {
  return (
    <div className="flex justify-center p-8">
      <PanicButton onActivate={() => console.log('Panic button activated')} />
    </div>
  )
}