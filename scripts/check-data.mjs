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
    files: [path.resolve('src/data/index.ts'), path.resolve('src/lib/vocabText.ts')],
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

const { appearsIn } = createRequire(import.meta.url)(path.join(out, 'lib', 'vocabText.js'));

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

// Ngày 1: giữ cấu trúc 4.5 và bản dịch đáp án tách khỏi lời phê ngữ pháp.
function checkDay1ExamStructure(day) {
  const expected = {
    de1: [...Array.from({ length: 12 }, (_, i) => `d1e1-${i + 1}`), ...Array.from({ length: 16 }, (_, i) => `r${i + 1}`)],
    de2: [...Array.from({ length: 10 }, (_, i) => `d1e2-${i + 1}`), ...Array.from({ length: 8 }, (_, i) => `r${i + 17}`)],
  };
  for (const [sectionId, questionIds] of Object.entries(expected)) {
    const actual = day.sections.find((section) => section.id === sectionId)?.questionIds;
    if (JSON.stringify(actual) !== JSON.stringify(questionIds)) {
      problems.push(`Ngày 1/${sectionId}: sai số câu hoặc thứ tự phần theo PLAN 4.5`);
    }
  }
  for (const question of day.questions) {
    if ((question.optionsVi ?? []).some((meaning) => /sai ngữ pháp|thiếu chủ ngữ|thiếu liên từ|thừa đại từ|không phải cụm có thật/.test(meaning))) {
      problems.push(`Ngày 1/${question.id}: optionsVi chứa lời phê thay vì nghĩa dịch`);
    }
  }
}
const firstDay = days.find((day) => day.dayId === 1);
if (firstDay) {
  checkDay1ExamStructure(firstDay);
  const passageText = firstDay.passages.map((passage) => [passage.title, ...passage.paragraphs].join('\n')).join('\n');
  const phrases = firstDay.vocab.filter((item) => item.partOfSpeech === 'phrase');
  for (const phrase of phrases) {
    if (!appearsIn(passageText, phrase)) problems.push(`Ngày 1: cụm "${phrase.word}" không nhận diện được trong bài đọc`);
  }
  console.log(`Ngày 1: kiểm tra appearsIn cho ${phrases.length} cụm từ`);
}

rmSync(out, { recursive: true, force: true });
if (problems.length) {
  console.error(`\n${problems.length} vấn đề:`);
  for (const p of problems) console.error(' -', p);
  process.exit(1);
}
console.log('\nKhông có vấn đề nào.');
