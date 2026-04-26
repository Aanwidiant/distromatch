import { mailer } from '../lib/mailer';
import { emailTemplates, EmailTemplateKey, EmailTemplatePropsMap } from '../email-templates';

type SendEmailParams<K extends EmailTemplateKey> = {
    to: string;
    template: K;
    props: EmailTemplatePropsMap[K];
};

export const sendEmail = async <K extends EmailTemplateKey>({
    to,
    template,
    props,
}: SendEmailParams<K>) => {
    const result = emailTemplates[template](props);

    await mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: result.subject,
        html: result.html,
    });
};
