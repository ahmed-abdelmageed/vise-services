
import React, { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Package, User, Phone, Info } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  className?: string
}

export const MobileMenu = ({ className }: MobileMenuProps) => {
  const [open, setOpen] = useState(false)
  const { t, language } = useLanguage()
  
  const menuItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: Package, label: t('services'), path: '/#services' },
    { icon: User, label: t('clientPortal'), path: '/client-dashboard' },
    { icon: Phone, label: t('contact'), path: '/contact' },
    { icon: Info, label: t('about'), path: '/about' },
  ]
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("md:hidden", className)}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[350px] pt-10">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-visa-dark">
              VISA<span className="text-visa-gold">Services</span>
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)} 
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-visa-light/50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5 text-visa-gold" />
                <span className={`${language === 'ar' ? 'mr-2' : 'ml-2'} text-visa-dark`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} VISAServices
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
