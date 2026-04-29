(function () {
    const doc = document;

    const DEFAULT_CONFIG = {
        theme: 'modern',         // 'modern' | 'sidebar' | 'dark' | 'compact'
        position: 'bottom-right',// 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'mid-right' | 'mid-left'
        primaryColor: '#0D6EFD',
        defaultLang: 'he',       // 'he' | 'en'
        maxTextZoomPercent: 200,
        minTextZoomPercent: 50,
        creditText: 'Accessibility by Meir Zano',
        iconType: 'person', // 'wheelchair' | 'human' | 'eye' | 'person' 
        iconStyle: 'default', // 'default' | 'outline' | 'square' | 'glow' | 'tab'
        pro: false,
        scriptCSS: {}
    };

    const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.mzAccessibilityConfig || {});

    const MAX_FONT_MULT = CONFIG.maxTextZoomPercent / 100;
    const MIN_FONT_MULT = CONFIG.minTextZoomPercent / 100;

    const translations = {
        he: {
            title: "נגישות", speech: "הקראה", magnifier: "זכוכית מגדלת",
            fontUp: "הגדל טקסט", fontDown: "הקטן טקסט", contrast: "ניגודיות",
            grayscale: "שחור לבן", invert: "היפוך צבעים", anim: "עצירת אנימציה",
            media: "הסרת מדיה", highlightLinks: "הדגשת קישורים", readableFont: "גופן קריא",
            textSpacing: "ריווח טקסט", reset: "איפוס הגדרות", zoom: "טקסט מוגדל:", langToggle: "English"
        },
        en: {
            title: "Accessibility", speech: "Read Aloud", magnifier: "Magnifier",
            fontUp: "Increase Text", fontDown: "Decrease Text", contrast: "Contrast",
            grayscale: "Grayscale", invert: "Invert Colors", anim: "Stop Animations",
            media: "Hide Media", highlightLinks: "Highlight Links", readableFont: "Readable Font",
            textSpacing: "Text Spacing", reset: "Reset Settings", zoom: "Text Zoom:", langToggle: "עברית"
        }
    };

    const iconPaths = {
        speech: '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
        magnifier: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>',
        fontUp: '<svg viewBox="0 0 24 24"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path><path d="M20 12h-4"></path><path d="M18 10v4"></path></svg>',
        fontDown: '<svg viewBox="0 0 24 24"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path><path d="M20 12h-4"></path></svg>',
        contrast: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 18a6 6 0 0 0 0-12v12z"></path></svg>',
        grayscale: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="3" x2="21" y2="21"></line></svg>',
        invert: '<svg viewBox="0 0 24 24"><path d="M16 4h4v4"></path><path d="M20 4l-6.12 6.12"></path><path d="M8.12 13.88L2 20h4v4"></path><path d="M13 22l9-9"></path><path d="M2 13l9-9"></path></svg>',
        anim: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="14" y2="15"></line><line x1="10" y1="11" x2="14" y2="11"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>',
        media: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline><line x1="3" y1="3" x2="21" y2="21"></line></svg>',
        highlightLinks: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
        readableFont: '<svg viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
        textSpacing: '<svg viewBox="0 0 24 24"><polyline points="18 16 22 12 18 8"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" y1="12" x2="22" y2="12"></line></svg>',
        reset: '<svg viewBox="0 0 24 24"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
        wheelchair: '<svg viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><circle cx="18" cy="4" r="2"></circle><path d="m17.836 12.014-4.345.725 3.29-4.113a1 1 0 0 0-.227-1.457l-6-4a.999.999 0 0 0-1.262.125l-4 4 1.414 1.414 3.42-3.42 2.584 1.723-2.681 3.352a5.913 5.913 0 0 0-5.5.752l1.451 1.451A3.972 3.972 0 0 1 8 12c2.206 0 4 1.794 4 4 0 .739-.216 1.425-.566 2.02l1.451 1.451A5.961 5.961 0 0 0 14 16c0-.445-.053-.878-.145-1.295L17 14.181V20h2v-7a.998.998 0 0 0-1.164-.986zM8 20c-2.206 0-4-1.794-4-4 0-.739.216-1.425.566-2.02l-1.451-1.451A5.961 5.961 0 0 0 2 16c0 3.309 2.691 6 6 6 1.294 0 2.49-.416 3.471-1.115l-1.451-1.451A3.972 3.972 0 0 1 8 20z"></path></g></svg>',
        human: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path><path d="M8 12h8"></path></svg>',
        eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
        person: '<svg viewBox="0 0 512 512"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M256,112a56,56,0,1,1,56-56A56.06,56.06,0,0,1,256,112Z"></path><path d="M432,112.8l-.45.12h0l-.42.13c-1,.28-2,.58-3,.89-18.61,5.46-108.93,30.92-172.56,30.92-59.13,0-141.28-22-167.56-29.47a73.79,73.79,0,0,0-8-2.58c-19-5-32,14.3-32,31.94,0,17.47,15.7,25.79,31.55,31.76v.28l95.22,29.74c9.73,3.73,12.33,7.54,13.6,10.84,4.13,10.59.83,31.56-.34,38.88l-5.8,45L150.05,477.44q-.15.72-.27,1.47l-.23,1.27h0c-2.32,16.15,9.54,31.82,32,31.82,19.6,0,28.25-13.53,32-31.94h0s28-157.57,42-157.57,42.84,157.57,42.84,157.57h0c3.75,18.41,12.4,31.94,32,31.94,22.52,0,34.38-15.74,32-31.94-.21-1.38-.46-2.74-.76-4.06L329,301.27l-5.79-45c-4.19-26.21-.82-34.87.32-36.9a1.09,1.09,0,0,0,.08-.15c1.08-2,6-6.48,17.48-10.79l89.28-31.21a16.9,16.9,0,0,0,1.62-.52c16-6,32-14.3,32-31.93S451,107.81,432,112.8Z"></path></g></svg>',
    };

    const svgLibrary = Object.keys(iconPaths).map(key =>
        `<symbol id="mz-icon-${key}" viewBox="0 0 24 24">${iconPaths[key]}</symbol>`
    ).join('');

    let iconPosCss = '';
    let menuPosCss = '';
    let transformOrigin = '';
    const isLeft = CONFIG.position.includes('left');

    switch (CONFIG.position) {
        case 'top-right': iconPosCss = 'top: 30px; right: 30px;'; menuPosCss = 'top: 105px; right: 30px;'; transformOrigin = 'top right'; break;
        case 'top-left': iconPosCss = 'top: 30px; left: 30px;'; menuPosCss = 'top: 105px; left: 30px;'; transformOrigin = 'top left'; break;
        case 'mid-right': iconPosCss = 'top: calc(50vh - 30px); right: 30px;'; menuPosCss = 'top: calc(50vh - 200px); right: 105px;'; transformOrigin = 'right center'; break;
        case 'mid-left': iconPosCss = 'top: calc(50vh - 30px); left: 30px;'; menuPosCss = 'top: calc(50vh - 200px); left: 105px;'; transformOrigin = 'left center'; break;
        case 'bottom-left': iconPosCss = 'bottom: 30px; left: 30px;'; menuPosCss = 'bottom: 105px; left: 30px;'; transformOrigin = 'bottom left'; break;
        case 'bottom-right':
        default: iconPosCss = 'bottom: 30px; right: 30px;'; menuPosCss = 'bottom: 105px; right: 30px;'; transformOrigin = 'bottom right'; break;
    }

    doc.documentElement.style.setProperty('--mz-primary', CONFIG.primaryColor);

    const styleElem = doc.createElement("style");
    styleElem.innerHTML = `
:root {
    --mz-bg: #ffffff;
    --mz-btn-bg: #f0f2f5;
    --mz-text: #212529;
    --mz-danger: #dc3545;
    --mz-border: #dee2e6;
}


#mz_accessibility-icon:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

#mz_accessibility-menu {
    position: fixed;
    ${menuPosCss}
    background: var(--mz-bg);
    border: 1px solid var(--mz-border);
    padding: 24px;
    border-radius: 20px;
    width: auto;
    z-index: 1000000;
    box-shadow: 0 10px 40px rgba(0, 0, 0, .2);
    max-height: 80vh;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transform: scale(.8);

    transform-origin: ${transformOrigin};

    transition: all .3s cubic-bezier(.175, .885, .32, 1.275);
}

#mz_accessibility-menu.open {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
}

#mz_accessibility-menu.mz-theme-sidebar {
    bottom: 0 !important;
    top: 0 !important;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    border: none;
    padding-top: 30px;

    ${isLeft ? 'left: 0 !important; right: auto !important; box-shadow: 5px 0 25px rgba(0,0,0,.15); transform: translateX(-100%);' : 'right: 0 !important; left: auto !important; box-shadow: -5px 0 25px rgba(0,0,0,.15); transform: translateX(100%);'}
}

#mz_accessibility-menu.mz-theme-sidebar.open {
    transform: translateX(0);
}

#mz_accessibility-menu.mz-theme-dark {
    --mz-bg: #212529;
    --mz-btn-bg: #343a40;
    --mz-text: #f8f9fa;
    --mz-border: #495057;
    box-shadow: 0 10px 40px rgba(0, 0, 0, .6);
}

#mz_accessibility-menu.mz-theme-compact {
    width: 280px;
    max-height: 65vh;
    padding: 20px;
}

#mz_accessibility-menu.mz-theme-compact .mz-grid {
    grid-template-columns: 1fr;
}

#mz_accessibility-menu.mz-theme-compact button.mz-feature-btn {
    flex-direction: row;
    min-height: 60px;
    justify-content: flex-start;
    padding: 0 20px;
    text-align: start;
}

.mz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--mz-border);
    padding-bottom: 12px;
}

.mz-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--mz-text);
    font-weight: 700;
}

.mz-close-btn {
    background: #ff342029;
    color: var(--mz-danger);
    border: none;
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: .2s;
}

.mz-close-btn:hover {
    background: var(--mz-danger);
    color: #fff;
}

.mz-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

#mz_accessibility-menu button.mz-feature-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100px;
    padding: 15px 10px;
    cursor: pointer;
    border: 2px solid transparent;
    background: var(--mz-btn-bg);
    color: var(--mz-text);
    border-radius: 14px;
    transition: all .2s ease;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    gap: 10px;
}

#mz_accessibility-menu .mz-zoom-container .mz-zoom-controls .mz-feature-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 60px;
    padding: 10px;
    cursor: pointer;
    border: 2px solid transparent;
    background: var(--mz-btn-bg);
    color: var(--mz-text);
    border-radius: 14px;
    transition: all .2s ease;
}

#mz_accessibility-menu button.mz-feature-btn .mz-icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

#mz_accessibility-menu button.mz-feature-btn svg {
    width: 2rem;
    height: 2rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

#mz_accessibility-menu button.mz-feature-btn:hover {
    filter: brightness(0.95);
}

#mz_accessibility-menu button.mz-feature-btn.active {
    background-color: var(--mz-primary);
    color: #fff;
    border-color: var(--mz-primary);
}

.mz-footer-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 25px;
}

#mz_btn-reset {
    width: 100%;
    border: 2px solid var(--mz-danger);
    color: var(--mz-danger);
    background: var(--mz-bg);
    font-weight: 700;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: .2s;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

#mz_btn-reset:hover {
    background: var(--mz-danger);
    color: #fff;
}

#mz_btn-reset svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.mz-lang-select {
    width: 100%;
    background: var(--mz-btn-bg);
    color: var(--mz-text);
    border: 2px solid var(--mz-border);
    padding: 10px 15px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    font-size: 0.875rem;
    outline: none;
    font-family: inherit;
}

.mz-lang-select:hover,
.mz-lang-select:focus {
    border-color: var(--mz-primary);
}

.mz-credit {
    text-align: center;
    margin-top: 5px;
    font-size: 0.75rem;
    opacity: 0.8;
}

.mz-credit a {
    color: var(--mz-text);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
}

.mz-credit a:hover {
    color: var(--mz-primary);
    text-decoration: underline;
}

body.mz_ac-grayscale::before,
body.mz_ac-invert-colors::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000001;
    pointer-events: none;
}

body.mz_ac-grayscale::before {
    backdrop-filter: grayscale(100%);
}

body.mz_ac-invert-colors::before {
    backdrop-filter: invert(100%) hue-rotate(180deg);
}

body.mz_ac-invert-colors iframe,
body.mz_ac-invert-colors img,
body.mz_ac-invert-colors video {
    filter: invert(100%) hue-rotate(180deg) !important;
}

.mz_ac-soft-contrast {
    background-color: #f4f4f4 !important;
    color: #000 !important;
}

.mz_ac-soft-contrast button {
    background-color: #000 !important;
    color: #fff !important;
    border: 2px solid #ff0 !important;
}

.mz_ac-soft-contrast a {
    text-decoration: underline !important;
    font-weight: 700 !important;
    color: #0000EE !important;
}

.mz_no-animations *,
.mz_no-animations *::after,
.mz_no-animations *::before {
    animation-duration: .001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001s !important;
    scroll-behavior: auto !important;
}

.mz_hide-media img {
    visibility: hidden !important;
    border: 1px dashed #ccc;
}

.mz_hide-media iframe,
.mz_hide-media video {
    display: none !important;
}

body.mz_magnifier-active {
    transform-origin: var(--mouse-x, 50%) var(--mouse-y, 50%);
    transform: scale(1.8);
    transition: transform .1s ease-out;
    cursor: zoom-in;
}

body.mz_ac-highlight-links a {
    background-color: #ffeb3b !important;
    color: #000 !important;
    text-decoration: underline !important;
    text-decoration-thickness: 3px !important;
    text-underline-offset: 3px !important;
}

body.mz_ac-readable-font * {
    font-family: Arial, Helvetica, sans-serif !important;
}

body.mz_ac-text-spacing * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
}

#mz_accessibility-menu {
    scrollbar-width: thin;
    scrollbar-color: #adb5bd transparent;
}

#mz_accessibility-menu::-webkit-scrollbar {
    width: 8px;
}

#mz_accessibility-menu::-webkit-scrollbar-track {
    background: transparent;
}

#mz_accessibility-menu::-webkit-scrollbar-thumb {
    background-color: #adb5bd;
    border-radius: 10px;
    border: 2px solid var(--mz-bg);
}

#mz_accessibility-menu::-webkit-scrollbar-thumb:hover {
    background-color: var(--mz-primary);
}

.mz-zoom-container {
    grid-column: span ${CONFIG.theme === 'compact' ? 1 : 2};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background: var(--mz-btn-bg);
    border-radius: 14px;
    flex-direction: column-reverse;
}

.mz-zoom-controls {
    display: flex;
    gap: 10px;
}

#mz_accessibility-menu.mz-theme-glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}

#mz_accessibility-menu.mz-theme-minimal {
    border: 2px solid #000;
    border-radius: 0;
    box-shadow: 8px 8px 0px 0px #000;
}

#mz_accessibility-menu.mz-theme-minimal button {
    border: 1px solid #ddd !important;
    background: transparent !important;
}

.mz-icon-style-default {
    border-radius: 50% !important;
}

.mz-icon-style-outline {
    background: #fff !important;
    border: 2px solid var(--mz-primary) !important;
    color: var(--mz-primary) !important;
}

.mz-icon-style-square {
    border-radius: 12px !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.mz-icon-style-glow {
    box-shadow: 0 0 15px var(--mz-primary) !important;
    border: 2px solid #fff !important;
}

.mz-icon-style-glow:hover {
    transform: scale(1.1);
    box-shadow: 0 0 25px var(--mz-primary) !important;
}

.mz-icon-style-tab {
    border-radius: 50px 0 0 50px !important;
    right: 0 !important;
    width: 50px !important;
}

#mz_accessibility-icon {
    position: fixed;
    ${iconPosCss}
    background-color: var(--mz-primary) !important;
    color: #fff !important;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
    transition: transform .3s ease,
    filter .3s ease;
    border: 3px solid transparent;
    touch-action: none;
    user-select: none;
    /*animation: mzPulse 3s infinite ease-in-out;*/
}

@keyframes mzPulse {
    0% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, .35);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
    }
}

#mz_accessibility-icon:hover {
    animation: none;
    transform: scale(1.1);
    filter: brightness(1.1);
}

#mz_accessibility-icon svg {
    width: 2rem;
    height: 2rem;
    fill: currentColor;
    stroke: currentColor;
}

#mz_accessibility-menu .mz-zoom-controls button.mz-feature-btn svg {
    width: 2rem;
    height: 2rem;
    margin: 0 auto;
}
    `;
    doc.head.appendChild(styleElem);


    const container = doc.createElement("div");

    const creditHTML = CONFIG.creditText ? `<div class="mz-credit"><a href="https://github.com/meir-zano/accessibility" target="_blank" rel="noopener">${CONFIG.creditText}</a></div>` : '';

    container.innerHTML = `
<svg style="display:none;">
    <defs>${svgLibrary}</defs>
</svg>

<div id="mz_accessibility-icon" class="mz-icon-style-${CONFIG.iconStyle}" title="תפריט נגישות" role="button"
    tabindex="0">
    <svg>
        <use href="#mz-icon-${CONFIG.iconType}"></use>
    </svg>
</div>

<div id="mz_accessibility-menu" class="mz-theme-${CONFIG.theme}">
    <div class="mz-header">
        <h3 data-i18n-mz="title">נגישות</h3>
        <button class="mz-close-btn" id="mz_btn-close">X</button>
    </div>
    <div class="mz-grid">
        <button class="mz-feature-btn" id="mz_speech-btn"><span class="mz-icon"><svg>
                    <use href="#mz-icon-speech"></use>
                </svg></span><span data-i18n-mz="speech">הקראה</span></button>
        <button class="mz-feature-btn" id="mz_btn-magnifier"><span class="mz-icon"><svg>
                    <use href="#mz-icon-magnifier"></use>
                </svg></span><span data-i18n-mz="magnifier">זכוכית מגדלת</span></button>
        <div class="mz-zoom-container">
            <div class="mz-zoom-label">
                <span data-i18n-mz="zoom">הגדלה:</span>
                <span id="mz_zoom-indicator" role="status">100%</span>
            </div>
            <div class="mz-zoom-controls">
                <button class="mz-feature-btn" id="mz_btn-font-down"><svg>
                        <use href="#mz-icon-fontDown"></use>
                    </svg></button>
                <button class="mz-feature-btn" id="mz_btn-font-up"><svg>
                        <use href="#mz-icon-fontUp"></use>
                    </svg></button>
            </div>
        </div>
        <button class="mz-feature-btn" id="mz_btn-readable-font"><span class="mz-icon"><svg>
                    <use href="#mz-icon-readableFont"></use>
                </svg></span><span data-i18n-mz="readableFont">גופן קריא</span></button>
        <button class="mz-feature-btn" id="mz_btn-text-spacing"><span class="mz-icon"><svg>
                    <use href="#mz-icon-textSpacing"></use>
                </svg></span><span data-i18n-mz="textSpacing">ריווח טקסט</span></button>
        <button class="mz-feature-btn" id="mz_btn-highlight-links"><span class="mz-icon"><svg>
                    <use href="#mz-icon-highlightLinks"></use>
                </svg></span><span data-i18n-mz="highlightLinks">הדגשת קישורים</span></button>
        <button class="mz-feature-btn" id="mz_btn-contrast"><span class="mz-icon"><svg>
                    <use href="#mz-icon-contrast"></use>
                </svg></span><span data-i18n-mz="contrast">ניגודיות</span></button>
        <button class="mz-feature-btn" id="mz_btn-grayscale"><span class="mz-icon"><svg>
                    <use href="#mz-icon-grayscale"></use>
                </svg></span><span data-i18n-mz="grayscale">שחור לבן</span></button>
        <button class="mz-feature-btn" id="mz_btn-invert"><span class="mz-icon"><svg>
                    <use href="#mz-icon-invert"></use>
                </svg></span><span data-i18n-mz="invert">היפוך צבעים</span></button>
        <button class="mz-feature-btn" id="mz_btn-anim"><span class="mz-icon"><svg>
                    <use href="#mz-icon-anim"></use>
                </svg></span><span data-i18n-mz="anim">עצירת אנימציה</span></button>
        <button class="mz-feature-btn" id="mz_btn-media"><span class="mz-icon"><svg>
                    <use href="#mz-icon-media"></use>
                </svg></span><span data-i18n-mz="media">הסרת מדיה</span></button>
    </div>

    <div class="mz-footer-controls">
        <button id="mz_btn-reset"><svg>
                <use href="#mz-icon-reset"></use>
            </svg> <span data-i18n-mz="reset">איפוס הגדרות</span></button>

        <select id="mz_lang-select" class="mz-lang-select" aria-label="בחר שפה / Choose Language">
            <option value="he">עברית</option>
            <option value="en">English</option>
        </select>
        ${creditHTML}
    </div>
</div>
`;
    doc.body.prepend(container);

    const menu = doc.getElementById("mz_accessibility-menu");
    const iconBtn = doc.getElementById("mz_accessibility-icon");
    const closeBtn = doc.getElementById("mz_btn-close");
    const langSelect = doc.getElementById("mz_lang-select");


    let isSpeechActive = false;
    let isMagnifierActive = false;
    let fontSizeMult = 1;
    let currentLang = localStorage.getItem('mz_accessibility_lang') || CONFIG.defaultLang;

    if (langSelect) langSelect.value = currentLang;

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('mz_accessibility_lang', lang);
        menu.style.direction = lang === 'he' ? 'rtl' : 'ltr';
        if (langSelect) langSelect.value = lang;

        doc.querySelectorAll('[data-i18n-mz]').forEach(el => {
            const key = el.getAttribute('data-i18n-mz');
            if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
        });
    }

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    function updateActiveClasses() {
        const toggleClass = (id, cls) => doc.getElementById(id).classList.toggle("active", doc.body.classList.contains(cls));
        toggleClass("mz_btn-grayscale", "mz_ac-grayscale");
        toggleClass("mz_btn-invert", "mz_ac-invert-colors");
        toggleClass("mz_btn-contrast", "mz_ac-soft-contrast");
        toggleClass("mz_btn-media", "mz_hide-media");
        toggleClass("mz_btn-anim", "mz_no-animations");
        toggleClass("mz_btn-highlight-links", "mz_ac-highlight-links");
        toggleClass("mz_btn-readable-font", "mz_ac-readable-font");
        toggleClass("mz_btn-text-spacing", "mz_ac-text-spacing");

        doc.getElementById("mz_speech-btn").classList.toggle("active", isSpeechActive);
        doc.getElementById("mz_btn-magnifier").classList.toggle("active", isMagnifierActive);
    }

    function saveSettings() {
        const settings = {
            g: doc.body.classList.contains("mz_ac-grayscale"),
            i: doc.body.classList.contains("mz_ac-invert-colors"),
            c: doc.body.classList.contains("mz_ac-soft-contrast"),
            n: doc.body.classList.contains("mz_no-animations"),
            h: doc.body.classList.contains("mz_hide-media"),
            hl: doc.body.classList.contains("mz_ac-highlight-links"),
            rf: doc.body.classList.contains("mz_ac-readable-font"),
            ts: doc.body.classList.contains("mz_ac-text-spacing"),
            f: fontSizeMult, s: isSpeechActive, m: isMagnifierActive
        };
        localStorage.setItem("mz_accessibility_settings", JSON.stringify(settings));
        updateActiveClasses();
    }

    function loadSettings() {
        applyLanguage(currentLang);
        const storedSettings = localStorage.getItem("mz_accessibility_settings");
        if (!storedSettings) return;

        const s = JSON.parse(storedSettings);
        if (s.g) doc.body.classList.add("mz_ac-grayscale");
        if (s.i) doc.body.classList.add("mz_ac-invert-colors");
        if (s.c) doc.body.classList.add("mz_ac-soft-contrast");
        if (s.n) doc.body.classList.add("mz_no-animations");
        if (s.h) doc.body.classList.add("mz_hide-media");
        if (s.hl) doc.body.classList.add("mz_ac-highlight-links");
        if (s.rf) doc.body.classList.add("mz_ac-readable-font");
        if (s.ts) doc.body.classList.add("mz_ac-text-spacing");

        if (s.f && s.f !== 1) { fontSizeMult = s.f; setTimeout(() => applyFontSize(s.f), 100); }
        if (s.s) isSpeechActive = true;
        if (s.m) { isMagnifierActive = true; doc.body.classList.add("mz_magnifier-active"); doc.addEventListener("mousemove", handleMouseMove); }

        updateActiveClasses();
    }

    let isDragging = false;
    let pointerX, pointerY;
    let dragHoldTimer;
    let justToggled = false;

    iconBtn.onmousedown = iconBtn.ontouchstart = (e) => {
        if (e.button === 2) return;

        isDragging = false;
        let eventTarget = e.touches ? e.touches[0] : e;
        let rect = iconBtn.getBoundingClientRect();

        pointerX = eventTarget.clientX - rect.left;
        pointerY = eventTarget.clientY - rect.top;

        dragHoldTimer = setTimeout(() => {
            isDragging = true;
            iconBtn.style.transform = "scale(0.95)";
        }, 300);

        doc.onmousemove = doc.ontouchmove = (moveEvent) => {
            if (!isDragging) return;

            let moveTarget = moveEvent.touches ? moveEvent.touches[0] : moveEvent;

            let newX = Math.max(0, Math.min(window.innerWidth - 60, moveTarget.clientX - pointerX));
            let newY = Math.max(0, Math.min(window.innerHeight - 60, moveTarget.clientY - pointerY));

            iconBtn.style.left = newX + "px";
            iconBtn.style.top = newY + "px";
            iconBtn.style.right = "auto";
            iconBtn.style.bottom = "auto";

            if (CONFIG.theme !== 'sidebar') {
                menu.style.left = (newX < 320 ? newX : newX - 260) + "px";

                if (newY < window.innerHeight / 2) {
                    menu.style.top = (newY + 75) + "px";
                } else {
                    menu.style.top = Math.max(0, newY - (menu.offsetHeight || 450) - 15) + "px";
                }

                menu.style.right = "auto";
                menu.style.bottom = "auto";
            }
        };

        doc.onmouseup = doc.ontouchend = () => {
            clearTimeout(dragHoldTimer);
            iconBtn.style.transform = "";
            doc.onmousemove = doc.ontouchmove = doc.onmouseup = doc.ontouchend = null;

            if (!isDragging) {
                justToggled = true;
                menu.classList.toggle("open");

                setTimeout(() => { justToggled = false; }, 500);
            }
        };
    };

    iconBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isDragging && !justToggled) {
            menu.classList.toggle("open");
        }
    };

    closeBtn.onclick = () => menu.classList.toggle("open");

    const bindToggleFeature = (btnId, className) => {
        doc.getElementById(btnId).onclick = () => { doc.body.classList.toggle(className); saveSettings(); };
    };

    bindToggleFeature("mz_btn-grayscale", "mz_ac-grayscale");
    bindToggleFeature("mz_btn-invert", "mz_ac-invert-colors");
    bindToggleFeature("mz_btn-contrast", "mz_ac-soft-contrast");
    bindToggleFeature("mz_btn-media", "mz_hide-media");
    bindToggleFeature("mz_btn-highlight-links", "mz_ac-highlight-links");
    bindToggleFeature("mz_btn-readable-font", "mz_ac-readable-font");
    bindToggleFeature("mz_btn-text-spacing", "mz_ac-text-spacing");

    doc.getElementById("mz_btn-anim").onclick = () => {
        const isPaused = doc.body.classList.toggle("mz_no-animations");
        doc.querySelectorAll("video").forEach(v => isPaused ? v.pause() : v.play());
        saveSettings();
    };

    doc.getElementById("mz_btn-font-up").onclick = () => {
        if (fontSizeMult >= MAX_FONT_MULT) return;
        fontSizeMult = Math.min(MAX_FONT_MULT, fontSizeMult * 1.1);
        applyFontSize(fontSizeMult); saveSettings();
    };

    doc.getElementById("mz_btn-font-down").onclick = () => {
        if (fontSizeMult <= MIN_FONT_MULT) return;
        fontSizeMult = Math.max(MIN_FONT_MULT, fontSizeMult * 0.9);
        applyFontSize(fontSizeMult); saveSettings();
    };

    function applyFontSize2(absoluteMultiplier) {
        doc.body.classList.remove(...Array.from(doc.body.classList).filter(c => c.startsWith("mz-text-size-")));
        absoluteMultiplier = Math.min(MAX_FONT_MULT, Math.max(MIN_FONT_MULT, absoluteMultiplier));

        const zoomIndicator = doc.getElementById('mz_zoom-indicator');

        doc.body.classList.add("mz-text-size-" + (Math.round(absoluteMultiplier * 100) || "100"));
        if (zoomIndicator) {
            const percent = Math.round(absoluteMultiplier * 100);
            zoomIndicator.innerText = percent + "%";
        }
        const rootFontSize = parseFloat(window.getComputedStyle(doc.documentElement).fontSize) || 16;
        const shouldIgnore = (el) => /*el.closest('#mz_accessibility-menu') || */el.closest('#mz_accessibility-icon') || el.closest('.mz-ignore');

        const textElements = Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, span, a, li, td, th, i, b, strong, em, button, select")).filter(el => !shouldIgnore(el));
        const svgElements = Array.from(doc.querySelectorAll("[class*='icon' i] svg, svg[class*='icon' i], [class*='ic-' i] svg, [class^='ic-' i] svg, [class*='ic_' i] svg, i svg, button svg")).filter(el => !shouldIgnore(el));
        const bgIconElements = Array.from(doc.querySelectorAll("i, span[class*='icon' i], div[class*='icon' i], [class*='ic-' i], [class^='ic-' i], [class*='ic_' i]")).filter(el => !shouldIgnore(el));

        const allTargetElements = [...new Set([...textElements, ...svgElements, ...bgIconElements])];

        allTargetElements.forEach(el => {
            if (!el.hasAttribute('data-mz-orig-trans')) {
                el.setAttribute('data-mz-orig-trans', el.style.transition || '');
            }
            el.style.setProperty('transition', 'none', 'important');

            if (el.style.fontSize && el.style.fontSize.includes('rem')) el.style.removeProperty('font-size');
            if (el.style.width && el.style.width.includes('rem')) {
                el.style.removeProperty('width');
                el.style.removeProperty('height');
            }
        });

        void doc.body.offsetHeight;

        const textMeasurements = textElements.map(el => ({ el, val: parseFloat(window.getComputedStyle(el).fontSize) }));
        const svgMeasurements = svgElements.map(el => ({ el, w: parseFloat(window.getComputedStyle(el).width), h: parseFloat(window.getComputedStyle(el).height) }));
        const bgMeasurements = bgIconElements.map(el => {
            let comp = window.getComputedStyle(el);
            if (comp.backgroundImage !== 'none' && comp.backgroundImage.includes('url')) {
                return { el, w: parseFloat(comp.width), h: parseFloat(comp.height) };
            }
            return null;
        }).filter(Boolean);

        if (absoluteMultiplier !== 1) {
            textMeasurements.forEach(({ el, val }) => {
                if (val) el.style.setProperty('font-size', ((val * absoluteMultiplier) / rootFontSize) + "rem", "important");
            });
            svgMeasurements.forEach(({ el, w, h }) => {
                if (w && h) {
                    el.style.setProperty('width', ((w * absoluteMultiplier) / rootFontSize) + "rem", "important");
                    el.style.setProperty('height', ((h * absoluteMultiplier) / rootFontSize) + "rem", "important");
                }
            });
            bgMeasurements.forEach(({ el, w, h }) => {
                if (w && h) {
                    el.style.setProperty('width', ((w * absoluteMultiplier) / rootFontSize) + "rem", "important");
                    el.style.setProperty('height', ((h * absoluteMultiplier) / rootFontSize) + "rem", "important");
                }
            });
        }

        setTimeout(() => {
            allTargetElements.forEach(el => {
                let origTrans = el.getAttribute('data-mz-orig-trans');
                if (origTrans) {
                    el.style.setProperty('transition', origTrans);
                } else {
                    el.style.removeProperty('transition');
                }
                el.removeAttribute('data-mz-orig-trans');
            });
        }, 50);
    }

    function applyFontSize3(multiplier) {
        multiplier = Math.min(MAX_FONT_MULT, Math.max(MIN_FONT_MULT, multiplier));

        document.documentElement.style.setProperty('--mz-zoom', multiplier);

        document.body.classList.remove(
            ...Array.from(document.body.classList).filter(c => c.startsWith('mz-text-size-'))
        );
        document.body.classList.add('mz-text-size-' + Math.round(multiplier * 100));

        const zoomIndicator = document.getElementById('mz_zoom-indicator');
        if (zoomIndicator) {
            zoomIndicator.innerText = Math.round(multiplier * 100) + '%';
        }
    }

    function applyFontSize(multiplier) {
        if (CONFIG.pro) {
            applyFontSize3(multiplier);
        } else {
            applyFontSize2(multiplier);
        }

        if (!CONFIG.scriptCSS || !CONFIG.scriptCSS.fontSize) return;

        const percent = multiplier > 10
            ? Math.floor(multiplier)
            : Math.floor(multiplier * 100);

        document.body.classList.remove(
            ...Array.from(document.body.classList)
                .filter(c => c.startsWith('mz-font-size-'))
        );

        const map = CONFIG.scriptCSS.fontSize;

        const thresholds = Object.keys(map)
            .map(Number)
            .sort((a, b) => b - a);

        let sizeClass = 'default';

        for (const t of thresholds) {
            if (percent >= t) {
                sizeClass = map[t];
                break;
            }
        }

        document.body.classList.add('mz-font-size-' + sizeClass);
    }
    doc.getElementById("mz_speech-btn").onclick = () => { isSpeechActive = !isSpeechActive; saveSettings(); };

    function speakText(text) {
        if (!isSpeechActive || !text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang === 'he' ? "he-IL" : "en-US";
        window.speechSynthesis.speak(utterance);
    }

    doc.addEventListener("mouseover", (e) => {
        if (!isSpeechActive) return;
        const targetElement = e.target.closest("p, h1, h2, h3, h4, span, button, a");
        if (targetElement) speakText(targetElement.innerText || targetElement.alt || "");
    });

    doc.addEventListener("click", () => { if (isSpeechActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance("")); }, { once: true });

    function handleMouseMove(e) {
        doc.body.style.setProperty("--mouse-x", e.clientX + "px"); doc.body.style.setProperty("--mouse-y", e.clientY + "px");
    }

    doc.getElementById("mz_btn-magnifier").onclick = () => {
        isMagnifierActive = !isMagnifierActive;
        if (isMagnifierActive) {
            doc.body.classList.add("mz_magnifier-active"); doc.addEventListener("mousemove", handleMouseMove);
        } else {
            doc.body.classList.remove("mz_magnifier-active"); doc.removeEventListener("mousemove", handleMouseMove); doc.body.style.transform = "";
        }
        saveSettings();
    };

    doc.getElementById("mz_btn-reset").onclick = () => {
        localStorage.removeItem("mz_accessibility_settings");
        localStorage.setItem("mz_accessibility_lang", currentLang);
        location.reload();
    };

    window.addEventListener("load", loadSettings);

    const allButtons = doc.querySelectorAll('[role="button"]');
    allButtons.forEach(btn => {
        if (!btn.hasAttribute('tabindex')) { btn.setAttribute('tabindex', '0'); }
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    });

})();
