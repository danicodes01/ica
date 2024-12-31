import { LANGUAGE_VERSIONS } from "@/app/constants/editor";
import { SupportedLanguage } from "@/app/types/editor";

const languages = Object.entries(LANGUAGE_VERSIONS);

interface LanguageSelectorProps {
    language: SupportedLanguage;
    onSelect: (language: SupportedLanguage) => void;
  }

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  return (
    <div className="mb-4 ml-2">
      <label htmlFor="language-selector" className="block text-base mb-2">
        Language:
      </label>
      <select
        id="language-selector"
        value={language}
        onChange={(e) => onSelect(e.target.value as SupportedLanguage)}
        className="bg-[#110c1b] text-white border border-gray-300 p-2 rounded text-base"
      >
        {languages.map(([lang, version]) => (
          <option key={lang} value={lang}>
            {lang} ({version})
          </option>
        ))}
      </select>
    </div>
  );
};