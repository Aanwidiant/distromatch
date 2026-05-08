import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ImageUp } from 'lucide-react';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';

type LogoDistroProps = {
    id: number;
    onChanged?: () => void;
};

export default function LogoDistro({ id, onChanged }: LogoDistroProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const resetState = () => {
        setFile(null);
        setPreviewUrl(null);
        setIsDragging(false);
        setLoading(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) resetState();
    };

    const setFileWithPreview = (nextFile: File | null) => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        if (!nextFile) {
            setFile(null);
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(nextFile);
        setFile(nextFile);
        setPreviewUrl(url);
    };

    const validateAndSetFile = (nextFile?: File | null) => {
        if (!nextFile) return;
        if (nextFile.type !== 'image/svg+xml') {
            toast.error('Logo must be an SVG file.');
            return;
        }
        setFileWithPreview(nextFile);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextFile = e.target.files?.[0] ?? null;
        validateAndSetFile(nextFile);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const nextFile = e.dataTransfer.files?.[0] ?? null;
        validateAndSetFile(nextFile);
    };

    const handleSave = async () => {
        if (!file) {
            toast.error('Please select an SVG logo first.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('logo', file);

            const res = await Fetch.POST(`/distros/logo/${id}`, formData);

            if (res.success) {
                toast.success(res.message || 'Logo updated successfully!');
                onChanged?.();
                setOpen(false);
            } else {
                toast.error(res.message || 'Failed to update logo.');
            }
        } catch {
            toast.error('Failed to update logo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size='icon'>
                    <ImageUp />
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full max-w-xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <ImageUp className='size-5' />
                        Change Logo
                    </DialogTitle>
                </DialogHeader>

                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/svg+xml'
                    className='hidden'
                    onChange={onFileChange}
                />

                {!previewUrl ? (
                    <div
                        className={`hover:border-primary flex aspect-square w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors ${
                            isDragging ? 'border-primary bg-muted' : ''
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                fileInputRef.current?.click();
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        role='button'
                        tabIndex={0}
                    >
                        <ImageUp className='size-16' />
                        <p className='mt-3 text-sm'>Click to upload or drag and drop</p>
                        <p className='text-muted-foreground text-xs'>SVG only • Square (1:1)</p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        <div className='bg-muted flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt='Logo preview'
                                className='h-full w-full object-contain'
                            />
                        </div>
                        <div className='text-muted-foreground text-xs'>
                            {file?.name} {file?.size ? `• ${(file.size / 1024).toFixed(1)} KB` : ''}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                    >
                        {previewUrl ? 'Change File' : 'Choose File'}
                    </Button>
                    <Button onClick={handleSave} disabled={loading || !file}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
