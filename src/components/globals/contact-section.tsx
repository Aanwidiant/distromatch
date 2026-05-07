'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ContactSection() {
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
            alert(payload);

            toast.success('Pesan berhasil dikirim 🚀');
            e.currentTarget.reset();
        } catch {
            toast.error('Gagal mengirim pesan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='space-y-6 border-t pt-12'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-semibold'>Kirim Pesan</h2>
                <p className='text-muted-foreground text-sm'>
                    Punya pertanyaan, saran, atau feedback? Kirimkan pesanmu di sini.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='grid gap-4 md:grid-cols-2'>
                {/* NAME */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Nama</label>
                    <Input name='name' placeholder='Nama kamu' required />
                </div>

                {/* EMAIL */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Email</label>
                    <Input type='email' name='email' placeholder='email@example.com' required />
                </div>

                {/* PHONE (OPTIONAL) */}
                <div className='space-y-2 md:col-span-2'>
                    <label className='text-sm font-medium'>
                        Nomor HP <span className='text-muted-foreground'>(opsional)</span>
                    </label>
                    <Input name='phone' placeholder='+62 812 xxxx xxxx' />
                </div>

                {/* MESSAGE */}
                <div className='space-y-2 md:col-span-2'>
                    <label className='text-sm font-medium'>Pesan</label>
                    <Textarea
                        name='message'
                        placeholder='Tulis pesan kamu di sini...'
                        rows={5}
                        required
                    />
                </div>

                {/* BUTTON */}
                <div className='flex justify-end md:col-span-2'>
                    <Button type='submit' disabled={loading}>
                        {loading ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                </div>
            </form>
        </section>
    );
}
