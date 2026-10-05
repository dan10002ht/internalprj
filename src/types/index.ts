// ===== Nội dung (build-time, soạn từ file .md của giáo viên) =====

/** Loại từ */
export type PartOfSpeech = 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'phrase';

/**
 * Một từ vựng. Hint gắn vào TỪ, không gắn vào câu hỏi
 * → nhập 1 lần, dùng lại cho mọi dạng bài.
 */
export interface VocabItem {
  word: string;
  ipa: string;
  partOfSpeech: PartOfSpeech;
  meaningVi: string;
  meaningEn: string;
  synonyms: string[];
  antonyms: string[];
  /** VD: ["reluctance (n)", "reluctantly (adv)"] */
  wordFamily: string[];
  emoji: string;
  /** Để trống ở MVP — dùng emoji thay ảnh thật */
  imageUrl?: string;
  collocations: string[];
  exampleFromPassage: string;
  exampleNew: string;
  syllableCount: number;
  /** 1 = âm tiết thứ nhất */
  stressPosition: number;
  /** Liên tưởng tiếng Việt để dễ nhớ */
  mnemonicVi?: string;
  etymology?: string;
  /** Các dạng biến đổi xuất hiện trong bài (preserves, imposed…) — dùng để tô và tra từ trong bài đọc */
  forms?: string[];
}

/** Loại văn bản — quyết định cách trình bày */
export type PassageKind = 'article' | 'notice' | 'leaflet' | 'text';

/** Một bài đọc / văn bản dùng chung cho nhóm câu hỏi */
export interface Passage {
  id: string;
  title: string;
  paragraphs: string[];
  /** Mặc định 'article' (bài đọc hiểu). notice/leaflet/text dùng cho phần điền khuyết P1, P2, P4 */
  kind?: PassageKind;
  /** Yêu cầu đề bài hiện phía trên văn bản */
  instruction?: string;
  source?: string;
  /** Các câu được gạch chân trong đề (câu hỏi paraphrase) */
  underlines?: string[];
  /** Bản dịch từng đoạn — hiện sau khi kiểm tra đáp án */
  paragraphsVi?: string[];
  /** V1 — 5 từ mồi nối nghĩa nhanh trước khi đọc bài. Để trống thì hệ thống tự chọn từ của ngày xuất hiện trong bài */
  keyVocab?: string[];
}

/** Kỹ năng được kiểm tra — dùng để vẽ biểu đồ theo dạng bài */
export type SkillType =
  | 'pronunciation'
  | 'stress'
  | 'vocabulary'
  | 'grammar'
  | 'wordForm'
  | 'collocation'
  | 'synonym'
  | 'antonym'
  | 'idiom'
  | 'communication'
  | 'cloze'
  | 'reading'
  | 'errorId'
  | 'sentenceTransform';

/** Các dạng bài — tất cả đều chấm máy 100% */
export type QuestionFormat =
  // chấm bằng so khớp lựa chọn
  | 'mcq'
  | 'trueFalse'
  | 'oddOneOut'
  | 'multiSelect'
  | 'insertSentence'
  | 'tapSegment'
  // chấm bằng so khớp vị trí
  | 'match'
  | 'wordOrdering'
  | 'jumbledOrder'
  | 'categorize'
  | 'clozeBank'
  | 'clozeChoice'
  // chấm bằng so khớp chuỗi 1 từ
  | 'fillBlank'
  | 'scramble'
  | 'translateToEn'
  | 'wordFormInput'
  | 'dictation';

/** Loại hint — hệ thống tự lấy dữ liệu tương ứng từ VocabItem */
export type HintType =
  | 'eliminate' // loại 1 đáp án sai
  | 'eliminateTwo' // loại 2 đáp án sai
  | 'firstLetter' // chữ cái đầu + số ký tự
  | 'syllables' // số âm tiết + trọng âm
  | 'wordFamily'
  | 'meaningEn'
  | 'meaningVi' // bậc 3 — lưới an toàn
  | 'image' // emoji hoặc imageUrl
  | 'synonym'
  | 'collocation'
  | 'examplePassage' // câu trong bài, khoét từ
  | 'exampleNew'
  | 'ipa'
  | 'mnemonic'
  | 'locate' // "tìm ở đoạn 3" — dùng cho reading
  | 'custom';

export interface HintLevel {
  type: HintType;
  /** Nội dung tự soạn, dùng khi type = 'custom' | 'locate' */
  text?: string;
}

export interface CategorizeItem {
  text: string;
  /** index trong `categories` */
  cat: number;
}

export interface Segment {
  text: string;
  /** Có cho phép chạm chọn không */
  selectable?: boolean;
  /** Nhãn hiển thị dưới đoạn được chọn (A/B/C/D) */
  label?: string;
}

export interface Question {
  id: string;
  skillType: SkillType;
  format: QuestionFormat;
  difficulty: 1 | 2 | 3;
  /** Các từ vựng câu này nhắm tới — dùng cho hint & spaced repetition */
  targetWords: string[];
  /** Câu hỏi/đề bài */
  stem: string;
  /** Yêu cầu chung của phần đề (VD câu sắp xếp P3) — hiện nhỏ phía trên câu hỏi */
  instruction?: string;
  /** Bản dịch câu hỏi và từng đáp án — hiện sau khi kiểm tra */
  stemVi?: string;
  optionsVi?: string[];
  /** Bài đọc đi kèm (hiện ở panel bên cạnh) */
  passageId?: string;
  /** Từ/cụm cần tô sáng trong bài đọc khi làm câu này */
  focus?: string;
  /** Giữ nguyên thứ tự đáp án (câu lấy từ đề gốc) */
  fixedOrder?: boolean;

  /** mcq/trueFalse/oddOneOut/multiSelect/insertSentence */
  options?: string[];
  /** index đáp án đúng trong `options` (hoặc trong `segments` với tapSegment) */
  answer?: number;
  /** multiSelect */
  answerIndexes?: number[];
  /** insertSentence: câu cần chèn */
  insertText?: string;

  /** match: cột trái `options`, cột phải đúng thứ tự tương ứng */
  optionsRight?: string[];
  /** wordOrdering/jumbledOrder: các mảnh theo đúng thứ tự */
  ordered?: string[];
  /** categorize */
  categories?: string[];
  items?: CategorizeItem[];
  /** clozeBank: đoạn văn có chỗ trống {0},{1}... */
  clozeText?: string;
  blanks?: string[];
  bank?: string[];
  /** clozeChoice: các lựa chọn cho từng chỗ trống, đáp án đúng nằm trong `blanks` */
  blankOptions?: string[][];
  /** tapSegment */
  segments?: Segment[];
  /** Các đáp án gõ chấp nhận được (fillBlank/scramble/...) */
  answers?: string[];
  /** fillBlank/dictation: câu có chỗ trống ___ */
  sentence?: string;
  /** dictation: câu đầy đủ để đọc */
  speak?: string;

  /** V4 — câu luyện thêm, không tính vào điểm đề */
  bonus?: boolean;
  /** V5 — từ cần nhớ của câu này. Để trống thì hệ thống tự quét từ của ngày trong đề bài & đáp án */
  keyWords?: string[];
  /** V5 — cặp paraphrase giữa bài đọc và đáp án: [chữ trong bài, chữ trong đáp án] */
  paraphrasePairs?: [string, string][];

  hintLevels: HintLevel[];
  explanation: string;
  /** Lý do sai theo index đáp án */
  distractorNotes?: Record<number, string>;
  /** Nhóm câu cùng chiến lược → sinh báo cáo & gợi ý ôn tập */
  strategyTag: string;
  /** Trích dẫn trong passage để highlight khi xem giải thích */
  sourceRef?: string;
}

export type SectionKind = 'warmup' | 'mini' | 'exam' | 'final';

export interface TestSection {
  id: string;
  kind: SectionKind;
  title: string;
  subtitle: string;
  /** Chế độ làm bài cố định của section: practice chấm từng câu, exam chấm cuối bài */
  mode: 'practice' | 'exam';
  /** Thời lượng tính bằng giây. 0 = không giới hạn */
  durationSec: number;
  /** % cần đạt để pass. 0 = không gate */
  passThreshold: number;
  /** Section phải pass trước khi mở */
  requires?: string;
  questionIds: string[];
  /** Cho phép chạm từ vựng trong bài đọc để xem nghĩa */
  lookup?: boolean;
  /** Round cuối & Warm-up: số từ tối đa */
  maxWords?: number;
  /** V1 — mồi từ trước mỗi bài đọc */
  prime?: boolean;
  /** V3 — câu hỏi nối tiếp 10 giây sau câu từ vựng */
  followUp?: boolean;
  /** V4 — chèn câu luyện từ theo form đề (không tính điểm) */
  bonusQuestions?: boolean;
  /** V6 — phiếu tô đáp án */
  answerSheet?: boolean;
  /** V7 — đọc lại bài dạng cloze sau khi nộp */
  clozeReview?: boolean;
}

export interface DayContent {
  dayId: number;
  title: string;
  topic: string;
  passages: Passage[];
  vocab: VocabItem[];
  questions: Question[];
  sections: TestSection[];
  /** Chiến lược theo strategyTag */
  strategies: Record<string, { name: string; tip: string }>;
}

// ===== Tiến độ (runtime, localStorage) =====

export type TestMode = 'practice' | 'exam' | 'review';

export interface SectionProgress {
  attempts: number;
  passed: boolean;
  /** Điểm cao nhất sau khi trừ hint, % */
  bestScore: number;
  /** Điểm thô lần gần nhất, % */
  lastRawScore: number;
  lastScore: number;
  hintsUsed: number;
  /** Giây */
  timeSpent: number;
  wrongQuestionIds: string[];
  lastAt?: string;
}

export interface VocabMastery {
  correct: number;
  wrong: number;
  /** Đúng liên tiếp */
  streak: number;
  /** Đã dùng hint bậc 3 → không được mastered */
  hint3Used: boolean;
  mastered: boolean;
  /** Bậc ôn tập 0..3 — quyết định khoảng cách lần ôn kế tiếp */
  level: number;
  /** ISO date (yyyy-mm-dd) của lần ôn kế tiếp. Trống = chưa vào lịch ôn */
  nextReviewAt?: string;
  /** Lần gần nhất từ này được hỏi */
  lastAt?: string;
}

/** Sổ từ — gom từ đã tra, từ sai, từ tự đánh dấu (V8) */
export type WordSource = 'lookup' | 'wrong' | 'marked';

export interface WordBookEntry {
  word: string;
  dayId: number;
  source: WordSource;
  addedAt: string;
}

/** Thống kê câu sai theo dạng bài */
export interface WrongBankEntry {
  questionId: string;
  dayId: number;
  sectionId: string;
  format: QuestionFormat;
  strategyTag: string;
  wrongCount: number;
  lastWrongAt: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  sections: Record<string, SectionProgress>;
  vocabMastery: Record<string, VocabMastery>;
  /** Từ học sinh đã chạm tra trong bài đọc, theo ngày */
  lookups?: Record<string, string[]>;
  /** Sổ từ (V8) */
  wordBook: WordBookEntry[];
  /** Câu sai tích lũy, dùng cho báo cáo giáo viên */
  wrongBank: WrongBankEntry[];
  totalTimeSpent: number;
  updatedAt: string;
}

// ===== Phiên làm bài (trong RAM, không persist) =====

/** Đáp án học sinh — kiểu tùy dạng bài */
export type Given = number | number[] | string | string[] | null;

export interface AnswerRecord {
  questionId: string;
  given: Given;
  /** 0..1 — chấm từng phần cho match/categorize/cloze */
  fraction: number;
  correct: boolean;
  /** Bậc hint cao nhất đã dùng, 0 = không dùng */
  hintLevelUsed: number;
  /** điểm sau trừ hint 0..1 */
  score: number;
  timeSpentSec: number;
}
