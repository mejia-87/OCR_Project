import type { LetterForm as LetterFormType } from "../types/letter";

type Props = {
  form: LetterFormType;
  selectedField: keyof LetterFormType | null;
  setSelectedField: (field: keyof LetterFormType) => void;
  onChange: (
    field: keyof LetterFormType,
    value: string
  ) => void;
};

export default function LetterForm({
  form,
  selectedField,
  setSelectedField,
  onChange,
}: Props) {
  const fields: {
    key: keyof LetterFormType;
    label: string;
  }[] = [
    { key: "referencia", label: "Referencia" },
    { key: "cite", label: "Cite" },
    { key: "sidoc", label: "SIDOC" },
    { key: "fecha", label: "Fecha" },
    { key: "receptor", label: "Receptor" },
    { key: "emisor", label: "Emisor" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Registro de Carta
      </h2>

      {fields.map((field) => (
        <div key={field.key}>
          <label className="block mb-1 text-sm font-medium">
            {field.label}
          </label>

          <input
            value={form[field.key]}
            onClick={() => setSelectedField(field.key)}
            onChange={(e) =>
              onChange(field.key, e.target.value)
            }
            className={`w-full border rounded-lg p-2 transition
              ${
                selectedField === field.key
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-300"
              }`}
          />
        </div>
      ))}
    </div>
  );
}