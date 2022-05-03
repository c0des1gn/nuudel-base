import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { Button } from '../Button';
import { Toast } from '../Toast';
import Text from '../Text';
import ActionSheet from '../ActionSheet';
import { Image, View, TouchableOpacity } from 'react-native';
import { t } from '../../loc/i18n';
import { ControlMode, HOST, HttpClient } from 'nuudel-utils';
import { UI } from '../../common/UI';
import { styles } from '../../theme/styles';
import { COLORS, SIZES } from '../../theme';

export interface IImagePickerProps {
  value: any;
  disabled?: boolean;
  controlMode?: ControlMode;
  placeholder?: string;
  valueChanged(value: any);
  styleImage?: any;
  host?: string;
  actionSheetStyle?: any;
  toWidth?: number;
  toHeight?: number;
  cropping?: boolean;
}

export interface IImagePickerState {
  imgSource: any;
  singleFile: any;
  lastUpload: string;
  showActionSheet?: boolean;
}

const img_size = 600;
class ImagePickerField extends React.Component<
  IImagePickerProps,
  IImagePickerState
> {
  public constructor(props: IImagePickerProps) {
    super(props);
    this.state = {
      imgSource: props.value,
      singleFile: undefined,
      lastUpload: '',
      showActionSheet: false,
    };
  }

  static defaultProps = {
    host: HOST,
    toWidth: img_size,
    toHeight: img_size,
    cropping: true,
  };

  componentWillUnmount() {
    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {});
  }

  protected _ref: any = React.createRef<Toast>();
  private showToast(
    text: string,
    type: string = 'info',
    duration: number = 5000,
    onClose?: Function
  ) {
    if (text) {
      this._ref.current!.show(text, type, 'top', duration, onClose);
    }
  }

  uploadImage = async (fileToUpload: any, oldImage: string) => {
    //Check if any file is selected or not
    if (typeof fileToUpload !== 'undefined') {
      //If file selected then create FormData
      const data = new FormData();

      // fix filename extention on ios
      if (
        fileToUpload?.filename &&
        fileToUpload.filename.toLowerCase().endsWith('.heic')
      ) {
        fileToUpload.filename =
          fileToUpload.filename.substring(0, fileToUpload.filename.length - 4) +
          'jpg';
      }

      let filename: string =
        fileToUpload.filename ||
        (fileToUpload.sourceURL || fileToUpload.path)
          ?.split('/')
          .pop()
          .replace(/\%|\'|\,|\"|\*|\:|\<|\>|\?|\/|\\|\|/g, '');

      if (__DEV__) {
        console.log(`filename: ${filename}, `, fileToUpload);
      }

      let photo: any = {
        uri: fileToUpload.path,
        type: fileToUpload.mime,
        name: filename,
        size: fileToUpload.size,
      };
      data.append('name', filename);
      data.append('delete', oldImage);
      data.append('file', photo);
      //data.append('upload_preset', 'blb0abxs');

      //Please change file upload URL
      let res: any = undefined;

      try {
        res = await HttpClient(`${this.props.host || HOST}/upload`, {
          method: 'post',
          body: data,
          headers: {
            ...(await UI.headers()),
          },
        });
      } catch (e: any) {
        this.showToast(
          (e?.message || t('Upload failed')) + `: ${this.props.host}`,
          'danger',
          4000
        );
      }
      if (res) {
        if (__DEV__) {
          console.log('upload res: ', res);
        }
        let url: string = res.secure_url || res.url || res.data?.uri;
        let picture: any = { uri: url };
        if (res.height) {
          picture['height'] = res.height;
        }
        if (res.width) {
          picture['width'] = res.width;
        }
        this.setState({ lastUpload: url || '' });
        this.props.valueChanged(picture);
        return;
      }
    } else {
      //if no file selected the show alert
      console.log('Please Select File first');
    }
    this.props.valueChanged(this.props.value);
  };

  protected onResponse = (res: any) => {
    let source = { uri: res.path };
    if (res.width) {
      source['width'] = res.width;
    }
    if (res.height) {
      source['height'] = res.height;
    }

    // You can also display the image using data:
    // const source = { uri: `data:${res.mime};base64,` + res.data };
    this.setState(
      {
        imgSource: source,
        singleFile: res,
      },
      () => {
        const { singleFile, lastUpload } = this.state;
        this.uploadImage(singleFile, lastUpload);
      }
    );
  };

  protected onImagePicker = () => {
    this.setState({ showActionSheet: true });
  };

  protected pressRemove = async () => {
    this.setState({
      imgSource: this.props.value,
      singleFile: undefined,
    });

    if (this.props.value && this.props.value.uri) {
      const data = new FormData();
      data.append('delete', this.props.value.uri);
      try {
        let res = await HttpClient(`${this.props.host || HOST}/remove`, {
          method: 'post',
          body: data,
          headers: {
            ...(await UI.headers()),
          },
        });
      } catch (e: any) {}
    }
  };

  public render() {
    return (
      <View style={styles.picture}>
        <Toast ref={(ref: any) => (this._ref.current = ref)} />
        <ActionSheet
          show={this.state.showActionSheet}
          //title={t('SelectImage')}
          list={[
            {
              title: t('TakePhoto'),
              containerStyle: this.props.actionSheetStyle,
              onPress: () => {
                this.setState({ showActionSheet: false }, () => {
                  setTimeout(() => {
                    ImagePicker.openCamera({
                      width: this.props.toWidth || img_size,
                      height: this.props.toHeight || img_size,
                      forceJpg: true,
                      cropping: this.props.cropping !== false,
                    })
                      .then((r) => this.onResponse(r))
                      .catch((e) => {});
                  }, 600);
                });
              },
            },
            {
              title: t('ChooseFromLibrary'),
              containerStyle: this.props.actionSheetStyle,
              onPress: () => {
                this.setState({ showActionSheet: false }, () => {
                  setTimeout(() => {
                    ImagePicker.openPicker({
                      width: this.props.toWidth || img_size,
                      height: this.props.toHeight || img_size,
                      forceJpg: true,
                      cropping: this.props.cropping !== false,
                      waitAnimationEnd: true,
                      multiple: false,
                      mediaType: 'photo',
                      compressImageQuality: 0.8,
                      cropperActiveWidgetColor: COLORS.PRIMARY,
                      smartAlbums: ['UserLibrary', 'PhotoStream', 'Bursts'],
                      includeBase64: false,
                    })
                      .then((r) => this.onResponse(r))
                      .catch((e) => {
                        console.log('Error', e);
                      });
                  }, 600);
                });
              },
            },
            {
              title: t('Cancel'),
              containerStyle: { backgroundColor: COLORS.DANGER },
              titleStyle: { color: '#fff' },
              onPress: () => this.setState({ showActionSheet: false }),
            },
          ]}
        />
        {!this.props.disabled && (
          <Button
            containerStyle={styles.containerButton}
            style={styles.button}
            disabled={this.props.disabled === true}
            onPress={this.onImagePicker}
          >
            {t('ImageButtonText')}
          </Button>
        )}
        {!!this.state.imgSource.uri ? (
          <TouchableOpacity style={{ flex: 1 }} onLongPress={this.pressRemove}>
            <Image
              source={this.state.imgSource}
              style={[styles.image, this.props.styleImage]}
              resizeMode="contain"
              resizeMethod="auto"
            />
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              styles.text,
              !this.props.placeholder && { display: 'none' },
            ]}
          >
            {this.props.placeholder}
          </Text>
        )}
      </View>
    );
  }
}

export default ImagePickerField;
