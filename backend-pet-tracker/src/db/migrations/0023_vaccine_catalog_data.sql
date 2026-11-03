-- Custom SQL migration file, put your code below! --
INSERT INTO "vaccine_catalog" ("id", "species", "name", "scheme") VALUES
  (gen_random_uuid(), 'dog', 'Rabia', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'dog', 'Polivalente (DHPPi)', '{"firstDoseMonths":2,"series":[2,3,4],"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'dog', 'Leptospirosis', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'dog', 'Tos de las perreras', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'cat', 'Triple felina (FVRCP)', '{"firstDoseMonths":2,"series":[2,3],"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'cat', 'Leucemia felina (FeLV)', '{"firstDoseMonths":2,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'cat', 'Rabia', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb);
