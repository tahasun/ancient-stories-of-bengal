import { makeAutoObservable, observable } from "mobx";
import { Lang } from "../types";
import i18n from "../react-i18next";

export const languages: Record<string, Lang> = {
    en: { name: "English", code: "en", tongue: "ENG" },
    bn: { name: "Bangla", code: "bn", tongue: "বাংলা" },
};

class UIStore {
    curLangCode: string;

    constructor() {
        this.curLangCode = i18n.resolvedLanguage ?? 'en';
        makeAutoObservable(this, {
            curLangCode: observable,
        })
    }

    switchLang(langCode: string){
        i18n.changeLanguage(langCode);
        this.curLangCode = langCode;
    }

    getResolvedLang() {
        return i18n.resolvedLanguage;
    }
}

export const uiStore = new UIStore();