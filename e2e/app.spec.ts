import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const TEACHER = { username: 'giaovien', password: 'Giaovien@1234', name: 'Cô Hoa' };
const STUDENT = { username: 'hoa.nguyen', password: 'hoa12345', name: 'Nguyễn Thị Hoa' };

const SHOTS = path.join(__dirname, 'screenshots');
const LOG = path.join(__dirname, 'findings.json');

type Finding = { kind: string; where: string; detail: string };
const findings: Finding[] = [];
function note(kind: string, where: string, detail: string) {
  findings.push({ kind, where, detail });
  console.log(`[${kind}] ${where} :: ${detail}`);
}

test.afterAll(() => {
  fs.writeFileSync(LOG, JSON.stringify(findings, null, 2), 'utf8');
});

/** Gắn bộ bắt lỗi console / pageerror / request failed */
function watch(page: Page, tag: string) {
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') note('console.error', `${tag} @ ${page.url()}`, m.text().slice(0, 500));
    if (m.type() === 'warning' && /hydrat|Warning/i.test(m.text())) note('console.warn', `${tag} @ ${page.url()}`, m.text().slice(0, 300));
  });
  page.on('pageerror', (e) => note('pageerror', `${tag} @ ${page.url()}`, String(e.message).slice(0, 500)));
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (u.includes('localhost:3210')) note('requestfailed', `${tag} @ ${u}`, r.failure()?.errorText ?? '');
  });
  page.on('response', (r) => {
    if (r.url().includes('localhost:3210') && r.status() >= 500) note('http5xx', `${tag} @ ${r.url()}`, String(r.status()));
  });
}

async function shot(page: Page, name: string) {
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });
}

/** Đo tràn ngang + vùng chạm nhỏ ở viewport điện thoại */
async function mobileAudit(page: Page, url: string, name: string) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const de = document.documentElement;
    const overflow = de.scrollWidth - de.clientWidth;
    const wide: string[] = [];
    if (overflow > 0) {
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > de.clientWidth + 1) {
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;
          wide.push(`<${el.tagName.toLowerCase()} class="${el.className.toString().slice(0, 70)}"> right=${Math.round(r.right)}`);
          if (wide.length >= 6) break;
        }
      }
    }
    const small: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('button, a, input[type=checkbox], select'))) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (getComputedStyle(el).visibility === 'hidden') continue;
      if (r.height < 40) {
        const label = (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40);
        small.push(`${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return { overflow, clientWidth: de.clientWidth, scrollWidth: de.scrollWidth, wide, small: [...new Set(small)].slice(0, 12) };
  });
  if (res.overflow > 0) note('overflow-390', name, `scrollWidth=${res.scrollWidth} > clientWidth=${res.clientWidth} (+${res.overflow}px). Thu pham: ${res.wide.join(' | ') || 'khong xac dinh'}`);
  if (res.small.length) note('touch-under-40px', name, res.small.join(' | '));
  await page.screenshot({ path: path.join(SHOTS, `mobile-${name}.png`), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });
}


/** Trả lời câu hiện tại bằng mọi cách có thể. Trả về mô tả cách đã dùng. */
async function answerCurrent(page: Page): Promise<string> {
  const card = page.locator('main section > div').first();
  // Dạng nối cột: chạm trái rồi chạm phải, lặp cho đủ cặp
  if ((await card.getByText('Chạm 1 ô bên trái').count()) > 0) {
    const cols = card.locator('div.grid > div');
    const left = cols.nth(0).locator('button');
    const right = cols.nth(1).locator('button');
    const n = Math.min(await left.count(), await right.count());
    for (let i = 0; i < n; i++) {
      await left.nth(i).click();
      await right.nth(i).click();
    }
    return `noi-cot x${n}`;
  }
  const textInput = card.locator('input[type=text], input:not([type])');
  if ((await textInput.count()) > 0 && (await textInput.first().isVisible())) {
    await textInput.first().fill('x');
    return 'nhap-text';
  }
  const btns = card.locator('button');
  const n = await btns.count();
  for (let k = 0; k < n; k++) {
    const el = btns.nth(k);
    const box = await el.boundingBox();
    if ((await el.isVisible()) && (await el.isEnabled()) && box && box.height > 24) {
      await el.click();
      return 'chon-dap-an';
    }
  }
  return 'KHONG-TRA-LOI-DUOC';
}

async function login(page: Page, u: string, p: string) {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(u);
  await page.getByLabel('Mật khẩu').fill(p);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
}

test('Luồng end-to-end đầy đủ', async ({ page }) => {
  watch(page, 'main');

  await test.step('1. /dashboard khi chưa đăng nhập đẩy về /login', async () => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/, { timeout: 25_000 }).catch(() => {
      note('BUG-chuc-nang', '/dashboard', `Khong bi day ve /login. URL hien tai: ${page.url()}`);
    });
    expect(page.url()).toContain('/login');
  });

  await test.step('2. /login ẩn tab Tạo tài khoản', async () => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Tạo tài khoản', exact: true })).toHaveCount(0);
    await shot(page, '01-login');
  });

  await test.step('3. /login?dangky=1 tạo tài khoản giáo viên', async () => {
    await page.goto('/login?dangky=1');
    const tab = page.getByRole('button', { name: 'Tạo tài khoản', exact: true });
    await expect(tab).toBeVisible();
    await tab.click();
    await page.getByLabel('Tên của bạn').fill(TEACHER.name);
    await page.getByLabel('Tên đăng nhập').fill(TEACHER.username);
    await page.getByLabel('Mật khẩu').fill(TEACHER.password);
    await page.getByRole('button', { name: 'Tạo tài khoản và vào học' }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Các ngày học' })).toBeVisible();
  });

  await test.step('4. Dashboard giáo viên có nút Giáo viên; tạo học sinh ở /gv', async () => {
    const gvBtn = page.getByRole('link', { name: 'Giáo viên' });
    await expect(gvBtn).toBeVisible();
    await shot(page, '02-dashboard-teacher');
    await gvBtn.click();
    await page.waitForURL(/\/gv/);
    await page.getByRole('button', { name: '+ Tạo tài khoản' }).click();
    await page.getByLabel('Tên học sinh').fill(STUDENT.name);
    await page.getByLabel('Tên đăng nhập').fill(STUDENT.username);
    await page.getByLabel('Mật khẩu').fill(STUDENT.password);
    await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
    await expect(page.getByText(STUDENT.name)).toBeVisible({ timeout: 25_000 });
    await expect(page.getByText(STUDENT.username, { exact: false }).first()).toBeVisible();
    await shot(page, '08-gv');
  });

  await test.step('5. Đăng xuất rồi đăng nhập bằng học sinh', async () => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Đăng xuất' }).click();
    await page.waitForURL(/\/login/, { timeout: 25_000 });
    await login(page, STUDENT.username, STUDENT.password);
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
  });

  await test.step('6. Học sinh không có nút Giáo viên, /gv bị chặn', async () => {
    await expect(page.getByRole('link', { name: 'Giáo viên' })).toHaveCount(0);
    await shot(page, '03-dashboard-student');
    await page.goto('/gv');
    await expect(page.getByText('Trang này chỉ dành cho giáo viên.')).toBeVisible({ timeout: 25_000 });
  });

  await test.step('7. Ngày 1 -> Mini 1, làm vài câu', async () => {
    await page.goto('/day/1');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await shot(page, '04-day1');

    await page.locator('a[href="/day/1/test/mini1"]').first().click();
    await page.waitForURL(/\/day\/1\/test\/mini1/, { timeout: 25_000 });
    await expect(page.getByRole('button', { name: 'Kiểm tra' })).toBeVisible({ timeout: 25_000 });
    await shot(page, '05-mini1');

    const hint = page.getByRole('button', { name: /gợi ý/i });
    const label0 = await hint.textContent();
    if (!/\(\d+s\)/.test(label0 ?? '')) {
      note('nhan-xet', 'mini1 - Goi y', `Nut goi y khong hien dem nguoc luc vao cau. Nhan: "${label0}"`);
    }
    await page.waitForTimeout(5800);
    const disabledNow = await hint.isDisabled();
    if (disabledNow) {
      note('BUG-chuc-nang', 'mini1 - Goi y', `Sau 5.8s nut Goi y van bi disable. Nhan: "${await hint.textContent()}"`);
    } else {
      await hint.click();
      const hintBox = page.getByText(/Gợi ý 1:/);
      if ((await hintBox.count()) === 0) note('BUG-chuc-nang', 'mini1 - Goi y', 'Bam Goi y nhung khong hien noi dung goi y.');
      else await expect(hintBox.first()).toBeVisible();
    }

    for (let i = 0; i < 4; i++) {
      const how = await answerCurrent(page);
      if (how === 'KHONG-TRA-LOI-DUOC') note('nhan-xet', `mini1 cau ${i + 1}`, 'Khong tim duoc dieu khien tra loi tu dong duoc.');

      const check = page.getByRole('button', { name: 'Kiểm tra' });
      if ((await check.count()) > 0 && (await check.first().isEnabled())) {
        await check.first().click();
        await page.waitForTimeout(800);
        const expl = page.getByText(/Vì sao|Giải thích|Đáp án|Chưa đúng|Chính xác|Đúng rồi/i);
        if ((await expl.count()) === 0) note('BUG-chuc-nang', `mini1 cau ${i + 1}`, 'Sau khi Kiem tra khong thay phan giai thich / cham dung-sai.');
        if (i === 0) await shot(page, '05b-mini1-checked');
      } else {
        note('BUG-chuc-nang', `mini1 cau ${i + 1}`, 'Nut Kiem tra bi disable du da chon dap an.');
      }
      const next = page.getByRole('button', { name: /Câu tiếp/ });
      if ((await next.count()) > 0) { await next.first().click(); await page.waitForTimeout(600); }
      else break;
    }
  });

  await test.step('8. Nộp bài giữa chừng -> trang kết quả', async () => {
    const dots = page.locator('header button[title^="Câu "]');
    const total = await dots.count();
    if (total > 0) await dots.nth(total - 1).click();
    await page.waitForTimeout(600);

    page.on('dialog', (d) => void d.accept());
    let submit = page.getByRole('button', { name: /^Nộp bài$/ });
    if ((await submit.count()) === 0) {
      note('nhan-xet', 'mini1', 'O cau cuoi chua co nut "Nop bai" ngay; phai bam Kiem tra truoc.');
      const check = page.getByRole('button', { name: 'Kiểm tra' });
      if ((await check.count()) > 0) {
        await answerCurrent(page);
        if (await check.first().isEnabled()) await check.first().click();
        await page.waitForTimeout(600);
      }
      submit = page.getByRole('button', { name: /^Nộp bài$/ });
    }
    if ((await submit.count()) > 0) await submit.first().click();
    await page.waitForTimeout(2500);

    if ((await page.getByText(/câu đúng/).count()) === 0) note('BUG-chuc-nang', 'trang ket qua', 'Khong thay diem "x/y cau dung".');
    if ((await page.getByText('Theo từng dạng bài').count()) === 0) note('BUG-UI', 'trang ket qua', 'Khong thay bieu do "Theo tung dang bai".');
    if ((await page.getByRole('link', { name: /Làm lại \d+ câu sai/ }).count()) === 0) note('BUG-UI', 'trang ket qua', 'Khong thay nut "Lam lai N cau sai".');
    await shot(page, '06-result');
  });

  await test.step('9. Trạng thái Đã lưu và tiến độ bền sau reload', async () => {
    await page.goto('/dashboard');
    await page.waitForTimeout(4000);
    if ((await page.getByText(/Đã lưu|Đang lưu/).count()) === 0) {
      note('BUG-UI', 'TopBar /dashboard', 'Khong thay chi bao "Da luu" tren thanh tren cung sau khi lam bai.');
    }
    const before = await page.locator('p').filter({ hasText: /Xong \d+\/\d+ bài/ }).first().textContent();
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const after = await page.locator('p').filter({ hasText: /Xong \d+\/\d+ bài/ }).first().textContent();
    if (before !== after) note('BUG-chuc-nang', '/dashboard', `Tien do doi sau reload: truoc="${before}" sau="${after}"`);
    note('thong-tin', '/dashboard tien do', `truoc="${before}" sau="${after}"`);
    const prog = await page.evaluate(async () => {
      const r = await fetch('/api/progress', { cache: 'no-store' });
      const d = await r.json();
      return { keys: Object.keys(d?.progress?.sections ?? {}), updatedAt: d?.updatedAt };
    });
    if (!prog.keys.length) note('BUG-chuc-nang', 'GET /api/progress', `Server khong luu ket qua bai vua lam. payload=${JSON.stringify(prog)}`);
    else note('thong-tin', 'GET /api/progress', JSON.stringify(prog));
  });

  await test.step('10. /wordbook và /day/1/vocab', async () => {
    await page.goto('/wordbook');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).not.toContainText('Application error');
    await shot(page, '07-wordbook');

    await page.goto('/day/1/vocab');
    await page.waitForTimeout(2000);
    for (const label of ['Tất cả', 'Từ đơn', 'Cụm từ']) {
      const b = page.getByRole('button', { name: label, exact: true });
      await expect(b).toBeVisible();
      await b.click();
      await page.waitForTimeout(700);
      const body = await page.locator('body').innerText();
      if (/Application error|Unhandled|Cannot read/i.test(body)) note('BUG-chuc-nang', `/day/1/vocab bo loc "${label}"`, 'Trang loi sau khi bam bo loc.');
      const counter = await page.locator('p').filter({ hasText: /^\d+ \/ \d+$/ }).first().textContent().catch(() => null);
      note('thong-tin', `/day/1/vocab bo loc "${label}"`, `dem the: ${counter}`);
    }
    await page.getByRole('button', { name: 'Tất cả', exact: true }).click();
    await page.waitForTimeout(500);
    await shot(page, '09-day1-vocab');
  });

  await test.step('11. Kiểm tra mobile 390x844', async () => {
    const pages: Array<[string, string]> = [
      ['/dashboard', 'dashboard'],
      ['/day/1', 'day1'],
      ['/day/1/vocab', 'day1-vocab'],
      ['/wordbook', 'wordbook'],
      ['/day/1/test/mini1', 'mini1'],
    ];
    for (const [url, name] of pages) await mobileAudit(page, url, name);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/dashboard');
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Đăng xuất' }).click().catch(() => {});
    await page.waitForTimeout(1500);
    await mobileAudit(page, '/login', 'login');
  });
});
