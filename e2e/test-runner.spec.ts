import { expect, test, type Page } from '@playwright/test';

async function enterQuestions(page: Page) {
  const skip = page.getByRole('button', { name: /Bỏ qua, vào bài đọc|Đọc bài →/ });
  await expect(page.locator('header').or(skip)).toBeVisible();
  if (await skip.isVisible()) await skip.click();
}

test.beforeEach(async ({ page, request }) => {
  const seed = await request.post('/api/auth/register', {
    data: { username: 'giaovien', password: 'Giaovien@1234', displayName: 'Cô Hoa' },
  });
  expect([200, 409]).toContain(seed.status());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill('giaovien');
  await page.getByLabel('Mật khẩu').fill('Giaovien@1234');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto('/gv');
  await page.getByRole('checkbox').check();
});

test('Dải tiến độ có vùng chạm 40×40 và cuộn trong trang mobile', async ({ page }) => {
  for (const url of ['/day/1/test/mini1', '/day/2/test/de1']) {
    await page.goto(url);
    await enterQuestions(page);
    const dots = page.locator('header button');
    expect(await dots.count()).toBeGreaterThan(0);
    for (const dot of await dots.all()) {
      const box = await dot.boundingBox();
      expect.soft(box?.width).toBeGreaterThanOrEqual(40);
      expect.soft(box?.height).toBeGreaterThanOrEqual(40);
    }
    await dots.last().click();
    await enterQuestions(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    expect(await page.locator('header p').last().evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(20);
  }
});

test('Đề 1 ngày 2 giữ 32 số câu gốc; bonus không chiếm số và tiến độ', async ({ page }) => {
  await page.goto('/day/2/test/de1');
  await enterQuestions(page);
  const status = page.locator('header p').last();
  await expect.soft(status).toContainText('Câu 1/32');
  const dots = page.locator('header button');
  // Duyệt danh sách thực tế: nhãn Question phải liên tiếp dù có bonus xen giữa.
  let scored = 0;
  let bonus = 0;
  for (let i = 0; i < await dots.count(); i++) {
    await dots.nth(i).click();
    await enterQuestions(page);
    const extra = page.getByText('Câu luyện thêm · không tính điểm', { exact: true });
    if (await extra.isVisible()) {
      bonus++;
      await expect.soft(status).toContainText('Câu thêm');
      await expect.soft(page.getByText(/^Question \d+$/)).toHaveCount(0);
      // Chọn đáp án bonus không tăng số câu tính điểm đã làm.
      await page.locator('main section').getByRole('button').first().click();
      await expect.soft(status).toContainText('Đã làm 0');
    } else {
      scored++;
      await expect.soft(status).toContainText(`Câu ${scored}/32`);
      await expect.soft(page.getByText(`Question ${scored}`, { exact: true })).toBeVisible();
      const blank = (await page.getByRole('heading', { level: 1 }).innerText()).match(/blank \((\d+)\)/);
      if (blank) expect.soft(Number(blank[1])).toBe(scored);
    }
  }
  expect(scored).toBe(32);
  expect(bonus).toBeGreaterThan(0);
});


test('Đề 2 hai ngày giữ tổng câu và số Question', async ({ page }) => {
  for (const [day, total] of [[1, 18], [2, 20]]) {
    await page.goto(`/day/${day}/test/de2`);
    await expect(page.locator('header p').last()).toContainText(`Câu 1/${total}`);
    await expect(page.getByText('Question 1', { exact: true })).toBeVisible();
    const dots = page.locator('header button');
    await expect(dots).toHaveCount(total);
    await dots.last().click();
    await expect(page.locator('header p').last()).toContainText(`Câu ${total}/${total}`);
    await expect(page.getByText(`Question ${total}`, { exact: true })).toBeVisible();
    await expect(page.getByText('Câu luyện thêm · không tính điểm', { exact: true })).toHaveCount(0);
  }
});
