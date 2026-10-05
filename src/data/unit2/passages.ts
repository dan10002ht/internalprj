import type { Passage } from '@/types';

const READ = 'Read the following passage and mark the letter A, B, C or D on your answer sheet to indicate the correct answer to each of the following questions.';

// Nguồn: material/Unit 2 - Reading.md — bài 1–3 dùng cho Ngày 1, bài 4–6 cho Ngày 2
export const passages: Passage[] = [
  {
    id: 'p1',
    title: 'Three generations under one roof',
    instruction: READ,
    source: 'Adapted from vietnamnews.vn',
    paragraphs: [
      'Although the nuclear family, made up of parents and their children only, is increasingly popular in big cities, many Vietnamese households still have three generations living under the same roof. Grandparents, parents and children share meals, chores and daily routines. Supporters of this multi-generational arrangement argue that it preserves cultural values and strengthens family bonds. Grandparents pass on traditions and life experience, while young people offer help with technology and modern ideas. In return, the elderly are cared for at home rather than in nursing facilities, which many families consider a matter of respect and duty.',
      'However, living together is not always easy. Differences in attitudes and lifestyles can quickly turn into arguments. Older members tend to be more conservative, holding traditional views about table manners, dress and behaviour, whereas younger ones want greater freedom to make their own decisions. A grandmother may insist that everyone eat dinner together at six, while a teenager would rather finish an online game first. These small disagreements, if they are repeated every day, can create lasting tension.',
      'Financial pressure is another source of stress. In most extended families, the parents are the main breadwinners, supporting both their children and their ageing parents. This double burden can lead to exhaustion and, in some cases, resentment. Nevertheless, many families report that the advantages outweigh the disadvantages, especially when childcare and household costs are shared.',
      'Experts suggest that the key to harmony is open communication. Families that set clear rules about privacy, chores and money tend to experience fewer conflicts. Rather than expecting one generation to give in to another, they look for compromises that everyone can accept. As one sociologist puts it, a shared home works best when it is also a shared responsibility.',
    ],
    underlines: ['These small disagreements, if they are repeated every day, can create lasting tension.'],
  },
  {
    id: 'p2',
    title: '"Be home by ten"',
    instruction: READ,
    source: 'Adapted from theguardian.com',
    paragraphs: [
      '"Be home by ten" is a sentence that many teenagers hear from their parents, and few of them like it. A curfew, a fixed time by which a young person must return home, is one of the most common causes of conflict between parents and their children. Parents see it as a way of keeping teenagers safe; teenagers see it as a sign that they are not trusted.',
      "From the parents' point of view, a curfew is a reasonable rule. Late-night streets can be dangerous, and young people who stay out late are more likely to lose sleep and struggle at school the next day. Many parents also remember their own strict upbringing and believe that firm rules helped them become responsible adults. To them, setting a curfew is simply part of being a good parent.",
      "Teenagers, however, often feel that a fixed time ignores the reality of their lives. A school event or a friend's birthday party may finish later than expected, and being forced to leave early can be embarrassing. Moreover, older teenagers argue that they should be given more independence than their younger siblings as they approach adulthood. When rules are imposed without discussion, young people may respond by breaking them secretly, which damages trust even further.",
      "Family counsellors suggest that the problem is not the curfew itself but the way it is decided. When parents explain their reasons and listen to their children's concerns, teenagers are far more likely to accept the rule. Some families agree on a flexible curfew that changes depending on the occasion, or allow teenagers to earn a later time by showing they can be trusted. In this way, a source of arguments can become an opportunity to build mutual understanding.",
    ],
    underlines: ['When rules are imposed without discussion, young people may respond by breaking them secretly, which damages trust even further.'],
  },
  {
    id: 'p3',
    title: 'Digital natives',
    instruction: READ,
    source: 'Adapted from bbc.com',
    paragraphs: [
      "Today's teenagers are often described as digital natives: they have grown up with smartphones, tablets and social media, and cannot imagine life without them. Their parents and grandparents, by contrast, learnt to use these tools as adults and often remain uncertain about them. This difference in experience has created a new kind of generation gap, one that is centred not on music or clothes but on screens.",
      'Many older family members worry about the amount of time young people spend online. They complain that teenagers stare at their phones during meals, ignore conversations and go to bed too late. Some parents set strict limits on screen time or take devices away as a punishment. These measures, however, frequently lead to angry arguments rather than real change.',
      'Teenagers usually see the situation differently. For them, being online is not a waste of time but a way of staying connected with friends, doing homework and following their interests. They point out that adults also spend hours on their phones, and they feel that the rules are unfair when parents do not follow them. What older people call an addiction, young people often call a normal social life.',
      'Researchers say that neither side is entirely right. Excessive screen use can indeed affect sleep and concentration, but technology also brings real benefits, from learning opportunities to closer friendships. Instead of fighting over the number of hours, families are advised to agree on shared habits, such as phone-free meals, that apply to everyone. When adults are willing to learn from their children, and children are willing to switch off now and then, screens can bring generations together rather than pushing them apart.',
    ],
    underlines: ['What older people call an addiction, young people often call a normal social life.'],
  },
  {
    id: 'p4',
    title: 'Career expectations',
    instruction: READ,
    source: 'Adapted from psychologytoday.com',
    paragraphs: [
      "In many families, the question of what a young person should do with their life is not a private decision but a matter of collective concern. [I] Parents who have spent decades building a business or a professional reputation often assume that their children will follow in their footsteps, inheriting not only the family's assets but also its identity. For an older generation shaped by economic hardship, a stable and respected career represents security; for a younger generation raised in relative comfort, it may represent a cage.",
      "The clash is rarely about money alone. Sociologists who study family expectations point out that career choices carry symbolic weight. A doctor's son who becomes a musician is not simply choosing a different job; in the eyes of his parents, he may be rejecting the values that defined their sacrifices. [II] Conversely, young people who abandon their own ambitions in order to please their families frequently report feelings of resentment and a loss of direction that can last well into adulthood.",
      "Cultural context intensifies these pressures. In societies where filial duty is deeply rooted, openly refusing a parent's wishes can be perceived as disrespect rather than independence. Yet the modern economy offers young people an unprecedented range of options, many of which did not exist when their parents were young. [III] Careers in digital media, e-commerce or game design are viewed with suspicion by older relatives who associate success with medicine, law or engineering, professions whose prestige they understand.",
      'There is, however, evidence that the gap can be narrowed. Studies of family-owned businesses suggest that the most successful transitions occur when the older generation invites the younger one to reshape the enterprise rather than merely preserve it. [IV] Similarly, parents who take the time to understand unfamiliar professions tend to become supportive rather than obstructive. The underlying principle is the same: respect for tradition and openness to change are not opposites but partners. When families treat career choice as a conversation instead of a command, the young person gains autonomy while the family retains its most valuable asset, which is not the business itself but the bond between its members.',
    ],
    underlines: ['When families treat career choice as a conversation instead of a command, the young person gains autonomy while the family retains its most valuable asset, which is not the business itself but the bond between its members.'],
  },
  {
    id: 'p5',
    title: 'Gender roles across generations',
    instruction: READ,
    source: 'Adapted from theatlantic.com',
    paragraphs: [
      'For much of the twentieth century, the division of labour within the family followed a familiar pattern: the father was the breadwinner, and the mother was responsible for the home and the children. [I] These gender roles were rarely questioned, partly because they were reinforced by law, religion and popular culture, and partly because economic conditions left few alternatives. Today, that pattern has been transformed, and the speed of the change has produced a striking gap between the expectations of different generations.',
      "Grandparents who grew up under the traditional model often retain its assumptions, even when they no longer defend them openly. A grandmother may praise her granddaughter's promotion while quietly asking when she intends to have children; a grandfather may admire his son-in-law's cooking but describe it as \"helping\" his wife. [II] Such remarks are seldom intended to offend, yet they reveal an underlying belief that the domestic sphere remains, in the final analysis, a woman's responsibility.",
      'The middle generation, by contrast, occupies an uncomfortable position. Many working mothers describe a "second shift" in which a full day of paid employment is followed by hours of unpaid housework and childcare. [III] Their partners, meanwhile, may face criticism from both directions: judged by older relatives for doing "women\'s work" and by their own children for not doing enough of it. Research consistently shows that couples who share domestic tasks more equally report higher satisfaction, but the transition from principle to practice is slow and frequently contested.',
      'The youngest generation has grown up regarding equality as self-evident. Teenagers and young adults are more likely to expect both partners to work and to share responsibilities at home, and they are often puzzled, or even irritated, by the attitudes of their elders. [IV] Nevertheless, sociologists caution against dismissing older views as mere prejudice. These attitudes were formed in a world of very different constraints, and understanding that context is a more productive response than contempt. Bridging this particular gap requires the older generation to accept that roles can change without values collapsing, and the younger generation to recognise that their freedoms were built on the efforts of those who came before them.',
    ],
    underlines: ['These attitudes were formed in a world of very different constraints, and understanding that context is a more productive response than contempt.'],
  },
  {
    id: 'p6',
    title: 'Curiosity bridges the gap',
    instruction: READ,
    source: 'Adapted from nytimes.com',
    paragraphs: [
      'Every generation believes that the one before it is hopelessly out of date and the one after it is dangerously irresponsible. [I] The Greek philosopher Socrates is said to have complained that the young of his time had bad manners and contempt for authority, a lament that would sound familiar at many dinner tables today. What has changed is not the existence of the generation gap but its scale: rapid technological, economic and cultural shifts mean that a grandparent and a grandchild may inhabit worlds that barely overlap.',
      "Psychologists distinguish between two kinds of intergenerational conflict. The first concerns everyday behaviour, such as table manners, dress codes or the acceptable amount of screen time, and is usually resolved through negotiation. The second, and more serious, concerns core values: attitudes to marriage, religion, career or authority. [II] Disagreements of this second kind are far more likely to cause lasting damage, because each side experiences the other's position not merely as different but as a rejection of what it holds sacred.",
      'Ironically, the very closeness of family life makes these conflicts harder to manage. Colleagues who disagree can keep their distance; relatives cannot. [III] Furthermore, family members frequently assume that they already know what the others think, and therefore stop listening. A father who has decided that his daughter is "rebellious" will interpret everything she says through that lens, just as a teenager who has labelled her parents "old-fashioned" will dismiss their advice before it is given. These fixed images, once formed, are remarkably resistant to evidence.',
      "The most effective remedy, according to family therapists, is deceptively simple: curiosity. Families that manage the gap successfully are those in which members stay open-minded and ask genuine questions about one another's experiences rather than delivering verdicts. A grandparent who asks what a video game actually involves, or a teenager who asks what life was like during a period of hardship, opens a channel that lectures never can. [IV] Such conversations do not eliminate disagreement, but they transform it from a battle over who is right into an exchange of perspectives. In the end, the goal is not for one generation to convert the other but for each to accept that a different vantage point is not a moral failure.",
    ],
    underlines: ['Such conversations do not eliminate disagreement, but they transform it from a battle over who is right into an exchange of perspectives.'],
  },
];
