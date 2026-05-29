import FeatureValue from "./feature-value";

interface FeatureRowProps {
  label: string;
  values: Array<string | boolean>;
  columnStyles?: Array<React.CSSProperties | undefined>;
}

export default function FeatureRow({
  label,
  values,
  columnStyles = [],
}: FeatureRowProps) {
  return (
    <tr className="border-border/50 border-b">
      <td className="text-muted-foreground py-4 pr-4 text-sm">{label}</td>
      {values.map((value, index) => (
        <td
          key={`${label}-${index}`}
          className="px-4 py-4 text-center"
          style={columnStyles[index]}
        >
          <FeatureValue value={value} />
        </td>
      ))}
    </tr>
  );
}
