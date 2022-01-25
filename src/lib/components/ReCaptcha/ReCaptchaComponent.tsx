import { platform } from './constants';
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type IProps = {
  captchaDomain: string;
  onReceiveToken: (captchaToken: string) => void;
  siteKey: string;
  action: string;
};

const patchPostMessageJsCode = `(function () {
  const originalPostMessage = window.postMessage;
  const patchedPostMessage = (
    message: any,
    targetOrigin: any,
    transfer: any
  ) => {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = () =>
    String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  window.postMessage = patchedPostMessage;
})();`;

const getExecutionFunction = (siteKey: string, action: string) => {
  return `window.grecaptcha.execute('${siteKey}', { action: '${action}' }).then(
    function(args) {
      window.ReactNativeWebView.postMessage(args);
    }
  )`;
};

const getInvisibleRecaptchaContent = (siteKey: string, action: string) => {
  return `<!DOCTYPE html><html><head>
    <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
    <script>window.grecaptcha.ready(function() { ${getExecutionFunction(
      siteKey,
      action
    )} });</script>
    </head></html>`;
};

class ReCaptchaComponent extends React.PureComponent<IProps> {
  private _webViewRef: WebView | null = null;

  public refreshToken() {
    if (platform.isIOS && this._webViewRef) {
      this._webViewRef.injectJavaScript(
        getExecutionFunction(this.props.siteKey, this.props.action)
      );
    } else if (platform.isAndroid && this._webViewRef) {
      this._webViewRef.reload();
    }
  }

  render() {
    return (
      <View style={{ flex: 0.0001, width: 0, height: 0 }}>
        <WebView
          ref={(ref) => {
            this._webViewRef = ref;
          }}
          javaScriptEnabled
          originWhitelist={['*']}
          automaticallyAdjustContentInsets
          mixedContentMode={'always'}
          injectedJavaScript={patchPostMessageJsCode}
          source={{
            html: getInvisibleRecaptchaContent(
              this.props.siteKey,
              this.props.action
            ),
            baseUrl: this.props.captchaDomain,
          }}
          onMessage={(e: any) => {
            this.props.onReceiveToken(e.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}

export default ReCaptchaComponent;
