const { test, expect } = require("@playwright/test");

test("Server responds with the correct page layout", async ({ page }) => {
    const response = await page.goto("/lists");
    await expect(page).toHaveTitle("Shared shopping lists");
    await expect(page.locator("h1")).toHaveText("Shared shopping lists");

    // Has link to main page
    await expect(page.locator("h2").locator("a")).toHaveText("Main page");
});

test("Can create shopping lists", async ({ page }) => {
    await page.goto("/lists");
    await page.locator("b1").locator("input[type=text]").type("Test shopping list A");
    await page.locator("b1").locator("input[type=submit]").click();

    const n = await page.locator("li").locator("a").count();
    await expect(page.locator("li").locator("a").nth(n - 1)).toHaveText("Test shopping list A");

    await page.locator("b1").locator("input[type=text]").type("Test shopping list B");
    await page.locator("b1").locator("input[type=submit]").click();
    await expect(page.locator("li").locator("a").nth((n))).toHaveText("Test shopping list B");

    await page.locator("b1").locator("input[type=text]").type("Test shopping list C");
    await page.locator("b1").locator("input[type=submit]").click();
    await expect(page.locator("li").locator("a").nth(n + 1)).toHaveText("Test shopping list C");
});

test("Can move to specific new shopping list and has correct layout", async ({ page }) => {
    await page.goto("/lists");

    const list_name = "Test shopping list for moving to a specific list";
    await page.locator("b1").locator("input[type=text]").type(list_name);
    await page.locator("b1").locator("input[type=submit]").click();

    const n = await page.locator(`a >> text='${list_name}'`).count();
    await page.locator(`a >> text='${list_name}'`).nth(n - 1).click();
    await expect(page.locator("h3")).toHaveText(list_name);

    // Should have link back to /lists
    await expect(page.locator("h2").locator("a")).toHaveText("Shopping lists");
    await expect(page).toHaveTitle("Shared shopping lists");
    await expect(page.locator("h1")).toHaveText("Shared shopping lists");

    // List should be empty to begin with
    expect(await page.locator("li").count()).toEqual(0);
});

test("Can add items to a specific shopping list and added items are in alphabetical order", async ({ page }) => {
    await page.goto("/lists");

    const list_name = "Test shopping list adding items to a specific list";
    await page.locator("b1").locator("input[type=text]").type(list_name);
    await page.locator("b1").locator("input[type=submit]").click();

    const n = await page.locator(`a >> text='${list_name}'`).count();
    await page.locator(`a >> text='${list_name}'`).nth(n - 1).click();

    await page.locator("b1").locator("input[type=text]").type("Item B");
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type("Item C");
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type("Item A");
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type("Item D");
    await page.locator("b1").locator("input[type=submit]").click();

    // Check alphabetical order
    await expect(page.locator("item").nth(0)).toHaveText("Item A");
    await expect(page.locator("item").nth(1)).toHaveText("Item B");
    await expect(page.locator("item").nth(2)).toHaveText("Item C");
    await expect(page.locator("item").nth(3)).toHaveText("Item D");
});

test ("Can collect items and collected items are striked through + in alphabetical order",  async ({ page }) => {
    await page.goto("/lists");

    const list_name = "Test shopping list collecting items";
    await page.locator("b1").locator("input[type=text]").type(list_name);
    await page.locator("b1").locator("input[type=submit]").click();

    const n = await page.locator(`a >> text='${list_name}'`).count();
    await page.locator(`a >> text='${list_name}'`).nth(n - 1).click();

    await page.locator("b1").locator("input[type=text]").type("Item B");
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type("Item C");
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type("Item A");
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type("Item D");
    await page.locator("b1").locator("input[type=submit]").click();

    // Collect Item C and then Item B
    await page.locator("li").nth(3).locator("input[type=submit]").click();
    await page.locator("li").nth(1).locator("input[type=submit]").click();

    await expect(page.locator("del").nth(0)).toHaveText("Item B");
    await expect(page.locator("del").nth(1)).toHaveText("Item D");
});

test ("Can deactivate lists",  async ({ page }) => {
    await page.goto("/lists");

    const list_1 = "1. Test shopping list deactivation";
    const list_2 = "2. Test shopping list deactivation";
    const list_3 = "3. Test shopping list deactivation";
    const list_4 = "4. Test shopping list deactivation";

    //Get initial lists
    const initial_lists = await page.locator("li").locator("a");
    const n = await page.locator("li").count();

    await page.locator("b1").locator("input[type=text]").type(list_1);
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type(list_2);
    await page.locator("b1").locator("input[type=submit]").click();
    
    await page.locator("b1").locator("input[type=text]").type(list_3);
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("b1").locator("input[type=text]").type(list_4);
    await page.locator("b1").locator("input[type=submit]").click();

    await page.locator("li").locator("input[type=submit]").nth(n).click();
    await page.locator("li").locator("input[type=submit]").nth(n).click();
    await page.locator("li").locator("input[type=submit]").nth(n).click();
    await page.locator("li").locator("input[type=submit]").nth(n).click();

    const n_after_deactivations = await page.locator("li").count();
    const lists_after_deactivation = await page.locator("li").locator("a");
    await expect(n_after_deactivations).toEqual(n);

    // Check that only the original lists remain
    for (let i = 0; i < n_after_deactivations; i++) {
        const current = await lists_after_deactivation.nth(i);
        const original = await initial_lists.nth(i).textContent();
        await expect(current).toHaveText(original);
    }
});