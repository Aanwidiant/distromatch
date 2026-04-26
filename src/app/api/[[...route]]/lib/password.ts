import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
}

export type PasswordStrengthResult = {
    valid: boolean;
    errors: string[];
};

export function validateStrongPassword(password: string): PasswordStrengthResult {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least 1 uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least 1 lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least 1 number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must contain at least 1 special character');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
