// ImageKit upload service
// Uses client-side upload API: https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload

const IMAGEKIT_CONFIG_KEY = 'imagekit_config';

export const getImageKitConfig = () => {
    try {
        const config = localStorage.getItem(IMAGEKIT_CONFIG_KEY);
        return config ? JSON.parse(config) : { urlEndpoint: '', publicKey: '' };
    } catch {
        return { urlEndpoint: '', publicKey: '' };
    }
};

export const saveImageKitConfig = (config) => {
    localStorage.setItem(IMAGEKIT_CONFIG_KEY, JSON.stringify(config));
};

/**
 * Upload an image to ImageKit using client-side upload API
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder path in ImageKit
 * @returns {Promise<{url: string, fileId: string, name: string}>}
 */
export const uploadToImageKit = async (file, folder = '/portfolio/projects') => {
    const config = getImageKitConfig();

    if (!config.urlEndpoint || !config.publicKey) {
        throw new Error('ImageKit is not configured. Please add your URL endpoint and public key in Admin settings.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', config.publicKey);
    formData.append('fileName', `${Date.now()}_${file.name}`);
    formData.append('folder', folder);

    // For unsigned uploads, we need authentication params
    // We'll use the ImageKit upload API with signature
    // First get auth params from ImageKit server or use a simple approach

    // Using the upload endpoint directly with signature
    const authResponse = await getAuthParams(config);

    formData.append('signature', authResponse.signature);
    formData.append('expire', authResponse.expire);
    formData.append('token', authResponse.token);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        url: data.url,
        fileId: data.fileId,
        name: data.name,
        thumbnailUrl: data.thumbnailUrl || data.url
    };
};

/**
 * Get authentication parameters for ImageKit upload
 * If no auth endpoint is configured, attempt unsigned upload
 */
const getAuthParams = async (config) => {
    // Check if user has configured an auth endpoint
    const authEndpoint = config.authEndpoint;

    if (authEndpoint) {
        const response = await fetch(authEndpoint);
        if (!response.ok) throw new Error('Failed to get ImageKit auth params');
        return await response.json();
    }

    // For development/simple setup: generate client-side params
    // This requires the private key, which is less secure but works for personal portfolios
    const privateKey = config.privateKey;
    if (!privateKey) {
        throw new Error('ImageKit Private Key or Auth Endpoint is required for uploads. Please configure in Admin settings.');
    }

    // Generate auth params client-side (acceptable for personal portfolio)
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes
    const token = crypto.randomUUID();

    // Create HMAC-SHA1 signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(privateKey);
    const msgData = encoder.encode(token + expire);

    const cryptoKey = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const signatureHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return { signature: signatureHex, expire: expire.toString(), token };
};
