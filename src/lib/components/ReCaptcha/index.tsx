//react-native-recaptchav3
import React from 'react';
import ReCaptchaComponent from './ReCaptchaComponent';
import { CONF } from 'nuudel-utils';

export type IProps = {
  captchaDomain: string;
  onReceiveToken: (captchaToken: string) => void;
  siteKey: string;
  action: string;
};

export type IState = {};

class ReCaptcha extends React.PureComponent<IProps, IState> {
  private _captchaRef: any;

  public refreshToken = () => {
    this._captchaRef.refreshToken();
  };

  public static defaultProps = {
    captchaDomain: CONF?.base_url,
    siteKey: '6LfX3OIZAAAAAFojnUssiP5uTWy4_6GyxiwrFYKl',
    action: 'login',
  };

  render() {
    return (
      <ReCaptchaComponent
        ref={(ref) => (this._captchaRef = ref)}
        action={this.props.action}
        captchaDomain={this.props.captchaDomain}
        siteKey={this.props.siteKey}
        onReceiveToken={(token: string) => {
          this.props.onReceiveToken(token);
        }}
      />
    );
  }
}

export default ReCaptcha;
