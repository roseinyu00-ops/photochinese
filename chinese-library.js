
(function(){
const $=id=>document.getElementById(id);
const grammar=[
[1,"Порядок слов S + V + O","Подлежащее, затем глагол и объект. Это базовая схема повествовательного предложения.","Подлежащее + глагол + дополнение",[["我喜欢咖啡。","Wǒ xǐhuan kāfēi.","Я люблю кофе."],["她学习汉语。","Tā xuéxí Hànyǔ.","Она изучает китайский."]],"Объект обычно стоит после глагола.","Как сказать «Я читаю книгу»?",["我书看。","我看书。","看我书。"],1,"我 — кто? 看 — действие, 书 — объект."],
[1,"Вопрос с 吗","Для общего вопроса «да или нет» добавь 吗 в конец утверждения. Порядок слов сохраняется.","Утверждение + 吗？",[["你是学生吗？","Nǐ shì xuésheng ma?","Ты студент(ка)?"],["你喜欢茶吗？","Nǐ xǐhuan chá ma?","Тебе нравится чай?"]],"Если уже есть вопросительное слово (什么, 谁), 吗 обычно не нужно.","Как спросить «Ты занят(а)?»",["你忙吗？","吗你忙？","你吗忙？"],0,"吗 ставится в конце: 你忙吗？"],
[1,"Отрицание 不 и 没","不 отрицает настоящее, будущее и привычки. 没(有) отрицает наличие или несостоявшееся действие.","不 + глагол · 没(有) + действие/有",[["我不喝咖啡。","Wǒ bù hē kāfēi.","Я не пью кофе."],["我没有时间。","Wǒ méiyǒu shíjiān.","У меня нет времени."]],"«Я не ходил(а)» — 我没去. Не используй 不去, если говоришь о прошлом факте.","Как сказать «У меня нет книги»?",["我不有书。","我没有书。","我没是书。"],1,"Отсутствие выражается через 没有."],
[1,"Связка 是","是 соединяет подлежащее с существительным или именной группой: кто это или кем является человек.","A + 是 + B",[["我是大学生。","Wǒ shì dàxuéshēng.","Я студент(ка) университета."],["她是老师。","Tā shì lǎoshī.","Она учитель."]],"С обычными прилагательными 是 чаще не нужен: 我很忙 — я занят(а).","Выбери «Он мой друг».",["他是我的朋友。","他我的朋友是。","他很我的朋友。"],0,"Именное сказуемое соединяется через 是."],
[1,"Принадлежность 的","的 ставится между владельцем и предметом, часто соответствует «мой», «твой», «чей».","Владелец + 的 + предмет",[["这是我的书。","Zhè shì wǒ de shū.","Это моя книга."],["老师的名字","Lǎoshī de míngzi","Имя учителя."]],"С близкими родственниками 的 часто опускают: 我妈妈 — моя мама.","Как сказать «его телефон»?",["他手机的","他的手机","手机他"],1,"他的手机 — буквально «он + 的 + телефон»."],
[2,"Счётное слово 个","Перед существительными часто нужно счётное слово. 个 — универсальный вариант, но у многих предметов есть своё.","Число + счётное слово + существительное",[["一个朋友","Yí ge péngyou","Один друг."],["三个学生","Sān ge xuésheng","Три студента."]],"Для книг используют 本, для чашек — 杯, для плоских предметов — 张.","Как сказать «две книги»?",["二书","两个书","两本书"],2,"Для книг нужно 本, а перед счётным словом обычно 两."],
[2,"Вопросительные слова 什么 и 谁","Вопросительное слово занимает место той части предложения, которую нужно узнать. 吗 не добавляется.","Порядок фразы сохраняется; неизвестное заменяется вопросительным словом",[["你叫什么名字？","Nǐ jiào shénme míngzi?","Как тебя зовут?"],["那个人是谁？","Nà ge rén shì shéi?","Кто тот человек?"]],"什么 — что/какой; 谁 — кто; 哪儿 — где/куда; 为什么 — почему.","Как спросить «Что ты пьёшь»?",["你喝什么？","什么你喝吗？","你吗喝什么？"],0,"什么 стоит на месте объекта после 喝."],
[2,"Местонахождение 在","在 показывает, где находится человек или предмет, либо где происходит действие.","Кто/что + 在 + место",[["我在学校。","Wǒ zài xuéxiào.","Я в университете."],["她在家学习。","Tā zài jiā xuéxí.","Она учится дома."]],"Не путай 在 с 有: 桌子上有一本书 — на столе есть книга.","Как сказать «Я в кафе»?",["我咖啡馆是。","我在咖啡馆。","在我咖啡馆吗。"],1,"在 ставится перед названием места."],
[2,"Опыт: 过","过 после глагола показывает, что человек когда-либо имел такой опыт. Важен сам факт опыта.","Подлежащее + глагол + 过 + дополнение",[["我去过中国。","Wǒ qùguo Zhōngguó.","Я бывал(а) в Китае."],["你吃过北京烤鸭吗？","Nǐ chīguo Běijīng kǎoyā ma?","Ты пробовал(а) утку по-пекински?"]],"过 — опыт, 了 — завершённое действие или изменение ситуации.","Как спросить «Ты бывал(а) в Шанхае»?",["你去上海了？","你去过上海吗？","你过上海去吗？"],1,"Опыт: 去 + 过 + место."],
[3,"Сравнение с 比","比 вводит объект сравнения. Прилагательное ставится после 比-конструкции.","A + 比 + B + прилагательное",[["今天比昨天冷。","Jīntiān bǐ zuótiān lěng.","Сегодня холоднее, чем вчера."],["我比哥哥高一点儿。","Wǒ bǐ gēge gāo yìdiǎnr.","Я немного выше старшего брата."]],"Не ставь 很 перед прилагательным в обычной 比-конструкции.","Как сказать «Кофе дороже чая»?",["咖啡比茶贵。","咖啡贵比茶。","咖啡很比茶贵。"],0,"Сначала A, затем 比 + B + признак."],
[3,"Причина и результат 因为…所以…","Парная конструкция связывает причину и следствие: 因为 вводит причину, 所以 — результат.","因为 + причина， 所以 + результат",[["因为下雨，所以我不去。","Yīnwèi xiàyǔ, suǒyǐ wǒ bú qù.","Поскольку идёт дождь, я не пойду."],["因为很忙，所以她没来。","Yīnwèi hěn máng, suǒyǐ tā méi lái.","Она не пришла, потому что была занята."]],"В разговоре один из элементов иногда опускают, если связь очевидна.","Как сказать «Я устал(а), поэтому пойду домой»?",["所以我累，因为回家。","因为我累，所以回家。","我因为所以累回家。"],1,"Причина после 因为, результат после 所以."],
[4,"Уступка 虽然…但是…","Показывает контраст: несмотря на один факт, происходит другое. По-русски «хотя…, но…».","虽然 + факт， 但是 + контраст",[["虽然很忙，但是我很开心。","Suīrán hěn máng, dànshì wǒ hěn kāixīn.","Хотя я занят(а), я счастлив(а)."],["虽然下雨，但是他们继续比赛。","Suīrán xiàyǔ, dànshì tāmen jìxù bǐsài.","Хотя идёт дождь, они продолжают соревнование."]],"Вторая часть должна создавать ожидаемый контраст с первой.","Продолжи: 虽然很贵，……",["但是质量很好。","因为所以买。","所以但是贵。"],0,"虽然 вводит уступку, 但是 — противопоставление."],
[3,"Дополнение с 得","得 вводит оценку того, как выполняется действие: быстро, хорошо, понятно и т. п.","Глагол + 得 + описание", [["他说得很快。","Tā shuō de hěn kuài.","Он говорит очень быстро."],["她唱得很好。","Tā chàng de hěn hǎo.","Она очень хорошо поёт."]],"Если после глагола есть прямое дополнение, часто повторяют глагол перед 得: 他汉语说得很好。","Как сказать «Она пишет красиво»?",["她写得很漂亮。","她得写很漂亮。","她写很得漂亮。"],0,"得 ставится после глагола и вводит характеристику действия."],
[4,"Конструкция 把","把 выносит объект перед глаголом, когда говорящий показывает, что с ним сделали или как его изменили.","Подлежащее + 把 + объект + глагол + результат/место", [["我把书放在桌子上。","Wǒ bǎ shū fàng zài zhuōzi shàng.","Я положил(а) книгу на стол."],["请把门关上。","Qǐng bǎ mén guān shàng.","Пожалуйста, закрой дверь."]],"После глагола обычно указывается результат, направление, место или другой обязательный элемент. Простого 把 + глагол часто недостаточно.","Выбери правильное предложение.",["我把作业做完了。","我把做完了作业。","把我作业做。"],0,"把 ставит объект перед действием, которое с ним совершают."],
[4,"Пассивная конструкция 被","被 показывает, что действие направлено на подлежащее; часто переводится пассивной формой.","Получатель действия + 被 + исполнитель + глагол", [["我的手机被弟弟拿走了。","Wǒ de shǒujī bèi dìdi názǒu le.","Мой телефон забрал младший брат."],["窗户被风吹开了。","Chuānghu bèi fēng chuīkāi le.","Окно было распахнуто ветром."]],"Исполнитель после 被 может опускаться, если он неизвестен или неважен.","Как сказать «Мою сумку украли»?",["我的包被偷了。","我被包偷了。","我的包偷被了。"],0,"被 вводит действие, которое испытывает подлежащее."],
[4,"Одновременные действия 一边…一边…","Конструкция описывает два действия, происходящие одновременно.","一边 + действие 1，一边 + действие 2", [["她一边听音乐，一边做作业。","Tā yìbiān tīng yīnyuè, yìbiān zuò zuòyè.","Она слушает музыку и одновременно делает домашнее задание."],["我喜欢一边走路一边聊天。","Wǒ xǐhuan yìbiān zǒulù yìbiān liáotiān.","Мне нравится разговаривать во время прогулки."]],"Обе части относятся к одному времени; часто подразумевается один и тот же исполнитель.","Как сказать «Он ест и смотрит телевизор одновременно»?",["他一边吃饭，一边看电视。","他一边吃饭，所以看电视。","他吃饭一边电视看。"],0,"一边…一边… = делать два дела одновременно."],
[4,"Изменение степени 越来越","越来越 показывает постепенное усиление или изменение признака: «всё более…», «всё сильнее…».","越来越 + прилагательное/глагол состояния", [["天气越来越冷了。","Tiānqì yuèláiyuè lěng le.","Погода становится всё холоднее."],["我的中文越来越好了。","Wǒ de Zhōngwén yuèláiyuè hǎo le.","Мой китайский становится всё лучше."]],"Не ставь 很 между 越来越 и прилагательным. Конструкция подчёркивает процесс изменения.","Как сказать «Он говорит всё быстрее»?",["他说得越来越快。","他说越来越得快。","越来越他快说。"],0,"越来越 ставится перед признаком, который постепенно усиливается."]
];
const dialogs=[
["cafe","☕","В кафе","Заказать напиток и еду, уточнить размер и оплату.",[["顾客","你好，我想要一杯拿铁。","Nǐ hǎo, wǒ xiǎng yào yì bēi nátiě.","Здравствуйте, я бы хотел(а) латте."],["店员","好的。要大杯还是中杯？","Hǎo de. Yào dà bēi háishi zhōng bēi?","Хорошо. Большой или средний?"],["顾客","中杯就好。可以少放一点糖吗？","Zhōng bēi jiù hǎo. Kěyǐ shǎo fàng yìdiǎn táng ma?","Средний подойдёт. Можно чуть меньше сахара?"],["店员","没问题。一共二十八块。","Méi wèntí. Yígòng èrshíbā kuài.","Без проблем. Всего 28 юаней."]],"我想要… — я хочу…; 不加糖 — без сахара; 带走 — с собой."],
["shop","🛍","В магазине","Узнать цену, попросить другой размер и оплатить.",[["顾客","你好，请问这个多少钱？","Nǐ hǎo, qǐngwèn zhège duōshao qián?","Здравствуйте, сколько это стоит?"],["店员","这个一百二十块。","Zhège yìbǎi èrshí kuài.","Это стоит 120 юаней."],["顾客","有大一点的尺码吗？","Yǒu dà yìdiǎn de chǐmǎ ma?","Есть размер побольше?"],["店员","有的。你可以试一下。","Yǒu de. Nǐ kěyǐ shì yíxià.","Да. Можете примерить."],["顾客","我就买这个。可以扫码支付吗？","Wǒ jiù mǎi zhège. Kěyǐ sǎomǎ zhīfù ma?","Я возьму это. Можно оплатить по QR-коду?"]],"多少钱 — сколько стоит; 试 — примерять; 尺码 — размер."],
["university","📚","В университете","Познакомиться с однокурсником и обсудить расписание.",[["A","你好，你也是中文系的学生吗？","Nǐ hǎo, nǐ yě shì Zhōngwén xì de xuésheng ma?","Привет! Ты тоже студент(ка) отделения китайского?"],["B","是的，我今年一年级。你呢？","Shì de, wǒ jīnnián yì niánjí. Nǐ ne?","Да, я на первом курсе. А ты?"],["A","我也是。你今天有汉语课吗？","Wǒ yě shì. Nǐ jīntiān yǒu Hànyǔ kè ma?","Я тоже. У тебя сегодня есть китайский?"],["B","有，下午两点在三号教室。","Yǒu, xiàwǔ liǎng diǎn zài sān hào jiàoshì.","Да, в два часа в аудитории номер три."],["A","太好了，我们一起去吧！","Tài hǎo le, wǒmen yìqǐ qù ba!","Отлично, пойдём вместе!"]],"一年级 — первый курс; 教室 — аудитория; 一起 — вместе."],
["meeting","♡","Знакомство","Представиться, спросить имя и откуда человек.",[["A","你好！我叫安娜。你叫什么名字？","Nǐ hǎo! Wǒ jiào Ānnà. Nǐ jiào shénme míngzi?","Привет! Меня зовут Анна. Как тебя зовут?"],["B","我叫小明。很高兴认识你。","Wǒ jiào Xiǎomíng. Hěn gāoxìng rènshi nǐ.","Меня зовут Сяомин. Очень приятно."],["A","我也很高兴。你是哪国人？","Wǒ yě hěn gāoxìng. Nǐ shì nǎ guó rén?","Мне тоже приятно. Ты из какой страны?"],["B","我是中国人。你呢？","Wǒ shì Zhōngguó rén. Nǐ ne?","Я из Китая. А ты?"],["A","我是俄罗斯人。","Wǒ shì Éluósī rén.","Я из России."]],"我叫… — меня зовут…; 很高兴认识你 — приятно познакомиться."],
["travel","✈","Путешествия","Спросить дорогу и уточнить, как добраться до станции.",[["游客","请问，地铁站怎么走？","Qǐngwèn, dìtiě zhàn zěnme zǒu?","Извините, как пройти к станции метро?"],["路人","一直往前走，然后向左拐。","Yìzhí wǎng qián zǒu, ránhòu xiàng zuǒ guǎi.","Идите прямо, затем поверните налево."],["游客","走路要多长时间？","Zǒulù yào duō cháng shíjiān?","Сколько времени идти пешком?"],["路人","大概五分钟。就在前面。","Dàgài wǔ fēnzhōng. Jiù zài qiánmiàn.","Примерно пять минут. Прямо впереди."],["游客","太感谢了！","Tài gǎnxiè le!","Большое спасибо!"]],"地铁站 — станция метро; 一直往前 — всё время прямо; 向左 — налево."]
,

["restaurant","餐","В ресторане","Выбрать блюдо, уточнить состав и попросить счёт.",[["顾客","请给我菜单。","Qǐng gěi wǒ càidān.","Дайте мне, пожалуйста, меню."],["服务员","好的。这是菜单。","Hǎo de. Zhè shì càidān.","Хорошо. Вот меню."],["顾客","这个菜里面有花生吗？","Zhège cài lǐmiàn yǒu huāshēng ma?","В этом блюде есть арахис?"],["服务员","没有。您要喝什么？","Méiyǒu. Nín yào hē shénme?","Нет. Что будете пить?"],["顾客","一杯水，谢谢。吃完以后请给我账单。","Yì bēi shuǐ, xièxie. Chī wán yǐhòu qǐng gěi wǒ zhàngdān.","Стакан воды, спасибо. После еды принесите счёт."]],"菜单 — меню; 里面 — внутри; 账单 — счёт."],
["hotel","住","В отеле","Заселиться, назвать бронь и уточнить время завтрака.",[["客人","你好，我预订了一个房间。","Nǐ hǎo, wǒ yùdìng le yí ge fángjiān.","Здравствуйте, я забронировал(а) номер."],["前台","请问，您叫什么名字？","Qǐngwèn, nín jiào shénme míngzi?","Подскажите, как вас зовут?"],["客人","我叫安娜。这是我的护照。","Wǒ jiào Ānnà. Zhè shì wǒ de hùzhào.","Меня зовут Анна. Вот мой паспорт."],["前台","好的。早餐是七点到十点。","Hǎo de. Zǎocān shì qī diǎn dào shí diǎn.","Хорошо. Завтрак с семи до десяти."],["客人","谢谢。房间在几楼？","Xièxie. Fángjiān zài jǐ lóu?","Спасибо. На каком этаже номер?"]],"预订 — бронировать; 房间 — номер/комната; 几楼 — какой этаж."],
["taxi","车","Такси","Назвать адрес, уточнить маршрут и стоимость поездки.",[["乘客","师傅，请去这个地址。","Shīfu, qǐng qù zhège dìzhǐ.","Водитель, пожалуйста, отвезите по этому адресу."],["司机","好的。您赶时间吗？","Hǎo de. Nín gǎn shíjiān ma?","Хорошо. Вы торопитесь?"],["乘客","不着急。大概要多久？","Bù zháojí. Dàgài yào duō jiǔ?","Не тороплюсь. Сколько примерно ехать?"],["司机","大概二十分钟。","Dàgài èrshí fēnzhōng.","Примерно двадцать минут."],["乘客","到了以后请告诉我。","Dào le yǐhòu qǐng gàosu wǒ.","Когда приедем, пожалуйста, скажите мне."]],"地址 — адрес; 赶时间 — торопиться; 到了以后 — после прибытия."],
["airport","机场","В аэропорту","Найти стойку регистрации, узнать выход и время посадки.",[["旅客","请问，国际航班在哪儿办理登机？","Qǐngwèn, guójì hángbān zài nǎr bànlǐ dēngjī?","Где регистрация на международные рейсы?"],["工作人员","在前面右边。","Zài qiánmiàn yòubiān.","Впереди справа."],["旅客","我的登机口是几号？","Wǒ de dēngjīkǒu shì jǐ hào?","Какой номер у моего выхода на посадку?"],["工作人员","请看一下您的登机牌。","Qǐng kàn yíxià nín de dēngjīpái.","Посмотрите, пожалуйста, ваш посадочный талон."],["旅客","谢谢，我现在过去。","Xièxie, wǒ xiànzài guòqù.","Спасибо, я сейчас пойду туда."]],"国际航班 — международный рейс; 登机口 — выход на посадку; 登机牌 — посадочный талон."],
["directions","路","Как спросить дорогу","Уточнить расположение места и понять объяснение маршрута.",[["游客","请问，附近有银行吗？","Qǐngwèn, fùjìn yǒu yínháng ma?","Извините, поблизости есть банк?"],["路人","有，在那个路口左转。","Yǒu, zài nàge lùkǒu zuǒzhuǎn.","Да, на том перекрёстке поверните налево."],["游客","离这里远吗？","Lí zhèlǐ yuǎn ma?","Это далеко отсюда?"],["路人","不远，走五分钟就到了。","Bù yuǎn, zǒu wǔ fēnzhōng jiù dào le.","Недалеко, дойдёте за пять минут."],["游客","明白了，谢谢！","Míngbai le, xièxie!","Понятно, спасибо!"]],"附近 — поблизости; 路口 — перекрёсток; 左转 — повернуть налево."],
["plans","约","Договориться о встрече","Предложить время и место, согласовать планы.",[["A","你星期六有空吗？","Nǐ xīngqīliù yǒu kòng ma?","Ты свободен(на) в субботу?"],["B","有啊。怎么了？","Yǒu a. Zěnme le?","Да. А что?"],["A","我们一起去看电影吧。","Wǒmen yìqǐ qù kàn diànyǐng ba.","Давай вместе сходим в кино."],["B","好主意！几点见面？","Hǎo zhǔyi! Jǐ diǎn jiànmiàn?","Отличная идея! Во сколько встретимся?"],["A","下午三点在电影院门口见。","Xiàwǔ sān diǎn zài diànyǐngyuàn ménkǒu jiàn.","Встретимся в три у входа в кинотеатр."]],"有空 — быть свободным; 好主意 — хорошая идея; 见面 — встретиться."],
["phone","手机","Общение по телефону","Попросить перезвонить, уточнить, слышно ли собеседника.",[["A","喂，你现在方便说话吗？","Wèi, nǐ xiànzài fāngbiàn shuōhuà ma?","Алло, тебе сейчас удобно говорить?"],["B","可以，我在听。","Kěyǐ, wǒ zài tīng.","Да, я слушаю."],["A","不好意思，这里信号不太好。","Bù hǎoyìsi, zhèlǐ xìnhào bú tài hǎo.","Извини, здесь не очень хороший сигнал."],["B","没关系。你等一下，我换个地方。","Méi guānxi. Nǐ děng yíxià, wǒ huàn ge dìfang.","Ничего страшного. Подожди, я перейду в другое место."],["A","好，听清楚了。","Hǎo, tīng qīngchu le.","Хорошо, теперь слышно отчётливо."]],"喂 — алло; 方便 — удобно; 信号 — сигнал; 换个地方 — перейти в другое место."],
["library","图书馆","В библиотеке","Найти нужную книгу, узнать правила и срок возврата.",[["学生","请问，中文书在哪个书架？","Qǐngwèn, Zhōngwén shū zài nǎge shūjià?","Где полка с книгами на китайском?"],["管理员","在二楼左边。","Zài èr lóu zuǒbiān.","На втором этаже слева."],["学生","这本书可以借多久？","Zhè běn shū kěyǐ jiè duō jiǔ?","На какой срок можно взять эту книгу?"],["管理员","可以借两个星期。","Kěyǐ jiè liǎng ge xīngqī.","Можно взять на две недели."],["学生","好的，谢谢您的帮助。","Hǎo de, xièxie nín de bāngzhù.","Хорошо, спасибо за помощь."]],"书架 — книжная полка; 借 — брать/давать взаймы; 两个星期 — две недели."]
];
const families={
"你":["nǐ","ты; вы",[["你好","nǐ hǎo","привет"],["你们","nǐmen","вы (мн. число)"],["你的","nǐ de","твой; твоя"],["你我","nǐ wǒ","ты и я"]]],
"好":["hǎo","хороший; хорошо",[["你好","nǐ hǎo","привет"],["好吃","hǎochī","вкусный"],["好看","hǎokàn","красивый"],["好听","hǎotīng","приятный на слух"],["爱好","àihào","увлечение"]]],
"我":["wǒ","я; меня",[["我们","wǒmen","мы"],["我的","wǒ de","мой; моя"],["我国","wǒguó","наша страна"],["自我","zìwǒ","собственное «я»"]]],
"学":["xué","учиться; изучать",[["学习","xuéxí","учиться"],["学生","xuésheng","студент"],["学校","xuéxiào","школа"],["大学","dàxué","университет"],["数学","shùxué","математика"],["文学","wénxué","литература"],["学期","xuéqī","семестр"],["同学","tóngxué","однокурсник"]]],
"生":["shēng","жизнь; рождаться",[["学生","xuésheng","студент"],["生日","shēngrì","день рождения"],["生活","shēnghuó","повседневная жизнь"],["生气","shēngqì","сердиться"],["先生","xiānsheng","господин"],["医生","yīshēng","врач"],["发生","fāshēng","происходить"]]],
"中":["zhōng","середина; центр",[["中国","Zhōngguó","Китай"],["中文","Zhōngwén","китайский язык"],["中间","zhōngjiān","середина"],["中学","zhōngxué","средняя школа"],["中午","zhōngwǔ","полдень"],["中心","zhōngxīn","центр"]]],
"国":["guó","страна",[["中国","Zhōngguó","Китай"],["美国","Měiguó","США"],["英国","Yīngguó","Великобритания"],["外国","wàiguó","иностранная страна"],["国家","guójiā","государство"],["国际","guójì","международный"]]],
"人":["rén","человек",[["中国人","Zhōngguórén","китаец; китаянка"],["别人","biérén","другие люди"],["朋友","péngyou","друг"],["家人","jiārén","члены семьи"],["男人","nánrén","мужчина"],["女人","nǚrén","женщина"]]],
"水":["shuǐ","вода",[["水果","shuǐguǒ","фрукты"],["水杯","shuǐbēi","стакан"],["开水","kāishuǐ","кипячёная вода"],["水平","shuǐpíng","уровень"],["喝水","hē shuǐ","пить воду"]]],
"火":["huǒ","огонь",[["火车","huǒchē","поезд"],["火山","huǒshān","вулкан"],["火锅","huǒguō","хого"],["火灾","huǒzāi","пожар"],["火腿","huǒtuǐ","ветчина"]]],
"日":["rì","солнце; день",[["生日","shēngrì","день рождения"],["日记","rìjì","дневник"],["日本","Rìběn","Япония"],["日子","rìzi","дни"],["日期","rìqī","дата"]]],
"月":["yuè","луна; месяц",[["月亮","yuèliang","луна"],["月饼","yuèbǐng","лунный пряник"],["一月","yī yuè","январь"],["月底","yuèdǐ","конец месяца"]]],
"明":["míng","светлый; ясный",[["明天","míngtiān","завтра"],["明白","míngbai","понимать"],["明年","míngnián","следующий год"],["说明","shuōmíng","объяснять"],["文明","wénmíng","цивилизация"]]],
"女":["nǚ","женщина",[["女儿","nǚ'ér","дочь"],["女人","nǚrén","женщина"],["女孩","nǚhái","девочка"],["女生","nǚshēng","девушка; студентка"],["女朋友","nǚ péngyou","девушка; подруга"]]],
"子":["zǐ / zi","ребёнок; суффикс",[["孩子","háizi","ребёнок"],["儿子","érzi","сын"],["桌子","zhuōzi","стол"],["椅子","yǐzi","стул"],["杯子","bēizi","чашка"],["帽子","màozi","шапка"]]],
"口":["kǒu","рот; вход; счётное слово",[["人口","rénkǒu","население"],["门口","ménkǒu","вход"],["口语","kǒuyǔ","устная речь"],["出口","chūkǒu","выход"],["入口","rùkǒu","вход"]]],
"手":["shǒu","рука",[["手机","shǒujī","мобильный телефон"],["手表","shǒubiǎo","наручные часы"],["手工","shǒugōng","ручная работа"],["选手","xuǎnshǒu","участник"],["助手","zhùshǒu","помощник"]]],
"心":["xīn","сердце; душа",[["开心","kāixīn","радоваться"],["小心","xiǎoxīn","осторожно"],["关心","guānxīn","заботиться"],["放心","fàngxīn","не беспокоиться"],["中心","zhōngxīn","центр"]]],
"电":["diàn","электричество",[["电话","diànhuà","телефон"],["电脑","diànnǎo","компьютер"],["电视","diànshì","телевизор"],["电影","diànyǐng","фильм"],["电车","diànchē","трамвай"],["电池","diànchí","батарейка"]]],
"车":["chē","транспорт",[["火车","huǒchē","поезд"],["汽车","qìchē","автомобиль"],["自行车","zìxíngchē","велосипед"],["公交车","gōngjiāochē","автобус"],["车站","chēzhàn","станция"]]],
"书":["shū","книга",[["书店","shūdiàn","книжный магазин"],["书包","shūbāo","рюкзак"],["图书馆","túshūguǎn","библиотека"],["看书","kàn shū","читать"],["书法","shūfǎ","каллиграфия"]]],
"饭":["fàn","еда; рис",[["吃饭","chīfàn","есть"],["米饭","mǐfàn","варёный рис"],["饭店","fàndiàn","ресторан"],["早饭","zǎofàn","завтрак"],["午饭","wǔfàn","обед"],["晚饭","wǎnfàn","ужин"]]],
"茶":["chá","чай",[["茶水","cháshuǐ","чай"],["茶叶","cháyè","чайные листья"],["茶馆","cháguǎn","чайная"],["绿茶","lǜchá","зелёный чай"],["红茶","hóngchá","чёрный чай"]]],
"爱":["ài","любить; любовь",[["爱好","àihào","увлечение"],["爱情","àiqíng","любовь"],["可爱","kě'ài","милый"],["爱人","àirén","любимый человек; супруг(а)"],["热爱","rè'ài","горячо любить"]]]
};
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
let activeGrammarTopic="all";
const grammarTopicMap={
"Порядок слов S + V + O":"sentence",
"Связка 是":"sentence",
"Принадлежность 的":"nouns",
"Счётное слово 个":"nouns",
"Вопрос с 吗":"questions",
"Вопросительные слова 什么 и 谁":"questions",
"Отрицание 不 и 没":"negative",
"Местонахождение 在":"places",
"Опыт: 过":"experience",
"Сравнение с 比":"comparison",
"Изменение степени 越来越":"comparison",
"Причина и результат 因为…所以…":"complex",
"Уступка 虽然…但是…":"complex",
"Одновременные действия 一边…一边…":"complex",
"Дополнение с 得":"complements",
"Конструкция 把":"complements",
"Пассивная конструкция 被":"complements"
};
const grammarTopics=[
{id:"all",title:"Вся грамматика",desc:"Все правила курса",mark:"文"},
{id:"sentence",title:"Строение предложения",desc:"Порядок слов и 是",mark:"主"},
{id:"nouns",title:"Предметы и принадлежность",desc:"的 и счётные слова",mark:"的"},
{id:"questions",title:"Как задавать вопросы",desc:"吗, 什么 и 谁",mark:"吗"},
{id:"negative",title:"Отрицание",desc:"Разница между 不 и 没",mark:"不"},
{id:"places",title:"Место и расположение",desc:"Где находится предмет",mark:"在"},
{id:"experience",title:"Опыт и события",desc:"Как говорить о своём опыте",mark:"过"},
{id:"comparison",title:"Сравнение и изменения",desc:"比 и 越来越",mark:"比"},
{id:"complex",title:"Связные предложения",desc:"Причина, уступка, действия",mark:"因"},
{id:"complements",title:"Действие и его результат",desc:"得, 把 и 被",mark:"得"}
];
function renderGrammarTopics(){
const root=$("clGrammarTopics");if(!root)return;root.replaceChildren();
grammarTopics.forEach(topic=>{
const count=topic.id==="all"?grammar.length:grammar.filter(g=>grammarTopicMap[g[1]]===topic.id).length;
const btn=make("button","cl-topic-card");btn.type="button";btn.classList.toggle("active",topic.id===activeGrammarTopic);
btn.append(make("span","cl-topic-card-mark",topic.mark),make("span","cl-topic-card-count",String(count).padStart(2,"0")),make("strong","",topic.title),make("small","",topic.desc));
btn.addEventListener("click",()=>{activeGrammarTopic=topic.id;renderGrammarTopics();renderGrammar();});
root.append(btn);
});
}
function renderGrammar(){
const root=$("clGrammarList");if(!root)return;root.replaceChildren();
const lv=$("clGrammarLevel").value,q=normalizeLibrarySearch($("clGrammarSearch").value);
const rows=grammar.filter(g=>{
const hay=normalizeLibrarySearch([g[1],g[2],g[3],g[5],g[6],...g[4].flat()].join(" "));
const topicOk=activeGrammarTopic==="all"||grammarTopicMap[g[1]]===activeGrammarTopic;
return (lv==="all"||String(g[0])===lv)&&topicOk&&(!q||hay.includes(q));
});
if(!rows.length){root.append(make("div","cl-empty","Ничего не найдено. Попробуй изменить тему, уровень или запрос."));return;}
root.append(make("p","cl-results-count","Найдено конструкций: "+rows.length));
rows.forEach(g=>{const c=make("article","cl-grammar-card"),top=make("div","cl-grammar-top"),h=make("div");h.append(make("h3","",g[1]),make("p","cl-grammar-summary",g[2]));top.append(h,make("span","cl-level-tag","HSK "+g[0]));c.append(top,make("div","cl-formula",g[3]));const ex=make("div","cl-example-list");g[4].forEach(x=>{const e=make("div","cl-example");e.append(make("div","cl-example-zh",x[0]),make("div","cl-example-py",x[1]),make("div","cl-example-ru",x[2]));ex.append(e);});c.append(ex,make("div","cl-note","Запомни: "+g[5]));const practice=make("div","cl-exercise");practice.append(make("div","cl-exercise-title","Проверь себя"),make("p","cl-exercise-question",g[6]));const opts=make("div","cl-exercise-options"),fb=make("p","cl-exercise-feedback","Выбери один вариант ответа.");g[7].forEach((v,i)=>{const btn=make("button","cl-exercise-option",v);btn.type="button";btn.addEventListener("click",()=>{if(opts.dataset.done)return;opts.dataset.done="1";[...opts.children].forEach((n,j)=>{n.disabled=true;if(j===g[8])n.classList.add("is-correct");else if(j===i)n.classList.add("is-wrong");});fb.textContent=(i===g[8]?"Верно! ":"Не совсем. ")+g[9];});opts.append(btn);});practice.append(opts,fb);c.append(practice);root.append(c);});
}
let active="cafe",activeDialogueTopic="all";
const dialogueTopics=[
{id:"all",title:"Все ситуации",desc:"Полный разговорник",mark:"文",ids:dialogs.map(d=>d[0])},
{id:"people",title:"Знакомство и общение",desc:"Представиться, договориться, позвонить",mark:"你好",ids:["meeting","plans","phone"]},
{id:"study",title:"Учёба",desc:"Университет и библиотека",mark:"学",ids:["university","library"]},
{id:"food",title:"Кафе и рестораны",desc:"Заказ еды, меню и оплата",mark:"吃",ids:["cafe","restaurant"]},
{id:"shopping",title:"Покупки",desc:"Цена, размер и оплата",mark:"买",ids:["shop"]},
{id:"travel",title:"Город и транспорт",desc:"Дорога, такси и аэропорт",mark:"行",ids:["travel","directions","taxi","airport"]},
{id:"stay",title:"Отель и проживание",desc:"Заселение и номер",mark:"住",ids:["hotel"]}
];
function normalizeLibrarySearch(value){return String(value||"").toLocaleLowerCase("ru").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ё/g,"е").replace(/\s+/g," ").trim();}
function dialogueMatches(d,q){return !q||normalizeLibrarySearch([d[2],d[3],d[5],...d[4].flat()].join(" ")).includes(q);}
function renderDialogueTopics(){
const root=$("clDialogueTopics");if(!root)return;root.replaceChildren();
dialogueTopics.forEach(topic=>{
const count=topic.ids.length,btn=make("button","cl-dialogue-topic-card");btn.type="button";btn.classList.toggle("active",topic.id===activeDialogueTopic);
btn.append(make("span","cl-dialogue-topic-mark",topic.mark),make("span","cl-dialogue-topic-count",String(count).padStart(2,"0")),make("strong","",topic.title),make("small","",topic.desc));
btn.addEventListener("click",()=>{activeDialogueTopic=topic.id;renderDialogueTopics();renderDialogs();renderDialogue();});
root.append(btn);
});
}
function renderDialogs(){
const cats=$("clDialogueCategories");if(!cats)return;cats.replaceChildren();
const q=normalizeLibrarySearch($("clDialogueSearch")?.value||"");
const topic=dialogueTopics.find(t=>t.id===activeDialogueTopic)||dialogueTopics[0];
const shown=dialogs.filter(d=>topic.ids.includes(d[0])&&dialogueMatches(d,q));
if(!shown.length){cats.append(make("div","cl-empty","Ничего не найдено. Попробуй другое слово или выбери другую тему."));return;}
if(!shown.some(d=>d[0]===active))active=shown[0][0];
shown.forEach(d=>{
const btn=make("button","cl-category-button");btn.type="button";btn.classList.toggle("active",d[0]===active);
btn.append(make("span","cl-category-number",String(dialogs.indexOf(d)+1).padStart(2,"0")),make("strong","",d[2]),make("small","",d[3]));
btn.addEventListener("click",()=>{active=d[0];renderDialogs();renderDialogue();});
cats.append(btn);
});
}
function speak(text){if(!("speechSynthesis"in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="zh-CN";u.rate=.88;speechSynthesis.speak(u);}
function renderDialogue(){const root=$("clDialogueContent"),d=dialogs.find(x=>x[0]===active);if(!root)return;root.replaceChildren();const q=($("clDialogueSearch")?.value||"").trim().toLocaleLowerCase("ru");if(!d||!dialogueMatches(d,q)){root.append(make("div","cl-empty","Выбери ситуацию из списка выше."));return;}root.append(make("span","cl-kicker","РАЗГОВОРНАЯ СИТУАЦИЯ"),make("h3","",d[2]),make("p","cl-dialogue-intro",d[3]));d[4].forEach(line=>{const row=make("div","cl-dialogue-line"),speaker=make("span","cl-speaker",line[0]),body=make("div"),audio=make("button","cl-audio-button","Слушать");body.append(make("div","cl-dialogue-zh",line[1]),make("div","cl-dialogue-pinyin",line[2]),make("div","cl-dialogue-translation",line[3]));audio.type="button";audio.addEventListener("click",()=>speak(line[1]));row.append(speaker,body,audio);root.append(row);});root.append(make("div","cl-dialogue-footer","Полезные выражения: "+d[5]),make("p","small","Нажми «Слушать», чтобы услышать китайское произношение."));}
function learned(){
const chars=new Set();
try{const a=JSON.parse(localStorage.getItem("learnedCharacters")||"[]");if(Array.isArray(a))a.forEach(x=>[...String(x)].forEach(ch=>{if(/\p{Script=Han}/u.test(ch))chars.add(ch);}));}catch(e){}
try{if(typeof getLearnedCoachVocabularyRecords==="function")getLearnedCoachVocabularyRecords().forEach(x=>[...(x.hanzi||"")].forEach(ch=>{if(/\p{Script=Han}/u.test(ch))chars.add(ch);}));}catch(e){}
return [...chars];
}
function renderChips(){
const root=$("clLearnedCharacterChips");if(!root)return;root.replaceChildren();const chars=learned(),all=[...new Set([...Object.keys(families),...chars])];
root.append(make("div","cl-character-group-label","ТВОИ ИЗУЧЕННЫЕ"));
if(!chars.length)root.append(make("p","cl-character-empty","Пока нет отмеченных знаков — начни с популярных ниже."));else{const row=make("div","cl-character-chip-row");chars.slice(0,40).forEach(ch=>{const btn=make("button","cl-character-chip",ch);btn.type="button";btn.addEventListener("click",()=>select(ch));row.append(btn);});root.append(row);}
root.append(make("div","cl-character-group-label","ПОПУЛЯРНЫЕ ИЕРОГЛИФЫ"));const starter=make("div","cl-character-chip-row");all.forEach(ch=>{const btn=make("button","cl-character-chip",ch);btn.type="button";btn.addEventListener("click",()=>select(ch));starter.append(btn);});root.append(starter);
}
function showWords(ch){
const root=$("clWordBuildingResults"),hint=$("clCharacterHint");root.replaceChildren();
const entries=new Map();
const add=(word,pinyin,translation)=>{
if(!word||!word.includes(ch)||[...word].length<2||!translation)return;
entries.set(word,{word,pinyin:pinyin||"",translation});
};
const preset=families[ch];
if(preset)(preset[2]||[]).forEach(w=>add(w[0],w[1],w[2]));
try{if(typeof wordDictionary!=="undefined")Object.entries(wordDictionary).forEach(([word,e])=>add(word,e.p,e.m));}catch(e){}
try{if(typeof databaseWordDictionary!=="undefined")Object.entries(databaseWordDictionary).forEach(([word,e])=>add(word,e.p,e.m));}catch(e){}
const words=[...entries.values()].sort((a,b)=>[...a.word].length-[...b.word].length||a.word.localeCompare(b.word,"zh"));
const charInfo=preset||((typeof databaseCharDictionary!=="undefined"&&databaseCharDictionary[ch])?[databaseCharDictionary[ch].p,databaseCharDictionary[ch].m]:null);
if(!words.length){
hint.textContent="В доступном словаре пока не нашлось слов с этим иероглифом.";
root.append(make("div","cl-empty","Для «"+ch+"» пока нет подходящей подборки. Большой словарь может ещё загружаться — попробуй немного позже или выбери другой знак."));
return;
}
hint.textContent="Найдено слов: "+words.length+". Показаны сочетания из словаря PhotoChinese.";
const card=make("section","cl-word-result-card"),head=make("div","cl-word-result-heading"),info=make("div");
head.append(make("strong","cl-word-result-character",ch));info.append(make("h3","",ch+" · слова с этим иероглифом"),make("p","small",(charInfo?(charInfo[0]+" · "+charInfo[1]):"Иероглиф встречается в следующих словах.")));head.append(info);card.append(head);
const grid=make("div","cl-word-grid");
words.slice(0,120).forEach(w=>{const item=make("div","cl-word-item");item.append(make("strong","",w.word),make("small","",w.pinyin),make("span","",w.translation));grid.append(item);});
card.append(grid);root.append(card);
}
function select(ch){$("clCharacterInput").value=ch;document.querySelectorAll(".cl-character-chip").forEach(b=>b.classList.toggle("active",b.textContent===ch));showWords(ch);}
$("clGrammarLevel")?.addEventListener("change",renderGrammar);
$("clGrammarSearch")?.addEventListener("input",()=>{renderGrammar();syncSearchClear("clGrammarSearch");});
$("clDialogueSearch")?.addEventListener("input",()=>{renderDialogs();renderDialogue();syncSearchClear("clDialogueSearch");});
function syncSearchClear(id){const input=$(id),btn=$(id+"Clear");if(btn)btn.hidden=!input.value;}
["clGrammarSearch","clDialogueSearch"].forEach(id=>{const input=$(id),btn=$(id+"Clear");if(!input||!btn)return;btn.addEventListener("click",()=>{input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));input.focus();});syncSearchClear(id);});
$("clCharacterSearch")?.addEventListener("click",()=>{const ch=$("clCharacterInput").value.trim();if(ch)select([...ch][0]);else $("clCharacterHint").textContent="Сначала введи один китайский иероглиф.";});
$("clCharacterInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("clCharacterSearch").click();});
$("clCharacterInput")?.addEventListener("input",e=>{const chars=[...e.target.value.trim()];if(chars.length>1)e.target.value=chars[0];});
window.addEventListener("storage",renderChips);
window.addEventListener("photoChineseDataLoaded",renderChips);
window.addEventListener("photoChineseDictionaryReady",()=>{renderChips();const ch=$("clCharacterInput").value.trim();if(ch)showWords([...ch][0]);});
renderGrammarTopics();renderGrammar();renderDialogueTopics();renderDialogs();renderDialogue();renderChips();
if(!$("clCharacterInput").value.trim())select("学");

/* ===== Расширенный проводник иероглифов PhotoChinese ===== */
function initHanziExplorer(){
 const root=$("clHanziExplorer"); if(!root || root.dataset.ready==="1") return;
 root.dataset.ready="1";
 const search=$("clHanziSearch"), results=$("clHanziResults"), historyRoot=$("clHanziHistory"), favoritesRoot=$("clHanziFavorites"), similarRoot=$("clHanziSimilar");
 const HISTORY_KEY="photoChineseCharacterHistory";
 const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||"null");return v==null?fallback:v;}catch(_){return fallback;}};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));window.photoChineseSync?.();}catch(e){console.warn("Не удалось сохранить данные проводника:",e);}};
 const normalize=value=>String(value||"").toLocaleLowerCase("ru").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ü/g,"u").replace(/ё/g,"е").replace(/\s+/g," ").trim();
 const hanzi=value=>/\p{Script=Han}/u.test(String(value||""));
 const entries=new Map();
 const getInfo=ch=>{try{return typeof getCharInfo==="function"?getCharInfo(ch)||{}:{};}catch(_){return {};}};
 const collect=()=>{
  entries.clear();
  const sources=[];
  try{if(typeof databaseCharDictionary!=="undefined")sources.push(databaseCharDictionary);}catch(_){}
  try{if(typeof makeMeCharacterDictionary!=="undefined")sources.push(makeMeCharacterDictionary);}catch(_){}
  try{if(typeof charDictionary!=="undefined")sources.push(charDictionary);}catch(_){}
  sources.forEach(source=>Object.keys(source||{}).forEach(ch=>{
   if(!hanzi(ch)||[...ch].length!==1)return;
   const info=getInfo(ch);
   const radical=String(info.r||info.radical||"").split(/[—–-]/)[0].trim();
   const decomposition=String(info.c||info.decomposition||"");
   const parts=[...decomposition].filter(x=>hanzi(x)&&x!==ch);
   const pinyin=info.p||info.pinyin||info.pinyinMMH||"";
   const meaning=info.m||info.meaning||info.definition||"";
   const words=[];
   try{if(typeof wordDictionary!=="undefined")Object.entries(wordDictionary).forEach(([w,v])=>{if(w.includes(ch)&&words.length<12)words.push(w+" "+(v.p||"")+" "+(v.m||""));});}catch(_){}
   try{if(typeof databaseWordDictionary!=="undefined")Object.entries(databaseWordDictionary).forEach(([w,v])=>{if(w.includes(ch)&&words.length<12)words.push(w+" "+(v.p||"")+" "+(v.m||""));});}catch(_){}
   entries.set(ch,{ch,pinyin,meaning,radical,decomposition,parts,search:normalize([ch,pinyin,meaning,radical,decomposition,...words].join(" "))});
  }));
 };
 const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
 const openCharacter=ch=>{
  if(!hanzi(ch))return;
  const history=read(HISTORY_KEY,[]).filter(x=>x&&x.ch!==ch);
  history.unshift({ch,at:Date.now()});write(HISTORY_KEY,history.slice(0,30));
  const input=$("analysisInput"),button=$("analyzeText");
  if(input&&button){input.value=ch;button.click();$("analysisPanel")?.scrollIntoView({behavior:"smooth",block:"start"});}
  renderHistory();
  renderSimilar(ch);
 };
 const renderCards=(list,target,empty)=>{
  target.replaceChildren();
  if(!list.length){target.append(make("p","cl-explorer-empty",empty));return;}
  list.forEach(item=>{
   const card=make("button","cl-explorer-result");card.type="button";card.addEventListener("click",()=>openCharacter(item.ch));
   const symbol=make("strong","cl-explorer-symbol",item.ch),body=make("span","cl-explorer-result-body");
   body.append(make("b","",item.pinyin||"Пиньинь пока не найден"),make("span","",item.meaning||"Значение уточняется"));
   const meta=make("small","",[(item.radical?"Радикал "+item.radical:""),(item.parts.length?"Компоненты: "+item.parts.slice(0,4).join(" "):"")].filter(Boolean).join(" · "));
   card.append(symbol,body,meta);target.append(card);
  });
 };
 function renderHistory(){
  const rows=read(HISTORY_KEY,[]).filter(x=>x&&hanzi(x.ch)).slice(0,8).map(x=>entries.get(x.ch)||{ch:x.ch,pinyin:getInfo(x.ch).p||"",meaning:getInfo(x.ch).m||"",radical:"",parts:[]});
  renderCards(rows,historyRoot,"Здесь появятся недавно открытые иероглифы.");
 }
 function renderFavorites(){
  const saved=read("savedCharacters",[]).filter(hanzi).map(ch=>entries.get(ch)||{ch,pinyin:getInfo(ch).p||"",meaning:getInfo(ch).m||"",radical:"",parts:[]});
  renderCards(saved.slice(0,12),favoritesRoot,"Сохраняй знаки кнопкой «В коллекцию» в карточке разбора.");
 }
 function renderSimilar(ch){
  similarRoot.replaceChildren();
  if(!ch){similarRoot.append(make("p","cl-explorer-empty","Выбери иероглиф, чтобы увидеть похожие знаки."));return;}
  const current=entries.get(ch)||{ch,radical:"",parts:[]};
  const scored=[...entries.values()].filter(x=>x.ch!==ch).map(x=>{
   let score=0;
   if(current.radical&&x.radical===current.radical)score+=4;
   const overlap=x.parts.filter(p=>current.parts.includes(p)).length;score+=overlap*3;
   if(current.parts.includes(x.ch)||x.parts.includes(ch))score+=2;
   return {...x,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.ch.localeCompare(b.ch,"zh")).slice(0,10);
  const title=make("p","cl-explorer-similar-caption","Знаки с общим радикалом или графическими компонентами. Это подсказка для сравнения, а не утверждение об одинаковом происхождении.");
  similarRoot.append(title);
  if(!scored.length){similarRoot.append(make("p","cl-explorer-empty","В загруженной базе пока не нашлось достаточно похожих знаков."));return;}
  renderCards(scored,similarRoot,"");
 }
 function runSearch(){
  const q=normalize(search.value);
  if(!q){const recent=read(HISTORY_KEY,[]).slice(0,6).map(x=>entries.get(x.ch)).filter(Boolean);renderCards(recent,results,"Начни вводить иероглиф, пиньинь, радикал или значение.");return;}
  const found=[...entries.values()].filter(x=>x.search.includes(q)||normalize(x.ch)===q).sort((a,b)=>{
   const exactA=normalize(a.ch)===q?0:a.search.startsWith(q)?1:2,exactB=normalize(b.ch)===q?0:b.search.startsWith(q)?1:2;
   return exactA-exactB||a.ch.localeCompare(b.ch,"zh");
  }).slice(0,60);
  renderCards(found,results, "Ничего не найдено. Попробуй другой вариант написания, пиньинь без тонов или более короткое значение.");
 }
 search.addEventListener("input",runSearch);
 $("clHanziSearchClear")?.addEventListener("click",()=>{search.value="";runSearch();search.focus();});
 $("clHanziHistoryClear")?.addEventListener("click",()=>{write(HISTORY_KEY,[]);renderHistory();});
 $("clHanziFavoritesRefresh")?.addEventListener("click",renderFavorites);
 window.addEventListener("storage",()=>{renderHistory();renderFavorites();});
 window.addEventListener("photoChineseDataLoaded",()=>{collect();runSearch();renderHistory();renderFavorites();});
 window.addEventListener("photoChineseDictionaryReady",()=>{collect();runSearch();renderHistory();renderFavorites();});
 collect();runSearch();renderHistory();renderFavorites();renderSimilar("");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initHanziExplorer,{once:true});else initHanziExplorer();

})();