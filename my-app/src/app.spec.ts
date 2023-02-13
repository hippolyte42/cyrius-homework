import { test, expect } from '@playwright/test'
import { waitForResponse } from './tests/testUtils'

test.describe('app tests', () => {
    test('app should load', async ({ page }) => {
        await page.goto('/')

        await waitForResponse(page, '/orgs?')
        await waitForResponse(page, '/users?')
    })
})
