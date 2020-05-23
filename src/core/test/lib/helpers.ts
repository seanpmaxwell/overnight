import {assert} from 'chai';
import * as request from 'request';
import * as requestPromise from 'request-promise';

import {HttpVerb} from '../../lib/decorators/types';

export let port: number = 3000;

interface IStatusAndBody {
    body: any;
    status: number;
}

export async function assertRequest(path: string, method: HttpVerb, expected: Object): Promise<void> {
    let response: IStatusAndBody;
    try {
        response = await testRequest(path, method);
    } catch (e) {
        assert.fail(`Threw error making request to and parsing body from ${method.toUpperCase()} ${path}.`);
    }
    assert.deepEqual<Object>(
        // @ts-ignore
        response, // Guaranteed to be initialized because assert.fail(...) always throws an error
        expected,
        `${method.toUpperCase()} ${path} returned unexpected response.`,
    );
}

export async function testRequest(path: string, method: HttpVerb): Promise<IStatusAndBody> {
    if (path.charAt(0) !== '/') {
        throw new Error('Path must begin with a \'/\'');
    }
    const response: request.Response = await requestPromise({
        method,
        proxy: null,
        resolveWithFullResponse: true,
        simple: false,
        timeout: 1000,
        uri: `http://localhost:${port}${path}`,
    });
    return {
        body: (response.body && response.body !== '') ? JSON.parse(response.body) : null,
        status: response.statusCode,
    };
}
