import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { POPULAR_COUNTRIES } from "@/data/flags";
import { useLanguage } from "@/contexts/LanguageContext";

interface Country {
  code: string;
  name: string;
  flagUrl: string;
}

interface FlagDropdownProps {
  currentFlag?: string;
  onFlagSelected: (flagUrl: string) => void;
}

export const FlagDropdown = ({
  currentFlag,
  onFlagSelected,
}: FlagDropdownProps) => {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Generate flag URLs for popular countries using flagcdn API
    const countriesWithFlags = POPULAR_COUNTRIES.map((country) => ({
      ...country,
      flagUrl: `https://flagcdn.com/w80/${country.code}.png`,
    }));

    setCountries(countriesWithFlags);
    setFilteredCountries(countriesWithFlags);
  }, []);

  useEffect(() => {
    // Filter countries based on search query
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  useEffect(() => {
    // Find the selected country based on current flag URL
    if (currentFlag) {
      const country = countries.find((c) => c.flagUrl === currentFlag);
      if (country) {
        setSelectedCountry(country.code);
      }
    }
  }, [currentFlag, countries]);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      onFlagSelected(country.flagUrl);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getSelectedCountryName = () => {
    const country = countries.find((c) => c.code === selectedCountry);
    return country?.name || "Select a country";
  };

  const getSelectedFlagUrl = () => {
    const country = countries.find((c) => c.code === selectedCountry);
    return country?.flagUrl;
  };

  return (
    <div className="space-y-2">
      <Select 
        value={selectedCountry} 
        onValueChange={handleCountrySelect}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            {getSelectedFlagUrl() && (
              <img
                src={getSelectedFlagUrl()}
                alt="Selected flag"
                className="w-6 h-4 object-cover rounded"
              />
            )}
            <SelectValue placeholder={t('selectCountry')}>
              {getSelectedCountryName()}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchCountries')}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <img
                      src={country.flagUrl}
                      alt={`${country.name} flag`}
                      className="w-6 h-4 object-cover rounded"
                    />
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No countries found
              </div>
            )}
          </div>
        </SelectContent>
      </Select>

      {getSelectedFlagUrl() && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Preview:</span>
          <img
            src={getSelectedFlagUrl()}
            alt="Flag preview"
            className="w-10 h-6 object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
};
