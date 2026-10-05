import { expect, test, type Locator, type Page } from '@playwright/test';

async function login(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function touchTargets(buttons: Locator) {
  expect(await buttons.count()).toBeGreaterThan(0);
  for (const button of await buttons.all()) {
    const box = await button.boundingBox();
    expect.soft(box?.height, await button.innerText()).toBeGreaterThanOrEqual(40);
    expect.soft(box?.width, await button.innerText()).toBeGreaterThanOrEqual(40);
  }
}

test('Giáo viên tạo học sinh; học sinh luyện Mini 1 và kiểm tra mobile', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Test độc lập vẫn chạy được; app.spec đã tạo giáo viên thì API trả 409.
  const seed = await request.post('/api/auth/register', {
    data: { username: 'giaovien', password: 'Giaovien@1234', displayName: 'Cô Hoa' },
  });
  expect([200, 409]).toContain(seed.status());
  const meRequests: string[] = [];
  page.on('request', r => { if (r.url().includes('/api/auth/me')) meRequests.push(r.url()); });
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible();
  expect.soft(meRequests).toHaveLength(0);
  await login(page, 'giaovien', 'Giaovien@1234');
  await page.getByRole('link', { name: 'Giáo viên', exact: true }).click();
  const username = `e2e.${Date.now()}`;
  await page.getByRole('button', { name: '+ Tạo tài khoản' }).click();
  await page.getByLabel('Tên học sinh').fill('Học sinh E2E');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu').fill('Student@1234');
  await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  await expect(page.getByText(`Đã tạo tài khoản "${username}".`, { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Đăng xuất' }).click();
  await login(page, username, 'Student@1234');
  const teacherRequests: string[] = [];
  page.on('request', r => { if (r.url().includes('/api/teacher/students')) teacherRequests.push(r.url()); });
  await page.goto('/gv');
  await expect(page.getByText('Trang này chỉ dành cho giáo viên.')).toBeVisible();
  expect.soft(teacherRequests).toHaveLength(0);
  await page.goto('/day/1/test/mini1');
  await expect(page.getByRole('button', { name: 'Kiểm tra', exact: true })).toBeVisible();
  const status = page.locator('header p').filter({ hasText: 'Luyện tập' });
  expect.soft(await status.evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(20);
  expect.soft(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  // Chọn câu trắc nghiệm để tái hiện dùng hint nhưng điểm thô = điểm sau hint (đều 0).
  const dots = page.locator('header button[title^="Câu "]');
  for (let i = 0; i < await dots.count(); i++) {
    await dots.nth(i).click();
    if (await page.getByRole('heading', { name: 'A conservative person is someone who ______.' }).count()) break;
  }
  await page.getByRole('button', { name: /is always willing to try new things/ }).click();
  await page.getByRole('button', { name: /Xem gợi ý/ }).click();
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
  page.on('dialog', dialog => void dialog.accept());
  const submit = page.getByRole('button', { name: 'Nộp bài', exact: true });
  await expect(submit.first()).toBeVisible();
  await submit.first().click();
  await expect(page.getByText('câu đúng', { exact: true })).toBeVisible();
  await expect(page.getByText(/Nếu tự làm hết/)).toHaveCount(0);
  await page.goto('/dashboard');
  await expect(page.locator('a[href="/day/1"]')).toContainText(/Đang luyện.*tốt nhất/);
  await page.reload();
  await expect(page.locator('a[href="/day/1"]')).toContainText(/Đang luyện.*tốt nhất/);
  await page.goto('/wordbook');
  await touchTargets(page.locator('main button'));
  await expect(page.getByRole('button', { name: 'Bỏ khỏi sổ', exact: true }).first()).toBeVisible();
  await page.goto('/day/1/vocab');
  await touchTargets(page.locator('main button'));
  await page.getByRole('button', { name: '📋 Danh sách' }).click();
  await touchTargets(page.getByRole('button', { name: /^Nghe / }));
  for (const name of ['Tất cả', 'Từ đơn', 'Cụm từ']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.locator('main')).not.toContainText('Application error');
  }
});
