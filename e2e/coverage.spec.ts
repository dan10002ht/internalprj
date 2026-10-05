import { test as base, expect, type Page, type Locator } from '@playwright/test';
import { days } from '../src/data';
import type { Question } from '../src/types';

const teacher = { username: 'giaovien', password: 'Giaovien@1234' };
const test = base.extend<{ browserErrors: string[] }>({
  browserErrors: [async ({ page }, use, info) => {
    const errors: string[] = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(`${page.url()}: ${m.text()}`); });
    page.on('pageerror', e => errors.push(`${page.url()}: ${e.message}`));
    await use(errors);
    await info.attach('browser-errors', { body: JSON.stringify(errors, null, 2), contentType: 'application/json' });
    expect.soft(errors, 'console.error / pageerror').toEqual([]);
  }, { auto: true }],
});

async function audit(page: Page) {
  expect(await page.evaluate(() => document.documentElement.clientWidth)).toBe(390);
  expect.soft(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `Overflow at ${page.url()}`).toBeLessThanOrEqual(1);
}
async function login(page: Page, username = teacher.username, password = teacher.password) {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}
async function preview(page: Page) {
  await login(page);
  await page.goto('/dashboard?gv=1');
  await expect(page.getByRole('heading', { name: 'Các ngày học' })).toBeVisible();
}
async function skipPrime(page: Page) {
  const skip = page.getByRole('button', { name: /Bỏ qua, vào bài đọc/ });
  if (await skip.isVisible()) await skip.click();
}
function card(page: Page) { return page.locator('main section > div').first(); }
async function pointerMove(page: Page, source: Locator, target: Locator) {
  await source.scrollIntoViewIfNeeded();
  const a = await source.boundingBox();
  const b = await target.boundingBox();
  expect(a).not.toBeNull(); expect(b).not.toBeNull();
  await page.mouse.move(a!.x + a!.width / 2, a!.y + a!.height / 2);
  await page.mouse.down();
  await page.mouse.move(a!.x + a!.width / 2, a!.y + a!.height / 2 + 6, { steps: 3 });
  await page.mouse.move(b!.x + b!.width / 2, b!.y + b!.height / 2, { steps: 20 });
  await page.mouse.up();
  // dnd-kit briefly captures clicks after pointer release.
  await page.waitForTimeout(60);
}
async function answer(page: Page, q: Question) {
  const c = card(page);
  if (q.format === 'match') {
    for (let i = 0; i < q.options!.length; i++) {
      await c.getByRole('button', { name: q.options![i], exact: true }).click();
      await c.getByRole('button', { name: q.optionsRight![i], exact: true }).click();
    }
    return;
  }
  if (q.format === 'categorize') {
    for (const item of q.items!) await c.locator('li').filter({ hasText: item.text }).getByRole('button', { name: q.categories![item.cat], exact: true }).click();
    return;
  }
  if (q.answers) { await c.locator('input').fill(q.answers[0]); return; }
  if (q.format === 'wordOrdering') {
    for (const word of q.ordered!) await c.getByRole('button', { name: word, exact: true }).last().click();
    return;
  }
  if (q.format === 'jumbledOrder') {
    for (let i = 0; i < q.ordered!.length; i++) {
      const rows = c.locator('ol li');
      const wanted = rows.filter({ hasText: q.ordered![i] });
      if ((await rows.nth(i).innerText()).includes(q.ordered![i])) continue;
      await pointerMove(page, wanted.getByLabel('Kéo để sắp xếp'), rows.nth(i).getByLabel('Kéo để sắp xếp'));
      await expect(rows.nth(i)).toContainText(q.ordered![i]);
    }
    return;
  }
  if (q.format === 'clozeBank' || q.format === 'clozeChoice') {
    for (const blank of q.blanks!) await c.getByRole('button', { name: blank, exact: true }).last().click();
    return;
  }
  if (q.options && q.answer !== undefined) {
    await c.getByRole('button').filter({ has: page.getByText(q.options[q.answer].replace(/[{}]/g, ''), { exact: true }) }).first().click();
    return;
  }
  throw new Error(`Unsupported answer format: ${q.format} (${q.id})`);
}
async function cloze(page: Page) {
  const reviews = page.locator('div.rounded-2xl').filter({ has: page.getByText('Đọc lại bài — điền từ vào chỗ trống', { exact: true }) });
  const review = reviews.first();
  await expect(review).toBeVisible();
  await audit(page);
  await review.getByRole('button', { name: '(1)', exact: true }).click();
  const bank = review.locator('div.flex.flex-wrap button');
  const word = await bank.first().innerText();
  await bank.first().click();
  await expect(review.getByRole('button', { name: word, exact: true }).first()).toBeVisible();
  await review.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
  await expect(review.getByText(/Bạn điền đúng \d+\/\d+ từ/)).toBeVisible();
}

test.beforeAll(async ({ request }) => {
  const response = await request.post('/api/auth/register', { data: { ...teacher, displayName: 'Coverage Teacher' } });
  expect([200, 409]).toContain(response.status());
});

for (const day of days) {
  for (const sectionId of ['mini2', 'mini3']) {
    test(`Ngày ${day.dayId}: ${sectionId} chấm đáp án từ dữ liệu`, async ({ page }) => {
      await preview(page);
      await page.goto(`/day/${day.dayId}/test/${sectionId}`);
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      const section = day.sections.find(s => s.id === sectionId)!;
      const wanted = day.questions.find(q => section.questionIds.includes(q.id) && (sectionId === 'mini2' ? !!q.answers : q.format === 'jumbledOrder'))!;
      for (let i = 0; i < section.questionIds.length; i++) {
        await page.locator(`header button[title="Câu ${i + 1}"]`).click();
        await expect(page.locator('header')).toContainText(`Câu ${i + 1}/`);
        if ((await heading.innerText() === wanted.stem) && (!wanted.sentence || (await card(page).innerText()).includes(wanted.sentence))) break;
      }
      const q = wanted;
      expect(q).toBeTruthy();
      await audit(page);
      if (sectionId === 'mini3') {
        const rows = card(page).locator('ol li');
        const before = await rows.allTextContents();
        await pointerMove(page, rows.first().getByLabel('Kéo để sắp xếp'), rows.nth(1).getByLabel('Kéo để sắp xếp'));
        await expect.poll(() => rows.allTextContents()).not.toEqual(before);
      }
      await answer(page, q);
      await expect(page.getByRole('button', { name: 'Kiểm tra', exact: true })).toBeEnabled();
      await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
      await expect(page.getByText('Đúng rồi!', { exact: true })).toBeVisible();
      await expect(page.getByText(q.explanation, { exact: false }).first()).toBeVisible();
      await audit(page);
    });
  }

  test(`Ngày ${day.dayId}: Đề 1 V1/V3/V4/V7`, async ({ page }) => {
    await preview(page);
    await page.goto(`/day/${day.dayId}/test/de1`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await audit(page);
    let sawPrime = false;
    let sawFollowUp = false;
    let sawBonus = false;
    // Traverse the real UI, including runtime bonus questions; no progress injection.
    while (true) {
      if (await page.getByRole('button', { name: /Bỏ qua, vào bài đọc/ }).isVisible()) {
        sawPrime = true;
        await expect(page.getByRole('heading', { name: /Nối nhanh 5 từ khóa/ })).toBeVisible();
        await audit(page);
        const words = page.locator('main > div.flex.flex-wrap').first().getByRole('button');
        const meanings = page.locator('main > div.space-y-2').filter({ has: page.getByText('Nghĩa', { exact: true }) }).getByRole('button');
        await words.first().click();
        const selectedMeaning = await meanings.first().innerText();
        await meanings.first().click();
        await expect(words.first()).toContainText(selectedMeaning);
        await skipPrime(page);
      }
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      const stem = await heading.innerText();
      const ids = day.sections.find(s => s.id === 'de1')!.questionIds;
      const rendered = await card(page).innerText();
      const q = day.questions.find(q => ids.includes(q.id) && q.stem === stem && (!q.options || q.options.every(o => rendered.includes(o.replace(/[{}]/g, '')))));
      const bonus = page.getByText('Câu luyện thêm · không tính điểm', { exact: true });
      if (await bonus.isVisible()) {
        sawBonus = true;
        await audit(page);
        await card(page).locator('button').first().click();
      } else {
        expect(q, stem).toBeTruthy();
        await answer(page, q!);
      }
      await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
      const follow = page.getByText('Câu nhanh · không tính điểm', { exact: true });
      if (await follow.isVisible()) {
        sawFollowUp = true;
        const box = follow.locator('..').locator('..');
        await audit(page);
        await box.getByRole('button').first().click();
        await expect(box.getByRole('button', { name: 'Tiếp tục làm đề →' })).toBeVisible();
        await box.getByRole('button', { name: 'Tiếp tục làm đề →' }).click();
        await expect(follow).toHaveCount(0);
      }
      const next = page.getByRole('button', { name: 'Câu tiếp →', exact: true });
      if (!await next.count()) break;
      const current = (await page.locator('header').innerText()).match(/Câu (\d+)\//);
      await next.click();
      // Prime replaces the header when crossing into a new passage.
      await expect.poll(async () => (await page.getByRole('button', { name: /Bỏ qua, vào bài đọc/ }).isVisible()) || (await page.locator('header').innerText()).includes(`Câu ${Number(current![1]) + 1}/`)).toBe(true);
    }
    expect(sawPrime, 'V1 prime reached').toBe(true);
    expect(sawFollowUp, 'V3 follow-up reached').toBe(true);
    expect(sawBonus, 'V4 unscored bonus reached').toBe(true);
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Nộp bài', exact: true }).click();
    await expect(page.getByText(/câu đúng/).first()).toBeVisible();
    const scoredTotal = day.sections.find(s => s.id === 'de1')!.questionIds.length;
    await expect(page.locator('body')).toContainText(`${scoredTotal}/${scoredTotal}`);
    await expect(page.getByText(/Câu luyện thêm: đúng/)).toBeVisible();
    await expect.poll(async () => (await (await page.request.get('/api/progress')).json()).progress?.sections?.[`${day.dayId}:de1`]?.lastRawScore).toBe(100);
    await cloze(page);
  });

  test(`Ngày ${day.dayId}: Đề 2 V6/V7`, async ({ page }) => {
    await preview(page);
    await page.goto(`/day/${day.dayId}/test/de2`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const section = day.sections.find(s => s.id === 'de2')!;
    const qs = section.questionIds.map(id => day.questions.find(q => q.id === id)!);
    await audit(page);
    await page.getByRole('button', { name: /Phiếu/ }).click();
    await expect(page.getByText('Phiếu tô đáp án', { exact: true })).toBeVisible();
    const mcqIndex = qs.findIndex(q => q.options && q.answer !== undefined);
    const letter = 'ABCDE'[qs[mcqIndex].answer!];
    const bubble = page.getByRole('button', { name: `Câu ${mcqIndex + 1} đáp án ${letter}`, exact: true });
    await bubble.click();
    await expect(bubble).toHaveClass(/bg-slate-900/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(qs[mcqIndex].stem);
    await audit(page);
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Nộp bài', exact: true }).first().click();
    await expect(page.getByText(/câu đúng/).first()).toBeVisible();
    await cloze(page);
  });

  test(`Ngày ${day.dayId}: Round cuối ghi điểm và làm lại`, async ({ page }) => {
    await preview(page);
    await page.goto(`/day/${day.dayId}/test/final`);
    await expect(page.getByLabel('Gõ từ')).toBeVisible();
    await audit(page);
    for (let i = 0; i < 20; i++) {
      await expect(page.getByLabel('Gõ từ')).toBeEnabled();
      await page.getByLabel('Gõ từ').fill('zzzz');
      await page.getByRole('button', { name: 'Xong', exact: true }).click();
      await expect(page.getByText('Đáp án:', { exact: false })).toBeVisible();
      await expect(page.getByText('Đáp án:', { exact: false })).toHaveCount(0);
    }
    await expect(page.getByText('0/20', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Từ cần ôn lại' })).toBeVisible();
    await audit(page);
    await page.getByRole('button', { name: 'Làm lại', exact: true }).click();
    await expect(page.getByLabel('Gõ từ')).toBeEnabled();
  });
}

test('Warm-up: từ đã sai xuất hiện, chấm và ghi kết quả', async ({ page }) => {
  const account = { username: `warmup.${Date.now()}`, password: 'Warmup@1234', displayName: 'Warmup Coverage' };
  const registered = await page.request.post('/api/auth/register', { data: account });
  expect(registered.ok()).toBe(true);
  const { user } = await registered.json();
  const progress = { studentId: user.id, studentName: account.displayName, sections: {}, vocabMastery: {}, wordBook: [], wrongBank: [], totalTimeSpent: 0, updatedAt: new Date().toISOString() };
  await page.goto('/day/2/test/warmup');
  await expect(page.getByText('Không có từ nào đến hạn ôn hôm nay. Bạn vào thẳng Mini 1 nhé.')).toBeVisible();
  await audit(page);
  const due = { ...progress, vocabMastery: Object.fromEntries(days[0].vocab.slice(0, 3).map(v => [v.word, { correct: 0, wrong: 1, streak: 0, hint3Used: false, mastered: false, level: 1, nextReviewAt: '2000-01-01' }])) };
  expect((await page.request.put('/api/progress', { data: { progress: due } })).ok()).toBe(true);
  // Re-open as a fresh device to exercise asynchronous server progress loading.
  await page.evaluate(() => localStorage.clear());
  await page.goto('/day/2/test/warmup');
  await expect(page.getByRole('button', { name: 'Kiểm tra', exact: true })).toBeVisible();
  await audit(page);
  for (let i = 0; i < 10; i++) {
    await page.locator('main div.grid button').first().click();
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    const next = page.getByRole('button', { name: 'Câu tiếp →', exact: true });
    if (await next.count()) await next.click();
    else { await page.getByRole('button', { name: 'Xong', exact: true }).click(); break; }
  }
  await expect(page.getByText(/Những từ bạn còn sai sẽ được hỏi lại/)).toBeVisible();
  await audit(page);
  await expect.poll(async () => (await (await page.request.get('/api/progress')).json()).progress?.sections?.['2:warmup']?.attempts).toBe(1);
});

test('Giáo viên: tạo HS, xem kết quả, đổi mật khẩu, xoá HS', async ({ page, browser, browserErrors }) => {
  await login(page);
  await page.goto('/gv');
  const username = `coverage.${Date.now()}`;
  await page.getByRole('button', { name: '+ Tạo tài khoản', exact: true }).click();
  await page.getByLabel('Tên học sinh').fill('Coverage Student');
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill(username);
  await page.getByLabel('Mật khẩu', { exact: true }).fill('Student@1234');
  await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  const row = page.locator('div.flex.flex-wrap.items-center').filter({ hasText: username }).last();
  await expect(row.getByRole('button', { name: 'Xem kết quả', exact: true })).toBeVisible();
  await audit(page);
  await row.getByRole('button', { name: 'Xem kết quả', exact: true }).click();
  await expect(page.getByText(/chưa làm bài nào/i)).toBeVisible();
  await row.getByRole('button', { name: 'Đặt lại mật khẩu', exact: true }).click();
  await page.getByLabel('Mật khẩu mới cho Coverage Student').fill('Changed@1234');
  await page.getByRole('button', { name: 'Lưu mật khẩu', exact: true }).click();
  await expect(page.getByText('Đã đặt lại mật khẩu.', { exact: true })).toBeVisible();
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  const studentPage = await context.newPage();
  studentPage.on('console', m => { if (m.type() === 'error') browserErrors.push(`${studentPage.url()}: ${m.text()}`); });
  studentPage.on('pageerror', e => browserErrors.push(`${studentPage.url()}: ${e.message}`));
  await login(studentPage, username, 'Changed@1234');
  await studentPage.goto('/day/1/test/mini1');
  await expect(studentPage.getByRole('heading', { level: 1 })).toBeVisible();
  const dots = studentPage.locator('header button[title^="Câu "]');
  await dots.last().click();
  const heading = await studentPage.getByRole('heading', { level: 1 }).innerText();
  const q = days[0].questions.find(q => q.stem === heading)!;
  await answer(studentPage, q);
  await studentPage.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
  studentPage.once('dialog', d => d.accept());
  await studentPage.getByRole('button', { name: 'Nộp bài', exact: true }).click();
  await expect(studentPage.getByText(/câu đúng/).first()).toBeVisible();
  await expect.poll(async () => (await (await studentPage.request.get('/api/progress')).json()).progress?.sections?.['1:mini1']?.attempts).toBe(1);
  await context.close();
  await page.reload();
  await row.getByRole('button', { name: 'Xem kết quả', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kết quả của Coverage Student' })).toBeVisible();
  await expect(page.getByText('Bài đã xong', { exact: true })).toBeVisible();
  await audit(page);
  page.once('dialog', d => d.accept());
  await row.getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(page.getByText('Đã xóa tài khoản học sinh.', { exact: true })).toBeVisible();
  await expect(row).toHaveCount(0);
  await audit(page);
});

test('Ngày 2 mở được Warm-up từ màn ngày học', async ({ page }) => {
  await login(page);
  await page.goto('/day/2');
  await expect(page.locator('a[href="/day/2/test/warmup"]')).toBeVisible();
  await audit(page);
  await page.locator('a[href="/day/2/test/warmup"]').click();
  await expect(page).toHaveURL(/\/day\/2\/test\/warmup/);
  await expect(page.getByRole('button', { name: 'Kiểm tra', exact: true }).or(page.getByText('Không có từ nào đến hạn ôn hôm nay. Bạn vào thẳng Mini 1 nhé.'))).toBeVisible();
  await audit(page);
});
