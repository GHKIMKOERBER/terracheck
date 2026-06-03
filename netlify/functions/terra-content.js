/* ═══════════════════════════════════════════════════════════════
   TERRA CONTENT · Single Source of Truth
   Alle Texte und die Render-Logik der Ergebnisseite.
   Wird genutzt von: index.html (Browser) UND save-result.js (Function)
   ═══════════════════════════════════════════════════════════════ */
(function(root){
  'use strict';

var eteamDefs = {
  empath:    { name:"Empath",    sub:"Führen durch Verbindung", icon:"🤝", color:"#5B21B6", bg:"#EDE9FE", border:"#C59ECA", sdtFocus:"Zugehörigkeit", kern:"Du nimmst wahr, was andere nicht sehen oder sagen. Deine Stärke ist emotionale Intelligenz und echte Verbindung." },
  experte:   { name:"Experte",   sub:"Führen durch Kompetenz",  icon:"🎯", color:"#1E3A6E", bg:"#DBEAFE", border:"#4F69B0", sdtFocus:"Wirksamkeit",   kern:"Du bist dann am stärksten, wenn du wirklich weißt, was du tust. Deine Stärke ist Tiefe, Präzision und fundiertes Können." },
  enthusiast:{ name:"Enthusiast",sub:"Führen durch Vision",     icon:"⚡", color:"#633806", bg:"#FEF3C7", border:"#F8AB26", sdtFocus:"Autonomie",    kern:"Du bringst Energie und Richtung in den Raum. Deine Stärke ist Begeisterungsfähigkeit und das Entfachen von Bewegung." },
  ernahrer:  { name:"Ernährer",  sub:"Führen durch Stabilität", icon:"🏗️", color:"#065F46", bg:"#D1FAE5", border:"#53B263", sdtFocus:"Wirksamkeit",   kern:"Du sorgst dafür, dass alles läuft und alle versorgt sind. Deine Stärke ist Zuverlässigkeit und das Schaffen von Sicherheit." }
};

var profiles = {
  "Firma-empath":     { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Firma liegt.", text:"Du spürst, was in deinem Unternehmen nicht stimmt, oft bevor andere es erkennen. Was dich gerade kostet: alleine der Motor zu sein, obwohl du eigentlich Verbindung willst. Du willst kein Einzelkämpfer sein, aber das System zwingt dich dazu.", nextstep:"Ein TERRA Clarity Call hilft dir zu verstehen, welche eine strukturelle Veränderung dich vom Motor zum Dirigenten macht." },
  "Firma-experte":    { headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Firma liegt.", text:"Du weißt, wie gutes Unternehmertum funktioniert. Was dich gerade kostet: das Gefühl, nicht voranzukommen, obwohl du alles gibst. Du hast das Wissen, aber irgendetwas blockiert die Wirkung.", nextstep:"Ein TERRA Clarity Call zeigt dir, welcher Hebel alles andere leichter macht, nicht mehr Einsatz, sondern den richtigen." },
  "Firma-enthusiast": { headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Firma liegt.", text:"Du hast eine klare Vision davon, wohin das Unternehmen soll. Was dich gerade kostet: die Lücke zwischen Begeisterung und Tagesgeschäft. Die Energie ist da, aber die Struktur hält nicht mit.", nextstep:"Ein TERRA Clarity Call hilft dir, deine Begeisterung in ein System zu übersetzen, das auch ohne deine ständige Präsenz trägt." },
  "Firma-ernahrer":   { headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Firma liegt.", text:"Du hältst das Unternehmen am Laufen, oft auf Kosten deiner eigenen Energie. Was dich gerade kostet: immer der Letzte zu sein, der sich ausruhen darf. Du trägst, aber wann trägst dich etwas?", nextstep:"Ein TERRA Clarity Call zeigt dir, wie ein System aussieht, das auch ohne dich als einzigen Träger stabil bleibt." },
  "Freude-empath":    { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Freude liegt.", text:"Du weißt genau, was andere brauchen. Aber weißt du noch, was du selbst willst? Was dich gerade kostet: ein Leben, das sich nach Fürsorge für andere anfühlt, aber die eigene Freude vermisst.", nextstep:"Ein TERRA Clarity Call hilft dir, die Frage zu beantworten, wofür du eigentlich aufstehst, nicht wofür du funktionierst." },
  "Freude-experte":   { headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Freude liegt.", text:"Du kannst viele Dinge sehr gut. Aber machst du auch die Dinge, die dich wirklich erfüllen? Was dich gerade kostet: Energie für Dinge aufzuwenden, die du beherrscht, aber nicht liebst.", nextstep:"Ein TERRA Clarity Call hilft dir, Können und Wollen wieder zu verbinden. Das ist der Unterschied zwischen Leistung und Lebendigkeit." },
  "Freude-enthusiast":{ headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Freude liegt.", text:"Du hast Feuer. Aber brennt es noch für das Richtige? Was dich gerade kostet: der Verdacht, dass die Energie, die du in dein Unternehmen steckst, nicht mehr aus echter Begeisterung kommt.", nextstep:"Ein TERRA Clarity Call hilft dir, diese Quelle wieder zu finden. Oder neu zu definieren, was dich wirklich antreibt." },
  "Freude-ernahrer":  { headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Freude liegt.", text:"Du trägst Verantwortung und machst das gut. Aber wann warst du zuletzt wirklich bei dir? Was dich gerade kostet: der stille Verdacht, dass du funktionierst, aber nicht lebst.", nextstep:"Ein TERRA Clarity Call gibt dir 45 Minuten, in denen du nur für dich nachschaust, was wirklich zählt." },
  "Familie-empath":   { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Familie liegt.", text:"Du bist für andere da. Aber bist du auch für die Menschen da, die dir am nächsten sind? Was dich gerade kostet: überall präsent zu sein und doch nirgendwo wirklich.", nextstep:"Ein TERRA Clarity Call hilft dir zu verstehen, wo echter Kontakt beginnt und was ihn gerade verhindert." },
  "Familie-experte":  { headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Familie liegt.", text:"Du weißt, wie man Dinge zum Laufen bringt. Aber Familie funktioniert anders als ein Unternehmen. Was dich gerade kostet: im privaten Bereich dieselbe Kontrolle haben zu wollen wie im beruflichen.", nextstep:"Ein TERRA Clarity Call hilft dir zu sehen, wo Loslassen mehr bringt als Kompetenz." },
  "Familie-enthusiast":{ headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Familie liegt.", text:"Deine Energie steckt andere an. Aber kommen die Menschen, die dir am nächsten sind, auch davon etwas ab? Was dich gerade kostet: dass deine Liebsten manchmal nur die Reste deiner Energie bekommen.", nextstep:"Ein TERRA Clarity Call hilft dir zu verstehen, was Präsenz bedeutet, nicht Performance." },
  "Familie-ernahrer": { headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Familie liegt.", text:"Du sorgst für deine Familie. Aber fühlen sie sich wirklich gesehen, nicht nur versorgt? Was dich gerade kostet: der Unterschied zwischen Liebe zeigen durch Tun und Liebe zeigen durch Dasein.", nextstep:"Ein TERRA Clarity Call schafft Klarheit darüber, was deine Familie wirklich von dir braucht." },
  "Freunde-empath":   { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Freunde liegt.", text:"Du weißt, wie wichtig echte Verbindung ist. Aber hast du selbst Menschen, die dich wirklich kennen? Was dich gerade kostet: für andere da zu sein, ohne selbst jemanden zu haben, der für dich da ist.", nextstep:"Ein TERRA Clarity Call hilft dir, das Umfeld zu beschreiben, das du wirklich brauchst, nicht das, das du gerade hast." },
  "Freunde-experte":  { headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Freunde liegt.", text:"Du hast viele Kontakte. Aber wie viele davon kennen dich wirklich? Was dich gerade kostet: ein Netzwerk zu haben, das fachlich stark, aber persönlich dünn ist.", nextstep:"Ein TERRA Clarity Call hilft dir zu verstehen, was echte Verbindung von professionellem Netzwerk unterscheidet." },
  "Freunde-enthusiast":{ headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Freunde liegt.", text:"Du begeisterst Menschen. Aber wer begeistert dich? Was dich gerade kostet: immer der Geber von Energie zu sein, ohne jemanden zu haben, der dich auffüllt.", nextstep:"Ein TERRA Clarity Call hilft dir zu sehen, welches Umfeld das Beste in dir zum Vorschein bringt." },
  "Freunde-ernahrer": { headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Freunde liegt.", text:"Du sorgst für andere, beruflich und privat. Aber wer sorgt für dich? Was dich gerade kostet: der stille Mangel an Menschen, die dich kennen und tragen.", nextstep:"Ein TERRA Clarity Call öffnet den Blick dafür, was dir im Umfeld fehlt und wie du das verändern kannst." },
  "Fitness-empath":   { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Fitness liegt.", text:"Du nimmst wahr, was andere fühlen. Aber nimmst du auch wahr, was dein Körper dir sagt? Was dich gerade kostet: die Signale des eigenen Körpers zu ignorieren, weil andere gerade wichtiger erscheinen.", nextstep:"Ein TERRA Clarity Call hilft dir zu verstehen, warum dein Körper kein Begleitumstand ist, sondern die Grundlage für alles andere." },
  "Fitness-experte":  { headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Fitness liegt.", text:"Du weißt viel, auch über Gesundheit und Leistungsfähigkeit. Aber setzt du es für dich selbst um? Was dich gerade kostet: das Wissen zu haben und es nicht anzuwenden.", nextstep:"Ein TERRA Clarity Call schafft den Übergang vom Wissen ins Tun. Manchmal braucht es jemanden, der mitschaut." },
  "Fitness-enthusiast":{ headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Fitness liegt.", text:"Du hast Energie. Aber woher kommt sie wirklich und wie nachhaltig ist sie? Was dich gerade kostet: auf Hochtouren zu laufen, ohne den Tank wirklich aufzufüllen.", nextstep:"Ein TERRA Clarity Call hilft dir, Energie zu managen, nicht nur zu verbrauchen." },
  "Fitness-ernahrer": { headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Fitness liegt.", text:"Du gibst anderen Stabilität. Aber wie stabil bist du selbst? Was dich gerade kostet: dich selbst hinten anzustellen, bis der Körper nicht mehr mitspielt.", nextstep:"Ein TERRA Clarity Call erinnert dich daran: Du bist kein Werkzeug. Du bist ein Mensch." },
  "Finanzen-empath":  { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Finanzen liegt.", text:"Du kümmerst dich um andere. Aber schützt du auch dich selbst finanziell? Was dich gerade kostet: finanzielle Sicherheit als egoistisch zu empfinden.", nextstep:"Ein TERRA Clarity Call hilft dir zu verstehen, dass finanzielle Klarheit dir die Freiheit gibt, großzügiger zu sein." },
  "Finanzen-experte": { headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Finanzen liegt.", text:"Du kannst viel. Aber schlägt sich das auch in finanzieller Klarheit nieder? Was dich gerade kostet: der Unterschied zwischen dem, was du leistest, und dem, was du dafür bekommst.", nextstep:"Ein TERRA Clarity Call hilft dir, den eigenen Wert klarer zu sehen und einzupreisen." },
  "Finanzen-enthusiast":{ headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Finanzen liegt.", text:"Du denkst groß. Aber wie solide ist das Fundament? Was dich gerade kostet: großartige Ideen, die an fehlender finanzieller Struktur scheitern.", nextstep:"Ein TERRA Clarity Call hilft dir, Visionen mit Zahlen zu verbinden." },
  "Finanzen-ernahrer":{ headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Finanzen liegt.", text:"Du sorgst für andere. Aber wie sicher bist du selbst aufgestellt? Was dich gerade kostet: der stille Druck, immer der sein zu müssen, der alles trägt.", nextstep:"Ein TERRA Clarity Call schafft Klarheit darüber, was du brauchst, damit Fürsorge keine Erschöpfung wird." },
  "Fundament-empath": { headline:"Du bist ein Empath, dessen größtes Wachstumspotenzial im Bereich Fundament liegt.", text:"Du lebst für andere. Aber lebst du auch für dich? Was dich gerade kostet: ein Leben, das sich nach Pflicht anfühlt, obwohl du so viel Wärme in die Welt gibst.", nextstep:"Ein TERRA Clarity Call hilft dir zu klären, wer du bist, wenn du nicht gerade für andere da bist." },
  "Fundament-experte":{ headline:"Du bist ein Experte, dessen größtes Wachstumspotenzial im Bereich Fundament liegt.", text:"Du weißt, was du kannst. Aber weißt du auch, wozu das alles dient? Was dich gerade kostet: Leistung zu zeigen, ohne zu wissen, wohin sie führt.", nextstep:"Ein TERRA Clarity Call schafft die Verbindung zwischen Können und Sinn." },
  "Fundament-enthusiast":{ headline:"Du bist ein Enthusiast, dessen größtes Wachstumspotenzial im Bereich Fundament liegt.", text:"Du hast Feuer und Vision. Aber ruht das auf einem klaren Fundament? Was dich gerade kostet: Energie für Dinge aufzuwenden, die nicht zu deinen tiefsten Werten passen.", nextstep:"Ein TERRA Clarity Call hilft dir, den Kompass neu auszurichten." },
  "Fundament-ernahrer":{ headline:"Du bist ein Ernährer, dessen größtes Wachstumspotenzial im Bereich Fundament liegt.", text:"Du sorgst für alles und jeden. Aber wofür stehst du selbst? Was dich gerade kostet: ein Leben, das sich nach Pflicht anfühlt, weil die eigene Frage nie gestellt wurde.", nextstep:"Ein TERRA Clarity Call gibt dir den Raum für diese Frage. Vielleicht zum ersten Mal." }
};

var fColors = { Firma:"#4F69B0", Freude:"#F8AB26", Familie:"#53B263", Freunde:"#C59ECA", Fitness:"#EF7728", Finanzen:"#10B981", Fundament:"#64748B" };

var sdtLabels = { auto:"Autonomie", wirk:"Wirksamkeit", zug:"Zugehörigkeit" };

var ETEAM_DESCRIPTIONS = {
  empath: "Du liest Räume, bevor du ein Wort gehört hast. Das ist keine Fähigkeit, die du dir antrainiert hast. Es ist deine Grundausstattung. Du weißt, wenn jemand nicht okay ist, auch wenn er behauptet, alles sei in Ordnung.\n\nDas kostet dich etwas. Mehr als andere ahnen. Weil du nicht einfach abschalten kannst. Weil du immer gleichzeitig auf mehreren Ebenen unterwegs bist: die eigene Aufgabe, die Stimmung im Team, das Unausgesprochene zwischen zwei Personen.\n\nAuf andere wirkst du wie ein Anker. Ruhig, verlässlich, verständnisvoll. Menschen öffnen sich dir schnell, manchmal zu schnell, weil sie spüren, dass du wirklich zuhörst. Das ist ein Geschenk. Und manchmal eine Bürde.\n\nDein blinder Fleck: Du kennst die Bedürfnisse aller, außer manchmal deinen eigenen. Du priorisierst den Frieden über deine eigene Klarheit. Die Frage, die dich weiterbringt: Was würdest du entscheiden, wenn niemand anderes davon betroffen wäre?",
  experte: "Du denkst tiefer als die meisten. Nicht als Pose, sondern weil Oberflächlichkeit dich körperlich stört. Wenn jemand eine halbgare Lösung vorschlägt, siehst du sofort, wo sie bricht.\n\nDu investierst in dein Wissen, weil es dir Kontrolle gibt. Kontrolle über Situationen, über Qualität, über Ergebnisse. Wenn du etwas wirklich verstehst, kannst du es auch wirklich beeinflussen. Das ist keine Arroganz. Das ist dein Betriebssystem.\n\nAuf andere wirkst du wie ein Kompass. Wenn etwas unklar ist, wird nach dir gefragt. Menschen verlassen sich auf deine Einschätzung. Das gibt dir Bedeutung. Und manchmal auch Druck.\n\nDein blinder Fleck: Du verwechselst manchmal Wissen mit Entscheidung. Du analysierst weiter, wenn es Zeit wäre zu handeln. Die Frage, die dich weiterbringt: Was würdest du tun, wenn du keine Garantie hättest, dass es richtig ist?",
  enthusiast: "Du bringst etwas mit, das sich nicht simulieren lässt: echte Begeisterung. Wenn du für eine Idee brennst, verändert sich der Raum. Menschen, die vorher zögerten, fangen an zu glauben.\n\nDu denkst in Möglichkeiten, nicht in Grenzen. Wo andere ein Problem sehen, siehst du einen Weg. Das macht dich wertvoll in Momenten, wo andere stagnieren.\n\nAuf andere wirkst du wie ein Katalysator. Deine Präsenz verändert, was möglich scheint. Menschen kommen in deiner Nähe auf Ideen, die sie alleine nicht gehabt hätten.\n\nDein blinder Fleck: Die Energie, die du erzeugst, braucht Boden. Du fängst manches an, was andere zu Ende bringen müssen. Die Frage, die dich weiterbringt: Was willst du noch wollen, wenn die Aufregung weg ist?",
  ernahrer: "Du bist der Mensch, der dafür sorgt, dass alles steht. Nicht weil dich jemand darum gebeten hat, sondern weil du es nicht aushältst, wenn etwas wackelt. Du siehst Lücken früh. Du schließt sie, bevor andere sie bemerken.\n\nDein Antrieb ist Stabilität. Für dich, für dein Team, für deine Familie. Das ist kein Mangel an Visionen. Es ist eine tiefe Form von Verantwortung.\n\nAuf andere wirkst du wie ein Fundament. Man weiß, dass du da bist. Man baut auf dich. Manchmal mehr als du weißt, und manchmal mehr als gesund ist.\n\nDein blinder Fleck: Du gibst Sicherheit nach außen, bevor du sie für dich selbst hast. Du trägst, bis es zu viel wird. Die Frage, die dich weiterbringt: Was würdest du aufbauen, wenn du nur für dich bauen müsstest?"
};

var FOKUS_DESCRIPTIONS = {
  Firma: "Firma ist nicht nur dein Job. Es ist der Ort, an dem du einen großen Teil deiner wachen Zeit verbringst, Entscheidungen trägst und dich selbst als fähig oder unfähig erlebst. Wenn dieser Bereich nicht stimmt, strahlt das aus.\n\nDass Firma gerade dein Fokus-F ist, heißt nicht, dass deine Arbeit schlecht läuft. Es heißt, dass etwas dort deine Aufmerksamkeit bindet. Vielleicht eine Spannung, die du noch nicht benennen konntest.\n\nViele Menschen, die hier landen, beschreiben dasselbe: Es läuft. Aber sie selbst laufen nicht mehr richtig mit. Die Frage ist nicht, ob du erfolgreich bist. Die Frage ist, ob du dich darin noch erkennst.",
  Freude: "Freude ist das am schwersten zu rechtfertigende Bedürfnis. Gerade für Menschen, die Verantwortung tragen. Du weißt, dass du funktionierst. Du weißt auch, dass du das schon länger ohne echten Antrieb tust.\n\nFreude ist kein Luxus. Sie ist ein Signal. Wenn sie fehlt, arbeitet dein System auf Reserve.\n\nDass Freude dein Fokus-F ist, heißt: Irgendwo zwischen dem, was du tust, und dem, was dich wirklich antreibt, ist eine Lücke entstanden. Diese Lücke hat keinen Notfall-Charakter. Sie ist leise. Und genau deshalb wird sie so lange ignoriert, bis sie laut wird.",
  Familie: "Familie ist für die meisten Menschen der Bereich, der zuerst kommt, wenn man fragt, was wirklich zählt. Und gleichzeitig der Bereich, der im Alltag am häufigsten hinten ansteht.\n\nDass Familie dein Fokus-F ist, heißt nicht, dass du ein schlechtes Familienmitglied bist. Es heißt, dass du spürst: Hier stimmt gerade etwas nicht.\n\nFamilie als Fokus bedeutet: Dieser Bereich will gesehen werden. Nicht mit schlechtem Gewissen. Sondern mit Entscheidung.",
  Freunde: "Freundschaften sind das erste, was wegfällt, wenn das Leben voller wird. Kein Drama, kein Bruch. Einfach immer weniger Zeit, immer weniger Energie, immer weniger Kontakt.\n\nDass Freunde dein Fokus-F sind, heißt: Du vermisst etwas. Verbindung außerhalb von Verantwortung. Menschen, bei denen du einfach du sein kannst.\n\nDieser Bereich wird selten als dringend empfunden. Genau deshalb schrumpft er so unbemerkt. Und genau deshalb lohnt es sich, ihn jetzt anzuschauen.",
  Fitness: "Dein Körper redet mit dir. Schon länger. Vielleicht nicht durch Schmerzen, vielleicht durch Müdigkeit, durch fehlenden Antrieb, durch das Gefühl, nicht mehr richtig auf Betriebstemperatur zu kommen.\n\nFitness als Fokus-F heißt nicht, dass du abnehmen oder einen Marathon laufen sollst. Es heißt, dass Körper und Geist gerade nicht im Einklang sind.\n\nDie Forschung ist eindeutig: Körperliche Aktivität ist der stärkste Hebel für mentale Energie, Belastbarkeit und Fokus. Du weißt das wahrscheinlich. Die Frage ist nicht das Wissen. Die Frage ist, warum du es trotzdem nicht tust.",
  Finanzen: "Geld ist das Thema, über das die wenigsten offen reden. Auch wenn es fast jeden beschäftigt. Dein persönliches Finanzbild und das deiner Arbeit sind oft schwer zu trennen. Beides hängt zusammen. Beides beeinflusst, wie frei du dich fühlen kannst.\n\nDass Finanzen dein Fokus-F sind, heißt nicht zwingend, dass zu wenig da ist. Es kann auch heißen: Du weißt nicht genau, was da ist. Oder du willst nicht hinschauen.\n\nFinanzielle Klarheit ist kein Buchhaltungsthema. Sie ist ein Freiheitsthema. Solange dieser Bereich unklar ist, kostet er dich Energie, auch wenn du gerade nicht aktiv darüber nachdenkst.",
  Fundament: "Fundament ist das, was bleibt, wenn man alles andere wegnimmt. Deine Werte. Dein Warum. Das Gefühl, dass das, was du tust, zu dem passt, wer du bist.\n\nDass Fundament dein Fokus-F ist, ist kein Zeichen von Krise. Es ist ein Zeichen von Tiefe. Du stehst an einem Punkt, wo die äußeren Dinge nicht mehr ausreichen, um dich zu tragen.\n\nDieser Bereich ist der schwierigste. Weil er keine schnelle Lösung kennt. Aber wer hier anfängt zu graben, findet meistens das, was ihm schon länger gefehlt hat."
};

var SDT_DESCRIPTIONS = {
  auto: "Autonomie ist das Bedürfnis, das am seltensten laut wird, aber am lautesten stört, wenn es fehlt. Es geht nicht darum, niemandem Rechenschaft zu schulden. Es geht darum, dass das, was du tust, sich nach dir anfühlt.\n\nAuf andere wirkst du unabhängiger als du dich fühlst. Du kommunizierst Selbstsicherheit. Aber innerlich gibt es Bereiche, in denen du funktionierst statt wählst.\n\nAutonomie zu stärken heißt nicht, alles aufzukündigen. Es heißt, wieder spüren zu lernen: Was will ich hier eigentlich? Und dann so zu handeln. In kleinen Schritten. In einem Bereich zuerst.",
  zug: "Zugehörigkeit ist kein weiches Thema. Es ist ein biologisches Grundbedürfnis. Menschen, die sich wirklich zugehörig fühlen, sind belastbarer, kreativer und leistungsfähiger.\n\nDass Zugehörigkeit deine stärkste Dimension ist, heißt: Du bist umgeben von Menschen, aber du fühlst dich nicht immer wirklich gesehen. Oder echte Verbindung kostet gerade mehr Energie, als du hast.\n\nZugehörigkeit entsteht nicht durch mehr Zeit mit anderen. Sie entsteht durch echte Momente. Durch das Gefühl: Dieser Mensch sieht mich. Nicht nur was ich leiste.",
  wirk: "Wirksamkeit ist das Bedürfnis zu spüren, dass das, was du tust, etwas verändert. Nicht im Großen, nicht im Abstrakten. Sondern konkret: Mein Handeln hat Konsequenz.\n\nDass Wirksamkeit deine stärkste Dimension ist, heißt oft: Du tust viel. Aber du spürst nicht, dass es ankommt. Die Arbeit verschwindet in Prozessen. Das Feedback bleibt aus.\n\nWirksamkeit ist kein Ego-Bedürfnis. Es ist das, was Arbeit von Fließbandarbeit unterscheidet. Wenn du spürst, dass du eine Rolle spielst, die jeder andere auch spielen könnte, verlierst du Motivation. Nicht weil du schwach bist. Sondern weil dein Gehirn Sinn braucht, um Energie freizugeben."
};

var SDT_LABELS_FULL = { auto: "Autonomie", zug: "Zugehörigkeit", wirk: "Wirksamkeit" };

var ETEAM_HINTS = {
  empath: "Wo in deinem Leben sagst du Ja, obwohl du Nein meinst, nur um den Frieden zu halten?",
  experte: "Welche Entscheidung schiebst du gerade auf, weil dir noch Informationen fehlen, obwohl du die Antwort längst spürst?",
  enthusiast: "Welche deiner aktuellen Begeisterungen hält auch noch, wenn der erste Funke weg ist?",
  ernahrer: "Wer trägt eigentlich dich, wenn du mal nicht mehr kannst?"
};

var ETEAM_TASKS = {
  empath: "Triff diese Woche eine kleine Entscheidung ausschließlich nach deinem eigenen Bedürfnis, ohne zu fragen, was andere davon halten.",
  experte: "Wähle eine Sache, bei der du gerade noch analysierst, und triff die Entscheidung heute, mit dem Wissen das du jetzt hast.",
  enthusiast: "Nimm dir ein laufendes Projekt und definiere den allerkleinsten nächsten Schritt, den du auch ohne Hochgefühl zu Ende bringst.",
  ernahrer: "Bitte diese Woche eine Person um etwas, das du normalerweise selbst tragen würdest."
};

var FOKUS_HINTS = {
  Firma: "Wenn du ehrlich bist: Erkennst du dich in dem, was du jeden Tag tust, noch wieder?",
  Freude: "Wann hast du das letzte Mal etwas getan, das keinen Zweck hatte außer dass es dir Freude macht?",
  Familie: "Sind die Menschen, die dir am nächsten sind, gerade wirklich gesehen von dir, oder nur versorgt?",
  Freunde: "Wer kennt dich wirklich, jenseits von dem was du leistest?",
  Fitness: "Welches Signal deines Körpers ignorierst du gerade, weil anderes wichtiger scheint?",
  Finanzen: "Weißt du genau, wo du finanziell stehst, oder vermeidest du den genauen Blick?",
  Fundament: "Passt das, was du tust, noch zu dem, wer du sein willst?"
};

var FOKUS_TASKS = {
  Firma: "Schreibe in drei Sätzen auf, was sich ändern müsste, damit du dich in deiner Arbeit wieder erkennst.",
  Freude: "Plane für diese Woche bewusst 30 Minuten für etwas ein, das dir Freude macht, ohne Nutzen, ohne Ziel.",
  Familie: "Verbringe diese Woche 20 Minuten ungeteilte Zeit mit einem nahen Menschen, ohne Handy, ohne Nebenbei.",
  Freunde: "Schreibe heute einer Person, mit der du gern wieder mehr Kontakt hättest, eine kurze ehrliche Nachricht.",
  Fitness: "Bewege dich diese Woche dreimal bewusst, auch wenn es nur ein flotter Spaziergang von 15 Minuten ist.",
  Finanzen: "Nimm dir 30 Minuten und verschaffe dir einen klaren Überblick über deine aktuelle finanzielle Lage.",
  Fundament: "Schreibe drei Werte auf, die dir wirklich wichtig sind, und prüfe ehrlich, wo dein Alltag ihnen widerspricht."
};

var SDT_HINTS = {
  auto: "In welchem Bereich deines Lebens funktionierst du gerade, statt wirklich zu wählen?",
  zug: "Bei wem fühlst du dich gesehen für das, wer du bist, nicht für das, was du tust?",
  wirk: "Wo verschwindet dein Einsatz gerade, ohne dass du eine Wirkung spürst?"
};

var SDT_TASKS = {
  auto: "Triff diese Woche eine Entscheidung bewusst nach deinem eigenen Maßstab, in einem Bereich wo du sonst auf Erwartungen reagierst.",
  zug: "Such diese Woche ein echtes Gespräch mit einem Menschen, das unter die Oberfläche geht.",
  wirk: "Wähle eine Aufgabe, bei der du das Ergebnis deines Einsatzes direkt sehen kannst, und bring sie zu Ende."
};


  // ── HELPER ─────────────────────────────────────
  function formatDetailText(text){
    return String(text||'').split('\n\n').map(function(p){
      return '<p>'+p.replace(/\n/g,'<br>')+'</p>';
    }).join('');
  }

  function renderHintTask(hint, task){
    var html='';
    if(hint){
      html+='<div class="terra-hint"><div class="terra-label">TERRA Hint · Reflexion</div><div class="terra-body">'+hint+'</div></div>';
    }
    if(task){
      html+='<div class="terra-task"><div class="terra-label">TERRA Task · Dein nächster Schritt</div><div class="terra-body">'+task+'</div></div>';
    }
    return html;
  }

  function escapeAttr(s){
    return String(s||'').replace(/'/g,"\\'");
  }

  /* ── HAUPTFUNKTION: Inneres HTML der Ergebnisseite ──
     data = { winF, winE, winS, tieFs, scores, eteamName, ... }
     opts = { interactive: true|false }
       interactive true  → für Browser, mit onclick Gleichstand-Wahl
       interactive false → für gespeicherte Seite, zeigt ersten F-Bereich direkt
  */
  function buildResultBodyHTML(data, opts){
    opts = opts || {};
    var interactive = opts.interactive !== false;

    var winF=data.winF, winE=data.winE, winS=data.winS;
    var edef=eteamDefs[winE] || { name:winE||'', sub:'', icon:'', color:'#1F2937', bg:'#F3F4F6', border:'#E5E7EB', kern:'' };
    var profile=profiles[winF+'-'+winE]||{headline:'Profil: '+(edef?edef.name:winE)+' mit Fokus '+winF, text:'', nextstep:''};
    var scores=data.scores||{F:{},S:{}};

    // 7F Bars
    var fScores=scores.F||{};
    var ftotal=Object.keys(fScores).reduce(function(a,k){return a+(fScores[k]||0);},0)||1;
    var fOrder=Object.keys(fScores).sort(function(a,b){return fScores[b]-fScores[a];});
    var barsHTML='';
    fOrder.forEach(function(f){
      var v=fScores[f]||0;
      var pct=Math.round((v/ftotal)*100);
      var isWin=f===winF;
      barsHTML+='<div class="bar-row'+(isWin?' bar-winner':'')+'">'
        +'<div class="bar-label">'+(isWin?'<span class="winner-dot"></span>':'')+f+'</div>'
        +'<div class="bar-track"><div class="bar-fill" style="background:'+(fColors[f]||'#888')+';width:'+pct+'%" data-pct="'+pct+'"></div></div>'
        +'<div class="bar-pct">'+pct+' %</div></div>';
    });

    // SDT Pills
    var sScores=scores.S||{};
    var stotal=Object.keys(sScores).reduce(function(a,k){return a+(sScores[k]||0);},0)||1;
    var sOrder=Object.keys(sScores).sort(function(a,b){return sScores[b]-sScores[a];});
    var pillsHTML='';
    sOrder.forEach(function(k,i){
      var v=sScores[k]||0;
      var pct=Math.round((v/stotal)*100);
      pillsHTML+='<div class="sdt-pill'+(i===0?' dominant':'')+'">'
        +'<div class="sdt-pill-name">'+sdtLabels[k]+'</div>'
        +'<div class="sdt-pill-bar"><div class="sdt-pill-fill" style="width:'+pct+'%" data-pct="'+pct+'"></div></div>'
        +'<div class="sdt-pill-pct">'+pct+' %</div></div>';
    });

    // Fokus-F Sektion
    var fokusHTML='';
    if(interactive && data.tieFs && data.tieFs.length>1){
      fokusHTML='<div class="detail-eyebrow">Dein Fokus-F</div>'
        +'<div class="detail-title" style="margin-bottom:8px;">Zwei Bereiche gleichauf</div>'
        +'<p style="font-size:13px;color:var(--mid);line-height:1.7;margin-bottom:16px;">Beide Bereiche haben bei dir dieselbe Energie. Welcher beschäftigt dich gerade mehr?</p>'
        +'<div id="tie-choices">'
        +data.tieFs.map(function(f){
          return '<button class="option" onclick="resolveTie(\''+escapeAttr(f)+'\', this)">'
            +'<div class="option-dot"></div><div class="option-text" style="font-weight:600;">'+f+'</div></button>';
        }).join('')
        +'</div><div id="fokus-detail" style="margin-top:20px;display:none;"></div>';
    } else {
      fokusHTML='<div class="detail-eyebrow">Dein Fokus-F</div>'
        +'<div class="detail-title">'+winF+'</div>'
        +'<div class="detail-text">'+formatDetailText(FOKUS_DESCRIPTIONS[winF]||'')+'</div>'
        +renderHintTask(FOKUS_HINTS[winF], FOKUS_TASKS[winF]);
    }

    var sdtLabel=SDT_LABELS_FULL[winS]||winS;

    var html=''
      +'<div class="insight-box" style="margin-bottom:16px;">'
      +'<div class="insight-label">Dein kombiniertes Profil</div>'
      +'<div class="insight-headline">'+profile.headline+'</div>'
      +'<div class="insight-text">'+profile.text+'</div>'
      +'</div>'
      +'<div class="nextstep-box">'
      +'<div class="nextstep-label">Der logische nächste Schritt</div>'
      +'<div class="nextstep-text">'+profile.nextstep+'</div>'
      +'</div>'
      +'<div class="bars-section">'
      +'<div class="bars-label">Dein 7F-Energieprofil</div>'
      +'<div class="bars">'+barsHTML+'</div>'
      +'</div>'
      +'<div class="sdt-section">'
      +'<div class="sdt-label">Deine stärkste Dimension (SDT)</div>'
      +'<div class="sdt-pills">'+pillsHTML+'</div>'
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="detail-section">'
      +'<div class="detail-eyebrow">Dein E-Team-Typ</div>'
      +'<div class="eteam-result-badge" style="border-color:'+edef.border+';background:'+edef.bg+';margin-bottom:12px;">'
      +'<div class="eteam-result-icon" style="background:'+edef.bg+'">'+edef.icon+'</div>'
      +'<div class="eteam-result-body">'
      +'<div class="eteam-result-label" style="color:'+edef.color+'">E-TEAM-TYP</div>'
      +'<div class="eteam-result-name" style="color:'+edef.color+'">'+edef.name+'</div>'
      +'<div class="eteam-result-sub" style="color:'+edef.color+'">'+edef.sub+'</div>'
      +'</div></div>'
      +'<div class="detail-text">'+formatDetailText(ETEAM_DESCRIPTIONS[winE]||'')+'</div>'
      +renderHintTask(ETEAM_HINTS[winE], ETEAM_TASKS[winE])
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="detail-section" id="fokus-section">'+fokusHTML+'</div>'
      +'<div class="divider"></div>'
      +'<div class="detail-section">'
      +'<div class="detail-eyebrow">Deine SDT-Dimension</div>'
      +'<div class="detail-title">'+sdtLabel+'</div>'
      +'<div class="detail-text">'+formatDetailText(SDT_DESCRIPTIONS[winS]||'')+'</div>'
      +renderHintTask(SDT_HINTS[winS], SDT_TASKS[winS])
      +'</div>';

    return html;
  }

  // ── EXPORT (Browser + Node) ────────────────────
  var TERRA = {
    eteamDefs: eteamDefs,
    profiles: profiles,
    fColors: fColors,
    sdtLabels: sdtLabels,
    ETEAM_DESCRIPTIONS: ETEAM_DESCRIPTIONS,
    FOKUS_DESCRIPTIONS: FOKUS_DESCRIPTIONS,
    SDT_DESCRIPTIONS: SDT_DESCRIPTIONS,
    SDT_LABELS_FULL: SDT_LABELS_FULL,
    ETEAM_HINTS: ETEAM_HINTS, ETEAM_TASKS: ETEAM_TASKS,
    FOKUS_HINTS: FOKUS_HINTS, FOKUS_TASKS: FOKUS_TASKS,
    SDT_HINTS: SDT_HINTS, SDT_TASKS: SDT_TASKS,
    formatDetailText: formatDetailText,
    renderHintTask: renderHintTask,
    buildResultBodyHTML: buildResultBodyHTML
  };

  if(typeof module!=='undefined' && module.exports){
    module.exports = TERRA;
  } else {
    root.TERRA = TERRA;
  }

})(typeof window!=='undefined' ? window : this);
