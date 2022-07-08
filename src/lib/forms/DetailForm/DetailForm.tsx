import React from 'react';
import { coreComponent, ICoreState } from '../../common/coreComponent';
import { IFormProps } from './IFormProps';
import { ListFormService } from '../../services/ListFormService';
import { IFieldConfiguration } from '../../controls/IFieldConfiguration';
import { ControlMode, DisplayType, Permission } from 'nuudel-utils';
import { Navigation } from 'react-native-navigation';
import RNFormField, {
  IRNFormFieldProps,
} from '../../controls/formFields/RNFormField';
import { I8, t } from '../../loc/i18n';
import {
  setFields,
  changeProp,
  addField,
  getValue,
} from '../../redux/actions/fields';
import { getFieldByName } from '../../redux/selector';
import { Provider } from 'react-redux';
import {
  Text,
  Button,
  Spinner,
  Label,
  Container,
  Form,
  Toast,
  ActionSheet,
} from '../../components';
import { onError } from '../../common/helper';
import { Alert, View, Dimensions, Keyboard } from 'react-native';
import { getRegex } from './regex';
import { COLORS, SIZES } from '../../theme';

export interface IFormState extends ICoreState {
  loading: boolean;
  showActionSheet?: boolean;
}
const { width, height } = Dimensions.get('window');
/*************************************************************************************
 * React Component to render a React native form.
 * The list form can be configured to be either a new form for adding a new list item,
 * an edit form for changing an existing list item or a display form for showing the
 * fields of an existing list item.
 * In design mode the fields to render can be moved, added and deleted.
 *************************************************************************************/
export class DetailForm extends coreComponent<IFormProps, IFormState> {
  /*
  ObjectId
   */
  protected navigationEventListener: any = undefined;
  constructor(props: IFormProps) {
    super(props);
    // set initial state
    this.state = {
      title: '',
      loading: false,
      isLoadingSchema: false,
      isLoadingData: false,
      fieldsSchema: [],
      isSaving: false,
      data: {},
      originalData: {},
      fieldErrors: {},
      showActionSheet: false,
    };
    this.navigationEventListener = Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  static defaultProps = {
    permission: Permission.Remove,
    hasStore: true,
  };

  //@override
  protected childState = (state: any): void => {
    if (this._mounted) {
      this.setState({ ...state });
    }
  };
  //@override
  protected getChildState = (name: string): any => {
    if (!this._mounted) {
      return undefined;
    }
    return this.state[name];
  };

  protected dialogDelete = () => {
    Alert.alert(
      t('Delete'),
      t('AreYouSureToRemove'),
      [
        {
          text: t('No'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('Yes'),
          onPress: async () => {
            this.childState({ loading: true });
            try {
              await this.props.lfs.deleteItem(
                this.props.listname,
                this.props.id
              );
            } catch {}
            this.setState({ loading: false });
            this.props.onCancel
              ? this.props.onCancel(this.props.componentId)
              : null;
            this.handlePopPress();
          },
        },
      ],
      { cancelable: true }
    );
  };

  navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    if (buttonId === 'done') {
      if (this._mounted && !this.state.isSaving) {
        this.setState({ isSaving: true }, () => this.saveItem());
      }
    } else if (buttonId === 'cancel') {
      this.props.onCancel
        ? this.props.onCancel(this.props.componentId)
        : this.handlePopPress();
    } else if (buttonId === 'edit') {
      this.handleEditFormScreen();
    } else if (buttonId === 'more' && this._mounted) {
      this.setState({ showActionSheet: true });
    } else if (buttonId === 'generate') {
      (this.props.lfs as ListFormService).generateData(this.props.listname);
    }
  }

  public render(): React.ReactElement<IFormProps> {
    return (
      <Provider store={this._store}>
        {this.state.loading && <Spinner />}
        <Container
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <Toast ref={(ref: any) => (this._ref.current = ref)} />
          <ActionSheet
            show={this.state.showActionSheet}
            list={[
              {
                title: t('Edit'),
                containerStyle: this.props.actionSheetStyle,
                onPress: () => {
                  this.setState({ showActionSheet: false }, () => {
                    if (this.props.permission < 3) {
                      return;
                    }
                    this.handleEditFormScreen();
                  });
                },
              },
              {
                title: t('RemoveItem'),
                containerStyle: this.props.actionSheetStyle,
                onPress: () => {
                  this.setState({ showActionSheet: false }, () => {
                    if (this.props.permission !== Permission.Remove) {
                      return;
                    }
                    this.dialogDelete();
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
          {this.state.isLoadingSchema || this.state.isLoadingData ? (
            <View
              style={{
                minHeight: (height + width) / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner
                overflowHide
                style={{ padding: SIZES.PADDING_SMALL }}
                color={COLORS.LOADER}
              />
              <Label style={{ color: COLORS.PLACEHOLDER, fontSize: SIZES.BIG }}>
                {t('LoadingFormIndicator')}
              </Label>
            </View>
          ) : (
            this.state.fieldsSchema && (
              <View>
                {this.props.children}
                <Form>{this.renderFields()}</Form>
                {this.props.formType === ControlMode.Edit &&
                  this.props.permission === Permission.Remove && (
                    <Button
                      containerStyle={{ margin: SIZES.PADDING_HALF }}
                      style={{
                        backgroundColor: COLORS.DANGER,
                      }}
                      disabled={false}
                      onPress={this.dialogDelete}
                    >
                      {t('DeleteButtonText')}
                    </Button>
                  )}
              </View>
            )
          )}
        </Container>
      </Provider>
    );
  }

  protected _ref: any = React.createRef<Toast>();
  private showToast(
    text: string,
    type: string = 'info',
    duration: number = 5000,
    onClose?: Function
  ) {
    if (text && this._ref && this._ref.current) {
      this._ref.current.show(text, type, 'top', duration, onClose);
    }
  }

  protected renderFields() {
    const { fieldsSchema, data, fieldErrors } = this.state;
    const fields = this.getFields();
    const fld = this._store.getState().fields;
    if (Object.keys(fld).length <= 1) {
      this._store.dispatch(
        setFields(
          this.initialStore(this.defaultFields, fields, data, this.props)
        )
      );
    }
    return fields && fields.length > 0 ? (
      fields.map((field, idx: number) => {
        const fieldSchemas = fieldsSchema.filter(
          (f) => f.InternalName === field.fieldName
        );

        if (fieldSchemas.length > 0) {
          const fieldSchema = fieldSchemas[0];
          const value = data[field.fieldName];
          const errorMessage = fieldErrors[field.fieldName];
          const langTag = I8.language.split('-')[0];
          let label =
            !!fieldSchema.JsonOption &&
            fieldSchema.JsonOption.hasOwnProperty(langTag) &&
            !!fieldSchema.JsonOption.langTag
              ? fieldSchema.JsonOption[langTag]
              : t(
                  this.props.listname.toLowerCase() +
                    '.' +
                    fieldSchema.InternalName,
                  {
                    defaultValue: fieldSchema.Title,
                  }
                );
          if (typeof label === 'object') {
            label = fieldSchema.Title;
          }
          const fieldProps: IRNFormFieldProps = {
            fieldSchema: fieldSchema,
            label: label,
            client: this.props.client,
            listname: this.props.listname,
            id: this.props.id,
            key: field.key,
            controlMode: this.props.formType,
            displaytype: getFieldByName(this._store.getState(), field.fieldName)
              .type,
            value: value,
            errorMessage: errorMessage,
            hideIfFieldUnsupported: !this.props.showUnsupportedFields,
            valueChanged: (val) => this.valueChanged(field.fieldName, val),
          };
          const fieldComponent = RNFormField(
            this.customInit(field.fieldName, fieldProps)
          );

          return fieldComponent;
        } else {
          return null;
        }
      })
    ) : (
      <Text style={{ textAlign: 'center', color: COLORS.PLACEHOLDER }}>
        {t('NoFieldsAvailable')}
      </Text>
    );
  }

  // @override
  protected customInit(fieldName: string, fldProps: IRNFormFieldProps) {
    fldProps = super.customInit(fieldName, fldProps);
    switch (fieldName) {
      case '_id':
        break;
      default:
        break;
    }
    return fldProps;
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.readSchema(this.props.listname, this.props.formType).then(() =>
      this.readData(this.props.listname, this.props.formType, this.props.id)
    );
  }

  componentDidUpdate(prevProps: IFormProps): void {
    const Id =
      !!this.props.id && this.props.id !== prevProps.id
        ? this.props.id
        : prevProps.id;

    if (
      this.props.listname !== prevProps.listname ||
      this.props.formType !== prevProps.formType
    ) {
      this.readSchema(this.props.listname, this.props.formType).then(() =>
        this.readData(this.props.listname, this.props.formType, Id)
      );
    } else if (
      this.props.id !== prevProps.id ||
      (typeof this.props.reload !== 'undefined' &&
        typeof prevProps.reload !== 'undefined' &&
        prevProps.reload < this.props.reload)
    ) {
      this.readData(prevProps.listname, prevProps.formType, Id);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // Not mandatory
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
    if (this._ref?.current) {
      this._ref.current.close();
    }
  }

  protected readSchema = async (
    listname: string,
    formType: ControlMode
  ): Promise<void> => {
    if (!this._mounted) {
      return;
    }
    try {
      if (!listname) {
        this.setState({
          isLoadingSchema: false,
          isLoadingData: false,
          fieldsSchema: [],
        });
        this.showToast(t('ConfigureListMessage'), 'danger');
        return;
      }
      let fieldsSchema = await this.props.lfs.getFieldSchemasForForm(
        listname,
        formType
      );
      // regex for diffrent lists
      this.defaultFields = getRegex(this.props.listname);

      // set default value in fields Schema
      let flds = this.defaultFields.filter((fld) =>
        fld.hasOwnProperty('DefaultValue')
      );
      fieldsSchema.forEach((fSch) => {
        for (let i: number = 0; i < flds.length; i++) {
          if (flds[i].field === fSch.InternalName) {
            fSch.DefaultValue = flds[i].DefaultValue;
            break;
          }
        }
      });
      this.setState({
        isLoadingSchema: false,
        isLoadingData: true,
        fieldsSchema,
      });
    } catch (error) {
      const errorText = `${t('ErrorLoadingSchema')}${listname}: ${error}`;
      this.showToast(errorText, 'danger');
      this.setState({
        isLoadingSchema: false,
        isLoadingData: false,
        fieldsSchema: [],
      });
    }
  };

  //@override
  protected readData = async (
    listname: string,
    formType: ControlMode,
    id?: number | string
  ): Promise<void> => {
    if (!this._mounted) {
      return;
    }
    const { fieldsSchema } = this.state;
    try {
      if (formType === ControlMode.New || !id) {
        const data = fieldsSchema.reduce((newData, fld) => {
          newData[fld.InternalName] = fld.DefaultValue;
          return newData;
        }, {});
        this.setState({
          data: data,
          originalData: { ...data },
          fieldErrors: {},
          isLoadingData: false,
        });
        return;
      }
      const dataObj = this.convertFromHierarchy(
        await this.props.lfs.itemById(listname, id, fieldsSchema)
      );
      // We shallow clone here, so that changing values on dataObj object fields won't be changing in originalData too
      const dataObjOriginal = { ...dataObj };
      this.setState({
        data: dataObj,
        originalData: dataObjOriginal,
        fieldErrors: {},
        isLoadingData: false,
      });
    } catch (error) {
      const errorText = `${t('ErrorLoadingData')}${id}: ${error}`;
      this.showToast(errorText, 'danger');
      this.setState({
        data: {},
        originalData: {},
        fieldErrors: {},
        isLoadingData: false,
      });
    }
  };

  //@override
  protected customActions(fieldName: string, newValue: any) {
    super.customActions(fieldName, newValue);
  }

  //@override
  protected valueChanged = (fieldName: string, newValue: any) => {
    this.customActions(fieldName, newValue);
    //console.warn(newValue);
    this.setState((prevState, props) => {
      const fld = prevState.fieldsSchema.filter(
        (item) => item.InternalName === fieldName
      );
      return {
        //...prevState,
        data: { ...prevState.data, [fieldName]: newValue },
        fieldErrors: {
          ...prevState.fieldErrors,
          [fieldName]: this.DoRegex(
            fld.length > 0 && fld[0].Required,
            newValue,
            fieldName
          ),
        },
      };
    });
  };

  protected async saveItem(): Promise<void> {
    if (this._saveButtonClicked) {
      return;
    } else {
      this._saveButtonClicked = true;
    }
    if (!this.state.isSaving) {
      this.setState({ isSaving: true });
    }
    try {
      let updatedValues = await this.PreSaveAction(
        this.state.data,
        this.state.fieldsSchema,
        this.props.id ? this.props.id : ''
      );

      let hadErrors = false;
      let errorText = t('FieldsErrorOnSaving');
      if (updatedValues.length === 0) {
        try {
          if (!this.props.id) {
            updatedValues = await this.props.lfs.createItem(
              this.props.listname,
              this.state.data,
              this.state.fieldsSchema
            );
          } else {
            updatedValues = await this.props.lfs.updateItem(
              this.props.listname,
              this.props.id,
              this.state.data,
              this.state.originalData,
              this.state.fieldsSchema
            );
          }
        } catch (err) {
          hadErrors = true;
          errorText = onError(err) || t('FieldsErrorOnSaving');
        }
      }

      let dataReloadNeeded = false;
      const newState: IFormState = { ...this.state, fieldErrors: {} };

      if (updatedValues instanceof Array) {
        updatedValues
          .filter((fieldVal) => fieldVal.HasException)
          .forEach((element) => {
            newState.fieldErrors[element.FieldName] = element.ErrorMessage;
            hadErrors = true;
          });
      } else if (typeof updatedValues === 'string') {
        newState.fieldErrors['_id'] = updatedValues;
        hadErrors = true;
      }
      if (hadErrors) {
        if (this.props.onSubmitFailed) {
          this.props.onSubmitFailed(newState.fieldErrors);
        } else {
          this.showToast(errorText, 'danger');
        }
      } else {
        let id = !!this.props.id ? this.props.id : 0;
        if (id === 0 && typeof updatedValues === 'object') {
          id =
            Object.keys(updatedValues).filter((key) => key === '_id').length > 0
              ? updatedValues._id
              : 0;
        }
        newState.data = this.convertFromHierarchy(updatedValues);
        // we shallow clone here, so that changing values on state.data won't be changing in state.originalData too
        newState.originalData = { ...newState.data };
        await this.saveBefore(id, newState.data, this.state.originalData);
        if (this.props.onSubmitSucceeded) {
          this.props.onSubmitSucceeded(id + '|' + this.props.componentId);
        }
        Keyboard.dismiss();
        this.showToast(t('ItemSavedSuccessfully'), 'success', 2000, () => {
          Navigation.pop(this.props.componentId).catch(() => {
            Navigation.dismissModal(this.props.componentId);
          });
        });
        dataReloadNeeded = true;
      }
      newState.isSaving = false;
      this.setState(newState);

      if (dataReloadNeeded) {
        this.readData(this.props.listname, this.props.formType, this.props.id);
      }
    } catch (error) {
      this.showToast(t('ErrorOnSavingListItem') + error, 'danger');
    }
    this._saveButtonClicked = false;
  }

  public getFields(): IFieldConfiguration[] {
    const { fieldsSchema } = this.state;
    let fields: any = this.props.fields;
    if (!fields && fieldsSchema) {
      fields = fieldsSchema
        .filter((field) => !!field.FieldType)
        .map((field) => ({
          key: field.InternalName,
          title: field.Title,
          fieldName: field.InternalName,
        }));
    }
    return fields;
  }
  public onUpdateFields(newFields: IFieldConfiguration[]) {
    if (this.props.onUpdateFields) {
      this.props.onUpdateFields(newFields);
    }
  }
}

export default DetailForm;
