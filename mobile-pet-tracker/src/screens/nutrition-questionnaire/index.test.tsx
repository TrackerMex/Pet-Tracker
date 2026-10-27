const { existsSync, readFileSync } = jest.requireActual<typeof import('fs')>('fs');

it('#209 R3: la ruta nutrition-profile es delgada y está en el Stack', () => {
  const routePath = 'src/app/nutrition-profile.tsx';
  expect(existsSync(routePath)).toBe(true);
  const route = readFileSync(routePath, 'utf8');
  expect(route.trim().split('\n').length).toBeLessThan(10);
  expect(route.trim()).toBe("export { NutritionQuestionnaireScreen as default } from '../screens/nutrition-questionnaire';");
  const layout = readFileSync('src/app/_layout.tsx', 'utf8');
  expect(layout).toContain('<Stack.Screen name="nutrition-profile" options={{ headerShown: false }} />');
});
