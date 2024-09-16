import { api } from '@/app/config/api';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from './ui/button';

export default function UploadCsvButton() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setLoading(true);
      const selectedFile = event.target.files[0];
      await handleUpload(selectedFile);
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/projetos/many', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Arquivo enviado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
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
        style={{ display: 'none' }}
      />
      <Button
        className="z-50 text-white text-base px-8 py-6 rounded-full"
        variant={'default'}
        disabled={loading}
        onClick={triggerFileInput}
      >
        {loading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : (
          'Importar CSV'
        )}
      </Button>
    </div>
  );
}
