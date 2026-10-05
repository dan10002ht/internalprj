// Kiểm tra tính toàn vẹn nội dung đề: chạy `node scripts/check-data.mjs`
// Biên dịch tạm thư mục src sang JS rồi nạp dữ liệu để kiểm tra bằng dữ liệu thật,
// thay vì đọc file bằng biểu thức chính quy (dễ sai).
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const out = mkdtempSync(path.join(tmpdir(), 'checkdata-'));
// tsc chỉ nhận `paths` từ file cấu hình, nên dựng một tsconfig tạm
const cfg = path.join(out, 'tsconfig.json');
writeFileSync(
  cfg,
  JSON.stringify({
    compilerOptions: {
      outDir: out,
      module: 'commonjs',
      target: 'es2022',
      moduleResolution: 'node',
      skipLibCheck: true,
      baseUrl: path.resolve('.'),
      paths: { '@/*': ['src/*'] },
    },
    files: [path.resolve('src/data/index.ts')],
  }),
);
try {
  execSync(`npx tsc -p "${cfg}"`, { stdio: 'pipe' });
} catch (e) {
  console.error(e.stdout?.toString() || e.message);
  process.exit(1);
}

// tsc giữ đường dẫn "@/types" nên tạo một file rỗng để import không vỡ
writeFileSync(path.join(out, 'types.js'), 'module.exports = {};');
writeFileSync(path.join(out, 'package.json'), '{"type":"commonjs"}');
const { days } = createRequire(import.meta.url)(path.join(out, 'data', 'index.js'));

const problems = [];
const warn = (m) => problems.push(m);

for (const day of days) {
  const tag = `Ngày ${day.dayId}`;
  const words = new Set(day.vocab.map((v) => v.word));

  // Từ vựng trùng nhau
  const seenWord = new Set();
  for (const v of day.vocab) {
    if (seenWord.has(v.word)) warn(`${tag}: từ vựng trùng "${v.word}"`);
    seenWord.add(v.word);
    for (const f of ['meaningVi', 'meaningEn', 'exampleFromPassage', 'exampleNew', 'ipa']) {
      if (!v[f]) warn(`${tag}: từ "${v.word}" thiếu ${f}`);
    }
    // Trọng âm nằm ngoài số âm tiết sẽ vẽ sai sơ đồ trọng âm ở màn học từ vựng
    if (!(v.syllableCount >= 1)) warn(`${tag}: từ "${v.word}" có syllableCount không hợp lệ`);
    else if (!(v.stressPosition >= 1 && v.stressPosition <= v.syllableCount)) {
      warn(`${tag}: từ "${v.word}" có stressPosition ${v.stressPosition} nằm ngoài ${v.syllableCount} âm tiết`);
    }
  }

  // Câu hỏi trùng id
  const seenId = new Set();
  for (const q of day.questions) {
    if (seenId.has(q.id)) warn(`${tag}: id câu hỏi trùng "${q.id}"`);
    seenId.add(q.id);

    for (const w of q.targetWords ?? []) {
      if (!words.has(w)) warn(`${tag}/${q.id}: targetWord "${w}" không có trong từ vựng của ngày`);
    }
    if (!day.strategies[q.strategyTag]) warn(`${tag}/${q.id}: strategyTag "${q.strategyTag}" chưa có mẹo làm bài`);

    switch (q.format) {
      case 'mcq':
      case 'trueFalse':
      case 'oddOneOut':
      case 'insertSentence':
        if (!q.options?.length) warn(`${tag}/${q.id}: thiếu options`);
        else if (!(q.answer >= 0 && q.answer < q.options.length)) warn(`${tag}/${q.id}: answer ${q.answer} nằm ngoài options`);
        if (q.optionsVi && q.optionsVi.length !== q.options?.length) warn(`${tag}/${q.id}: optionsVi lệch số lượng với options`);
        break;
      case 'match':
        if (q.options?.length !== q.optionsRight?.length) warn(`${tag}/${q.id}: match lệch số cặp`);
        break;
      case 'clozeBank':
      case 'clozeChoice': {
        const holes = [...(q.clozeText ?? '').matchAll(/\{(\d+)\}/g)].map((m) => +m[1]);
        if (holes.length !== q.blanks?.length) warn(`${tag}/${q.id}: có ${holes.length} chỗ trống nhưng ${q.blanks?.length} đáp án`);
        holes.forEach((h, k) => { if (h !== k) warn(`${tag}/${q.id}: chỗ trống đánh số sai tại vị trí ${k}`); });
        if (q.format === 'clozeBank') {
          for (const b of q.blanks ?? []) if (!q.bank?.includes(b)) warn(`${tag}/${q.id}: đáp án "${b}" không có trong bank`);
        } else {
          if (q.blankOptions?.length !== q.blanks?.length) warn(`${tag}/${q.id}: blankOptions lệch số lượng với blanks`);
          (q.blanks ?? []).forEach((b, k) => {
            if (!q.blankOptions?.[k]?.includes(b)) warn(`${tag}/${q.id}: đáp án "${b}" không nằm trong lựa chọn của chỗ trống ${k + 1}`);
          });
        }
        break;
      }
      case 'fillBlank':
      case 'dictation':
        if (!/_{2,}/.test(q.sentence ?? '')) warn(`${tag}/${q.id}: fillBlank thiếu chỗ trống ___ trong sentence`);
        if (!q.answers?.length) warn(`${tag}/${q.id}: thiếu answers`);
        break;
      case 'scramble':
      case 'translateToEn':
      case 'wordFormInput':
        if (!q.answers?.length) warn(`${tag}/${q.id}: thiếu answers`);
        break;
      case 'wordOrdering':
      case 'jumbledOrder':
        if (!q.ordered?.length) warn(`${tag}/${q.id}: thiếu ordered`);
        break;
      case 'multiSelect':
        if (!q.answerIndexes?.length) warn(`${tag}/${q.id}: thiếu answerIndexes`);
        break;
    }
  }

  // Mọi câu trong section phải tồn tại
  for (const s of day.sections) {
    for (const id of s.questionIds) {
      if (!seenId.has(id)) warn(`${tag}/${s.id}: section trỏ tới câu "${id}" không tồn tại`);
    }
  }

  const phrases = day.vocab.filter((v) => v.partOfSpeech === 'phrase').length;
  console.log(`${tag}: ${day.vocab.length} mục từ vựng (${phrases} cụm từ) · ${day.questions.length} câu hỏi · ${day.sections.length} bài`);
}

// PLAN 4.5: kiểm tra cấu trúc các câu tính điểm, độc lập với câu luyện thêm sinh ở UI.
function checkDay2ExamStructure(day) {
  if (day.dayId !== 2) return;
  const byId = new Map(day.questions.map((q) => [q.id, q]));
  const expected = {
    de1: [['d2e1-notice', 6], ['d2e1-leaflet', 6], ['p4', 10], ['p5', 10]],
    de2: [[undefined, 5], ['d2e2-text', 5], ['p6', 10]],
  };
  for (const [sectionId, groups] of Object.entries(expected)) {
    const section = day.sections.find((s) => s.id === sectionId);
    const ids = section?.questionIds ?? [];
    const total = groups.reduce((n, [, count]) => n + count, 0);
    if (ids.length !== total || new Set(ids).size !== total) {
      warn(`Ngày 2/${sectionId}: cần ${total} câu tính điểm không trùng`);
    }
    let offset = 0;
    for (const [passageId, count] of groups) {
      const group = ids.slice(offset, offset + count).map((id) => byId.get(id));
      if (group.length !== count || group.some((q) => !q || q.passageId !== passageId || q.bonus)) {
        warn(`Ngày 2/${sectionId}: nhóm ${passageId ?? 'sắp xếp'} phải có ${count} câu đúng thứ tự`);
      }
      offset += count;
    }
  }
}
for (const day of days) checkDay2ExamStructure(day);

rmSync(out, { recursive: true, force: true });
if (problems.length) {
  console.error(`\n${problems.length} vấn đề:`);
  for (const p of problems) console.error(' -', p);
  process.exit(1);
}
console.log('\nKhông có vấn đề nào.');
