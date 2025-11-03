// A base page object class
export default class Page {
    public open (path: string) {
        return browser.url(`/${path}`)
    }
}