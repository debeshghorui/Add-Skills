export class SelectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "SelectionError";
  }
}

export function selectSkills(tokens, skills) {
  const selected = new Set();
  const byName = new Map(skills.map((skill, index) => [skill.name, index]));

  for (const raw of tokens) {
    for (const token of raw.split(",")) {
      const trimmed = token.trim();
      if (trimmed) applyToken(trimmed);
    }
  }

  return skills.filter((_, index) => selected.has(index));

  function applyToken(token) {
    const word = token.toLowerCase();
    if (word === "all" || word === "a") {
      skills.forEach((_, index) => selected.add(index));
      return;
    }
    if (word === "none" || word === "n") {
      selected.clear();
      return;
    }

    const range = /^(\d+)-(\d+)$/.exec(token);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start > end) throw new SelectionError(`Bad range: ${token}`);
      for (let number = start; number <= end; number += 1) mark(number);
      return;
    }

    if (/^\d+$/.test(token)) {
      mark(Number(token));
      return;
    }

    const index = byName.get(token);
    if (index === undefined) throw new SelectionError(`Unknown skill: ${token}`);
    selected.add(index);
  }

  function mark(number) {
    if (!Number.isInteger(number) || number < 1 || number > skills.length) {
      throw new SelectionError(`No skill numbered ${number}`);
    }
    selected.add(number - 1);
  }
}
