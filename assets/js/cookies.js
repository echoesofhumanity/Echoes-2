/*
 * Echoes of Humanity
 * Cookie Consent System
 *
 * Essential functionality is always available.
 * Non-essential cookies are disabled until consent is given.
 */

(function () {
    "use strict";

    const STORAGE_KEY = "echoes_cookie_consent";

    const defaultConsent = {
        essential: true,
        analytics: false,
        preferences: false
    };

    function getConsent() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return null;
            }

            return {
                ...defaultConsent,
                ...JSON.parse(saved)
            };
        } catch (error) {
            console.warn("Echoes cookie consent:", error);
            return null;
        }
    }

    function saveConsent(consent) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                ...defaultConsent,
                ...consent
            })
        );

        applyConsent();
    }

    function applyConsent() {
        const consent = getConsent();

        if (!consent) {
            return;
        }

        document.documentElement.dataset.cookieAnalytics =
            consent.analytics ? "allowed" : "denied";

        document.documentElement.dataset.cookiePreferences =
            consent.preferences ? "allowed" : "denied";

        /*
         * Future analytics or preference scripts
         * will be initialized here only when consent exists.
         */
    }

    function createBanner() {
        if (document.getElementById("echoesCookieBanner")) {
            return;
        }

        const banner = document.createElement("div");

        banner.id = "echoesCookieBanner";

        banner.innerHTML = `
            <div class="echoes-cookie-inner">

                <div class="echoes-cookie-content">
                    <div class="echoes-cookie-title">
                        Your Privacy Matters
                    </div>

                    <p>
                        We use essential technologies to keep Echoes of Humanity
                        working properly. Optional technologies help us understand
                        how the site is used and improve your experience.
                    </p>
                </div>

                <div class="echoes-cookie-actions">
                    <button
                        type="button"
                        class="echoes-cookie-btn echoes-cookie-accept"
                        data-cookie-accept>
                        Accept Optional
                    </button>

                    <button
                        type="button"
                        class="echoes-cookie-btn echoes-cookie-essential"
                        data-cookie-essential>
                        Essential Only
                    </button>

                    <button
                        type="button"
                        class="echoes-cookie-settings"
                        data-cookie-settings>
                        Cookie Settings
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(banner);

        banner
            .querySelector("[data-cookie-accept]")
            .addEventListener("click", function () {
                saveConsent({
                    analytics: true,
                    preferences: true
                });

                closeBanner();
            });

        banner
            .querySelector("[data-cookie-essential]")
            .addEventListener("click", function () {
                saveConsent({
                    analytics: false,
                    preferences: false
                });

                closeBanner();
            });

        banner
            .querySelector("[data-cookie-settings]")
            .addEventListener("click", function () {
                openSettings();
            });
    }

    function closeBanner() {
        const banner = document.getElementById("echoesCookieBanner");

        if (banner) {
            banner.remove();
        }
    }

    function openSettings() {
        let panel = document.getElementById("echoesCookieSettings");

        if (panel) {
            panel.remove();
            return;
        }

        const consent = getConsent() || defaultConsent;

        panel = document.createElement("div");

        panel.id = "echoesCookieSettings";

        panel.innerHTML = `
            <div class="echoes-cookie-settings-panel">

                <div class="echoes-cookie-settings-header">
                    <div>
                        <span class="echoes-cookie-label">
                            PRIVACY
                        </span>

                        <h2>Cookie Settings</h2>
                    </div>

                    <button
                        type="button"
                        class="echoes-cookie-close"
                        data-cookie-close>
                        ×
                    </button>
                </div>

                <div class="echoes-cookie-option">
                    <div>
                        <strong>Essential</strong>
                        <p>
                            Required for the basic operation and security
                            of the website.
                        </p>
                    </div>

                    <span class="echoes-cookie-required">
                        Always On
                    </span>
                </div>

                <label class="echoes-cookie-option">
                    <div>
                        <strong>Analytics</strong>
                        <p>
                            Helps us understand anonymous site usage
                            and improve the experience.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        data-cookie-analytics
                        ${consent.analytics ? "checked" : ""}>
                </label>

                <label class="echoes-cookie-option">
                    <div>
                        <strong>Preferences</strong>
                        <p>
                            Allows the site to remember optional
                            preferences.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        data-cookie-preferences
                        ${consent.preferences ? "checked" : ""}>
                </label>

                <button
                    type="button"
                    class="echoes-cookie-save"
                    data-cookie-save>
                    Save Preferences
                </button>

            </div>
        `;

        document.body.appendChild(panel);

        panel
            .querySelector("[data-cookie-close]")
            .addEventListener("click", function () {
                panel.remove();
            });

        panel
            .querySelector("[data-cookie-save]")
            .addEventListener("click", function () {
                saveConsent({
                    analytics: panel.querySelector(
                        "[data-cookie-analytics]"
                    ).checked,

                    preferences: panel.querySelector(
                        "[data-cookie-preferences]"
                    ).checked
                });

                panel.remove();
                closeBanner();
            });
    }

    function initialize() {
        applyConsent();

        if (!getConsent()) {
            createBanner();
        }
    }

    window.EchoesCookies = {
        getConsent,
        saveConsent,
        openSettings,
        reset: function () {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();
