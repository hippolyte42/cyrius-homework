import { test, expect } from '@playwright/test'
import { waitForResponse } from '../../tests/testUtils'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('userForm should work', () => {
    test('should edit user', async ({ page }) => {
        await waitForResponse(page, '/users?', '')

        await page.locator(`td > button`).first().click()
        await page.locator('#editButton').click()

        await Promise.all([
            page.locator('#firstname').fill('new firstname'),
            page.locator('#lastname').fill('new lastname'),
            page.locator('#email').fill('new.email@test.xyz'),
            page.locator('#orgid').fill('12345'),
            page.locator('#labels').click(),
            page.locator('#labels').fill('test'),
            page.locator('#labels').press('Enter'),
            page.getByRole('button', { name: 'Modifier' }).click(),
        ])

        // todo: check response for edited user data
        await waitForResponse(page, '/users/')

        // todo close menu button
        await page.getByRole('button').first().click()

        expect(page.getByRole('cell', { name: 'new firstname' })).toBeDefined()
        expect(page.getByRole('cell', { name: 'new lastname' })).toBeDefined()
        expect(
            page.getByRole('cell', { name: 'new.email@test.xyz' })
        ).toBeDefined()
        // todo orgid
        // expect(page.getByRole('cell', { name: '12345' })).toBeDefined()

        // todo labels
        // await page
        //     .getByRole('cell', {
        //         name: 'Yadira, Dino, Tillman, Reinhold, Myrtice, test',
        //     })
        //     .click()
    })
})
