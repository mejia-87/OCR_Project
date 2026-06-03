import type { LetterForm as LetterFormType } from "../types/letter";

type Props = {
  form: LetterFormType;
  selectedField: keyof LetterFormType | null;
  setSelectedField: (field: keyof LetterFormType) => void;
  onChange: (
    field: keyof LetterFormType,
    value: string
  ) => void;
  saveLetter: () => void;
};

export default function LetterForm({
  form,
  selectedField,
  setSelectedField,
  onChange,
  saveLetter,
}: Props) {
  const fields: {
    key: keyof LetterFormType;
    label: string;
  }[] = [
      { key: "referencia", label: "Referencia" },
      { key: "cite", label: "Cite" },
      { key: "sidoc", label: "Sidoc" },
      { key: "fecha", label: "Fecha" },
      { key: "receptor", label: "Receptor" },
      { key: "emisor", label: "Emisor" },
    ];

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block mb-1 text-lg font-bold text-blue-950">
            {field.label}
          </label>

          <input
            value={form[field.key]}
            onClick={() => setSelectedField(field.key)}
            onChange={(e) =>
              onChange(field.key, e.target.value)
            }
            className={`w-full border rounded-lg p-2 transition
              ${selectedField === field.key
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-gray-300"
              }`}
          />
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={saveLetter}
          className="mt-10 px-10 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Guardar
        </button>
      </div>

    </div>
  );
}