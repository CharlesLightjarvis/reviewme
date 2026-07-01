import { useEffect, useState } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useFlashToast();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sonner's container only exists client-side; rendering it before hydration
    // completes makes the SSR and first client render diverge.
    if (!mounted) {
        return null;
    }

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="bottom-right"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
