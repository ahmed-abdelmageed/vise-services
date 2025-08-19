
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a server
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-visa-dark mb-8">{t('contactUs')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-visa-dark mb-4">{t('contactInformation')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-visa-gold mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-visa-dark">{t('email')}</h3>
                    <p className="text-gray-600">visa@gvsksa.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-visa-gold mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-visa-dark">{t('phone')}</h3>
                    <p className="text-gray-600">053199242</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-visa-gold mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-visa-dark">{t('address')}</h3>
                    <p className="text-gray-600">
                      Global Visa Services<br />
                      123 Visa Street<br />
                      Riyadh, Saudi Arabia
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold text-visa-dark mb-4">{t('sendUsAMessage')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('fullName')}
                  </label>
                  <Input id="name" name="name" required />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')}
                  </label>
                  <Input id="email" name="email" type="email" required />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('subject')}
                  </label>
                  <Input id="subject" name="subject" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('message')}
                  </label>
                  <Textarea id="message" name="message" rows={4} required />
                </div>
                
                <Button type="submit" className="bg-visa-gold hover:bg-visa-gold/90 text-white">
                  {t('submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
