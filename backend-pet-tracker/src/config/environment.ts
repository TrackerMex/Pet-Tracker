export function isProduction(nodeEnv: string | undefined): boolean {
  return nodeEnv === 'production';
}
