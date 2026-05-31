type Props = {
  onFileSelect: (file: File | null) => void;
};

export default function PdfUploader({
  onFileSelect,
}: Props) {
  return (
    <div className="border-2 border-dashed p-8 rounded-lg">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onFileSelect(file || null);
          }
        }}
      />
    </div>
  );
}