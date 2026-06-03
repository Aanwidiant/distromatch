import { mailer } from '../lib/mailer';
import { emailTemplates, EmailTemplateKey, EmailTemplatePropsMap } from '../email-templates';

type SendEmailParams<K extends EmailTemplateKey> = {
    to: string;
    template: K;
    props: EmailTemplatePropsMap[K];
    replyTo?: string;
};

export const sendEmail = async <K extends EmailTemplateKey>({
    to,
    template,
    props,
    replyTo,
}: SendEmailParams<K>) => {
    const result = emailTemplates[template](props);

    await mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        replyTo,
        subject: result.subject,
        html: result.html,
    });
};
