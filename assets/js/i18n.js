/*
 * Echoes of Humanity
 * Shared language system
 */

const EchoesI18n = {
    currentLanguage: "en",

    async load(language = "en") {
        this.currentLanguage = language;

        try {
            const response = await fetch(
                `assets/i18n/${language}.json`
            );

            if (!response.ok) {
                throw new Error("Language file not found");
            }

            const translations = await response.json();

            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.dataset.i18n;
                const value = translations[key];

                if (value !== undefined) {
                    element.textContent = value;
                }
            });

        } catch (error) {
            console.warn("Echoes language system:", error);
        }
    }
};
