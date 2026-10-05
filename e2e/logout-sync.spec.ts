import { expect, test, type Page } from '@playwright/test';

async function login(page: Page, username: string) {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu').fill('Student@1234');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  const userId = await page.evaluate(async () => (await (await fetch('/api/auth/me')).json()).user.id);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('td-english:v2')!).state.ownerId)).toBe(userId);
}

for (const scenario of ['pending', 'in-flight', 'offline', 'unresponsive-pending', 'unresponsive-in-flight'] as const) {
  test(`logout sync: ${scenario}, không gửi tiến độ sang tài khoản khác`, async ({ page, request }) => {
    await request.post('/api/auth/register', { data: { username: 'giaovien', password: 'Giaovien@1234', displayName: 'Giáo viên' } });
    await request.post('/api/auth/login', { data: { username: 'giaovien', password: 'Giaovien@1234' } });
    const users = [`sync.a.${Date.now()}`, `sync.b.${Date.now()}`];
    for (const username of users) {
      expect((await request.post('/api/teacher/students', { data: { username, password: 'Student@1234', displayName: username } })).ok()).toBeTruthy();
    }
    await login(page, users[0]);
    await page.goto('/day/1/test/mini1');
    await expect(page.getByRole('button', { name: 'Kiểm tra', exact: true })).toBeVisible();
    const dots = page.locator('header button[title^="Câu "]');
    for (let i = 0; i < await dots.count(); i++) {
      await dots.nth(i).click();
      if (await page.getByRole('heading', { name: 'A conservative person is someone who ______.' }).count()) break;
    }
    await page.getByRole('button', { name: /is always willing to try new things/ }).click();
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    page.on('dialog', dialog => void dialog.accept());
    // Use a fixed origin without pauseAt(new Date()), which can race into the past.
    await page.clock.install({ time: new Date('2026-10-05T00:00:00Z') });
    const errors: string[] = [];
    const unauthorized: number[] = [];
    const putsAfterLogout: string[] = [];
    let loggedOut = false;
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => {
      if (r.url().includes('/api/progress') && r.status() === 401) unauthorized.push(r.status());
      if (r.url().includes('/api/auth/logout')) loggedOut = true;
    });
    page.on('request', r => {
      if (r.url().includes('/api/auth/login')) loggedOut = false;
      if (loggedOut && r.url().includes('/api/progress') && r.method() === 'PUT') putsAfterLogout.push(r.url());
    });
    let releaseSave: (() => void) | undefined;
    let saveStarted = false;
    if (scenario === 'in-flight' || scenario.startsWith('unresponsive')) {
      const hold = new Promise<void>(resolve => { releaseSave = resolve; });
      await page.route('**/api/progress', async route => {
        if (route.request().method() !== 'PUT') return route.continue();
        saveStarted = true;
        await hold;
        if (scenario.startsWith('unresponsive')) {
          // The client deadline may already have canceled this held request.
          await route.abort().catch(() => {});
        } else {
          await route.continue();
        }
      });
    } else if (scenario === 'offline') {
      await page.route('**/api/progress', route => route.request().method() === 'PUT' ? route.abort('internetdisconnected') : route.continue());
    }
    await page.getByRole('button', { name: 'Nộp bài', exact: true }).first().click();
    if (scenario === 'in-flight' || scenario === 'unresponsive-in-flight') {
      await page.clock.runFor(1200);
      await expect.poll(() => saveStarted).toBe(true);
    }
    await page.getByRole('link', { name: 'Về ngày học', exact: true }).click();
    let removedWord: string | undefined;
    if (scenario === 'in-flight') {
      await page.getByRole('link', { name: 'Các ngày học' }).click();
      await page.getByRole('link', { name: /Sổ từ/ }).click();
      removedWord = await page.evaluate(() => JSON.parse(localStorage.getItem('td-english:v2')!).state.student.wordBook[0].word);
    }
    const logoutStarted = Date.now();
    await page.getByRole('button', { name: 'Đăng xuất' }).click();
    if (scenario === 'in-flight') {
      expect(loggedOut).toBe(false);
      await expect(page.getByRole('button', { name: 'Đang lưu…', exact: true })).toBeDisabled();
      await page.getByRole('button', { name: 'Bỏ khỏi sổ', exact: true }).first().click();
      releaseSave!();
    }
    if (scenario.startsWith('unresponsive')) {
      await expect(page.getByRole('button', { name: 'Đang lưu…', exact: true })).toBeDisabled();
      await expect(page).toHaveURL(/\/login$/, { timeout: 4000 });
      expect(Date.now() - logoutStarted).toBeLessThan(4000);
      releaseSave!();
      await page.unrouteAll({ behavior: 'wait' });
      const local = await page.evaluate(() => JSON.parse(localStorage.getItem('td-english:v2')!).state);
      expect(local.student.sections['1:mini1'].attempts).toBe(1);
    }
    await expect(page).toHaveURL(/\/login$/);
    await page.clock.runFor(2500);
    expect(unauthorized).toEqual([]);
    expect(putsAfterLogout).toEqual([]);
    expect(errors.filter(message => scenario !== 'offline' || !message.includes('ERR_INTERNET_DISCONNECTED'))).toEqual([]);
    if (scenario === 'offline') {
      const local = await page.evaluate(() => JSON.parse(localStorage.getItem('td-english:v2')!).state);
      expect(local.ownerId).toBeTruthy();
      expect(local.student.sections['1:mini1'].attempts).toBe(1);
      await page.unroute('**/api/progress');
    }
    await login(page, users[0]);
    const progress = await page.evaluate(async () => (await (await fetch('/api/progress')).json()).progress);
    if (scenario === 'offline' || scenario.startsWith('unresponsive')) {
      expect(progress).toBeNull();
      const local = await page.evaluate(() => JSON.parse(localStorage.getItem('td-english:v2')!).state.student);
      expect(local.sections['1:mini1'].attempts).toBe(1);
    } else {
      expect(progress.sections['1:mini1'].attempts).toBe(1);
      if (removedWord) expect(progress.wordBook.map((entry: { word: string }) => entry.word)).not.toContain(removedWord);
    }
    await page.getByRole('button', { name: 'Đăng xuất' }).click();
    await login(page, users[1]);
    await page.clock.runFor(2500);
    const other = await page.evaluate(async () => (await (await fetch('/api/progress')).json()).progress);
    expect(other?.sections ?? {}).toEqual({});
    expect(unauthorized).toEqual([]);
    expect(putsAfterLogout).toEqual([]);
  });
}
