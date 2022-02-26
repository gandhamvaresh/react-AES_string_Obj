import React, { useState } from 'react';
import * as CryptoJS from 'crypto-js';

import './style.css';

export default function App() {
  // const [name, setName] = useState('');
  const [keyText, setkeyText] = useState('');
  const [codeValue, setcodeValue] = useState('');
  const [outPutValue, setoutPutvalue] = useState('');
  const [cryptoType, setcryptoType] = useState('1');

  const handleKeyChange = (event) => {
    setkeyText(event.target.value);
  };
  const handleValueChange = (event) => {
    setcodeValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let obj;
    // alert(`email: ${keyText} /n /n ${codeValue} `);
    switch (cryptoType) {
      case '1':
        obj = await encryptAES(keyText, codeValue);
        setoutPutvalue(obj);
        break;
      case '2':
        obj = await decryptAES(keyText, codeValue);
        setoutPutvalue(obj);
        break;
      case '3':
        obj = await encryptData(keyText, codeValue);
        setoutPutvalue(obj);
        break;
      case '4':
        obj = await decrypt(keyText, codeValue);
        setoutPutvalue(obj);
        break;
      default:
        // code block
        alert('something missing');
    }
    event.preventDefault();
    // let obj = decrypt(keyText, codeValue);
    // setoutPutvalue(obj);
    // alert(obj);
  };

  const decrypt = (k, msg) => {
    var key = CryptoJS.enc.Utf8.parse(k);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(msg, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };
  const encryptData = (k, msg) => {
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(k, salt, {
      keySize: keySize / 32,
      iterations: 100,
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    var result = CryptoJS.enc.Base64.stringify(
      salt.concat(iv).concat(encrypted.ciphertext)
    );

    return result;
  };

  const encryptAES = (key, msg) => {
    return CryptoJS.AES.encrypt(msg, key).toString();
  };

  /**
   * Decrypt an encrypted message
   * @param msg encrypted data in base64 format
   * @param key The secret key
   * @return The decrypted content
   */
  const decryptAES = (key, msg) => {
    const decrypted = CryptoJS.AES.decrypt(msg, key);
    if (decrypted) {
      try {
        console.log(decrypted);
        const str = decrypted.toString(CryptoJS.enc.Utf8);
        if (str.length > 0) {
          return str;
        } else {
          return 'error 1';
        }
      } catch (e) {
        return 'error 2';
      }
    }
    return 'error 3';
  };

  const handleChangeSelect = (event) => {
    setcryptoType(event.target.value);
  };

  const clearClick = (event) => {
    event.preventDefault();
    setkeyText('');
    setcodeValue('');
    setoutPutvalue('');
    event.preventDefault();
  };

  const copyClick = (event) => {
    event.preventDefault();
    let op = outPutValue;
    navigator.clipboard.writeText(op);
    // event.preventDefault();
  };

  return (
    <div>
      <h1>Hello Cryptos!</h1>
      <form onSubmit={handleSubmit}>
        <div className="select">
          {' '}
          <select
            value={cryptoType}
            onChange={handleChangeSelect}
            className="selectType"
          >
            <option value="1">CRYPTO_AES_STRING-ENCRYPTION</option>
            <option value="2">CRYPTO_AES_STRING-DECRYPTION</option>
            <option value="3">CRYPTO_AES_OBJECT-ENCRYPTION</option>
            <option value="4">CRYPTO_AES_OBJECT-DECRYPTION</option>
          </select>
        </div>
        <div>
          <label>Secret Key</label>
          <input
            placeholder="Enter Key "
            onChange={handleKeyChange}
            value={keyText}
            className="inputType"
          />

          <div>
            <label>Value</label>
            <textarea
              className="textareaType"
              placeholder="Enter encrypted value"
              onChange={handleValueChange}
              value={codeValue}
            />
          </div>
        </div>
        <div className="btns">
          <button type="submit" className="buttonType blue">
            Submit
          </button>
          <button onClick={copyClick} className="green">
            {' '}
            Copy
          </button>
          <button onClick={clearClick} className="red">
            {' '}
            Clear
          </button>
        </div>
      </form>
      <div>
        <p> {outPutValue} </p>{' '}
      </div>
    </div>
  );
}
