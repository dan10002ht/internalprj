import type { Passage, Question } from '@/types';

// Ngày 1 — phần P1–P4 của 2 đề tổng hợp, soạn theo quy tắc /soan-de (khuôn đề tốt nghiệp THPT từ 2025),
// xoay quanh chủ đề Unit 2 và từ vựng bài đọc 1–3. Phần đọc hiểu lấy trực tiếp từ đề gốc (unit2/reading.ts).
//   Đề 1: P1 thông báo (6) + P2 tờ rơi (6) + bài đọc 1, 2
//   Đề 2: P3 sắp xếp (5) + P4 điền câu (5) + bài đọc 3
// Số trong chỗ trống (1), (2)… khớp với số câu trong từng đề.

const NOTICE = 'Read the following announcement and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks.';
const LEAFLET = 'Read the following leaflet and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks.';
const TEXT = 'Read the following passage and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks.';
const ARRANGE = 'Mark the letter A, B, C or D on your answer sheet to indicate the best arrangement of utterances or sentences to make a meaningful exchange or text in each of the following questions.';

export const examPassages: Passage[] = [
  {
    id: 'd1e1-notice', kind: 'notice', title: 'Bridging the Gap: Family Weekend at Green Park', instruction: NOTICE,
    paragraphs: [
      'Green Park Community Centre is pleased to announce its first Family Weekend for families who want to live in greater (1) ______.',
      'Over two days, grandparents, parents and teenagers will take part in cooking classes, outdoor games and a storytelling corner (2) ______ by local volunteers. In our "House Rules" workshop, family counsellors will help parents and teenagers (3) ______ a compromise on everyday issues such as curfews, chores and screen time.',
      'The event is free (4) ______ charge, but places are limited. Since the centre (5) ______ by the city council in 2015, more than 3,000 families have joined our activities. Register now and don\'t miss this chance to (6) ______ with your relatives!',
    ],
    paragraphsVi: [
      'Trung tâm Cộng đồng Green Park hân hạnh thông báo Cuối tuần Gia đình đầu tiên dành cho những gia đình muốn sống hòa thuận hơn.',
      'Trong hai ngày, ông bà, bố mẹ và các bạn tuổi teen sẽ tham gia lớp nấu ăn, trò chơi ngoài trời và góc kể chuyện do các tình nguyện viên địa phương phụ trách. Trong buổi workshop "Nội quy gia đình", các chuyên gia tư vấn gia đình sẽ giúp bố mẹ và con cái đạt được thỏa hiệp về những chuyện hằng ngày như giờ giới nghiêm, việc nhà và thời gian dùng màn hình.',
      'Sự kiện hoàn toàn miễn phí nhưng số chỗ có hạn. Từ khi trung tâm được thành phố thành lập năm 2015, hơn 3.000 gia đình đã tham gia các hoạt động của chúng tôi. Hãy đăng ký ngay và đừng bỏ lỡ cơ hội hàn huyên cùng người thân!',
    ],
  },
  {
    id: 'd1e1-leaflet', kind: 'leaflet', title: 'Living Under One Roof — Tips for Multi-generational Families', instruction: LEAFLET,
    paragraphs: [
      'Sharing a home with three generations can be wonderful, but it is not always easy. Follow our tips to keep the peace!',
      '• Respect privacy. Everyone needs (7) ______ space of their own, even if it is just a corner of a room.',
      '• Share the chores. When one person does everything, the (8) ______ can lead to exhaustion and resentment.',
      '• Talk it out. Deal with small disagreements early; (9) ______, they may turn into lasting tension.',
      '• Learn from each other. Grandparents can pass on traditions, and teenagers can help them (10) ______ new technology.',
      '• Plan a family activity every week, such as a (11) ______ meal at a local restaurant.',
      '• Remember: (12) ______ — when everyone helps, the work becomes lighter.',
    ],
    paragraphsVi: [
      'Sống chung ba thế hệ có thể rất tuyệt, nhưng không phải lúc nào cũng dễ dàng. Hãy làm theo những gợi ý sau để giữ hòa khí!',
      '• Tôn trọng sự riêng tư. Ai cũng cần một chút không gian riêng, dù chỉ là một góc phòng.',
      '• Chia sẻ việc nhà. Khi một người làm hết mọi việc, gánh nặng đó có thể dẫn đến kiệt sức và ấm ức.',
      '• Nói chuyện thẳng thắn. Giải quyết bất đồng nhỏ từ sớm; nếu không, chúng có thể trở thành căng thẳng kéo dài.',
      '• Học hỏi lẫn nhau. Ông bà có thể truyền lại truyền thống, còn các bạn trẻ có thể giúp ông bà làm quen với công nghệ mới.',
      '• Lên kế hoạch một hoạt động gia đình mỗi tuần, ví dụ một bữa ăn Việt truyền thống ngon miệng ở nhà hàng gần nhà.',
      '• Hãy nhớ: nhiều tay thì việc nhẹ — khi ai cũng góp sức, công việc trở nên nhẹ nhàng hơn.',
    ],
  },
  {
    id: 'd1e2-text', kind: 'text', title: 'Three generations, one home', instruction: TEXT,
    paragraphs: [
      "When fifteen-year-old Minh moved into his grandparents' house in Ha Noi with his parents, he expected the change to be difficult. (6) ______. At first, small things caused arguments: his grandmother insisted that everyone eat dinner together at six, while Minh would rather finish his online game first.",
      "Money was another source of stress. Minh's parents had become the family's main breadwinners, (7) ______. Minh noticed that his mother often came home exhausted and, at times, short-tempered.",
      'Things began to change when the family held a meeting one Sunday evening. (8) ______. Minh agreed to put his phone away during meals, and his grandparents accepted a flexible curfew at weekends. (9) ______, the house became noticeably calmer.',
      'Today, Minh says that living in a multi-generational home has taught him more than any textbook. His grandfather has shared stories about the old days, (10) ______. "We are still very different," Minh admits, "but now we try to understand each other instead of trying to win."',
    ],
    paragraphsVi: [
      'Khi Minh, 15 tuổi, cùng bố mẹ chuyển về sống trong nhà ông bà ở Hà Nội, cậu đã đoán trước sự thay đổi sẽ khó khăn. Cậu đã đúng, ít nhất là lúc đầu. Ban đầu, những chuyện nhỏ cũng gây cãi vã: bà nhất quyết cả nhà phải ăn tối cùng nhau lúc 6 giờ, còn Minh lại muốn chơi xong ván game trước.',
      'Tiền bạc là một nguồn căng thẳng khác. Bố mẹ Minh đã trở thành trụ cột kinh tế chính của gia đình, nuôi cả con trai lẫn bố mẹ già. Minh để ý thấy mẹ thường về nhà trong tình trạng kiệt sức và đôi khi dễ cáu.',
      'Mọi thứ bắt đầu thay đổi khi cả nhà họp vào một tối Chủ nhật. Mỗi thành viên đều được nói ra điều làm mình khó chịu và điều mình cần. Minh đồng ý cất điện thoại trong bữa ăn, còn ông bà chấp nhận giờ về linh hoạt vào cuối tuần. Nhờ những thỏa hiệp này, ngôi nhà trở nên yên ả hơn hẳn.',
      'Giờ đây, Minh nói rằng sống trong một gia đình nhiều thế hệ đã dạy cậu nhiều hơn bất kỳ cuốn sách giáo khoa nào. Ông kể cho cậu nghe chuyện ngày xưa, và đáp lại, Minh dạy ông cách gọi video. "Chúng tôi vẫn rất khác nhau," Minh thừa nhận, "nhưng giờ chúng tôi cố gắng hiểu nhau thay vì cố thắng."',
    ],
  },
];

type Extra = Partial<Question>;

/** Câu điền khuyết P1/P2/P4: giữ thứ tự A–D như đề */
function blank(
  id: string, passageId: string, n: number, strategyTag: string, difficulty: 1 | 2 | 3,
  options: string[], optionsVi: string[], answer: number,
  hint: string, explanation: string, extra: Extra = {},
): Question {
  return {
    id, skillType: 'cloze', format: 'mcq', difficulty, targetWords: [], passageId,
    stem: `Choose the option that best fits blank (${n}).`,
    stemVi: `Chọn đáp án phù hợp nhất cho chỗ trống (${n}).`,
    focus: `(${n})`, fixedOrder: true, options, optionsVi, answer,
    hintLevels: [{ type: 'custom', text: hint }, { type: 'eliminate' }, { type: 'eliminateTwo' }],
    explanation, strategyTag, ...extra,
  };
}

/** Câu sắp xếp P3 */
function arrange(
  id: string, difficulty: 1 | 2 | 3, stem: string, stemVi: string, options: string[], answer: number,
  hint: string, explanation: string, extra: Extra = {},
): Question {
  return {
    id, skillType: 'reading', format: 'mcq', difficulty, targetWords: [], instruction: ARRANGE,
    stem, stemVi, fixedOrder: true, options, answer,
    hintLevels: [{ type: 'custom', text: hint }, { type: 'eliminate' }, { type: 'eliminateTwo' }],
    explanation, strategyTag: 'arrangement', ...extra,
  };
}

// ================= ĐỀ 1 — P1 + P2 =================
export const exam1: Question[] = [
  // P1 — thông báo
  blank('d1e1-1', 'd1e1-notice', 1, 'clozeNotice', 1,
    ['harmonious', 'harmonise', 'harmony', 'harmoniously'],
    ['harmonious (adj) — hòa thuận', 'harmonise (v) — làm cho hài hòa', 'harmony (n) — sự hòa thuận', 'harmoniously (adv) — một cách hòa thuận'], 2,
    'Sau tính từ "greater" cần loại từ gì?',
    'Word form: greater (adj) + DANH TỪ → live in greater harmony = sống hòa thuận hơn. Cụm "live in harmony" rất hay gặp.',
    { targetWords: ['harmony'], distractorNotes: { 0: 'harmonious là tính từ, không đứng sau tính từ "greater" khi thiếu danh từ.', 3: 'Trạng từ không đứng sau "greater".' } }),
  blank('d1e1-2', 'd1e1-notice', 2, 'clozeNotice', 2,
    ['run', 'running', 'which runs', 'is run'],
    ['run (V3) — được điều hành', 'running (V-ing) — đang điều hành', 'which runs — cái mà điều hành', 'is run — được điều hành (động từ chia)'], 0,
    'Góc kể chuyện tự điều hành hay ĐƯỢC tình nguyện viên điều hành? Câu đã có động từ chính "will take part".',
    'Rút gọn mệnh đề quan hệ bị động: a storytelling corner (which is) run by local volunteers → dùng V3 "run".',
    { distractorNotes: { 1: 'V-ing dùng khi rút gọn mệnh đề CHỦ ĐỘNG — góc kể chuyện không tự điều hành.', 2: '"which runs by volunteers" sai vì phải là bị động (is run by).', 3: 'Câu đã có động từ chính, thêm "is run" thành 2 động từ chính.' } }),
  blank('d1e1-3', 'd1e1-notice', 3, 'clozeNotice', 1,
    ['do', 'reach', 'take', 'bring'],
    ['do — làm', 'reach — đạt được', 'take — lấy, cầm', 'bring — mang'], 1,
    'Động từ nào đi với "a compromise" (đã gặp trong Mini 2)?',
    'Collocation: reach a compromise = đạt được thỏa hiệp. Sau "help sb" dùng động từ nguyên mẫu.',
    { targetWords: ['compromise'] }),
  blank('d1e1-4', 'd1e1-notice', 4, 'clozeNotice', 1,
    ['of', 'from', 'for', 'with'],
    ['of', 'from', 'for', 'with'], 0,
    'Cụm cố định nghĩa là "miễn phí".',
    'free of charge = miễn phí (cụm giới từ cố định). Lưu ý: "for free" cũng là miễn phí nhưng không có "charge" theo sau.'),
  blank('d1e1-5', 'd1e1-notice', 5, 'clozeNotice', 3,
    ['set up', 'has set up', 'is setting up', 'was set up'],
    ['set up — thành lập (quá khứ, chủ động)', 'has set up — đã thành lập (hiện tại hoàn thành)', 'is setting up — đang thành lập', 'was set up — được thành lập (quá khứ, bị động)'], 3,
    'Hai dấu hiệu: "in 2015" (thời điểm trong quá khứ) và "by the city council" (ai làm).',
    'Sau "Since" + mốc thời gian quá khứ dùng quá khứ đơn; trung tâm ĐƯỢC hội đồng thành phố thành lập → bị động: was set up. Mệnh đề chính dùng hiện tại hoàn thành "have joined".',
    { distractorNotes: { 0: 'Chủ động sai nghĩa: trung tâm không tự thành lập, và có "by the city council".', 1: 'Mệnh đề sau "since" chỉ mốc thời gian dùng quá khứ đơn.' } }),
  blank('d1e1-6', 'd1e1-notice', 6, 'clozeNotice', 2,
    ['look up', 'put up', 'catch up', 'take up'],
    ['look up — tra cứu', 'put up — dựng lên, cho ở nhờ', 'catch up (with sb) — hàn huyên, gặp lại', 'take up — bắt đầu (sở thích)'], 2,
    'Cụm động từ nào đi với "with + người" và mang nghĩa trò chuyện, cập nhật tin tức của nhau?',
    'catch up with sb = gặp gỡ, trò chuyện để biết tin tức của nhau.',
    { distractorNotes: { 1: 'put up with sb = chịu đựng ai — sai nghĩa với lời mời tích cực.' } }),
  // P2 — tờ rơi
  blank('d1e1-7', 'd1e1-leaflet', 7, 'clozeLeaflet', 2,
    ['a few', 'some', 'many', 'a number of'],
    ['a few — một vài (đếm được)', 'some — một ít, một vài', 'many — nhiều (đếm được)', 'a number of — một số (đếm được)'], 1,
    '"space" (không gian) là danh từ đếm được hay không đếm được?',
    '"space" theo nghĩa không gian là danh từ không đếm được → chỉ "some" dùng được.',
    { distractorNotes: { 0: 'a few + danh từ đếm được số nhiều.', 2: 'many + danh từ đếm được số nhiều.', 3: 'a number of + danh từ đếm được số nhiều.' } }),
  blank('d1e1-8', 'd1e1-leaflet', 8, 'clozeLeaflet', 2,
    ['benefit', 'tradition', 'harmony', 'burden'],
    ['benefit — lợi ích', 'tradition — truyền thống', 'harmony — sự hòa thuận', 'burden — gánh nặng'], 3,
    'Điều gì "dẫn đến kiệt sức và ấm ức" khi một người làm hết mọi việc?',
    'burden = gánh nặng. Ý này lấy từ bài đọc 1: "This double burden can lead to exhaustion and ... resentment".',
    { targetWords: ['burden'] }),
  blank('d1e1-9', 'd1e1-leaflet', 9, 'clozeLeaflet', 3,
    ['moreover', 'therefore', 'otherwise', 'however'],
    ['moreover — hơn nữa', 'therefore — vì vậy', 'otherwise — nếu không thì', 'however — tuy nhiên'], 2,
    'Vế sau nói điều sẽ xảy ra nếu KHÔNG giải quyết sớm.',
    'otherwise = nếu không thì: hãy giải quyết sớm; nếu không, chúng thành căng thẳng kéo dài.',
    { targetWords: ['tension'], distractorNotes: { 1: 'therefore = vì vậy → nghĩa là "giải quyết sớm nên sẽ căng thẳng" — vô lý.', 3: 'however chỉ sự đối lập, không chỉ hậu quả khi không làm.' } }),
  blank('d1e1-10', 'd1e1-leaflet', 10, 'clozeLeaflet', 2,
    ['put up with', 'get used to', 'look up to', 'give in to'],
    ['put up with — chịu đựng', 'get used to — làm quen với', 'look up to — kính trọng', 'give in to — chịu thua, nhượng bộ'], 1,
    'Các bạn trẻ giúp ông bà làm gì với công nghệ mới?',
    'get used to + N = làm quen với: giúp ông bà làm quen với công nghệ mới.',
    { distractorNotes: { 0: 'Giúp ông bà "chịu đựng" công nghệ — không hợp ngữ cảnh học hỏi.', 3: 'give in to = nhượng bộ — sai nghĩa.' } }),
  blank('d1e1-11', 'd1e1-leaflet', 11, 'clozeLeaflet', 3,
    ['delicious traditional Vietnamese', 'traditional delicious Vietnamese', 'Vietnamese delicious traditional', 'delicious Vietnamese traditional'],
    ['ngon — truyền thống — Việt Nam', 'truyền thống — ngon — Việt Nam', 'Việt Nam — ngon — truyền thống', 'ngon — Việt Nam — truyền thống'], 0,
    'Thứ tự tính từ: Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose.',
    'delicious (ý kiến) → traditional (tuổi/kiểu) → Vietnamese (nguồn gốc) → meal.'),
  blank('d1e1-12', 'd1e1-leaflet', 12, 'clozeLeaflet', 2,
    ['too many cooks spoil the broth', 'actions speak louder than words', 'the early bird catches the worm', 'many hands make light work'],
    ['lắm thầy thối ma', 'việc làm hơn lời nói', 'trâu chậm uống nước đục (dậy sớm thì được lợi)', 'nhiều tay thì việc nhẹ'], 3,
    'Câu giải thích ngay sau: "when everyone helps, the work becomes lighter".',
    'Many hands make light work = nhiều người cùng làm thì việc nhẹ đi — khớp với phần giải thích sau dấu gạch.',
    { distractorNotes: { 0: 'Ý ngược lại: nhiều người cùng làm thì hỏng việc.' } }),
];

// ================= ĐỀ 2 — P3 + P4 =================
export const exam2: Question[] = [
  // P3 — sắp xếp
  arrange('d1e2-1', 1,
    'a. Grandpa: Yes, please. Show me how to start a video call.\nb. Minh: Grandpa, would you like me to teach you how to use your new phone?\nc. Minh: Sure! First, tap this green icon here.',
    'a. Ông: Có chứ. Chỉ ông cách gọi video nhé.\nb. Minh: Ông ơi, ông có muốn cháu dạy ông dùng điện thoại mới không?\nc. Minh: Dạ được ạ! Đầu tiên ông bấm vào biểu tượng màu xanh này.',
    ['a – b – c', 'c – a – b', 'b – c – a', 'b – a – c'], 3,
    'Lời đề nghị giúp đỡ phải đứng đầu.',
    'b (Minh đề nghị) → a (ông đồng ý và nhờ) → c (Minh bắt đầu hướng dẫn).',
    { targetWords: ['digital native'] }),
  arrange('d1e2-2', 2,
    'a. Mai: Yes, but she always asks me to stop playing games and help with dinner.\nb. Tom: That sounds nice. Do you get on well with her?\nc. Mai: I live with my parents and my grandmother.\nd. Tom: Who do you live with, Mai?\ne. Tom: Maybe you could invite her to play a simple game with you after dinner.',
    'a. Mai: Có, nhưng bà luôn bảo mình dừng chơi game để giúp nấu bữa tối.\nb. Tom: Nghe hay đấy. Bạn có hợp với bà không?\nc. Mai: Mình sống với bố mẹ và bà.\nd. Tom: Bạn sống với ai vậy Mai?\ne. Tom: Có lẽ bạn có thể rủ bà chơi một trò đơn giản cùng bạn sau bữa tối.',
    ['d – c – b – a – e', 'c – d – a – b – e', 'd – b – c – a – e', 'd – c – a – b – e'], 0,
    'Câu hỏi "Who do you live with?" mở đầu. "her" ở câu b chỉ người bà ở câu c.',
    'd (hỏi) → c (trả lời) → b (hỏi tiếp về bà — "her") → a (Yes, but… trả lời câu hỏi Yes/No) → e (gợi ý giải quyết).',
    { targetWords: ['multi-generational'] }),
  arrange('d1e2-3', 2,
    'Dear Grandma,\na. I hope you are well and not too tired from looking after your garden.\nb. I have some good news: last week Dad finally agreed to a flexible curfew for me.\nc. He said that our long talk had shown him I was responsible enough.\nd. That talk only happened because you advised me to explain my feelings calmly, so thank you!\ne. Please come and visit us soon — I really miss your cooking.\nLove,\nLinh',
    'Bà thân yêu,\na. Cháu mong bà khỏe và không quá mệt vì chăm vườn.\nb. Cháu có tin vui: tuần trước cuối cùng bố đã đồng ý cho cháu giờ về linh hoạt.\nc. Bố nói cuộc nói chuyện dài của hai bố con cho bố thấy cháu đủ trách nhiệm.\nd. Cuộc nói chuyện đó chỉ diễn ra vì bà đã khuyên cháu bình tĩnh nói ra cảm xúc của mình, nên cháu cảm ơn bà!\ne. Bà sớm đến thăm nhà mình nhé — cháu nhớ món bà nấu lắm.\nThương bà,\nLinh',
    ['b – a – c – e – d', 'a – c – b – d – e', 'a – b – c – d – e', 'b – c – a – d – e'], 2,
    'Thư mở bằng lời hỏi thăm. "He" ở câu c chỉ ai? "That talk" ở câu d nhắc lại điều gì?',
    'a (hỏi thăm) → b (tin vui về bố) → c ("He" = Dad, nhắc tới "our long talk") → d ("That talk" nối với c, cảm ơn bà) → e (lời kết).',
    { targetWords: ['flexible', 'curfew'] }),
  arrange('d1e2-4', 3,
    'a. As a result, many teenagers feel that their parents do not trust them.\nb. In many families, curfews are a common cause of conflict.\nc. Family counsellors suggest that parents explain their reasons and listen to their children.\nd. Parents often set a fixed time without discussing it with their children first.\ne. When this happens, a curfew can become a way to build trust rather than destroy it.',
    'a. Kết quả là nhiều bạn trẻ cảm thấy bố mẹ không tin tưởng mình.\nb. Trong nhiều gia đình, giờ giới nghiêm là nguyên nhân gây mâu thuẫn phổ biến.\nc. Các chuyên gia tư vấn gia đình khuyên cha mẹ giải thích lý do và lắng nghe con.\nd. Cha mẹ thường đặt giờ cố định mà không bàn bạc trước với con.\ne. Khi điều đó xảy ra, giờ giới nghiêm có thể trở thành cách xây dựng niềm tin thay vì phá hủy nó.',
    ['d – b – a – e – c', 'b – d – a – c – e', 'b – a – d – c – e', 'c – b – d – a – e'], 1,
    'Câu mở đầu là câu nêu chủ đề chung. "As a result" phải đứng ngay sau nguyên nhân.',
    'b (nêu vấn đề) → d (nguyên nhân) → a (As a result: hậu quả) → c (lời khuyên) → e ("this" = việc giải thích và lắng nghe ở c).',
    { targetWords: ['curfew'] }),
  arrange('d1e2-5', 3,
    'a. However, these limits often lead to angry arguments rather than real change.\nb. Today\'s teenagers have grown up with smartphones and cannot imagine life without them.\nc. Worried about how much time their children spend online, many parents set strict limits on screen time.\nd. Therefore, experts suggest that families agree on shared habits, such as phone-free meals, that apply to everyone.\ne. Their parents, by contrast, often feel uncertain about new technology.',
    'a. Tuy nhiên, những giới hạn này thường dẫn đến cãi vã gay gắt hơn là thay đổi thật sự.\nb. Thanh thiếu niên ngày nay lớn lên cùng điện thoại thông minh và không thể tưởng tượng cuộc sống thiếu chúng.\nc. Lo lắng về thời gian con cái dành cho mạng, nhiều cha mẹ đặt giới hạn nghiêm ngặt cho thời gian dùng màn hình.\nd. Vì vậy, các chuyên gia khuyên gia đình nên thống nhất những thói quen chung, như bữa ăn không điện thoại, áp dụng cho tất cả mọi người.\ne. Ngược lại, cha mẹ các em thường không tự tin với công nghệ mới.',
    ['b – c – e – a – d', 'e – b – c – d – a', 'b – e – a – c – d', 'b – e – c – a – d'], 3,
    '"by contrast" ở câu e đối lập với ai? "these limits" ở câu a nhắc lại điều gì?',
    'b (thanh thiếu niên) → e (by contrast: cha mẹ) → c (cha mẹ đặt giới hạn) → a (However, "these limits" gây cãi vã) → d (Therefore: lời khuyên).',
    { targetWords: ['digital native', 'uncertain'] }),
  // P4 — điền câu / mệnh đề
  blank('d1e2-6', 'd1e2-text', 6, 'sentenceFill', 2,
    ['Being right, at least in the beginning', 'He was right, at least in the beginning', 'Which turned out to be right in the beginning', 'He was wrong, as everything went smoothly from day one'],
    ['Đúng, ít nhất là lúc đầu (không phải câu hoàn chỉnh)', 'Cậu đã đúng, ít nhất là lúc đầu', 'Điều mà hóa ra đúng lúc đầu (không phải câu độc lập)', 'Cậu đã sai, vì mọi chuyện suôn sẻ ngay từ đầu'], 1,
    'Câu ngay sau nói "At first, small things caused arguments" — dự đoán của Minh đúng hay sai?',
    'Cần một câu hoàn chỉnh, khẳng định dự đoán "khó khăn" là đúng để nối với câu sau kể các cuộc cãi vã.',
    { distractorNotes: { 3: 'Mâu thuẫn với câu sau: lúc đầu có cãi vã.', 0: 'Thiếu chủ ngữ và động từ chia.', 2: '"Which" không mở đầu một câu độc lập.' } }),
  blank('d1e2-7', 'd1e2-text', 7, 'sentenceFill', 3,
    ['supporting both their son and their ageing parents', 'supported both their son and their ageing parents', 'who supporting both their son and their ageing parents', 'which they supported both their son and their ageing parents'],
    ['nuôi cả con trai lẫn bố mẹ già', 'đã nuôi cả con trai lẫn bố mẹ già (thiếu liên từ)', 'sai ngữ pháp (who + V-ing)', 'sai ngữ pháp ("which" thừa, không thay cho người)'], 0,
    'Câu đã có động từ chính "had become". Phần sau dấu phẩy bổ sung thông tin.',
    'Rút gọn mệnh đề chủ động bằng V-ing: ..., (and they supported) → supporting both their son and their ageing parents.',
    { targetWords: ['breadwinner'], distractorNotes: { 1: 'Hai động từ chia nối bằng dấu phẩy không có liên từ → sai.', 2: 'Sau "who" phải là động từ chia: who supported.', 3: 'Mệnh đề sau "which" đã đủ chủ ngữ và tân ngữ nên "which" không có chức năng; hơn nữa "which" không thay cho người (breadwinners).' } }),
  blank('d1e2-8', 'd1e2-text', 8, 'sentenceFill', 2,
    ['Every member giving a chance to say what upset them', 'Although every member was given a chance to speak', 'No one was allowed to talk about what upset them or what they needed', 'Every member was given a chance to say what upset them and what they needed'],
    ['sai ngữ pháp (thiếu động từ chia)', 'Mặc dù mỗi người được phát biểu (mệnh đề phụ đứng một mình)', 'Không ai được phép nói về điều làm mình khó chịu hay điều mình cần', 'Mỗi thành viên được nói ra điều làm mình khó chịu và điều mình cần'], 3,
    'Cuộc họp này giúp mọi thứ "bắt đầu thay đổi" và dẫn tới các thỏa thuận ở câu sau.',
    'Câu hoàn chỉnh, thể bị động "was given a chance", và hợp logic: mọi người nói ra nhu cầu → các bên thỏa hiệp.',
    { distractorNotes: { 2: 'Mâu thuẫn với kết quả tích cực của cuộc họp.', 1: 'Mệnh đề "Although…" không thể đứng một mình thành câu.' } }),
  blank('d1e2-9', 'd1e2-text', 9, 'sentenceFill', 2,
    ['In spite of these compromises', 'These compromises were made', 'As a result of these compromises', 'Having been made these compromises'],
    ['Bất chấp những thỏa hiệp này', 'Những thỏa hiệp này đã được đưa ra (câu hoàn chỉnh)', 'Nhờ những thỏa hiệp này', 'sai ngữ pháp'], 2,
    'Ngôi nhà yên ả hơn là KẾT QUẢ hay điều TRÁI NGƯỢC với các thỏa hiệp?',
    'As a result of + N = nhờ / do kết quả của: thỏa hiệp → nhà yên ả hơn.',
    { targetWords: ['compromise'], distractorNotes: { 0: 'In spite of chỉ sự trái ngược — sai logic.', 1: 'Một câu hoàn chỉnh + dấu phẩy + câu khác → sai ngữ pháp.' } }),
  blank('d1e2-10', 'd1e2-text', 10, 'sentenceFill', 3,
    ['which Minh teaching him how to make video calls', 'and Minh, in return, has taught him how to make video calls', 'Minh has taught him how to make video calls in return', 'but Minh has refused to talk to him since then'],
    ['sai ngữ pháp', 'và đáp lại, Minh đã dạy ông cách gọi video', 'Minh đã dạy ông gọi video (thiếu liên từ)', 'nhưng Minh từ chối nói chuyện với ông từ đó'], 1,
    'Đoạn cuối nói về việc học hỏi lẫn nhau. Phần sau dấu phẩy cần một liên từ.',
    '"and ..., in return, ..." thể hiện sự trao đổi hai chiều: ông kể chuyện, Minh dạy ông gọi video.',
    { distractorNotes: { 2: 'Hai mệnh đề độc lập nối bằng dấu phẩy → sai.', 3: 'Mâu thuẫn với ý "try to understand each other".' } }),
];

/** Đề 1: P1 + P2 + bài đọc 1, 2 · Đề 2: P3 + P4 + bài đọc 3 */
export const exam1Ids = [...exam1.map((q) => q.id), 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'r16'];
export const exam2Ids = [...exam2.map((q) => q.id), 'r17', 'r18', 'r19', 'r20', 'r21', 'r22', 'r23', 'r24'];
