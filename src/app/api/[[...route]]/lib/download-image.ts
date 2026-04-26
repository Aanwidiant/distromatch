export async function downloadImage(url: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();

    return new File([blob], 'avatar.png', { type: blob.type });
}
