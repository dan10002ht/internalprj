import type { Passage, Question } from '@/types';

// Ngày 2 — phần P1–P4 của 2 đề tổng hợp, soạn theo quy tắc /soan-de (khuôn đề tốt nghiệp THPT từ 2025),
// xoay quanh chủ đề Unit 2 (kỳ vọng nghề nghiệp, vai trò giới, sự tò mò giữa các thế hệ) và từ vựng bài đọc 4–6.
// Phần đọc hiểu lấy trực tiếp từ đề gốc (unit2/reading.ts).
//   Đề 1: P1 thông báo (6) + P2 tờ rơi (6) + bài đọc 4, 5
//   Đề 2: P3 sắp xếp (5) + P4 điền câu (5) + bài đọc 6
// Số trong chỗ trống (1), (2)… khớp với số câu trong từng đề.

const NOTICE = 'Read the following announcement and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks.';
const LEAFLET = 'Read the following leaflet and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks.';
const TEXT = 'Read the following passage and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks.';
const ARRANGE = 'Mark the letter A, B, C or D on your answer sheet to indicate the best arrangement of utterances or sentences to make a meaningful exchange or text in each of the following questions.';

export const examPassages: Passage[] = [
  {
    id: 'd2e1-notice', kind: 'notice', title: 'Talking Futures: A Career Workshop for Families', instruction: NOTICE,
    paragraphs: [
      'Lotus High School is pleased to announce "Talking Futures", a free workshop (1) ______ to help parents and teenagers discuss career choices calmly and openly.',
      "For many families, choosing a career is not a private decision. Students often feel that their choice carries great (2) ______ weight, as their parents dream of seeing them become doctors or lawyers. Yet today's economy offers young people a far (3) ______ range of options than their parents ever had. At the workshop, career advisers will help parents (4) ______ unfamiliar professions such as game design and digital marketing.",
      'More than 500 families (5) ______ part in the programme since it began in 2022. Places are limited, so please register at the school office (6) ______ Friday, 15 May.',
    ],
    paragraphsVi: [
      'Trường THPT Lotus hân hạnh thông báo chương trình "Talking Futures" — buổi workshop miễn phí được thiết kế để giúp phụ huynh và các bạn tuổi teen bàn chuyện chọn nghề một cách bình tĩnh và cởi mở.',
      'Với nhiều gia đình, chọn nghề không phải là chuyện của riêng một người. Học sinh thường cảm thấy lựa chọn của mình mang sức nặng biểu tượng lớn, vì bố mẹ mơ ước thấy con trở thành bác sĩ hay luật sư. Thế nhưng nền kinh tế ngày nay mang đến cho người trẻ nhiều lựa chọn hơn hẳn so với thời bố mẹ các em. Tại workshop, các chuyên gia hướng nghiệp sẽ giúp phụ huynh tìm hiểu về những nghề còn xa lạ như thiết kế game và marketing số.',
      'Hơn 500 gia đình đã tham gia chương trình kể từ khi bắt đầu vào năm 2022. Số chỗ có hạn, vì vậy vui lòng đăng ký tại văn phòng nhà trường chậm nhất là thứ Sáu, ngày 15 tháng 5.',
    ],
  },
  {
    id: 'd2e1-leaflet', kind: 'leaflet', title: 'Sharing the Load — Housework Tips for Modern Families', instruction: LEAFLET,
    paragraphs: [
      'In many homes, domestic tasks are still not shared equally. Follow these tips to build a fairer family!',
      '• Talk openly. Discuss old assumptions about "men\'s work" and "women\'s work", and don\'t let one person (7) ______ all the housework.',
      '• Make a weekly chart. Write down (8) ______ task, from washing the dishes to taking out the rubbish, and put a name next to it.',
      '• Start early. Teach (9) ______ youngest children simple jobs, such as setting the table or feeding the cat.',
      '• Keep it visible. Pin the chart on a (10) ______ board in the kitchen so that everyone can see it.',
      '• Lead by example. Children copy what they see; (11) ______, if fathers cook and clean, sons are more likely to do the same.',
      '• Be fair. When everyone (12) ______, nobody feels exhausted or treated unfairly.',
    ],
    paragraphsVi: [
      'Ở nhiều gia đình, việc nhà vẫn chưa được chia đều. Hãy làm theo những gợi ý sau để xây dựng một gia đình công bằng hơn!',
      '• Nói chuyện cởi mở. Bàn về những quan niệm cũ như "việc của đàn ông" và "việc của đàn bà", và đừng để một người làm hết việc nhà.',
      '• Lập bảng phân công hằng tuần. Ghi ra từng việc, từ rửa bát đến đổ rác, và ghi tên người phụ trách bên cạnh.',
      '• Bắt đầu sớm. Dạy những đứa con nhỏ nhất các việc đơn giản như dọn bàn ăn hay cho mèo ăn.',
      '• Để ở chỗ dễ thấy. Ghim bảng phân công lên một tấm bảng gỗ tròn nhỏ trong bếp để ai cũng nhìn thấy.',
      '• Làm gương. Trẻ con bắt chước những gì chúng thấy; vì vậy, nếu bố nấu ăn và dọn dẹp, con trai cũng dễ làm theo hơn.',
      '• Công bằng. Khi ai cũng làm tròn phần việc của mình, sẽ không ai cảm thấy kiệt sức hay bị đối xử bất công.',
    ],
  },
  {
    id: 'd2e2-text', kind: 'text', title: 'The question jar', instruction: TEXT,
    paragraphs: [
      'Mrs Hoa, a 68-year-old retired teacher, used to believe that her grandson Duy spent his life "wasting time" on video games. Duy, meanwhile, thought his grandmother was hopelessly old-fashioned. (6) ______. Most family meals ended with someone leaving the table in silence.',
      "Things changed when Duy's mother, (7) ______, suggested a simple experiment. She placed a glass jar on the dining table and asked everyone to write down one question they had always wanted to ask another family member.",
      'The first question Mrs Hoa pulled out was from Duy: "What did you do for fun when you were my age?" To his surprise, she spoke for almost an hour about the games she had invented with her friends during the years of hardship after the war. (8) ______. The next evening, Mrs Hoa wrote a question of her own and asked Duy to show her the game he played every night.',
      'Over the following weeks, the jar filled up with questions about first jobs, school rules and even favourite songs. (9) ______, but they now argue far less often. "I used to think Grandma just wanted to control me," Duy admits. "Now I know she worried because her own childhood was so hard."',
      'Family therapists say that Mrs Hoa\'s family discovered something important: curiosity works better than lectures. (10) ______. As Mrs Hoa puts it, "I didn\'t have to agree with my grandson. I just had to ask him."',
    ],
    paragraphsVi: [
      'Bà Hoa, một giáo viên về hưu 68 tuổi, từng tin rằng cậu cháu Duy chỉ toàn "phí thời gian" vào trò chơi điện tử. Trong khi đó, Duy lại nghĩ bà mình cổ hủ hết chỗ nói. Kết quả là hai bà cháu hiếm khi có một cuộc trò chuyện thật sự. Phần lớn các bữa cơm gia đình kết thúc bằng cảnh có người lặng lẽ bỏ dở bữa ăn.',
      'Mọi chuyện thay đổi khi mẹ Duy, người vừa đọc một bài báo về sự tò mò trong gia đình, đề xuất một thử nghiệm đơn giản. Chị đặt một chiếc lọ thủy tinh lên bàn ăn và đề nghị mỗi người viết ra một câu hỏi mà mình luôn muốn hỏi một thành viên khác.',
      'Câu hỏi đầu tiên bà Hoa rút ra là của Duy: "Hồi bằng tuổi cháu, bà chơi gì cho vui?" Duy bất ngờ khi bà kể suốt gần một tiếng về những trò chơi bà cùng bạn bè tự nghĩ ra trong những năm khó khăn sau chiến tranh. Duy, người chưa từng nghe những câu chuyện này, chăm chú nghe từng lời. Tối hôm sau, bà Hoa tự viết một câu hỏi và nhờ Duy cho bà xem trò chơi cậu chơi mỗi tối.',
      'Những tuần sau đó, chiếc lọ đầy dần những câu hỏi về công việc đầu tiên, nội quy trường học và cả những bài hát yêu thích. Hai bà cháu vẫn bất đồng về nhiều chuyện, chẳng hạn Duy nên thức khuya đến mấy giờ, nhưng giờ họ cãi nhau ít hơn hẳn. "Trước đây cháu cứ nghĩ bà chỉ muốn kiểm soát cháu," Duy thừa nhận. "Giờ cháu hiểu bà lo lắng vì tuổi thơ của bà quá vất vả."',
      'Các nhà trị liệu gia đình cho rằng gia đình bà Hoa đã khám phá ra một điều quan trọng: sự tò mò hiệu quả hơn những bài giảng đạo lý. Khi con người đặt câu hỏi chân thành thay vì đưa ra phán xét, họ bắt đầu nhìn thế giới từ góc nhìn của nhau. Như bà Hoa nói: "Tôi không cần phải đồng ý với cháu mình. Tôi chỉ cần hỏi nó."',
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
  blank('d2e1-1', 'd2e1-notice', 1, 'clozeNotice', 2,
    ['designing', 'designed', 'was designed', 'which designed'],
    ['đang thiết kế', 'được thiết kế', 'đã được thiết kế', 'cái mà đã thiết kế'], 1,
    'Buổi workshop tự thiết kế hay ĐƯỢC thiết kế? Câu đã có động từ chính "is pleased".',
    'Rút gọn mệnh đề quan hệ bị động: a free workshop (which is) designed to help… → dùng V3 "designed".',
    { distractorNotes: { 0: 'V-ing dùng khi rút gọn mệnh đề CHỦ ĐỘNG — workshop không tự thiết kế.', 2: 'Thêm "was designed" thành 2 động từ chính trong một mệnh đề.', 3: '"which designed" là chủ động, sai nghĩa; phải là "which is designed".' } }),
  blank('d2e1-2', 'd2e1-notice', 2, 'clozeNotice', 1,
    ['symbol', 'symbolise', 'symbolically', 'symbolic'],
    ['biểu tượng', 'tượng trưng cho', 'một cách tượng trưng', 'mang tính biểu tượng'], 3,
    'Sau "great" và trước danh từ "weight" cần loại từ gì?',
    'Word form: Cần tính từ symbolic bổ nghĩa cho danh từ weight: great symbolic weight (sức nặng mang tính biểu tượng lớn). Cụm "symbolic weight" có trong bài đọc 4.',
    { targetWords: ['symbolic'], distractorNotes: { 0: 'Danh từ "symbol" không bổ nghĩa cho "weight" ở đây.', 2: 'Trạng từ không đứng trước danh từ.' } }),
  blank('d2e1-3', 'd2e1-notice', 3, 'clozeNotice', 2,
    ['wide', 'widest', 'wider', 'more widely'],
    ['rộng', 'rộng nhất', 'rộng hơn', 'rộng rãi hơn'], 2,
    'Có "far" phía trước và "than" phía sau → cấu trúc so sánh gì?',
    'So sánh hơn: far + ADJ-er + than. "wide" là tính từ ngắn → wider. "far" dùng để nhấn mạnh so sánh hơn (hơn nhiều).',
    { targetWords: [], distractorNotes: { 1: 'So sánh nhất không đi với "than".', 3: 'Cần tính từ bổ nghĩa cho danh từ "range", không dùng trạng từ.' } }),
  blank('d2e1-4', 'd2e1-notice', 4, 'clozeNotice', 2,
    ['look down on', 'find out about', 'put up with', 'turn down'],
    ['coi thường', 'tìm hiểu về', 'chịu đựng', 'từ chối'], 1,
    'Mục đích của workshop là giúp phụ huynh HIỂU về các nghề mới.',
    'find out about sth = tìm hiểu thông tin về điều gì: chuyên gia giúp phụ huynh tìm hiểu về những nghề còn xa lạ.',
    { distractorNotes: { 0: 'look down on = coi thường — trái với mục đích của workshop.', 2: 'put up with = chịu đựng — mang nghĩa tiêu cực, không hợp.', 3: 'turn down = từ chối — sai nghĩa.' } }),
  blank('d2e1-5', 'd2e1-notice', 5, 'clozeNotice', 3,
    ['have taken', 'took', 'are taking', 'had taken'],
    ['đã tham gia tính đến nay', 'đã tham gia trong quá khứ', 'đang tham gia', 'đã tham gia trước một thời điểm trong quá khứ'], 0,
    'Dấu hiệu: "since it began in 2022" — hành động kéo dài từ quá khứ đến hiện tại.',
    'Thông báo đếm số gia đình đã tham gia từ năm 2022 đến hiện tại, nên dùng hiện tại hoàn thành: More than 500 families have taken part… (take part in = tham gia).',
    { distractorNotes: { 1: 'took kể một sự việc đã kết thúc trong quá khứ; câu này tổng kết số người tham gia từ 2022 đến nay.', 3: 'Quá khứ hoàn thành cần một mốc quá khứ khác làm mốc — ở đây không có.' } }),
  blank('d2e1-6', 'd2e1-notice', 6, 'clozeNotice', 2,
    ['until', 'since', 'by', 'for'],
    ['cho đến', 'kể từ', 'chậm nhất là', 'trong khoảng'], 2,
    'Hạn chót đăng ký: "chậm nhất là thứ Sáu".',
    'by + thời điểm = trước hoặc đúng lúc đó (hạn chót): register by Friday = đăng ký chậm nhất là thứ Sáu.',
    { distractorNotes: { 0: '"until" chỉ hành động kéo dài liên tục đến một mốc; "register" là hành động xảy ra một lần.', 1: '"since" đi với thì hoàn thành, không dùng cho hạn chót.', 3: '"for" + khoảng thời gian, không đi với một ngày cụ thể.' } }),
  // P2 — tờ rơi
  blank('d2e1-7', 'd2e1-leaflet', 7, 'clozeLeaflet', 1,
    ['make', 'take', 'have', 'do'],
    ['làm, tạo ra', 'lấy, cầm', 'có', 'làm'], 3,
    'Động từ nào đi với "housework"?',
    'Collocation: do the housework = làm việc nhà. Sau "let sb" dùng động từ nguyên mẫu không "to".',
    { targetWords: ['domestic'], distractorNotes: { 0: 'Lỗi rất hay gặp: không nói "make the housework" (nhưng nói "make the bed").' } }),
  blank('d2e1-8', 'd2e1-leaflet', 8, 'clozeLeaflet', 2,
    ['every', 'all', 'many', 'a lot of'],
    ['mọi, từng', 'tất cả', 'nhiều (many)', 'nhiều (a lot of)'], 0,
    '"task" ở đây là danh từ số ít, và phía sau có "it".',
    'Lượng từ: every + danh từ đếm được số ÍT → every task. Đại từ "it" ở cuối câu cũng cho thấy "task" là số ít.',
    { distractorNotes: { 1: '"all" cần "tasks" (số nhiều).', 2: '"many" cần danh từ số nhiều.', 3: '"a lot of" không đi với danh từ đếm được số ít.' } }),
  blank('d2e1-9', 'd2e1-leaflet', 9, 'clozeLeaflet', 2,
    ['a', 'the', 'an', 'Ø'],
    ['một (trước âm phụ âm)', 'những (đã xác định)', 'một (trước âm nguyên âm)', 'không có mạo từ'], 1,
    '"youngest" là dạng so sánh gì?',
    'Mạo từ: trước youngest children trong câu này dùng "the" → the youngest children (những đứa con nhỏ nhất).',
    { distractorNotes: { 0: '"a/an" không đi với danh từ số nhiều "children" và không đứng trước so sánh nhất.', 3: 'So sánh nhất bắt buộc có "the" (hoặc tính từ sở hữu).' } }),
  blank('d2e1-10', 'd2e1-leaflet', 10, 'clozeLeaflet', 3,
    ['round small wooden', 'wooden small round', 'small wooden round', 'small round wooden'],
    ['tròn — nhỏ — bằng gỗ', 'bằng gỗ — nhỏ — tròn', 'nhỏ — bằng gỗ — tròn', 'nhỏ — tròn — bằng gỗ'], 3,
    'Thứ tự tính từ: Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose.',
    'small (kích thước) → round (hình dạng) → wooden (chất liệu) → board.'),
  blank('d2e1-11', 'd2e1-leaflet', 11, 'clozeLeaflet', 3,
    ['however', 'otherwise', 'therefore', 'in contrast'],
    ['tuy nhiên', 'nếu không thì', 'vì vậy', 'ngược lại'], 2,
    'Vế trước là nguyên nhân (trẻ bắt chước), vế sau là kết quả (con trai cũng làm theo).',
    'therefore = vì vậy: trẻ bắt chước những gì chúng thấy, VÌ VẬY nếu bố làm việc nhà thì con trai cũng dễ làm theo.',
    { distractorNotes: { 0: 'however chỉ sự đối lập — hai vế ở đây không đối lập.', 1: 'otherwise = nếu không thì — không hợp logic.', 3: 'in contrast dùng để so sánh hai đối tượng khác nhau.' } }),
  blank('d2e1-12', 'd2e1-leaflet', 12, 'clozeLeaflet', 2,
    ['pulls their weight', 'pulls their leg', 'breaks the ice', 'hits the roof'],
    ['làm tròn phần việc của mình', 'trêu chọc ai', 'phá vỡ bầu không khí ngại ngùng', 'nổi trận lôi đình'], 0,
    'Vế sau: "không ai cảm thấy kiệt sức" → mỗi người đều góp phần.',
    'Thành ngữ: pull your weight = làm tròn phần việc của mình. Khi ai cũng làm phần của mình thì không ai kiệt sức.',
    { distractorNotes: { 1: 'pull sb\'s leg = trêu ai — dễ nhầm vì cùng động từ "pull".', 2: 'break the ice = phá băng khi mới gặp — không liên quan việc nhà.', 3: 'hit the roof = nổi giận — ngược ý.' } }),
];

// ================= ĐỀ 2 — P3 + P4 =================
export const exam2: Question[] = [
  // P3 — sắp xếp
  arrange('d2e2-1', 1,
    "a. Mum: That's wonderful! Have you told your grandfather yet?\nb. Lan: Mum, I've been offered a place on the design course I wanted!\nc. Lan: Not yet. I'm a bit worried he still wants me to study law.",
    'a. Mẹ: Tuyệt quá! Con đã báo cho ông chưa?\nb. Lan: Mẹ ơi, con được nhận vào khóa thiết kế con mong muốn rồi!\nc. Lan: Chưa ạ. Con hơi lo ông vẫn muốn con học luật.',
    ['a – b – c', 'b – c – a', 'b – a – c', 'c – a – b'], 2,
    'Tin vui phải được báo trước thì mẹ mới khen "That\'s wonderful!".',
    'b (Lan báo tin vui) → a (mẹ khen và hỏi đã báo ông chưa) → c ("Not yet" trả lời câu hỏi của mẹ).',
    { targetWords: ["follow in sb's footsteps"] }),
  arrange('d2e2-2', 2,
    "a. Grandpa: Game design? Is that a real job? In my day, people became engineers or teachers.\nb. Grandpa: Hmm. I'd like to see what you actually do. Will you show me one of your games?\nc. Nam: Grandpa, I've decided to study game design at university.\nd. Nam: Of course! I'll show you the one I made for my school project this weekend.\ne. Nam: It is! Game designers create stories, art and puzzles, and many of them earn a good living.",
    'a. Ông: Thiết kế game á? Đó có phải nghề thật không? Thời ông, người ta làm kỹ sư hoặc giáo viên.\nb. Ông: Ừm. Ông muốn xem thực ra cháu làm gì. Cháu cho ông xem một trò của cháu nhé?\nc. Nam: Ông ơi, cháu đã quyết định học thiết kế game ở đại học.\nd. Nam: Tất nhiên rồi ạ! Cuối tuần này cháu sẽ cho ông xem trò cháu làm cho dự án ở trường.\ne. Nam: Có chứ ạ! Người thiết kế game sáng tạo cốt truyện, hình ảnh và câu đố, và nhiều người có thu nhập tốt.',
    ['c – a – e – b – d', 'c – e – a – b – d', 'a – c – e – d – b', 'c – a – b – e – d'], 0,
    'Nam thông báo quyết định trước. "It is!" trả lời câu hỏi nào? "Of course!" trả lời lời đề nghị nào?',
    'c (Nam thông báo) → a (ông ngạc nhiên hỏi "Is that a real job?") → e ("It is!" — giải thích) → b (ông muốn xem thử) → d ("Of course!" — đồng ý cho ông xem).',
    { targetWords: ['curiosity', 'open-minded'] }),
  arrange('d2e2-3', 2,
    "Dear Aunt Hoa,\na. I'm writing to thank you for talking to my parents about my plan to become a nurse.\nb. Before that, they kept saying that nursing was \"a job for women\".\nc. Since your visit, however, they have completely changed their minds.\nd. In fact, Dad even asked me yesterday which universities offer the best nursing courses.\ne. I'll call you after my entrance exam to tell you how it went.\nBest wishes,\nKhoa",
    'Cô Hoa thân mến,\na. Cháu viết thư này để cảm ơn cô đã nói chuyện với bố mẹ cháu về dự định làm điều dưỡng của cháu.\nb. Trước đó, bố mẹ cứ nói mãi rằng điều dưỡng là "nghề của phụ nữ".\nc. Tuy nhiên, từ sau lần cô đến chơi, bố mẹ đã hoàn toàn thay đổi suy nghĩ.\nd. Thậm chí hôm qua bố còn hỏi cháu trường đại học nào có ngành điều dưỡng tốt nhất.\ne. Cháu sẽ gọi cho cô sau kỳ thi đầu vào để kể cô nghe cháu làm bài thế nào.\nThân mến,\nKhoa',
    ['b – a – c – d – e', 'a – c – b – d – e', 'a – b – d – c – e', 'a – b – c – d – e'], 3,
    'Thư mở bằng lý do viết thư. "Before that" nhắc lại sự việc nào? "however" đối lập với ý nào?',
    'a (lý do viết thư: cảm ơn) → b ("Before that" = trước buổi nói chuyện) → c ("however": đối lập với b, bố mẹ đã đổi ý) → d ("In fact": bằng chứng cho c) → e (lời hẹn kết thư).',
    { targetWords: ['assumption', 'equality'] }),
  arrange('d2e2-4', 3,
    'a. Today, however, in most couples both partners work, and many expect to share the housework equally.\nb. For much of the last century, the father earned the money while the mother looked after the home.\nc. These roles were rarely questioned because they were reinforced by law and popular culture.\nd. As a result, men who cook and look after their children are no longer seen as unusual.\ne. Yet in practice, women still do most of the cooking and cleaning in many families.',
    'a. Tuy nhiên ngày nay, phần lớn các cặp vợ chồng đều cùng đi làm, và nhiều người mong muốn chia đều việc nhà.\nb. Trong phần lớn thế kỷ trước, người cha kiếm tiền còn người mẹ chăm lo việc nhà.\nc. Những vai trò này hiếm khi bị đặt câu hỏi vì chúng được pháp luật và văn hóa đại chúng củng cố.\nd. Kết quả là đàn ông nấu ăn và chăm con không còn bị coi là lạ thường nữa.\ne. Thế nhưng trên thực tế, ở nhiều gia đình phụ nữ vẫn làm phần lớn việc nấu nướng và dọn dẹp.',
    ['b – a – c – e – d', 'b – c – a – d – e', 'c – b – a – d – e', 'b – c – e – a – d'], 1,
    'Đi theo trình tự thời gian: quá khứ → "Today, however" → kết quả → "Yet in practice".',
    'b (mô hình cũ) → c ("These roles" = vai trò ở b) → a ("Today, however": thay đổi ngày nay) → d ("As a result": hệ quả của a) → e ("Yet in practice": thực tế vẫn chưa thay đổi hết).',
    { targetWords: ['reinforce', 'domestic'] }),
  arrange('d2e2-5', 3,
    'a. A teenager might assume that her parents will never understand her interests.\nb. Many family arguments begin not with what people say but with what they assume.\nc. Her parents, in turn, might assume that she is simply being rebellious.\nd. Once these fixed ideas are formed, both sides stop listening to each other.\ne. The best way to break this cycle is to replace assumptions with genuine questions.',
    'a. Một bạn tuổi teen có thể mặc định rằng bố mẹ sẽ không bao giờ hiểu sở thích của mình.\nb. Nhiều cuộc cãi vã trong gia đình không bắt đầu từ điều người ta nói mà từ điều người ta mặc định.\nc. Đến lượt mình, bố mẹ bạn ấy có thể mặc định rằng con chỉ đang nổi loạn.\nd. Một khi những suy nghĩ cố định này hình thành, cả hai bên đều thôi lắng nghe nhau.\ne. Cách tốt nhất để phá vỡ vòng luẩn quẩn này là thay những điều mặc định bằng những câu hỏi chân thành.',
    ['b – a – c – d – e', 'a – c – b – d – e', 'b – c – a – d – e', 'b – a – d – c – e'], 0,
    'Câu chủ đề nói chung về "what they assume". "Her parents, in turn" phải đứng sau câu nhắc tới cô gái.',
    'b (câu chủ đề) → a (ví dụ: con mặc định) → c ("Her parents, in turn": bố mẹ cũng mặc định) → d ("these fixed ideas" = hai suy nghĩ ở a, c) → e ("this cycle" = vòng luẩn quẩn ở d, đưa ra giải pháp).',
    { targetWords: ['assumption', 'rebellious', 'curiosity'] }),
  // P4 — điền câu / mệnh đề
  blank('d2e2-6', 'd2e2-text', 6, 'sentenceFill', 2,
    ['Having hardly ever talked to each other properly', 'As a result, the two of them rarely had a real conversation', 'Despite this, they got on extremely well with each other', 'Which made them rarely talk to each other'],
    ['Hầu như chưa từng nói chuyện tử tế với nhau', 'Kết quả là hai bà cháu hiếm khi có một cuộc trò chuyện thật sự', 'Dù vậy, hai người vẫn rất hợp nhau', 'Điều khiến họ hiếm khi nói chuyện với nhau'], 1,
    'Hai bà cháu nghĩ không tốt về nhau → hậu quả là gì? Câu sau: bữa cơm kết thúc trong im lặng.',
    'Cần một câu hoàn chỉnh nêu HẬU QUẢ của việc hai người nghĩ xấu về nhau, khớp với câu sau (bữa ăn kết thúc trong im lặng).',
    { targetWords: ['assumption'], distractorNotes: { 0: 'Cụm phân từ, thiếu mệnh đề chính.', 2: 'Mâu thuẫn với câu sau: bữa ăn kết thúc trong im lặng.', 3: '"Which" không mở đầu một câu độc lập.' } }),
  blank('d2e2-7', 'd2e2-text', 7, 'sentenceFill', 2,
    ['she had read an article about curiosity in families', 'which had read an article about curiosity in families', 'that had read an article about curiosity in families', 'who had read an article about curiosity in families'],
    ['cô ấy đã đọc một bài báo về sự tò mò trong gia đình', 'cái mà đã đọc một bài báo về sự tò mò trong gia đình', 'người đã đọc một bài báo về sự tò mò trong gia đình (that)', 'người đã đọc một bài báo về sự tò mò trong gia đình (who)'], 3,
    'Phần giữa hai dấu phẩy bổ sung thông tin cho "Duy\'s mother" (người).',
    'Mệnh đề quan hệ không xác định (giữa hai dấu phẩy) bổ nghĩa cho người → dùng "who". Dùng quá khứ hoàn thành vì việc đọc báo xảy ra trước khi đề xuất thử nghiệm.',
    { targetWords: ['curiosity'], distractorNotes: { 0: 'Chèn một mệnh đề độc lập vào giữa câu mà không có từ nối → sai.', 1: '"which" dùng cho vật.', 2: 'Mệnh đề quan hệ không xác định không dùng "that".' } }),
  blank('d2e2-8', 'd2e2-text', 8, 'sentenceFill', 3,
    ['Duy never heard these stories before, he listened to every word', 'Duy had heard these stories so many times that he stopped listening', 'Duy, who had never heard these stories before, listened to every word', 'Listening to every word, although Duy had never heard these stories before'],
    ['Duy chưa từng nghe những chuyện này trước đây, cậu nghe từng lời', 'Duy đã nghe những chuyện này nhiều đến mức thôi không nghe nữa', 'Duy, người chưa từng nghe những câu chuyện này, chăm chú nghe từng lời', 'Chăm chú nghe từng lời, mặc dù Duy chưa từng nghe những chuyện này trước đây'], 2,
    '"To his surprise" cho biết Duy đã từng nghe những chuyện này chưa?',
    'Câu hoàn chỉnh với mệnh đề quan hệ không xác định; hợp logic với "To his surprise" (Duy bất ngờ vì chưa từng nghe) và dẫn hợp lý sang câu sau: tối hôm sau bà cũng muốn tìm hiểu thế giới của Duy.',
    { distractorNotes: { 0: 'Hai mệnh đề độc lập nối bằng dấu phẩy, lại sai thì (cần "had never heard").', 1: 'Mâu thuẫn với "To his surprise".', 3: 'Thiếu mệnh đề chính.' } }),
  blank('d2e2-9', 'd2e2-text', 9, 'sentenceFill', 3,
    ['The two of them still disagree about many things, such as how late Duy should stay up', 'They have stopped disagreeing about anything at all', 'Although they still disagree about many things, such as how late Duy should stay up', 'Disagreeing still about many things, such as how late Duy should stay up'],
    ['Hai bà cháu vẫn bất đồng về nhiều chuyện, chẳng hạn Duy nên thức khuya đến mấy giờ', 'Họ không còn bất đồng về bất cứ chuyện gì nữa', 'Mặc dù họ vẫn bất đồng về nhiều chuyện, chẳng hạn Duy nên thức khuya đến mấy giờ', 'Vẫn bất đồng về nhiều chuyện, chẳng hạn Duy nên thức khuya đến mấy giờ'], 0,
    'Phía sau là ", but they now argue far less often" — vế trước phải là mệnh đề độc lập và tương phản với "cãi nhau ít hơn".',
    'Mệnh đề độc lập + ", but …" tạo sự tương phản hợp lý: vẫn còn bất đồng NHƯNG cãi nhau ít hơn hẳn.',
    { distractorNotes: { 1: 'Nếu hết bất đồng thì "but they now argue far less" vô lý.', 2: '"Although" và "but" không dùng cùng trong một câu.', 3: 'Cụm V-ing không thể làm mệnh đề trước "but".' } }),
  blank('d2e2-10', 'd2e2-text', 10, 'sentenceFill', 2,
    ['When people deliver verdicts instead of asking questions, they understand each other better', "When people ask genuine questions instead of delivering verdicts, they begin to see the world from each other's perspective", 'Asking genuine questions instead of delivering verdicts, which helps people understand each other', "Because people ask genuine questions instead of delivering verdicts and try to see the world from each other's perspective"],
    ['Khi người ta phán xét thay vì đặt câu hỏi, họ hiểu nhau hơn', 'Khi con người đặt câu hỏi chân thành thay vì đưa ra phán xét, họ bắt đầu nhìn thế giới từ góc nhìn của nhau', 'Đặt câu hỏi chân thành thay vì phán xét, điều giúp mọi người hiểu nhau', 'Bởi vì mọi người đặt câu hỏi chân thành thay vì phán xét và cố nhìn thế giới từ góc nhìn của nhau'], 1,
    'Câu trước: "curiosity works better than lectures". Câu cần giải thích vì sao đặt câu hỏi hiệu quả.',
    'Câu hoàn chỉnh, triển khai ý "sự tò mò hiệu quả hơn bài giảng": đặt câu hỏi thay vì phán xét → hiểu góc nhìn của nhau. Ý này lấy từ đoạn cuối bài đọc 6.',
    { targetWords: ['curiosity', 'perspective'], distractorNotes: { 0: 'Ngược ý: phán xét không giúp hiểu nhau.', 2: 'Thiếu mệnh đề chính.', 3: 'Mệnh đề "Because…" không đứng một mình thành câu.' } }),
];

/** Đề 1: P1 + P2 + bài đọc 4, 5 · Đề 2: P3 + P4 + bài đọc 6 */
export const exam1Ids = [...exam1.map((q) => q.id), 'r25', 'r26', 'r27', 'r28', 'r29', 'r30', 'r31', 'r32', 'r33', 'r34', 'r35', 'r36', 'r37', 'r38', 'r39', 'r40', 'r41', 'r42', 'r43', 'r44'];
export const exam2Ids = [...exam2.map((q) => q.id), 'r45', 'r46', 'r47', 'r48', 'r49', 'r50', 'r51', 'r52', 'r53', 'r54'];
