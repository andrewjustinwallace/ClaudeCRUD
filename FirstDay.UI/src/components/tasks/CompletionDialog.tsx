import { ChangeEvent, useState } from 'react';

interface CompletionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (notes: string) => Promise<void>;
    isSubmitting?: boolean;
}

export function CompletionDialog({ isOpen, onClose, onConfirm, isSubmitting = false }: CompletionDialogProps) {
    const [notes, setNotes] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    const handleSubmit = async () => {
        await onConfirm(notes);
        setNotes('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-[425px] w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Complete Task</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>
                
                <div className="mb-4">
                    <textarea
                        value={notes}
                        onChange={handleChange}
                        placeholder="Enter completion notes..."
                        className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
                
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Completing...' : 'Complete Task'}
                    </button>
                </div>
            </div>
        </div>
    );
}