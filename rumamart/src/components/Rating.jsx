import { StarIcon } from './Icons'

export default function Rating({ value, reviews, className = '' }) {
  const filled = Math.round(value)

  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`} aria-label={`Rating ${value} dari 5`}>
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} className={`h-4 w-4 ${n <= filled ? 'text-amber-400' : 'text-gray-200'}`} />
        ))}
      </div>
      <span className="font-semibold text-gray-700">{value.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-gray-400">({reviews})</span>}
    </div>
  )
}
