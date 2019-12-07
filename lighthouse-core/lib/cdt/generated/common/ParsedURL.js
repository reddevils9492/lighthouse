// @ts-nocheck
// generated by build-cdt-lib.js
const Common = require('../../Common.js')
"use strict";
/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY GOOGLE INC. AND ITS CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GOOGLE INC.
 * OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
exports.__esModule = true;
/**
 * @unrestricted
 */
var ParsedURL = /** @class */ (function () {
    /**
     * @param {string} url
     */
    function ParsedURL(url) {
        this.isValid = false;
        this.url = url;
        this.scheme = '';
        this.user = '';
        this.host = '';
        this.port = '';
        this.path = '';
        this.queryParams = '';
        this.fragment = '';
        this.folderPathComponents = '';
        this.lastPathComponent = '';
        var isBlobUrl = this.url.startsWith('blob:');
        var urlToMatch = isBlobUrl ? url.substring(5) : url;
        var match = urlToMatch.match(ParsedURL._urlRegex());
        if (match) {
            this.isValid = true;
            if (isBlobUrl) {
                this._blobInnerScheme = match[2].toLowerCase();
                this.scheme = 'blob';
            }
            else {
                this.scheme = match[2].toLowerCase();
            }
            this.user = match[3];
            this.host = match[4];
            this.port = match[5];
            this.path = match[6] || '/';
            this.queryParams = match[7] || '';
            this.fragment = match[8];
        }
        else {
            if (this.url.startsWith('data:')) {
                this.scheme = 'data';
                return;
            }
            if (this.url.startsWith('blob:')) {
                this.scheme = 'blob';
                return;
            }
            if (this.url === 'about:blank') {
                this.scheme = 'about';
                return;
            }
            this.path = this.url;
        }
        var lastSlashIndex = this.path.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            this.folderPathComponents = this.path.substring(0, lastSlashIndex);
            this.lastPathComponent = this.path.substring(lastSlashIndex + 1);
        }
        else {
            this.lastPathComponent = this.path;
        }
    }
    /**
     * @param {string} fileSystemPath
     * @return {string}
     */
    ParsedURL.platformPathToURL = function (fileSystemPath) {
        fileSystemPath = fileSystemPath.replace(/\\/g, '/');
        if (!fileSystemPath.startsWith('file://')) {
            if (fileSystemPath.startsWith('/')) {
                fileSystemPath = 'file://' + fileSystemPath;
            }
            else {
                fileSystemPath = 'file:///' + fileSystemPath;
            }
        }
        return fileSystemPath;
    };
    /**
     * @param {string} fileURL
     * @param {boolean} isWindows
     * @return {string}
     */
    ParsedURL.urlToPlatformPath = function (fileURL, isWindows) {
        console.assert(fileURL.startsWith('file://'), 'This must be a file URL.');
        if (isWindows) {
            return fileURL.substr('file:///'.length).replace(/\//g, '\\');
        }
        return fileURL.substr('file://'.length);
    };
    /**
     * @param {string} url
     * @return {string}
     */
    ParsedURL.urlWithoutHash = function (url) {
        var hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            return url.substr(0, hashIndex);
        }
        return url;
    };
    /**
     * @return {!RegExp}
     */
    ParsedURL._urlRegex = function () {
        if (ParsedURL._urlRegexInstance) {
            return ParsedURL._urlRegexInstance;
        }
        // RegExp groups:
        // 1 - scheme, hostname, ?port
        // 2 - scheme (using the RFC3986 grammar)
        // 3 - ?user:password
        // 4 - hostname
        // 5 - ?port
        // 6 - ?path
        // 7 - ?query
        // 8 - ?fragment
        var schemeRegex = /([A-Za-z][A-Za-z0-9+.-]*):\/\//;
        var userRegex = /(?:([A-Za-z0-9\-._~%!$&'()*+,;=:]*)@)?/;
        var hostRegex = /((?:\[::\d?\])|(?:[^\s\/:]*))/;
        var portRegex = /(?::([\d]+))?/;
        var pathRegex = /(\/[^#?]*)?/;
        var queryRegex = /(?:\?([^#]*))?/;
        var fragmentRegex = /(?:#(.*))?/;
        ParsedURL._urlRegexInstance = new RegExp('^(' + schemeRegex.source + userRegex.source + hostRegex.source + portRegex.source + ')' + pathRegex.source +
            queryRegex.source + fragmentRegex.source + '$');
        return ParsedURL._urlRegexInstance;
    };
    /**
     * @param {string} url
     * @return {string}
     */
    ParsedURL.extractPath = function (url) {
        var parsedURL = url.asParsedURL();
        return parsedURL ? parsedURL.path : '';
    };
    /**
     * @param {string} url
     * @return {string}
     */
    ParsedURL.extractOrigin = function (url) {
        var parsedURL = url.asParsedURL();
        return parsedURL ? parsedURL.securityOrigin() : '';
    };
    /**
     * @param {string} url
     * @return {string}
     */
    ParsedURL.extractExtension = function (url) {
        url = ParsedURL.urlWithoutHash(url);
        var indexOfQuestionMark = url.indexOf('?');
        if (indexOfQuestionMark !== -1) {
            url = url.substr(0, indexOfQuestionMark);
        }
        var lastIndexOfSlash = url.lastIndexOf('/');
        if (lastIndexOfSlash !== -1) {
            url = url.substr(lastIndexOfSlash + 1);
        }
        var lastIndexOfDot = url.lastIndexOf('.');
        if (lastIndexOfDot !== -1) {
            url = url.substr(lastIndexOfDot + 1);
            var lastIndexOfPercent = url.indexOf('%');
            if (lastIndexOfPercent !== -1) {
                return url.substr(0, lastIndexOfPercent);
            }
            return url;
        }
        return '';
    };
    /**
     * @param {string} url
     * @return {string}
     */
    ParsedURL.extractName = function (url) {
        var index = url.lastIndexOf('/');
        var pathAndQuery = index !== -1 ? url.substr(index + 1) : url;
        index = pathAndQuery.indexOf('?');
        return index < 0 ? pathAndQuery : pathAndQuery.substr(0, index);
    };
    /**
     * @param {string} baseURL
     * @param {string} href
     * @return {?string}
     */
    ParsedURL.completeURL = function (baseURL, href) {
        // Return special URLs as-is.
        var trimmedHref = href.trim();
        if (trimmedHref.startsWith('data:') || trimmedHref.startsWith('blob:') || trimmedHref.startsWith('javascript:') ||
            trimmedHref.startsWith('mailto:')) {
            return href;
        }
        // Return absolute URLs as-is.
        var parsedHref = trimmedHref.asParsedURL();
        if (parsedHref && parsedHref.scheme) {
            return trimmedHref;
        }
        var parsedURL = baseURL.asParsedURL();
        if (!parsedURL) {
            return null;
        }
        if (parsedURL.isDataURL()) {
            return href;
        }
        if (href.length > 1 && href.charAt(0) === '/' && href.charAt(1) === '/') {
            // href starts with "//" which is a full URL with the protocol dropped (use the baseURL protocol).
            return parsedURL.scheme + ':' + href;
        }
        var securityOrigin = parsedURL.securityOrigin();
        var pathText = parsedURL.path;
        var queryText = parsedURL.queryParams ? '?' + parsedURL.queryParams : '';
        // Empty href resolves to a URL without fragment.
        if (!href.length) {
            return securityOrigin + pathText + queryText;
        }
        if (href.charAt(0) === '#') {
            return securityOrigin + pathText + queryText + href;
        }
        if (href.charAt(0) === '?') {
            return securityOrigin + pathText + href;
        }
        var hrefPath = href.match(/^[^#?]*/)[0];
        var hrefSuffix = href.substring(hrefPath.length);
        if (hrefPath.charAt(0) !== '/') {
            hrefPath = parsedURL.folderPathComponents + '/' + hrefPath;
        }
        return securityOrigin + Root.Runtime.normalizePath(hrefPath) + hrefSuffix;
    };
    /**
     * @param {string} string
     * @return {!{url: string, lineNumber: (number|undefined), columnNumber: (number|undefined)}}
     */
    ParsedURL.splitLineAndColumn = function (string) {
        // Only look for line and column numbers in the path to avoid matching port numbers.
        var beforePathMatch = string.match(ParsedURL._urlRegex());
        var beforePath = '';
        var pathAndAfter = string;
        if (beforePathMatch) {
            beforePath = beforePathMatch[1];
            pathAndAfter = string.substring(beforePathMatch[1].length);
        }
        var lineColumnRegEx = /(?::(\d+))?(?::(\d+))?$/;
        var lineColumnMatch = lineColumnRegEx.exec(pathAndAfter);
        var lineNumber;
        var columnNumber;
        console.assert(lineColumnMatch);
        if (typeof (lineColumnMatch[1]) === 'string') {
            lineNumber = parseInt(lineColumnMatch[1], 10);
            // Immediately convert line and column to 0-based numbers.
            lineNumber = isNaN(lineNumber) ? undefined : lineNumber - 1;
        }
        if (typeof (lineColumnMatch[2]) === 'string') {
            columnNumber = parseInt(lineColumnMatch[2], 10);
            columnNumber = isNaN(columnNumber) ? undefined : columnNumber - 1;
        }
        return {
            url: beforePath + pathAndAfter.substring(0, pathAndAfter.length - lineColumnMatch[0].length),
            lineNumber: lineNumber,
            columnNumber: columnNumber
        };
    };
    /**
     * @param {string} url
     * @return {boolean}
     */
    ParsedURL.isRelativeURL = function (url) {
        return !(/^[A-Za-z][A-Za-z0-9+.-]*:/.test(url));
    };
    Object.defineProperty(ParsedURL.prototype, "displayName", {
        get: function () {
            if (this._displayName) {
                return this._displayName;
            }
            if (this.isDataURL()) {
                return this.dataURLDisplayName();
            }
            if (this.isBlobURL()) {
                return this.url;
            }
            if (this.isAboutBlank()) {
                return this.url;
            }
            this._displayName = this.lastPathComponent;
            if (!this._displayName) {
                this._displayName = (this.host || '') + '/';
            }
            if (this._displayName === '/') {
                this._displayName = this.url;
            }
            return this._displayName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {string}
     */
    ParsedURL.prototype.dataURLDisplayName = function () {
        if (this._dataURLDisplayName) {
            return this._dataURLDisplayName;
        }
        if (!this.isDataURL()) {
            return '';
        }
        this._dataURLDisplayName = this.url.trimEndWithMaxLength(20);
        return this._dataURLDisplayName;
    };
    /**
     * @return {boolean}
     */
    ParsedURL.prototype.isAboutBlank = function () {
        return this.url === 'about:blank';
    };
    /**
     * @return {boolean}
     */
    ParsedURL.prototype.isDataURL = function () {
        return this.scheme === 'data';
    };
    /**
     * @return {boolean}
     */
    ParsedURL.prototype.isBlobURL = function () {
        return this.url.startsWith('blob:');
    };
    /**
     * @return {string}
     */
    ParsedURL.prototype.lastPathComponentWithFragment = function () {
        return this.lastPathComponent + (this.fragment ? '#' + this.fragment : '');
    };
    /**
     * @return {string}
     */
    ParsedURL.prototype.domain = function () {
        if (this.isDataURL()) {
            return 'data:';
        }
        return this.host + (this.port ? ':' + this.port : '');
    };
    /**
     * @return {string}
     */
    ParsedURL.prototype.securityOrigin = function () {
        if (this.isDataURL()) {
            return 'data:';
        }
        var scheme = this.isBlobURL() ? this._blobInnerScheme : this.scheme;
        return scheme + '://' + this.domain();
    };
    /**
     * @return {string}
     */
    ParsedURL.prototype.urlWithoutScheme = function () {
        if (this.scheme && this.url.startsWith(this.scheme + '://')) {
            return this.url.substring(this.scheme.length + 3);
        }
        return this.url;
    };
    return ParsedURL;
}());
exports.default = ParsedURL;
/**
 * @return {?Common.ParsedURL}
 */
String.prototype.asParsedURL = function () {
    var parsedURL = new ParsedURL(this.toString());
    if (parsedURL.isValid) {
        return parsedURL;
    }
    return null;
};