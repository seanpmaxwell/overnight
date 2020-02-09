import {assert} from 'chai';
import 'reflect-metadata';

import {addToMetadata} from './reflect-helpers';

describe('Reflect Helpers', () => {
    describe('addToMetadata', () => {
        it('should add key-values to metadata and leave other key-values unaffected', async () => {
            const obj: Object = {};
            Reflect.defineMetadata('key1', {key1: 'key1'}, obj);
            Reflect.defineMetadata('key2', {key2: 'key2'}, obj);
            Reflect.defineMetadata('key3', {key3: 'key3'}, obj);
            addToMetadata(obj, 'key2', {added: 'added'});
            assert.deepEqual(Reflect.getMetadata('key1', obj), {key1: 'key1'});
            assert.deepEqual(Reflect.getMetadata('key2', obj), {key2: 'key2', added: 'added'});
            assert.deepEqual(Reflect.getMetadata('key3', obj), {key3: 'key3'});
        });

        it('should create metadata if undefined', async () => {
            const obj: Object = {};
            Reflect.defineMetadata('key1', undefined, obj);
            addToMetadata(obj, 'key1', {added: 'added'});
            assert.deepEqual(Reflect.getMetadata('key1', obj), {added: 'added'});
        });
    });
});
