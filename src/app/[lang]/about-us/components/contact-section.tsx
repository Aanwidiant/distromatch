'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactSection() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        const payload = {
            name: form.get('name'),
            email: form.get('email'),
            phone: form.get('phone'),
            message: form.get('message'),
        };

        try {
            void payload;
            toast.error('Maaf, sedang dalam proses development');
        } catch {
            toast.error('Maaf, sedang dalam proses development');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id='messages'
            className='bg-bg-2 mx-auto max-w-4xl scroll-mt-32 space-y-6 rounded-2xl p-6'
        >
            <div className='space-y-2'>
                <h2 className='text-2xl font-semibold'>Kirim Pesan</h2>
                <p className='text-sm'>
                    Punya pertanyaan, saran, atau feedback? Kirimkan pesanmu di sini.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='grid gap-6 md:grid-cols-[1fr_2fr]'>
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Nama</label>
                        <Input name='name' placeholder='Nama kamu' required />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Email</label>
                        <Input type='email' name='email' placeholder='email@example.com' required />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                            Nomor HP <span>(opsional)</span>
                        </label>
                        <Input name='phone' placeholder='+62 812 xxxx xxxx' />
                    </div>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Pesan</label>
                    <Textarea
                        name='message'
                        placeholder='Tulis pesan kamu di sini...'
                        rows={8}
                        required
                    />
                </div>

                <div className='flex justify-end md:col-span-2'>
                    <Button type='submit' disabled={loading}>
                        {loading ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                </div>
            </form>
        </section>
    );
}
