import { ChangeEmailProps, changeEmailTemplate } from './change-email';
import { ContactMessageProps, contactMessageTemplate } from './contact-message';
import { ResetPasswordProps, resetPasswordTemplate } from './reset-password';
import { VerifyEmailProps, verifyEmailTemplate } from './verify-email';

export type EmailTemplatePropsMap = {
    'reset-password': ResetPasswordProps;
    'verify-email': VerifyEmailProps;
    'change-email': ChangeEmailProps;
    'contact-message': ContactMessageProps;
};

export type EmailTemplateKey = keyof EmailTemplatePropsMap;

export type EmailTemplateFnMap = {
    [K in EmailTemplateKey]: (props: EmailTemplatePropsMap[K]) => {
        subject: string;
        html: string;
    };
};

export const emailTemplates: EmailTemplateFnMap = {
    'reset-password': resetPasswordTemplate,
    'verify-email': verifyEmailTemplate,
    'change-email': changeEmailTemplate,
    'contact-message': contactMessageTemplate,
};
