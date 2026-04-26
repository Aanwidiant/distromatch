import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.SUPABASE_S3_BUCKET!;

export const s3 = new S3Client({
    region: process.env.SUPABASE_S3_REGION!,
    endpoint: process.env.SUPABASE_S3_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY!,
        secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY!,
    },
});

function buildS3Key(folder: string, filename: string) {
    return `${folder}/${filename}`;
}

export async function s3CreateDocument(file: File, folder: string = 'uploads') {
    const ext = file.name.split('.').pop() || 'bin';

    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const key = buildS3Key(folder, filename);

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    );

    return {
        filename,
        key,
    };
}

export async function s3DeleteDocument(folder: string, filename: string) {
    const key = buildS3Key(folder, filename);

    await s3.send(
        new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        })
    );
}
