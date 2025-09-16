
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  FileQuestion, 
  Clock, 
  ThumbsUp 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface CustomerSupportProps {
  user: User;
}

export const CustomerSupport = ({ user }: CustomerSupportProps) => {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const { t, language } = useLanguage();

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the support ticket
    alert(t('supportTicketSubmitted') + ": " + ticketSubject);
    setTicketSubject("");
    setTicketMessage("");
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold text-visa-dark ${language === "ar" ? "text-right" : ""}`}>{t('customerSupport')}</h1>
      
      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-3 mb-6" dir={language === "ar" ? "rtl" : "ltr"}>
          <TabsTrigger value="contact">{t('contactUs')}</TabsTrigger>
          <TabsTrigger value="faq">{t('faqs')}</TabsTrigger>
          <TabsTrigger value="resources">{t('resources')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={language === "ar" ? "text-right" : ""}>{t('submitSupportTicket')}</CardTitle>
              <CardDescription className={language === "ar" ? "text-right" : ""}>
                {t('supportResponseTime')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className={`text-sm font-medium ${language === "ar" ? "text-right" : ""}`}>{t('subject')}</label>
                  <Input 
                    id="subject" 
                    placeholder={t('subjectPlaceholder')} 
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className={language === "ar" ? "text-right" : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className={`text-sm font-medium ${language === "ar" ? "text-right" : ""}`}>{t('message')}</label>
                  <Textarea 
                    id="message" 
                    placeholder={t('messagePlaceholder')} 
                    className={`min-h-[150px] resize-none ${language === "ar" ? "text-right" : ""}`}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-visa-gold hover:bg-visa-gold/90 w-full">
                  <MessageSquare className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('submitTicket')}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                  <Phone className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('phoneSupport')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${language === "ar" ? "text-right" : ""}`}>{t('callCustomerService')}</p>
                <p className={`font-medium mt-1 ${language === "ar" ? "text-right" : ""}`}>+1 (555) 123-4567</p>
                <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "text-right" : ""}`}>
                  {t('phoneAvailability')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                  <Mail className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('emailSupport')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${language === "ar" ? "text-right" : ""}`}>{t('sendEmail')}</p>
                <p className={`font-medium mt-1 ${language === "ar" ? "text-right" : ""}`}>support@visaservices.example.com</p>
                <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "text-right" : ""}`}>
                  {t('emailResponseTime')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                  <MessageSquare className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('liveChat')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${language === "ar" ? "text-right" : ""}`}>{t('chatWithAgents')}</p>
                <Button variant="outline" className="w-full mt-2">
                  <Send className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('startChat')}
                </Button>
                <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "text-right" : ""}`}>
                  {t('liveChatAvailability')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className={language === "ar" ? "text-right" : ""}>{t('frequentlyAskedQuestions')}</CardTitle>
              <CardDescription className={language === "ar" ? "text-right" : ""}>
                {t('faqDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className={`font-medium text-visa-dark flex items-start ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <FileQuestion className={`h-5 w-5 text-visa-gold shrink-0 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span>{t('faqQuestion1')}</span>
                  </h3>
                  <p className={`text-sm text-gray-600 mt-2 ${language === "ar" ? "text-right mr-7" : "ml-7"}`}>{t('faqAnswer1')}</p>
                </div>
                <div className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className={`font-medium text-visa-dark flex items-start ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <FileQuestion className={`h-5 w-5 text-visa-gold shrink-0 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span>{t('faqQuestion2')}</span>
                  </h3>
                  <p className={`text-sm text-gray-600 mt-2 ${language === "ar" ? "text-right mr-7" : "ml-7"}`}>{t('faqAnswer2')}</p>
                </div>
                <div className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className={`font-medium text-visa-dark flex items-start ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <FileQuestion className={`h-5 w-5 text-visa-gold shrink-0 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span>{t('faqQuestion3')}</span>
                  </h3>
                  <p className={`text-sm text-gray-600 mt-2 ${language === "ar" ? "text-right mr-7" : "ml-7"}`}>{t('faqAnswer3')}</p>
                </div>
                <div className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className={`font-medium text-visa-dark flex items-start ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <FileQuestion className={`h-5 w-5 text-visa-gold shrink-0 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span>{t('faqQuestion4')}</span>
                  </h3>
                  <p className={`text-sm text-gray-600 mt-2 ${language === "ar" ? "text-right mr-7" : "ml-7"}`}>{t('faqAnswer4')}</p>
                </div>
                <div className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className={`font-medium text-visa-dark flex items-start ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <FileQuestion className={`h-5 w-5 text-visa-gold shrink-0 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span>{t('faqQuestion5')}</span>
                  </h3>
                  <p className={`text-sm text-gray-600 mt-2 ${language === "ar" ? "text-right mr-7" : "ml-7"}`}>{t('faqAnswer5')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className={`flex justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <p className={`text-sm text-gray-500 ${language === "ar" ? "text-right" : ""}`}>
                {t('stillHaveQuestions')}
              </p>
              <Button variant="link" className="text-visa-gold p-0">{t('contactSupportTeam')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={language === "ar" ? "text-right" : ""}>{t('visaApplicationGuides')}</CardTitle>
                <CardDescription className={language === "ar" ? "text-right" : ""}>
                  {t('guidesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Clock className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('touristVisaProcess')}</span>
                  </li>
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Clock className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('businessVisaRequirements')}</span>
                  </li>
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Clock className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('workPermitDocumentation')}</span>
                  </li>
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Clock className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('studentVisaApplicationTips')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">{t('viewAllGuides')}</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === "ar" ? "text-right" : ""}>{t('documentTemplates')}</CardTitle>
                <CardDescription className={language === "ar" ? "text-right" : ""}>
                  {t('templatesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <ThumbsUp className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('coverLetterTemplate')}</span>
                  </li>
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <ThumbsUp className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('invitationLetterSample')}</span>
                  </li>
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <ThumbsUp className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('financialStatementFormat')}</span>
                  </li>
                  <li className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <ThumbsUp className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    <span className="text-sm">{t('travelItineraryTemplate')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">{t('downloadTemplates')}</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
