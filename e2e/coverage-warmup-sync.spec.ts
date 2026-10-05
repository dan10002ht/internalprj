import { test, expect, type Page } from '@playwright/test';
import { days } from '../src/data';
import type { StudentProgress } from '../src/types';

const emptyMessage = 'Không có từ nào đến hạn ôn hôm nay. Bạn vào thẳng Mini 1 nhé.';
const warmupUrl = '/day/2/test/warmup';
const words = days[0].vocab.slice(0, 3);

async function setup(page: Page, due = false) {
  const response = await page.request.post('/api/auth/register', { data: {
    username: `sync.${Date.now()}`, password: 'Warmup@1234', displayName: 'Warmup Sync',
  } });
  expect(response.ok()).toBe(true);
  const { user } = await response.json();
  const progress: StudentProgress = {
    studentId: user.id, studentName: user.displayName, sections: {}, vocabMastery: {},
    wordBook: [], wrongBank: [], totalTimeSpent: 0, updatedAt: '2000-01-01T00:00:00.000Z',
  };
  if (due) progress.vocabMastery = Object.fromEntries(words.map(v => [v.word, {
    correct: 0, wrong: 1, streak: 0, hint3Used: false, mastered: false,
    level: 1, nextReviewAt: '2000-01-01',
  }]));
  expect((await page.request.put('/api/progress', { data: { progress } })).ok()).toBe(true);
  await page.goto(warmupUrl);
  await expect(due ? page.getByRole('heading', { level: 1 }) : page.getByText(emptyMessage)).toBeVisible();
  return progress;
}

test('Warm-up: cùng trình duyệt chờ bản server mới hơn trước khi chọn từ', async ({ page }) => {
  const progress = await setup(page);
  const local = await page.evaluate(() => JSON.parse(localStorage.getItem('td-english:v2')!).state);
  expect(local.ownerId).toBeTruthy();
  expect(local.student.vocabMastery).toEqual({});
  const newer = { ...progress, vocabMastery: Object.fromEntries(words.map(v => [v.word, {
    correct: 0, wrong: 1, streak: 0, hint3Used: false, mastered: false,
    level: 1, nextReviewAt: '2000-01-01',
  }])) };
  expect((await page.request.put('/api/progress', { data: { progress: newer } })).ok()).toBe(true);
  // Keep the real GET in flight so persisted ownerId cannot win the race.
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/progress', async route => {
    if (route.request().method() !== 'GET') return route.continue();
    const response = await route.fetch();
    await held;
    await route.fulfill({ response });
  });
  try {
    await page.goto(warmupUrl);
    await expect(page.getByText('Đang tải…', { exact: true })).toBeVisible();
    await expect(page.getByText(emptyMessage)).toHaveCount(0);
  } finally { release(); }
  await expect(page.locator('header')).toContainText('Câu 1/3');
  for (let i = 0; i < words.length; i++) {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(words[i].word);
    await page.locator('main div.grid button').first().click();
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    await page.getByRole('button', { name: i < 2 ? 'Câu tiếp →' : 'Xong', exact: true }).click();
  }
  await expect(page.getByText(/Những từ bạn còn sai sẽ được hỏi lại/)).toBeVisible();
});

test('Warm-up: timeout dùng bản local và giữ pool đang làm', async ({ page }) => {
  const progress = await setup(page, true);
  expect((await page.request.put('/api/progress', { data: { progress: { ...progress, vocabMastery: {} } } })).ok()).toBe(true);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/progress', async route => {
    if (route.request().method() !== 'GET') return route.continue();
    const response = await route.fetch();
    await held;
    await route.fulfill({ response }).catch(() => {});
  });
  try {
    await page.goto(warmupUrl);
    await expect(page.getByText('Đang tải…', { exact: true })).toBeVisible();
    await expect(page.locator('header')).toContainText('Câu 1/3', { timeout: 7000 });
    await page.locator('main div.grid button').first().click();
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    await page.getByRole('button', { name: 'Câu tiếp →', exact: true }).click();
    release();
    await expect.poll(async () => page.evaluate(() =>
      JSON.parse(localStorage.getItem('td-english:v2')!).state.student.vocabMastery,
    )).toEqual({});
    await expect(page.locator('header')).toContainText('Câu 2/3');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(words[1].word);
    await expect(page.getByText(emptyMessage)).toHaveCount(0);
  } finally { release(); }
});

test('Warm-up: lỗi mạng vẫn mở được bản local không có từ đến hạn', async ({ page }) => {
  await setup(page);
  await page.route('**/api/progress', route => route.abort('internetdisconnected'));
  await page.goto(warmupUrl);
  await expect(page.getByText(emptyMessage)).toBeVisible({ timeout: 7000 });
});

test('Warm-up: GET lỗi được thử lại và mở PUT khi mạng trở lại trong cùng phiên SPA', async ({ page }) => {
  await setup(page, true);
  let failedGets = 0;
  let recoveredGets = 0;
  let putCount = 0;
  let offline = true;
  await page.route('**/api/progress', route => {
    if (route.request().method() === 'GET') {
      if (offline) {
        failedGets++;
        return route.abort('internetdisconnected');
      }
      recoveredGets++;
    } else {
      putCount++;
      if (offline) return route.abort('internetdisconnected');
    }
    return route.continue();
  });
  await page.goto(warmupUrl);
  await expect(page.locator('header')).toContainText('Câu 1/3');
  await page.evaluate(() => { (window as Window & { spaMarker?: string }).spaMarker = 'same-document'; });
  for (let i = 0; i < words.length; i++) {
    // Deliberately miss each word so it remains due for the next Warm-up.
    const correct = words[i].meaningVi;
    await page.locator('main div.grid button').filter({ hasNotText: correct }).first().click();
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    await page.getByRole('button', { name: i < 2 ? 'Câu tiếp →' : 'Xong', exact: true }).click();
  }
  await expect(page.getByText(/Những từ bạn còn sai sẽ được hỏi lại/)).toBeVisible();
  expect(failedGets).toBeGreaterThan(0);
  expect(putCount).toBe(0);
  offline = false;
  // No reload or explicit online event: the backoff alone must recover GET.
  await expect.poll(() => recoveredGets, { timeout: 35_000 }).toBeGreaterThan(0);
  await page.getByRole('link', { name: 'Vào bài học →', exact: true }).click();
  await page.locator(`a[href="${warmupUrl}"]`).click();
  await expect(page.locator('header')).toContainText('Câu 1/3');
  for (let i = 0; i < words.length; i++) {
    await page.locator('main div.grid button').first().click();
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    await page.getByRole('button', { name: i < 2 ? 'Câu tiếp →' : 'Xong', exact: true }).click();
  }
  await expect.poll(async () => {
    const { progress } = await (await page.request.get('/api/progress')).json();
    return progress?.sections['2:warmup']?.attempts;
  }).toBe(2);
  expect(putCount).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as Window & { spaMarker?: string }).spaMarker)).toBe('same-document');
});


test('Warm-up: GET muộn không cho local cũ ghi đè tiến độ server', async ({ page }) => {
  const progress = await setup(page, true);
  const newer: StudentProgress = {
    ...progress, totalTimeSpent: 999,
    wordBook: [{ word: 'MARKER', dayId: 1, source: 'marked', addedAt: new Date().toISOString() }],
  };
  expect((await page.request.put('/api/progress', { data: { progress: newer } })).ok()).toBe(true);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  let putCount = 0;
  await page.route('**/api/progress', async route => {
    if (route.request().method() !== 'GET') {
      putCount++;
      return route.continue();
    }
    const response = await route.fetch();
    await held;
    await route.fulfill({ response }).catch(() => {});
  });
  const readServer = async () => (await (await page.request.get('/api/progress')).json()).progress as StudentProgress;
  try {
    await page.goto(warmupUrl);
    await expect(page.locator('header')).toContainText('Câu 1/3', { timeout: 7000 });
    for (let i = 0; i < words.length; i++) {
      await page.locator('main div.grid button').first().click();
      await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
      await page.getByRole('button', { name: i < 2 ? 'Câu tiếp →' : 'Xong', exact: true }).click();
    }
    await expect(page.getByText(/Những từ bạn còn sai sẽ được hỏi lại/)).toBeVisible();
    // Allow the existing PUT debounce to fire while GET is still held.
    await page.waitForTimeout(1600);
    expect((await readServer()).totalTimeSpent).toBe(999);
    expect(putCount).toBe(0);
    release();
    await expect.poll(async () => page.evaluate(() =>
      JSON.parse(localStorage.getItem('td-english:v2')!).state.student.totalTimeSpent,
    )).toBe(999);
    // A real subsequent change must save the hydrated server data too.
    await page.goto(warmupUrl);
    const saved = page.waitForResponse(response =>
      response.url().endsWith('/api/progress') && response.request().method() === 'PUT' && response.ok(),
    );
    await expect(page.locator('header')).toContainText('Câu 1/3');
    for (let i = 0; i < words.length; i++) {
      await page.locator('main div.grid button').first().click();
      await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
      await page.getByRole('button', { name: i < 2 ? 'Câu tiếp →' : 'Xong', exact: true }).click();
    }
    await saved;
    expect(putCount).toBeGreaterThan(0);
    await expect.poll(async () => (await readServer()).wordBook.some(entry => entry.word === 'MARKER')).toBe(true);
    expect((await readServer()).totalTimeSpent).toBeGreaterThanOrEqual(999);
  } finally { release(); }
});
