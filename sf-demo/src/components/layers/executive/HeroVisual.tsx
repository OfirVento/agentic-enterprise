import { TruthLabel } from '@/components/shared/TruthLabel';
import type { AssessmentPayload } from '@/types/assessment';

type Props = {
  payload: AssessmentPayload;
};

/**
 * Two-bar comparison: capability surfaces in use today (CPQ baseline) vs.
 * the same set plus RCA opportunities unlocked.
 *
 * Heuristic — the bar values do not come from a single payload field but
 * are derived: CPQ baseline = a fixed surface count of 4 (pricing,
 * configuration, approvals, contracts) per the customer profile; RCA
 * upside = baseline + rcaOpportunities.length.
 */
export function HeroVisual({ payload }: Props) {
  const cpqToday = 4;
  const rcaTotal = cpqToday + payload.rcaOpportunities.length;
  const max = Math.max(rcaTotal, 1);

  const bars = [
    { label: 'CPQ today', value: cpqToday, hint: 'Capability surfaces in active use' },
    {
      label: 'With Revenue Cloud Advanced',
      value: rcaTotal,
      hint: `${cpqToday} preserved + ${payload.rcaOpportunities.length} unlocked`,
    },
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Capabilities — today vs. with RCA
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            CPQ utilization compared with the modules unlocked by migration.
          </p>
        </div>
        <TruthLabel variant="heuristic" />
      </header>

      <div className="space-y-4">
        {bars.map((b) => {
          const pct = (b.value / max) * 100;
          return (
            <div key={b.label}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="font-medium text-foreground">{b.label}</span>
                <span className="font-mono text-foreground">{b.value}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  aria-label={`${b.label}: ${b.value} of ${max}`}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{b.hint}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
