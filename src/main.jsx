import React, { useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  Heart, HelpCircle, Sparkles, Mail, CalendarHeart, Check, X, RotateCcw, Trophy,
  Gem, Users, Wine, Infinity as InfinityIcon, Star, Feather, ChevronRight, Sun, Baby
} from "lucide-react";
import "./fonts.css";

/* ---------- content ---------- */

const QUESTIONS = [
  {
    q: "What year did our story first begin?",
    options: ["2009", "2011", "2013", "2015"],
    answer: "2011",
    note: "2011. The year everything changed for the better."
  },
  {
    q: "What month and year did we officially say “I Do” and get married?",
    options: ["October 2017", "November 2016", "November 2017", "March 2018"],
    answer: "November 2017",
    note: "November 2017. The happiest day of my life."
  },
  {
    q: "Where did we recently enjoy a beautiful celebratory night out with great drinks and food?",
    options: ["Oran Park", "Gledswood Hills", "Narellan", "Camden"],
    answer: "Gledswood Hills",
    note: "Gledswood Hills. Great drinks, great food, even better company."
  }
];
const POINTS_PER = 10;

const CARDS = [
  { icon: Gem, label: "Our Wedding", msg: "Our Beautiful Wedding Day in November 2017 – the happiest day of my life." },
  { icon: Users, label: "Our Family", msg: "All of our incredible family milestones, birthdays, and adventures with Zechariah and Eleanor." },
  { icon: Wine, label: "Date Nights", msg: "Our amazing recent date nights and dinners right here in Gledswood Hills." },
  { icon: InfinityIcon, label: "Every Day", msg: "Every single day since 2011 that I’ve been blessed to have you by my side." }
];

const NOTES = [
  "You make our house feel like home. Every room is warmer because you’re in it.",
  "Watching you with Zechariah and Eleanor reminds me every day how lucky our children are to have you as their mum.",
  "Your laugh is still my favourite sound in the whole world.",
  "You are kind in the quiet ways that most people never notice. I notice, and I love you for it.",
  "Since 2011 you have been my best friend, my safe place and my favourite person.",
  "You carry so much for our family and you make it look graceful. Thank you for everything you do.",
  "If I could choose again, I would choose you. Every time, without a second thought.",
  "You are the heart of our family. We all orbit around your love.",
  "The way you love us is patient, generous and fierce. I don’t take a single bit of it for granted.",
  "You are beautiful, inside and out, and you somehow get more beautiful every year.",
  "Saying “I Do” in November 2017 was the best decision I have ever made.",
  "You make ordinary days feel like something worth celebrating.",
  "Our children will grow up knowing what real love looks like, because they see it in you.",
  "Thank you for believing in me, especially on the days I forget to believe in myself.",
  "You are an amazing wife, an incredible mother and the love of my life.",
  "Every adventure is better with you beside me, from the big milestones to a quiet dinner out."
];

const MILESTONES = [
  { year: "2011", title: "Where it all began", icon: Sparkles,
    text: "Our story started. I had no idea yet that I had just met the person I would spend my life with." },
  { year: "Nov 2017", title: "We said “I Do”", icon: Gem,
    text: "Our beautiful wedding day, the happiest day of my life, and the start of our marriage." },
  { year: "Our family", title: "Zechariah & Eleanor", icon: Baby,
    text: "Our family grew with Zechariah and Eleanor, and our hearts grew right along with it. Birthdays, milestones and adventures, all together." },
  { year: "Recently", title: "Nights out in Gledswood Hills", icon: Wine,
    text: "Beautiful celebratory date nights with great drinks and great food, close to home." },
  { year: "Today", title: "Still choosing you", icon: Sun,
    text: "Every single day since 2011, and every day still to come. The best chapters are the ones we haven’t written yet." }
];

/* ---------- shared bits ---------- */

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="text-center mb-8">
      <p className="eyebrow text-rose">{eyebrow}</p>
      <h2 className="font-display text-3xl sm:text-4xl text-wine mt-2 italic">{title}</h2>
      {sub && <p className="text-inksoft mt-3 max-w-xl mx-auto">{sub}</p>}
    </div>
  );
}

/* ---------- 1. quiz ---------- */

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const done = idx >= QUESTIONS.length;
  const q = QUESTIONS[idx];

  function choose(opt) {
    if (picked) return;
    setPicked(opt);
    const right = opt === q.answer;
    if (right) setScore(s => s + POINTS_PER);
    setResults(r => [...r, right]);
  }
  function next() { setPicked(null); setIdx(i => i + 1); }
  function restart() { setIdx(0); setPicked(null); setScore(0); setResults([]); }

  const max = QUESTIONS.length * POINTS_PER;

  return (
    <section>
      <SectionHead eyebrow="Chapter one" title="How Well Do You Know Us?"
        sub="Three questions about our story. Ten points for every right answer." />

      <div className="max-w-2xl mx-auto bg-card rounded-3xl border border-petal shadow-[0_20px_50px_-30px_rgba(74,22,33,.5)] p-6 sm:p-8">
        {/* score tracker */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {QUESTIONS.map((_, i) => {
              const r = results[i];
              const cls = r === true ? "bg-good border-good text-white"
                : r === false ? "bg-bad border-bad text-white"
                : i === idx ? "border-crimson text-crimson" : "border-petal text-inksoft";
              return (
                <span key={i} className={`w-8 h-8 rounded-full border-2 grid place-items-center text-xs font-semibold tabnums ${cls}`}>
                  {r === true ? <Check size={14} /> : r === false ? <X size={14} /> : i + 1}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-2 bg-blush/70 rounded-full pl-3 pr-4 py-1.5">
            <Heart size={16} className="text-crimson" fill="currentColor" />
            <span key={score} className="font-semibold text-lg text-crimson tabnums anim-pop">{score}</span>
            <span className="text-inksoft text-sm tabnums">/ {max} pts</span>
          </div>
        </div>
        <div className="h-1.5 bg-blush rounded-full mt-5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose to-crimson rounded-full transition-all duration-700"
            style={{ width: `${((done ? QUESTIONS.length : idx + (picked ? 1 : 0)) / QUESTIONS.length) * 100}%` }} />
        </div>

        {!done ? (
          <div key={idx} className="anim-rise mt-7">
            <p className="eyebrow text-gold">Question {idx + 1} of {QUESTIONS.length}</p>
            <h3 className="font-display text-2xl sm:text-[1.7rem] leading-snug text-wine mt-2">{q.q}</h3>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {q.options.map(opt => {
                const isAnswer = opt === q.answer;
                const isPicked = opt === picked;
                let cls = "border-petal bg-paper hover:border-rose hover:bg-blush/60 text-wine";
                let anim = "";
                if (picked) {
                  if (isAnswer) { cls = "border-good bg-good/10 text-good"; anim = isPicked ? "anim-pop" : ""; }
                  else if (isPicked) { cls = "border-bad bg-bad/10 text-bad"; anim = "anim-shake"; }
                  else cls = "border-petal bg-paper text-inksoft opacity-60";
                }
                return (
                  <button key={opt} onClick={() => choose(opt)} disabled={!!picked}
                    className={`text-left rounded-2xl border-2 px-5 py-4 font-medium transition-colors duration-200 flex items-center justify-between gap-3 ${cls} ${anim} ${picked ? "cursor-default" : ""}`}>
                    <span>{opt}</span>
                    {picked && isAnswer && <Check size={20} />}
                    {picked && isPicked && !isAnswer && <X size={20} />}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div className="anim-rise mt-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <p className={`flex items-start gap-2 ${picked === q.answer ? "text-good" : "text-bad"}`}>
                  {picked === q.answer ? <Heart size={18} className="mt-1 shrink-0" fill="currentColor" /> : <HelpCircle size={18} className="mt-1 shrink-0" />}
                  <span>
                    <strong className="font-semibold">{picked === q.answer ? "Correct! +10 points. " : "Not quite. "}</strong>
                    <span className="text-inksoft">{q.note}</span>
                  </span>
                </p>
                <button onClick={next}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-crimson text-white px-5 py-2.5 font-medium hover:bg-wine transition-colors">
                  {idx === QUESTIONS.length - 1 ? "See my score" : "Next question"} <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="anim-rise text-center mt-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-blush grid place-items-center">
              <Trophy className="text-gold" size={30} />
            </div>
            <p className="font-display text-5xl text-crimson mt-4 tabnums">{score}<span className="text-2xl text-inksoft"> / {max}</span></p>
            <h3 className="font-script text-4xl text-wine mt-2">
              {score === max ? "You know us by heart" : score > 0 ? "So close, my love" : "Let’s make more memories"}
            </h3>
            <p className="text-inksoft mt-3 max-w-md mx-auto">
              {score === max
                ? "A perfect score, just like you. Every answer is a memory I treasure."
                : "Whatever the score, you will always be my perfect answer. Have another go?"}
            </p>
            <button onClick={restart}
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-crimson text-crimson px-5 py-2.5 font-medium hover:bg-crimson hover:text-white transition-colors">
              <RotateCcw size={17} /> Play again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- 2. flip cards ---------- */

function FlipCards() {
  const [flipped, setFlipped] = useState([false, false, false, false]);
  const toggle = i => setFlipped(f => f.map((v, j) => (j === i ? !v : v)));
  const count = flipped.filter(Boolean).length;

  return (
    <section>
      <SectionHead eyebrow="Chapter two" title="Flip for a Reason"
        sub="Tap each card to turn it over. Every one holds something I'm grateful for." />
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} role="button" tabIndex={0} aria-pressed={flipped[i]}
              aria-label={flipped[i] ? c.msg : `Reveal card: ${c.label}`}
              onClick={() => toggle(i)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(i); } }}
              className={`flip h-72 ${flipped[i] ? "is-flipped" : ""}`}>
              <div className="flip-inner">
                <div className="flip-face card-front flex flex-col items-center justify-center gap-4 text-center p-6">
                  <div className="w-20 h-20 rounded-full border border-goldsoft/60 grid place-items-center">
                    <Heart size={38} className="text-gold" fill="currentColor" strokeWidth={1.2} />
                  </div>
                  <p className="font-display italic text-xl text-goldsoft">{c.label}</p>
                  <p className="eyebrow text-goldsoft/80 text-[.65rem]">Tap to reveal</p>
                </div>
                <div className="flip-face flip-back card-back flex flex-col items-center justify-center gap-4 text-center p-7">
                  <Icon size={26} className="text-gold" strokeWidth={1.5} />
                  <p className="font-display text-[1.15rem] leading-relaxed text-wine">{c.msg}</p>
                  <Heart size={14} className="text-crimson" fill="currentColor" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
        <p className="text-inksoft tabnums">{count} of {CARDS.length} reasons revealed</p>
        <button onClick={() => setFlipped(f => f.map(() => count < CARDS.length))}
          className="inline-flex items-center gap-2 rounded-full border border-rose text-rose px-4 py-2 text-sm font-medium hover:bg-rose hover:text-white transition-colors">
          {count < CARDS.length ? <><Sparkles size={15} /> Reveal them all</> : <><RotateCcw size={15} /> Turn them back</>}
        </button>
      </div>
    </section>
  );
}

/* ---------- 3. love notes ---------- */

function LoveNotes() {
  const [i, setI] = useState(null);
  const [shown, setShown] = useState(0);
  const [hearts, setHearts] = useState([]);

  function draw() {
    let n;
    do { n = Math.floor(Math.random() * NOTES.length); } while (n === i && NOTES.length > 1);
    setI(n);
    setShown(s => s + 1);
    const burst = Array.from({ length: 7 }, (_, k) => ({
      id: Date.now() + k, left: 30 + Math.random() * 40, delay: Math.random() * .4, size: 12 + Math.random() * 14
    }));
    setHearts(burst);
  }

  return (
    <section>
      <SectionHead eyebrow="Chapter three" title="Love Notes"
        sub="A little reminder whenever you need one. Press the button as often as you like." />
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-card rounded-3xl border border-petal shadow-[0_20px_50px_-30px_rgba(74,22,33,.5)] px-6 sm:px-12 pt-10 pb-10 text-center overflow-hidden min-h-[19rem] flex flex-col items-center justify-center">
          <div className="absolute inset-3 rounded-[1.25rem] border border-goldsoft/70 pointer-events-none" />
          {hearts.map(h => (
            <Heart key={h.id} className="float-heart text-crimson/70" fill="currentColor"
              style={{ left: `${h.left}%`, bottom: "20%", width: h.size, height: h.size, animationDelay: `${h.delay}s` }} />
          ))}
          <p className="font-script text-4xl text-crimson">My dearest Cynthia,</p>
          <div className="gold-rule w-40 my-5" />
          {i === null ? (
            <p className="font-display italic text-xl text-inksoft leading-relaxed max-w-md">
              There are more reasons than I could ever fit on one page. Press the button below for today&rsquo;s.
            </p>
          ) : (
            <p key={shown} className="anim-rise font-display text-[1.45rem] sm:text-[1.6rem] text-wine leading-relaxed max-w-lg">
              &ldquo;{NOTES[i]}&rdquo;
            </p>
          )}
          <p className="font-script text-3xl text-rose mt-6">With all my love, always</p>
        </div>

        <div className="flex flex-col items-center gap-3 mt-7">
          <button onClick={draw}
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-crimson to-wine text-white pl-5 pr-6 py-3.5 font-medium text-lg shadow-[0_12px_28px_-12px_rgba(143,29,51,.8)] hover:brightness-110 active:scale-[.98] transition">
            <Heart size={20} fill="currentColor" className="anim-beat" />
            Tell me why I&rsquo;m loved today
          </button>
          {shown > 0 && (
            <p className="text-inksoft text-sm tabnums flex items-center gap-1.5">
              <Feather size={14} /> {shown} {shown === 1 ? "note" : "notes"} opened, {NOTES.length} waiting in the jar
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. timeline ---------- */

function Timeline() {
  const [active, setActive] = useState(0);
  const m = MILESTONES[active];
  const Icon = m.icon;

  return (
    <section>
      <SectionHead eyebrow="Chapter four" title="Our Love Milestones"
        sub="From 2011 to today. Tap a moment, or scroll along the line." />

      {/* horizontal track */}
      <div className="scroll-x -mx-4 px-4 pb-3">
        <ol className="relative flex min-w-[640px] max-w-4xl mx-auto justify-between pt-2">
          <div className="absolute left-[10%] right-[10%] top-[1.85rem] h-[3px] rounded-full bg-petal" aria-hidden="true" />
          <div className="absolute left-[10%] top-[1.85rem] h-[3px] rounded-full bg-gradient-to-r from-gold to-crimson transition-all duration-700"
            style={{ width: `${(active / (MILESTONES.length - 1)) * 80}%` }} aria-hidden="true" />
          {MILESTONES.map((ms, i) => {
            const MIcon = ms.icon;
            const on = i === active;
            const past = i < active;
            return (
              <li key={i} className="relative z-10 w-1/5 flex flex-col items-center text-center">
                <button onClick={() => setActive(i)} aria-current={on ? "step" : undefined}
                  aria-label={`${ms.year}: ${ms.title}`}
                  className={`w-[3.4rem] h-[3.4rem] rounded-full grid place-items-center border-2 transition-all duration-300
                    ${on ? "bg-crimson border-crimson text-white scale-110 shadow-[0_8px_20px_-8px_rgba(143,29,51,.9)]"
                      : past ? "bg-card border-gold text-gold" : "bg-card border-petal text-rose hover:border-rose"}`}>
                  <MIcon size={22} />
                </button>
                <span className={`mt-3 font-display text-sm tabnums ${on ? "text-crimson font-semibold" : "text-inksoft"}`}>{ms.year}</span>
                <span className="text-xs text-inksoft/80 mt-0.5 px-1 leading-snug">{ms.title}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* detail */}
      <div key={active} className="anim-rise max-w-2xl mx-auto mt-8 bg-card rounded-3xl border border-petal p-6 sm:p-9 shadow-[0_20px_50px_-30px_rgba(74,22,33,.5)]">
        <div className="flex items-start gap-5">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-blush grid place-items-center text-crimson">
            <Icon size={26} />
          </div>
          <div className="min-w-0">
            <p className="eyebrow text-gold tabnums">{m.year}</p>
            <h3 className="font-display text-2xl sm:text-3xl text-wine mt-1">{m.title}</h3>
            <p className="text-inksoft mt-3 leading-relaxed">{m.text}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-7 gap-3">
          <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0}
            className="rounded-full border border-petal px-4 py-2 text-sm text-wine hover:border-rose disabled:opacity-40 disabled:hover:border-petal transition-colors">
            Earlier
          </button>
          <span className="text-sm text-inksoft tabnums">{active + 1} / {MILESTONES.length}</span>
          <button onClick={() => setActive(a => Math.min(MILESTONES.length - 1, a + 1))} disabled={active === MILESTONES.length - 1}
            className="rounded-full bg-crimson text-white px-4 py-2 text-sm hover:bg-wine disabled:opacity-40 transition-colors">
            Later
          </button>
        </div>
      </div>

      {/* full vertical story */}
      <div className="max-w-2xl mx-auto mt-14">
        <p className="eyebrow text-rose text-center mb-6">The whole story</p>
        <ol className="relative pl-10">
          <div className="tl-line absolute left-[0.95rem] top-1 bottom-1 w-[2px] rounded-full" aria-hidden="true" />
          {MILESTONES.map((ms, i) => (
            <li key={i} className="relative pb-7 last:pb-0">
              <button onClick={() => setActive(i)} className="text-left w-full group">
                <span className={`absolute -left-10 top-1 w-[1.95rem] h-[1.95rem] rounded-full grid place-items-center border-2 transition-colors
                  ${i === active ? "bg-crimson border-crimson text-white" : "bg-paper border-gold text-gold group-hover:border-crimson"}`}>
                  <Heart size={12} fill="currentColor" />
                </span>
                <span className="eyebrow text-gold tabnums">{ms.year}</span>
                <span className="block font-display text-xl text-wine group-hover:text-crimson transition-colors">{ms.title}</span>
                <span className="block text-inksoft text-[.95rem] mt-1">{ms.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- app shell ---------- */

const TABS = [
  { id: "quiz", label: "Quiz", icon: HelpCircle, C: Quiz },
  { id: "reasons", label: "Reasons", icon: Heart, C: FlipCards },
  { id: "notes", label: "Love Notes", icon: Mail, C: LoveNotes },
  { id: "timeline", label: "Milestones", icon: CalendarHeart, C: Timeline }
];

function App() {
  const initial = (() => {
    const h = (location.hash || "").slice(1);
    return TABS.some(t => t.id === h) ? h : "quiz";
  })();
  const [tab, setTab] = useState(initial);
  const Active = TABS.find(t => t.id === tab).C;

  const years = useMemo(() => new Date().getFullYear() - 2011, []);

  function go(id) {
    if (id === tab) return;
    setTab(id);
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    const main = document.getElementById("chapter");
    if (main && window.scrollY > main.offsetTop - 24) window.scrollTo({ top: Math.max(0, main.offsetTop - 24) });
  }

  return (
    <div className="max-w-6xl mx-auto" style={{ paddingBottom: "calc(6.5rem + env(safe-area-inset-bottom, 0px))" }}>
      {/* cover */}
      <header className="text-center pt-12 sm:pt-16 pb-8">
        <p className="eyebrow text-rose flex items-center justify-center gap-2">
          <Star size={12} className="text-gold" fill="currentColor" /> A keepsake for my wife <Star size={12} className="text-gold" fill="currentColor" />
        </p>
        <h1 className="font-display text-[2.6rem] sm:text-6xl leading-[1.05] text-wine mt-4">
          Our <em className="gold-text not-italic font-display italic">Love</em> Journey
        </h1>
        <p className="font-script text-4xl sm:text-5xl text-crimson mt-3">for Cynthia</p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-6 text-inksoft text-sm tabnums">
          <span className="whitespace-nowrap">Since 2011</span>
          <Heart size={10} className="text-gold" fill="currentColor" />
          <span className="whitespace-nowrap">Married November 2017</span>
          <Heart size={10} className="text-gold hidden min-[420px]:block" fill="currentColor" />
          <span className="whitespace-nowrap basis-full min-[420px]:basis-auto">{years} years of us</span>
        </div>
        <div className="gold-rule max-w-md mx-auto mt-8" />
      </header>

      {/* bottom tab bar, like a phone app */}
      <nav className="fixed inset-x-0 bottom-0 z-20 bg-paper/95 backdrop-blur-md"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "max(8px, env(safe-area-inset-left, 0px))",
          paddingRight: "max(8px, env(safe-area-inset-right, 0px))"
        }}>
        <div className="gold-rule" />
        <div role="tablist" aria-label="Sections" className="grid grid-cols-4 max-w-xl mx-auto pt-1.5 pb-1">
          {TABS.map(t => {
            const TIcon = t.icon;
            const on = t.id === tab;
            return (
              <button key={t.id} role="tab" aria-selected={on} onClick={() => go(t.id)}
                className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl text-[.72rem] font-medium tracking-wide transition-colors duration-300
                  ${on ? "text-crimson" : "text-inksoft hover:text-crimson"}`}>
                <span className={`grid place-items-center w-12 h-8 rounded-full transition-all duration-300 ${on ? "bg-crimson text-white shadow-[0_6px_14px_-8px_rgba(143,29,51,.9)]" : ""}`}>
                  <TIcon size={19} fill={on && t.id === "reasons" ? "currentColor" : "none"} />
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main id="chapter" key={tab} className="anim-rise pt-10">
        <Active />
      </main>

      <footer className="text-center mt-20">
        <div className="gold-rule max-w-xs mx-auto mb-6" />
        <p className="font-script text-3xl text-rose">Forever yours</p>
        <p className="text-inksoft text-sm mt-1">Made with love for Cynthia, Zechariah and Eleanor&rsquo;s amazing mum.</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
