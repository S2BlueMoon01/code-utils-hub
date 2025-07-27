'use client'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageStore, Language } from '@/stores/languageStore'
import { Globe } from 'lucide-react'

const languageNames: Record<Language, string> = {
  en: 'English',
  vi: 'Tiếng Việt'
}

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  vi: '🇻🇳'
}

export function LanguageSwitcher() {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguageStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => changeLanguage(language)}
            className={currentLanguage === language ? 'bg-accent' : ''}
          >
            <span className="mr-2">{languageFlags[language]}</span>
            {languageNames[language]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
