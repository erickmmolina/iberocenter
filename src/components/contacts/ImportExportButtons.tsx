import { Download, Upload } from 'lucide-react';
import { exportContacts, importContacts } from '../../lib/contacts/import-export';

interface ImportExportButtonsProps {
  onImportComplete: () => void;
}

export function ImportExportButtons({ onImportComplete }: ImportExportButtonsProps) {
  const handleExport = async () => {
    try {
      const csv = await exportContacts();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      alert('Error al exportar contactos');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importContacts(file);
      onImportComplete();
    } catch (error) {
      console.error('Error importing contacts:', error);
      alert('Error al importar contactos');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Exportar
      </button>
      
      <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        Importar
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleImport}
        />
      </label>
    </div>
  );
}