import { expect, test} from '@playwright/test';
import { TIMEOUT } from 'dns';


  //Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully
test('Login multiple times sucessfully @c1', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge1.html']`).click();
  // Login multiple times
  for (let i = 1; i <= 3; i++) {
    await page.locator('#email').fill(`test${i}@example.com`);
    await page.locator('#password').fill(`password${i}`);
    await page.locator('#submitButton').click();
    await expect(page.locator('#successMessage')).toBeVisible();
    await expect (page.getByText(`Successfully submitted!`)).toBeVisible;
    await expect (page.getByText(`Email: test${i}@example.com`)).toBeVisible;
    await expect (page.getByText(`Password: password${i}`)).toBeVisible;
    await page.locator('#successMessage').waitFor({ state: 'hidden' })  // Wait for the success message to disappear before proceeding to the next iteration
  }
}); 

// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge2.html']`).click();
  await page.locator('#email').fill(`test1@example.com`);
  await page.locator('#password').fill(`password1`);
  const submitButton = await page.locator('#submitButton');
   //Wait for the animation to complete by listening for animationend event
   await submitButton.evaluate((button) => {
     return new Promise((resolve) => {
      button.addEventListener('animationend', resolve, { once: true });
                                     });
                                });
  await submitButton.click();
  await expect(page.locator('#dashboard')).toBeVisible();  //dynamic wait for menu button 
  await expect(page.locator('#menuButton')).toBeVisible();
  await page.locator('#menuButton').click();
  await expect(page.locator('accountMenu')).toBeVisible;
  await page.locator('#logoutOption').click();
  await expect(page.locator('#loginForm')).toBeVisible();
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge3.html']`).click();
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible(); // verify user is redirected to reset password page
  await page.locator('#email').fill('test@example.com');
  await page.getByRole('button', { name: 'Reset Password' }).click();
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible();
  await expect(page.locator('#mainContent')).toContainText('Password reset link sent!');
});


//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
// Declare a global variable that can be used to check if the app is ready
declare global {  
  interface Window {
    isAppReady: boolean;
  }
}
test('Login and logout @c4', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge4.html']`).click();
   // Wait for the app to be ready using the global variable `isAppReady`
  await page.waitForFunction(() => window.isAppReady === true); 
  await page.locator('#email').fill(`test@example.com`);
  await page.locator('#password').fill(`password`);
  await page.locator('#submitButton').click();
  await expect (page.locator('#profileButton')).toBeVisible();
  page.locator('#profileButton').click();
  await page.locator('#logoutOption').click();
  await expect(page.locator('#loginForm')).toBeVisible();
});
