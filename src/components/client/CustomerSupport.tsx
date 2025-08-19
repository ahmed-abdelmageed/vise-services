
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

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the support ticket
    alert("Support ticket submitted: " + ticketSubject);
    setTicketSubject("");
    setTicketMessage("");
  };

  // Mock FAQs
  const faqs = [
    {
      question: "How long does the visa application process take?",
      answer: "The processing time varies depending on the visa type and country. Typically, tourist visas take 2-4 weeks, business visas 3-5 weeks, and work visas 1-3 months. We recommend applying at least 8 weeks before your planned travel date."
    },
    {
      question: "What documents do I need for a tourist visa application?",
      answer: "Generally, you'll need a valid passport, completed application form, passport-sized photos, proof of accommodation, return flight tickets, proof of sufficient funds, and travel insurance. Specific requirements may vary by country."
    },
    {
      question: "Can I expedite my visa application?",
      answer: "Yes, many countries offer expedited processing for an additional fee. The expedited service typically reduces processing time by 50%. Please contact our support team for details on expedited services for your specific destination."
    },
    {
      question: "What if my visa application is rejected?",
      answer: "If your application is rejected, we'll help you understand the reasons and advise on the best course of action. Depending on the circumstances, you may be able to appeal the decision or reapply with additional documentation."
    },
    {
      question: "Do you offer refunds if my visa is denied?",
      answer: "Our service fees cover the processing of your application regardless of the outcome. However, we offer a 50% refund of our service fee (excluding embassy fees) if your application is denied despite following all our recommendations."
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-visa-dark">Customer Support</h1>
      
      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                We typically respond to support tickets within 24 hours during business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input 
                    id="subject" 
                    placeholder="Briefly describe your issue" 
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Please provide details about your issue or question" 
                    className="min-h-[150px]" 
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-visa-gold hover:bg-visa-gold/90 w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-visa-gold" /> Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Call our customer service team:</p>
                <p className="font-medium mt-1">+1 (555) 123-4567</p>
                <p className="text-xs text-gray-500 mt-2">
                  Available Monday-Friday, 9am-5pm EST
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-visa-gold" /> Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Send us an email at:</p>
                <p className="font-medium mt-1">support@visaservices.example.com</p>
                <p className="text-xs text-gray-500 mt-2">
                  We aim to respond within 24 hours
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-visa-gold" /> Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Chat with our support agents:</p>
                <Button variant="outline" className="w-full mt-2">
                  <Send className="h-4 w-4 mr-2" /> Start Chat
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Available 24/7 for premium clients
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions about our visa services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium text-visa-dark flex items-start">
                      <FileQuestion className="h-5 w-5 mr-2 text-visa-gold shrink-0" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 ml-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">
                Still have questions?
              </p>
              <Button variant="link" className="text-visa-gold p-0">Contact our support team</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visa Application Guides</CardTitle>
                <CardDescription>
                  Step-by-step guides for different visa types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Tourist Visa Application Process</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Business Visa Requirements</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Work Permit Documentation</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Student Visa Application Tips</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Guides</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
                <CardDescription>
                  Download useful templates for your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Cover Letter Template</span>
                  </li>
                  <li className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Invitation Letter Sample</span>
                  </li>
                  <li className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Financial Statement Format</span>
                  </li>
                  <li className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-visa-gold" />
                    <span className="text-sm">Travel Itinerary Template</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Download Templates</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
