export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='border-gray bg-light fixed bottom-0 z-20 flex w-full items-center border-t px-6'>
            <p className='w-full p-2 text-center text-sm md:text-start'>
                © {currentYear} Distromatch. All Rights Reserved.
            </p>
        </footer>
    );
}
