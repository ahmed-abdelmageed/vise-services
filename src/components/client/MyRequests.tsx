
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

export const MyRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { t, language } = useLanguage();

  // Mock data for requests
  const requests = [
    {
      id: "REQ-2023-042",
      title: t('documentClarification'),
      description: t('documentClarificationDesc'),
      status: "Resolved",
      createdAt: "2023-09-15",
      updatedAt: "2023-09-18",
      responses: [
        {
          from: "Support Agent",
          message: "We've reviewed your application and all necessary documents are listed in the application portal. Please check the 'Required Documents' section.",
          timestamp: "2023-09-16 14:30"
        },
        {
          from: "You",
          message: "Thank you, I've found the list. Just to confirm, do I need to provide originals or will copies suffice?",
          timestamp: "2023-09-17 09:15"
        },
        {
          from: "Support Agent",
          message: "For the initial application, certified copies are acceptable. However, please be prepared to present original documents during your interview if requested.",
          timestamp: "2023-09-18 11:45"
        }
      ]
    },
    {
      id: "REQ-2023-045",
      title: t('visaStatusInquiry'),
      description: t('visaStatusInquiryDesc'),
      status: "In Progress",
      createdAt: "2023-10-25",
      updatedAt: "2023-10-29",
      responses: [
        {
          from: "Support Agent",
          message: "Thank you for your inquiry. I've checked your application status and it's currently under review by the embassy. This typically takes 3-4 weeks, so you're still within the normal processing timeframe.",
          timestamp: "2023-10-27 10:20"
        },
        {
          from: "You",
          message: "Thanks for checking. Is there anything else I need to provide to expedite the process?",
          timestamp: "2023-10-28 15:45"
        },
        {
          from: "Support Agent",
          message: "We've reached out to our embassy contact and are awaiting their response. We'll update you as soon as we have more information.",
          timestamp: "2023-10-29 09:30"
        }
      ]
    },
    {
      id: "REQ-2023-048",
      title: t('additionalDocumentSubmission'),
      description: t('additionalDocumentSubmissionDesc'),
      status: "Pending",
      createdAt: "2023-10-30",
      updatedAt: "2023-10-30",
      responses: []
    }
  ];

  // Filter requests based on active tab
  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(request => {
        if (activeTab === "active") return ["Pending", "In Progress"].includes(request.status);
        if (activeTab === "resolved") return request.status === "Resolved";
        return true;
      });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className={`h-3 w-3 ${language === "ar" ? "ml-1" : "mr-1"}`} /> {t('pending')}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <AlertCircle className={`h-3 w-3 ${language === "ar" ? "ml-1" : "mr-1"}`} /> {t('inProgress')}
          </Badge>
        );
      case "Resolved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className={`h-3 w-3 ${language === "ar" ? "ml-1" : "mr-1"}`} /> {t('resolved')}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={`flex justify-between items-center ${language === "ar" ? "flex-row-reverse" : ""}`}>
        <h1 className={`text-2xl font-bold text-visa-dark ${language === "ar" ? "text-right" : "text-left"}`}>{t('myRequests')}</h1>
        <Button className="bg-visa-gold hover:bg-visa-gold/90">
          <PlusCircle className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('newRequest')}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6" dir={language === "ar" ? "rtl" : "ltr"}>
          <TabsTrigger value="all">{t('allRequests')}</TabsTrigger>
          <TabsTrigger value="active">{t('activeRequests')}</TabsTrigger>
          <TabsTrigger value="resolved">{t('resolvedRequests')}</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className={`flex justify-between items-start ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <div className={language === "ar" ? "text-right" : "text-left"}>
                    <CardTitle className={language === "ar" ? "text-right" : "text-left"}>{request.title}</CardTitle>
                    <CardDescription className={`mt-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {t('requestId')}: {request.id} • {t('created')}: {request.createdAt}
                    </CardDescription>
                  </div>
                  {renderStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm text-gray-700 mb-4 ${language === "ar" ? "text-right" : "text-left"}`}>{request.description}</p>
                
                {request.responses.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className={`font-medium ${language === "ar" ? "text-right" : "text-left"}`}>{t('conversation')}</h3>
                    {request.responses.map((response, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        response.from === "You" 
                          ? `bg-blue-50 ${language === "ar" ? "mr-8" : "ml-8"}` 
                          : `bg-gray-50 ${language === "ar" ? "ml-8" : "mr-8"}`
                      }`}>
                        <div className={`flex justify-between items-center mb-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                          <span className="font-medium text-sm">{response.from === "You" ? t('you') : t('supportAgent')}</span>
                          <span className="text-xs text-gray-500">{response.timestamp}</span>
                        </div>
                        <p className={`text-sm ${language === "ar" ? "text-right" : "text-left"}`}>{response.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {["Pending", "In Progress"].includes(request.status) && (
                <CardFooter>
                  <div className="w-full space-y-3">
                    <Textarea 
                      placeholder={t('addReplyPlaceholder')} 
                      className={`resize-none ${language === "ar" ? "text-right" : "text-left"}`}
                      dir={language === "ar" ? "rtl" : "ltr"}
                    />
                    <div className={`flex ${language === "ar" ? "justify-start" : "justify-end"}`}>
                      <Button className="bg-visa-gold hover:bg-visa-gold/90">
                        <MessageSquare className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('sendReply')}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </Tabs>
      
      {filteredRequests.length === 0 && (
        <div className={`text-center py-10 ${language === "ar" ? "text-right" : "text-left"}`}>
          <p className="text-gray-500">{t('noRequestsFound')}</p>
        </div>
      )}
    </div>
  );
};
