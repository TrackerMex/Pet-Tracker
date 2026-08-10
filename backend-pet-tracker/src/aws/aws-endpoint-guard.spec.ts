import {
  UnexpectedAwsEndpointError,
  resolveAwsConfigFromEnv,
} from './aws-clients';

describe('R1: modo aws con AWS_ENDPOINT_URL definida aborta', () => {
  it('lanza el error nombrado para un endpoint no vacío', () => {
    expect(() =>
      resolveAwsConfigFromEnv({
        AWS_MODE: 'aws',
        AWS_ENDPOINT_URL: ' http://localhost:4566 ',
      }),
    ).toThrow(UnexpectedAwsEndpointError);
  });
});
