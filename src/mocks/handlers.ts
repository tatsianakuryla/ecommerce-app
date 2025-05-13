import { DefaultBodyType, http, HttpResponse, StrictRequest } from 'msw';
import fixture from '~fixtures/fixture.json';
import { USER_AUTH_URL } from '~/constants/url';

const checkCredentials = async (request: StrictRequest<DefaultBodyType>) => {
  localStorage.removeItem('access_token');

  const text = await request.text();
  const params = new URLSearchParams(text);

  const username = params.get('username');
  const password = params.get('password');

  if ((username && username !== fixture.correctUsername) || !username) {
    throw HttpResponse.json(fixture.mockResponses.wrongCredentials, {
      status: 400,
    });
  }

  if (password && password !== fixture.correctPassword) {
    throw HttpResponse.json(fixture.mockResponses.wrongCredentials, {
      status: 400,
    });
  }

  if (!password) {
    throw HttpResponse.json(fixture.mockResponses.emptyPassword, {
      status: 400,
    });
  }
};

export const handlers = [
  http.post(USER_AUTH_URL, async ({ request }) => {
    await checkCredentials(request);

    localStorage.setItem(
      'access_token',
      fixture.mockResponses.successAuth.access_token,
    );
    return HttpResponse.json(fixture.mockResponses.successAuth, {
      status: 200,
    });
  }),
];
