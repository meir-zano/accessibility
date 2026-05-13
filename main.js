(function () {
    const doc = document;

    const DEFAULT_CONFIG = {
        theme: 'sidebar',        // 'modern' | 'sidebar' | 'dark' | 'compact' | 'glass' | 'neumorphism' | 'minimal' | 'high-contrast' | 'rounded' | 'cyberpunk' | 'material' | 'retro' | 'floating'       
        menuLayout: 'grid',      // 'grid' (קבוצות ברשת) | 'list' (רשימה ארוכה)
        position: 'bottom-right',// 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'mid-right' | 'mid-left'
        primaryColor: '#0D6EFD',
        defaultLang: 'he',       // 'he' | 'en'
        maxTextZoomPercent: 400,
        minTextZoomPercent: 50,
        creditText: 'Accessibility by Meir Zano',
        iconType: 'person',
        iconStyle: 'default',
        pro: false,
        scriptCSS: {}
    };

    const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.mzAccessibilityConfig || {});

    const MAX_FONT_MULT = CONFIG.maxTextZoomPercent / 100;
    const MIN_FONT_MULT = CONFIG.minTextZoomPercent / 100;

    const translations = {
        he: {
            title: "נגישות", speech: "הקראה", magnifier: "זכוכית מגדלת",
            contrast: "ניגודיות", grayscale: "שחור לבן", invert: "היפוך צבעים", anim: "עצירת אנימציה",
            media: "הסרת מדיה", highlightLinks: "הדגשת קישורים", readableFont: "גופן קריא",
            backgroundColor: "צבע רקע", textColor: "צבע טקסט", resetColors: "איפוס צבעים",
            colors: { "bw": "שחור לבן", "wb": "לבן ושחור", "yb": "צהוב ושחור", "kb": "כחול ולבן", "kg": "שחור וירוק" },
            reset: "איפוס הגדרות", langToggle: "English",
            bigCursor: "סמן מוגדל", readingMask: "מיקוד קריאה", highlightTitles: "הדגשת כותרות", keyboardNav: "ניווט מקלדת",
            dyslexiaFont: "פונט דיסלקציה", showAlt: "תיאורי תמונות", muteAudio: "השתקת צלילים",
            groupText: "התאמות טקסט וקריאה", groupColor: "התאמות צבע ותצוגה", groupNav: "התאמות ניווט ומיקוד",
            zoom: "גודל טקסט", textSpacing: "ריווח אותיות", lineHeight: "ריווח שורות",
            alignRight: "יישור לימין", alignLeft: "יישור לשמאל", alignCenter: "יישור למרכז",
            highSaturation: "רוויה גבוהה", lowSaturation: "רוויה נמוכה"
        },
        en: {
            title: "Accessibility", speech: "Read Aloud", magnifier: "Magnifier",
            contrast: "Contrast", grayscale: "Grayscale", invert: "Invert Colors", anim: "Stop Animations",
            media: "Hide Media", highlightLinks: "Highlight Links", readableFont: "Readable Font",
            backgroundColor: "Background Color", textColor: "Text Color", resetColors: "Reset Colors",
            colors: { "bw": "Black & White", "wb": "White & Black", "yb": "Yellow & Black", "kb": "Blue & White", "kg": "Black & Green" },
            reset: "Reset Settings", langToggle: "עברית",
            bigCursor: "Big Cursor", readingMask: "Reading Mask", highlightTitles: "Highlight Titles", keyboardNav: "Keyboard Nav",
            dyslexiaFont: "Dyslexia Font", showAlt: "Image Descriptions", muteAudio: "Mute Audio",
            groupText: "Text & Reading Adjustments", groupColor: "Color & Display Adjustments", groupNav: "Navigation & Focus",
            zoom: "Text Size", textSpacing: "Letter Spacing", lineHeight: "Line Height",
            alignRight: "Align Right", alignLeft: "Align Left", alignCenter: "Align Center",
            highSaturation: "High Saturation", lowSaturation: "Low Saturation"
        }
    };

    const iconPaths = {
        speech: '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
        magnifier: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>',
        contrast: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 18a6 6 0 0 0 0-12v12z"></path></svg>',
        grayscale: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="3" x2="21" y2="21"></line></svg>',
        invert: '<svg viewBox="0 0 24 24"><path d="M16 4h4v4"></path><path d="M20 4l-6.12 6.12"></path><path d="M8.12 13.88L2 20h4v4"></path><path d="M13 22l9-9"></path><path d="M2 13l9-9"></path></svg>',
        anim: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="14" y2="15"></line><line x1="10" y1="11" x2="14" y2="11"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>',
        media: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline><line x1="3" y1="3" x2="21" y2="21"></line></svg>',
        highlightLinks: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
        readableFont: '<svg viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
        reset: '<svg viewBox="0 0 24 24"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
        wheelchair: '<svg viewBox="0 0 24 24"><circle cx="18" cy="4" r="2"></circle><path d="m17.836 12.014-4.345.725 3.29-4.113a1 1 0 0 0-.227-1.457l-6-4a.999.999 0 0 0-1.262.125l-4 4 1.414 1.414 3.42-3.42 2.584 1.723-2.681 3.352a5.913 5.913 0 0 0-5.5.752l1.451 1.451A3.972 3.972 0 0 1 8 12c2.206 0 4 1.794 4 4 0 .739-.216 1.425-.566 2.02l1.451 1.451A5.961 5.961 0 0 0 14 16c0-.445-.053-.878-.145-1.295L17 14.181V20h2v-7a.998.998 0 0 0-1.164-.986zM8 20c-2.206 0-4-1.794-4-4 0-.739.216-1.425.566-2.02l-1.451-1.451A5.961 5.961 0 0 0 2 16c0 3.309 2.691 6 6 6 1.294 0 2.49-.416 3.471-1.115l-1.451-1.451A3.972 3.972 0 0 1 8 20z"></path></svg>',
        human: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path><path d="M8 12h8"></path></svg>',
        eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
        person: '<svg viewBox="0 0 512 512"><path d="M256,112a56,56,0,1,1,56-56A56.06,56.06,0,0,1,256,112Z"></path><path d="M432,112.8l-.45.12h0l-.42.13c-1,.28-2,.58-3,.89-18.61,5.46-108.93,30.92-172.56,30.92-59.13,0-141.28-22-167.56-29.47a73.79,73.79,0,0,0-8-2.58c-19-5-32,14.3-32,31.94,0,17.47,15.7,25.79,31.55,31.76v.28l95.22,29.74c9.73,3.73,12.33,7.54,13.6,10.84,4.13,10.59.83,31.56-.34,38.88l-5.8,45L150.05,477.44q-.15.72-.27,1.47l-.23,1.27h0c-2.32,16.15,9.54,31.82,32,31.82,19.6,0,28.25-13.53,32-31.94h0s28-157.57,42-157.57,42.84,157.57,42.84,157.57h0c3.75,18.41,12.4,31.94,32,31.94,22.52,0,34.38-15.74,32-31.94-.21-1.38-.46-2.74-.76-4.06L329,301.27l-5.79-45c-4.19-26.21-.82-34.87.32-36.9a1.09,1.09,0,0,0,.08-.15c1.08-2,6-6.48,17.48-10.79l89.28-31.21a16.9,16.9,0,0,0,1.62-.52c16-6,32-14.3,32-31.93S451,107.81,432,112.8Z"></path></svg>',
        bigCursor: '<svg viewBox="0 0 24 24"><path d="M6 3l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.5z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
        readingMask: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="3" y="10" width="18" height="4" fill="currentColor"></rect></svg>',
        highlightTitles: '<svg viewBox="0 0 24 24"><path d="M5 4v16h3v-6h8v6h3V4h-3v7H8V4H5z" fill="currentColor"/></svg>',
        keyboardNav: '<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect><circle cx="6" cy="10" r="1.5" fill="currentColor"></circle><circle cx="10" cy="10" r="1.5" fill="currentColor"></circle><circle cx="14" cy="10" r="1.5" fill="currentColor"></circle><circle cx="18" cy="10" r="1.5" fill="currentColor"></circle><circle cx="6" cy="14" r="1.5" fill="currentColor"></circle><circle cx="10" cy="14" r="1.5" fill="currentColor"></circle><circle cx="14" cy="14" r="1.5" fill="currentColor"></circle><circle cx="18" cy="14" r="1.5" fill="currentColor"></circle></svg>',
        dyslexiaFont: '<svg viewBox="0 0 24 24"><path d="M5 19h14M7 15l5-10 5 10M9 11h6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        showAlt: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle><polyline points="21 15 16 10 5 21" fill="none" stroke="currentColor" stroke-width="2"></polyline><rect x="10" y="16" width="10" height="4" rx="1" fill="currentColor"></rect></svg>',
        muteAudio: '<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>',
        alignRight: '<svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/><line x1="21" y1="18" x2="5" y2="18" stroke="currentColor" stroke-width="2"/></svg>',
        alignLeft: '<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="2"/><line x1="3" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="2"/></svg>',
        alignCenter: '<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="2"/><line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="2"/></svg>',
        highSaturation: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>',
        lowSaturation: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/></svg>'
    };

    const svgLibrary = Object.keys(iconPaths).map(key =>
        `<symbol id="mz-icon-${key}" viewBox="0 0 24 24">${iconPaths[key]}</symbol>`
    ).join('');

    let iconPosCss = ''; let menuPosCss = ''; let transformOrigin = '';
    const isLeft = CONFIG.position.includes('left');

    switch (CONFIG.position) {
        case 'top-right': iconPosCss = 'top: 30px; right: 30px;'; menuPosCss = 'top: 105px; right: 30px;'; transformOrigin = 'top right'; break;
        case 'top-left': iconPosCss = 'top: 30px; left: 30px;'; menuPosCss = 'top: 105px; left: 30px;'; transformOrigin = 'top left'; break;
        case 'mid-right': iconPosCss = 'top: calc(50vh - 30px); right: 30px;'; menuPosCss = 'top: calc(50vh - 200px); right: 105px;'; transformOrigin = 'right center'; break;
        case 'mid-left': iconPosCss = 'top: calc(50vh - 30px); left: 30px;'; menuPosCss = 'top: calc(50vh - 200px); left: 105px;'; transformOrigin = 'left center'; break;
        case 'bottom-left': iconPosCss = 'bottom: 30px; left: 30px;'; menuPosCss = 'bottom: 105px; left: 30px;'; transformOrigin = 'bottom left'; break;
        case 'bottom-right': default: iconPosCss = 'bottom: 30px; right: 30px;'; menuPosCss = 'bottom: 105px; right: 30px;'; transformOrigin = 'bottom right'; break;
    }

    doc.documentElement.style.setProperty('--mz-primary', CONFIG.primaryColor);

    const styleElem = doc.createElement("style");
    styleElem.innerHTML = `
:root {
    --mz-bg: #ffffff; --mz-btn-bg: #f0f2f5; --mz-text: #212529; --mz-danger: #dc3545; --mz-border: #dee2e6;
    --mz-size-text: 1; --mz-spacing-text: 0; --mz-line-height: 1.5; --mz-menu-scale: 1;
    --mz-custom-bg: transparent; --mz-custom-text: inherit;
}

body.mz-custom-colors:not(.mz-color-preset, #mz_accessibility-icon):not(.mz-color-preset *, #mz_accessibility-icon *),
body.mz-custom-colors *:not(.mz-color-preset, #mz_accessibility-icon):not(.mz-color-preset *, #mz_accessibility-icon *),
body.mz-custom-colors *:not(.mz-color-preset, #mz_accessibility-icon):not(.mz-color-preset *, #mz_accessibility-icon *)::before,
body.mz-custom-colors *:not(.mz-color-preset, #mz_accessibility-icon):not(.mz-color-preset *, #mz_accessibility-icon *)::after {
    background-color: var(--mz-custom-bg) !important; color: var(--mz-custom-text) !important; border-color: var(--mz-custom-text) !important;
}

#mz_accessibility-icon:hover { transform: scale(1.05); filter: brightness(1.1); }

#mz_accessibility-menu {
    position: fixed; ${menuPosCss} background: var(--mz-bg); border: 1px solid var(--mz-border); padding: 20px;
    border-radius: 20px; 
    
    width: calc(340px * var(--mz-menu-scale, 1)); 
    max-width: 95vw; 
    
    z-index: 1000000; box-shadow: 0 10px 40px rgba(0, 0, 0, .2);
    max-height: 85vh; overflow-y: auto; overflow-x: hidden; opacity: 0; visibility: hidden; transform: scale(.8);
    transform-origin: ${transformOrigin}; transition: transform 0.3s, opacity 0.3s, width 0.1s ease-out;
}

#mz_accessibility-menu.open { opacity: 1; visibility: visible; transform: scale(1); }

#mz_accessibility-menu.mz-theme-sidebar {
    bottom: 0 !important; top: 0 !important; height: 100vh; max-height: 100vh; border-radius: 0; border: none; padding-top: 30px;
    ${isLeft ? 'left: 0 !important; right: auto !important; box-shadow: 5px 0 25px rgba(0,0,0,.15); transform: translateX(-100%);' : 'right: 0 !important; left: auto !important; box-shadow: -5px 0 25px rgba(0,0,0,.15); transform: translateX(100%);'}
}
#mz_accessibility-menu.mz-theme-sidebar.open { transform: translateX(0); }

#mz_accessibility-menu.mz-theme-dark { --mz-bg: #212529; --mz-btn-bg: #343a40; --mz-text: #f8f9fa; --mz-border: #495057; box-shadow: 0 10px 40px rgba(0, 0, 0, .6); }
#mz_accessibility-menu.mz-theme-compact { max-height: 65vh; padding: 20px; }
#mz_accessibility-menu.mz-theme-glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
#mz_accessibility-menu.mz-theme-minimal { border: 3px solid #000; border-radius: 0; box-shadow: 8px 8px 0 #000; }
#mz_accessibility-menu.mz-theme-minimal button.mz-feature-btn { border: 2px solid #000; border-radius: 0; background: #fff; color: #000; }
#mz_accessibility-menu.mz-theme-minimal button.mz-feature-btn.active { background: #000; color: #fff; }

#mz_accessibility-menu.mz-theme-high-contrast { --mz-bg: #000; --mz-btn-bg: #111; --mz-text: #ffeb3b; --mz-border: #ffeb3b; box-shadow: 0 0 20px rgba(255, 235, 59, 0.4); }
#mz_accessibility-menu.mz-theme-high-contrast button.mz-feature-btn { border: 2px solid #333; }
#mz_accessibility-menu.mz-theme-high-contrast button.mz-feature-btn.active { background: #ffeb3b; color: #000; border-color: #ffeb3b; }

#mz_accessibility-menu.mz-theme-rounded { border-radius: 40px; padding: 25px; }
#mz_accessibility-menu.mz-theme-rounded button.mz-feature-btn, #mz_accessibility-menu.mz-theme-rounded .mz-slider-container, #mz_accessibility-menu.mz-theme-rounded .mz-colors-container { border-radius: 25px; }

#mz_accessibility-menu.mz-theme-cyberpunk { --mz-bg: #f3e600; --mz-text: #000; --mz-btn-bg: #fff; --mz-border: #000; border: 4px solid #000; border-radius: 0; box-shadow: 10px 10px 0px #000; }
#mz_accessibility-menu.mz-theme-cyberpunk button.mz-feature-btn { color: #0df; border-radius: 0; border: 2px solid #000; text-transform: uppercase; font-family: monospace; }
#mz_accessibility-menu.mz-theme-cyberpunk button.mz-feature-btn.active { background: #f0f; color: #fff; border-color: #000; }

#mz_accessibility-menu.mz-theme-material { border: none; box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2); border-radius: 28px; }
#mz_accessibility-menu.mz-theme-material button.mz-feature-btn { border: none; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2); border-radius: 16px; }
#mz_accessibility-menu.mz-theme-material button.mz-feature-btn.active { background-color: var(--mz-primary); color: #fff; box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2); }

#mz_accessibility-menu.mz-theme-retro { background: #c0c0c0; border-top: 2px solid #fff; border-left: 2px solid #fff; border-right: 2px solid #000; border-bottom: 2px solid #000; border-radius: 0; box-shadow: none; --mz-btn-bg: #c0c0c0; --mz-border: #808080; }
#mz_accessibility-menu.mz-theme-retro button.mz-feature-btn, #mz_accessibility-menu.mz-theme-retro .mz-slider-container, #mz_accessibility-menu.mz-theme-retro .mz-colors-container { border-top: 2px solid #fff; border-left: 2px solid #fff; border-right: 2px solid #808080; border-bottom: 2px solid #808080; border-radius: 0; }
#mz_accessibility-menu.mz-theme-retro button.mz-feature-btn.active { border-top: 2px solid #808080; border-left: 2px solid #808080; border-right: 2px solid #fff; border-bottom: 2px solid #fff; background: #a0a0a0; }

#mz_accessibility-menu.mz-theme-floating { background: transparent; border: none; box-shadow: none; padding: 0; }
#mz_accessibility-menu.mz-theme-floating .mz-group, #mz_accessibility-menu.mz-theme-floating .mz-header, #mz_accessibility-menu.mz-theme-floating .mz-footer-controls { background: var(--mz-bg); padding: 20px; border-radius: 24px; margin-bottom: 15px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 1px solid var(--mz-border); }

.mz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid var(--mz-border); padding-bottom: 10px; }
.mz-header h3 { margin: 0; font-size: 1.25rem; color: var(--mz-text); font-weight: 700; }
.mz-close-btn { background: #ff342029; color: var(--mz-danger); border: none; width: 2rem; height: 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: .2s; }
.mz-close-btn:hover { background: var(--mz-danger); color: #fff; }

.mz-group { margin-bottom: 25px; width: 100%; }
.mz-group-title { font-size: 0.9rem; font-weight: 700; color: var(--mz-primary); margin-bottom: 10px; display: block; border-bottom: 1px dashed var(--mz-border); padding-bottom: 5px; }

.mz-layout-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--mz-menu-scale, 1)), 1fr)); 
    gap: 12px; 
}
.mz-layout-list { display: flex; flex-direction: column; gap: 8px; }

#mz_accessibility-menu button.mz-feature-btn {
    display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid transparent; background: var(--mz-btn-bg); color: var(--mz-text); border-radius: 12px; transition: all .2s ease; font-size: 0.875rem; font-weight: 600; gap: 8px;
    height: auto; min-height: 80px; padding: 12px;
}
.mz-layout-grid button.mz-feature-btn { flex-direction: column; }
.mz-layout-list button.mz-feature-btn { flex-direction: row; min-height: 50px; padding: 10px 15px; justify-content: flex-start; text-align: start; }

#mz_accessibility-menu button.mz-feature-btn span { word-wrap: break-word; overflow-wrap: break-word; hyphens: auto; text-align: center; max-width: 100%; }
#mz_accessibility-menu button.mz-feature-btn .mz-icon { width: 1.8rem; height: 1.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
#mz_accessibility-menu button.mz-feature-btn svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2; }
#mz_accessibility-menu button.mz-feature-btn:hover { filter: brightness(0.95); }
#mz_accessibility-menu button.mz-feature-btn.active { background-color: var(--mz-primary); color: #fff; border-color: var(--mz-primary); }

.mz-slider-container { background: var(--mz-btn-bg); padding: 12px 15px; border-radius: 12px; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
.mz-slider-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-weight: 600; font-size: 0.85rem; color: var(--mz-text); flex-wrap: wrap; gap: 5px;}
.mz-slider-header span.val { color: var(--mz-primary); font-weight: 700; background: var(--mz-bg); padding: 2px 6px; border-radius: 6px; border: 1px solid var(--mz-border); }
.mz-slider { width: 100%; -webkit-appearance: none; appearance: none; height: 6px; background: var(--mz-border); border-radius: 5px; outline: none; transition: .2s; }
.mz-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--mz-primary); cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.mz-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: var(--mz-primary); cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }

.mz-colors-container { background: var(--mz-btn-bg); padding: 15px; border-radius: 12px; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
.mz-color-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: 600; font-size: 0.85rem; color: var(--mz-text); flex-wrap: wrap; gap: 5px; }
.mz-color-presets { display: flex; gap: 8px; margin-top: 15px; justify-content: space-between; width: 100%; flex-wrap: wrap; }
.mz-color-preset { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--mz-border); cursor: pointer; transition: 0.2s; font-size: 0; flex-shrink: 0; }
.mz-color-preset:hover { transform: scale(1.15); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
#mz_btn-reset-colors { margin-top: 15px; width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--mz-border); background: var(--mz-bg); color: var(--mz-text); cursor: pointer; font-weight: 600; transition: 0.2s; }
#mz_btn-reset-colors:hover { background: var(--mz-border); }

.mz-footer-controls { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; width: 100%; }
#mz_btn-reset { width: 100%; border: 2px solid var(--mz-danger); color: var(--mz-danger); background: var(--mz-bg); font-weight: 700; padding: 12px; border-radius: 12px; cursor: pointer; transition: .2s; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
#mz_btn-reset:hover { background: var(--mz-danger); color: #fff; }
#mz_btn-reset svg { width: 1.2rem; height: 1.2rem; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.mz-lang-select { width: 100%; background: var(--mz-btn-bg); color: var(--mz-text); border: 2px solid var(--mz-border); padding: 10px 15px; border-radius: 12px; font-weight: 600; cursor: pointer; outline: none; }
.mz-credit { text-align: center; margin-top: 5px; font-size: 0.75rem; opacity: 0.8; }
.mz-credit a { color: var(--mz-text); text-decoration: none; font-weight: 600; }

body.mz_ac-grayscale::before { content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000001; pointer-events: none; backdrop-filter: grayscale(100%); }
body.mz_ac-invert-colors::before { content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000001; pointer-events: none; backdrop-filter: invert(100%) hue-rotate(180deg); }
body.mz_ac-high-saturation::before { content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000001; pointer-events: none; backdrop-filter: saturate(200%); }
body.mz_ac-low-saturation::before { content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000001; pointer-events: none; backdrop-filter: saturate(30%); }

.mz_ac-soft-contrast { background-color: #f4f4f4 !important; color: #000 !important; }
.mz_no-animations *, .mz_no-animations *::after, .mz_no-animations *::before { 
    transition: none !important; 
    animation-play-state: paused !important; 
    scroll-behavior: auto !important; 
}
.mz_hide-media img { visibility: hidden !important; border: 1px dashed #ccc; }
.mz_hide-media iframe, .mz_hide-media video { display: none !important; }
body.mz_magnifier-active { transform-origin: var(--mouse-x, 50%) var(--mouse-y, 50%); transform: scale(1.8); transition: transform .1s ease-out; cursor: zoom-in; }
body.mz_ac-highlight-links a { background-color: #ffeb3b !important; color: #000 !important; text-decoration: underline !important; text-decoration-thickness: 3px !important; }
body.mz_ac-readable-font * { font-family: Arial, Helvetica, sans-serif !important; }
body.mz_ac-dyslexia * { font-family: 'Comic Sans MS', 'OpenDyslexic', 'Lexend', sans-serif !important; }
body.mz_ac-big-cursor, body.mz_ac-big-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l15 11.2-6.5.6 3.8 8.2-2.5 1-4-8.5-5 5.2z' fill='black' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E"), auto !important; }
body.mz_ac-highlight-titles h1, body.mz_ac-highlight-titles h2, body.mz_ac-highlight-titles h3, body.mz_ac-highlight-titles h4, body.mz_ac-highlight-titles h5, body.mz_ac-highlight-titles h6 { border: 2px solid var(--mz-primary) !important; padding: 2px 4px !important; border-radius: 4px !important; }
body.mz_ac-keyboard-nav *:focus { outline: 4px solid var(--mz-primary) !important; outline-offset: 2px !important; }

body.mz_ac-align-right * { text-align: right !important; }
body.mz_ac-align-left * { text-align: left !important; }
body.mz_ac-align-center * { text-align: center !important; }

body.mz-dynamic-spacing * { letter-spacing: calc(var(--mz-spacing-text) * 1em) !important; word-spacing: calc(var(--mz-spacing-text) * 2em) !important; }
body.mz-dynamic-lineheight * { line-height: var(--mz-line-height) !important; }

#mz_reading-mask { position: fixed; left: 0; top: var(--mouse-y, 50%); width: 100vw; height: 150px; background: transparent; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75); z-index: 999998; pointer-events: none; transform: translateY(-50%); display: none; }
body.mz_ac-reading-mask #mz_reading-mask { display: block; }

.mz-alt-label { display: block !important; background: #ffeb3b !important; color: #000 !important; border: 2px solid #000 !important; padding: 4px 8px !important; margin: 4px 0 !important; font-weight: bold !important; font-size: 14px !important; text-align: center !important; z-index: 9999 !important; border-radius: 4px !important; }

#mz_accessibility-icon { position: fixed; ${iconPosCss} background-color: var(--mz-primary) !important; color: #fff !important; width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; box-shadow: 0 4px 12px rgba(0, 0, 0, .25); transition: .3s; }
#mz_accessibility-icon:hover { transform: scale(1.1); }
#mz_accessibility-icon svg { width: 2rem; height: 2rem; fill: currentColor; stroke: currentColor; }

#mz_accessibility-menu input[type="color"] { -webkit-appearance: none; appearance: none; border: none; width: 32px; height: 32px; border-radius: 50%; padding: 0; cursor: pointer; background: transparent; box-shadow: 0 0 0 2px var(--mz-border); flex-shrink: 0; }
#mz_accessibility-menu input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
#mz_accessibility-menu input[type="color"]::-webkit-color-swatch { border: none; border-radius: 50%; }
#mz_accessibility-menu input[type="color"]::-moz-color-swatch { border: none; border-radius: 50%; }

#mz_accessibility-menu { scrollbar-width: thin; scrollbar-color: #adb5bd transparent; }
#mz_accessibility-menu::-webkit-scrollbar { width: 6px; }
#mz_accessibility-menu::-webkit-scrollbar-thumb { background-color: #adb5bd; border-radius: 10px; }

body.mz_hide-media img, 
body.mz_hide-media picture, 
body.mz_hide-media figure, 
body.mz_hide-media svg:not(#mz_accessibility-menu svg, #mz_accessibility-icon svg) { 
    visibility: hidden !important; 
}
body.mz_hide-media iframe, 
body.mz_hide-media video, 
body.mz_hide-media audio { 
    display: none !important; 
}
    `;
    doc.head.appendChild(styleElem);

    const layoutClass = CONFIG.menuLayout === 'list' ? 'mz-layout-list' : 'mz-layout-grid';
    const creditHTML = CONFIG.creditText ? `<div class="mz-credit"><a href="https://github.com/meir-zano/accessibility" target="_blank" rel="noopener">${CONFIG.creditText}</a></div>` : '';

    const container = doc.createElement("div");
    container.innerHTML = `
<svg style="display:none;"><defs>${svgLibrary}</defs></svg>
<div id="mz_reading-mask"></div>

<div id="mz_accessibility-icon" class="mz-icon-style-${CONFIG.iconStyle}" title="תפריט נגישות" role="button" tabindex="0">
    <svg><use href="#mz-icon-${CONFIG.iconType}"></use></svg>
</div>

<div id="mz_accessibility-menu" class="mz-theme-${CONFIG.theme}">
    <div class="mz-header">
        <h3 data-i18n-mz="title">נגישות</h3>
        <button class="mz-close-btn" id="mz_btn-close">X</button>
    </div>

    <div class="mz-group">
        <span class="mz-group-title" data-i18n-mz="groupText">התאמות טקסט וקריאה</span>
        
        <div class="mz-slider-container">
            <div class="mz-slider-header"><span data-i18n-mz="zoom">גודל טקסט</span> <span class="val" id="mz_zoom-val">100%</span></div>
            <input type="range" class="mz-slider" id="mz_zoom-slider" min="${CONFIG.minTextZoomPercent}" max="${CONFIG.maxTextZoomPercent}" value="100" step="5">
        </div>
        <div class="mz-slider-container">
            <div class="mz-slider-header"><span data-i18n-mz="textSpacing">ריווח אותיות</span> <span class="val" id="mz_spacing-val">רגיל</span></div>
            <input type="range" class="mz-slider" id="mz_spacing-slider" min="0" max="0.3" value="0" step="0.05">
        </div>
        <div class="mz-slider-container">
            <div class="mz-slider-header"><span data-i18n-mz="lineHeight">ריווח שורות</span> <span class="val" id="mz_lineheight-val">רגיל</span></div>
            <input type="range" class="mz-slider" id="mz_lineheight-slider" min="1.5" max="3" value="1.5" step="0.25">
        </div>

        <div class="${layoutClass}" style="margin-top: 10px;">
            <button class="mz-feature-btn" id="mz_btn-readable-font" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-readableFont"></use></svg></span><span data-i18n-mz="readableFont">גופן קריא</span></button>
            <button class="mz-feature-btn" id="mz_btn-dyslexia-font" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-dyslexiaFont"></use></svg></span><span data-i18n-mz="dyslexiaFont">פונט דיסלקציה</span></button>
            <button class="mz-feature-btn" id="mz_btn-align-right" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-alignRight"></use></svg></span><span data-i18n-mz="alignRight">יישור לימין</span></button>
            <button class="mz-feature-btn" id="mz_btn-align-left" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-alignLeft"></use></svg></span><span data-i18n-mz="alignLeft">יישור לשמאל</span></button>
            <button class="mz-feature-btn" id="mz_btn-align-center" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-alignCenter"></use></svg></span><span data-i18n-mz="alignCenter">יישור למרכז</span></button>
            <button class="mz-feature-btn" id="mz_btn-highlight-titles" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-highlightTitles"></use></svg></span><span data-i18n-mz="highlightTitles">הדגשת כותרות</span></button>
            <button class="mz-feature-btn" id="mz_btn-highlight-links" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-highlightLinks"></use></svg></span><span data-i18n-mz="highlightLinks">הדגשת קישורים</span></button>
        </div>
    </div>

    <div class="mz-group">
        <span class="mz-group-title" data-i18n-mz="groupColor">התאמות צבע ותצוגה</span>
        
        <div class="mz-colors-container">
            <div class="mz-color-row"><span data-i18n-mz="textColor">צבע טקסט</span> <input type="color" id="mz_text-color-picker" value="#000000"></div>
            <div class="mz-color-row"><span data-i18n-mz="backgroundColor">צבע רקע</span> <input type="color" id="mz_bg-color-picker" value="#ffffff"></div>
            <div class="mz-color-presets">
                <button class="mz-color-preset" style="background:#000; color:#fff;" data-bg="#000" data-text="#fff" data-i18n-mz="colors.bw" title="שחור ולבן">שחור ולבן</button>
                <button class="mz-color-preset" style="background:#fff; color:#000; border-color:#000;" data-bg="#fff" data-text="#000" data-i18n-mz="colors.wb" title="לבן ושחור">לבן ושחור</button>
                <button class="mz-color-preset" style="background:#ff0; color:#000; border-color:#000;" data-bg="#ff0" data-text="#000" data-i18n-mz="colors.yb" title="צהוב ושחור">צהוב ושחור</button>
                <button class="mz-color-preset" style="background:#000080; color:#fff;" data-bg="#000080" data-text="#fff" data-i18n-mz="colors.kb" title="כחול ולבן">כחול ולבן</button>
                <button class="mz-color-preset" style="background:#000; color:#0f0;" data-bg="#000" data-text="#0f0" data-i18n-mz="colors.kg" title="שחור וירוק">שחור וירוק</button>
            </div>
            <button id="mz_btn-reset-colors" data-i18n-mz="resetColors">איפוס צבעים</button>
        </div>

        <div class="${layoutClass}">
            <button class="mz-feature-btn" id="mz_btn-contrast" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-contrast"></use></svg></span><span data-i18n-mz="contrast">ניגודיות</span></button>
            <button class="mz-feature-btn" id="mz_btn-grayscale" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-grayscale"></use></svg></span><span data-i18n-mz="grayscale">שחור לבן</span></button>
            <button class="mz-feature-btn" id="mz_btn-invert" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-invert"></use></svg></span><span data-i18n-mz="invert">היפוך צבעים</span></button>
            <button class="mz-feature-btn" id="mz_btn-high-saturation" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-highSaturation"></use></svg></span><span data-i18n-mz="highSaturation">רוויה גבוהה</span></button>
            <button class="mz-feature-btn" id="mz_btn-low-saturation" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-lowSaturation"></use></svg></span><span data-i18n-mz="lowSaturation">רוויה נמוכה</span></button>
        </div>
    </div>

    <div class="mz-group">
        <span class="mz-group-title" data-i18n-mz="groupNav">התאמות ניווט ומיקוד</span>
        <div class="${layoutClass}">
            <button class="mz-feature-btn" id="mz_btn-big-cursor" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-bigCursor"></use></svg></span><span data-i18n-mz="bigCursor">סמן מוגדל</span></button>
            <button class="mz-feature-btn" id="mz_btn-reading-mask" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-readingMask"></use></svg></span><span data-i18n-mz="readingMask">מיקוד קריאה</span></button>
            <button class="mz-feature-btn" id="mz_btn-keyboard-nav" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-keyboardNav"></use></svg></span><span data-i18n-mz="keyboardNav">ניווט מקלדת</span></button>
            <button class="mz-feature-btn" id="mz_speech-btn" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-speech"></use></svg></span><span data-i18n-mz="speech">הקראה</span></button>
            <button class="mz-feature-btn" id="mz_btn-magnifier" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-magnifier"></use></svg></span><span data-i18n-mz="magnifier">זכוכית מגדלת</span></button>
            <button class="mz-feature-btn" id="mz_btn-anim" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-anim"></use></svg></span><span data-i18n-mz="anim">עצירת אנימציה</span></button>
            <button class="mz-feature-btn" id="mz_btn-media" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-media"></use></svg></span><span data-i18n-mz="media">הסרת מדיה</span></button>
            <button class="mz-feature-btn" id="mz_btn-show-alt" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-showAlt"></use></svg></span><span data-i18n-mz="showAlt">תיאורי תמונות</span></button>
            <button class="mz-feature-btn" id="mz_btn-mute-audio" aria-pressed="false"><span class="mz-icon"><svg><use href="#mz-icon-muteAudio"></use></svg></span><span data-i18n-mz="muteAudio">השתקת צלילים</span></button>
        </div>
    </div>

    <div class="mz-footer-controls">
        <button id="mz_btn-reset"><svg><use href="#mz-icon-reset"></use></svg> <span data-i18n-mz="reset">איפוס הגדרות</span></button>
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

    const textColorPicker = doc.getElementById("mz_text-color-picker");
    const bgColorPicker = doc.getElementById("mz_bg-color-picker");
    const colorPresets = doc.querySelectorAll(".mz-color-preset");
    const resetColorsBtn = doc.getElementById("mz_btn-reset-colors");

    const zoomSlider = doc.getElementById("mz_zoom-slider");
    const zoomVal = doc.getElementById("mz_zoom-val");
    const spacingSlider = doc.getElementById("mz_spacing-slider");
    const spacingVal = doc.getElementById("mz_spacing-val");
    const lhSlider = doc.getElementById("mz_lineheight-slider");
    const lhVal = doc.getElementById("mz_lineheight-val");

    let isSpeechActive = false, isMagnifierActive = false, fontSizeMult = 1;
    let spacingMult = 0, lineheightMult = 1.5;
    let isZoomDragging = false;
    let currentLang = localStorage.getItem('mz_accessibility_lang') || CONFIG.defaultLang;

    if (langSelect) langSelect.value = currentLang;

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('mz_accessibility_lang', lang);
        menu.style.direction = lang === 'he' ? 'rtl' : 'ltr';
        if (langSelect) langSelect.value = lang;

        doc.querySelectorAll('[data-i18n-mz]').forEach(el => {
            const keyPath = el.getAttribute('data-i18n-mz');
            const translationValue = keyPath.split('.').reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : undefined, translations[lang]);
            if (translationValue) {
                el.innerText = translationValue;
                if (el.hasAttribute('title') || el.title) el.title = translationValue;
            }
        });

        if (spacingSlider) applySpacing(spacingSlider.value);
        if (lhSlider) applyLineHeight(lhSlider.value);
    }

    if (langSelect) langSelect.addEventListener('change', (e) => applyLanguage(e.target.value));

    function applyCustomColors(bg, text) {
        if (bg && text) {
            doc.documentElement.style.setProperty('--mz-custom-bg', bg);
            doc.documentElement.style.setProperty('--mz-custom-text', text);
            doc.body.classList.add('mz-custom-colors');
            if (bgColorPicker) bgColorPicker.value = bg;
            if (textColorPicker) textColorPicker.value = text;
        } else {
            doc.body.classList.remove('mz-custom-colors');
            doc.documentElement.style.removeProperty('--mz-custom-bg');
            doc.documentElement.style.removeProperty('--mz-custom-text');
            if (bgColorPicker) bgColorPicker.value = "#ffffff";
            if (textColorPicker) textColorPicker.value = "#000000";
        }
    }

    if (textColorPicker) textColorPicker.addEventListener('input', (e) => { applyCustomColors(bgColorPicker.value || '#ffffff', e.target.value); saveSettings(); });
    if (bgColorPicker) bgColorPicker.addEventListener('input', (e) => { applyCustomColors(e.target.value, textColorPicker.value || '#000000'); saveSettings(); });
    colorPresets.forEach(preset => { preset.addEventListener('click', () => { applyCustomColors(preset.getAttribute('data-bg'), preset.getAttribute('data-text')); saveSettings(); }); });
    if (resetColorsBtn) resetColorsBtn.addEventListener('click', () => { applyCustomColors(null, null); saveSettings(); });

    function updateActiveClasses() {
        const toggleClass = (id, cls) => {
            const btn = doc.getElementById(id);
            const isActive = doc.body.classList.contains(cls);
            if (btn) { btn.classList.toggle("active", isActive); btn.setAttribute("aria-pressed", isActive ? "true" : "false"); }
        };

        toggleClass("mz_btn-grayscale", "mz_ac-grayscale");
        toggleClass("mz_btn-invert", "mz_ac-invert-colors");
        toggleClass("mz_btn-contrast", "mz_ac-soft-contrast");
        toggleClass("mz_btn-media", "mz_hide-media");
        toggleClass("mz_btn-anim", "mz_no-animations");
        toggleClass("mz_btn-highlight-links", "mz_ac-highlight-links");
        toggleClass("mz_btn-readable-font", "mz_ac-readable-font");
        toggleClass("mz_btn-dyslexia-font", "mz_ac-dyslexia");
        toggleClass("mz_btn-big-cursor", "mz_ac-big-cursor");
        toggleClass("mz_btn-reading-mask", "mz_ac-reading-mask");
        toggleClass("mz_btn-highlight-titles", "mz_ac-highlight-titles");
        toggleClass("mz_btn-keyboard-nav", "mz_ac-keyboard-nav");

        toggleClass("mz_btn-align-right", "mz_ac-align-right");
        toggleClass("mz_btn-align-left", "mz_ac-align-left");
        toggleClass("mz_btn-align-center", "mz_ac-align-center");
        toggleClass("mz_btn-high-saturation", "mz_ac-high-saturation");
        toggleClass("mz_btn-low-saturation", "mz_ac-low-saturation");


        const speechBtn = doc.getElementById("mz_speech-btn");
        if (speechBtn) { speechBtn.classList.toggle("active", isSpeechActive); speechBtn.setAttribute("aria-pressed", isSpeechActive ? "true" : "false"); }

        const magBtn = doc.getElementById("mz_btn-magnifier");
        if (magBtn) { magBtn.classList.toggle("active", isMagnifierActive); magBtn.setAttribute("aria-pressed", isMagnifierActive ? "true" : "false"); }
    }

    function toggleAltText(state) {
        if (state) {
            doc.querySelectorAll('img[alt]').forEach(img => {
                if (img.alt.trim() === '') return;
                if (img.nextElementSibling && img.nextElementSibling.classList.contains('mz-alt-label')) return;
                const span = doc.createElement('span'); span.className = 'mz-alt-label mz-ignore'; span.innerText = img.alt;
                img.parentNode.insertBefore(span, img.nextSibling);
            });
        } else { doc.querySelectorAll('.mz-alt-label').forEach(el => el.remove()); }
    }

    function toggleMute(state) { doc.querySelectorAll('video, audio').forEach(el => el.muted = state); }

    function saveSettings() {
        const settings = {
            g: doc.body.classList.contains("mz_ac-grayscale"), i: doc.body.classList.contains("mz_ac-invert-colors"),
            c: doc.body.classList.contains("mz_ac-soft-contrast"), n: doc.body.classList.contains("mz_no-animations"),
            h: doc.body.classList.contains("mz_hide-media"), hl: doc.body.classList.contains("mz_ac-highlight-links"),
            rf: doc.body.classList.contains("mz_ac-readable-font"), dy: doc.body.classList.contains("mz_ac-dyslexia"),
            bc: doc.body.classList.contains("mz_ac-big-cursor"), rm: doc.body.classList.contains("mz_ac-reading-mask"),
            ht: doc.body.classList.contains("mz_ac-highlight-titles"), kn: doc.body.classList.contains("mz_ac-keyboard-nav"),
            ar: doc.body.classList.contains("mz_ac-align-right"), alft: doc.body.classList.contains("mz_ac-align-left"),
            ac: doc.body.classList.contains("mz_ac-align-center"), hs: doc.body.classList.contains("mz_ac-high-saturation"),
            ls: doc.body.classList.contains("mz_ac-low-saturation"),
            al: doc.getElementById("mz_btn-show-alt").classList.contains("active"),
            mu: doc.getElementById("mz_btn-mute-audio").classList.contains("active"),
            f: fontSizeMult, sp: spacingMult, lh: lineheightMult, s: isSpeechActive, m: isMagnifierActive,
            cb: doc.body.classList.contains('mz-custom-colors') ? doc.documentElement.style.getPropertyValue('--mz-custom-bg') : null,
            ct: doc.body.classList.contains('mz-custom-colors') ? doc.documentElement.style.getPropertyValue('--mz-custom-text') : null
        };
        localStorage.setItem("mz_accessibility_settings", JSON.stringify(settings));
        updateActiveClasses();
    }

    function loadSettings() {
        applyLanguage(currentLang);
        const storedSettings = localStorage.getItem("mz_accessibility_settings");
        if (!storedSettings) { updateActiveClasses(); return; }

        const s = JSON.parse(storedSettings);
        if (s.g) doc.body.classList.add("mz_ac-grayscale");
        if (s.i) doc.body.classList.add("mz_ac-invert-colors");
        if (s.c) doc.body.classList.add("mz_ac-soft-contrast");
        if (s.n) doc.body.classList.add("mz_no-animations");
        if (s.h) doc.body.classList.add("mz_hide-media");
        if (s.hl) doc.body.classList.add("mz_ac-highlight-links");
        if (s.rf) doc.body.classList.add("mz_ac-readable-font");
        if (s.dy) doc.body.classList.add("mz_ac-dyslexia");
        if (s.bc) doc.body.classList.add("mz_ac-big-cursor");
        if (s.rm) { doc.body.classList.add("mz_ac-reading-mask"); updateMouseTracking(); }
        if (s.ht) doc.body.classList.add("mz_ac-highlight-titles");
        if (s.kn) doc.body.classList.add("mz_ac-keyboard-nav");
        if (s.ar) doc.body.classList.add("mz_ac-align-right");
        if (s.alft) doc.body.classList.add("mz_ac-align-left");
        if (s.ac) doc.body.classList.add("mz_ac-align-center");
        if (s.hs) doc.body.classList.add("mz_ac-high-saturation");
        if (s.ls) doc.body.classList.add("mz_ac-low-saturation");
        if (s.cb && s.ct) applyCustomColors(s.cb, s.ct);

        if (s.al) { doc.getElementById("mz_btn-show-alt").classList.add("active"); setTimeout(() => toggleAltText(true), 500); }
        if (s.mu) { doc.getElementById("mz_btn-mute-audio").classList.add("active"); setTimeout(() => toggleMute(true), 500); }

        if (s.f && s.f !== 1) { zoomSlider.value = Math.round(s.f * 100); setTimeout(() => applyFontSize(s.f, false), 100); }
        if (s.sp && s.sp !== 0) { spacingSlider.value = s.sp; applySpacing(s.sp); }
        if (s.lh && s.lh !== 1.5) { lhSlider.value = s.lh; applyLineHeight(s.lh); }

        if (s.s) {
            isSpeechActive = true;
            doc.addEventListener("click", () => {
                if (isSpeechActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
            }, { once: true });
        }
        if (s.m) { isMagnifierActive = true; doc.body.classList.add("mz_magnifier-active"); updateMouseTracking(); }

        updateActiveClasses();
    }

    let isDraggingMenu = false, pointerX, pointerY, dragHoldTimer, justToggled = false;
    iconBtn.onmousedown = iconBtn.ontouchstart = (e) => {
        if (e.button === 2) return;
        isDraggingMenu = false;
        let eventTarget = e.touches ? e.touches[0] : e;
        let rect = iconBtn.getBoundingClientRect();
        pointerX = eventTarget.clientX - rect.left; pointerY = eventTarget.clientY - rect.top;
        dragHoldTimer = setTimeout(() => { isDraggingMenu = true; iconBtn.style.transform = "scale(0.95)"; }, 300);

        doc.onmousemove = doc.ontouchmove = (moveEvent) => {
            if (!isDraggingMenu) return;
            let moveTarget = moveEvent.touches ? moveEvent.touches[0] : moveEvent;
            let newX = Math.max(0, Math.min(window.innerWidth - 60, moveTarget.clientX - pointerX));
            let newY = Math.max(0, Math.min(window.innerHeight - 60, moveTarget.clientY - pointerY));
            iconBtn.style.left = newX + "px"; iconBtn.style.top = newY + "px"; iconBtn.style.right = "auto"; iconBtn.style.bottom = "auto";

            if (CONFIG.theme !== 'sidebar') {
                let menuWidth = menu.offsetWidth || 360;
                menu.style.left = (newX < menuWidth ? newX : newX - (menuWidth - 60)) + "px";
                if (newY < window.innerHeight / 2) { menu.style.top = (newY + 75) + "px"; }
                else { menu.style.top = Math.max(0, newY - (menu.offsetHeight || 450) - 15) + "px"; }
                menu.style.right = "auto"; menu.style.bottom = "auto";
            }
        };

        doc.onmouseup = doc.ontouchend = () => {
            clearTimeout(dragHoldTimer); iconBtn.style.transform = "";
            doc.onmousemove = doc.ontouchmove = doc.onmouseup = doc.ontouchend = null;
            if (!isDraggingMenu) { justToggled = true; menu.classList.toggle("open"); setTimeout(() => { justToggled = false; }, 500); }
        };
    };

    iconBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); if (!isDraggingMenu && !justToggled) { menu.classList.toggle("open"); } };
    closeBtn.onclick = () => menu.classList.toggle("open");

    const bindToggleFeature = (btnId, className, excludeArr = []) => {
        doc.getElementById(btnId).onclick = () => {
            excludeArr.forEach(cls => doc.body.classList.remove(cls));
            doc.body.classList.toggle(className); saveSettings();
        };
    };

    bindToggleFeature("mz_btn-grayscale", "mz_ac-grayscale", ["mz_ac-high-saturation", "mz_ac-low-saturation"]);
    bindToggleFeature("mz_btn-invert", "mz_ac-invert-colors");
    bindToggleFeature("mz_btn-contrast", "mz_ac-soft-contrast");
    bindToggleFeature("mz_btn-high-saturation", "mz_ac-high-saturation", ["mz_ac-grayscale", "mz_ac-low-saturation"]);
    bindToggleFeature("mz_btn-low-saturation", "mz_ac-low-saturation", ["mz_ac-grayscale", "mz_ac-high-saturation"]);

    bindToggleFeature("mz_btn-readable-font", "mz_ac-readable-font", ["mz_ac-dyslexia"]);
    bindToggleFeature("mz_btn-dyslexia-font", "mz_ac-dyslexia", ["mz_ac-readable-font"]);
    bindToggleFeature("mz_btn-highlight-links", "mz_ac-highlight-links");
    bindToggleFeature("mz_btn-highlight-titles", "mz_ac-highlight-titles");

    bindToggleFeature("mz_btn-align-right", "mz_ac-align-right", ["mz_ac-align-left", "mz_ac-align-center"]);
    bindToggleFeature("mz_btn-align-left", "mz_ac-align-left", ["mz_ac-align-right", "mz_ac-align-center"]);
    bindToggleFeature("mz_btn-align-center", "mz_ac-align-center", ["mz_ac-align-right", "mz_ac-align-left"]);

    bindToggleFeature("mz_btn-big-cursor", "mz_ac-big-cursor");
    bindToggleFeature("mz_btn-keyboard-nav", "mz_ac-keyboard-nav");
    bindToggleFeature("mz_btn-media", "mz_hide-media");

    doc.getElementById("mz_btn-reading-mask").onclick = () => { doc.body.classList.toggle("mz_ac-reading-mask"); updateMouseTracking(); saveSettings(); };
    doc.getElementById("mz_btn-show-alt").onclick = (e) => { const btn = e.currentTarget; const isActive = !btn.classList.contains("active"); btn.classList.toggle("active", isActive); btn.setAttribute("aria-pressed", isActive ? "true" : "false"); toggleAltText(isActive); saveSettings(); };
    doc.getElementById("mz_btn-mute-audio").onclick = (e) => { const btn = e.currentTarget; const isActive = !btn.classList.contains("active"); btn.classList.toggle("active", isActive); btn.setAttribute("aria-pressed", isActive ? "true" : "false"); toggleMute(isActive); saveSettings(); };
    doc.getElementById("mz_btn-anim").onclick = () => { const isPaused = doc.body.classList.toggle("mz_no-animations"); doc.querySelectorAll("video").forEach(v => isPaused ? v.pause() : v.play()); saveSettings(); };

    zoomSlider.addEventListener('mousedown', () => isZoomDragging = true);
    zoomSlider.addEventListener('touchstart', () => isZoomDragging = true, { passive: true });

    const finishDrag = () => { if (isZoomDragging) { isZoomDragging = false; applyFontSize(zoomSlider.value / 100, false); saveSettings(); } };
    zoomSlider.addEventListener('mouseup', finishDrag);
    zoomSlider.addEventListener('touchend', finishDrag);
    zoomSlider.addEventListener('change', finishDrag);

    zoomSlider.oninput = (e) => { applyFontSize(e.target.value / 100, true); };

    spacingSlider.oninput = (e) => { applySpacing(e.target.value); saveSettings(); };
    function applySpacing(val) {
        spacingMult = parseFloat(val);
        if (spacingMult > 0) doc.body.classList.add("mz-dynamic-spacing"); else doc.body.classList.remove("mz-dynamic-spacing");
        doc.documentElement.style.setProperty('--mz-spacing-text', spacingMult);
        spacingVal.innerText = spacingMult === 0 ? (currentLang === 'he' ? "רגיל" : "Normal") : "+" + spacingMult;
    }

    lhSlider.oninput = (e) => { applyLineHeight(e.target.value); saveSettings(); };
    function applyLineHeight(val) {
        lineheightMult = parseFloat(val);
        if (lineheightMult !== 1.5) doc.body.classList.add("mz-dynamic-lineheight"); else doc.body.classList.remove("mz-dynamic-lineheight");
        doc.documentElement.style.setProperty('--mz-line-height', lineheightMult);
        lhVal.innerText = lineheightMult === 1.5 ? (currentLang === 'he' ? "רגיל" : "Normal") : lineheightMult + "x";
    }

    function applyFontSize(absoluteMultiplier, isDragging = false) {
        absoluteMultiplier = Math.min(MAX_FONT_MULT, Math.max(MIN_FONT_MULT, absoluteMultiplier));
        fontSizeMult = absoluteMultiplier;
        const percent = Math.round(absoluteMultiplier * 100);
        zoomVal.innerText = percent + "%";

        if (!isDragging) {
            doc.documentElement.style.setProperty('--mz-menu-scale', absoluteMultiplier);
        }

        doc.body.classList.remove(...Array.from(doc.body.classList).filter(c => c.startsWith('mz-font-size-') || c.startsWith('mz-text-size-')));
        doc.body.classList.add("mz-text-size-" + percent);

        if (CONFIG.pro && CONFIG.scriptCSS && CONFIG.scriptCSS.fontSize) {
            const map = CONFIG.scriptCSS.fontSize;
            const thresholds = Object.keys(map).map(Number).sort((a, b) => b - a);
            let sizeClass = 'default';
            for (const t of thresholds) { if (percent >= t) { sizeClass = map[t]; break; } }
            doc.body.classList.add('mz-font-size-' + sizeClass);
        }

        const rootFontSize = parseFloat(window.getComputedStyle(doc.documentElement).fontSize) || 16;

        const shouldIgnore = (el) => {
            if (el.closest('.mz-ignore') || el.closest('#mz_accessibility-icon')) return true;
            if (isDragging && el.closest('#mz_accessibility-menu')) return true;
            return false;
        };

        const textElements = Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, span, a, li, td, th, i, b, strong, em, button, select, label, input")).filter(el => !shouldIgnore(el));
        const visualElements = Array.from(doc.querySelectorAll("[class*='icon' i] svg, svg[class*='icon' i], [class*='ic-' i] svg, [class^='ic-' i] svg, [class*='ic_' i] svg, i svg, button svg, input[type='color'], .mz-color-preset, .mz-close-btn")).filter(el => !shouldIgnore(el));
        const allTargetElements = [...new Set([...textElements, ...visualElements])];

        allTargetElements.forEach(el => {
            if (!el.hasAttribute('data-mz-orig-trans')) el.setAttribute('data-mz-orig-trans', el.style.transition || '');
            el.style.setProperty('transition', 'none', 'important');
            if (el.style.fontSize && el.style.fontSize.includes('rem')) el.style.removeProperty('font-size');
            if (el.style.width && el.style.width.includes('rem')) { el.style.removeProperty('width'); el.style.removeProperty('height'); }
        });

        void doc.body.offsetHeight;

        const textMeasurements = textElements.map(el => ({ el, val: parseFloat(window.getComputedStyle(el).fontSize) }));
        const visualMeasurements = visualElements.map(el => ({ el, w: parseFloat(window.getComputedStyle(el).width), h: parseFloat(window.getComputedStyle(el).height) }));

        if (absoluteMultiplier !== 1) {
            textMeasurements.forEach(({ el, val }) => { if (val) el.style.setProperty('font-size', ((val * absoluteMultiplier) / rootFontSize) + "rem", "important"); });
            visualMeasurements.forEach(({ el, w, h }) => {
                if (w && h) {
                    el.style.setProperty('width', ((w * absoluteMultiplier) / rootFontSize) + "rem", "important");
                    el.style.setProperty('height', ((h * absoluteMultiplier) / rootFontSize) + "rem", "important");
                }
            });
        }

        setTimeout(() => {
            allTargetElements.forEach(el => {
                let origTrans = el.getAttribute('data-mz-orig-trans');
                if (origTrans) { el.style.setProperty('transition', origTrans); } else { el.style.removeProperty('transition'); }
                el.removeAttribute('data-mz-orig-trans');
            });
        }, 50);
    }

    doc.getElementById("mz_speech-btn").onclick = () => {
        isSpeechActive = !isSpeechActive;
        if (isSpeechActive) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        } else {
            window.speechSynthesis.cancel();
        }
        saveSettings();
    };
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

    function handleMouseMove(e) { doc.body.style.setProperty("--mouse-x", e.clientX + "px"); doc.body.style.setProperty("--mouse-y", e.clientY + "px"); }
    function updateMouseTracking() {
        if (isMagnifierActive || doc.body.classList.contains("mz_ac-reading-mask")) { doc.addEventListener("mousemove", handleMouseMove); }
        else { doc.removeEventListener("mousemove", handleMouseMove); }
    }

    doc.getElementById("mz_btn-magnifier").onclick = () => {
        isMagnifierActive = !isMagnifierActive; doc.body.classList.toggle("mz_magnifier-active", isMagnifierActive);
        if (!isMagnifierActive) doc.body.style.transform = "";
        updateMouseTracking(); saveSettings();
    };

    doc.getElementById("mz_btn-reset").onclick = () => {
        fontSizeMult = 1; isSpeechActive = false; spacingMult = 0; lineheightMult = 1.5;
        if (isMagnifierActive) { isMagnifierActive = false; doc.body.classList.remove("mz_magnifier-active"); doc.body.style.transform = ""; }

        doc.body.className = doc.body.className.split(' ').filter(c => !c.startsWith('mz_ac-') && !c.startsWith('mz-text-size-') && !c.startsWith('mz-font-size-') && c !== 'mz-custom-colors' && c !== 'mz-dynamic-spacing' && c !== 'mz-dynamic-lineheight').join(' ');

        doc.documentElement.style.removeProperty('--mz-size-text'); doc.documentElement.style.removeProperty('--mz-custom-bg'); doc.documentElement.style.removeProperty('--mz-custom-text');
        doc.documentElement.style.removeProperty('--mz-menu-scale');

        toggleAltText(false); toggleMute(false);
        doc.getElementById("mz_btn-show-alt").classList.remove("active"); doc.getElementById("mz_btn-mute-audio").classList.remove("active");

        updateMouseTracking(); applyFontSize(1, false); applySpacing(0); applyLineHeight(1.5);
        zoomSlider.value = 100; spacingSlider.value = 0; lhSlider.value = 1.5;
        if (textColorPicker) textColorPicker.value = "#000000"; if (bgColorPicker) bgColorPicker.value = "#ffffff";
        if (window.speechSynthesis) window.speechSynthesis.cancel();

        localStorage.removeItem("mz_accessibility_settings"); updateActiveClasses();
    };

    window.addEventListener("load", loadSettings);
    const allButtons = doc.querySelectorAll('[role="button"]');
    allButtons.forEach(btn => {
        if (!btn.hasAttribute('tabindex')) { btn.setAttribute('tabindex', '0'); }
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    });

})();
