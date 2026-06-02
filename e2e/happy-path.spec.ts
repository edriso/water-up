import { expect, test } from '@playwright/test';

test('start nudges, drink, stand, and the counts persist', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const heading = page.getByText('Water + Up');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('opacity', '1');

  await page.getByRole('button', { name: 'Start nudges' }).click();
  await page.clock.runFor(45 * 60 * 1000);
  await expect(page.getByRole('heading', { name: 'Water break.' })).toBeVisible();
  await page.getByRole('button', { name: /I drank/ }).click();
  await expect(page.getByRole('heading', { name: 'On your feet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Done early' }).click();

  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText('stand breaks')).toBeVisible();
});
