import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxUploads?: number;
}

const ImageUploader = ({ images, onChange, maxUploads = 3 }: ImageUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Convert files to object URLs for local display
        const newImages = acceptedFiles.map(file => URL.createObjectURL(file));

        // Append but respect max uploads
        const combined = [...images, ...newImages].slice(0, maxUploads);
        onChange(combined);
    }, [images, onChange, maxUploads]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: maxUploads - images.length,
        disabled: images.length >= maxUploads
    });

    const removeImage = (indexToRemove: number) => {
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(images[indexToRemove]);
        onChange(images.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-ink-muted uppercase tracking-wide text-xs">Photos (Crumb & Crust)</label>
                <span className="text-xs font-serif text-ink-faint">{images.length} / {maxUploads} uploaded</span>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-journal-border shadow-sm group">
                            <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <button
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="absolute top-2 right-2 bg-ink-main/80 text-white p-1.5 rounded-full hover:bg-crust transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {images.length < maxUploads && (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3
            ${isDragActive ? 'border-crust bg-crust/5' : 'border-journal-border hover:border-sage-dark bg-journal-bg hover:bg-white'}
          `}
                >
                    <input {...getInputProps()} />
                    <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-crust/10 text-crust' : 'bg-white shadow-sm text-ink-muted'}`}>
                        <ImagePlus className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-medium text-ink-main text-sm">
                            {isDragActive ? "Drop photos here..." : "Click to upload photos"}
                        </p>
                        <p className="text-ink-faint text-xs mt-1">or drag and drop</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
