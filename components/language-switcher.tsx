"use client"

import {useState, useTransition} from "react"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {Check, Languages} from "lucide-react"

function getLocaleFromCookie() {
    if (typeof document === 'undefined') return 'en'

    return document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1] || 'en'
}

export function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition()
    const [currentLocale, setCurrentLocale] = useState(getLocaleFromCookie)

    const changeLanguage = (locale: string) => {
        startTransition(() => {
            document.cookie = `locale=${locale}; path=/; max-age=31536000`
            setCurrentLocale(locale)
            window.location.reload()
        })
    }

    const languages = {
        en: 'English',
        bn: 'বাংলা'
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending} className="gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline">{languages[currentLocale as keyof typeof languages]}</span>
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => changeLanguage('en')}
                    className="flex items-center justify-between gap-4"
                >
                    <span>English</span>
                    {currentLocale === 'en' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage('bn')}
                    className="flex items-center justify-between gap-4"
                >
                    <span>বাংলা</span>
                    {currentLocale === 'bn' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
