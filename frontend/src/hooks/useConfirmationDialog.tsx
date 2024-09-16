import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCallback, useState } from 'react';

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<
    (value: boolean) => void
  >(() => {});

  const confirm = useCallback(() => {
    return new Promise<boolean>(resolve => {
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise(true);
  };

  const ConfirmationDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        className="bg-white p-10 rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita de nenhuma forma.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-base px-8 py-6 rounded-full"
            onClick={handleCancel}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-base px-8 py-6 rounded-full"
            onClick={handleConfirm}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmationDialog };
}
