import { Page } from '@playwright/test'

export const waitForResponse = async (
    page: Page,
    urlKeyWord: string,
    expectedBody?: string
) => {
    return page.waitForResponse((response) => {
        if (response.status() === 200 && response.url().includes(urlKeyWord)) {
            if (!expectedBody) {
                return true
            } else {
                return response.json().then((body) => {
                    return JSON.stringify(body) === expectedBody
                })
            }
        }
        return false
    })
}
