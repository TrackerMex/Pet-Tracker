import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AWS_RESOURCE_NAMES } from './aws.constants';
import { AwsModule } from './aws.module';
import {
  AwsResourceNames,
  LocalMediaBucketNameError,
  MissingMediaBucketNameError,
  resolveResourceNamesFromConfigService,
  resolveResourceNamesFromEnv,
} from './resource-names';

const REAL_MEDIA_BUCKET = 'pet-tracker-media-dev-123456789012';

const AWS_RESOURCE_NAMES_WITH_REAL_MEDIA_BUCKET: AwsResourceNames = {
  positionsRaw: 'positions-raw',
  positionsRawDlq: 'positions-raw-dlq',
  notifications: 'notifications',
  notificationsDlq: 'notifications-dlq',
  geofenceEvents: 'geofence-events',
  geofenceEventsDlq: 'geofence-events-dlq',
  geofenceEventsRule: 'geofence-events',
  positionsTable: 'positions',
  mediaBucket: REAL_MEDIA_BUCKET,
  eventBus: 'pet-tracker',
};

function buildConfigService(
  values: Record<string, string | undefined>,
): ConfigService {
  return {
    get: (key: string) => values[key],
  } as ConfigService;
}

describe('R1: modo aws resuelve mediaBucket desde MEDIA_BUCKET_NAME', () => {
  it('resuelve el override recortado desde process.env', () => {
    expect(
      resolveResourceNamesFromEnv({
        AWS_MODE: ' AWS ',
        NODE_ENV: 'test',
        MEDIA_BUCKET_NAME: `  ${REAL_MEDIA_BUCKET}  `,
      }),
    ).toEqual(AWS_RESOURCE_NAMES_WITH_REAL_MEDIA_BUCKET);
  });

  it('resuelve el override recortado desde ConfigService', () => {
    const config = buildConfigService({
      AWS_MODE: 'aws',
      NODE_ENV: 'test',
      MEDIA_BUCKET_NAME: `  ${REAL_MEDIA_BUCKET}  `,
    });

    expect(resolveResourceNamesFromConfigService(config)).toEqual(
      AWS_RESOURCE_NAMES_WITH_REAL_MEDIA_BUCKET,
    );
  });

  it('expone el override mediante el provider AWS_RESOURCE_NAMES', async () => {
    const config = buildConfigService({
      AWS_MODE: 'aws',
      MEDIA_BUCKET_NAME: REAL_MEDIA_BUCKET,
    });
    const moduleRef = await Test.createTestingModule({
      imports: [AwsModule],
    })
      .overrideProvider(ConfigService)
      .useValue(config)
      .compile();

    expect(
      moduleRef.get<AwsResourceNames>(AWS_RESOURCE_NAMES).mediaBucket,
    ).toBe(REAL_MEDIA_BUCKET);

    await moduleRef.close();
  });
});

describe('R2: modo aws sin MEDIA_BUCKET_NAME aborta', () => {
  it.each([undefined, '', '  '])(
    'rechaza %p desde process.env',
    (mediaBucketName) => {
      expect(() =>
        resolveResourceNamesFromEnv({
          AWS_MODE: 'aws',
          MEDIA_BUCKET_NAME: mediaBucketName,
        }),
      ).toThrow(MissingMediaBucketNameError);
    },
  );

  it.each([undefined, '', '  '])(
    'rechaza %p desde ConfigService',
    (mediaBucketName) => {
      const config = buildConfigService({
        AWS_MODE: 'aws',
        MEDIA_BUCKET_NAME: mediaBucketName,
      });

      expect(() => resolveResourceNamesFromConfigService(config)).toThrow(
        MissingMediaBucketNameError,
      );
    },
  );

  it('explica cómo obtener el bucket real y por qué aborta', () => {
    const error = new MissingMediaBucketNameError();

    expect(error.name).toBe('MissingMediaBucketNameError');
    expect(error.message).toContain('AWS_MODE=aws');
    expect(error.message).toContain('MEDIA_BUCKET_NAME');
    expect(error.message).toContain('pet-tracker-media-dev-<accountId>');
    expect(error.message).toContain('aws s3 ls | grep pet-tracker-media');
    expect(error.message).toContain('pet-tracker-media-local');
    expect(error.message).toContain('docs/verification.md');
  });

  it('aborta el bootstrap del provider AWS_RESOURCE_NAMES', async () => {
    const config = buildConfigService({ AWS_MODE: 'aws' });

    await expect(
      Test.createTestingModule({ imports: [AwsModule] })
        .overrideProvider(ConfigService)
        .useValue(config)
        .compile(),
    ).rejects.toThrow(MissingMediaBucketNameError);
  });
});

describe('R3: modo aws rechaza el nombre del bucket local', () => {
  it.each(['pet-tracker-media-local', '  pet-tracker-media-local-test  '])(
    'rechaza %p desde process.env',
    (mediaBucketName) => {
      expect(() =>
        resolveResourceNamesFromEnv({
          AWS_MODE: 'aws',
          MEDIA_BUCKET_NAME: mediaBucketName,
        }),
      ).toThrow(LocalMediaBucketNameError);
    },
  );

  it.each(['pet-tracker-media-local', '  pet-tracker-media-local-test  '])(
    'rechaza %p desde ConfigService',
    (mediaBucketName) => {
      const config = buildConfigService({
        AWS_MODE: 'aws',
        MEDIA_BUCKET_NAME: mediaBucketName,
      });

      expect(() => resolveResourceNamesFromConfigService(config)).toThrow(
        LocalMediaBucketNameError,
      );
    },
  );

  it('acepta un nombre real desde ambos resolvers', () => {
    expect(() =>
      resolveResourceNamesFromEnv({
        AWS_MODE: 'aws',
        MEDIA_BUCKET_NAME: REAL_MEDIA_BUCKET,
      }),
    ).not.toThrow();
    expect(() =>
      resolveResourceNamesFromConfigService(
        buildConfigService({
          AWS_MODE: 'aws',
          MEDIA_BUCKET_NAME: REAL_MEDIA_BUCKET,
        }),
      ),
    ).not.toThrow();
  });

  it('explica el riesgo del namespace global de S3', () => {
    const error = new LocalMediaBucketNameError();

    expect(error.name).toBe('LocalMediaBucketNameError');
    expect(error.message).toContain('AWS_MODE=aws');
    expect(error.message).toContain('MEDIA_BUCKET_NAME');
    expect(error.message).toContain('pet-tracker-media-local');
    expect(error.message).toContain('namespace global');
    expect(error.message).toContain('bucket ajeno');
  });
});
