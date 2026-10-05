import type { HintLevel, Question, VocabItem } from '@/types';

/**
 * Ngày 2 — cụm từ và cấu trúc rút từ bài đọc 4–6 (Unit 2).
 * Mỗi cụm đều xuất hiện trong bài; `exampleFromPassage` là câu gốc, có thể được
 * rút gọn phần đầu hoặc đuôi cho vừa thẻ từ vựng.
 */
export const phraseVocab: VocabItem[] = [
  {
    word: 'a matter of', ipa: '/ə ˈmætər ɒv/', partOfSpeech: 'phrase',
    meaningVi: 'một vấn đề về, chuyện thuộc về', meaningEn: 'a question or situation concerning something',
    synonyms: ['a question of'], antonyms: [], wordFamily: ['matter (n, v)'],
    emoji: '❓', collocations: ['a matter of respect', 'a matter of time'],
    exampleFromPassage: 'The question of what a young person should do is a matter of collective concern.',
    exampleNew: 'Passing the exam is just a matter of practice.',
    syllableCount: 4, stressPosition: 2, mnemonicVi: 'matter = vấn đề → "chuyện của..."',
  },
  {
    word: 'in the eyes of', ipa: '/ɪn ði ˈaɪz əv/', partOfSpeech: 'phrase',
    meaningVi: 'trong mắt ai, theo cách nhìn của ai', meaningEn: 'in the opinion or judgement of someone',
    synonyms: ['according to', 'from the viewpoint of'], antonyms: [], wordFamily: ['eye (n)'],
    emoji: '👁️', collocations: ['in the eyes of his parents'],
    exampleFromPassage: 'In the eyes of his parents, he may be rejecting the values that defined their sacrifices.',
    exampleNew: 'In the eyes of the law, they are still children.',
    syllableCount: 4, stressPosition: 3, mnemonicVi: 'Nhìn qua đôi mắt của người đó',
  },
  {
    word: 'be perceived as', ipa: '/bi pəˈsiːvd æz/', partOfSpeech: 'phrase',
    meaningVi: 'bị/được coi là', meaningEn: 'to be seen or understood in a particular way',
    synonyms: ['be regarded as', 'be seen as'], antonyms: [], wordFamily: ['perceive (v)', 'perception (n)'],
    emoji: '🔍', collocations: ['be perceived as disrespect'],
    exampleFromPassage: "Openly refusing a parent's wishes can be perceived as disrespect rather than independence.",
    exampleNew: 'Silence is sometimes perceived as agreement.',
    syllableCount: 4, stressPosition: 3, mnemonicVi: 'perceive = nhận thức → được nhận thức như là',
    forms: ['perceived as', 'is perceived as'],
  },
  {
    word: 'be deeply rooted', ipa: '/bi ˈdiːpli ˈruːtɪd/', partOfSpeech: 'phrase',
    meaningVi: 'ăn sâu, bắt nguồn sâu xa', meaningEn: 'to be firmly established over a long time',
    synonyms: ['stem from', 'originate in'], antonyms: [], wordFamily: ['root (n, v)'],
    emoji: '🌳', collocations: ['be deeply rooted', 'be rooted in sth'],
    exampleFromPassage: 'In societies where filial duty is deeply rooted…',
    exampleNew: 'The custom is rooted in centuries of tradition.',
    syllableCount: 5, stressPosition: 4, mnemonicVi: 'root = rễ → bén rễ sâu trong văn hóa. Dạng đầy đủ: be rooted IN sth',
    forms: ['deeply rooted', 'rooted in'],
  },
  {
    word: 'associate sth with', ipa: '/əˈsəʊsieɪt wɪð/', partOfSpeech: 'phrase',
    meaningVi: 'liên hệ, gắn điều gì với điều gì', meaningEn: 'to connect one thing with another in your mind',
    synonyms: ['link sth with', 'connect sth with'], antonyms: [], wordFamily: ['association (n)'],
    emoji: '🔗', collocations: ['associate success with money'],
    exampleFromPassage: 'Older relatives who associate success with medicine, law or engineering…',
    exampleNew: 'Many people associate Tet with family reunions.',
    syllableCount: 5, stressPosition: 2, mnemonicVi: 'Luôn đi với "with", không dùng "to"',
    forms: ['associate success with', 'associated with'],
  },
  {
    word: 'take the time to', ipa: '/teɪk ðə taɪm tuː/', partOfSpeech: 'phrase',
    meaningVi: 'dành thời gian để', meaningEn: 'to spend enough time doing something carefully',
    synonyms: ['make an effort to'], antonyms: ['rush into'], wordFamily: ['time (n)'],
    emoji: '⏱️', collocations: ['take the time to understand', 'take the time to listen'],
    exampleFromPassage: 'Parents who take the time to understand unfamiliar professions tend to become supportive.',
    exampleNew: 'Take the time to read the question twice before answering.',
    syllableCount: 4, stressPosition: 1, mnemonicVi: 'Chủ động "lấy" thời gian ra để làm cho kỹ',
    forms: ['took the time to'],
  },
  {
    word: 'narrow the gap', ipa: '/ˈnærəʊ ðə ɡæp/', partOfSpeech: 'phrase',
    meaningVi: 'thu hẹp khoảng cách', meaningEn: 'to make a difference between two things smaller',
    synonyms: ['bridge the gap', 'close the gap'], antonyms: ['widen the gap'], wordFamily: ['narrow (adj, v)'],
    emoji: '↔️', collocations: ['narrow the generation gap'],
    exampleFromPassage: 'There is, however, evidence that the gap can be narrowed.',
    exampleNew: 'Honest conversations help narrow the gap between parents and children.',
    syllableCount: 4, stressPosition: 1, mnemonicVi: 'narrow = hẹp → làm cho hẹp lại',
    forms: ['be narrowed', 'narrowed'],
  },
  {
    word: 'be responsible for', ipa: '/bi rɪˈspɒnsəbl fɔː/', partOfSpeech: 'phrase',
    meaningVi: 'chịu trách nhiệm về', meaningEn: 'to have the duty of dealing with something',
    synonyms: ['be in charge of'], antonyms: [], wordFamily: ['responsibility (n)'],
    emoji: '📋', collocations: ['be responsible for the home'],
    exampleFromPassage: 'The mother was responsible for the home and the children.',
    exampleNew: 'Each student is responsible for their own notes.',
    syllableCount: 6, stressPosition: 3, mnemonicVi: 'responsible FOR việc · responsible TO người',
    forms: ['responsible for', 'was responsible for'],
  },
  {
    word: 'be reinforced by', ipa: '/bi ˌriːɪnˈfɔːst baɪ/', partOfSpeech: 'phrase',
    meaningVi: 'được củng cố bởi', meaningEn: 'to be made stronger by something',
    synonyms: ['be strengthened by'], antonyms: ['be weakened by'], wordFamily: ['reinforce (v)', 'reinforcement (n)'],
    emoji: '🧱', collocations: ['be reinforced by law'],
    exampleFromPassage: 'They were reinforced by law, religion and popular culture.',
    exampleNew: 'The habit was reinforced by daily practice.',
    syllableCount: 5, stressPosition: 4, mnemonicVi: 're- + force = thêm sức → làm vững thêm',
    forms: ['reinforced by'],
  },
  {
    word: 'grow up under', ipa: '/ɡrəʊ ˈʌp ˌʌndə/', partOfSpeech: 'phrase',
    meaningVi: 'lớn lên trong (hoàn cảnh, chế độ)', meaningEn: 'to spend your childhood in a particular situation',
    synonyms: ['be raised under'], antonyms: [], wordFamily: ['growth (n)'],
    emoji: '🌾', collocations: ['grow up under the traditional model'],
    exampleFromPassage: 'Grandparents who grew up under the traditional model often retain its assumptions.',
    exampleNew: 'He grew up under very strict rules.',
    syllableCount: 4, stressPosition: 2, mnemonicVi: '"under" = dưới (một hoàn cảnh) → lớn lên dưới điều kiện đó',
    forms: ['grew up under'],
  },
  {
    word: 'intend to', ipa: '/ɪnˈtend tuː/', partOfSpeech: 'phrase',
    meaningVi: 'dự định, có ý định', meaningEn: 'to plan to do something',
    synonyms: ['plan to', 'mean to'], antonyms: [], wordFamily: ['intention (n)', 'intentional (adj)'],
    emoji: '🎯', collocations: ['intend to have children'],
    exampleFromPassage: 'A grandmother may ask when she intends to have children.',
    exampleNew: 'I intend to revise all the phrases before the test.',
    syllableCount: 3, stressPosition: 2, mnemonicVi: 'intention = ý định → intend to + V nguyên thể',
    forms: ['intends to', 'intended to'],
  },
  {
    word: 'be followed by', ipa: '/bi ˈfɒləʊd baɪ/', partOfSpeech: 'phrase',
    meaningVi: 'được tiếp nối bởi, sau đó là', meaningEn: 'to have something else come after it',
    synonyms: [], antonyms: ['be preceded by'], wordFamily: ['follow (v)'],
    emoji: '⏭️', collocations: ['be followed by hours of housework'],
    exampleFromPassage: 'A full day of paid employment is followed by hours of unpaid housework.',
    exampleNew: 'The lesson was followed by a short quiz.',
    syllableCount: 4, stressPosition: 2, mnemonicVi: 'A is followed by B → A trước, B sau',
    forms: ['followed by', 'is followed by'],
  },
  {
    word: 'face criticism', ipa: '/feɪs ˈkrɪtɪsɪzəm/', partOfSpeech: 'phrase',
    meaningVi: 'đối mặt với chỉ trích', meaningEn: 'to be criticised by other people',
    synonyms: ['come under criticism'], antonyms: ['receive praise'], wordFamily: ['criticise (v)', 'critical (adj)'],
    emoji: '🗣️', collocations: ['face criticism from sb'],
    exampleFromPassage: 'Their partners may face criticism from both directions.',
    exampleNew: 'The decision faced criticism from parents and teachers alike.',
    syllableCount: 5, stressPosition: 2, mnemonicVi: '"face" dùng như động từ: đối mặt với',
    forms: ['faced criticism', 'facing criticism'],
  },
  {
    word: 'regard sth as', ipa: '/rɪˈɡɑːd æz/', partOfSpeech: 'phrase',
    meaningVi: 'coi điều gì là', meaningEn: 'to think of someone or something in a particular way',
    synonyms: ['see sth as', 'consider'], antonyms: [], wordFamily: ['regard (n)'],
    emoji: '🧠', collocations: ['regard equality as self-evident'],
    exampleFromPassage: 'The youngest generation has grown up regarding equality as self-evident.',
    exampleNew: 'Many people regard him as the best player in the team.',
    syllableCount: 3, stressPosition: 2, mnemonicVi: 'regard AS, không dùng "regard to be"',
    forms: ['regarding', 'regarded as'],
  },
  {
    word: 'caution against', ipa: '/ˈkɔːʃn əˈɡenst/', partOfSpeech: 'phrase',
    meaningVi: 'cảnh báo đừng làm gì', meaningEn: 'to warn someone not to do something',
    synonyms: ['warn against'], antonyms: ['encourage'], wordFamily: ['cautious (adj)', 'caution (n)'],
    emoji: '⚠️', collocations: ['caution against doing sth'],
    exampleFromPassage: 'Sociologists caution against dismissing older views as mere prejudice.',
    exampleNew: 'Doctors caution against sitting for too long.',
    syllableCount: 4, stressPosition: 1, mnemonicVi: 'Sau "against" dùng V-ing',
    forms: ['cautioned against'],
  },
  {
    word: 'dismiss sth as', ipa: '/dɪsˈmɪs æz/', partOfSpeech: 'phrase',
    meaningVi: 'gạt bỏ, coi thường điều gì là', meaningEn: 'to refuse to take something seriously',
    synonyms: ['brush aside'], antonyms: ['take seriously'], wordFamily: ['dismissal (n)'],
    emoji: '🙅', collocations: ['dismiss sth as prejudice'],
    exampleFromPassage: 'Sociologists caution against dismissing older views as mere prejudice.',
    exampleNew: 'Do not dismiss his idea as useless before you hear it.',
    syllableCount: 3, stressPosition: 2, mnemonicVi: 'dis- = bỏ đi → gạt phăng đi, coi như không đáng',
    forms: ['dismissing', 'dismissed as'],
  },
  {
    word: 'be built on', ipa: '/bi bɪlt ɒn/', partOfSpeech: 'phrase',
    meaningVi: 'được xây dựng dựa trên', meaningEn: 'to be based on something',
    synonyms: ['be based on'], antonyms: [], wordFamily: ['build (v)'],
    emoji: '🏗️', collocations: ['be built on the efforts of sb'],
    exampleFromPassage: 'Their freedoms were built on the efforts of those who came before them.',
    exampleNew: 'Trust is built on honesty.',
    syllableCount: 3, stressPosition: 2, mnemonicVi: 'Xây trên nền của cái gì',
    forms: ['built on', 'were built on'],
  },
  {
    word: 'be out of date', ipa: '/bi ˌaʊt əv ˈdeɪt/', partOfSpeech: 'phrase',
    meaningVi: 'lỗi thời, lạc hậu', meaningEn: 'old-fashioned; no longer modern or useful',
    synonyms: ['old-fashioned', 'outdated'], antonyms: ['up to date', 'modern'], wordFamily: ['date (n)'],
    emoji: '📻', collocations: ['hopelessly out of date'],
    exampleFromPassage: 'Every generation believes that the one before it is hopelessly out of date.',
    exampleNew: 'This phone looks out of date now.',
    syllableCount: 4, stressPosition: 4, mnemonicVi: 'Hết hạn sử dụng → lỗi thời. Trái nghĩa: up to date',
  },
  {
    word: 'distinguish between', ipa: '/dɪˈstɪŋɡwɪʃ bɪˈtwiːn/', partOfSpeech: 'phrase',
    meaningVi: 'phân biệt giữa', meaningEn: 'to recognise the difference between two things',
    synonyms: ['differentiate between', 'tell apart'], antonyms: ['confuse'], wordFamily: ['distinction (n)', 'distinct (adj)'],
    emoji: '🔀', collocations: ['distinguish between two kinds of conflict'],
    exampleFromPassage: 'Psychologists distinguish between two kinds of intergenerational conflict.',
    exampleNew: 'It is hard to distinguish between the two words in speech.',
    syllableCount: 5, stressPosition: 2, mnemonicVi: 'Luôn đi với "between" khi so hai thứ',
    forms: ['distinguishing between'],
  },
  {
    word: "keep one's distance", ipa: '/kiːp wʌnz ˈdɪstəns/', partOfSpeech: 'phrase',
    meaningVi: 'giữ khoảng cách, tránh gặp', meaningEn: 'to avoid being close to someone',
    synonyms: ['stay away'], antonyms: ['get close to'], wordFamily: ['distant (adj)'],
    emoji: '↔️', collocations: ['keep their distance'],
    exampleFromPassage: 'Colleagues who disagree can keep their distance; relatives cannot.',
    exampleNew: 'After the argument, they kept their distance for a week.',
    syllableCount: 4, stressPosition: 3, mnemonicVi: 'distance = khoảng cách → giữ cho xa ra',
    forms: ['keep their distance', 'kept their distance'],
  },
  {
    word: 'be resistant to', ipa: '/bi rɪˈzɪstənt tuː/', partOfSpeech: 'phrase',
    meaningVi: 'khó thay đổi bởi, đề kháng với', meaningEn: 'not easily changed or affected by something',
    synonyms: ['be immune to'], antonyms: ['be open to'], wordFamily: ['resist (v)', 'resistance (n)'],
    emoji: '🛡️', collocations: ['be resistant to evidence', 'be resistant to change'],
    exampleFromPassage: 'These fixed images, once formed, are remarkably resistant to evidence.',
    exampleNew: 'Old habits are resistant to change.',
    syllableCount: 5, stressPosition: 3, mnemonicVi: 'resist = chống lại → chống lại cả bằng chứng',
    forms: ['resistant to'],
  },
  {
    word: 'stay open-minded', ipa: '/steɪ ˌəʊpən ˈmaɪndɪd/', partOfSpeech: 'phrase',
    meaningVi: 'giữ thái độ cởi mở', meaningEn: 'to stay willing to consider new ideas',
    synonyms: ['keep an open mind'], antonyms: ['be narrow-minded'], wordFamily: ['open-minded (adj)'],
    emoji: '🧠', collocations: ['stay open-minded about sth'],
    exampleFromPassage: 'Families that manage the gap successfully are those in which members stay open-minded.',
    exampleNew: 'Stay open-minded when you hear a new idea.',
    syllableCount: 5, stressPosition: 4, mnemonicVi: 'Để "cái đầu mở" → sẵn sàng nghe ý mới',
  },
  {
    word: 'in the end', ipa: '/ɪn ði ˈend/', partOfSpeech: 'phrase',
    meaningVi: 'cuối cùng thì', meaningEn: 'finally, after everything has been considered',
    synonyms: ['eventually', 'finally'], antonyms: ['at first'], wordFamily: ['end (n)'],
    emoji: '🏁', collocations: ['in the end'],
    exampleFromPassage: 'In the end, the goal is not for one generation to convert the other.',
    exampleNew: 'In the end, we decided to stay at home.',
    syllableCount: 3, stressPosition: 3, mnemonicVi: '"in the end" = cuối cùng · "at the end of" = ở cuối của cái gì',
  },
  {
    "word": "carry symbolic weight",
    "ipa": "/ˌkæri sɪmˌbɒlɪk ˈweɪt/",
    "partOfSpeech": "phrase",
    "meaningVi": "mang sức nặng biểu tượng",
    "meaningEn": "to represent important values beyond the literal meaning",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "carry symbolic weight"
    ],
    "exampleFromPassage": "Sociologists who study family expectations point out that career choices carry symbolic weight.",
    "exampleNew": "Career choices can carry symbolic weight in a family.",
    "syllableCount": 6,
    "stressPosition": 6,
    "mnemonicVi": "weight = sức nặng; ở đây là ý nghĩa, không phải cân nặng."
  },
  {
    "word": "be shaped by",
    "ipa": "/bi ˈʃeɪpt baɪ/",
    "partOfSpeech": "phrase",
    "meaningVi": "được định hình bởi",
    "meaningEn": "to be influenced and formed by something",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "be shaped by"
    ],
    "exampleFromPassage": "For an older generation shaped by economic hardship, a stable and respected career represents security; for a younger generation raised in relative comfort, it may represent a cage.",
    "exampleNew": "Our opinions are shaped by our experiences.",
    "syllableCount": 3,
    "stressPosition": 2,
    "mnemonicVi": "shape = tạo hình; hardship định hình cách nghĩ của thế hệ trước."
  },
  {
    "word": "be viewed with suspicion",
    "ipa": "/bi ˈvjuːd wɪð səˈspɪʃn/",
    "partOfSpeech": "phrase",
    "meaningVi": "bị nhìn nhận với sự nghi ngại",
    "meaningEn": "to be regarded with doubt or distrust",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "be viewed with suspicion"
    ],
    "exampleFromPassage": "Careers in digital media, e-commerce or game design are viewed with suspicion by older relatives who associate success with medicine, law or engineering, professions whose prestige they understand.",
    "exampleNew": "New ideas are sometimes viewed with suspicion.",
    "syllableCount": 6,
    "stressPosition": 5,
    "mnemonicVi": "view = nhìn nhận; suspicion = nghi ngại."
  },
  {
    "word": "abandon one's ambitions in order to please sb",
    "ipa": "/əˌbændən wʌnz æmˌbɪʃnz ɪn ˈɔːdə tə pliːz ˌsʌmbədi/",
    "partOfSpeech": "phrase",
    "meaningVi": "từ bỏ hoài bão để làm hài lòng ai",
    "meaningEn": "to give up personal goals to satisfy someone else",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "abandon one's ambitions in order to please sb"
    ],
    "exampleFromPassage": "Conversely, young people who abandon their own ambitions in order to please their families frequently report feelings of resentment and a loss of direction that can last well into adulthood.",
    "exampleNew": "Do not abandon your ambitions in order to please everyone.",
    "syllableCount": 15,
    "stressPosition": 9,
    "mnemonicVi": "in order to + động từ nguyên thể = để; abandon = từ bỏ."
  },
  {
    "word": "a loss of direction",
    "ipa": "/ə ˌlɒs əv dəˈrekʃn/",
    "partOfSpeech": "phrase",
    "meaningVi": "sự mất phương hướng",
    "meaningEn": "a feeling of not knowing what to do with your life",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "a loss of direction"
    ],
    "exampleFromPassage": "Conversely, young people who abandon their own ambitions in order to please their families frequently report feelings of resentment and a loss of direction that can last well into adulthood.",
    "exampleNew": "Changing jobs left her with a loss of direction.",
    "syllableCount": 6,
    "stressPosition": 5,
    "mnemonicVi": "direction = hướng đi; mất hướng đi là mất phương hướng."
  },
  {
    "word": "last well into adulthood",
    "ipa": "/lɑːst wel ˌɪntu ˈædʌlthʊd/",
    "partOfSpeech": "phrase",
    "meaningVi": "kéo dài đến tận tuổi trưởng thành",
    "meaningEn": "to continue far into adult life",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "last well into adulthood"
    ],
    "exampleFromPassage": "Conversely, young people who abandon their own ambitions in order to please their families frequently report feelings of resentment and a loss of direction that can last well into adulthood.",
    "exampleNew": "These memories can last well into adulthood.",
    "syllableCount": 7,
    "stressPosition": 5,
    "mnemonicVi": "last ở đây là động từ kéo dài; well into nhấn mạnh đến tận một giai đoạn."
  },
  {
    "word": "an unprecedented range of options",
    "ipa": "/ən ʌnˌpresɪdentɪd ˌreɪndʒ əv ˈɒpʃnz/",
    "partOfSpeech": "phrase",
    "meaningVi": "một loạt lựa chọn đa dạng chưa từng có",
    "meaningEn": "a variety of choices greater than ever before",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "an unprecedented range of options"
    ],
    "exampleFromPassage": "Yet the modern economy offers young people an unprecedented range of options, many of which did not exist when their parents were young.",
    "exampleNew": "Students now have an unprecedented range of options.",
    "syllableCount": 10,
    "stressPosition": 9,
    "mnemonicVi": "range = phạm vi; unprecedented = chưa có tiền lệ."
  },
  {
    "word": "treat sth as",
    "ipa": "/ˈtriːt ˌsʌmθɪŋ əz/",
    "partOfSpeech": "phrase",
    "meaningVi": "coi, đối xử với điều gì như là",
    "meaningEn": "to regard or deal with something in a particular way",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "treat sth as"
    ],
    "exampleFromPassage": "When families treat career choice as a conversation instead of a command, the young person gains autonomy while the family retains its most valuable asset, which is not the business itself but the bond between its members.",
    "exampleNew": "We treat each mistake as a chance to learn.",
    "syllableCount": 4,
    "stressPosition": 1,
    "mnemonicVi": "treat A as B = coi A như B; không chỉ có nghĩa chữa trị."
  },
  {
    "word": "gain autonomy",
    "ipa": "/ɡeɪn ɔːˈtɒnəmi/",
    "partOfSpeech": "phrase",
    "meaningVi": "giành được quyền tự chủ",
    "meaningEn": "to obtain the freedom to make your own decisions",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "gain autonomy"
    ],
    "exampleFromPassage": "When families treat career choice as a conversation instead of a command, the young person gains autonomy while the family retains its most valuable asset, which is not the business itself but the bond between its members.",
    "exampleNew": "Teenagers gain autonomy as they grow older.",
    "syllableCount": 5,
    "stressPosition": 3,
    "mnemonicVi": "gain = có được; auto = tự, nên autonomy là quyền tự quyết."
  },
  {
    "word": "retain an asset",
    "ipa": "/rɪˌteɪn ən ˈæset/",
    "partOfSpeech": "phrase",
    "meaningVi": "giữ lại một tài sản",
    "meaningEn": "to keep something valuable",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "retain an asset"
    ],
    "exampleFromPassage": "When families treat career choice as a conversation instead of a command, the young person gains autonomy while the family retains its most valuable asset, which is not the business itself but the bond between its members.",
    "exampleNew": "The company hopes to retain an asset that matters to its future.",
    "syllableCount": 5,
    "stressPosition": 4,
    "mnemonicVi": "retain = giữ lại; asset trong bài là tình gắn bó, không chỉ là tiền bạc."
  },
  {
    "word": "the division of labour",
    "ipa": "/ðə dɪˌvɪʒn əv ˈleɪbə/",
    "partOfSpeech": "phrase",
    "meaningVi": "sự phân công lao động",
    "meaningEn": "the way work is shared among people",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "the division of labour"
    ],
    "exampleFromPassage": "For much of the twentieth century, the division of labour within the family followed a familiar pattern: the father was the breadwinner, and the mother was responsible for the home and the children.",
    "exampleNew": "The division of labour should be fair.",
    "syllableCount": 7,
    "stressPosition": 6,
    "mnemonicVi": "divide = chia; division of labour = chia phần việc."
  },
  {
    "word": "leave few alternatives",
    "ipa": "/liːv fjuː ɔːlˈtɜːnətɪvz/",
    "partOfSpeech": "phrase",
    "meaningVi": "để lại rất ít lựa chọn khác",
    "meaningEn": "to allow very few other choices",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "leave few alternatives"
    ],
    "exampleFromPassage": "These gender roles were rarely questioned, partly because they were reinforced by law, religion and popular culture, and partly because economic conditions left few alternatives.",
    "exampleNew": "The deadline leaves few alternatives.",
    "syllableCount": 6,
    "stressPosition": 4,
    "mnemonicVi": "few = rất ít; left là quá khứ của leave."
  },
  {
    "word": "retain its assumptions",
    "ipa": "/rɪˌteɪn ɪts əˈsʌmpʃnz/",
    "partOfSpeech": "phrase",
    "meaningVi": "giữ những quan niệm mặc định của mô hình đó",
    "meaningEn": "to keep the beliefs taken for granted in a model",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "retain its assumptions"
    ],
    "exampleFromPassage": "Grandparents who grew up under the traditional model often retain its assumptions, even when they no longer defend them openly.",
    "exampleNew": "A group may retain its assumptions even after conditions change.",
    "syllableCount": 6,
    "stressPosition": 5,
    "mnemonicVi": "its chỉ mô hình truyền thống; assumptions là những điều mặc nhiên tin đúng."
  },
  {
    "word": "be resolved through negotiation",
    "ipa": "/bi rɪˌzɒlvd θruː nɪˌɡəʊʃiˈeɪʃn/",
    "partOfSpeech": "phrase",
    "meaningVi": "được giải quyết thông qua thương lượng",
    "meaningEn": "to be settled by discussion aimed at agreement",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "be resolved through negotiation"
    ],
    "exampleFromPassage": "The first concerns everyday behaviour, such as table manners, dress codes or the acceptable amount of screen time, and is usually resolved through negotiation.",
    "exampleNew": "The conflict can be resolved through negotiation.",
    "syllableCount": 9,
    "stressPosition": 8,
    "mnemonicVi": "resolve = giải quyết; through = thông qua một cách thức."
  },
  {
    "word": "hold sth sacred",
    "ipa": "/həʊld ˌsʌmθɪŋ ˈseɪkrɪd/",
    "partOfSpeech": "phrase",
    "meaningVi": "coi điều gì là thiêng liêng",
    "meaningEn": "to consider something deeply important and worthy of respect",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "hold sth sacred"
    ],
    "exampleFromPassage": "Disagreements of this second kind are far more likely to cause lasting damage, because each side experiences the other's position not merely as different but as a rejection of what it holds sacred.",
    "exampleNew": "Many families hold their traditions sacred.",
    "syllableCount": 5,
    "stressPosition": 4,
    "mnemonicVi": "hold + tân ngữ + tính từ: coi điều gì như thế nào."
  },
  {
    "word": "interpret sth through that lens",
    "ipa": "/ɪnˌtɜːprɪt ˌsʌmθɪŋ θruː ðæt ˈlenz/",
    "partOfSpeech": "phrase",
    "meaningVi": "diễn giải điều gì qua lăng kính đó",
    "meaningEn": "to understand something using an existing viewpoint",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "interpret sth through that lens"
    ],
    "exampleFromPassage": "A father who has decided that his daughter is \"rebellious\" will interpret everything she says through that lens, just as a teenager who has labelled her parents \"old-fashioned\" will dismiss their advice before it is given.",
    "exampleNew": "He interprets new events through that lens.",
    "syllableCount": 8,
    "stressPosition": 8,
    "mnemonicVi": "lens = thấu kính; lăng kính ở đây là định kiến có sẵn."
  },
  {
    "word": "label sb as",
    "ipa": "/ˈleɪbl ˌsʌmbədi æz/",
    "partOfSpeech": "phrase",
    "meaningVi": "gán cho ai nhãn là",
    "meaningEn": "to describe someone using a fixed judgement",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "label sb as"
    ],
    "exampleFromPassage": "A father who has decided that his daughter is \"rebellious\" will interpret everything she says through that lens, just as a teenager who has labelled her parents \"old-fashioned\" will dismiss their advice before it is given.",
    "exampleNew": "Do not label someone as lazy without listening.",
    "syllableCount": 6,
    "stressPosition": 1,
    "mnemonicVi": "label = dán nhãn; as có thể được lược khi theo sau là tính từ."
  },
  {
    "word": "a different vantage point",
    "ipa": "/ə ˌdɪfrənt ˈvɑːntɪdʒ pɔɪnt/",
    "partOfSpeech": "phrase",
    "meaningVi": "một góc nhìn khác",
    "meaningEn": "a different position from which to understand something",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "a different vantage point"
    ],
    "exampleFromPassage": "In the end, the goal is not for one generation to convert the other but for each to accept that a different vantage point is not a moral failure.",
    "exampleNew": "Try to understand the problem from a different vantage point.",
    "syllableCount": 6,
    "stressPosition": 4,
    "mnemonicVi": "vantage point là điểm nhìn; khác góc nhìn không có nghĩa là sai đạo đức."
  },
  {
    "word": "however",
    "ipa": "/haʊˈevə/",
    "partOfSpeech": "phrase",
    "meaningVi": "tuy nhiên",
    "meaningEn": "used to introduce a contrasting idea",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "however"
    ],
    "exampleFromPassage": "There is, however, evidence that the gap can be narrowed.",
    "exampleNew": "The task is difficult; however, we can finish it together.",
    "syllableCount": 3,
    "stressPosition": 2,
    "mnemonicVi": "However báo hiệu ý trái chiều: vẫn có bằng chứng khoảng cách thu hẹp được."
  },
  {
    "word": "nevertheless",
    "ipa": "/ˌnevəðəˈles/",
    "partOfSpeech": "phrase",
    "meaningVi": "tuy vậy, dù thế",
    "meaningEn": "despite what has just been said",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "nevertheless"
    ],
    "exampleFromPassage": "Nevertheless, sociologists caution against dismissing older views as mere prejudice.",
    "exampleNew": "It was raining; nevertheless, we went to school.",
    "syllableCount": 4,
    "stressPosition": 4,
    "mnemonicVi": "Nevertheless: dù khó chịu với quan điểm cũ, vẫn cần tìm hiểu thay vì khinh thường."
  },
  {
    "word": "conversely",
    "ipa": "/ˈkɒnvɜːsli/",
    "partOfSpeech": "phrase",
    "meaningVi": "ngược lại, xét theo chiều ngược lại",
    "meaningEn": "used to introduce the opposite situation",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "conversely"
    ],
    "exampleFromPassage": "Conversely, young people who abandon their own ambitions in order to please their families frequently report feelings of resentment and a loss of direction that can last well into adulthood.",
    "exampleNew": "Some parents want stability; conversely, their children want adventure.",
    "syllableCount": 3,
    "stressPosition": 1,
    "mnemonicVi": "Conversely chuyển sang chiều ngược lại: từ khác nghề sang từ bỏ hoài bão."
  },
  {
    "word": "ironically",
    "ipa": "/aɪˈrɒnɪkli/",
    "partOfSpeech": "phrase",
    "meaningVi": "trớ trêu thay",
    "meaningEn": "used when the result is contrary to what is expected",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "ironically"
    ],
    "exampleFromPassage": "Ironically, the very closeness of family life makes these conflicts harder to manage.",
    "exampleNew": "Ironically, our attempt to save time made the journey longer.",
    "syllableCount": 4,
    "stressPosition": 2,
    "mnemonicVi": "Ironically: tưởng gần gũi sẽ dễ hiểu nhau, nhưng lại khó xử lý xung đột hơn."
  },
  {
    "word": "furthermore",
    "ipa": "/ˌfɜːðəˈmɔː/",
    "partOfSpeech": "phrase",
    "meaningVi": "hơn nữa",
    "meaningEn": "used to add another supporting point",
    "synonyms": [],
    "antonyms": [],
    "wordFamily": [],
    "emoji": "🔗",
    "collocations": [
      "furthermore"
    ],
    "exampleFromPassage": "Furthermore, family members frequently assume that they already know what the others think, and therefore stop listening.",
    "exampleNew": "The course is useful; furthermore, it is free.",
    "syllableCount": 3,
    "stressPosition": 3,
    "mnemonicVi": "Furthermore thêm một lý do: người thân còn mặc định đã biết người kia nghĩ gì."
  },
];

// ================= CÂU HỎI LUYỆN CỤM TỪ =================

const H = (...types: HintLevel['type'][]): HintLevel[] => types.map((type) => ({ type }));

/** Mini 1 — nhận ra nghĩa của cụm */
export const phraseMini1: Question[] = [
  {
    id: 'd2p1-1', skillType: 'idiom', format: 'match', difficulty: 1,
    targetWords: ["follow in sb's footsteps", 'be deeply rooted', 'narrow the gap', 'dismiss sth as', 'caution against', 'distinguish between'],
    stem: 'Match each phrase from the passages with its meaning.',
    stemVi: 'Nối mỗi cụm từ trong bài đọc với nghĩa đúng.',
    options: ["follow in sb's footsteps", 'be deeply rooted', 'narrow the gap', 'dismiss sth as', 'caution against', 'distinguish between'],
    optionsRight: [
      'to do the same job as someone before you',
      'to be firmly based on something',
      'to make a difference between two things smaller',
      'to refuse to take something seriously',
      'to warn someone not to do something',
      'to recognise the difference between two things',
    ],
    optionsVi: ['nối nghiệp', 'bắt nguồn sâu xa từ', 'thu hẹp khoảng cách', 'gạt bỏ, coi thường', 'cảnh báo đừng làm gì', 'phân biệt giữa'],
    hintLevels: [
      { type: 'custom', text: '"root" = rễ, "narrow" = hẹp, "footstep" = dấu chân.' },
      { type: 'custom', text: '"caution" cùng họ với "cautious" = thận trọng.' },
      { type: 'custom', text: "follow in sb's footsteps: nối nghiệp · be deeply rooted: ăn sâu · narrow the gap: thu hẹp khoảng cách · dismiss as: gạt bỏ · caution against: cảnh báo · distinguish between: phân biệt" },
    ],
    explanation: 'Đoán nghĩa cụm bằng từ gốc dễ nhận ra nhất bên trong cụm.',
    strategyTag: 'phraseMeaning',
  },
  {
    id: 'd2p1-2', skillType: 'idiom', format: 'mcq', difficulty: 2,
    targetWords: ['be out of date'],
    stem: 'Every generation believes that the one before it is hopelessly ______.',
    stemVi: 'Thế hệ nào cũng cho rằng thế hệ trước mình đã ______.',
    options: ['out of date', 'out of order', 'out of reach', 'out of place'],
    optionsVi: ['lỗi thời', 'hỏng, không dùng được', 'ngoài tầm với', 'lạc lõng, không hợp chỗ'],
    answer: 0,
    hintLevels: H('eliminate', 'meaningEn', 'meaningVi'),
    explanation: '"out of date" = lỗi thời. Ba cụm còn lại cùng mở đầu "out of" nhưng khác nghĩa hoàn toàn.',
    distractorNotes: { 1: '"out of order" = máy móc hỏng, không hoạt động.', 2: '"out of reach" = ngoài tầm với.', 3: '"out of place" = không hợp hoàn cảnh.' },
    strategyTag: 'phraseMeaning',
  },
  {
    id: 'd2p1-3', skillType: 'idiom', format: 'oddOneOut', difficulty: 2,
    targetWords: ['narrow the gap'],
    stem: 'Which phrase does NOT mean "to make a difference smaller"?',
    stemVi: 'Cụm nào KHÔNG mang nghĩa "làm khoảng cách nhỏ lại"?',
    options: ['narrow the gap', 'bridge the gap', 'close the gap', 'widen the gap'],
    optionsVi: ['thu hẹp khoảng cách', 'bắc cầu nối khoảng cách', 'khép khoảng cách', 'nới rộng khoảng cách'],
    answer: 3,
    hintLevels: [
      { type: 'custom', text: '"wide" nghĩa là rộng.' },
      { type: 'custom', text: 'Ba cụm kia đều làm khoảng cách nhỏ lại.' },
      { type: 'custom', text: '"widen the gap" = làm khoảng cách RỘNG ra — ngược nghĩa.' },
    ],
    explanation: 'Đề thi hay hỏi OPPOSITE in meaning, nên phải nhớ cả cặp trái nghĩa: narrow / widen the gap.',
    strategyTag: 'phraseMeaning',
  },
  {
    "id": "d2p1-4",
    "skillType": "collocation",
    "format": "match",
    "difficulty": 2,
    "targetWords": [
      "carry symbolic weight",
      "be shaped by",
      "be viewed with suspicion",
      "abandon one's ambitions in order to please sb",
      "a loss of direction",
      "last well into adulthood"
    ],
    "stem": "Match each phrase with its meaning in passages 4–6.",
    "stemVi": "Nối mỗi cụm với nghĩa trong bài đọc 4–6.",
    "options": [
      "carry symbolic weight",
      "be shaped by",
      "be viewed with suspicion",
      "abandon one's ambitions in order to please sb",
      "a loss of direction",
      "last well into adulthood"
    ],
    "optionsRight": [
      "to represent important values beyond the literal meaning",
      "to be influenced and formed by something",
      "to be regarded with doubt or distrust",
      "to give up personal goals to satisfy someone else",
      "a feeling of not knowing what to do with your life",
      "to continue far into adult life"
    ],
    "optionsVi": [
      "mang sức nặng biểu tượng",
      "được định hình bởi",
      "bị nhìn nhận với sự nghi ngại",
      "từ bỏ hoài bão để làm hài lòng ai",
      "sự mất phương hướng",
      "kéo dài đến tận tuổi trưởng thành"
    ],
    "hintLevels": [
      {
        "type": "custom",
        "text": "Nhìn từ chính trong cụm và nhớ câu gốc của bài đọc."
      },
      {
        "type": "custom",
        "text": "Nối những cặp bạn chắc chắn trước rồi xét các cặp còn lại."
      },
      {
        "type": "custom",
        "text": "carry symbolic weight: mang sức nặng biểu tượng · be shaped by: được định hình bởi · be viewed with suspicion: bị nhìn nhận với sự nghi ngại · abandon one's ambitions in order to please sb: từ bỏ hoài bão để làm hài lòng ai · a loss of direction: sự mất phương hướng · last well into adulthood: kéo dài đến tận tuổi trưởng thành"
      }
    ],
    "explanation": "carry symbolic weight = mang sức nặng biểu tượng · be shaped by = được định hình bởi · be viewed with suspicion = bị nhìn nhận với sự nghi ngại · abandon one's ambitions in order to please sb = từ bỏ hoài bão để làm hài lòng ai · a loss of direction = sự mất phương hướng · last well into adulthood = kéo dài đến tận tuổi trưởng thành. Những cụm này giúp bạn hiểu cả ý của câu thay vì dịch từng từ rời.",
    "strategyTag": "phraseMeaning"
  },
  {
    "id": "d2p1-5",
    "skillType": "collocation",
    "format": "match",
    "difficulty": 2,
    "targetWords": [
      "an unprecedented range of options",
      "treat sth as",
      "gain autonomy",
      "retain an asset",
      "the division of labour",
      "leave few alternatives"
    ],
    "stem": "Match each phrase with its meaning in passages 4–6.",
    "stemVi": "Nối mỗi cụm với nghĩa trong bài đọc 4–6.",
    "options": [
      "an unprecedented range of options",
      "treat sth as",
      "gain autonomy",
      "retain an asset",
      "the division of labour",
      "leave few alternatives"
    ],
    "optionsRight": [
      "a variety of choices greater than ever before",
      "to regard or deal with something in a particular way",
      "to obtain the freedom to make your own decisions",
      "to keep something valuable",
      "the way work is shared among people",
      "to allow very few other choices"
    ],
    "optionsVi": [
      "một loạt lựa chọn đa dạng chưa từng có",
      "coi, đối xử với điều gì như là",
      "giành được quyền tự chủ",
      "giữ lại một tài sản",
      "sự phân công lao động",
      "để lại rất ít lựa chọn khác"
    ],
    "hintLevels": [
      {
        "type": "custom",
        "text": "Nhìn từ chính trong cụm và nhớ câu gốc của bài đọc."
      },
      {
        "type": "custom",
        "text": "Nối những cặp bạn chắc chắn trước rồi xét các cặp còn lại."
      },
      {
        "type": "custom",
        "text": "an unprecedented range of options: một loạt lựa chọn đa dạng chưa từng có · treat sth as: coi, đối xử với điều gì như là · gain autonomy: giành được quyền tự chủ · retain an asset: giữ lại một tài sản · the division of labour: sự phân công lao động · leave few alternatives: để lại rất ít lựa chọn khác"
      }
    ],
    "explanation": "an unprecedented range of options = một loạt lựa chọn đa dạng chưa từng có · treat sth as = coi, đối xử với điều gì như là · gain autonomy = giành được quyền tự chủ · retain an asset = giữ lại một tài sản · the division of labour = sự phân công lao động · leave few alternatives = để lại rất ít lựa chọn khác. Những cụm này giúp bạn hiểu cả ý của câu thay vì dịch từng từ rời.",
    "strategyTag": "phraseMeaning"
  },
  {
    "id": "d2p1-6",
    "skillType": "collocation",
    "format": "match",
    "difficulty": 2,
    "targetWords": [
      "retain its assumptions",
      "be resolved through negotiation",
      "hold sth sacred",
      "interpret sth through that lens",
      "label sb as",
      "a different vantage point"
    ],
    "stem": "Match each phrase with its meaning in passages 4–6.",
    "stemVi": "Nối mỗi cụm với nghĩa trong bài đọc 4–6.",
    "options": [
      "retain its assumptions",
      "be resolved through negotiation",
      "hold sth sacred",
      "interpret sth through that lens",
      "label sb as",
      "a different vantage point"
    ],
    "optionsRight": [
      "to keep the beliefs taken for granted in a model",
      "to be settled by discussion aimed at agreement",
      "to consider something deeply important and worthy of respect",
      "to understand something using an existing viewpoint",
      "to describe someone using a fixed judgement",
      "a different position from which to understand something"
    ],
    "optionsVi": [
      "giữ những quan niệm mặc định của mô hình đó",
      "được giải quyết thông qua thương lượng",
      "coi điều gì là thiêng liêng",
      "diễn giải điều gì qua lăng kính đó",
      "gán cho ai nhãn là",
      "một góc nhìn khác"
    ],
    "hintLevels": [
      {
        "type": "custom",
        "text": "Nhìn từ chính trong cụm và nhớ câu gốc của bài đọc."
      },
      {
        "type": "custom",
        "text": "Nối những cặp bạn chắc chắn trước rồi xét các cặp còn lại."
      },
      {
        "type": "custom",
        "text": "retain its assumptions: giữ những quan niệm mặc định của mô hình đó · be resolved through negotiation: được giải quyết thông qua thương lượng · hold sth sacred: coi điều gì là thiêng liêng · interpret sth through that lens: diễn giải điều gì qua lăng kính đó · label sb as: gán cho ai nhãn là · a different vantage point: một góc nhìn khác"
      }
    ],
    "explanation": "retain its assumptions = giữ những quan niệm mặc định của mô hình đó · be resolved through negotiation = được giải quyết thông qua thương lượng · hold sth sacred = coi điều gì là thiêng liêng · interpret sth through that lens = diễn giải điều gì qua lăng kính đó · label sb as = gán cho ai nhãn là · a different vantage point = một góc nhìn khác. Những cụm này giúp bạn hiểu cả ý của câu thay vì dịch từng từ rời.",
    "strategyTag": "phraseMeaning"
  },

];

/** Mini 2 — tự nhớ lại giới từ / tiểu từ đi kèm */
export const phraseMini2: Question[] = [
  {
    id: 'd2p2-1', skillType: 'collocation', format: 'fillBlank', difficulty: 2,
    targetWords: ['associate sth with'],
    stem: 'Điền MỘT giới từ còn thiếu.',
    sentence: 'Older relatives associate success ___ medicine, law or engineering.',
    stemVi: 'Người lớn tuổi gắn thành công với nghề y, luật hoặc kỹ thuật.',
    answers: ['with'],
    hintLevels: [
      { type: 'firstLetter' },
      { type: 'custom', text: 'Nối hai thứ lại với nhau trong đầu — giới từ chỉ sự đi cùng.' },
      { type: 'custom', text: 'Đáp án là "with": associate A with B.' },
    ],
    explanation: '"associate A with B" luôn dùng "with", không dùng "to" hay "for".',
    strategyTag: 'phraseForm',
  },
  {
    id: 'd2p2-2', skillType: 'collocation', format: 'fillBlank', difficulty: 2,
    targetWords: ['be responsible for'],
    stem: 'Điền MỘT giới từ còn thiếu.',
    sentence: 'In the past, the mother was responsible ___ the home and the children.',
    stemVi: 'Ngày trước, người mẹ chịu trách nhiệm về nhà cửa và con cái.',
    answers: ['for'],
    hintLevels: [
      { type: 'firstLetter' },
      { type: 'custom', text: 'responsible ___ công việc · responsible TO cấp trên.' },
      { type: 'custom', text: 'Đáp án là "for".' },
    ],
    explanation: 'be responsible FOR + việc. be responsible TO + người mà mình phải báo cáo.',
    strategyTag: 'phraseForm',
  },
  {
    id: 'd2p2-3', skillType: 'collocation', format: 'clozeBank', difficulty: 2,
    targetWords: ["follow in sb's footsteps", 'take the time to', 'narrow the gap', 'be perceived as'],
    stem: 'Chọn cụm đúng cho từng chỗ trống.',
    clozeText:
      'Many parents assume their children will {0}. Refusing openly may {1} disrespect. ' +
      'However, parents who {2} understand a new profession can {3} between the two generations.',
    blanks: ['follow in their footsteps', 'be perceived as', 'take the time to', 'narrow the gap'],
    bank: ['follow in their footsteps', 'be perceived as', 'take the time to', 'narrow the gap', 'give in to', 'be out of date'],
    hintLevels: [
      { type: 'custom', text: 'Chỗ (2) đứng sau "may" nên cần dạng nguyên thể bị động.' },
      { type: 'custom', text: 'Hai cụm thừa là "give in to" và "be out of date".' },
      { type: 'custom', text: '(1) follow in their footsteps · (2) be perceived as · (3) take the time to · (4) narrow the gap' },
    ],
    explanation: 'Nhìn từ đứng ngay trước chỗ trống (may, who, can) để biết cần dạng động từ nào.',
    strategyTag: 'phraseUse',
  },
  {
    id: 'd2p2-4', skillType: 'collocation', format: 'fillBlank', difficulty: 3,
    targetWords: ['caution against'],
    stem: 'Điền MỘT từ còn thiếu, đúng dạng.',
    sentence: 'Sociologists caution against ___ older views as mere prejudice. (dismiss)',
    stemVi: 'Các nhà xã hội học cảnh báo đừng gạt bỏ quan điểm của người lớn tuổi như định kiến.',
    answers: ['dismissing'],
    hintLevels: [
      { type: 'custom', text: '"against" là giới từ.' },
      { type: 'custom', text: 'Sau giới từ dùng V-ing.' },
      { type: 'custom', text: 'Đáp án: dismissing.' },
    ],
    explanation: 'caution against + V-ing. Bẫy ở chỗ tiếng Việt là "cảnh báo đừng LÀM gì" nên nhiều bạn viết "to dismiss"; nhưng "against" là giới từ, sau nó bắt buộc dùng V-ing.',
    strategyTag: 'phraseForm',
  },
];

/** Mini 3 — dùng cụm trong văn bản ngắn theo dạng đề */
export const phraseMini3: Question[] = [
  {
    id: 'd2p3-1', skillType: 'collocation', format: 'clozeChoice', difficulty: 3,
    targetWords: ['be deeply rooted', 'in the eyes of', 'be built on', 'in the end'],
    instruction: 'Read the paragraph and choose the best option for each blank.',
    stem: 'Chọn phương án đúng cho mỗi chỗ trống.',
    clozeText:
      'Filial duty is {0} many Asian societies, where respect for parents has been central to family life for centuries. {1} older relatives, a secure job means safety. ' +
      "Earlier generations worked to create the opportunities that young people now enjoy. Young people's freedoms are {2} the efforts of earlier generations, which made those freedoms possible rather than restricting them. In this discussion, the final conclusion is that {3}, both sides need to listen.",
    blanks: ['deeply rooted in', 'In the eyes of', 'built on', 'in the end'],
    blankOptions: [
      ['deeply rooted in', 'completely absent from', 'openly opposed to', 'entirely separate from'],
      ['In the eyes of', 'In the absence of', 'At the expense of', 'On behalf of'],
      ['built on', 'held back by', 'cut off from', 'at odds with'],
      ['in the end', 'in exchange for', 'in addition to', 'in pursuit of'],
    ],
    hintLevels: [
      { type: 'custom', text: 'Đọc cả đoạn: chữ hiếu ăn sâu; người lớn xem nghề ổn định là an toàn; tự do có nền tảng từ thế hệ trước; câu cuối kết luận.' },
      { type: 'custom', text: 'Nhớ: rooted IN · in the eyes OF · built ON · in the end (không có "of").' },
      { type: 'custom', text: '(1) deeply rooted in · (2) In the eyes of · (3) built on · (4) in the end' },
    ],
    explanation: 'Đáp án: deeply rooted in (ăn sâu trong), In the eyes of (theo cách nhìn của), built on (được xây dựng dựa trên), in the end (cuối cùng thì). Các cụm còn lại có thật nhưng sai ý: absent from = vắng mặt, on behalf of = thay mặt, held back by = bị kìm hãm bởi; in exchange for (đổi lấy), in addition to (ngoài), in pursuit of (theo đuổi) cần danh từ hoặc V-ing làm bổ ngữ, không nối trực tiếp với mệnh đề "both sides need to listen".',
    strategyTag: 'phraseUse',
  },
  {
    id: 'd2p3-2', skillType: 'idiom', format: 'mcq', difficulty: 3,
    targetWords: ["keep one's distance"],
    stem: 'Colleagues who disagree can ______ by avoiding contact; relatives cannot easily avoid one another.',
    stemVi: 'Đồng nghiệp bất đồng có thể ______ bằng cách tránh tiếp xúc; người thân thì khó tránh gặp nhau.',
    options: ['keep their distance', 'speak their minds', 'change their minds', 'keep their promises'],
    optionsVi: ['giữ khoảng cách', 'nói thẳng suy nghĩ của mình', 'đổi ý', 'giữ lời hứa'],
    answer: 0,
    fixedOrder: true,
    hintLevels: [
      { type: 'custom', text: '"by avoiding contact" = bằng cách tránh tiếp xúc.' },
      { type: 'custom', text: 'Cần cụm diễn tả tránh gần gũi, không phải nói thẳng, đổi ý hay giữ lời.' },
      { type: 'custom', text: 'Đáp án A: keep their distance.' },
    ],
    explanation: 'Cụm cố định "keep one\'s distance" — đúng động từ "keep" và danh từ số ít "distance".',
    distractorNotes: { 1: 'Nói thẳng suy nghĩ không có nghĩa tránh tiếp xúc.', 2: 'Đổi ý không diễn tả việc giữ khoảng cách.', 3: 'Giữ lời hứa không liên quan đến tránh gặp nhau.' },
    strategyTag: 'phraseForm',
  },
  {
    id: 'd2p3-3', skillType: 'idiom', format: 'mcq', difficulty: 3,
    targetWords: ['be resistant to', 'stay open-minded'],
    stem: 'Relatives keep their stereotypes unchanged even when new facts prove them wrong. These fixed images, once formed, are remarkably ______ evidence.',
    stemVi: 'Người thân vẫn giữ nguyên định kiến ngay cả khi sự thật mới chứng minh họ sai. Những định kiến đã hình thành thì rất ______ bằng chứng.',
    options: ['resistant to', 'dependent on', 'consistent with', 'supported by'],
    optionsVi: ['khó lay chuyển bởi', 'phụ thuộc vào', 'nhất quán với', 'được hỗ trợ bởi'],
    answer: 0,
    hintLevels: [
      { type: 'custom', text: 'Sau "are remarkably" cần một tính từ.' },
      { type: 'custom', text: 'Câu đầu nói định kiến không thay đổi ngay cả khi sự thật chứng minh chúng sai: bằng chứng mới khó thay đổi định kiến.' },
      { type: 'custom', text: 'Đáp án: resistant to.' },
    ],
    explanation: 'Câu đầu nói người thân giữ nguyên định kiến dù sự thật mới chứng minh họ sai. Vì vậy fixed images là định kiến khó thay đổi bởi bằng chứng: resistant to. Ba cụm còn lại đều có thật nhưng không diễn tả sự cố chấp này.',
    distractorNotes: { 1: 'dependent on = phụ thuộc vào; bài nói định kiến khó thay đổi ngay cả khi có bằng chứng.', 2: 'consistent with = phù hợp với; bài không khẳng định định kiến phù hợp bằng chứng.', 3: 'supported by = được hỗ trợ bởi; bài không nói bằng chứng ủng hộ định kiến.' },
    strategyTag: 'phraseForm',
  },
  {
    id: 'd2p3-4', skillType: 'collocation', format: 'wordOrdering', difficulty: 3,
    targetWords: ['take the time to'],
    stem: 'Sắp xếp các mảnh thành câu đúng.',
    stemVi: 'Những phụ huynh dành thời gian tìm hiểu các nghề lạ thường trở nên ủng hộ con.',
    ordered: ['Parents', 'who take the time to', 'understand unfamiliar professions', 'tend to become supportive'],
    hintLevels: [
      { type: 'custom', text: 'Chủ ngữ "Parents" đứng đầu, mệnh đề quan hệ "who..." đứng ngay sau.' },
      { type: 'custom', text: 'Động từ chính của câu là "tend to become".' },
      { type: 'custom', text: 'Parents / who take the time to / understand unfamiliar professions / tend to become supportive.' },
    ],
    explanation: 'Sau "take the time to" là động từ nguyên thể. "tend to become" là động từ chính của cả câu.',
    strategyTag: 'phraseUse',
  },
  {
    "id": "d2p3-5",
    "skillType": "cloze",
    "format": "clozeChoice",
    "difficulty": 3,
    "targetWords": [
      "conversely",
      "ironically",
      "furthermore"
    ],
    "stem": "Choose the connector that expresses the relationship between the ideas.",
    "stemVi": "Chọn từ nối đúng với quan hệ giữa các ý.",
    "clozeText": "Some young people reject their parents’ career plans. {0}, others give up their own ambitions to please their families. {1}, being close to relatives can make conflicts harder to manage, although we might expect closeness to help. {2}, family members often assume they already know what others think and stop listening.",
    "blanks": [
      "Conversely",
      "Ironically",
      "Furthermore"
    ],
    "blankOptions": [
      [
        "Conversely",
        "Similarly",
        "For example",
        "As a result"
      ],
      [
        "Ironically",
        "Fortunately",
        "Predictably",
        "In other words"
      ],
      [
        "Furthermore",
        "Instead",
        "On the contrary",
        "Nevertheless"
      ]
    ],
    "hintLevels": [
      {
        "type": "custom",
        "text": "(1) chuyển sang tình huống ngược lại; (2) kết quả trái điều mong đợi; (3) bổ sung một lý do nữa."
      },
      {
        "type": "custom",
        "text": "Bài 4 có Conversely; bài 6 có Ironically và Furthermore."
      },
      {
        "type": "custom",
        "text": "(1) Conversely · (2) Ironically · (3) Furthermore"
      }
    ],
    "explanation": "Conversely chuyển từ chống lại kế hoạch của bố mẹ sang làm theo để chiều lòng họ. Ironically nêu điều trớ trêu: gần gũi mà xung đột lại khó xử lý. Furthermore thêm một trở ngại khác là mặc định đã hiểu người thân. Các lựa chọn còn lại nói về sự tương tự, ví dụ, kết quả hoặc thay thế nên không khớp quan hệ ý ở đây.",
    "strategyTag": "phraseUse"
  },
];
