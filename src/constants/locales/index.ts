import logger from "../../config/logger";

import en from "./en";
import fr from "./fr";

interface Translation {
  [key: string]: string;
}

interface Translations {
  [locale: string]: Translation;
}

const translations: Translations = {
  en,
  fr,
};

const locales = (key: string, locale: string = "en") => {
  if (!translations[locale]) {
    logger.error(`Locale ${locale} not found`);
    return translations["en"][key] || key;
  }

  if (!translations[locale][key]) {
    logger.error(`Translation for ${key} not found`);
    return key;
  }

  return translations[locale][key] || key;
};

export default locales