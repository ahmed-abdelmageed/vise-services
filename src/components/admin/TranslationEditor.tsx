
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { addTranslationKey, getTranslationKeys } from '@/utils/translation/translationKeys';
import { useLanguage } from '@/contexts/language';

const TRANSLATION_CATEGORIES = [
  { value: 'common', label: 'Common' },
  { value: 'header', label: 'Header' },
  { value: 'form', label: 'Form' },
  { value: 'service', label: 'Service' },
  { value: 'auth', label: 'Authentication' },
  { value: 'footer', label: 'Footer' },
  { value: 'adminDashboard', label: 'Admin Dashboard' },
  { value: 'clientDashboard', label: 'Client Dashboard' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'request', label: 'Request' },
  { value: 'page', label: 'Pages' },
  { value: 'customerSupport', label: 'Customer Support' },
  { value: 'login', label: 'Login' },
  { value: 'success', label: 'Success' },
];

export const TranslationEditor: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('common');
  const [translationKey, setTranslationKey] = useState('');
  const [englishValue, setEnglishValue] = useState('');
  const [arabicValue, setArabicValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingKeys, setExistingKeys] = useState<string[]>([]);

  // Load existing keys when category changes
  React.useEffect(() => {
    const keys = getTranslationKeys(selectedCategory);
    setExistingKeys(keys);
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Reset other fields
    setTranslationKey('');
    setEnglishValue('');
    setArabicValue('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!translationKey || !englishValue) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await addTranslationKey(
        selectedCategory, 
        translationKey, 
        { 
          en: englishValue, 
          ar: arabicValue || undefined // If empty, let the function auto-translate
        }
      );
      
      if (success) {
        // Reset form
        setTranslationKey('');
        setEnglishValue('');
        setArabicValue('');
        
        // Update existing keys
        setExistingKeys(prev => [...prev, translationKey]);
      }
    } catch (error) {
      console.error("Error adding translation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t('translationEditor')}</CardTitle>
        <CardDescription>
          {t('translationEditorDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">{t('category')}</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATION_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="translationKey">{t('translationKey')}</Label>
            <Input
              id="translationKey"
              value={translationKey}
              onChange={(e) => setTranslationKey(e.target.value)}
              placeholder="Enter a unique key for this translation"
              required
            />
            {existingKeys.length > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                Existing keys: {existingKeys.join(', ')}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="englishValue">{t('englishValue')}</Label>
            <Textarea
              id="englishValue"
              value={englishValue}
              onChange={(e) => setEnglishValue(e.target.value)}
              placeholder="English translation text"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="arabicValue">{t('arabicValue')}</Label>
            <Textarea
              id="arabicValue"
              value={arabicValue}
              onChange={(e) => setArabicValue(e.target.value)}
              placeholder="Arabic translation text (leave empty for auto-translation)"
              dir="rtl"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={isSubmitting || !translationKey || !englishValue}
        >
          {isSubmitting ? t('saving') : t('addTranslation')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationEditor;
