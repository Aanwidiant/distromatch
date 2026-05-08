export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='bg-background fixed bottom-0 z-20 flex w-full shrink-0 items-center border-t px-6'>
            <p className='w-full p-1.5 text-center text-xs font-light md:text-start'>
                © {currentYear} Distromatch. All Rights Reserved.
            </p>
        </footer>
    );
}
