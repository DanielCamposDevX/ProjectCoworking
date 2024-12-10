import { api } from "@/config/api";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { TemplateButton } from "./templates/Button";

export default function UploadCsvButton({ get }: { get: () => void }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setLoading(true);
      const selectedFile = event.target.files[0];
      await handleUpload(selectedFile);
      get();
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/api/projetos/many", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Arquivo enviado com sucesso:", response.data);
    } catch (error) {
      toast.error(
        (error as { response: { data: string } }).response.data ??
          "Erro ao enviar arquivo"
      );
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <TemplateButton.Secondary
        text="Importar CSV"
        loading={loading}
        onClick={triggerFileInput}
      />
    </div>
  );
}
