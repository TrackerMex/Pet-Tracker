import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'reicon-react-native';

import { useTranslate } from '../../providers/language-provider';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { aiExplanationPlainText, parseAiExplanation } from './parse-ai-explanation';

const AI_CLAMP_HEIGHT = 122; // #224 R6
const AI_FADE_HEIGHT = 36; // #224 R6

function renderBlocks(blocks: ReturnType<typeof parseAiExplanation>, violetStrong: string, withTestIDs: boolean) {
  return blocks.map((block, index) => {
    const segments = block.segments.map((segment, segmentIndex) => segment.bold ? (
      <Text key={segmentIndex} className="font-extrabold">{segment.text}</Text>
    ) : segment.text);
    if (block.kind === 'paragraph') {
      return (
        <Text
          key={index}
          testID={withTestIDs ? `food-ai-block-${index}` : undefined}
          className={`${index > 0 ? 'mt-2 ' : ''}text-13 font-medium leading-body text-foreground`}
        >
          {segments}
        </Text>
      );
    }
    const margin = index === 0 ? '' : blocks[index - 1].kind === 'bullet' ? 'mt-1 ' : 'mt-1.5 ';
    return (
      <View key={index} testID={withTestIDs ? `food-ai-block-${index}` : undefined} className={`${margin}flex-row gap-2`}>
        <View
          testID={withTestIDs ? `food-ai-dot-${index}` : undefined}
          className="mt-1.75 size-1.25 shrink-0 rounded-full"
          style={{ backgroundColor: violetStrong }}
        />
        <Text className="flex-1 text-13 font-medium leading-body text-foreground">{segments}</Text>
      </View>
    );
  });
}

export function AiExplanation({ text }: { text: string }) {
  const t = useTranslate();
  const [violetStrong, violet] = useThemeColors(['category-violet-strong', 'category-violet']);
  const blocks = useMemo(() => parseAiExplanation(text), [text]);
  const [contentHeight, setContentHeight] = useState(0);
  const [expandedFor, setExpandedFor] = useState<string | null>(null);
  const expanded = expandedFor === text;
  const needsClamp = contentHeight > AI_CLAMP_HEIGHT;

  // #234 R3: el gemelo mide sin verse, recibir toques ni duplicar la lectura.
  return (
    <View className="gap-2">
      <View
        testID="food-ai-measure"
        className="absolute inset-x-0 top-0 opacity-0"
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
      >
        {renderBlocks(blocks, violetStrong, false)}
      </View>
      <View
        testID="food-ai-body"
        accessible
        accessibilityLabel={aiExplanationPlainText(blocks)}
        className="overflow-hidden"
        style={needsClamp && !expanded ? { maxHeight: AI_CLAMP_HEIGHT } : undefined}
      >
        <View testID="food-ai-content">
          {renderBlocks(blocks, violetStrong, true)}
        </View>
        {needsClamp && !expanded ? (
          <View
            testID="food-ai-fade"
            pointerEvents="none"
            className="absolute inset-x-0 bottom-0"
            style={{ height: AI_FADE_HEIGHT, experimental_backgroundImage: `linear-gradient(to bottom, ${violet}00 0%, ${violet} 100%)` }}
          />
        ) : null}
      </View>
      {needsClamp ? (
        <Pressable
          testID="food-ai-more"
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          hitSlop={TOUCH_SLOP}
          className="h-8 flex-row items-center gap-1 self-start"
          onPress={() => setExpandedFor(expanded ? null : text)}
        >
          <Text className={`text-13 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>
            {expanded ? t('food.aiShowLess') : t('food.aiShowMore')}
          </Text>
          {expanded ? (
            <ChevronUp size={16} strokeWidth={2.6} color={violetStrong} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.6} color={violetStrong} />
          )}
        </Pressable>
      ) : null}
      <Text testID="food-ai-disclaimer" className="text-11 leading-body text-muted">
        {t('food.aiDisclaimer')}
      </Text>
    </View>
  );
}
