import { blobatar } from 'blobatar';
import { useImage, type ImageRef } from 'expo-image';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Image as RNImage, PixelRatio, Pressable, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Image as SvgImage, parse } from 'react-native-svg';

export const SPIKE_MARKER_DP = 44;
export const SPIKE_RING_DP = 3;
export const SPIKE_BLOB_DP = 38;
export const SPIKE_TIMEOUT_MS = 4000;
export type SpikeVariant = 'photo' | 'broken-url' | 'no-photo';

export type SpikeReport = {
  variant: SpikeVariant;
  visible: boolean;
  usedUrl: string | null;
  brokenKind: 'signature-zeroed' | 'invalid-host' | null;
  pixelRatio: number;
  requestedPx: number;
  stage: 'composing' | 'photo-loaded' | 'timeout-fallback' | 'captured' | 'icon-ready'
    | 'capture-timeout' | 'icon-error';
  msToPhotoLoad: number | null;
  msToCapture: number | null;
  msToIcon: number | null;
  base64Length: number | null;
  decodedWidth: number | null;
  decodedHeight: number | null;
  iconWidth: number | null;
  iconHeight: number | null;
  error: string | null;
};

type SpikeAvatarComposerProps = {
  name: string;
  photoUrl: string | null;
  variant: SpikeVariant;
  visible: boolean;
  onReport: (report: SpikeReport) => void;
  onIcon: (icon: ImageRef | null, dataUrl: string | null) => void;
};

function SpikeIconLoader({ dataUrl, onIcon, onError }: {
  dataUrl: string;
  onIcon: (icon: ImageRef, dataUrl: string) => void;
  onError: (error: string) => void;
}) {
  const icon = useImage({ uri: dataUrl }, { onError: (error) => onError(String(error)) });

  useEffect(() => {
    if (icon) onIcon(icon, dataUrl);
  }, [dataUrl, icon, onIcon]);

  return null;
}

export function SpikeAvatarComposer(props: SpikeAvatarComposerProps) {
  // A refreshed photo URL starts a new measurement, just like a panel selection.
  return <SpikeAvatarComposition key={JSON.stringify([props.name, props.photoUrl, props.variant, props.visible])} {...props} />;
}

function SpikeAvatarComposition({ name, photoUrl, variant, visible, onReport, onIcon }: SpikeAvatarComposerProps) {
  const { uri, brokenKind } = useMemo(() => {
    if (variant === 'no-photo' || photoUrl === null) return { uri: null, brokenKind: null };
    if (variant === 'photo') return { uri: photoUrl, brokenKind: null };
    if (photoUrl.includes('X-Amz-Signature=')) {
      return {
        uri: photoUrl.replace(/(X-Amz-Signature=)[0-9a-fA-F]{64}/, (_, prefix: string) => prefix + '0'.repeat(64)),
        brokenKind: 'signature-zeroed' as const,
      };
    }
    return { uri: 'https://invalid.invalid/spike-230.jpg', brokenKind: 'invalid-host' as const };
  }, [photoUrl, variant]);
  const blob = useMemo(() => parse(blobatar(name))?.children, [name]);
  const svgRef = useRef<Svg | null>(null);
  const startedAt = useRef(Date.now());
  const pixelRatio = PixelRatio.get();
  const requestedPx = Math.round(SPIKE_MARKER_DP * pixelRatio);
  const report = useRef<SpikeReport>({
    variant,
    visible,
    usedUrl: uri?.slice(0, 80) ?? null,
    brokenKind,
    pixelRatio,
    requestedPx,
    stage: 'composing',
    msToPhotoLoad: null,
    msToCapture: null,
    msToIcon: null,
    base64Length: null,
    decodedWidth: null,
    decodedHeight: null,
    iconWidth: null,
    iconHeight: null,
    error: null,
  });
  const active = useRef(false);
  const generation = useRef(0);
  const photoSettled = useRef(false);
  const captureStarted = useRef(false);
  const photoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const [fallback, setFallback] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const publish = useCallback((patch: Partial<SpikeReport>) => {
    if (!active.current) return;
    const previousStage = report.current.stage;
    report.current = { ...report.current, ...patch };
    if (previousStage !== report.current.stage) {
      console.log('[spike-230]', JSON.stringify(report.current));
    }
    onReport(report.current);
  }, [onReport]);

  const capture = useCallback(() => {
    if (!active.current || captureStarted.current) return;
    captureStarted.current = true;
    const run = generation.current;
    let settled = false;
    const isCurrent = () => active.current && generation.current === run;
    captureTimer.current = setTimeout(() => {
      if (!isCurrent() || settled) return;
      settled = true;
      publish({ stage: 'capture-timeout', error: 'toDataURL callback timed out' });
    }, SPIKE_TIMEOUT_MS);
    frame.current = requestAnimationFrame(() => {
      if (!isCurrent() || settled) return;
      frame.current = requestAnimationFrame(() => {
        if (!isCurrent() || settled) return;
        svgRef.current?.toDataURL((base64) => {
          if (!isCurrent() || settled) return;
          settled = true;
          if (captureTimer.current !== null) clearTimeout(captureTimer.current);
          const capturedUrl = 'data:image/png;base64,' + base64;
          publish({
            stage: 'captured',
            msToCapture: Date.now() - startedAt.current,
            base64Length: base64.length,
          });
          setDataUrl(capturedUrl);
          onIcon(null, capturedUrl);
          RNImage.getSize(capturedUrl, (width, height) => {
            if (isCurrent()) publish({ decodedWidth: width, decodedHeight: height });
          }, (error) => {
            if (isCurrent()) publish({ error: String(error) });
          });
        }, { width: requestedPx, height: requestedPx });
      });
    });
  }, [onIcon, publish, requestedPx]);

  useLayoutEffect(() => {
    active.current = true;
    console.log('[spike-230]', JSON.stringify(report.current));
    onReport(report.current);
    onIcon(null, null);
    if (uri !== null) {
      photoTimer.current = setTimeout(() => {
        if (photoSettled.current) return;
        photoSettled.current = true;
        publish({ stage: 'timeout-fallback' });
        setFallback(true);
      }, SPIKE_TIMEOUT_MS);
    }
    return () => {
      active.current = false;
      generation.current += 1;
      photoSettled.current = false;
      captureStarted.current = false;
      if (photoTimer.current !== null) clearTimeout(photoTimer.current);
      if (captureTimer.current !== null) clearTimeout(captureTimer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [onIcon, onReport, publish, uri]);

  useEffect(() => {
    if (uri === null || fallback) capture();
  }, [capture, fallback, uri]);

  const handlePhotoLoad = useCallback(() => {
    if (!active.current || photoSettled.current) return;
    photoSettled.current = true;
    if (photoTimer.current !== null) clearTimeout(photoTimer.current);
    publish({ stage: 'photo-loaded', msToPhotoLoad: Date.now() - startedAt.current });
    capture();
  }, [capture, publish]);

  const handleIcon = useCallback((icon: ImageRef, capturedUrl: string) => {
    if (!active.current) return;
    publish({
      stage: 'icon-ready',
      msToIcon: Date.now() - startedAt.current,
      iconWidth: icon.width,
      iconHeight: icon.height,
    });
    onIcon(icon, capturedUrl);
  }, [onIcon, publish]);
  const handleIconError = useCallback((error: string) => {
    publish({ stage: 'icon-error', error });
  }, [publish]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, opacity: visible ? 1 : 0.01 }}>
      <Svg ref={svgRef} width={SPIKE_MARKER_DP} height={SPIKE_MARKER_DP} viewBox="0 0 44 44">
        {uri !== null && !fallback ? (
          <>
            <Defs>
              <ClipPath id="spike-230-clip">
                <Circle cx={22} cy={22} r={22} />
              </ClipPath>
            </Defs>
            <SvgImage
              href={{ uri }}
              x={0}
              y={0}
              width={SPIKE_MARKER_DP}
              height={SPIKE_MARKER_DP}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#spike-230-clip)"
              onLoad={handlePhotoLoad}
            />
          </>
        ) : (
          <>
            <Circle cx={22} cy={22} r={22} fill="#FFFFFF" />
            <G transform={`translate(3 3) scale(${SPIKE_BLOB_DP / 100})`}>{blob}</G>
          </>
        )}
        <Circle cx={22} cy={22} r={20.5} stroke="#FFFFFF" strokeWidth={SPIKE_RING_DP} fill="none" />
      </Svg>
      {dataUrl !== null ? <SpikeIconLoader dataUrl={dataUrl} onIcon={handleIcon} onError={handleIconError} /> : null}
    </View>
  );
}

export function SpikePanel({ report, dataUrl, variant, visible, onVariant, onToggleVisible, top }: {
  report: SpikeReport | null;
  dataUrl: string | null;
  variant: SpikeVariant;
  visible: boolean;
  onVariant: (variant: SpikeVariant) => void;
  onToggleVisible: () => void;
  top: number;
}) {
  return (
    <View testID="spike-230-panel" style={{ position: 'absolute', top, left: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.78)', padding: 8, borderRadius: 8, gap: 4 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          {report ? Object.entries(report).map(([field, value]) => (
            <Text key={field} selectable style={{ color: '#FFFFFF', fontSize: 11 }}>{field}: {String(value)}</Text>
          )) : <Text style={{ color: '#FFFFFF', fontSize: 11 }}>stage: composing</Text>}
        </View>
        {dataUrl ? (
          <View style={{ alignItems: 'center' }}>
            <RNImage source={{ uri: dataUrl }} style={{ width: 44, height: 44 }} />
            <Text style={{ color: '#FFFFFF', fontSize: 11 }}>PNG</Text>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
        {([
          ['photo', 'Foto'],
          ['broken-url', 'URL rota'],
          ['no-photo', 'Sin foto'],
        ] as const).map(([value, label]) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: variant === value }}
            onPress={() => onVariant(value)}
            style={{ padding: 8, backgroundColor: variant === value ? '#178255' : '#333333' }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>{label}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" accessibilityState={{ selected: visible }} onPress={onToggleVisible} style={{ padding: 8, backgroundColor: visible ? '#178255' : '#333333' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Visible: {visible ? 'sí' : 'no'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
