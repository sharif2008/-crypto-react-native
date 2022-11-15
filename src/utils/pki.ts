import * as forge from "node-forge";
import { RSA, KeyPair } from 'react-native-rsa-native';
const iCrypto = require('isomorphic-webcrypto');
import { createSign } from "node:crypto";
//var crypto = require('crypto');

const load = async () => {
    (async () => {
        // Only needed for crypto.getRandomValues
        // but only wait once, future calls are secure
        await iCrypto.ensureSecure();
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);
        const safeValue = array[0];
    })()
}
//unsupported algorithm
export const keypairWC = async () => {
    await load();
    iCrypto.ensureSecure()
        .then(() => {
            const array = new Uint8Array(1);
            crypto.getRandomValues(array);

            crypto.subtle.generateKey(
                {
                    name: "RSASSA-PKCS1-V1_5",
                    modulusLength: 2048, //can be 1024, 2048, or 4096
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: { name: "SHA-1" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
                },
                false, //whether the key is extractable (i.e. can be used in exportKey)
                ["sign", "verify"] //can be any combination of "sign" and "verify"
            )
                .then(function (key: any) {
                    //returns a keypair object
                    console.log(key);
                    console.log(key.publicKey);
                    console.log(key.privateKey);
                })
                .catch(function (err: any) {
                    console.error(err);
                });
        });
}
// undefined or null
export const keypair = () => {
    var keypair = require('keypair');
    var pair = keypair();
    console.log(pair);
}

// RAS object undefiend or null  
export const createKeyPairRSA = async () => {

    let message = "my secret message";

    RSA.generateKeys(4096) // set key size
        .then(keys => {
            console.log('4096 private:', keys.private); // the private key
            console.log('4096 public:', keys.public); // the public key
            RSA.encrypt(message, keys.public)
                .then(encodedMessage => {
                    console.log(`the encoded message is ${encodedMessage}`);
                    RSA.decrypt(encodedMessage, keys.private)
                        .then(decryptedMessage => {
                            console.log(`The original message was ${decryptedMessage}`);
                        });
                });
        });
}
export const createKeypair = (count: Number) => {

    console.log('Key generation started---' + count);

    var rsa = forge.pki.rsa;

    // generate an RSA key pair synchronously
    // *NOT RECOMMENDED*: Can be significantly slower than async and may block
    // JavaScript execution. Will use native Node.js 10.12.0+ API if possible.
    var keypair: forge.pki.KeyPair = rsa.generateKeyPair(1024);

    // generate an RSA key pair asynchronously(uses web workers if available)
    // use workers: -1 to run a fast core estimator to optimize # of workers
    // *RECOMMENDED*: Can be significantly faster than sync. Will use native
    // Node.js 10.12.0+ or WebCrypto API if possible.
    /* rsa.generateKeyPair({ bits: 2048, workers: -1 }, function (err, keypair: pki.KeyPair) {
        // keypair.privateKey, keypair.publicKey
        console.log(keypair.privateKey);
    }); */

    // generate an RSA key pair in steps that attempt to run for a specified period
    // of time on the main JS thread
    /*    var state = rsa.createKeyPairGenerationState(2048, 0x10001);
       var step = function () {
           // run for 100 ms
           if (!rsa.stepKeyPairGenerationState(state, 100)) {
               setTimeout(step, 1);
           }
           else {
               // done, turn off progress indicator, use state.keys
           }
       };
       // turn on progress indicator, schedule generation to run
       setTimeout(step); */

    // sign data with a private key and output DigestInfo DER-encoded bytes
    // (defaults to RSASSA PKCS#1 v1.5)
    var md = forge.md.sha1.create();
    md.update('sign this', 'utf8');

    let privateKey = keypair.privateKey;
    console.log(privateKey);

    let publicKey = keypair.publicKey;

    var signature = privateKey.sign(md);

    // verify data with a public key
    // (defaults to RSASSA PKCS#1 v1.5)
    var verified = publicKey.verify(md.digest().bytes(), signature);
    console.log('is verified? ' + verified);

    // sign data using RSASSA-PSS where PSS uses a SHA-1 hash, a SHA-1 based
    // masking function MGF1, and a 20 byte salt

    console.log("key generated end- ")
    let privateKeyPem = forge.pki.privateKeyToPem(privateKey);
    console.log(privateKeyPem);

    return privateKeyPem;
}
export const createCSR = () => {
    var keys = forge.pki.rsa.generateKeyPair(1024);
    let privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    console.log(privateKeyPem);
    let privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    console.log(privateKey.d);

    // create a certification request (CSR)
    var csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([{
        name: 'commonName',
        value: 'example.org'
    }, {
        name: 'countryName',
        value: 'US'
    }, {
        shortName: 'ST',
        value: 'Virginia'
    }, {
        name: 'localityName',
        value: 'Blacksburg'
    }, {
        name: 'organizationName',
        value: 'Test'
    }, {
        shortName: 'OU',
        value: 'Test'
    }]);
    // set (optional) attributes
    csr.setAttributes([{
        name: 'challengePassword',
        value: 'password'
    }, {
        name: 'unstructuredName',
        value: 'My Company, Inc.'
    }, {
        name: 'extensionRequest',
        extensions: [{
            name: 'subjectAltName',
            altNames: [{
                // 2 is DNS type
                type: 2,
                value: 'test.domain.com'
            }, {
                type: 2,
                value: 'other.domain.com',
            }, {
                type: 2,
                value: 'www.domain.net'
            }]
        }]
    }]);

    // sign certification request
    csr.sign(keys.privateKey);

    // verify certification request
    var verified = csr.verify();

    // convert certification request to PEM-format
    var pem = forge.pki.certificationRequestToPem(csr);

    // convert a Forge certification request from PEM-format
    var csr = forge.pki.certificationRequestFromPem(pem);
    console.log(pem);
}
