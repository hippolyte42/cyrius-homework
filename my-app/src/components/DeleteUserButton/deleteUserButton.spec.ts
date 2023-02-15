import { test, expect } from '@playwright/test'
import { waitForResponse } from '../../tests/testUtils'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('deleteUserButton', () => {
    test('user deleted', async ({ page }) => {
        await waitForResponse(page, '/users?')
        const ogFirstRowUserFirstName = await page
            .locator('td')
            .first()
            .innerText()

        await page.locator(`td > button`).first().click()
        await page.locator('#deleteUserButton').click()

        await waitForResponse(page, '/users/')

        const newFirstRowUserFirstName = await page
            .locator('td')
            .first()
            .innerText()
        expect(newFirstRowUserFirstName !== ogFirstRowUserFirstName)
    })
})
