/**
 * Helpers for decorators
 *
 * created by Joey Kilpatrick 2/6/2020
 */

export function addToMetadata(target: Object, metadataKey: any, additionalMetadata: {}) {
    let metadata = Reflect.getOwnMetadata(metadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    metadata = {
        ...additionalMetadata,
        ...metadata,
    };
    Reflect.defineMetadata(metadataKey, metadata, target);
}