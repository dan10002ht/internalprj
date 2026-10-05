import { test, expect, type Page } from '@playwright/test';
import type { StudentProgress } from '../src/types';

async function register(page: Page) {
  const response = await page.request.post('/api/auth/register', { data: {
    username: `newdevice.${Date.now()}`, password: 'Newdevice@1234', displayName: 'New Device',
  } });
  expect(response.ok()).toBe(true);
  return (await response.json()).user;
}

const localStudent = (page: Page) => page.evaluate(() =>
  JSON.parse(localStorage.getItem('td-english:v2')!).state.student as StudentProgress,
);
const serverStudent = async (page: Page): Promise<StudentProgress> =>
  (await (await page.request.get('/api/progress')).json()).progress;

async function submitMini(page: Page) {
  await page.goto('/day/1/test/mini1');
  await expect(page.getByRole('button', { name: 'Kiểm tra', exact: true })).toBeVisible();
  const dots = page.locator('header button[title^="Câu "]');
  await dots.last().click();
  // Practice permits submitting the last question without answering it.
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Nộp bài', exact: true }).click();
  await expect(page.getByText('Theo từng dạng bài')).toBeVisible();
}

test('Máy mới: GET đầu lỗi, retry lấy t:999 và PUT tiếp giữ MARKER', async ({ page }) => {
  const user = await register(page);
  const progress: StudentProgress = {
    studentId: user.id, studentName: user.displayName, sections: {}, vocabMastery: {},
    lookups: {}, wordBook: [{ word: 'MARKER', dayId: 1, source: 'marked', addedAt: '2000-01-01T00:00:00.000Z' }],
    wrongBank: [], totalTimeSpent: 999, updatedAt: '2000-01-01T00:00:00.000Z',
  };
  expect((await page.request.put('/api/progress', { data: { progress } })).ok()).toBe(true);
  let offline = true;
  let failedGets = 0;
  let recoveredGets = 0;
  let puts = 0;
  await page.route('**/api/progress', route => {
    if (route.request().method() === 'GET') {
      if (offline) { failedGets++; return route.abort('internetdisconnected'); }
      recoveredGets++;
    } else { puts++; }
    return route.continue();
  });
  await page.goto('/day/2/test/warmup');
  await expect(page.getByText('Không có từ nào đến hạn ôn hôm nay. Bạn vào thẳng Mini 1 nhé.')).toBeVisible();
  expect(failedGets).toBeGreaterThan(0);
  expect((await localStudent(page)).totalTimeSpent).toBe(0);
  expect(puts).toBe(0);
  offline = false;
  await expect.poll(() => recoveredGets, { timeout: 15_000 }).toBeGreaterThan(0);
  await expect.poll(async () => (await localStudent(page)).totalTimeSpent).toBe(999);
  expect((await localStudent(page)).wordBook.some(entry => entry.word === 'MARKER')).toBe(true);
  await submitMini(page);
  await expect.poll(async () => (await serverStudent(page)).sections['1:mini1']?.attempts).toBe(1);
  expect(puts).toBeGreaterThan(0);
  expect((await serverStudent(page)).wordBook.some(entry => entry.word === 'MARKER')).toBe(true);
  expect((await serverStudent(page)).totalTimeSpent).toBeGreaterThanOrEqual(999);
});

test('Học sinh mới: server trống, Mini 1 đầu tiên lưu với updatedAt hiện tại', async ({ page }) => {
  await register(page);
  expect(await serverStudent(page)).toBeNull();
  await page.goto('/day/2/test/warmup');
  await expect(page.getByText('Không có từ nào đến hạn ôn hôm nay. Bạn vào thẳng Mini 1 nhé.')).toBeVisible();
  await submitMini(page);
  await expect.poll(async () => (await serverStudent(page))?.sections['1:mini1']?.attempts).toBe(1);
  expect(Date.parse((await serverStudent(page)).updatedAt)).toBeGreaterThan(Date.now() - 60_000);
});
