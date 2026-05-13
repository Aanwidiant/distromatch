'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function ContactSection() {
    const t = useTranslations('about.contactSection');
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
            toast.error(t('toast.development'));
        } catch {
            toast.error(t('toast.development'));
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
                <h2 className='text-2xl font-semibold'>{t('title')}</h2>
                <p className='text-sm'>{t('description')} </p>
            </div>
            <form onSubmit={handleSubmit} className='grid gap-6 md:grid-cols-[1fr_2fr]'>
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>{t('fields.name.label')}</label>
                        <Input name='name' placeholder={t('fields.name.placeholder')} required />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>{t('fields.email.label')}</label>
                        <Input
                            type='email'
                            name='email'
                            placeholder={t('fields.email.placeholder')}
                            required
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                            {t('fields.phone.label')} <span>{t('fields.phone.optional')}</span>
                        </label>
                        <Input name='phone' placeholder={t('fields.phone.placeholder')} />
                    </div>
                </div>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>{t('fields.message.label')}</label>
                    <Textarea
                        name='message'
                        placeholder={t('fields.message.placeholder')}
                        rows={8}
                        required
                    />
                </div>
                <div className='flex justify-end md:col-span-2'>
                    <Button type='submit' disabled={loading}>
                        {loading ? t('button.loading') : t('button.submit')}
                    </Button>
                </div>
            </form>
        </section>
    );
}
