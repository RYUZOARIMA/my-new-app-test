export default function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-medium tracking-[0.25em] text-[color:var(--color-red)]">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-serif text-xl text-[color:var(--color-indigo-deep)]">
        {title}
      </h2>
      <div className="mt-2 h-px w-10 bg-[color:var(--color-indigo-deep)]" />
    </div>
  );
}
