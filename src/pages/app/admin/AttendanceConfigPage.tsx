export const AttendanceConfigPage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Attendance configuration</h1>
      <p className="text-sm text-muted-foreground">
        Windows per lesson/day, reason codes (PRD §8.10) — admin-only demo stub.
      </p>
      <ul className="list-inside list-disc text-sm text-muted-foreground">
        <li>Medical</li>
        <li>Unexplained</li>
        <li>School trip</li>
      </ul>
    </div>
  )
}
