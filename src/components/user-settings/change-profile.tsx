'use client';

import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';
import { Image as Gallery } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import Fetch from '@/lib/fetch';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';

export default function ChangeProfilePicture() {
    const { isOpen, close } = useDialog('changePhoto');
    const aspectRatio = 1;
    const maxFileSize = 4 * 1024 * 1024;

    const updateProfile = useAuthStore((s) => s.updateProfile);

    const [loading, setLoading] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const resetState = () => {
        setImageSrc(null);
        setCrop(undefined);
        setImage(null);
        setCroppedBlob(null);
        setError(null);
        setLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetState();
        close();
    };

    const validateFile = (file: File) => {
        setError(null);

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!validTypes.includes(file.type)) {
            setError('Invalid file type');
            return false;
        }

        if (file.size > maxFileSize) {
            setError('File too large (max 4MB)');
            return false;
        }

        return true;
    };

    const processFile = (file: File) => {
        if (!validateFile(file)) return;

        const reader = new FileReader();

        reader.onload = () => {
            setImageSrc(reader.result as string);
            setCroppedBlob(null);
        };

        reader.readAsDataURL(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processFile(e.target.files[0]);
        }
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const onImageLoad = (img: HTMLImageElement) => {
        setImage(img);

        const width = Math.min(img.width, img.height) * 0.8;

        const crop = makeAspectCrop({ unit: 'px', width }, aspectRatio, img.width, img.height);

        setCrop(centerCrop(crop, img.width, img.height));
    };

    const generateCroppedImage = async (crop: PixelCrop) => {
        if (!image) return;

        const canvas = document.createElement('canvas');

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/png');
        });

        setCroppedBlob(blob);
    };

    const handleSave = async () => {
        if (!croppedBlob) return;

        setLoading(true);

        try {
            const formData = new FormData();

            const file = new File([croppedBlob], 'avatar.png', {
                type: 'image/png',
            });

            formData.append('photo', file);

            const res = await Fetch.POST('/users/photos', formData);

            if (res.success) {
                toast.success(res.message);

                updateProfile({ photo: res?.photo });

                handleClose();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className='max-h-[90vh] w-full max-w-md overflow-y-auto md:max-w-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {!imageSrc ? 'Upload image' : 'Crop image then click save'}
                    </DialogTitle>
                </DialogHeader>
                {error && <p className='text-red text-sm'>{error}</p>}
                <input type='file' ref={fileInputRef} className='hidden' onChange={onFileChange} />
                {!imageSrc ? (
                    <div
                        className={`hover:border-primary flex h-56 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors ${
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
                        <Gallery className='size-24' />
                        <span className='py-3 text-sm'>Click to upload image or drag and drop</span>
                    </div>
                ) : (
                    <>
                        <div className='w-full max-w-130'>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, c) => setCrop(c)}
                                onComplete={generateCroppedImage}
                                aspect={aspectRatio}
                                className='overflow-hidden rounded-md'
                            >
                                <Image
                                    src={imageSrc}
                                    alt='preview'
                                    width={600}
                                    height={600}
                                    onLoad={(e) => onImageLoad(e.currentTarget)}
                                    className='h-auto max-h-[60vh] w-full rounded-md object-contain'
                                />
                            </ReactCrop>
                        </div>
                        <style jsx global>{`
                            .ReactCrop__crop-selection {
                                border-radius: 9999px;
                                border: 2px solid rgba(255, 255, 255, 0.9);
                                border-style: solid;
                                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
                            }
                            .ReactCrop__crop-selection::after,
                            .ReactCrop__crop-selection::before {
                                border: none;
                                animation: none;
                            }
                        `}</style>
                    </>
                )}
                {imageSrc && (
                    <DialogFooter>
                        <>
                            <Button variant='outline' onClick={() => fileInputRef.current?.click()}>
                                Change
                            </Button>

                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
