export type AiBlock = {
  kind: 'paragraph' | 'bullet';
  segments: { text: string; bold: boolean }[];
};

export function parseAiExplanation(raw: unknown): AiBlock[] {
  if (typeof raw !== 'string') return [];

  const blocks: AiBlock[] = [];
  for (const line of raw.replace(/\r\n?/g, '\n').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const bullet = trimmed.match(/^[-*](?:\s+(.*))?$/);
    const content = bullet ? (bullet[1] ?? '') : trimmed;
    const segments: AiBlock['segments'] = [];
    let cursor = 0;
    for (const match of content.matchAll(/\*\*([^*]+)\*\*/g)) {
      segments.push({ text: content.slice(cursor, match.index), bold: false });
      segments.push({ text: match[1], bold: true });
      cursor = match.index + match[0].length;
    }
    segments.push({ text: content.slice(cursor), bold: false });

    const cleaned = segments
      .map(segment => ({ ...segment, text: segment.text.replace(/\*/g, '').replace(/[ \t]{2,}/g, ' ') }))
      .filter(segment => segment.text.length > 0);
    if (cleaned.length === 0) continue;
    cleaned[0].text = cleaned[0].text.trimStart();
    cleaned[cleaned.length - 1].text = cleaned[cleaned.length - 1].text.trimEnd();
    const nonempty = cleaned.filter(segment => segment.text.length > 0);
    if (nonempty.length > 0) blocks.push({ kind: bullet ? 'bullet' : 'paragraph', segments: nonempty });
  }
  return blocks;
}

export function aiExplanationPlainText(blocks: AiBlock[]): string {
  return blocks.map(block => block.segments.map(segment => segment.text).join('')).join('\n');
}
