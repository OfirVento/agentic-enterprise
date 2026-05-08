import { LayerScaffold } from './LayerScaffold';

export function ImplementationLayer() {
  return (
    <LayerScaffold
      title="Implementation report"
      subtitle="Findings by category, severity, and recommended action."
      truthLabel="sample_data"
      milestone="M1 will populate the section nav, findings list, and the v2.1 locked banner."
    />
  );
}
