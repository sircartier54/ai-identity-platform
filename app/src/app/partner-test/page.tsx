'use client'

import { useState } from "react";
import { SURVEY_DATA, PartnerTestQuestion } from "@/constants/q-partner-test";
import { analyzeRelationship } from "./actions";

export default function PartnerTest() {
  const [questions, setQuestions] = useState<PartnerTestQuestion[]>(
    SURVEY_DATA.map((q) => ({ ...q }))
  );
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const q = questions[current];
  const total = questions.length;
  const progress = (current / total) * 100;
  const answered = Array.isArray(q.answer) ? q.answer.length > 0 : q.answer !== "";

  function selectSingle(option: string) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === current ? { ...item, answer: option } : item))
    );
  }

  function toggleMulti(option: string) {
    setQuestions((prev) =>
      prev.map((item, i) => {
        if (i !== current) return item;
        const arr = Array.isArray(item.answer) ? item.answer : [];
        return {
          ...item,
          answer: arr.includes(option)
            ? arr.filter((a) => a !== option)
            : [...arr, option],
        };
      })
    );
  }

  function next() {
    if (current < total - 1) setCurrent((c) => c + 1);
  }

  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    questions.forEach((q) => {
      const val = Array.isArray(q.answer) ? q.answer.join(", ") : q.answer;
      formData.append(q.id, val);
    });

    const res = await analyzeRelationship(formData);
    if (res.success) {
      setResult(res.analysis);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }

  const isLast = current === total - 1;
  const allAnswered = questions.every((q) =>
    Array.isArray(q.answer) ? q.answer.length > 0 : q.answer !== ""
  );

  // ── Result screen ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-mono text-rose-400 tracking-[0.2em] uppercase">
              Partner_Report
            </h1>
            <div className="h-px w-24 bg-rose-800 mx-auto mt-2" />
          </header>

          <div className="p-4 bg-rose-950/20 border-l-2 border-rose-500 rounded text-sm leading-relaxed text-slate-300 animate-in fade-in duration-700 whitespace-pre-wrap">
            <span className="text-rose-400 font-bold block mb-2 text-[10px] uppercase tracking-widest font-mono">
              Analysis Complete:
            </span>
            {result}
          </div>

          <button
            onClick={() => {
              setResult(null);
              setQuestions(SURVEY_DATA.map((q) => ({ ...q })));
              setCurrent(0);
            }}
            className="mt-6 w-full border border-slate-700 hover:border-rose-700 text-slate-500 hover:text-rose-400 py-3 rounded-xl text-[10px] tracking-widest uppercase font-bold transition-all font-mono"
          >
            Run Again
          </button>
        </div>
      </main>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">

        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-mono text-rose-400 tracking-[0.2em] uppercase">
            Partner_Protocol
          </h1>
          <div className="h-1 w-full bg-slate-800 mx-auto mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] font-mono text-slate-600 tracking-widest">
            {current + 1} / {total}
          </p>
        </header>

        {/* Question */}
        <div className="mb-6">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest font-mono">
            Question {current + 1}
          </span>
          <p className="mt-2 text-slate-200 font-bold leading-snug">
            {q.label}
          </p>
          {q.type === "multi" && (
            <p className="mt-1 text-[10px] text-slate-600 font-mono tracking-wide">
              Select all that apply
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2 mb-8">
          {q.options.map((option) => {
            const isSelected = Array.isArray(q.answer)
              ? q.answer.includes(option)
              : q.answer === option;

            return (
              <button
                key={option}
                onClick={() =>
                  q.type === "multi" ? toggleMulti(option) : selectSingle(option)
                }
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 active:scale-[0.99] font-mono ${
                  isSelected
                    ? "bg-rose-950/40 border-rose-500 text-rose-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                <span
                  className={`inline-block w-3 h-3 mr-3 rounded-${q.type === "multi" ? "sm" : "full"} border align-middle transition-all ${
                    isSelected ? "bg-rose-500 border-rose-500" : "border-slate-600"
                  }`}
                />
                {option}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-5 py-3 rounded-xl border border-slate-800 text-slate-600 text-[10px] font-mono tracking-widest uppercase font-bold hover:border-slate-600 hover:text-slate-400 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {isLast ? (
            <button
              onClick={submit}
              disabled={loading || !allAnswered}
              className="flex-1 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] py-3 rounded-xl font-black tracking-widest text-[10px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(244,63,94,0.2)] font-mono"
            >
              {loading ? "SEQUENCING..." : "INITIATE ANALYSIS"}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!answered}
              className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] py-3 rounded-xl font-black tracking-widest text-[10px] uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed font-mono"
            >
              Next →
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-950/20 border-l-2 border-red-500 rounded text-sm text-red-300">
            <span className="font-bold block mb-1 text-[10px] uppercase tracking-widest font-mono">
              System Warning:
            </span>
            {error}
          </div>
        )}

        {/* Dot nav */}
        <div className="mt-6 flex flex-wrap gap-1 justify-center">
          {questions.map((item, i) => {
            const done = Array.isArray(item.answer)
              ? item.answer.length > 0
              : item.answer !== "";
            return (
              <button
                key={item.id}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current
                    ? "bg-rose-500 scale-125"
                    : done
                    ? "bg-rose-800"
                    : "bg-slate-800"
                }`}
              />
            );
          })}
        </div>

      </div>
    </main>
  );
}