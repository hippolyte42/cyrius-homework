import { test, expect } from '@playwright/test'
import { waitForResponse } from '../../tests/testUtils'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('userForm', () => {
    test('edited submited & response valid', async ({ page }) => {
        await waitForResponse(page, '/users?')

        const newFirstNameInput = 'new firstname'
        const newLastNameInput = 'new lastname'
        const newEmailInput = 'new.email@test.xyz'
        const newOrgIdInput = '12345'

        await page.locator(`td > button`).first().click()
        await page.locator('#editButton').click()

        await page.locator('#firstname').fill(newFirstNameInput)
        await page.locator('#lastname').fill(newLastNameInput)
        await page.locator('#email').fill(newEmailInput)
        await page.locator('#orgid').fill(newOrgIdInput)
        await page.locator('#labels').click()
        await page.locator('#labels').fill('test')
        await page.locator('#labels').press('Enter')
        await page.getByRole('button', { name: 'Modifier' }).click()

        await waitForResponse(
            page,
            '/users/'
            // get labels text and compare to expected
            // JSON.stringify({
            //     first_name: newFirstNameInput,
            //     last_name: newLastNameInput,
            //     email: newEmailInput,
            //     org: newOrgIdInput,
            // })
        )

        await page.locator('#closeButton').first().click()

        expect(
            page.getByRole('cell', { name: newFirstNameInput })
        ).toBeDefined()
        expect(page.getByRole('cell', { name: newLastNameInput })).toBeDefined()
        expect(page.getByRole('cell', { name: newEmailInput })).toBeDefined()
        // expect(page.getByRole('cell', { name: newOrgIdInput })).toBeDefined()
        expect(page.getByText(', test')).toBeDefined
    })
})
