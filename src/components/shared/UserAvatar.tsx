interface Props {
  picture?: string | null
  firstName?: string | null
  lastName?: string | null
  className?: string
}

export default function UserAvatar({ picture, firstName, lastName, className }: Props) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?'
  if (picture) return <img src={picture} alt="profile" className={className} />
  return (
    <div className={`bg-primary/20 flex items-center justify-center text-primary font-bold text-sm ${className}`}>
      {initials}
    </div>
  )
}
