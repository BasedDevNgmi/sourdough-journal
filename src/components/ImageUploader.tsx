import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxUploads?: number;
}

const ImageUploader = ({ images, onChange, maxUploads = 3 }: ImageUploaderProps) => {
    const [isCompressing, setIsCompressing] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsCompressing(true);
        try {
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1080,
                useWebWorker: true,
                fileType: 'image/jpeg' as string,
            };

            const compressedFiles = await Promise.all(
                acceptedFiles.map(file => imageCompression(file, compressionOptions))
            );

            // Convert compressed files to base64 data URLs for persistence
            const promises = compressedFiles.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const newImages = await Promise.all(promises);
            // Append but respect max uploads
            const combined = [...images, ...newImages].slice(0, maxUploads);
            onChange(combined);
        } catch (error) {
            console.error("Error compressing images:", error);
            // Fallback or toast could go here
        } finally {
            setIsCompressing(false);
        }
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
                        {isCompressing ? (
                            <Loader2 className="w-6 h-6 animate-spin text-sage-dark" />
                        ) : (
                            <ImagePlus className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-ink-main text-sm">
                            {isCompressing ? "Compressing dough..." : isDragActive ? "Drop photos here..." : "Click to upload photos"}
                        </p>
                        <p className="text-ink-faint text-xs mt-1">or drag and drop</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
