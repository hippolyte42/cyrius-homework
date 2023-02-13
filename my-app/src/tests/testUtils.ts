import { Page } from '@playwright/test'

export const waitForResponse = async (
    page: Page,
    urlKeyWord: string,
    bodyKeyWord?: string
) => {
    return page.waitForResponse((response) => {
        if (response.status() === 200 && response.url().includes(urlKeyWord)) {
            if (!bodyKeyWord) {
                return true
            } else {
                return response.text().then((body) => {
                    return body.indexOf('errors') > -1
                        ? false
                        : body.indexOf('bodyKeyWord') > -1
                })
            }
        }
        return false
    })
}
