const en = require('./en');
const ar = require('./ar');

const locales = { en, ar };

function getLocalizedMessage(locale, key) {
    const [section, message] = key.split('.');
    const sectionMessages = locales[locale]?.[section];
    if (!sectionMessages) {
        console.warn(`Section ${section} not found for locale ${locale}`);
        return locales['ar'][section]?.[message] || key;
    }
    return sectionMessages[message] || locales['ar'][section]?.[message] || key;
}

module.exports = { getLocalizedMessage };
