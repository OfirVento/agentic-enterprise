import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerdictBadge } from '@/components/shared/VerdictBadge';
import { TruthLabel } from '@/components/shared/TruthLabel';
import type { AssessmentPayload } from '@/types/assessment';

type Props = {
  verdict: AssessmentPayload['verdict'];
  narrative: string;
};

export function HeroVerdict({ verdict, narrative }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative space-y-6"
    >
      <div className="flex items-center gap-3">
        <VerdictBadge recommendation={verdict.recommendation} className="px-4 py-1.5 text-base" />
        <TruthLabel variant="ai_generated" />
      </div>

      <div className="relative">
        <p className="max-w-3xl text-2xl font-normal leading-relaxed text-foreground">
          {narrative}
        </p>
        <button
          type="button"
          disabled
          title="Live re-roll available in M3 (Anthropic API integration)"
          className={cn(
            'absolute -top-2 right-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-opacity duration-200',
            hovered ? 'opacity-100' : 'opacity-0',
            'disabled:cursor-not-allowed',
          )}
          aria-label="Re-roll narrative"
        >
          <RotateCw className="h-3 w-3" aria-hidden />
          Re-roll
        </button>
      </div>
    </section>
  );
}
